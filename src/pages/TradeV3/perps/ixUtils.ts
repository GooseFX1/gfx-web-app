/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Connection, Keypair, PublicKey, SystemProgram, TransactionInstruction } from '@solana/web3.js'
import {
  INewOrderAccounts,
  IDepositFundsAccounts,
  IDepositFundsParams,
  IWithdrawFundsParams,
  IConsumeOB
} from '../../../types/dexterity_instructions'
import { buildTransaction, sendPerpsTransaction, sendPerpsTransactions } from '../../../web3/connection'
import { getDexProgram, getRiskSigner, getTraderFeeAcct } from './utils'
import * as anchor from '@project-serum/anchor'
import { FEES_ID, MPG_ID as MAINNET_MPG_ID, RISK_ID } from './perpsConstants'
import { MPG_ID as DEVNET_MPG_ID } from './perpsConstantsDevnet'
import { struct, u8 } from '@solana/buffer-layout'
import { notify } from '../../../utils'
import { createRandom } from '../../../hooks/useReferrals'
import { Trader, Product, Perp } from 'gfx-perp-sdk'

export const newOrderIx = async (
  newOrderParams,
  wallet,
  connection: Connection,
  traderInstanceSdk: Trader,
  productInstanceSdk: Product
) => {
  try {
    const ix = await traderInstanceSdk.newOrderIx(
      newOrderParams.maxBaseQty,
      newOrderParams.limitPrice,
      newOrderParams.side,
      newOrderParams.orderType,
      productInstanceSdk
    )
    const instructions = []
    instructions.push(ix)

    const response = await sendPerpsTransaction(connection, wallet, instructions, [], {
      startMessage: {
        header: 'New Order',
        description: 'Sign the transaction to place a new order!'
      },
      progressMessage: {
        header: 'New Order',
        description: 'Submitting new order on the network..'
      },
      endMessage: {
        header: 'New Order',
        description: 'New order successfully placed'
      },
      errorMessage: {
        header: 'New Order',
        description: 'There was an error in placing the order'
      }
    })
    if (response && response.txid) {
      //  perpsNotify({
      //    action: 'close',
      //    message: 'Order placed Successfully!',
      //    key: 12,
      //    styles: {}
      //  })
    }
    return response
  } catch (e) {
    console.log(e)
    //notify({
    //  message: 'Order failed!',
    //  type: 'error'
    //})
  }
  return null
}

export const newTakeProfitOrderIx = async (
  newOrderAccounts: INewOrderAccounts,
  newOrderParams,
  newTakeProfitOrderParams,
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
  instructions.push(
    await dexProgram.instruction.newOrder(newTakeProfitOrderParams, {
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
    const response = await sendPerpsTransaction(connection, wallet, instructions, [], {
      startMessage: {
        header: 'New Order',
        description: 'Sign the transaction to place a new order!'
      },
      progressMessage: {
        header: 'New Order',
        description: 'Submitting new order on the network..'
      },
      endMessage: {
        header: 'New Order',
        description: 'New order successfully placed'
      },
      errorMessage: {
        header: 'New Order',
        description: 'There was an error in placeing the order'
      }
    })
    return response
  } catch (e) {
    console.log(e)
  }
  return null
}

export const cancelOrderIx = async (
  cancelOrderParams,
  wallet,
  connection: Connection,
  traderInstanceSdk: Trader,
  productInstanceSdk: Product
) => {
  try {
    const instructions = []
    const ix = await traderInstanceSdk.cancelOrderIx(cancelOrderParams.orderId, productInstanceSdk)
    instructions.push(ix)
    const response = await sendPerpsTransaction(connection, wallet, instructions, [], {
      startMessage: {
        header: 'Cancel Order',
        description: 'Sign the transaction to cancel the order!'
      },
      progressMessage: {
        header: 'Cancel Order',
        description: 'Cancelling order on the network..'
      },
      endMessage: {
        header: 'Cancel Order',
        description: 'Order cancelled'
      },
      errorMessage: {
        header: 'Cancel Order',
        description: 'There was an error in cancelling the order'
      }
    })
    return response
  } catch (e) {
    console.log(e)
    notify({
      message: 'Order cancel failed!',
      type: 'error'
    })
    return null
  }
}

export const depositFundsIx = async (
  depositFundsParams: IDepositFundsParams,
  wallet: any,
  connection: Connection,
  traderInstanceSdk: Trader
) => {
  try {
    await traderInstanceSdk.init()
    const ix = await traderInstanceSdk.depositFundsIx(depositFundsParams.quantity)
    const instructions = []
    instructions.push(ix)
    const response = await sendPerpsTransaction(connection, wallet, instructions, [], {
      startMessage: {
        header: 'Deposit funds',
        description: 'Sign the transaction to deposit funds!'
      },
      progressMessage: {
        header: 'Deposit funds',
        description: 'Depositing funds to your account..'
      },
      endMessage: {
        header: 'Deposit funds',
        description: 'Funds successfully deposited'
      },
      errorMessage: {
        header: 'Deposit funds',
        description: 'There was an error in depositing the funds'
      }
    })
    return response
  } catch (e) {
    //notify({
    //  message: 'Deposit of ' + displayFractional(depositFundsParams.quantity) + ' failed',
    //  type: 'error'
    //})
    console.log(e)
    return e
  }
}

export const initTrgDepositIx = async (
  depositFundsAccounts: IDepositFundsAccounts,
  depositFundsParams: IDepositFundsParams,
  wallet: any,
  connection: Connection,
  perpInstanceSdk: Perp,
  trg?: Keypair,
  isDevnet?: boolean
) => {
  try {
    const [instructions, buddyInstructions, signers, trader] = await initTrgIx(
      connection,
      wallet,
      trg,
      isDevnet,
      perpInstanceSdk
    )
    const buddyTransaction = isDevnet ? null : await buildTransaction(connection, wallet, buddyInstructions, [])
    //traderRiskGroup address is created in sdk, we need to use the signers returned by sdk
    depositFundsAccounts.traderRiskGroup = signers[0].publicKey
    const ix = await trader.depositFundsIx(depositFundsParams.quantity, depositFundsAccounts)
    instructions.push(ix)

    const transaction = await buildTransaction(connection, wallet, instructions, signers)
    const response = await sendPerpsTransactions(
      connection,
      wallet,
      buddyTransaction && !isDevnet ? [transaction, buddyTransaction] : [transaction],
      {
        startMessage: {
          header: 'Deposit funds',
          description: 'Sign the transaction to deposit funds!'
        },
        progressMessage: {
          header: 'Deposit funds',
          description: 'Depositing funds to your account..'
        },
        endMessage: {
          header: 'Deposit funds',
          description: 'Funds successfully deposited'
        },
        errorMessage: {
          header: 'Deposit funds',
          description: 'There was an error in depositing the funds'
        }
      }
    )

    localStorage.removeItem('referrer')

    // Only return trgIx reponse
    return response[0]
  } catch (e) {
    console.log(e)
  }
}

export const withdrawFundsIx = async (
  withdrawFundsParams: IWithdrawFundsParams,
  wallet: any,
  connection: Connection,
  traderInstanceSdk: Trader
) => {
  try {
    const instructions = []
    const ix = await traderInstanceSdk.withdrawFundsIx(withdrawFundsParams.quantity)
    instructions.push(ix)

    const response = await sendPerpsTransaction(connection, wallet, instructions, [], {
      startMessage: {
        header: 'Withdraw funds',
        description: 'Sign the transaction to withdraw funds!'
      },
      progressMessage: {
        header: 'Withdraw funds',
        description: 'Withdrawing funds to your account..'
      },
      endMessage: {
        header: 'Withdraw funds',
        description: 'Funds successfully withdrawn'
      },
      errorMessage: {
        header: 'Withdraw funds',
        description: 'There was an error in withdrawing the funds'
      }
    })
    //if (response && response.txid) {
    //  notify({
    //    message: 'Funds withdrawn Successfully!'
    //  })
    //}
    return response
  } catch (e) {
    console.log(e)
    //notify({
    //  message: 'Withdrawl failed. Please try again with a smaller amount',
    //  type: 'error'
    //})
    return null
  }
}
export const closeTraderAccountIx = async (wallet: any, connection: Connection, traderInstanceSdk: Trader) => {
  try {
    const instructions = []
    const ix = await traderInstanceSdk.closetrgIx()
    instructions.push(ix)

    const response = await sendPerpsTransaction(connection, wallet, instructions, [], {
      startMessage: {
        header: 'Close Trader Account',
        description: 'Sign the transaction to Close Trader Account!'
      },
      progressMessage: {
        header: 'Close Trader Account',
        description: 'Closing Trader Account..'
      },
      endMessage: {
        header: 'Close Trader Account',
        description: 'Trader Account closed successfully'
      },
      errorMessage: {
        header: 'Close Trader Account',
        description: 'There was an error in Closing Trader Account'
      }
    })

    return response
  } catch (e) {
    console.log(e)
    return null
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
      pubkey: new PublicKey(args.MPG_ID),
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

export const initTrgIx = async (
  connection: Connection,
  wallet: any,
  trgKey?: Keypair,
  isDevnet?: boolean,
  perpInstanceSdk?: Perp
): Promise<[TransactionInstruction[], TransactionInstruction[], Keypair[], Trader]> => {
  const instructions = []
  const riskStateAccount = anchor.web3.Keypair.generate()
  const traderRiskGroup = trgKey ?? anchor.web3.Keypair.generate()
  const traderFeeAcct = getTraderFeeAcct(traderRiskGroup.publicKey, isDevnet ? DEVNET_MPG_ID : MAINNET_MPG_ID)
  const riskSigner = getRiskSigner(isDevnet ? DEVNET_MPG_ID : MAINNET_MPG_ID)
  const referrer = localStorage.getItem('referrer') || ''

  const dexProgram = await getDexProgram(connection, wallet)
  if (!isDevnet) {
    const createBuddy = await createRandom(connection, wallet.publicKey, referrer)
    const referralKey = createBuddy.memberPDA
    const buddyInstructions = [...createBuddy.instructions]
    await perpInstanceSdk.init()
    const trader = new Trader(perpInstanceSdk, referralKey)
    const [ixs, signers] = await trader.createTraderAccountIxs()
    instructions.push(...ixs)
    return [instructions, buddyInstructions, signers, trader]
  } else {
    const ix = await dexProgram.instruction.initializeTraderRiskGroup({
      accounts: {
        owner: wallet.publicKey,
        traderRiskGroup: traderRiskGroup.publicKey,
        marketProductGroup: new PublicKey(isDevnet ? DEVNET_MPG_ID : MAINNET_MPG_ID),
        riskSigner: riskSigner,
        traderRiskStateAcct: riskStateAccount.publicKey,
        traderFeeStateAcct: traderFeeAcct,
        riskEngineProgram: new PublicKey(RISK_ID),
        systemProgram: SystemProgram.programId,
        referralKey: PublicKey.default
      }
    })
    instructions.push(ix)

    return [instructions, null, [riskStateAccount, traderRiskGroup], null]
  }
}

export const initializeTRG = async (wallet: any, connection: Connection) => {
  const [instructions, buddyInstructions, signers] = await initTrgIx(connection, wallet)
  const transaction = await buildTransaction(connection, wallet, instructions, signers)
  const buddyTransaction = await buildTransaction(connection, wallet, buddyInstructions, [])

  const res = await sendPerpsTransactions(
    connection,
    wallet,
    buddyTransaction ? [transaction, buddyTransaction] : [transaction]
  )
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
