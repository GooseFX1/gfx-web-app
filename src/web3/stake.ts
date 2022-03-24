import BN from 'bn.js'
import { Program, Provider } from '@project-serum/anchor'
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
import { createAssociatedTokenAccountIx, findAssociatedTokenAddress, signAndSendRawTransaction } from './utils'
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
  wallet: WalletContextState,
  connection: Connection,
  network: WalletAdapterNetwork,
  amount: number
) => {
  //these 2 will be same irrespective of coins
  const program = getStakeProgram(wallet, connection, network)
  const stakingAccountKey: [PublicKey, number] = await PublicKey.findProgramAddress(
    [Buffer.from(STAKE_PREFIX), CONTROLLER_KEY.toBuffer(), wallet.publicKey.toBuffer()],
    toPublicKey(StakeIDL.metadata.address)
  )
  const amountInLamport = amount * LAMPORTS_PER_SOL
  const amountInBN: BN = new BN(amountInLamport)
  try {
    // getting user staking account if already exists format user staking account to publicKey
    const userStakingAccount = await program.account.stakingAccount.fetch(stakingAccountKey[0])
    stakeAmount(amountInBN, program, stakingAccountKey[0], wallet, connection)
  } catch (err) {
    // user account does not exists , create a new user account
    const newUserStakingAccount = await createStakingAccount(wallet, connection, network)
    stakeAmount(amountInBN, program, stakingAccountKey[0], wallet, connection)
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
  const stakeAmountTX: Transaction = new Transaction().add(stakeAmountIX)
  const signature = await wallet.sendTransaction(stakeAmountTX, connection)
  console.log(signature)
  const confirm = await connection.confirmTransaction(signature, 'processed')
  console.log(confirm, 'stake amount')

  // const stakingAccountKey2: [PublicKey, number] = await PublicKey.findProgramAddress(
  //   [Buffer.from(STAKE_PREFIX), CONTROLLER_KEY.toBuffer(), wallet.publicKey.toBuffer()],
  //   toPublicKey(StakeIDL.metadata.address)
  // )
  // const { data } = await connection.getAccountInfo(stakingAccountKey2[0])
  // const { amountStaked, share } = LAYOUT.decode(data)
  // console.log(amountStaked / LAMPORTS_PER_SOL, share.toNumber() / LAMPORTS_PER_SOL, 'staked amount')

  // const { data: controllerData } = await connection.getAccountInfo(CONTROLLER_KEY)
  // const controllerDataDecoded = CONTROLLER_LAYOUT.decode(controllerData)
  // console.log(controllerDataDecoded)
  // console.log(controllerDataDecoded.staking_balance.toNumber() / LAMPORTS_PER_SOL)
  // const controllerDecoded = CONTROLLER_LAYOUT.decode()
  // let controllerAcc = await program.account.controller.fetch(CONTROLLER_KEY)
  // let stakingAccountAcc = await program.account.stakingAccount.fetch(stakingAccountKey)
  // let userStakePlusEarn = (controllerAcc.stakingBalance * stakingAccountAcc.share) / controllerAcc.totalStakingShare

  // const decoded = LAYOUT.decode(stakingAccountAcc.data)

  // const { amountStaked } = decoded
  // console.log(amountStaked)
  // console.log({ sighash: decoded.sighash, amountStaked: decoded.amountStaked + '' })
}

export const executeUnstakeAndClaim = async (
  wallet: WalletContextState,
  connection: Connection,
  network: WalletAdapterNetwork,
  percent: BN,
  program: any,
  stakingAccountKey: PublicKey
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
  //@ts-ignore
  const unstakeAmountIX: TransactionInstruction = await program.instruction.unstake(new BN(percent * 100), {
    accounts: unstakeAmountInstruction
  })
  const unstakeAmountTX: Transaction = new Transaction().add(unstakeAmountIX)
  console.log(percent)
  // const signature = await wallet.sendTransaction(unstakeAmountTX, connection)
  // console.log(signature)
  // const confirm = await connection.confirmTransaction(signature, 'processed')
  // console.log(confirm, 'unstake amount ')
}

const fetchCurrentAmountStaked = () => {
  // let controllerAcc = await program.account.controller.fetch(controllerKey);
  // let stakingAccountAcc = await program.account.stakingAccount.fetch(stakingAccountKey);
}

const fetchCurrentAmountEarned = () => {}

export const createStakingAccount = async (
  wallet: WalletContextState,
  connection: Connection,
  network: WalletAdapterNetwork
) => {
  const program = getStakeProgram(wallet, connection, network)
  const stakingAccountKey: [PublicKey, number] = await PublicKey.findProgramAddress(
    [Buffer.from(STAKE_PREFIX), CONTROLLER_KEY.toBuffer(), wallet.publicKey.toBuffer()],
    toPublicKey(StakeIDL.metadata.address)
  )

  const createStakingInstructionAccounts = {
    controller: CONTROLLER_KEY,
    stakingAccount: stakingAccountKey[0],
    userWallet: wallet.publicKey,
    systemProgram: SYSTEM,
    rent: SYSVAR_RENT_PUBKEY
  }
  // @ts-ignore
  const createStakingIX: TransactionInstruction = await program.instruction.createStakingAccount({
    accounts: createStakingInstructionAccounts
  })
  const transaction = new Transaction().add(createStakingIX)
  const signature = await wallet.sendTransaction(transaction, connection)
  console.log(signature)
  const confirm = await connection.confirmTransaction(signature, 'processed')
  console.log(confirm)
}
