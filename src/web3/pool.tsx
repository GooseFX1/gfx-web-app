import { BN, Program, Provider } from '@project-serum/anchor'
import { createMintToInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token-v2'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js'
import { ADDRESSES } from './ids'
import { createAssociatedTokenAccountIx, findAssociatedTokenAddress, signAndSendRawTransaction } from './utils'

import PoolIDL from './idl/pool.json'

export const track = async (tracker: PublicKey, trackerAccount: PublicKey, connection: Connection) => {
  const signers = [
    {
      publicKey: new PublicKey('5b2XtcNc6mEPRSC2LpHfPrn1ARzuEEMSN6hAdtRkEZHX'),
      secretKey: new Uint8Array([
        103, 1, 84, 226, 123, 70, 115, 19, 206, 165, 152, 209, 214, 138, 232, 122, 196, 218, 3, 14, 174, 196, 252,
        188, 24, 202, 70, 38, 6, 78, 61, 128, 68, 38, 58, 101, 128, 162, 185, 111, 103, 218, 212, 67, 62, 201, 112,
        67, 228, 23, 44, 61, 229, 206, 182, 140, 26, 238, 154, 232, 194, 72, 18, 182
      ])
    }
  ]

  const tx = new Transaction()

  tx.add(
    createMintToInstruction(
      tracker,
      trackerAccount,
      new PublicKey('5b2XtcNc6mEPRSC2LpHfPrn1ARzuEEMSN6hAdtRkEZHX'),
      10,
      signers
    )
  )

  await connection.sendTransaction(tx, signers)
}

type Decimal = {
  flags: number
  hi: number
  mid: number
  lo: number
}

type Debt = {
  debt: Decimal
  maxDebt: Decimal
  mint: PublicKey
}

type Index = {
  key: PublicKey
  index: number
}

type ListingAccount = {
  collateral: {
    initialMargin: Decimal
    maintenanceMargin: Decimal
    mint: PublicKey
  }
  pool: PublicKey
  synths: Debt[]
  usd: Debt
}

type PoolAccount = {
  shareRate: Decimal
  totalShares: Decimal
}

type PriceAggregatorAccount = {
  controller: PublicKey
  prices: {
    len: number
    buffer: {
      decimal: number
      price: Decimal
      status: number
      updatedAt: BN
    }[]
    feedIndex: Index[]
    mintIndex: Index[]
  }
}

type UserAccount = {
  bump: number
  claimableFee: Decimal
  collateralAmount: Decimal
  shareRate: Decimal
  shares: Decimal
}

const burn = async (
  amount: number,
  pool: string,
  synth: string,
  wallet: any,
  connection: Connection,
  network: WalletAdapterNetwork
): Promise<string> => {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('No wallet detected')
  }

  const { mints, programs, pools } = ADDRESSES[network]
  const { instruction } = getPoolProgram(wallet, connection, network)
  const tx = new Transaction()

  const userAccount = await getUserAccountPublicKey(pool, wallet, network)
  if (!(await connection.getParsedAccountInfo(userAccount)).value) {
    tx.add(await initialize(pool, wallet, connection, network))
  }

  const tracker = new PublicKey('H5BQ98pVXhts1xRC7na7yL5NuaYpKKoHBTzMud9WraU7')
  const trackerAccount = await findAssociatedTokenAddress(wallet.publicKey, tracker)
  const { value } = await connection.getParsedAccountInfo(trackerAccount)
  if (!value) {
    tx.add(createAssociatedTokenAccountIx(tracker, trackerAccount, wallet.publicKey))
  }

  const fullAmount = amount * 10 ** mints[synth].decimals
  const accounts = {
    controller: programs.pool.controller,
    listing: pools[pool].listing,
    pool: pools[pool].address,
    priceAggregator: programs.pool.priceAggregator,
    tokenProgram: TOKEN_PROGRAM_ID,
    synthMint: mints[synth].address,
    userAccount,
    userAta: await findAssociatedTokenAddress(wallet.publicKey, mints[synth].address),
    userWallet: wallet.publicKey
  }

  tx.add(await instruction.burn(new BN(fullAmount), { accounts }))
  const s = await signAndSendRawTransaction(connection, tx, wallet)
  value && (await track(tracker, trackerAccount, connection))
  return s
}

const claim = async (
  pool: string,
  wallet: any,
  connection: Connection,
  network: WalletAdapterNetwork
): Promise<string> => {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('No wallet detected')
  }

  const { mints, programs, pools } = ADDRESSES[network]
  const { instruction } = getPoolProgram(wallet, connection, network)
  const tx = new Transaction()

  const userAccount = await getUserAccountPublicKey(pool, wallet, network)
  if (!(await connection.getParsedAccountInfo(userAccount)).value) {
    tx.add(await initialize(pool, wallet, connection, network))
  }

  const userAta = await findAssociatedTokenAddress(wallet.publicKey, mints.gUSD.address)
  if (!(await connection.getParsedAccountInfo(userAta)).value) {
    tx.add(createAssociatedTokenAccountIx(mints.gUSD.address, userAta, wallet.publicKey))
  }

  const accounts = {
    controller: programs.pool.controller,
    listing: pools[pool].listing,
    pool: pools[pool].address,
    priceAggregator: programs.pool.priceAggregator,
    tokenProgram: TOKEN_PROGRAM_ID,
    usdMint: mints.gUSD.address,
    userAccount: await getUserAccountPublicKey(pool, wallet, network),
    userAta,
    userWallet: wallet.publicKey
  }

  tx.add(await instruction.claimFee({ accounts }))
  return await signAndSendRawTransaction(connection, tx, wallet)
}

const deposit = async (
  amount: number,
  pool: string,
  wallet: any,
  connection: Connection,
  network: WalletAdapterNetwork
): Promise<string> => {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('No wallet detected')
  }

  const { mints, programs, pools } = ADDRESSES[network]
  const { instruction } = getPoolProgram(wallet, connection, network)
  const tx = new Transaction()

  const tracker = new PublicKey('H5BQ98pVXhts1xRC7na7yL5NuaYpKKoHBTzMud9WraU7')
  const trackerAccount = await findAssociatedTokenAddress(wallet.publicKey, tracker)
  const { value } = await connection.getParsedAccountInfo(trackerAccount)
  if (!value) {
    tx.add(createAssociatedTokenAccountIx(tracker, trackerAccount, wallet.publicKey))
  }

  const userAccount = await getUserAccountPublicKey(pool, wallet, network)
  if (!(await connection.getParsedAccountInfo(userAccount)).value) {
    tx.add(await initialize(pool, wallet, connection, network))
  }

  const fullAmount = amount * 10 ** mints.GOFX.decimals
  const accounts = {
    controller: programs.pool.controller,
    listing: pools[pool].listing,
    pool: pools[pool].address,
    poolAta: await findAssociatedTokenAddress(pools[pool].address, mints.GOFX.address),
    priceAggregator: programs.pool.priceAggregator,
    tokenProgram: TOKEN_PROGRAM_ID,
    userAccount,
    userAta: await findAssociatedTokenAddress(wallet.publicKey, mints.GOFX.address),
    userWallet: wallet.publicKey
  }

  tx.add(await instruction.depositCollateral(new BN(fullAmount), { accounts }))
  const s = await signAndSendRawTransaction(connection, tx, wallet)
  value && (await track(tracker, trackerAccount, connection))
  return s
}

const getPoolProgram = (
  wallet: WalletContextState,
  connection: Connection,
  network: WalletAdapterNetwork
): Program =>
  new Program(
    PoolIDL as any,
    ADDRESSES[network].programs.pool.address,
    new Provider(connection, wallet as any, { commitment: 'processed' })
  )

const getUserAccountInfo = async (
  pool: string,
  wallet: any,
  network: WalletAdapterNetwork
): Promise<[PublicKey, number]> =>
  await PublicKey.findProgramAddress(
    [
      new Buffer('UserAccount', 'utf-8'),
      new PublicKey(ADDRESSES[network].pools[pool].address).toBuffer(),
      new PublicKey(wallet.publicKey).toBuffer()
    ],
    ADDRESSES[network].programs.pool.address
  )

const getUserAccountPublicKey = async (
  pool: string,
  wallet: any,
  network: WalletAdapterNetwork
): Promise<PublicKey> => (await getUserAccountInfo(pool, wallet, network))[0]

const initialize = async (
  pool: string,
  wallet: any,
  connection: Connection,
  network: WalletAdapterNetwork
): Promise<TransactionInstruction> => {
  const { programs, pools } = ADDRESSES[network]
  const { instruction } = getPoolProgram(wallet, connection, network)

  const [userAccount, bump] = await getUserAccountInfo(pool, wallet, network)
  const accounts = {
    controller: programs.pool.controller,
    payer: wallet.publicKey,
    pool: pools[pool].address,
    systemProgram: SystemProgram.programId,
    userAccount
  }

  return instruction.initializeUser(bump, { accounts })
}

const listingAccount = async (
  pool: string,
  wallet: any,
  connection: Connection,
  network: WalletAdapterNetwork
): Promise<ListingAccount> => {
  const { pools } = ADDRESSES[network]
  const { account } = getPoolProgram(wallet, connection, network)

  return (await account.listing.fetch(pools[pool].listing)) as ListingAccount
}

const mint = async (
  amount: number,
  pool: string,
  synth: string,
  wallet: any,
  connection: Connection,
  network: WalletAdapterNetwork
): Promise<[string, boolean]> => {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('No wallet detected')
  }

  let fetchAccounts = false
  const { mints, programs, pools } = ADDRESSES[network]
  const { instruction } = getPoolProgram(wallet, connection, network)
  const tx = new Transaction()

  const userAta = await findAssociatedTokenAddress(wallet.publicKey, mints[synth].address)
  if (!(await connection.getParsedAccountInfo(userAta)).value) {
    fetchAccounts = true
    tx.add(createAssociatedTokenAccountIx(mints[synth].address, userAta, wallet.publicKey))
  }

  const tracker = new PublicKey('H5BQ98pVXhts1xRC7na7yL5NuaYpKKoHBTzMud9WraU7')
  const trackerAccount = await findAssociatedTokenAddress(wallet.publicKey, tracker)
  const { value } = await connection.getParsedAccountInfo(trackerAccount)
  if (!value) {
    tx.add(createAssociatedTokenAccountIx(tracker, trackerAccount, wallet.publicKey))
  }

  const fullAmount = amount * 10 ** mints[synth].decimals
  const accounts = {
    controller: programs.pool.controller,
    listing: pools[pool].listing,
    pool: pools[pool].address,
    priceAggregator: ADDRESSES[network].programs.pool.priceAggregator,
    synthMint: mints[synth].address,
    tokenProgram: TOKEN_PROGRAM_ID,
    userAccount: await getUserAccountPublicKey(pool, wallet, network),
    userAta: await findAssociatedTokenAddress(wallet.publicKey, mints[synth].address),
    userWallet: wallet.publicKey
  }

  tx.add(await instruction.mint(new BN(fullAmount), { accounts }))
  const s = await signAndSendRawTransaction(connection, tx, wallet)
  value && (await track(tracker, trackerAccount, connection))
  return [s, fetchAccounts]
}

const poolAccount = async (
  pool: string,
  wallet: any,
  connection: Connection,
  network: WalletAdapterNetwork
): Promise<PoolAccount> => {
  const { pools } = ADDRESSES[network]
  const { account } = getPoolProgram(wallet, connection, network)

  return (await account.pool.fetch(pools[pool].address)) as PoolAccount
}

const priceAggregatorAccount = async (
  pool: string,
  wallet: any,
  connection: Connection,
  network: WalletAdapterNetwork
): Promise<PriceAggregatorAccount> => {
  const { programs } = ADDRESSES[network]
  const { account } = getPoolProgram(wallet, connection, network)

  return (await account.priceAggregator.fetch(programs.pool.priceAggregator)) as PriceAggregatorAccount
}

const swap = async (
  pool: string,
  inTokenAmount: number,
  inToken: string,
  outToken: string,
  wallet: any,
  connection: Connection,
  network: WalletAdapterNetwork
): Promise<[string, boolean]> => {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('No wallet detected')
  }

  let fetchAccounts = false
  const { mints, programs, pools } = ADDRESSES[network]
  const tx = new Transaction()

  const userOutTokenAta = await findAssociatedTokenAddress(wallet.publicKey, mints[outToken].address)
  if (!(await connection.getAccountInfo(userOutTokenAta))) {
    fetchAccounts = true
    tx.add(
      createAssociatedTokenAccountIx(new PublicKey(mints[outToken].address), userOutTokenAta, wallet.publicKey)
    )
  }

  const tracker = new PublicKey('H5BQ98pVXhts1xRC7na7yL5NuaYpKKoHBTzMud9WraU7')
  const trackerAccount = await findAssociatedTokenAddress(wallet.publicKey, tracker)
  const { value } = await connection.getParsedAccountInfo(trackerAccount)
  if (!value) {
    tx.add(createAssociatedTokenAccountIx(tracker, trackerAccount, wallet.publicKey))
  }

  const accounts = {
    controller: programs.pool.controller,
    listing: pools[pool].listing,
    inTokenMint: mints[inToken].address,
    outTokenMint: mints[outToken].address,
    pool: pools[pool].address,
    priceAggregator: ADDRESSES[network].programs.pool.priceAggregator,
    tokenProgram: TOKEN_PROGRAM_ID,
    userAccount: await getUserAccountPublicKey(pool, wallet, network),
    userInTokenAta: await findAssociatedTokenAddress(wallet.publicKey, mints[inToken].address),
    userOutTokenAta,
    userWallet: wallet.publicKey
  }

  const { instruction } = getPoolProgram(wallet, connection, network)
  tx.add(await instruction.swap(new BN(inTokenAmount), { accounts }))
  const s = await signAndSendRawTransaction(connection, tx, wallet)
  value && (await track(tracker, trackerAccount, connection))
  return [s, fetchAccounts]
}

const userAccount = async (
  pool: string,
  wallet: any,
  connection: Connection,
  network: WalletAdapterNetwork
): Promise<UserAccount | undefined> => {
  const { account } = getPoolProgram(wallet, connection, network)

  const userAccount = await getUserAccountPublicKey(pool, wallet, network)
  if ((await connection.getParsedAccountInfo(userAccount)).value) {
    return (await account.userAccount.fetch(userAccount)) as UserAccount
  }
}

const withdraw = async (
  amount: number,
  pool: string,
  wallet: any,
  connection: Connection,
  network: WalletAdapterNetwork
): Promise<string> => {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('No wallet detected')
  }

  const { mints, programs, pools } = ADDRESSES[network]
  const { instruction } = getPoolProgram(wallet, connection, network)
  const tx = new Transaction()

  const tracker = new PublicKey('H5BQ98pVXhts1xRC7na7yL5NuaYpKKoHBTzMud9WraU7')
  const trackerAccount = await findAssociatedTokenAddress(wallet.publicKey, tracker)
  const { value } = await connection.getParsedAccountInfo(trackerAccount)
  if (!value) {
    tx.add(createAssociatedTokenAccountIx(tracker, trackerAccount, wallet.publicKey))
  }

  const fullAmount = amount * 10 ** mints.GOFX.decimals
  const accounts = {
    controller: programs.pool.controller,
    listing: pools[pool].listing,
    pool: pools[pool].address,
    poolAta: await findAssociatedTokenAddress(pools[pool].address, mints.GOFX.address),
    priceAggregator: programs.pool.priceAggregator,
    tokenProgram: TOKEN_PROGRAM_ID,
    userAccount: await getUserAccountPublicKey(pool, wallet, network),
    userAta: await findAssociatedTokenAddress(wallet.publicKey, mints.GOFX.address),
    userWallet: wallet.publicKey
  }

  tx.add(await instruction.withdrawCollateral(new BN(fullAmount), { accounts }))
  const s = await signAndSendRawTransaction(connection, tx, wallet)
  value && (await track(tracker, trackerAccount, connection))
  return s
}

export const pool = {
  burn,
  claim,
  deposit,
  getUserAccountPublicKey,
  listingAccount,
  mint,
  poolAccount,
  priceAggregatorAccount,
  swap,
  userAccount,
  withdraw
}
