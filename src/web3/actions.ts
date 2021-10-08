import { BN } from '@project-serum/anchor'
import { Market, OpenOrders } from '@project-serum/serum'
import { Order } from '@project-serum/serum/lib/market'
import { TOKEN_PROGRAM_ID } from '@project-serum/serum/lib/token-instructions'
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token } from '@solana/spl-token'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { Connection, PublicKey, Transaction, TransactionSignature } from '@solana/web3.js'
import { computePoolsPDAs, findAssociatedTokenAddress, getLPProgram } from './utils'
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

const signTransaction = async (connection: Connection, transaction: Transaction, wallet: any) => {
  if (!wallet.signTransaction) return

  transaction.feePayer = wallet.publicKey
  transaction.recentBlockhash = (await connection.getRecentBlockhash('max')).blockhash

  return await wallet.signTransaction(transaction)
}

const signAndSendRawTransaction = async (connection: Connection, transaction: Transaction, wallet: any) => {
  const signedTransaction = await signTransaction(connection, transaction, wallet)
  return await connection.sendRawTransaction(signedTransaction.serialize())
}

export const cancelCryptoOrder = async (connection: Connection, market: Market, order: Order, wallet: any) => {
  if (!wallet.publicKey) return

  const tx = await market.makeCancelOrderTransaction(connection, wallet.publicKey, order)
  return await signAndSendRawTransaction(connection, tx, wallet)
}

export const placeCryptoOrder = async (connection: Connection, market: Market, order: IOrder, wallet: any) => {
  if (!wallet.publicKey) return

  const tx = new Transaction()

  const mint = order.side === 'buy' ? market.quoteMintAddress : market.baseMintAddress
  const payer = await findAssociatedTokenAddress(wallet.publicKey, mint)

  const receiverMint = order.side === 'buy' ? market.baseMintAddress : market.quoteMintAddress
  const receiverATA = await findAssociatedTokenAddress(wallet.publicKey, receiverMint)

  /* const { value } = await connection.getParsedAccountInfo(receiverATA)
  if (!value) {
    tx.add(createAssociatedTokenAccountIx(receiverMint, receiverATA, wallet.publicKey))
  } */

  tx.add(market.makeMatchOrdersTransaction(5))

  const { transaction } = await market.makePlaceOrderTransaction(connection, {
    owner: wallet.publicKey,
    payer,
    side: order.side,
    price: order.price,
    size: order.size,
    orderType: order.type
  })
  tx.add(transaction)
  tx.add(market.makeMatchOrdersTransaction(5))

  return await signAndSendRawTransaction(connection, tx, wallet)
}

export const settleCryptoFunds = async (
  connection: Connection,
  market: Market,
  openOrders: OpenOrders,
  wallet: any
) => {
  if (!wallet.publicKey) return

  const tx = new Transaction()

  let baseWallet, quoteWallet
  const [[baseAccount], [quoteAccount]] = await Promise.all([
    market.findBaseTokenAccountsForOwner(connection, openOrders.owner),
    market.findQuoteTokenAccountsForOwner(connection, openOrders.owner)
  ])

  baseWallet = baseAccount?.pubkey
  if (!baseWallet) {
    baseWallet = await findAssociatedTokenAddress(wallet.publicKey, market.baseMintAddress)
    tx.add(createAssociatedTokenAccountIx(market.baseMintAddress, baseWallet, wallet.publicKey))
  }

  quoteWallet = quoteAccount?.pubkey
  if (!quoteWallet) {
    quoteWallet = await findAssociatedTokenAddress(wallet.publicKey, market.quoteMintAddress)
    tx.add(createAssociatedTokenAccountIx(market.quoteMintAddress, quoteWallet, wallet.publicKey))
  }

  const { transaction } = await market.makeSettleFundsTransaction(connection, openOrders, baseWallet, quoteWallet)
  tx.add(transaction)

  return await signAndSendRawTransaction(connection, tx, wallet)
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
