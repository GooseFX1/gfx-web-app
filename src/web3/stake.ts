import BN from 'bn.js'
import { Idl, Program, Provider } from '@project-serum/anchor'
import { accountFlagsLayout, publicKeyLayout, u128, u64 } from './layout'
import { TOKEN_PROGRAM_ID } from '@project-serum/serum/lib/token-instructions'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletContextState } from '@solana/wallet-adapter-react'
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  TransactionSignature,
  SYSVAR_RENT_PUBKEY,
  LAMPORTS_PER_SOL
} from '@solana/web3.js'
import { ADDRESSES, SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID, SYSTEM } from './ids'
import { findAssociatedTokenAddress } from './utils'
import { STAKE_PREFIX, toPublicKey } from '../web3'
const StakeIDL = require('./idl/stake.json')
const { blob, struct, u8, u32 } = require('buffer-layout')

const CONTROLLER_KEY = new PublicKey('8CxKnuJeoeQXFwiG6XiGY2akBjvJA5k3bE52BfnuEmNQ')
const GOFX_MINT = 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD'

const LAYOUT = struct([blob(8, 'sighash'), blob(40), u64('share'), u64('amountStaked')])

const CONTROLLER_LAYOUT = struct([
  blob(8, 'sighash'),
  blob(112),
  u64('total_staking_share'),
  u64('staking_balance'),
  u64('last_distribution_time')
])

const getStakeProgram = (wallet: WalletContextState, connection: Connection, network: WalletAdapterNetwork): Program =>
  new Program(
    StakeIDL,
    ADDRESSES[network].programs.stake.address,
    new Provider(connection, wallet as any, { commitment: 'processed' })
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
    return stakeAmount(amountInBN, program, stakingAccountKey, wallet, connection)
  } catch (err) {
    console.log(err)
  }
  try {
    // user account does not exists , create a new user account
    const newUserStakingAccount = await createStakingAccount(program, stakingAccountKey, wallet, connection, network)
    console.log('created a new GOFX staking account')
    return stakeAmount(amountInBN, program, stakingAccountKey, wallet, connection)
  } catch (err) {
    return err
  }
}

const stakeAmount = async (
  amountInBN: BN,
  program: any,
  stakingAccountKey: PublicKey,
  wallet: WalletContextState,
  connection: Connection
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
  try {
    const stakeAmountTX: Transaction = new Transaction().add(stakeAmountIX)
    const signature = await wallet.sendTransaction(stakeAmountTX, connection)
    console.log(signature)
    const confirm = await connection.confirmTransaction(signature, 'processed')
    console.log(confirm, 'stake amount')
    return confirm
  } catch (error) {
    return error
  }
}

export const executeUnstakeAndClaim = async (
  program: Program<Idl>,
  stakingAccountKey: PublicKey,
  wallet: WalletContextState,
  connection: Connection,
  network: WalletAdapterNetwork,
  percent: BN
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
  try {
    //@ts-ignore
    const unstakeAmountIX: TransactionInstruction = await program.instruction.unstake(new BN(percent * 100), {
      accounts: unstakeAmountInstruction
    })
    const unstakeAmountTX: Transaction = new Transaction().add(unstakeAmountIX)
    const signature = await wallet.sendTransaction(unstakeAmountTX, connection)
    const confirm = await connection.confirmTransaction(signature, 'processed')
    console.log(confirm, 'unstake amount ')
    return confirm
  } catch (err) {
    return err
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
    const amountStakedHR = amountStaked / LAMPORTS_PER_SOL
    const totalShare = share.toNumber() / LAMPORTS_PER_SOL
    const stakingBalance = staking_balance.toNumber() / LAMPORTS_PER_SOL
    const totalStakingShare = total_staking_share.toNumber() / LAMPORTS_PER_SOL
    const amountStakedPlusEarned = (stakingBalance * totalShare) / totalStakingShare
    const amountEarned = amountStakedPlusEarned - amountStakedHR
    return { tokenStakedPlusEarned: amountStakedPlusEarned, tokenStaked: amountStakedHR, tokenEarned: amountEarned }
  } catch (err) {
    console.log(err)
    return err
  }
}

export const createStakingAccount = async (
  program: Program<Idl>,
  stakingAccountKey: PublicKey,
  wallet: WalletContextState,
  connection: Connection,
  network: WalletAdapterNetwork
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
  const transaction = new Transaction().add(createStakingIX)
  try {
    const signature = await wallet.sendTransaction(transaction, connection)
    console.log(signature)
    const confirm = await connection.confirmTransaction(signature, 'processed')
    console.log(confirm)
    return signature
  } catch (err) {
    //add notification
    console.log(err)
  }
}
