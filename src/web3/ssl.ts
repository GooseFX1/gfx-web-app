import BN from 'bn.js'
import * as lo from '@solana/buffer-layout'
import { publicKey, u64, bool } from '@solana/buffer-layout-utils'
import { Idl, Instruction, Program, Provider, Wallet } from '@project-serum/anchor'
import { publicKeyLayout } from './layout'
import { TOKEN_PROGRAM_ID } from '@project-serum/serum/lib/token-instructions'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  NATIVE_MINT,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createSyncNativeInstruction,
  createCloseAccountInstruction
} from '@solana/spl-token-new'
import { WalletContextState } from '@solana/wallet-adapter-react'
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  SYSVAR_RENT_PUBKEY,
  SystemProgram,
  LAMPORTS_PER_SOL
} from '@solana/web3.js'
import { SYSTEM } from './ids'
import { findAssociatedTokenAddress, createAssociatedTokenAccountIx } from './utils'
import { STAKE_PREFIX, SSL_PREFIX, LIQUIDITY_ACCOUNT_PREFIX, toPublicKey, ADDRESSES, PT_MINT_PREFIX } from '../web3'
const StakeIDL = require('./idl/stake.json')
const SSLIDL = require('./idl/ssl.json')

const { blob, struct, u8 } = require('buffer-layout')

const CONTROLLER_KEY = new PublicKey('8CxKnuJeoeQXFwiG6XiGY2akBjvJA5k3bE52BfnuEmNQ')

export interface ILiquidityAccount {
  sighash: Uint8Array
  mint: PublicKey
  bump: number
  share: BigInt
  ptMinted: BigInt
  amountDeposited: BigInt
}
export interface SSL {
  sighash: Uint8Array
  controller: PublicKey
  mint: PublicKey
  decimals: number
  bump: number
  ptBump: number
  suspended: boolean
  cranker: PublicKey
  weight: BigInt
  liability: BigInt
  swappedLiability: BigInt
  totalShare: BigInt
}

export const LIQUIDITY_ACCOUNT_LAYOUT = lo.struct<ILiquidityAccount>([
  lo.blob(8, 'sighash'),
  publicKey('mint'),
  lo.u8('bump'),
  lo.blob(7),
  u64('share'),
  u64('ptMinted'),
  u64('amountDeposited'),
  lo.blob(248, 'padding')
])

export const SSL_LAYOUT = lo.struct<SSL>([
  lo.blob(8, 'sighash'),
  publicKey('controller'),
  publicKey('mint'),
  lo.u8('decimals'),
  lo.u8('bump'),
  lo.u8('ptBump'),
  bool('suspended'),
  publicKey('cranker'),
  lo.blob(4), // padding
  u64('weight'),
  u64('liability'),
  u64('swappedLiability'),
  u64('totalShare'),

  lo.blob(256, 'padding')
])

export const getSslAccountKey = async (tokenMintAddress: PublicKey): Promise<undefined | PublicKey> => {
  try {
    const sslAccountKey: [PublicKey, number] = await PublicKey.findProgramAddress(
      [Buffer.from(SSL_PREFIX), CONTROLLER_KEY.toBuffer(), tokenMintAddress.toBuffer()],
      toPublicKey(SSLIDL.metadata.address)
      //get metadata address
    )
    return sslAccountKey[0]
  } catch (err) {
    return undefined
  }
}

export const fetchSSLAmountStaked = async (
  connection: Connection,
  sslAccountKey: PublicKey,
  wallet: WalletContextState,
  tokenMintAddress: PublicKey
) => {
  try {
    const liquidityAccountKey = await getLiquidityAccountKey(wallet, tokenMintAddress)
    const { data } = await connection.getAccountInfo(sslAccountKey)
    const sslData = SSL_LAYOUT.decode(data)
    try {
      const liquidityData = (await connection.getAccountInfo(liquidityAccountKey)).data
      const liquidityAccount = LIQUIDITY_ACCOUNT_LAYOUT.decode(liquidityData)
      return { sslData, liquidityAccount }
    } catch (err) {
      return { sslData: sslData, liquidityAccount: undefined }
    }
  } catch (err) {
    console.log(err)
  }
}
export const getPTMintKey = async (tokenMintAddress: PublicKey): Promise<undefined | PublicKey> => {
  try {
    const ptMintAddress: [PublicKey, number] = await PublicKey.findProgramAddress(
      [Buffer.from(PT_MINT_PREFIX), CONTROLLER_KEY.toBuffer(), tokenMintAddress.toBuffer()],
      toPublicKey(SSLIDL.metadata.address)
      //get metadata address
    )
    return ptMintAddress[0]
  } catch (err) {
    return undefined
  }
}
export const getLiquidityAccountKey = async (
  wallet: WalletContextState,
  tokenMintAddress: PublicKey
): Promise<undefined | PublicKey> => {
  try {
    const liquidityAccountKey: [PublicKey, number] = await PublicKey.findProgramAddress(
      [
        Buffer.from(LIQUIDITY_ACCOUNT_PREFIX),
        CONTROLLER_KEY.toBuffer(),
        tokenMintAddress.toBuffer(),
        wallet.publicKey.toBuffer()
      ],
      toPublicKey(SSLIDL.metadata.address)
      //get metadata address
    )
    return liquidityAccountKey[0]
  } catch (err) {
    return undefined
  }
}
export const getTokenAddresses = (SSLTokensNames: any[], network: WalletAdapterNetwork) => {
  const SSLTokenAddresses = SSLTokensNames.map((token) => getTokenMintAddress(network, token))
  return SSLTokenAddresses
}

export const executeBurn = async (
  program: Program<Idl>,
  wallet: WalletContextState,
  connection: Connection,
  network: WalletAdapterNetwork,
  tokenName: string,
  amount: number
) => {
  const tokenMintAddress = getTokenMintAddress(network, tokenName)
  const liquidityAccountKey = await getLiquidityAccountKey(wallet, tokenMintAddress)
  const sslAccountKey = await getSslAccountKey(tokenMintAddress)
  const PTMint = await getPTMintKey(tokenMintAddress)
  const amountInNative = amount * Math.pow(10, getTokenDecimal(network, tokenName))
  const userPTAta = await findAssociatedTokenAddress(wallet.publicKey, PTMint)

  const burnPtInstructionAccount = {
    controller: CONTROLLER_KEY,
    ssl: sslAccountKey,
    liquidityAccount: liquidityAccountKey,
    ptMint: PTMint,
    userPtAta: userPTAta,
    userWallet: wallet.publicKey,
    tokenProgram: TOKEN_PROGRAM_ID
  }
  //@ts-ignore
  const burnPtIX: TransactionInstruction = await program.instruction.burnPt(new BN(amountInNative), {
    accounts: burnPtInstructionAccount
  })
  const burnPTTX: Transaction = new Transaction()
  burnPTTX.add(burnPtIX)

  let signature
  try {
    signature = await wallet.sendTransaction(burnPTTX, connection)
    console.log(signature)

    const confirm = await connection.confirmTransaction(signature, 'confirmed')
    console.log(confirm, 'burn amount')
    return { confirm, signature }
  } catch (error) {
    console.dir(error, 'burn error')
    return { error, signature }
  }
}

export const executeMint = async (
  program: Program<Idl>,
  wallet: WalletContextState,
  connection: Connection,
  network: WalletAdapterNetwork,
  tokenName: string,
  amount: number
) => {
  const tokenMintAddress = getTokenMintAddress(network, tokenName)
  const liquidityAccountKey = await getLiquidityAccountKey(wallet, tokenMintAddress)
  const sslAccountKey = await getSslAccountKey(tokenMintAddress)
  const PTMint = await getPTMintKey(tokenMintAddress)
  const amountInNative = amount * Math.pow(10, getTokenDecimal(network, tokenName))
  const userPTAta = await findAssociatedTokenAddress(wallet.publicKey, PTMint)

  const mintPtInstructionAccount = {
    controller: CONTROLLER_KEY,
    ssl: sslAccountKey,
    liquidityAccount: liquidityAccountKey,
    ptMint: PTMint,
    userPtAta: userPTAta,
    userWallet: wallet.publicKey,
    tokenProgram: TOKEN_PROGRAM_ID
  }
  //@ts-ignore
  const mintPtIX: TransactionInstruction = await program.instruction.mintPt(new BN(amountInNative), {
    accounts: mintPtInstructionAccount
  })
  const mintPTTX: Transaction = new Transaction()

  if (!(await connection.getAccountInfo(userPTAta))) {
    mintPTTX.add(createAssociatedTokenAccountIx(PTMint, userPTAta, wallet.publicKey))
  }
  mintPTTX.add(mintPtIX)

  let signature
  try {
    signature = await wallet.sendTransaction(mintPTTX, connection)
    console.log(signature)

    const confirm = await connection.confirmTransaction(signature, 'confirmed')
    console.log(confirm, 'mint amount')
    return { confirm, signature }
  } catch (error) {
    console.dir(error, 'mint error')
    return { error, signature }
  }
}

export const executeWithdraw = async (
  program: Program<Idl>,
  wallet: WalletContextState,
  connection: Connection,
  network: WalletAdapterNetwork,
  tokenName: string,
  amount: number
) => {
  const tokenMintAddress = getTokenMintAddress(network, tokenName)
  const liquidityAccountKey = await getLiquidityAccountKey(wallet, tokenMintAddress)
  const sslAccountKey = await getSslAccountKey(tokenMintAddress)
  const RTVault = await findAssociatedTokenAddress(sslAccountKey, tokenMintAddress)
  const userRtAta = await findAssociatedTokenAddress(wallet.publicKey, tokenMintAddress)

  const withdrawInstructionAccount = {
    controller: CONTROLLER_KEY,
    ssl: sslAccountKey,
    liquidityAccount: liquidityAccountKey,
    rtVault: RTVault,
    userRtAta: userRtAta,
    userWallet: wallet.publicKey,
    tokenProgram: TOKEN_PROGRAM_ID
  }
  //@ts-ignore
  const withdrawIX: TransactionInstruction = await program.instruction.withdraw(new BN(amount), {
    //percent withdraw
    accounts: withdrawInstructionAccount
  })
  const withdrawTX: Transaction = new Transaction()
  if (tokenName === 'SOL') {
    const associatedTokenAccountAddress = await getAssociatedTokenAddress(NATIVE_MINT, wallet.publicKey)
    const associatedTokenAccount = await connection.getAccountInfo(associatedTokenAccountAddress)
    try {
      if (!associatedTokenAccount) {
        const tr = createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          associatedTokenAccountAddress,
          wallet.publicKey,
          NATIVE_MINT
        )
        withdrawTX.add(tr)
      }
    } catch (e) {
      console.log(e)
    }

    withdrawTX.add(withdrawIX)
    const tr = createCloseAccountInstruction(associatedTokenAccountAddress, wallet.publicKey, wallet.publicKey)
    withdrawTX.add(tr)

    let signature
    try {
      signature = await wallet.sendTransaction(withdrawTX, connection)
      console.log(signature)

      const confirm = await connection.confirmTransaction(signature, 'confirmed')
      console.log(confirm, 'withdraw amount')
      return { confirm, signature }
    } catch (error) {
      console.log(error, 'withdraw error\n', signature)
      return { error, signature }
    }
  } else {
    withdrawTX.add(withdrawIX)
    let signature
    try {
      signature = await wallet.sendTransaction(withdrawTX, connection)
      console.log(signature)

      const confirm = await connection.confirmTransaction(signature, 'confirmed')
      console.log(confirm, 'withdraw amount')
      return { confirm, signature }
    } catch (error) {
      console.log(error, 'withdraw error\n', signature)
      return { error, signature }
    }
  }
}

const wrapSolToken = async (wallet: any, connection: Connection, amount: number) => {
  try {
    const tx = new Transaction()
    const associatedTokenAccount = await getAssociatedTokenAddress(NATIVE_MINT, wallet.publicKey)
    const accountExists = await connection.getAccountInfo(associatedTokenAccount)
    // Create token account to hold your wrapped SOL
    if (!accountExists)
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
    return tx //signAndSendRawTransaction(connection, tx, wallet)
  } catch {
    return null
  }
}

const getTokenMintAddress = (network: WalletAdapterNetwork, tokenName: string): PublicKey => {
  const tokenMintAddress = ADDRESSES[network].sslPool[tokenName]?.address
  return tokenMintAddress ? tokenMintAddress : null
}
export const getTokenDecimal = (network: WalletAdapterNetwork, tokenName: string): number => {
  const decimal = ADDRESSES[network].sslPool[tokenName].decimals
  return decimal ? decimal : null
}

const depositAmount = async (
  amountInNative: number,
  program: any,
  sslAccountKey: PublicKey,
  liquidityAccountKey: PublicKey,
  wallet: WalletContextState,
  connection: Connection,
  tokenMintAddress: PublicKey,
  tokenName: string,
  createLiquidityIX: TransactionInstruction | undefined
) => {
  const RTVault = await findAssociatedTokenAddress(sslAccountKey, tokenMintAddress)
  const userRtAta = await findAssociatedTokenAddress(wallet.publicKey, tokenMintAddress)
  const depositInstructionAccount = {
    controller: CONTROLLER_KEY,
    ssl: sslAccountKey,
    liquidityAccount: liquidityAccountKey,
    rtVault: RTVault,
    userRtAta: userRtAta,
    userWallet: wallet.publicKey,
    tokenProgram: TOKEN_PROGRAM_ID
  }
  //const amountInLamport = amount * Math.pow(10, getTokenDecimal(net)); // some strage co relation dont will check about it later
  const amountInBN: BN = new BN(amountInNative)
  //@ts-ignore
  const depositAmountIX: TransactionInstruction = await program.instruction.deposit(amountInBN, {
    accounts: depositInstructionAccount
  })
  let signature
  try {
    let depositAmountTX: Transaction
    if (tokenName === 'SOL') depositAmountTX = await wrapSolToken(wallet, connection, amountInNative)
    else depositAmountTX = new Transaction()
    if (createLiquidityIX !== undefined) {
      depositAmountTX.add(createLiquidityIX)
    }

    depositAmountTX.add(depositAmountIX)

    signature = await wallet.sendTransaction(depositAmountTX, connection)
    console.log(signature)

    const confirm = await connection.confirmTransaction(signature, 'confirmed')
    console.log(confirm, 'deposit amount')
    return { confirm, signature }
  } catch (error) {
    console.log(error, 'deposit error\n', signature)
    return { error, signature }
  }
}

export const executeDeposit = async (
  program: Program<Idl>,
  wallet: WalletContextState,
  connection: Connection,
  network: WalletAdapterNetwork,
  amount: number,
  tokenName: string
) => {
  const tokenMintAddress = getTokenMintAddress(network, tokenName)
  const liquidityAccountKey = await getLiquidityAccountKey(wallet, tokenMintAddress)
  const sslAccountKey = await getSslAccountKey(tokenMintAddress)
  const amountInNative = amount * Math.pow(10, getTokenDecimal(network, tokenName))

  try {
    let liquidityAccData = (await connection.getAccountInfo(liquidityAccountKey)).data
    const decoded = LIQUIDITY_ACCOUNT_LAYOUT.decode(liquidityAccData)
    return depositAmount(
      amountInNative,
      program,
      sslAccountKey,
      liquidityAccountKey,
      wallet,
      connection,
      tokenMintAddress,
      tokenName,
      undefined
    )
  } catch (err) {
    try {
      const createLiquidtyIX = await createLiquidityAccountIX(program, wallet, liquidityAccountKey, sslAccountKey)
      return depositAmount(
        amountInNative,
        program,
        sslAccountKey,
        liquidityAccountKey,
        wallet,
        connection,
        tokenMintAddress,
        tokenName,
        createLiquidtyIX
      )
    } catch (err) {
      console.log(err)
    }
    console.log(err)
  }
}

export const createLiquidityAccountIX = async (
  program: Program<Idl>,
  wallet: WalletContextState,
  liquidityAccount: any,
  sslKey: PublicKey
) => {
  const createLiquidityInstructionAccount = {
    controller: CONTROLLER_KEY,
    ssl: sslKey,
    liquidityAccount: liquidityAccount,
    userWallet: wallet.publicKey,
    systemProgram: SYSTEM,
    rent: SYSVAR_RENT_PUBKEY
  }
  //@ts-ignore
  const createLiquidityIX: TransactionInstruction = await program.instruction.createLiquidityAccount({
    accounts: createLiquidityInstructionAccount
  })
  return createLiquidityIX
}

export default {}
