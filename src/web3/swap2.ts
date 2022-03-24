import { BN, Program, Provider } from '@project-serum/anchor'
import { Buffer } from 'buffer'
import { publicKeyLayout } from './layout'
import { TOKEN_PROGRAM_ID } from '@project-serum/serum/lib/token-instructions'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletContextState } from '@solana/wallet-adapter-react'
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
  SYSVAR_RENT_PUBKEY,
  LAMPORTS_PER_SOL
} from '@solana/web3.js'
import { ADDRESSES, SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID, SYSTEM } from './ids'
import {
  createAssociatedTokenAccountIx,
  findAssociatedTokenAddress,
  signAndSendRawTransaction,
  simulateTransaction
} from './utils'
import { ISwapToken } from '../context'
const SwapIDL = require('./idl/swap2.json')
const { blob, struct, u8, u32 } = require('buffer-layout')

const getSwapProgram = (wallet: WalletContextState, connection: Connection, network: WalletAdapterNetwork): Program =>
  new Program(
    SwapIDL,
    ADDRESSES[network].programs.swap.address,
    new Provider(connection, wallet as any, { commitment: 'processed' })
  )

const LAYOUT = struct([
  blob(8, 'sighash'),
  publicKeyLayout('controller'),
  publicKeyLayout('mint1'),
  publicKeyLayout('mint2'),
  blob(8),
  publicKeyLayout('oracle1'),
  u8(),
  publicKeyLayout('oracle2'),
  u8(),
  publicKeyLayout('oracle3'),
  u8(),
  publicKeyLayout('oracle4'),
  u8(),
  u32('n'),
  blob(970),
  publicKeyLayout('fee_collector')
])

export const computePoolsPDAs = async (
  tokenA: ISwapToken,
  tokenB: ISwapToken,
  network: WalletAdapterNetwork
): Promise<{ lpTokenMint: PublicKey; pool: PublicKey; pair: PublicKey }> => {
  // const {
  //   programs: {
  //     swap: { address }
  //   }
  // } = ADDRESSES[network] //ADDRESSES[network]

  //pools[[tokenA.symbol, tokenB.symbol].sort((a, b) => a.localeCompare(b)).join('/')]
  //console.log(paired)
  // const poolSeed = [new Buffer('GFXPool', 'utf-8'), new PublicKey(pair[0] + '').toBuffer()]
  // const mintSeed = [new Buffer('GFXLPMint', 'utf-8'), new PublicKey(pair[0] + '').toBuffer()]
  // const PDAs = await Promise.all([
  //   PublicKey.findProgramAddress(mintSeed, address),
  //   PublicKey.findProgramAddress(poolSeed, address)
  // ])
  // const [[lpTokenMint], [pool]] = PDAs
  return { lpTokenMint: null, pair: null, pool: null }
}

const wrapSolToken = async (wallet: any, connection: Connection, amount: number) => {
  try {
    const tx = new Transaction()
    const associatedTokenAccount = await getAssociatedTokenAddress(NATIVE_MINT, wallet.publicKey)
    // Create token account to hold your wrapped SOL
    if (associatedTokenAccount)
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

    return signAndSendRawTransaction(connection, tx, wallet)
  } catch {
    return null
  }
}

export const swapCreatTX = async (
  tokenA: ISwapToken,
  tokenB: ISwapToken,
  inTokenAmount: number,
  outTokenAmount: number,
  slippage: number,
  wallet: any,
  connection: Connection,
  network: WalletAdapterNetwork,
  txn?: Transaction
): Promise<Transaction> => {
  if (!wallet.publicKey || !wallet.signTransaction) return

  const program = getSwapProgram(wallet, connection, network)
  const inst: any = program.instruction
  const tx = txn || new Transaction()

  const amountIn = new BN(inTokenAmount * 10 ** tokenA.decimals)
  const minimumAmountOut = new BN(outTokenAmount * 10 ** tokenB.decimals * (1 - slippage))

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

  const [inTokenAtaUser, outTokenAtaUser] = await Promise.all([
    await findAssociatedTokenAddress(wallet.publicKey, new PublicKey(tokenA.address)),
    await findAssociatedTokenAddress(wallet.publicKey, new PublicKey(tokenB.address))
  ])

  const sslIn = await PublicKey.findProgramAddress(
    [
      new Buffer('GFX-SSL', 'utf-8'),
      new PublicKey(ADDRESSES[network].programs.swap.controller).toBuffer(),
      new PublicKey(tokenA.address).toBuffer()
    ],
    ADDRESSES[network].programs.swap.address
  )
  const sslOut = await PublicKey.findProgramAddress(
    [
      new Buffer('GFX-SSL', 'utf-8'),
      new PublicKey(ADDRESSES[network].programs.swap.controller).toBuffer(),
      new PublicKey(tokenB.address).toBuffer()
    ],
    ADDRESSES[network].programs.swap.address
  )
  const vaultIn = await findAssociatedTokenAddress(sslIn[0], new PublicKey(tokenA.address))
  const vaultOut = await findAssociatedTokenAddress(sslOut[0], new PublicKey(tokenB.address))

  if (!(await connection.getAccountInfo(outTokenAtaUser))) {
    tx.add(createAssociatedTokenAccountIx(new PublicKey(tokenB.address), outTokenAtaUser, wallet.publicKey))
  }

  // let walletBuffer = wallet.publicKey + ''
  // let assTokProg = await PublicKey.findProgramAddress(
  //   [new PublicKey(walletBuffer).toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), new PublicKey(tokenA.address).toBuffer()],
  //   ADDRESSES[network].programs.swap.address
  // )

  // console.log(SYSVAR_RENT_PUBKEY + '', SYSVAR_RENT_PUBKEY + '' === 'SysvarRent111111111111111111111111111111111')
  // console.log(inTokenAtaUser + '', inTokenAtaUser + '' === 'Bp7pJh1UrpWeuvRHCbx788KLAhm3p2KYHJofm8PCf9K')
  // console.log(outTokenAtaUser + '', outTokenAtaUser + '' === '6Lc8K5ECpv2Rs7uWXCvsHhzKJPPqgciqtWCVA4XvKahA')

  try {
    const pairData = await connection.getAccountInfo(pair)
    if (!pairData || !pairData.data) throw new Error('Token Pair do not exist yet.')

    const tokenAccountA = await findAssociatedTokenAddress(wallet.publicKey, new PublicKey(tokenA.address))
    if (tokenA.address !== NATIVE_MINT.toBase58() && !(await connection.getParsedAccountInfo(tokenAccountA)).value) {
      tx.add(createAssociatedTokenAccountIx(new PublicKey(tokenA.address), tokenAccountA, wallet.publicKey))
    }

    const tokenAccountB = await findAssociatedTokenAddress(wallet.publicKey, new PublicKey(tokenB.address))
    if (tokenB.address !== NATIVE_MINT.toBase58() && !(await connection.getParsedAccountInfo(tokenAccountB)).value) {
      tx.add(createAssociatedTokenAccountIx(new PublicKey(tokenB.address), tokenAccountB, wallet.publicKey))
    }

    const data = pairData.data
    const decoded = LAYOUT.decode(data)
    const { oracle1, oracle2, oracle3, oracle4, n, fee_collector } = decoded
    const collector = fee_collector //'Cir93Do3LGMYtYnbxpQAb5Gr5R5mS2c7gTS1AZkvYA3w'

    const remainingAccounts = [
      { isSigner: false, isWritable: false, pubkey: oracle1 },
      { isSigner: false, isWritable: false, pubkey: oracle2 },
      { isSigner: false, isWritable: false, pubkey: oracle3 },
      { isSigner: false, isWritable: false, pubkey: oracle4 }
    ].slice(0, n)

    const accounts = {
      controller: new PublicKey(ADDRESSES[network].programs.swap.controller),
      pair,
      sslIn: sslIn[0],
      sslOut: sslOut[0],
      mintIn: new PublicKey(tokenA.address),
      mintOut: new PublicKey(tokenB.address),
      vaultIn,
      vaultOut,
      userWallet: wallet.publicKey,
      userInAta: inTokenAtaUser,
      userOutAta: outTokenAtaUser,
      instructions: new PublicKey('Sysvar1nstructions1111111111111111111111111'),
      feeCollectorAta: await findAssociatedTokenAddress(new PublicKey(collector), new PublicKey(tokenA.address)),
      feeCollector: new PublicKey(collector),
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
      systemProgram: SYSTEM,
      rent: SYSVAR_RENT_PUBKEY
    }

    tx.add(
      await inst.rebalanceSwap(amountIn, minimumAmountOut, {
        accounts,
        remainingAccounts
      })
    )
    tx.add(await inst.preSwap({ accounts, remainingAccounts }))
    tx.add(await inst.swap({ accounts, remainingAccounts }))
  } catch (error) {
    console.log(error)
  }

  return tx
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
    // TEST; TODO: remove on testing phase done using GOFX as trigger for wrapping and unwrapping

    // if token is gSol
    if (tokenA.address === '2uig6CL6aQNS8wPL9YmfRNUNcQMgq9purmXK53pzMaQ6') {
      return await wrapSolToken(wallet, connection, inTokenAmount * LAMPORTS_PER_SOL)
    }

    // unwrapping sol if tokenB is sol
    if (tokenB.address === '2uig6CL6aQNS8wPL9YmfRNUNcQMgq9purmXK53pzMaQ6') {
      try {
        const associatedTokenAccount = await getAssociatedTokenAddress(NATIVE_MINT, wallet.publicKey)
        if (!associatedTokenAccount) return null
        const tr = createCloseAccountInstruction(associatedTokenAccount, wallet.publicKey, wallet.publicKey)
        const txn = new Transaction()
        txn.add(tr)
        return await signAndSendRawTransaction(connection, txn, wallet)
      } catch {
        return null
      }
    }

    //TODO: remove the above soon

    const tx = await swapCreatTX(tokenA, tokenB, inTokenAmount, outTokenAmount, slippage, wallet, connection, network)
    const finalResult = signAndSendRawTransaction(connection, tx, wallet)

    // unwrapping sol if tokenB is sol
    if (finalResult && tokenB.address === NATIVE_MINT.toBase58()) {
      try {
        const associatedTokenAccount = await getAssociatedTokenAddress(NATIVE_MINT, wallet.publicKey)
        if (!associatedTokenAccount) return null
        const tr = createCloseAccountInstruction(associatedTokenAccount, wallet.publicKey, wallet.publicKey)
        const txn = new Transaction()
        txn.add(tr)
        await signAndSendRawTransaction(connection, txn, wallet)
      } catch (e) {
        console.log(e)
      }
    }

    return finalResult
  } catch {
    return null
  }
}

export const preSwapAmount = async (
  tokenA: ISwapToken,
  tokenB: ISwapToken,
  inTokenAmount: number,
  wallet: any,
  connection: Connection,
  network: WalletAdapterNetwork
): Promise<TransactionSignature | undefined> => {
  let txn = new Transaction()
  if (tokenA.address === NATIVE_MINT.toBase58()) {
    txn = await wrapSolToken(wallet, connection, inTokenAmount * LAMPORTS_PER_SOL, true)
  }

  const tx = await swapCreatTX(tokenA, tokenB, inTokenAmount, 0, 0, wallet, connection, network, txn)

  const sim = await simulateTransaction(connection, tx, wallet)
  const index = sim.value.logs.findIndex((i) => i.includes('[Final]'))

  if (sim.value.logs.length > 0 && sim.value.logs[index]) {
    const amountArr = sim.value.logs[index].split('+')
    const amountOut = amountArr[amountArr.length - 1]
    return amountOut
  } else {
    return undefined
  }
}
