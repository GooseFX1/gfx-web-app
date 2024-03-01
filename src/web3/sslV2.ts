import BN from 'bn.js'
import { publicKey, u64 } from '@solana/buffer-layout-utils'
import { Idl, Program } from '@project-serum/anchor'
import { struct, u32, u8 } from '@solana/buffer-layout'
import { TOKEN_PROGRAM_ID } from 'openbook-ts/serum/lib/token-instructions'
import {
  NATIVE_MINT,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createSyncNativeInstruction,
  createCloseAccountInstruction
} from '@solana/spl-token-v2'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { Connection, PublicKey, Transaction, TransactionInstruction, SystemProgram } from '@solana/web3.js'
import { SYSTEM, SSL_PROGRAM_ID, EVENT_EMITTER } from './ids'
import { findAssociatedTokenAddress, confirmTransaction } from './utils'
import {
  LIQUIDITY_ACCOUNT_PREFIX,
  toPublicKey,
  POOL_REGISTRY_PREFIX,
  SSL_V2_ADMIN,
  SSL_POOL_SIGNER_PREFIX
} from '../web3'
import { TxnReturn } from './stake'
import { SSLToken } from '../pages/FarmV3/constants'
import { convertToNativeValue } from '../utils'
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
export const fetchAllSSLAmountStaked = async (
  connection: Connection,
  sslAccountKeys: PublicKey[],
  wallet: WalletContextState,
  liquidityAccountKeys: PublicKey[],
  mainVaultKeys: PublicKey[]
): Promise<{ sslData: any; mainVault: any; liquidityData: any }> => {
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
export const getLiquidityAccountKey = async (
  walletPublickKey: PublicKey,
  tokenMintAddress: PublicKey
): Promise<undefined | PublicKey> => {
  const poolRegistryAccountKey = await getPoolRegistryAccountKeys()
  try {
    const liquidityAccountKey: [PublicKey, number] = await PublicKey.findProgramAddress(
      [
        Buffer.from(LIQUIDITY_ACCOUNT_PREFIX),
        poolRegistryAccountKey.toBuffer(), //TODO: ask eric to give updated value
        tokenMintAddress.toBuffer(),
        walletPublickKey.toBuffer()
      ],
      toPublicKey(SSL_PROGRAM_ID)
    )
    return liquidityAccountKey[0]
  } catch (err) {
    return undefined
  }
}
export const getPoolRegistryAccountKeys = async (): Promise<undefined | PublicKey> => {
  try {
    const poolRegistryKey: [PublicKey, number] = await PublicKey.findProgramAddress(
      [Buffer.from(POOL_REGISTRY_PREFIX), SSL_V2_ADMIN.toBuffer()],
      toPublicKey(SSL_PROGRAM_ID)
    )
    return poolRegistryKey[0]
  } catch (err) {
    return undefined
  }
}

export const getEventEmitterAccount = (): PublicKey => {
  try {
    const eventEmitterKey: [PublicKey, number] = PublicKey.findProgramAddressSync(
      [Buffer.from(EVENT_EMITTER)],
      toPublicKey(SSL_PROGRAM_ID)
    )
    return eventEmitterKey[0]
  } catch (err) {
    return undefined
  }
}

export const getsslPoolSignerKey = async (tokenMintAddress: PublicKey): Promise<undefined | PublicKey> => {
  const poolRegistryAccountKey = await getPoolRegistryAccountKeys()
  try {
    const sslPoolSignerKey: [PublicKey, number] = await PublicKey.findProgramAddress(
      [Buffer.from(SSL_POOL_SIGNER_PREFIX), poolRegistryAccountKey.toBuffer(), tokenMintAddress.toBuffer()],
      toPublicKey(SSL_PROGRAM_ID)
    )
    return sslPoolSignerKey[0]
  } catch (err) {
    return undefined
  }
}

const checkIfTokenAccExists = async (
  tokenMintAddress: PublicKey,
  wallet: PublicKey,
  connection,
  ataAddress: PublicKey
) => {
  const associatedTokenAccount = await connection.getAccountInfo(ataAddress)

  // CHECK if the associated token account exists or not if not create one
  if (!associatedTokenAccount) {
    try {
      const tr = createAssociatedTokenAccountInstruction(wallet, ataAddress, wallet, tokenMintAddress)
      return tr
    } catch (e) {
      console.log(e)
    }
  }

  return null
}
export const executeWithdraw = async (
  program: Program<Idl>,
  wallet: WalletContextState,
  connection: Connection,
  token: SSLToken,
  amount: string,
  walletPublicKey: PublicKey
): Promise<TxnReturn> => {
  const poolRegistryAccountKey = await getPoolRegistryAccountKeys()
  const tokenMintAddress = token?.mint
  const liquidityAccountKey = await getLiquidityAccountKey(walletPublicKey, tokenMintAddress)
  const sslAccountKey = await getsslPoolSignerKey(tokenMintAddress)
  const poolVaultAccount = await findAssociatedTokenAddress(sslAccountKey, tokenMintAddress)
  const feeVaultAccount = await findAssociatedTokenAddress(poolRegistryAccountKey, tokenMintAddress)
  const amountInNative = convertToNativeValue(amount, token?.mintDecimals)
  const userAta = await findAssociatedTokenAddress(walletPublicKey, tokenMintAddress)

  const withdrawTX: Transaction = new Transaction()

  const ataAddress = await getAssociatedTokenAddress(tokenMintAddress, walletPublicKey)

  const createTokenAccIX = await checkIfTokenAccExists(tokenMintAddress, walletPublicKey, connection, ataAddress)
  if (createTokenAccIX) withdrawTX.add(createTokenAccIX)

  const withdrawInstructionAccount = {
    liquidityAccount: liquidityAccountKey,
    owner: walletPublicKey,
    userAta: userAta,
    sslPoolSigner: sslAccountKey,
    poolVault: poolVaultAccount,
    sslFeeVault: feeVaultAccount,
    poolRegistry: poolRegistryAccountKey,
    eventEmitter: getEventEmitterAccount(),
    tokenProgram: TOKEN_PROGRAM_ID
  }
  const withdrawIX: TransactionInstruction = await program.instruction.withdraw(new BN(amountInNative), {
    accounts: withdrawInstructionAccount
  })

  withdrawTX.add(withdrawIX)
  if (token?.token === 'SOL') {
    const tr = createCloseAccountInstruction(ataAddress, walletPublicKey, walletPublicKey)
    withdrawTX.add(tr)
  }
  let signature
  try {
    signature = await wallet.sendTransaction(withdrawTX, connection)
    console.log('signature', signature)
    const confirm = await confirmTransaction(connection, signature, 'processed')
    return { confirm, signature }
  } catch (error) {
    console.log(error, 'withdraw error\n', signature)
    return { error, signature }
  }
}

export const executeClaimRewards = async (
  program: Program<Idl>,
  wallet: WalletContextState,
  connection: Connection,
  token: SSLToken,
  walletPublicKey: PublicKey
): Promise<TxnReturn> => {
  const poolRegistryAccountKey = await getPoolRegistryAccountKeys()
  const tokenMintAddress = token?.mint
  const feeVaultAccount = await findAssociatedTokenAddress(poolRegistryAccountKey, tokenMintAddress)
  const userAta = await findAssociatedTokenAddress(walletPublicKey, tokenMintAddress)
  const liquidityAccountKey = await getLiquidityAccountKey(walletPublicKey, tokenMintAddress)

  const claimTX: Transaction = new Transaction()
  const ataAddress = await getAssociatedTokenAddress(tokenMintAddress, walletPublicKey)

  const createTokenAccIX = await checkIfTokenAccExists(tokenMintAddress, walletPublicKey, connection, ataAddress)
  if (createTokenAccIX) claimTX.add(createTokenAccIX)

  const claimIxAcc = {
    poolRegistry: poolRegistryAccountKey,
    owner: walletPublicKey,
    sslFeeVault: feeVaultAccount,
    ownerAta: userAta,
    liquidityAccount: liquidityAccountKey,
    eventEmitter: getEventEmitterAccount(),
    tokenProgram: TOKEN_PROGRAM_ID
  }
  const claimIX: TransactionInstruction = await program.instruction.claimFees({
    accounts: claimIxAcc
  })

  claimTX.add(claimIX)

  if (token?.token === 'SOL') {
    const tr = createCloseAccountInstruction(ataAddress, walletPublicKey, walletPublicKey)
    claimTX.add(tr)
  }
  let signature
  try {
    signature = await wallet.sendTransaction(claimTX, connection)
    const confirm = await confirmTransaction(connection, signature, 'processed')
    return { confirm, signature }
  } catch (error) {
    console.log(error, 'claim rewards error\n', signature)
    return { error, signature }
  }
}

const isPendingRewards = (rewards: { [key: string]: PublicKey }[], token: SSLToken) => {
  if (rewards && token) {
    const reward = rewards[token?.mint?.toBase58()]?.toNumber() / Math.pow(10, token?.mintDecimals)
    if (reward) return true
    else return false
  } else {
    return false
  }
}

export const executeAllPoolClaim = async (
  program: Program<Idl>,
  wallet: WalletContextState,
  connection: Connection,
  walletPublicKey: PublicKey,
  rewards: { [key: string]: PublicKey }[],
  allPoolSslData: SSLToken[]
): Promise<TxnReturn> => {
  const poolRegistryAccountKey = await getPoolRegistryAccountKeys()

  const claimTX: Transaction = new Transaction()

  for (let i = 0; i < allPoolSslData.length; i++) {
    const token = allPoolSslData[i]
    const tokenMintAddress = token?.mint
    const feeVaultAccount = await findAssociatedTokenAddress(poolRegistryAccountKey, tokenMintAddress)
    const userAta = await findAssociatedTokenAddress(walletPublicKey, tokenMintAddress)
    const liquidityAccountKey = await getLiquidityAccountKey(walletPublicKey, tokenMintAddress)
    const claimableReward = isPendingRewards(rewards, token)

    if (!claimableReward) continue

    const ataAddress = await getAssociatedTokenAddress(tokenMintAddress, walletPublicKey)
    const createTokenAccIX = await checkIfTokenAccExists(tokenMintAddress, walletPublicKey, connection, ataAddress)
    if (createTokenAccIX) claimTX.add(createTokenAccIX)

    const claimIxAcc = {
      poolRegistry: poolRegistryAccountKey,
      owner: walletPublicKey,
      sslFeeVault: feeVaultAccount,
      ownerAta: userAta,
      liquidityAccount: liquidityAccountKey,
      eventEmitter: getEventEmitterAccount(),
      tokenProgram: TOKEN_PROGRAM_ID
    }
    const claimIX: TransactionInstruction = await program.instruction.claimFees({
      accounts: claimIxAcc
    })
    claimTX.add(claimIX)

    if (token?.token === 'SOL') {
      const tr = createCloseAccountInstruction(ataAddress, walletPublicKey, walletPublicKey)
      claimTX.add(tr)
    }
  }

  let signature
  try {
    signature = await wallet.sendTransaction(claimTX, connection)
    const confirm = await confirmTransaction(connection, signature, 'processed')
    return { confirm, signature }
  } catch (error) {
    console.log(error, 'Error in claiming all rewards', signature)
    return { error, signature }
  }
}

const wrapSolToken = async (walletPublicKey: PublicKey, connection: Connection, amount: string) => {
  try {
    const tx = new Transaction()
    const associatedTokenAccount = await getAssociatedTokenAddress(NATIVE_MINT, walletPublicKey)
    const accountExists = await connection.getAccountInfo(associatedTokenAccount)
    // Create token account to hold your wrapped SOL
    if (!accountExists)
      tx.add(
        createAssociatedTokenAccountInstruction(
          walletPublicKey,
          associatedTokenAccount,
          walletPublicKey,
          NATIVE_MINT
        )
      )
    // Transfer SOL to associated token account and use SyncNative to update wrapped SOL balance
    tx.add(
      SystemProgram.transfer({
        fromPubkey: walletPublicKey,
        toPubkey: associatedTokenAccount,
        lamports: +amount
      }),
      createSyncNativeInstruction(associatedTokenAccount)
    )
    return tx
  } catch {
    return null
  }
}

const depositAmount = async (
  amountInNative: string,
  program: any,
  sslAccountKey: PublicKey,
  liquidityAccountKey: PublicKey,
  poolRegistryAccountKey: PublicKey,
  wallet: WalletContextState,
  connection: Connection,
  tokenMintAddress: PublicKey,
  tokenName: string,
  createLiquidityIX: TransactionInstruction | undefined,
  walletPublicKey: PublicKey
): Promise<TxnReturn> => {
  const userAta = await findAssociatedTokenAddress(walletPublicKey, tokenMintAddress)
  const poolVaultAccount = await findAssociatedTokenAddress(sslAccountKey, tokenMintAddress)
  const feeVaultAccount = await findAssociatedTokenAddress(poolRegistryAccountKey, tokenMintAddress)

  const depositInstructionAccount = {
    liquidityAccount: liquidityAccountKey,
    owner: walletPublicKey,
    userAta: userAta,
    sslPoolSigner: sslAccountKey,
    poolVault: poolVaultAccount,
    sslFeeVault: feeVaultAccount,
    poolRegistry: poolRegistryAccountKey,
    eventEmitter: getEventEmitterAccount(),
    tokenProgram: TOKEN_PROGRAM_ID
  }
  // some strage co relation dont will check about it later: sslchange - shrihari
  const amountInBN: BN = new BN(amountInNative)
  const depositAmountIX: TransactionInstruction = await program.instruction.deposit(amountInBN, {
    accounts: depositInstructionAccount
  })
  let signature
  try {
    let depositAmountTX: Transaction
    if (tokenName === 'SOL') depositAmountTX = await wrapSolToken(walletPublicKey, connection, amountInNative)
    else depositAmountTX = new Transaction()
    if (createLiquidityIX !== undefined) {
      depositAmountTX.add(createLiquidityIX)
    }
    depositAmountTX.add(depositAmountIX)
    signature = await wallet.sendTransaction(depositAmountTX, connection, { skipPreflight: true })
    const confirm = await confirmTransaction(connection, signature, 'processed')
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
  amount: string,
  token: SSLToken,
  walletPublicKey: PublicKey
): Promise<TxnReturn> => {
  const tokenMintAddress = token?.mint
  const liquidityAccountKey = await getLiquidityAccountKey(walletPublicKey, tokenMintAddress)
  const sslAccountKey = await getsslPoolSignerKey(tokenMintAddress)
  const poolRegistryAccountKey = await getPoolRegistryAccountKeys()
  const amountInNative = convertToNativeValue(amount, token?.mintDecimals)
  const liqAccData = await connection.getAccountInfo(liquidityAccountKey)

  let createLiquidityIX = undefined
  if (!liqAccData) {
    createLiquidityIX = await createLiquidityAccountIX(
      program,
      walletPublicKey,
      liquidityAccountKey,
      tokenMintAddress
    )
  }
  return depositAmount(
    amountInNative,
    program,
    sslAccountKey,
    liquidityAccountKey,
    poolRegistryAccountKey,
    wallet,
    connection,
    tokenMintAddress,
    token?.token,
    createLiquidityIX,
    walletPublicKey
  )
}

export const createLiquidityAccountIX = async (
  program: Program<Idl>,
  walletPublicKey: PublicKey,
  liquidityAccount: PublicKey,
  tokenMintAddress: PublicKey
): Promise<TransactionInstruction> => {
  const poolRegistryAccountKey = await getPoolRegistryAccountKeys()
  const createLiquidityInstructionAccount = {
    poolRegistry: poolRegistryAccountKey,
    mint: tokenMintAddress,
    liquidityAccount: liquidityAccount,
    owner: walletPublicKey,
    eventEmitter: getEventEmitterAccount(),
    systemProgram: SYSTEM
  }
  const createLiquidityIX: TransactionInstruction = await program.instruction.createLiquidityAccount({
    accounts: createLiquidityInstructionAccount
  })
  return createLiquidityIX
}

export default {}
