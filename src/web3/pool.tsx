import { Program, Provider } from '@project-serum/anchor'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { Connection, SystemProgram, Transaction } from '@solana/web3.js'
import { ADDRESSES } from './ids'
import { signAndSendRawTransaction } from './utils'
const PoolIDL = require('./idl/pool.json')

const getPoolProgram = (wallet: WalletContextState, connection: Connection, network: WalletAdapterNetwork): Program =>
  new Program(PoolIDL, ADDRESSES[network].pool, new Provider(connection, wallet as any, { commitment: 'processed' }))

const burn = async (amount: number, wallet: any, connection: Connection, network: WalletAdapterNetwork) => {
  if (!wallet.publicKey) return

  const tx = new Transaction()

  /*  const accounts = {
    controller,
    listing,
    pool,
    priceAggregator,
    tokenProgram: TOKEN_PROGRAM_ID,
    synthMint,
    userAccount,
    userAta,
    userWallet: wallet.publicKey
  }

  const { instruction } = getPoolProgram(wallet, connection, network)
  tx.add(await instruction.burn(amount, { accounts })) */

  return await signAndSendRawTransaction(connection, tx, wallet)
}

const claim = async (amount: number, wallet: any, connection: Connection, network: WalletAdapterNetwork) => {
  if (!wallet.publicKey) return

  const tx = new Transaction()

  /*  const accounts = {
    controller,
    listing,
    pool,
    priceAggregator,
    tokenProgram: TOKEN_PROGRAM_ID,
    usdMint,
    userAccount,
    userAta,
    userWallet: wallet.publicKey
  }

  const { instruction } = getPoolProgram(wallet, connection, network)
  tx.add(await instruction.claimFee({ accounts })) */

  return await signAndSendRawTransaction(connection, tx, wallet)
}

const deposit = async (amount: number, wallet: any, connection: Connection, network: WalletAdapterNetwork) => {
  if (!wallet.publicKey) return

  const tx = new Transaction()

  /* const accounts = {
    controller,
    listing,
    pool,
    poolAta,
    priceAggregator,
    tokenProgram: TOKEN_PROGRAM_ID,
    userAccount,
    userAta,
    userWallet: wallet.publicKey
  }

  const { instruction } = getPoolProgram(wallet, connection, network)
  tx.add(await instruction.depositCollateral(amount, { accounts })) */

  return await signAndSendRawTransaction(connection, tx, wallet)
}

const initialize = async (wallet: any, connection: Connection, network: WalletAdapterNetwork) => {
  if (!wallet.publicKey) return

  const tx = new Transaction()

  /* const accounts = {
    controller,
    payer,
    pool,
    systemProgram: SystemProgram.programId,
    userAccount
  }

  const { instruction } = getPoolProgram(wallet, connection, network)
  tx.add(await instruction.initializeUser(bump, { accounts })) */

  return await signAndSendRawTransaction(connection, tx, wallet)
}

const liquidate = async (amount: number, wallet: any, connection: Connection, network: WalletAdapterNetwork) => {
  if (!wallet.publicKey) return

  const tx = new Transaction()

  /*  const accounts = {
    collateralVault,
    controller,
    liquidatedTokenMint,
    liquidatorCollateralAta,
    liquidatorLiquidatedTokenAta,
    liquidatorWallet,
    listing,
    pool,
    priceAggregator,
    tokenProgram: TOKEN_PROGRAM_ID,
    victimUserAccount,
    victimWallet
  }

  const { instruction } = getPoolProgram(wallet, connection, network)
  tx.add(await instruction.liquidate(amount, { accounts })) */

  return await signAndSendRawTransaction(connection, tx, wallet)
}

const mint = async (amount: number, wallet: any, connection: Connection, network: WalletAdapterNetwork) => {
  if (!wallet.publicKey) return

  const tx = new Transaction()

  /*  const accounts = {
    controller,
    listing,
    pool,
    priceAggregator,
    synthMint,
    tokenProgram: TOKEN_PROGRAM_ID,
    userAccount,
    userAta,
    userWallet: wallet.publicKey
  }

  const { instruction } = getPoolProgram(wallet, connection, network)
  tx.add(await instruction.mint(amount, { accounts })) */

  return await signAndSendRawTransaction(connection, tx, wallet)
}

const swap = async (amount: number, wallet: any, connection: Connection, network: WalletAdapterNetwork) => {
  if (!wallet.publicKey) return

  const tx = new Transaction()

  /*  const accounts = {
    controller,
    listing,
    inTokenMint,
    outTokenMint,
    pool,
    priceAggregator,
    tokenProgram: TOKEN_PROGRAM_ID,
    userAccount,
    userInTokenAta,
    userOutTokenAta,
    userWallet: wallet.publicKey
  }

  const { instruction } = getPoolProgram(wallet, connection, network)
  tx.add(await instruction.swap(amount, { accounts })) */

  return await signAndSendRawTransaction(connection, tx, wallet)
}

const withdraw = async (amount: number, wallet: any, connection: Connection, network: WalletAdapterNetwork) => {
  if (!wallet.publicKey) return

  const tx = new Transaction()

  /*  const accounts = {
    controller,
    listing,
    pool,
    poolAta,
    priceAggregator,
    tokenProgram: TOKEN_PROGRAM_ID,
    userAccount,
    userAta,
    userWallet: wallet.publicKey
  }

  const { instruction } = getPoolProgram(wallet, connection, network)
  tx.add(await instruction.withdrawCollateral(amount, { accounts })) */

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
