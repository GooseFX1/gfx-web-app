import { Amount } from './../pages/Synths/Pools/Swap/shared'
import { Metadata } from './nfts/metadata'
import BN from 'bn.js'
import { Program, Provider, workspace } from '@project-serum/anchor'
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
import { ADDRESSES, SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID, SYSTEM, FEE_PAYER_WITHDRAWAL_ACCT } from './ids'
import { createAssociatedTokenAccountIx, findAssociatedTokenAddress, signAndSendRawTransaction } from './utils'
import {
  AUCTION_HOUSE,
  AUCTION_HOUSE_PREFIX,
  AUCTION_HOUSE_AUTHORITY,
  AH_FEE_ACCT,
  AUCTION_HOUSE_PROGRAM_ID,
  TREASURY_MINT,
  BuyInstructionArgs,
  getMetadata,
  BuyInstructionAccounts,
  createBuyInstruction,
  createCancelInstruction,
  CancelInstructionArgs,
  CancelInstructionAccounts,
  StringPublicKey,
  STAKE_PREFIX,
  toPublicKey,
  bnTo8
} from '../web3'
import { connect } from 'http2'
const StakeIDL = require('./idl/stake.json')
const { blob, struct, u8 } = require('buffer-layout')

const CONTROLLER_KEY = new PublicKey('8CxKnuJeoeQXFwiG6XiGY2akBjvJA5k3bE52BfnuEmNQ')
const GOFX_MINT = 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD'

const getStakeProgram = (wallet: WalletContextState, connection: Connection, network: WalletAdapterNetwork): Program =>
  new Program(
    StakeIDL,
    ADDRESSES[network].programs.stake.address,
    new Provider(connection, wallet as any, { commitment: 'processed' })
  )

export const executeStake = async (
  wallet: WalletContextState,
  connection: Connection,
  network: WalletAdapterNetwork,
  amount: number
) => {
  const program = getStakeProgram(wallet, connection, network)
  const stakingAccountKey: [PublicKey, number] = await PublicKey.findProgramAddress(
    [Buffer.from(STAKE_PREFIX), CONTROLLER_KEY.toBuffer(), wallet.publicKey.toBuffer()],
    toPublicKey(StakeIDL.metadata.address)
  )
  amount = 1 * LAMPORTS_PER_SOL // make it amount * LAMP
  const amountInBN: BN = new BN(amount)
  try {
    // getting user staking account if already exists format user staking account to publicKey
    const userStakingAccount = await program.account.stakingAccount.fetch(stakingAccountKey[0])
    stakeAmount(amountInBN, program, stakingAccountKey[0], wallet, connection)
  } catch (err) {
    // user account does not exists , create a new user account
    //const newUserStakingAccount = await createStakingAccount(wallet, connection, network);
    //stakeAmount(amount, newUserStakingAccount);
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
  //const stakeAmountIX : TransactionInstruction = await program.instruction.stake(amountInBN , { accounts: stakingAmountInstruction })
  //const stakeAmountTX : Transaction = new Transaction().add(stakeAmountIX);
  //const signature = await wallet.sendTransaction(stakeAmountTX, connection)
  // console.log(signature)
  // const confirm = await connection.confirmTransaction(signature, 'processed')
  // console.log(confirm, 'stake amount')
  let controllerAcc = await program.account.controller.fetch(CONTROLLER_KEY)
  let stakingAccountAcc = await program.account.stakingAccount.fetch(stakingAccountKey)
  let userStakePlusEarn = (controllerAcc.stakingBalance * stakingAccountAcc.share) / controllerAcc.totalStakingShare
  console.log(
    stakingAccountAcc.amountStaked.toString(),
    stakingAccountAcc,
    Number(stakingAccountAcc.share + ''),
    'stake details'
  )
}
//Number(BN + "")
const executeUnstakeAndClaim = async (
  percent: BN,
  program: any,
  stakingAccountKey: PublicKey,
  wallet: WalletContextState,
  connection: Connection
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
  const unstakeAmountIX: TransactionInstruction = await program.instruction.unstake(new BN(10000), {
    accounts: unstakeAmountInstruction
  })
  const unstakeAmountTX: Transaction = new Transaction().add(unstakeAmountIX)
  const signature = await wallet.sendTransaction(unstakeAmountTX, connection)
  console.log(signature)
  const confirm = await connection.confirmTransaction(signature, 'processed')
  console.log(confirm, 'unstake amount ')
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
