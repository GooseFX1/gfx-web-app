import BN from 'bn.js'
import { Idl, Instruction, Program, Provider } from '@project-serum/anchor'
import { u64, publicKeyLayout } from './layout'
import { TOKEN_PROGRAM_ID } from '@project-serum/serum/lib/token-instructions'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletContextState } from '@solana/wallet-adapter-react'
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  SYSVAR_RENT_PUBKEY,
  LAMPORTS_PER_SOL
} from '@solana/web3.js'
import { SYSTEM } from './ids'
import { findAssociatedTokenAddress } from './utils'
import { STAKE_PREFIX, toPublicKey, ADDRESSES } from '../web3'
const StakeIDL = require('./idl/stake.json')
const { blob, struct, u8 } = require('buffer-layout')

export const CONTROLLER_KEY = new PublicKey('8CxKnuJeoeQXFwiG6XiGY2akBjvJA5k3bE52BfnuEmNQ')
const GOFX_MINT = 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD'

const LAYOUT = struct([
  blob(8, 'sighash'),
  publicKeyLayout('controller'),
  u8('bump'),
  blob(7),
  u64('share'),
  u64('amountStaked'),
  blob(256, 'padding')
])

export const CONTROLLER_LAYOUT = struct([
  blob(8, 'sighash'),
  blob(32, 'seed'),
  u8('bump'),
  publicKeyLayout('admin'),
  u8('suspended'),
  u8('decimals'),
  publicKeyLayout('mint'),
  blob(5, 'padding'),
  u64('daily_reward'),
  u64('total_staking_share'),
  u64('staking_balance'),
  u64('lastDistributionTime'),
  blob(256, 'padding')
])

export const getStakeProgram = (
  wallet: WalletContextState,
  connection: Connection,
  network: WalletAdapterNetwork
): Program =>
  new Program(
    StakeIDL,
    ADDRESSES[network].programs.stake.address,
    new Provider(connection, wallet as any, { commitment: 'confirmed' })
  )

export const getStakingAccountKey = async (wallet: WalletContextState): Promise<undefined | PublicKey> => {
  try {
    const stakingAccountKey: [PublicKey, number] = await PublicKey.findProgramAddress(
      [Buffer.from(STAKE_PREFIX), CONTROLLER_KEY.toBuffer(), wallet.publicKey.toBuffer()],
      toPublicKey(StakeIDL.metadata.address)
    )
    return stakingAccountKey[0]
  } catch (err) {
    return undefined
  }
}

export const executeStake = async (
  program: Program<Idl>,
  stakingAccountKey: PublicKey | undefined,
  wallet: WalletContextState,
  connection: Connection,
  network: WalletAdapterNetwork,
  amount: number
) => {
  //these 2 will be same irrespective of coins program and stakingAccountKey
  const amountInLamport = amount * LAMPORTS_PER_SOL
  const amountInBN: BN = new BN(amountInLamport)
  try {
    // getting user staking account if already exists format user staking account to publicKey
    const userStakingAccount = await program.account.stakingAccount.fetch(stakingAccountKey)
    return stakeAmount(amountInBN, program, stakingAccountKey, wallet, connection, undefined)
  } catch (err) {
    console.log(err)
  }
  try {
    // user account does not exists , create a new user account
    const createStakingIX = await createStakingAccountIX(program, stakingAccountKey, wallet)
    console.log('created a new GOFX staking account')
    return stakeAmount(amountInBN, program, stakingAccountKey, wallet, connection, createStakingIX)
  } catch (err) {
    return err
  }
}

const stakeAmount = async (
  amountInBN: BN,
  program: any,
  stakingAccountKey: PublicKey,
  wallet: WalletContextState,
  connection: Connection,
  createStakingIX: TransactionInstruction | undefined
) => {
  //TODO : mint Address need to be passed into the function when more tokens are supported
  const tokenVault: PublicKey = await findAssociatedTokenAddress(CONTROLLER_KEY, toPublicKey(GOFX_MINT))
  const userTokenVault: PublicKey = await findAssociatedTokenAddress(wallet.publicKey, toPublicKey(GOFX_MINT))

  const stakingAmountInstruction = {
    controller: CONTROLLER_KEY,
    stakingAccount: stakingAccountKey,
    vault: tokenVault,
    userAta: userTokenVault,
    userWallet: wallet.publicKey,
    tokenProgram: TOKEN_PROGRAM_ID
  }
  //@ts-ignore
  const stakeAmountIX: TransactionInstruction = await program.instruction.stake(amountInBN, {
    accounts: stakingAmountInstruction
  })
  let signature
  try {
    const stakeAmountTX: Transaction = new Transaction()
    if (createStakingIX !== undefined) stakeAmountTX.add(createStakingIX)

    stakeAmountTX.add(stakeAmountIX)

    signature = await wallet.sendTransaction(stakeAmountTX, connection)
    console.log(signature)

    const confirm = await connection.confirmTransaction(signature, 'confirmed')
    console.log(confirm, 'stake amount')
    return { confirm, signature }
  } catch (error) {
    console.log(error, 'stake error')
    return { error, signature }
  }
}

export const executeUnstakeAndClaim = async (
  program: Program<Idl>,
  stakingAccountKey: PublicKey,
  wallet: WalletContextState,
  connection: Connection,
  network: WalletAdapterNetwork,
  percent: number
) => {
  //TODO : mint Address need to be passed into the function when more tokens are supported
  const tokenVault: PublicKey = await findAssociatedTokenAddress(CONTROLLER_KEY, toPublicKey(GOFX_MINT))
  const userTokenAta: PublicKey = await findAssociatedTokenAddress(wallet.publicKey, toPublicKey(GOFX_MINT))

  const unstakeAmountInstruction = {
    controller: CONTROLLER_KEY,
    stakingAccount: stakingAccountKey,
    mint: GOFX_MINT,
    vault: tokenVault,
    userAta: userTokenAta,
    userWallet: wallet.publicKey,
    tokenProgram: TOKEN_PROGRAM_ID
  }
  let signature
  try {
    //@ts-ignore
    const unstakeAmountIX: TransactionInstruction = await program.instruction.unstake(new BN(percent * 100), {
      accounts: unstakeAmountInstruction
    })
    const unstakeAmountTX: Transaction = new Transaction().add(unstakeAmountIX)
    signature = await wallet.sendTransaction(unstakeAmountTX, connection)
    const confirm = await connection.confirmTransaction(signature, 'processed')
    console.log(confirm)

    return { confirm, signature }
  } catch (error) {
    return { error, signature }
  }
}

export const fetchCurrentAmountStaked = async (
  connection: Connection,
  stakingAccountKey: PublicKey,
  wallet: WalletContextState
) => {
  try {
    const stakedAmountKey: [PublicKey, number] = await PublicKey.findProgramAddress(
      [Buffer.from(STAKE_PREFIX), CONTROLLER_KEY.toBuffer(), wallet.publicKey.toBuffer()],
      toPublicKey(StakeIDL.metadata.address)
    )
    const { data } = await connection.getAccountInfo(stakedAmountKey[0])
    const { amountStaked, share } = LAYOUT.decode(data)
    const { data: controllerData } = await connection.getAccountInfo(CONTROLLER_KEY)
    const { staking_balance, total_staking_share } = CONTROLLER_LAYOUT.decode(controllerData)

    // calculations
    const amountStakedPlusEarned = (staking_balance * share) / total_staking_share
    const amountEarned = amountStakedPlusEarned - amountStaked

    return {
      tokenStakedPlusEarned: amountStakedPlusEarned / LAMPORTS_PER_SOL,
      tokenStaked: amountStaked / LAMPORTS_PER_SOL,
      tokenEarned: amountEarned / LAMPORTS_PER_SOL,
      stakingBalance: staking_balance / LAMPORTS_PER_SOL
    }
  } catch (err) {
    console.log(err)
    return err
  }
}

export const createStakingAccountIX = async (
  program: Program<Idl>,
  stakingAccountKey: PublicKey,
  wallet: WalletContextState
) => {
  // check for sol in wallet
  const createStakingInstructionAccounts = {
    controller: CONTROLLER_KEY,
    stakingAccount: stakingAccountKey,
    userWallet: wallet.publicKey,
    systemProgram: SYSTEM,
    rent: SYSVAR_RENT_PUBKEY
  }
  // @ts-ignore
  const createStakingIX: TransactionInstruction = await program.instruction.createStakingAccount({
    accounts: createStakingInstructionAccounts
  })
  return createStakingIX
}
