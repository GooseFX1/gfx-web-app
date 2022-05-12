import { Buffer } from 'buffer'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { Swap } from 'goosefx-ssl-sdk'

import {
  NATIVE_MINT,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createSyncNativeInstruction,
  createCloseAccountInstruction
} from '@solana/spl-token-new'

import {
  Connection,
  SystemProgram,
  PublicKey,
  Transaction,
  TransactionSignature,
  LAMPORTS_PER_SOL
} from '@solana/web3.js'
import { ADDRESSES } from './ids'
import { signAndSendRawTransaction } from './utils'
import { ISwapToken } from '../context'

const con = new Connection('https://solana-api.projectserum.com', 'confirmed')
const SWAP = new Swap(con)

export const computePoolsPDAs = async (
  tokenA: ISwapToken,
  tokenB: ISwapToken,
  network: WalletAdapterNetwork
): Promise<{ lpTokenMint: PublicKey; pool: PublicKey; pair: PublicKey }> => {
  return { lpTokenMint: null, pair: null, pool: null }
}

const wrapSolToken = async (wallet: any, connection: Connection, amount: number) => {
  try {
    const tx = new Transaction()
    const associatedTokenAccount = await getAssociatedTokenAddress(NATIVE_MINT, wallet.publicKey)
    console.log(associatedTokenAccount + '')
    // Create token account to hold your wrapped SOL
    if (associatedTokenAccount) {
      tx.add(
        createAssociatedTokenAccountInstruction(wallet.publicKey, associatedTokenAccount, wallet.publicKey, NATIVE_MINT)
      )

      // Transfer SOL to associated token account and use SyncNative to update wrapped SOL balance
      tx.add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: associatedTokenAccount,
          lamports: amount
        }),
        createSyncNativeInstruction(associatedTokenAccount)
      )
    }

    return tx //signAndSendRawTransaction(connection, tx, wallet)
  } catch {
    return null
  }
}

export const getPairDetails = async (tokenA: ISwapToken, tokenB: ISwapToken, network: WalletAdapterNetwork) => {
  const addresses = [new PublicKey(tokenA.address).toBuffer(), new PublicKey(tokenB.address).toBuffer()].sort(
    Buffer.compare
  )

  const pairArr = await PublicKey.findProgramAddress(
    [
      new Buffer('GFX-SSL-Pair', 'utf-8'),
      new PublicKey(ADDRESSES[network].programs.swap.controller).toBuffer(),
      addresses[0],
      addresses[1]
    ],
    ADDRESSES[network].programs.swap.address
  )

  const pair = pairArr[0]

  return pair
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
  try {
    SWAP.connection = connection
    const { createSwapIx } = SWAP

    let txn = new Transaction()
    if (tokenA.address === NATIVE_MINT.toBase58()) {
      txn = await wrapSolToken(wallet, connection, inTokenAmount * LAMPORTS_PER_SOL)
    }
    const inAmount = BigInt(inTokenAmount * 10 ** tokenA.decimals)
    const minimumAmountOut = BigInt(Math.floor(outTokenAmount * 10 ** tokenB.decimals * (1 - slippage)))

    const ixs = await createSwapIx(
      new PublicKey(tokenA.address),
      new PublicKey(tokenB.address),
      inAmount,
      minimumAmountOut,
      wallet.publicKey
    )
    ixs.forEach((ix) => txn.add(ix))

    // unwrapping sol if tokenB is sol
    if (tokenB.address === NATIVE_MINT.toBase58() || tokenA.address === NATIVE_MINT.toBase58()) {
      try {
        const associatedTokenAccount = await getAssociatedTokenAddress(NATIVE_MINT, wallet.publicKey)
        if (associatedTokenAccount) {
          const tr = createCloseAccountInstruction(associatedTokenAccount, wallet.publicKey, wallet.publicKey)
          txn.add(tr)
        }
      } catch (e) {
        console.log(e)
      }
    }

    const finalResult = await signAndSendRawTransaction(connection, txn, wallet)
    let result = await connection.confirmTransaction(finalResult)

    if (!result.value.err) {
      return finalResult
    } else {
      return null
    }
  } catch (e) {
    console.log(e)
    return null
  }
}

export const preSwapAmount = async (
  tokenA: ISwapToken,
  tokenB: ISwapToken,
  inTokenAmount: number,
  wallet: any,
  connection: Connection,
  network: WalletAdapterNetwork,
  route: any
): Promise<{ preSwapResult: TransactionSignature | undefined; impact: number }> => {
  try {
    if (!inTokenAmount || inTokenAmount === 0) return { impact: 0, preSwapResult: '0' }
    const inAmount = BigInt(inTokenAmount * 10 ** tokenA.decimals)
    SWAP.connection = connection
    const { getQuote } = SWAP
    const quote = await getQuote(new PublicKey(tokenA.address), new PublicKey(tokenB.address), BigInt(inAmount))
    const { out, impact: priceImpact } = quote
    const outAmount = Number(out.toString()) / 10 ** tokenB.decimals

    return { preSwapResult: outAmount.toString(), impact: priceImpact }
  } catch (e) {
    console.log(e)
    return { preSwapResult: '0', impact: 0 }
  }
}
