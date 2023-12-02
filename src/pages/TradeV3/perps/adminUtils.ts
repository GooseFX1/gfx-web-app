/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Connection, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js'
import {
  CREATE_RISK_STATE_ACCOUNT_DISCRIMINANT,
  DEX_ID,
  FEE_COLLECTOR,
  FEES_ID,
  FIND_FEES_DISCRIMINANT,
  FIND_FEES_DISCRIMINANT_LEN,
  MPG_ACCOUNT_SIZE,
  MPG_ID,
  RISK_ID,
  VALIDATE_ACCOUNT_HEALTH_DISCRIMINANT,
  VALIDATE_ACCOUNT_HEALTH_DISCRIMINANT_LEN,
  VALIDATE_ACCOUNT_LIQUIDATION_DISCRIMINANT,
  VAULT_MINT,
  VAULT_SEED
} from './perpsConstants'
import {
  getDerivativeKey,
  getDexProgram,
  getFeeConfigAcct,
  getMarketSigner,
  getPythOracleAndClock,
  int64to8
} from './utils'
import * as anchor from '@project-serum/anchor'
import {
  IInitializeMarketProductGroupAccounts,
  IInitializeMarketProductGroupParams,
  IInitializeMarketProductAccounts,
  IInitializeMarketProductParams
} from '../../../types/dexterity_instructions'
import { sendPerpsTransaction } from '../../../web3/connection'
import { struct, u8, u32 } from '@solana/buffer-layout'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { initializeDerivative } from './instructions/derivativeIx'
import { Fractional } from './dexterity/types'

export const initializeMarketProductGroup = async (
  initializeProductGroupAccounts: IInitializeMarketProductGroupAccounts,
  initializeProductGroupParams: IInitializeMarketProductGroupParams,
  wallet: any,
  connection: Connection
): Promise<void> => {
  const instructions = []
  const dexProgram = await getDexProgram(connection, wallet)
  const marketProductGroupVault = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(VAULT_SEED), initializeProductGroupAccounts.marketProductGroup.publicKey.toBuffer()],
    new PublicKey(DEX_ID)
  )[0]

  const feeConfigAcct = getFeeConfigAcct(initializeProductGroupAccounts.marketProductGroup.publicKey)

  instructions.push(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: initializeProductGroupAccounts.marketProductGroup.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(MPG_ACCOUNT_SIZE), //Need to change
      space: MPG_ACCOUNT_SIZE, //Need to change
      programId: new PublicKey(DEX_ID)
    })
  )

  instructions.push(
    await dexProgram.instruction.initializeMarketProductGroup(initializeProductGroupParams, {
      accounts: {
        authority: initializeProductGroupAccounts.authority,
        marketProductGroup: initializeProductGroupAccounts.marketProductGroup.publicKey,
        marketProductGroupVault: marketProductGroupVault,
        vaultMint: initializeProductGroupAccounts.vaultMint,
        feeCollector: initializeProductGroupAccounts.feeCollector,
        feeModelProgram: initializeProductGroupAccounts.feeModelProgram,
        feeModelConfigurationAcct: feeConfigAcct,
        riskModelConfigurationAcct: initializeProductGroupAccounts.riskModelConfigurationAcct,
        riskEngineProgram: initializeProductGroupAccounts.riskEngineProgram,
        sysvarRent: initializeProductGroupAccounts.sysvarRent,
        systemProgram: initializeProductGroupAccounts.systemProgram,
        tokenProgram: initializeProductGroupAccounts.tokenProgram,
        feeOutputRegister: initializeProductGroupAccounts.feeOutputRegister.publicKey,
        riskOutputRegister: initializeProductGroupAccounts.riskOutputRegister.publicKey
      }
    })
  )
  instructions.push(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: initializeProductGroupAccounts.riskOutputRegister.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(432), //Need to change
      space: 432, //Need to change
      programId: new PublicKey(RISK_ID)
    })
  )
  instructions.push(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: initializeProductGroupAccounts.feeOutputRegister.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(128), //Need to change
      space: 128, //Need to change
      programId: new PublicKey(FEES_ID)
    })
  )
  const res = await sendPerpsTransaction(connection, wallet, instructions, [
    initializeProductGroupAccounts.marketProductGroup,
    initializeProductGroupAccounts.riskOutputRegister,
    initializeProductGroupAccounts.feeOutputRegister
  ])
  console.log(res)
}

export const initializeMarketProduct = async (
  initializeMarketProductAccounts: IInitializeMarketProductAccounts,
  initializeMarketProductParams: IInitializeMarketProductParams,
  wallet: any,
  connection: Connection
) => {
  const instructions = []
  const dexProgram = await getDexProgram(connection, wallet)
  instructions.push(
    await dexProgram.instruction.initializeMarketProduct(initializeMarketProductParams, {
      accounts: {
        authority: initializeMarketProductAccounts.authority,
        marketProductGroup: initializeMarketProductAccounts.marketProductGroup,
        product: initializeMarketProductAccounts.product,
        orderbook: initializeMarketProductAccounts.orderbook
      }
    })
  )
  const res = await sendPerpsTransaction(connection, wallet, instructions, [])
  console.log(res)
  return res
  //authority as signer
  //const response = await sendAndConfirmRawTransaction(connection,tr, [])
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

export const adminInitialiseMPG = async (connection: Connection, wallet: any) => {
  const marketProductGroupss = anchor.web3.Keypair.generate()
  const vaultMint = new PublicKey(VAULT_MINT)
  const feeCollector = new PublicKey(FEE_COLLECTOR)
  const riskModelConfigurationAcct = anchor.web3.Keypair.generate().publicKey
  const feeOutputRegister = anchor.web3.Keypair.generate()
  const riskOutputRegister = anchor.web3.Keypair.generate()

  console.log('Market product group is: ', marketProductGroupss.publicKey.toBase58())
  console.log('Risk output register is: ', riskOutputRegister.publicKey.toBase58())
  console.log('Fee output register is: ', feeOutputRegister.publicKey.toBase58())
  console.log('riskModelConfigurationAcct is: ', riskModelConfigurationAcct.toBase58())
  const accountObj = {
    authority: wallet.publicKey,
    marketProductGroup: marketProductGroupss,
    vaultMint: vaultMint,
    feeCollector: feeCollector,
    feeModelProgram: new PublicKey(FEES_ID),
    riskModelConfigurationAcct: riskModelConfigurationAcct,
    riskEngineProgram: new PublicKey(RISK_ID),
    sysvarRent: SYSVAR_RENT_PUBKEY,
    systemProgram: SystemProgram.programId,
    tokenProgram: TOKEN_PROGRAM_ID,
    feeOutputRegister: feeOutputRegister,
    riskOutputRegister: riskOutputRegister
  }
  SYSVAR_RENT_PUBKEY
  const paramsObject = {
    name: Buffer.from('GOOSEFX'),
    validateAccountDiscriminantLen: new anchor.BN(VALIDATE_ACCOUNT_HEALTH_DISCRIMINANT_LEN),
    findFeesDiscriminantLen: new anchor.BN(FIND_FEES_DISCRIMINANT_LEN),
    validateAccountHealthDiscriminant: VALIDATE_ACCOUNT_HEALTH_DISCRIMINANT,
    validateAccountLiquidationDiscriminant: VALIDATE_ACCOUNT_LIQUIDATION_DISCRIMINANT,
    createRiskStateAccountDiscriminant: CREATE_RISK_STATE_ACCOUNT_DISCRIMINANT,
    findFeesDiscriminant: int64to8(FIND_FEES_DISCRIMINANT),
    maxMakerFeeBps: 10,
    minMakerFeeBps: 10,
    maxTakerFeeBps: 10,
    minTakerFeeBps: 10
  }
  const response = await initializeMarketProductGroup(accountObj, paramsObject, wallet, connection)
  return response
}
export const createAAMarket = async (wallet: any, connection: Connection, caller_authority: PublicKey) => {
  const instructions = []
  const market = anchor.web3.Keypair.generate()
  const eventQueue = anchor.web3.Keypair.generate()
  const bids = anchor.web3.Keypair.generate()
  const asks = anchor.web3.Keypair.generate()

  const dexProgram = await getDexProgram(connection, wallet)

  console.log('caller authority ', caller_authority.toBase58())
  console.log('In buffer terms: ', caller_authority.toBuffer())

  console.log('market: ', market.publicKey.toBase58())
  //console.log('eventQueue: ', eventQueue.toBase58())
  console.log('eventQueue: ', eventQueue.publicKey.toBase58())
  console.log('bids: ', bids.publicKey.toBase58())
  console.log('asks: ', asks.publicKey.toBase58())
  // const eventQueueSize = 42 + 33 + 120 + 34 + 1 + 73 //303
  const eventQueueSize = 42 + 33 + 11400 - 43 //100 eq amx size
  instructions.push(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: eventQueue.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(eventQueueSize), //Need to change
      space: eventQueueSize, //Need to change
      programId: new PublicKey(DEX_ID)
    })
  )

  instructions.push(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: market.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(120), //Need to change
      space: 120, //Need to change
      programId: new PublicKey(DEX_ID)
    })
  )

  instructions.push(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: asks.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(96008), //Need to change
      space: 96008, //Need to change
      programId: new PublicKey(DEX_ID)
    })
  )

  instructions.push(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: bids.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(96008), //Need to change
      space: 96008, //Need to change
      programId: new PublicKey(DEX_ID)
    })
  )

  instructions.push(
    await dexProgram.instruction.createMarket(
      {
        minBaseOrderSize: new anchor.BN(1000),
        tickSize: new anchor.BN(1)
      },
      {
        accounts: {
          market: market.publicKey,
          eventQueue: eventQueue.publicKey,
          bids: bids.publicKey,
          asks: asks.publicKey,
          authority: wallet.publicKey,
          marketProductGroup: new PublicKey(MPG_ID)
        },
        signers: [eventQueue, market, bids, asks]
      }
    )
  )

  const response = await sendPerpsTransaction(connection, wallet, instructions, [eventQueue, market, bids, asks])
  console.log(response)
  return market
}

export const adminCreateMarket = async (connection: Connection, wallet: any) => {
  const [priceOracle, clock] = getPythOracleAndClock(connection)

  const instrumentType = 1,
    strike = new Fractional({
      m: new anchor.BN(1),
      exp: new anchor.BN(0)
    }),
    fullFundingPeriod = 3600,
    minimumFundingPeriod = 600,
    initializationTime = Math.floor(new Date().getTime() / 1000) + 60
  //oracleType = 1

  const derivativeMetadata = getDerivativeKey({
    priceOracle: priceOracle,
    marketProductGroup: new PublicKey(MPG_ID),
    instrumentType: instrumentType,
    strike: strike,
    fullFundingPeriod: fullFundingPeriod,
    minimumFundingPeriod: minimumFundingPeriod,
    initializationTime: initializationTime
  })
  const accountsToSend = {
    priceOracle: priceOracle,
    clock: clock,
    marketProductGroup: new PublicKey(MPG_ID),
    payer: wallet.publicKey,
    systemProgram: SystemProgram.programId,
    derivativeMetadata: derivativeMetadata
  }
  const paramsToSend = {
    instrumentType: { recurringCall: {} },
    strike: strike,
    fullFundingPeriod: new anchor.BN(fullFundingPeriod),
    minimumFundingPeriod: new anchor.BN(minimumFundingPeriod),
    initializationTime: new anchor.BN(initializationTime),
    oracleType: { pyth: {} }
    //closeAuthority: wallet.publicKey
  }
  const product_key = derivativeMetadata
  console.log('market product is: ', product_key.toBase58())
  const marketSigner = await getMarketSigner(product_key)
  console.log('market isgner is: ', marketSigner.toBase58())

  const response = await initializeDerivative(accountsToSend, paramsToSend, wallet, connection)
  console.log('init derevative: ', response)

  const res = await createAAMarket(wallet, connection, marketSigner)
  console.log(res)

  const res2 = await adminCreateMP(connection, wallet, product_key, res.publicKey)
  console.log(res2)
}

export const adminCreateMP = async (
  connection: Connection,
  wallet: any,
  mpKey: PublicKey,
  orderbookId: PublicKey
) => {
  const accountObj = {
    authority: wallet.publicKey,
    marketProductGroup: new PublicKey(MPG_ID),
    product: mpKey,
    orderbook: new PublicKey(orderbookId)
  }
  const paramObj = {
    name: Buffer.from('SOL-PERP'),
    tickSize: new Fractional({
      m: new anchor.BN(100),
      exp: new anchor.BN(4)
    }),
    baseDecimals: new anchor.BN(7),
    priceOffset: new Fractional({
      m: new anchor.BN(0),
      exp: new anchor.BN(0)
    })
  }
  const response = await initializeMarketProduct(accountObj, paramObj, wallet, connection)
  console.log(response)
}

function createInstructionData() {
  const aa = u8('instruction')
  const makerFeeBps = u32('maker_fee_bps')
  const takerFeeBps = u32('taker_fee_bps')
  const dataLayout = struct([aa as any, makerFeeBps as any, takerFeeBps as any])

  const data = Buffer.alloc(dataLayout.span)
  dataLayout.encode(
    {
      instruction: 2,
      maker_fee_bps: 10,
      taker_fee_bps: 10
    },
    data
  )

  return data
}

export const updateFeesIx = async (wallet: any, connection: Connection, args: any) => {
  const instructions = []

  const keys = [
    {
      pubkey: wallet.publicKey,
      isSigner: true,
      isWritable: false
    },
    {
      pubkey: args.feeModelConfigAcct,
      isSigner: false,
      isWritable: true
    },
    {
      pubkey: new PublicKey(MPG_ID),
      isSigner: false,
      isWritable: false
    },
    {
      pubkey: anchor.web3.SystemProgram.programId,
      isSigner: false,
      isWritable: false
    }
  ]
  instructions.push(
    new anchor.web3.TransactionInstruction({
      keys,
      programId: new PublicKey(FEES_ID),
      data: createInstructionData()
    })
  )
  const res = await sendPerpsTransaction(connection, wallet, instructions, [])
  console.log(res)
  return res
}
