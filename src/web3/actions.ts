import { BN } from '@project-serum/anchor'
import { TOKEN_PROGRAM_ID } from '@project-serum/serum/lib/token-instructions'
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token } from '@solana/spl-token'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { Connection, PublicKey, Transaction, TransactionInstruction, TransactionSignature } from '@solana/web3.js'
import { getSerumMarket } from './serum'
import { computePoolsPDAs, findAssociatedTokenAddress, getLPProgram } from './utils'
import { IOrder, ISwapToken } from '../context'

export const serumPlaceOrder = async (
  connection: Connection,
  pair: string,
  order: IOrder,
  wallet: WalletContextState,
  mint: PublicKey
) => {
  if (!wallet.publicKey || !wallet.signTransaction) return

  const [market, payer] = await Promise.all([
    getSerumMarket(connection, pair),
    findAssociatedTokenAddress(wallet.publicKey, mint)
  ])

  const { signers, transaction } = await market.makePlaceOrderTransaction(connection, {
    owner: wallet.publicKey,
    payer,
    side: order.side,
    price: order.price,
    size: order.size,
    orderType: order.type
  })

  return await connection.sendTransaction(transaction, signers)
}

export const swap = async (
  tokenA: ISwapToken,
  tokenB: ISwapToken,
  inTokenAmount: number,
  outTokenAmount: number,
  slippage: number,
  wallet: WalletContextState,
  connection: Connection,
  network: WalletAdapterNetwork
): Promise<TransactionSignature | undefined> => {
  if (!wallet.publicKey || !wallet.signTransaction) return

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

  const instructions: TransactionInstruction[] = []

  if (!(await connection.getAccountInfo(outTokenAtaUser))) {
    instructions.push(
      Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        new PublicKey(tokenB.address),
        outTokenAtaUser,
        wallet.publicKey,
        wallet.publicKey
      )
    )
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
  const swapIx = await instruction.swap(amountIn, minimumAmountOut, { accounts })
  instructions.push(swapIx)

  const transaction = new Transaction({
    feePayer: wallet.publicKey,
    recentBlockhash: (await connection.getRecentBlockhash()).blockhash
  })
  transaction.add(...instructions)

  const signedTransaction = await wallet.signTransaction(transaction)
  return await connection.sendRawTransaction(signedTransaction.serialize())
}
