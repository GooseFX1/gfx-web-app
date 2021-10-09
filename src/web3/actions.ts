import { BN } from '@project-serum/anchor'
import { Market, OpenOrders } from '@project-serum/serum'
import { Order } from '@project-serum/serum/lib/market'
import { TOKEN_PROGRAM_ID, WRAPPED_SOL_MINT } from '@project-serum/serum/lib/token-instructions'
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token } from '@solana/spl-token'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { Connection, PublicKey, Transaction, TransactionSignature } from '@solana/web3.js'
import { computePoolsPDAs, findAssociatedTokenAddress, getLPProgram, signAndSendRawTransaction } from './utils'
import { IOrder, ISwapToken } from '../context'

const createAssociatedTokenAccountIx = (mint: PublicKey, associatedAccount: PublicKey, owner: PublicKey) =>
  Token.createAssociatedTokenAccountInstruction(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    mint,
    associatedAccount,
    owner,
    owner
  )

export const cancelCryptoOrder = async (connection: Connection, market: Market, order: Order, wallet: any) => {
  if (!wallet.publicKey) return

  const tx = new Transaction()

  tx.add(market.makeMatchOrdersTransaction(5))
  tx.add(await market.makeCancelOrderTransaction(connection, wallet.publicKey, order))
  tx.add(market.makeMatchOrdersTransaction(5))

  return await signAndSendRawTransaction(connection, tx, wallet)
}

export const placeCryptoOrder = async (connection: Connection, market: Market, order: IOrder, wallet: any) => {
  if (!wallet.publicKey) return

  const tx = new Transaction()

  const mint = order.side === 'buy' ? market.quoteMintAddress : market.baseMintAddress
  const payer = mint.equals(WRAPPED_SOL_MINT)
    ? wallet.publicKey
    : await findAssociatedTokenAddress(wallet.publicKey, mint)

  const receiverMint = order.side === 'buy' ? market.baseMintAddress : market.quoteMintAddress
  const receiverATA = await findAssociatedTokenAddress(wallet.publicKey, receiverMint)

  const { value } = await connection.getParsedAccountInfo(receiverATA)
  if (!value) {
    tx.add(createAssociatedTokenAccountIx(receiverMint, receiverATA, wallet.publicKey))
  }

  tx.add(market.makeMatchOrdersTransaction(5))

  const { transaction, signers } = await market.makePlaceOrderTransaction(connection, {
    owner: wallet.publicKey,
    payer,
    side: order.side,
    price: order.price,
    size: order.size,
    orderType: order.type
  })
  tx.add(transaction)
  tx.add(market.makeMatchOrdersTransaction(5))

  return await signAndSendRawTransaction(connection, tx, wallet, ...signers)
}

export const settleCryptoFunds = async (
  connection: Connection,
  market: Market,
  openOrders: OpenOrders,
  wallet: any
) => {
  if (!wallet.publicKey) return

  const tx = new Transaction()

  const [[baseAccount], [quoteAccount]] = await Promise.all([
    market.findBaseTokenAccountsForOwner(connection, openOrders.owner),
    market.findQuoteTokenAccountsForOwner(connection, openOrders.owner)
  ])

  const getOrCreateOpenOrdersWallet = async (account: { pubkey: PublicKey }, mintAddress: PublicKey) => {
    let openOrdersWallet = account?.pubkey || (mintAddress.equals(WRAPPED_SOL_MINT) && wallet.publicKey)
    if (!openOrdersWallet) {
      openOrdersWallet = await findAssociatedTokenAddress(wallet.publicKey, mintAddress)
      tx.add(createAssociatedTokenAccountIx(mintAddress, openOrdersWallet, wallet.publicKey))
    }
    return openOrdersWallet
  }

  const baseWallet = await getOrCreateOpenOrdersWallet(baseAccount, market.baseMintAddress)
  const quoteWallet = await getOrCreateOpenOrdersWallet(quoteAccount, market.quoteMintAddress)

  const settleFundsTx = await market.makeSettleFundsTransaction(connection, openOrders, baseWallet, quoteWallet)
  const { signers, transaction } = settleFundsTx
  tx.add(transaction)

  return await signAndSendRawTransaction(connection, tx, wallet, ...signers)
}

export const swap = async (
  tokenA: ISwapToken,
  tokenB: ISwapToken,
  inTokenAmount: number,
  outTokenAmount: number,
  slippage: number,
  wallet: any,
  connection: Connection,
  network: WalletAdapterNetwork
): Promise<TransactionSignature | undefined> => {
  if (!wallet.publicKey) return

  const { lpTokenMint, pool } = await computePoolsPDAs(tokenA.symbol, tokenB.symbol, network)

  const amountIn = new BN(inTokenAmount)
  const minimumAmountOut = new BN(outTokenAmount * (1 - slippage))

  const [inTokenAtaPool, outTokenAtaPool, lpTokenAtaFee, inTokenAtaUser, outTokenAtaUser] = await Promise.all([
    await findAssociatedTokenAddress(pool, new PublicKey(tokenA.address)),
    await findAssociatedTokenAddress(pool, new PublicKey(tokenB.address)),
    await findAssociatedTokenAddress(pool, lpTokenMint),
    await findAssociatedTokenAddress(wallet.publicKey, new PublicKey(tokenA.address)),
    await findAssociatedTokenAddress(wallet.publicKey, new PublicKey(tokenB.address))
  ])

  const tx = new Transaction()

  if (!(await connection.getAccountInfo(outTokenAtaUser))) {
    tx.add(createAssociatedTokenAccountIx(new PublicKey(tokenB.address), outTokenAtaUser, wallet.publicKey))
  }

  const accounts = {
    pool,
    inTokenAtaPool,
    outTokenAtaPool,
    lpTokenMint,
    lpTokenAtaFee,
    userWallet: wallet.publicKey,
    inTokenAtaUser,
    outTokenAtaUser,
    splProgram: TOKEN_PROGRAM_ID
  }

  const { instruction } = getLPProgram(wallet, connection, network)
  tx.add(await instruction.swap(amountIn, minimumAmountOut, { accounts }))

  return signAndSendRawTransaction(connection, tx, wallet)
}
