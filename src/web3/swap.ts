import { BN, Program, Provider } from '@project-serum/anchor'
import { TOKEN_PROGRAM_ID } from '@project-serum/serum/lib/token-instructions'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { Connection, PublicKey, Transaction, TransactionSignature } from '@solana/web3.js'
import {
  computePoolsPDAs,
  createAssociatedTokenAccountIx,
  findAssociatedTokenAddress,
  signAndSendRawTransaction
} from './utils'
import { ISwapToken } from '../context'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { ADDRESSES } from './ids'
const SwapIDL = require('./idl/swap.json')

const getSwapProgram = (
  wallet: WalletContextState,
  connection: Connection,
  network: WalletAdapterNetwork
): Program =>
  new Program(SwapIDL, ADDRESSES[network].swap, new Provider(connection, wallet as any, { commitment: 'processed' }))

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

  const { instruction } = getSwapProgram(wallet, connection, network)
  tx.add(await instruction.swap(amountIn, minimumAmountOut, { accounts }))

  return signAndSendRawTransaction(connection, tx, wallet)
}
