import BN from 'bn.js'
import { Idl, Program } from '@project-serum/anchor'
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
import { ADDRESSES as SDK_ADDRESS } from 'goosefx-ssl-sdk'
import { CONTROLLER_LAYOUT, STAKING_ACCOUNT_LAYOUT } from 'goosefx-ssl-sdk'

export const getStakingAccountKey = async (
  wallet: WalletContextState,
  network: any
): Promise<undefined | PublicKey> => {
  const NETWORK = getNetworkConnection(network)
  try {
    const stakingAccountKey: [PublicKey, number] = await PublicKey.findProgramAddress(
      [Buffer.from(STAKE_PREFIX), SDK_ADDRESS[NETWORK].GFX_CONTROLLER.toBuffer(), wallet.publicKey.toBuffer()],
      toPublicKey(SDK_ADDRESS[NETWORK].CONTROLLER_PROGRAM_ID)
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
    const userStakingAccount = await connection.getAccountInfo(stakingAccountKey)
    if (userStakingAccount !== null)
      return stakeAmount(network, amountInBN, program, stakingAccountKey, wallet, connection, undefined)
    else {
      // user account does not exists , create a new user account
      const createStakingIX = await createStakingAccountIX(network, program, stakingAccountKey, wallet)
      return stakeAmount(network, amountInBN, program, stakingAccountKey, wallet, connection, createStakingIX)
    }
  } catch (err) {
    console.log(err)
    return err
  }
}

const getGOFXMintAddress = (network): string => ADDRESSES[network].mints['GOFX'].address
const stakeAmount = async (
  network: WalletAdapterNetwork,
  amountInBN: BN,
  program: any,
  stakingAccountKey: PublicKey,
  wallet: WalletContextState,
  connection: Connection,
  createStakingIX: TransactionInstruction | undefined
) => {
  const GOFX_MINT = getGOFXMintAddress(network)
  const CONTROLLER_KEY = SDK_ADDRESS[getNetworkConnection(network)].GFX_CONTROLLER
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

    signature = await wallet.sendTransaction(stakeAmountTX, connection, { skipPreflight: true })
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
  const GOFX_MINT = getGOFXMintAddress(network)
  const CONTROLLER_KEY = SDK_ADDRESS[getNetworkConnection(network)].GFX_CONTROLLER
  // get admin from controller
  //TODO : mint Address need to be passed into the function when more tokens are supported
  const tokenVault: PublicKey = await findAssociatedTokenAddress(CONTROLLER_KEY, toPublicKey(GOFX_MINT))
  const userTokenAta: PublicKey = await findAssociatedTokenAddress(wallet.publicKey, toPublicKey(GOFX_MINT))
  const feeCollectorAta: PublicKey = await findAssociatedTokenAddress(getAdmin(network), toPublicKey(GOFX_MINT))
  const unstakeAmountInstruction = {
    controller: CONTROLLER_KEY,
    stakingAccount: stakingAccountKey,
    vault: tokenVault,
    userAta: userTokenAta,
    feeCollectorAta: feeCollectorAta,
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
    signature = await wallet.sendTransaction(unstakeAmountTX, connection, { skipPreflight: true })
    console.log(signature)
    const confirm = await connection.confirmTransaction(signature, 'processed')
    console.log(confirm)

    return { confirm, signature }
  } catch (error) {
    return { error, signature }
  }
}

export const getNetworkConnection = (network) => (network === 'devnet' ? 'DEVNET' : 'MAINNET')
const getAdmin = (network) => ADDRESSES[network].programs.stake.admin

export const fetchCurrentAmountStaked = async (
  connection: Connection,
  network: WalletAdapterNetwork,
  wallet: WalletContextState
) => {
  const NETWORK = getNetworkConnection(network)
  const CONTROLLER_KEY = SDK_ADDRESS[getNetworkConnection(network)].GFX_CONTROLLER

  try {
    const stakedAmountKey: [PublicKey, number] = await PublicKey.findProgramAddress(
      [Buffer.from(STAKE_PREFIX), CONTROLLER_KEY.toBuffer(), wallet.publicKey.toBuffer()],
      toPublicKey(SDK_ADDRESS[NETWORK].CONTROLLER_PROGRAM_ID)
    )
    const { data } = await connection.getAccountInfo(stakedAmountKey[0])
    const { amountStaked, share } = STAKING_ACCOUNT_LAYOUT.decode(data)
    const { data: controllerData } = await connection.getAccountInfo(CONTROLLER_KEY)
    const { stakingBalance, totalStakingShare } = CONTROLLER_LAYOUT.decode(controllerData)
    //@ts-ignore
    const amountStakedPlusEarned = (stakingBalance * share) / totalStakingShare
    const amountEarned = Number(amountStakedPlusEarned) - Number(amountStaked)

    return {
      tokenStakedPlusEarned: Number(amountStakedPlusEarned) / LAMPORTS_PER_SOL,
      tokenStaked: Number(amountStaked) / LAMPORTS_PER_SOL,
      tokenEarned: amountEarned / LAMPORTS_PER_SOL,
      stakingBalance: Number(stakingBalance) / LAMPORTS_PER_SOL
    }
  } catch (err) {
    return err
  }
}

export const createStakingAccountIX = async (
  network: WalletAdapterNetwork,
  program: Program<Idl>,
  stakingAccountKey: PublicKey,
  wallet: WalletContextState
) => {
  const CONTROLLER_KEY = SDK_ADDRESS[getNetworkConnection(network)].GFX_CONTROLLER
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
