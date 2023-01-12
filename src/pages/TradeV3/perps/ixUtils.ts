/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Connection, Keypair, PublicKey, SystemProgram } from '@solana/web3.js'
import {
  INewOrderAccounts,
  IDepositFundsAccounts,
  IDepositFundsParams,
  IWithdrawFundsAccounts,
  IWithdrawFundsParams,
  IConsumeOB,
  ICancelOrderAccounts
} from '../../../types/dexterity_instructions'
import { sendTransaction } from '../../NFTs/launchpad/candyMachine/connection'
import {
  displayFractional,
  getDexProgram,
  getFeeModelConfigAcct,
  getMarketSigner,
  getRiskSigner,
  getTraderFeeAcct
} from './utils'
import * as anchor from '@project-serum/anchor'
import {
  DEX_ID,
  FEES_ID,
  FEE_OUTPUT_REGISTER,
  MPG_ID,
  MPs,
  ORDERBOOK_P_ID,
  RISK_ID,
  VAULT_MINT
} from './perpsConstants'
import { findAssociatedTokenAddress } from '../../../web3'
import { createAssociatedTokenAccountInstruction } from '@solana/spl-token-v2'
import { struct, u8 } from '@solana/buffer-layout'
import { notify } from '../../../utils'

export const newOrderIx = async (
  newOrderAccounts: INewOrderAccounts,
  newOrderParams,
  wallet,
  connection: Connection
) => {
  const instructions = []
  const dexProgram = await getDexProgram(connection, wallet)

  //instructions.push(await consumeOBIx(wallet, connection, consumeAccounts))
  instructions.push(
    await dexProgram.instruction.newOrder(newOrderParams, {
      accounts: {
        user: wallet.publicKey,
        traderRiskGroup: newOrderAccounts.traderRiskGroup,
        marketProductGroup: newOrderAccounts.marketProductGroup,
        product: newOrderAccounts.product,
        aaobProgram: newOrderAccounts.aaobProgram,
        orderbook: newOrderAccounts.orderbook,
        marketSigner: newOrderAccounts.marketSigner,
        eventQueue: newOrderAccounts.eventQueue,
        bids: newOrderAccounts.bids,
        asks: newOrderAccounts.asks,
        systemProgram: newOrderAccounts.systemProgram,
        feeModelProgram: newOrderAccounts.feeModelProgram,
        feeModelConfigurationAcct: newOrderAccounts.feeModelConfigurationAcct,
        traderFeeStateAcct: newOrderAccounts.traderFeeStateAcct,
        feeOutputRegister: newOrderAccounts.feeOutputRegister,
        riskEngineProgram: newOrderAccounts.riskEngineProgram,
        riskModelConfigurationAcct: newOrderAccounts.riskModelConfigurationAcct,
        riskOutputRegister: newOrderAccounts.riskOutputRegister,
        traderRiskStateAcct: newOrderAccounts.traderRiskStateAcct,
        riskAndFeeSigner: newOrderAccounts.riskAndFeeSigner
      }
    })
  )
  try {
    const response = await sendTransaction(connection, wallet, instructions, [])
    if (response && response.txid) {
      notify({
        message: 'Order placed Successfully!'
      })
    }
  } catch (e) {
    console.log(e)
    notify({
      message: 'Order failed!',
      type: 'error'
    })
  }
  //return response
}

export const cancelOrderIx = async (
  cancelOrderAccounts: ICancelOrderAccounts,
  cancelOrderParams,
  wallet,
  connection: Connection
) => {
  const instructions = []
  const dexProgram = await getDexProgram(connection, wallet)
  instructions.push(
    await dexProgram.instruction.cancelOrder(cancelOrderParams, {
      accounts: {
        user: wallet.publicKey,
        traderRiskGroup: cancelOrderAccounts.traderRiskGroup,
        marketProductGroup: cancelOrderAccounts.marketProductGroup,
        product: cancelOrderAccounts.product,
        aaobProgram: cancelOrderAccounts.aaobProgram,
        orderbook: cancelOrderAccounts.orderbook,
        marketSigner: cancelOrderAccounts.marketSigner,
        eventQueue: cancelOrderAccounts.eventQueue,
        bids: cancelOrderAccounts.bids,
        asks: cancelOrderAccounts.asks,
        systemProgram: cancelOrderAccounts.systemProgram,
        riskEngineProgram: cancelOrderAccounts.riskEngineProgram,
        riskModelConfigurationAcct: cancelOrderAccounts.riskModelConfigurationAcct,
        riskOutputRegister: cancelOrderAccounts.riskOutputRegister,
        traderRiskStateAcct: cancelOrderAccounts.traderRiskStateAcct,
        riskSigner: cancelOrderAccounts.riskAndFeeSigner
      }
    })
  )
  try {
    const response = await sendTransaction(connection, wallet, instructions, [])
    if (response && response.txid) {
      notify({
        message: 'Order canceled Successfully!'
      })
    }
  } catch (e) {
    console.log(e)
    notify({
      message: 'Order cancel failed!',
      type: 'error'
    })
  }
}

export const depositFundsIx = async (
  depositFundsAccounts: IDepositFundsAccounts,
  depositFundsParams: IDepositFundsParams,
  wallet: any,
  connection: Connection
) => {
  const instructions = []
  const dexProgram = await getDexProgram(connection, wallet)
  instructions.push(
    await dexProgram.instruction.depositFunds(depositFundsParams, {
      accounts: {
        tokenProgram: TOKEN_PROGRAM_ID,
        user: wallet.publicKey,
        userTokenAccount: depositFundsAccounts.userTokenAccount,
        traderRiskGroup: depositFundsAccounts.traderRiskGroup,
        marketProductGroup: depositFundsAccounts.marketProductGroup,
        marketProductGroupVault: depositFundsAccounts.marketProductGroupVault
      }
    })
  )
  try {
    const response = await sendTransaction(connection, wallet, instructions, [])
    if (response && response.txid) {
      notify({
        message: 'Deposit of ' + displayFractional(depositFundsParams.quantity) + ' successful'
      })
    }
    return response
  } catch (e) {
    notify({
      message: 'Deposit of ' + displayFractional(depositFundsParams.quantity) + ' failed',
      type: 'error'
    })
    return e
  }
}

export const initTrgDepositIx = async (
  depositFundsAccounts: IDepositFundsAccounts,
  depositFundsParams: IDepositFundsParams,
  wallet: any,
  connection: Connection,
  trg?: Keypair
) => {
  const [instructions, signers] = await initTrgIx(connection, wallet, trg)
  const dexProgram = await getDexProgram(connection, wallet)
  instructions.push(
    await dexProgram.instruction.depositFunds(depositFundsParams, {
      accounts: {
        tokenProgram: TOKEN_PROGRAM_ID,
        user: wallet.publicKey,
        userTokenAccount: depositFundsAccounts.userTokenAccount,
        traderRiskGroup: depositFundsAccounts.traderRiskGroup,
        marketProductGroup: depositFundsAccounts.marketProductGroup,
        marketProductGroupVault: depositFundsAccounts.marketProductGroupVault
      }
    })
  )
  const response = await sendTransaction(connection, wallet, instructions, signers)
  return response
}

export const withdrawFundsIx = async (
  withdrawFundsAccounts: IWithdrawFundsAccounts,
  withdrawFundsParams: IWithdrawFundsParams,
  wallet: any,
  connection: Connection
) => {
  const instructions = []
  const dexProgram = await getDexProgram(connection, wallet)
  instructions.push(
    await dexProgram.instruction.withdrawFunds(withdrawFundsParams, {
      accounts: {
        tokenProgram: TOKEN_PROGRAM_ID,
        user: wallet.publicKey,
        userTokenAccount: withdrawFundsAccounts.userTokenAccount,
        traderRiskGroup: withdrawFundsAccounts.traderRiskGroup,
        marketProductGroup: withdrawFundsAccounts.marketProductGroup,
        marketProductGroupVault: withdrawFundsAccounts.marketProductGroupVault,
        riskEngineProgram: withdrawFundsAccounts.riskEngineProgram,
        riskModelConfigurationAcct: withdrawFundsAccounts.riskModelConfigurationAcct,
        riskOutputRegister: withdrawFundsAccounts.riskOutputRegister,
        traderRiskStateAcct: withdrawFundsAccounts.traderRiskStateAcct,
        riskSigner: withdrawFundsAccounts.riskSigner
      }
    })
  )
  try {
    const response = await sendTransaction(connection, wallet, instructions, [])
    if (response && response.txid) {
      notify({
        message: 'Funds withdrawn Successfully!'
      })
    }
  } catch (e) {
    console.log(e)
    notify({
      message: 'Withdrawl failed. Please try again with a smaller amount',
      type: 'error'
    })
  }
}

function createFirstInstructionData() {
  const aa = u8('instruction')
  const dataLayout = struct([aa as any])

  const data = Buffer.alloc(dataLayout.span)
  dataLayout.encode(
    {
      instruction: 1
    },
    data
  )

  return data
}

export const initializeTraderFeeAcctIx = (args) => {
  const keys = [
    {
      pubkey: args.payer,
      isSigner: true,
      isWritable: false
    },
    //{
    //  pubkey: args.feeModelConfigAcct,
    //  isSigner: false,
    //  isWritable: false
    //},
    {
      pubkey: args.traderFeeAcct,
      isSigner: false,
      isWritable: true
    },
    {
      pubkey: new PublicKey(MPG_ID),
      isSigner: false,
      isWritable: false
    },
    {
      pubkey: args.traderRiskGroup.publicKey,
      isSigner: false,
      isWritable: false
    },
    {
      pubkey: anchor.web3.SystemProgram.programId,
      isSigner: false,
      isWritable: false
    }
  ]
  return new anchor.web3.TransactionInstruction({
    keys,
    programId: new PublicKey(FEES_ID),
    data: createFirstInstructionData()
  })
}

export const initTrgIx = async (connection: Connection, wallet: any, trgKey?: Keypair) => {
  let instructions = []
  const riskStateAccount = anchor.web3.Keypair.generate()
  const traderRiskGroup = trgKey ?? anchor.web3.Keypair.generate()
  const traderFeeAcct = getTraderFeeAcct(traderRiskGroup.publicKey)
  const riskSigner = getRiskSigner()

  const mint = new PublicKey(VAULT_MINT)
  const associatedTokenAddress = await findAssociatedTokenAddress(wallet.publicKey, mint)
  if (!associatedTokenAddress) {
    instructions.push(
      createAssociatedTokenAccountInstruction(
        wallet.publicKey, // payer
        associatedTokenAddress, // ata
        wallet.publicKey, // owner
        mint // mint
      )
    )
    //const res = await sendTransaction(connection, wallet, instructions, [])
    //console.log(res)
  }
  instructions = []
  instructions.push(
    initializeTraderFeeAcctIx({
      payer: wallet.publicKey,
      traderFeeAcct: traderFeeAcct,
      traderRiskGroup: traderRiskGroup,
      feeModelConfigAcct: getFeeModelConfigAcct()
    })
  )

  instructions.push(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: traderRiskGroup.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(34448), //Need to change
      space: 34448, //Need to change
      programId: new PublicKey(DEX_ID)
    })
  )

  const dexProgram = await getDexProgram(connection, wallet)
  const ix = await dexProgram.instruction.initializeTraderRiskGroup({
    accounts: {
      owner: wallet.publicKey,
      traderRiskGroup: traderRiskGroup.publicKey,
      marketProductGroup: new PublicKey(MPG_ID),
      riskSigner: riskSigner,
      traderRiskStateAcct: riskStateAccount.publicKey,
      traderFeeStateAcct: traderFeeAcct,
      riskEngineProgram: new PublicKey(RISK_ID),
      systemProgram: SystemProgram.programId
    }
  })
  instructions.push(ix)
  return [instructions, [riskStateAccount, traderRiskGroup]]
}

export const initializeTRG = async (wallet: any, connection: Connection) => {
  const [instructions, signers] = await initTrgIx(connection, wallet)
  const res = await sendTransaction(connection, wallet, instructions, signers)
  //const res = await sendTransaction(connection, wallet, instructions, [])
  console.log(res)
  return res
}

export const consumeOBIx = async (wallet: any, connection: Connection, accounts: IConsumeOB) => {
  const instructions = []
  const dexProgram = await getDexProgram(connection, wallet)
  instructions.push(
    await dexProgram.instruction.consumeOrderbookEvents(
      { maxIterations: new anchor.BN(1) },
      {
        accounts: {
          aaobProgram: accounts.aaobProgram,
          marketProductGroup: accounts.marketProductGroup,
          product: accounts.product,
          marketSigner: accounts.marketSigner,
          orderbook: accounts.orderbook,
          eventQueue: accounts.eventQueue,
          rewardTarget: accounts.rewardTarget,
          feeModelProgram: accounts.feeModelProgram,
          feeModelConfigurationAcct: accounts.feeModelConfigurationAcct,
          feeOutputRegister: accounts.feeOutputRegister,
          riskAndFeeSigner: accounts.riskAndFeeSigner
        }
      }
    )
  )
  return instructions[0]
}
