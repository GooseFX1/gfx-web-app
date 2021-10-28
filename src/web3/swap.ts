import { BN, Program, Provider } from '@project-serum/anchor'
import { TOKEN_PROGRAM_ID } from '@project-serum/serum/lib/token-instructions'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { Connection, PublicKey, Transaction, TransactionSignature } from '@solana/web3.js'
import { ADDRESSES } from './ids'
import { createAssociatedTokenAccountIx, findAssociatedTokenAddress, signAndSendRawTransaction } from './utils'
import { ISwapToken } from '../context'
const SwapIDL = require('./idl/swap.json')

const getSwapProgram = (wallet: WalletContextState, connection: Connection, network: WalletAdapterNetwork): Program =>
  new Program(
    SwapIDL,
    ADDRESSES[network].programs.swap.address,
    new Provider(connection, wallet as any, { commitment: 'processed' })
  )

export const computePoolsPDAs = async (
  tokenASymbol: string,
  tokenBSymbol: string,
  network: WalletAdapterNetwork
): Promise<{ lpTokenMint: PublicKey; pool: PublicKey }> => {
  const {
    pools,
    programs: {
      swap: { address }
    }
  } = ADDRESSES[network]
  const pair = pools[[tokenASymbol, tokenBSymbol].sort((a, b) => a.localeCompare(b)).join('/')]
  const poolSeed = [new Buffer('GFXPool', 'utf-8'), new PublicKey(pair.address).toBuffer()]
  const mintSeed = [new Buffer('GFXLPMint', 'utf-8'), new PublicKey(pair.address).toBuffer()]
  const PDAs = await Promise.all([
    PublicKey.findProgramAddress(mintSeed, address),
    PublicKey.findProgramAddress(poolSeed, address)
  ])
  const [[lpTokenMint], [pool]] = PDAs
  return { lpTokenMint, pool }
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
  if (!wallet.publicKey || !wallet.signTransaction) return

  const { instruction } = getSwapProgram(wallet, connection, network)
  const tx = new Transaction()

  const amountIn = new BN(inTokenAmount * 10 ** tokenA.decimals)
  const minimumAmountOut = new BN(outTokenAmount * 10 ** tokenB.decimals * (1 - slippage))

  const { lpTokenMint, pool } = await computePoolsPDAs(tokenA.symbol, tokenB.symbol, network)
  const [inTokenAtaPool, outTokenAtaPool, lpTokenAtaFee, inTokenAtaUser, outTokenAtaUser] = await Promise.all([
    await findAssociatedTokenAddress(pool, new PublicKey(tokenA.address)),
    await findAssociatedTokenAddress(pool, new PublicKey(tokenB.address)),
    await findAssociatedTokenAddress(pool, lpTokenMint),
    await findAssociatedTokenAddress(wallet.publicKey, new PublicKey(tokenA.address)),
    await findAssociatedTokenAddress(wallet.publicKey, new PublicKey(tokenB.address))
  ])

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

  tx.add(await instruction.swap(amountIn, minimumAmountOut, { accounts }))
  return signAndSendRawTransaction(connection, tx, wallet)
}
