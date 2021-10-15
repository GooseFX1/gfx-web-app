import { Program, Provider } from '@project-serum/anchor'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { ADDRESSES } from './ids'
import { findAssociatedTokenAddress, signAndSendRawTransaction } from './utils'
const PoolIDL = require('./idl/pool.json')

const getUserAccount = async (pool: string, wallet: any, network: WalletAdapterNetwork) =>
  await PublicKey.findProgramAddress(
    [
      new Buffer('UserAccount', 'utf-8'),
      new PublicKey(ADDRESSES[network].pools[pool].address).toBuffer(),
      new PublicKey(wallet.publicKey).toBuffer()
    ],
    ADDRESSES[network].programs.pool.address
  )

const getPoolProgram = (wallet: WalletContextState, connection: Connection, network: WalletAdapterNetwork): Program =>
  new Program(
    PoolIDL,
    ADDRESSES[network].programs.pool.address,
    new Provider(connection, wallet as any, { commitment: 'processed' })
  )

const burn = async (
  amount: number,
  pool: string,
  synth: string,
  wallet: any,
  connection: Connection,
  network: WalletAdapterNetwork
) => {
  if (!wallet.publicKey) return

  const tx = new Transaction()

  const { mints, programs, pools } = ADDRESSES[network]
  const accounts = {
    controller: programs.pool.controller,
    listing: pools[pool].listing,
    pool: pools[pool].address,
    priceAggregator: programs.pool.priceAggregator,
    tokenProgram: TOKEN_PROGRAM_ID,
    synthMint: mints[synth],
    userAccount: await getUserAccount(pool, wallet, network),
    userAta: await findAssociatedTokenAddress(wallet.publicKey, mints[synth].address),
    userWallet: wallet.publicKey
  }

  const { instruction } = getPoolProgram(wallet, connection, network)
  tx.add(await instruction.burn(amount, { accounts }))

  return await signAndSendRawTransaction(connection, tx, wallet)
}

const claim = async (
  amount: number,
  pool: string,
  wallet: any,
  connection: Connection,
  network: WalletAdapterNetwork
) => {
  if (!wallet.publicKey) return

  const tx = new Transaction()

  const { mints, programs, pools } = ADDRESSES[network]
  const accounts = {
    controller: programs.pool.controller,
    listing: pools[pool].listing,
    pool: pools[pool].address,
    priceAggregator: programs.pool.priceAggregator,
    tokenProgram: TOKEN_PROGRAM_ID,
    usdMint: mints.gUSD,
    userAccount: await getUserAccount(pool, wallet, network),
    userAta: await findAssociatedTokenAddress(wallet.publicKey, mints.gUSD.address),
    userWallet: wallet.publicKey
  }

  const { instruction } = getPoolProgram(wallet, connection, network)
  tx.add(await instruction.claimFee({ accounts }))

  return await signAndSendRawTransaction(connection, tx, wallet)
}

const deposit = async (
  amount: number,
  pool: string,
  wallet: any,
  connection: Connection,
  network: WalletAdapterNetwork
) => {
  if (!wallet.publicKey) return

  const tx = new Transaction()

  const { mints, programs, pools } = ADDRESSES[network]
  const accounts = {
    controller: programs.pool.controller,
    listing: pools[pool].listing,
    pool: pools[pool].address,
    poolAta: await findAssociatedTokenAddress(programs.pool.address, mints.GOFX.address),
    priceAggregator: programs.pool.priceAggregator,
    tokenProgram: TOKEN_PROGRAM_ID,
    userAccount: await getUserAccount(pool, wallet, network),
    userAta: await findAssociatedTokenAddress(wallet.publicKey, mints.GOFX.address),
    userWallet: wallet.publicKey
  }

  const { instruction } = getPoolProgram(wallet, connection, network)
  tx.add(await instruction.depositCollateral(amount, { accounts }))

  return await signAndSendRawTransaction(connection, tx, wallet)
}

const initialize = async (pool: string, wallet: any, connection: Connection, network: WalletAdapterNetwork) => {
  if (!wallet.publicKey) return

  const tx = new Transaction()

  const { programs, pools } = ADDRESSES[network]
  const [userAccount, bump] = await PublicKey.findProgramAddress(
    [
      new Buffer('UserAccount', 'utf-8'),
      new PublicKey(pools[pool].address).toBuffer(),
      new PublicKey(wallet.publicKey).toBuffer()
    ],
    programs.pool.address
  )

  const accounts = {
    controller: programs.pool.controller,
    payer: wallet.publicKey,
    pool: pools[pool].address,
    systemProgram: SystemProgram.programId,
    userAccount
  }

  const { instruction } = getPoolProgram(wallet, connection, network)
  tx.add(await instruction.initializeUser(bump, { accounts }))

  return await signAndSendRawTransaction(connection, tx, wallet)
}

const liquidate = async (
  amount: number,
  pool: string,
  synth: string,
  wallet: any,
  connection: Connection,
  network: WalletAdapterNetwork
) => {
  if (!wallet.publicKey) return

  const tx = new Transaction()

  const { mints, programs, pools } = ADDRESSES[network]
  const accounts = {
    collateralVault: await findAssociatedTokenAddress(programs.pool.address, mints.GOFX.address),
    controller: ADDRESSES[network].programs.pool.controller,
    liquidatedTokenMint: mints[synth].address,
    liquidatorCollateralAta: await findAssociatedTokenAddress(wallet.publicKey, mints.GOFX.address),
    liquidatorLiquidatedTokenAta: await findAssociatedTokenAddress(wallet.publicKey, mints[synth].address),
    liquidatorWallet: wallet.publicKey,
    listing: pools[pool].listing,
    pool: pools[pool].address,
    priceAggregator: ADDRESSES[network].programs.pool.priceAggregator,
    tokenProgram: TOKEN_PROGRAM_ID
    // victimUserAccount,
    // victimWallet
  }

  const { instruction } = getPoolProgram(wallet, connection, network)
  tx.add(await instruction.liquidate(amount, { accounts }))

  return await signAndSendRawTransaction(connection, tx, wallet)
}

const mint = async (
  amount: number,
  pool: string,
  synth: string,
  wallet: any,
  connection: Connection,
  network: WalletAdapterNetwork
) => {
  if (!wallet.publicKey) return

  const tx = new Transaction()

  const { mints, programs, pools } = ADDRESSES[network]
  const accounts = {
    controller: programs.pool.controller,
    listing: pools[pool].listing,
    pool: pools[pool].address,
    priceAggregator: ADDRESSES[network].programs.pool.priceAggregator,
    synthMint: mints[synth],
    tokenProgram: TOKEN_PROGRAM_ID,
    userAccount: await getUserAccount(pool, wallet, network),
    userAta: findAssociatedTokenAddress(wallet.publicKey, mints[synth].address),
    userWallet: wallet.publicKey
  }

  const { instruction } = getPoolProgram(wallet, connection, network)
  tx.add(await instruction.mint(amount, { accounts }))

  return await signAndSendRawTransaction(connection, tx, wallet)
}

const swap = async (
  amount: number,
  pool: string,
  inToken: string,
  outToken: string,
  wallet: any,
  connection: Connection,
  network: WalletAdapterNetwork
) => {
  if (!wallet.publicKey) return

  const tx = new Transaction()

  const { mints, programs, pools } = ADDRESSES[network]
  const accounts = {
    controller: programs.pool.controller,
    listing: pools[pool].listing,
    inTokenMint: mints[inToken],
    outTokenMint: mints[outToken],
    pool: pools[pool].address,
    priceAggregator: ADDRESSES[network].programs.pool.priceAggregator,
    tokenProgram: TOKEN_PROGRAM_ID,
    userAccount: await getUserAccount(pool, wallet, network),
    userInTokenAta: await findAssociatedTokenAddress(wallet.publicKey, mints[inToken].address),
    userOutTokenAta: await findAssociatedTokenAddress(wallet.publicKey, mints[outToken].address),
    userWallet: wallet.publicKey
  }

  const { instruction } = getPoolProgram(wallet, connection, network)
  tx.add(await instruction.swap(amount, { accounts }))

  return await signAndSendRawTransaction(connection, tx, wallet)
}

const withdraw = async (
  amount: number,
  pool: string,
  wallet: any,
  connection: Connection,
  network: WalletAdapterNetwork
) => {
  if (!wallet.publicKey) return

  const tx = new Transaction()

  const { mints, programs, pools } = ADDRESSES[network]
  const accounts = {
    controller: programs.pool.controller,
    listing: pools[pool].listing,
    pool: pools[pool].address,
    poolAta: await findAssociatedTokenAddress(programs.pool.address, mints.GOFX.address),
    priceAggregator: programs.pool.priceAggregator,
    tokenProgram: TOKEN_PROGRAM_ID,
    userAccount: await getUserAccount(pool, wallet, network),
    userAta: await findAssociatedTokenAddress(wallet.publicKey, mints.GOFX.address),
    userWallet: wallet.publicKey
  }

  const { instruction } = getPoolProgram(wallet, connection, network)
  tx.add(await instruction.withdrawCollateral(amount, { accounts }))

  return await signAndSendRawTransaction(connection, tx, wallet)
}

export const pool = {
  burn,
  claim,
  deposit,
  initialize,
  liquidate,
  mint,
  swap,
  withdraw
}
