import BN from 'bn.js'
import { publicKey, u64 } from '@solana/buffer-layout-utils'
import { Idl, Program } from '@project-serum/anchor'
import { struct, u32, u8 } from '@solana/buffer-layout'
import { TOKEN_PROGRAM_ID } from '@project-serum/serum/lib/token-instructions'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  NATIVE_MINT,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createSyncNativeInstruction,
  createCloseAccountInstruction
} from '@solana/spl-token-v2'
import { WalletContextState } from '@solana/wallet-adapter-react'
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  SYSVAR_RENT_PUBKEY,
  SystemProgram
} from '@solana/web3.js'
import { SYSTEM } from './ids'
import { ADDRESSES as SDK_ADDRESS } from 'goosefx-ssl-sdk'
import { findAssociatedTokenAddress, createAssociatedTokenAccountIx, getNetworkConnectionText } from './utils'
import { SSL_PREFIX, LIQUIDITY_ACCOUNT_PREFIX, toPublicKey, ADDRESSES, PT_MINT_PREFIX } from '../web3'
import { TOKEN_NAMES } from '../constants'

export interface Account {
  /** Address of the account */
  address: PublicKey
  /** Mint associated with the account */
  mint: PublicKey
  /** Owner of the account */
  owner: PublicKey
  /** Number of tokens the account holds */
  amount: bigint
  /** Authority that can transfer tokens from the account */
  delegate: PublicKey | null
  /** Number of tokens the delegate is authorized to transfer */
  delegatedAmount: bigint
  /** True if the account is initialized */
  isInitialized: boolean
  /** True if the account is frozen */
  isFrozen: boolean
  /** True if the account is a native token account */
  isNative: boolean
  /**
   * If the account is a native token account, it must be rent-exempt. The rent-exempt reserve is the amount that must
   * remain in the balance until the account is closed.
   */
  rentExemptReserve: bigint | null
  closeAuthority: PublicKey | null
}

/** Token account state as stored by the program */
export enum AccountState {
  Uninitialized = 0, //eslint-disable-line
  Initialized = 1, //eslint-disable-line
  Frozen = 2 //eslint-disable-line
}

export interface RawAccount {
  mint: PublicKey
  owner: PublicKey
  amount: bigint
  delegateOption: 1 | 0
  delegate: PublicKey
  state: AccountState
  isNativeOption: 1 | 0
  isNative: bigint
  delegatedAmount: bigint
  closeAuthorityOption: 1 | 0
  closeAuthority: PublicKey
}

/** Buffer layout for de/serializing a token account */
export const AccountLayout = struct<RawAccount>([
  publicKey('mint'),
  publicKey('owner'),
  u64('amount'),
  u32('delegateOption'),
  publicKey('delegate'),
  u8('state'),
  u32('isNativeOption'),
  u64('isNative'),
  u64('delegatedAmount'),
  u32('closeAuthorityOption'),
  publicKey('closeAuthority')
])

export const getSslAccountKey = async (
  tokenMintAddress: PublicKey,
  network: WalletAdapterNetwork
): Promise<undefined | PublicKey> => {
  const CONTROLLER_KEY = SDK_ADDRESS[getNetworkConnectionText(network)].GFX_CONTROLLER
  const PROGRAM_ID = SDK_ADDRESS[getNetworkConnectionText(network)].SSL_PROGRAM_ID
  try {
    const sslAccountKey: [PublicKey, number] = await PublicKey.findProgramAddress(
      [Buffer.from(SSL_PREFIX), CONTROLLER_KEY.toBuffer(), tokenMintAddress.toBuffer()],
      toPublicKey(PROGRAM_ID)
      //get metadata address
    )
    return sslAccountKey[0]
  } catch (err) {
    return undefined
  }
}
export const fetchAllSSLAmountStaked = async (
  connection: Connection,
  sslAccountKeys: PublicKey[],
  wallet: WalletContextState,
  liquidityAccountKeys: PublicKey[],
  mainVaultKeys: PublicKey[]
) => {
  try {
    const promiseData = []
    promiseData.push(connection.getMultipleAccountsInfo(sslAccountKeys))
    promiseData.push(connection.getMultipleAccountsInfo(mainVaultKeys))
    if (wallet.publicKey) promiseData.push(connection.getMultipleAccountsInfo(liquidityAccountKeys))
    const ans = Promise.all(promiseData)
    return ans.then((res) => ({ sslData: res[0], mainVault: res[1], liquidityData: res[2] }))
  } catch (err) {
    console.log(err)
  }
}
export const getPTMintKey = async (
  tokenMintAddress: PublicKey,
  network: WalletAdapterNetwork
): Promise<undefined | PublicKey> => {
  const CONTROLLER_KEY = SDK_ADDRESS[getNetworkConnectionText(network)].GFX_CONTROLLER
  const PROGRAM_ID = SDK_ADDRESS[getNetworkConnectionText(network)].SSL_PROGRAM_ID
  try {
    const ptMintAddress: [PublicKey, number] = await PublicKey.findProgramAddress(
      [Buffer.from(PT_MINT_PREFIX), CONTROLLER_KEY.toBuffer(), tokenMintAddress.toBuffer()],
      toPublicKey(PROGRAM_ID)
      //get metadata address
    )
    return ptMintAddress[0]
  } catch (err) {
    return undefined
  }
}
export const getMainVaultKey = async (
  tokenMintAddress: PublicKey,
  network: WalletAdapterNetwork
): Promise<undefined | PublicKey> => {
  const CONTROLLER_KEY = SDK_ADDRESS[getNetworkConnectionText(network)].GFX_CONTROLLER
  const PROGRAM_ID = SDK_ADDRESS[getNetworkConnectionText(network)].SSL_PROGRAM_ID
  try {
    const liabilityKey: [PublicKey, number] = await PublicKey.findProgramAddress(
      [Buffer.from(SSL_PREFIX), CONTROLLER_KEY.toBuffer(), tokenMintAddress.toBuffer()],
      toPublicKey(PROGRAM_ID)
      //get metadata address
    )
    let mainVaultKey = liabilityKey[0]
    mainVaultKey = await findAssociatedTokenAddress(mainVaultKey, tokenMintAddress)
    return mainVaultKey
  } catch (err) {
    return undefined
  }
}
export const getLiquidityAccountKey = async (
  wallet: WalletContextState,
  tokenMintAddress: PublicKey,
  network: WalletAdapterNetwork
): Promise<undefined | PublicKey> => {
  const CONTROLLER_KEY = SDK_ADDRESS[getNetworkConnectionText(network)].GFX_CONTROLLER
  const PROGRAM_ID = SDK_ADDRESS[getNetworkConnectionText(network)].SSL_PROGRAM_ID

  try {
    const liquidityAccountKey: [PublicKey, number] = await PublicKey.findProgramAddress(
      [
        Buffer.from(LIQUIDITY_ACCOUNT_PREFIX),
        CONTROLLER_KEY.toBuffer(),
        tokenMintAddress.toBuffer(),
        wallet.publicKey.toBuffer()
      ],
      toPublicKey(PROGRAM_ID)
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
  const liquidityAccountKey = await getLiquidityAccountKey(wallet, tokenMintAddress, network)
  const sslAccountKey = await getSslAccountKey(tokenMintAddress, network)
  const PTMint = await getPTMintKey(tokenMintAddress, network)
  const amountInNative = amount * Math.pow(10, getTokenDecimal(network, tokenName))
  const userPTAta = await findAssociatedTokenAddress(wallet.publicKey, PTMint)
  const CONTROLLER_KEY = SDK_ADDRESS[getNetworkConnectionText(network)].GFX_CONTROLLER

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
  const liquidityAccountKey = await getLiquidityAccountKey(wallet, tokenMintAddress, network)
  const sslAccountKey = await getSslAccountKey(tokenMintAddress, network)
  const PTMint = await getPTMintKey(tokenMintAddress, network)
  const amountInNative = amount * Math.pow(10, getTokenDecimal(network, tokenName))
  const userPTAta = await findAssociatedTokenAddress(wallet.publicKey, PTMint)
  const CONTROLLER_KEY = SDK_ADDRESS[getNetworkConnectionText(network)].GFX_CONTROLLER

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
  const liquidityAccountKey = await getLiquidityAccountKey(wallet, tokenMintAddress, network)
  const sslAccountKey = await getSslAccountKey(tokenMintAddress, network)
  const RTVault = await findAssociatedTokenAddress(sslAccountKey, tokenMintAddress)
  const userRtAta = await findAssociatedTokenAddress(wallet.publicKey, tokenMintAddress)
  const CONTROLLER_KEY = SDK_ADDRESS[getNetworkConnectionText(network)].GFX_CONTROLLER

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
  if (tokenName === TOKEN_NAMES.SOL) {
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
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          associatedTokenAccount,
          wallet.publicKey,
          NATIVE_MINT
        )
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
    return tx
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
  network: WalletAdapterNetwork,
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
  const CONTROLLER_KEY = SDK_ADDRESS[getNetworkConnectionText(network)].GFX_CONTROLLER

  const depositInstructionAccount = {
    controller: CONTROLLER_KEY,
    ssl: sslAccountKey,
    liquidityAccount: liquidityAccountKey,
    rtVault: RTVault,
    userRtAta: userRtAta,
    userWallet: wallet.publicKey,
    tokenProgram: TOKEN_PROGRAM_ID
  }
  // some strage co relation dont will check about it later
  const amountInBN: BN = new BN(amountInNative)
  //@ts-ignore
  const depositAmountIX: TransactionInstruction = await program.instruction.deposit(amountInBN, {
    accounts: depositInstructionAccount
  })
  let signature
  try {
    let depositAmountTX: Transaction
    if (tokenName === TOKEN_NAMES.SOL) depositAmountTX = await wrapSolToken(wallet, connection, amountInNative)
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
  const liquidityAccountKey = await getLiquidityAccountKey(wallet, tokenMintAddress, network)
  const sslAccountKey = await getSslAccountKey(tokenMintAddress, network)
  const amountInNative = amount * Math.pow(10, getTokenDecimal(network, tokenName))
  const liqAccData = await connection.getAccountInfo(liquidityAccountKey)

  let createLiquidtyIX = undefined
  if (!liqAccData) {
    createLiquidtyIX = await createLiquidityAccountIX(program, network, wallet, liquidityAccountKey, sslAccountKey)
  }
  return depositAmount(
    amountInNative,
    network,
    program,
    sslAccountKey,
    liquidityAccountKey,
    wallet,
    connection,
    tokenMintAddress,
    tokenName,
    createLiquidtyIX
  )
}

export const createLiquidityAccountIX = async (
  program: Program<Idl>,
  network: WalletAdapterNetwork,
  wallet: WalletContextState,
  liquidityAccount: any,
  sslKey: PublicKey
) => {
  const CONTROLLER_KEY = SDK_ADDRESS[getNetworkConnectionText(network)].GFX_CONTROLLER
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
