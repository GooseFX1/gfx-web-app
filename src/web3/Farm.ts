import { PublicKey, TransactionInstruction, Connection, SystemProgram } from '@solana/web3.js'
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createSyncNativeInstruction,
  NATIVE_MINT,
  createCloseAccountInstruction
} from '@solana/spl-token-v2'
import { Transaction } from '@solana/web3.js'
import BN from 'bn.js'
import {
  GAMMA_PROGRAM_ID,
  POOL_VAULT_SEED_PREFIX,
  toPublicKey,
  AUTHORITY_PREFIX,
  USER_POOL_LIQUIDITY_PREFIX,
  TOKEN_2022_PROGRAM_ID,
  SYSTEM,
  MEMO_ID,
  AMM_CONFIG,
  POOL_SEED_PRFIX,
  GAMMA_FEE_ACCOUNT,
  OBSERVATION_PREFIX,
  SYS_VAR_RENT
} from './ids'
import { convertToNativeValue, withdrawBigStringFarm } from '@/utils'
import { JupToken } from '@/pages/FarmV4/constants'
import { ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { getAccountsForMeteoraDlmm } from './migration/meteora/dlmm'
import { getAccountsForOrcaWhirlpool, getAccountsForOrcaWhirlpoolV2 } from './migration/orca/whirlpool'
import { getAccountsForRaydiumClmmWithdraw, getAccountsForRaydiumClmmWithdrawV2 } from './migration/raydium/clmm'
import { getAccountsForRaydiumCPMMWithdraw } from './migration/raydium/cpmm'
import { IdlTypes } from "anchor0290";
import { Idl, Program } from "anchor301";
import { LbClmm } from './migration/meteora/dlmm_idl'
import { Gamma } from './migration/gamma_types'

export type BinLiquidityReduction = IdlTypes<LbClmm>["BinLiquidityReduction"];
export type RemainingAccountsInfo = IdlTypes<Gamma>["RemainingAccountsInfo"];

export enum TokenType {
  Token0,
  Token1
}

export const getPoolVaultKey = async (poolIdKey: PublicKey, mintAddress: string): Promise<undefined | PublicKey> => {
  try {
    const getPoolVaultKey: [PublicKey, number] = await PublicKey.findProgramAddress(
      [Buffer.from(POOL_VAULT_SEED_PREFIX), poolIdKey?.toBuffer(), new PublicKey(mintAddress).toBuffer()],
      toPublicKey(GAMMA_PROGRAM_ID)
    )
    return getPoolVaultKey[0]
  } catch (err) {
    return undefined
  }
}

export const getAuthorityKey = async (): Promise<undefined | PublicKey> => {
  try {
    const getAuthorityKey: [PublicKey, number] = await PublicKey.findProgramAddress(
      [Buffer.from(AUTHORITY_PREFIX)],
      toPublicKey(GAMMA_PROGRAM_ID)
    )
    return getAuthorityKey[0]
  } catch (err) {
    return undefined
  }
}

export const getLiquidityPoolKey = async (
  poolIdKey: PublicKey,
  userPublicKey: PublicKey
): Promise<undefined | PublicKey> => {
  try {
    const getLiquidityPoolKey: [PublicKey, number] = await PublicKey.findProgramAddress(
      [Buffer.from(USER_POOL_LIQUIDITY_PREFIX), poolIdKey?.toBuffer(), userPublicKey?.toBuffer()],
      toPublicKey(GAMMA_PROGRAM_ID)
    )
    return getLiquidityPoolKey[0]
  } catch (err) {
    return undefined
  }
}

export const u16ToBytes = (num: number): Uint8Array => {
  const arr = new ArrayBuffer(2)
  const view = new DataView(arr)
  view.setUint16(0, num, false)
  return new Uint8Array(arr)
}

export const getAmmConfigId = async (index: number): Promise<undefined | PublicKey> => {
  try {
    const ammConfigId: [PublicKey, number] = await PublicKey.findProgramAddress(
      [Buffer.from(AMM_CONFIG), u16ToBytes(index)],
      new PublicKey(GAMMA_PROGRAM_ID)
    )
    return ammConfigId[0]
  } catch (err) {
    return undefined
  }
}

export const getPoolIdKey = async (
  ammConfigId: PublicKey,
  mintA: PublicKey,
  mintB: PublicKey
): Promise<undefined | PublicKey> => {
  try {
    const getPoolIdKey: [PublicKey, number] = await PublicKey.findProgramAddress(
      [Buffer.from(POOL_SEED_PRFIX), ammConfigId?.toBuffer(), mintA?.toBuffer(), mintB?.toBuffer()],
      new PublicKey(GAMMA_PROGRAM_ID)
    )
    return getPoolIdKey[0]
  } catch (err) {
    return undefined
  }
}

export const getObservationStateKey = async (poolId: PublicKey): Promise<undefined | PublicKey> => {
  try {
    const observationStateKey: [PublicKey, number] = await PublicKey.findProgramAddress(
      [Buffer.from(OBSERVATION_PREFIX), poolId?.toBuffer()],
      new PublicKey(GAMMA_PROGRAM_ID)
    )
    return observationStateKey[0]
  } catch (err) {
    return undefined
  }
}

export const getpoolId = async (mintA: PublicKey, mintB: PublicKey): Promise<PublicKey> => {
  if (!mintA || !mintB) return
  const configIdKey = await getAmmConfigId(0)
  const poolIdKey = await getPoolIdKey(configIdKey, mintA, mintB)
  return poolIdKey
}

const createLiquidityAccountIX = async (
  userPublicKey: PublicKey,
  poolIdKey: PublicKey,
  liquidityAccountKey: PublicKey,
  program: Program<Idl>
): Promise<TransactionInstruction> => {
  const createLiquidityInstructionAccount = {
    user: userPublicKey,
    poolState: poolIdKey,
    userPoolLiquidity: liquidityAccountKey,
    systemProgram: SYSTEM
  }
  const createLiquidityIX: TransactionInstruction = await program.methods.initUserPoolLiquidity({
    accounts: createLiquidityInstructionAccount
  }).instruction()
  //console.log('createLiquidityIX', createLiquidityIX, userPublicKey?.toBase58())
  return createLiquidityIX
}

const getGammaAccounts = async (mintA: PublicKey, mintB: PublicKey, userPublicKey: PublicKey, isDeposit: boolean) => {
  const poolIdKey = await getpoolId(mintA, mintB)
  const poolVaultKeyA = await getPoolVaultKey(poolIdKey, mintA?.toBase58())
  const poolVaultKeyB = await getPoolVaultKey(poolIdKey, mintB?.toBase58())
  const authorityKey = await getAuthorityKey()
  const liquidityAccountKey = await getLiquidityPoolKey(poolIdKey, userPublicKey)
  const tokenAccountAKey = await getAssociatedTokenAddress(mintA, userPublicKey)
  const tokenAccountBKey = await getAssociatedTokenAddress(mintB, userPublicKey)

  const accountObj = {
    owner: userPublicKey,
    authority: authorityKey,
    poolState: poolIdKey,
    userPoolLiquidity: liquidityAccountKey,
    token0Account: tokenAccountAKey,
    token1Account: tokenAccountBKey,
    token0Vault: poolVaultKeyA,
    token1Vault: poolVaultKeyB,
    tokenProgram: TOKEN_PROGRAM_ID,
    tokenProgram2022: TOKEN_2022_PROGRAM_ID,
    vault0Mint: mintA,
    vault1Mint: mintB
  }

  if (!isDeposit) accountObj['memoProgram'] = MEMO_ID
  return accountObj
}

const handleSlippageCalculation = (amount: string, slippage: number, isDeposit: boolean): string => {
  if (!amount) return ''

  let slippageAmount = 0
  if (isDeposit) slippageAmount = Math.ceil(+amount + (slippage / 100) * +amount)
  else slippageAmount = Math.floor(+amount - (slippage / 100) * +amount)
  return slippageAmount?.toString()
}

const getAccountsForCreatePool = async (token0: PublicKey, token1: PublicKey, userPubKey: PublicKey) => {
  const configIdKey = await getAmmConfigId(0)
  const authorityKey = await getAuthorityKey()
  const token0ata = await getAssociatedTokenAddress(token0, userPubKey)
  const token1ata = await getAssociatedTokenAddress(token1, userPubKey)
  const poolIdKey = await getPoolIdKey(configIdKey, token0, token1)
  const observationStateKey = await getObservationStateKey(poolIdKey)
  const poolVaultKeyA = await getPoolVaultKey(poolIdKey, token0?.toBase58())
  const poolVaultKeyB = await getPoolVaultKey(poolIdKey, token1?.toBase58())
  const poolFeeAcc = new PublicKey(GAMMA_FEE_ACCOUNT)
  const userPoolLiquidityAcc = await getLiquidityPoolKey(poolIdKey, userPubKey)

  const accountObj = {
    creator: userPubKey,
    ammConfig: configIdKey,
    authority: authorityKey,
    poolState: poolIdKey,
    userPoolLiquidity: userPoolLiquidityAcc,
    token0Mint: token0,
    token1Mint: token1,
    creatorToken0: token0ata,
    creatorToken1: token1ata,
    token0Vault: poolVaultKeyA,
    token1Vault: poolVaultKeyB,
    createPoolFee: poolFeeAcc,
    observationState: observationStateKey,
    tokenProgram: TOKEN_PROGRAM_ID,
    token0Program: TOKEN_PROGRAM_ID,
    token1Program: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    systemProgram: SYSTEM,
    rent: SYS_VAR_RENT,
  }

  return accountObj
}

export const calculateOtherTokenAndLPAmount = async (
  givenTokenAmount: string,
  tokenType: TokenType,
  poolState: any,
  connection: Connection,
): Promise<{ lpTokenAmount: BN; otherTokenAmountInString: string }> => {
  try {
    if (!givenTokenAmount || +givenTokenAmount <= 0) {
      return { lpTokenAmount: new BN(0), otherTokenAmountInString: '' }
    }
    const tokenAccountInfo0 = await connection.getParsedAccountInfo(poolState?.token0Vault)
    const amount0 = (tokenAccountInfo0?.value?.data as any).parsed?.info?.tokenAmount?.amount
    const protocolFees0 = poolState?.protocolFeesToken0
    const fundFees0 = poolState?.fundFeesToken0
    const swapTokenAmount0 = new BN(amount0)?.sub(protocolFees0?.add(fundFees0))

    const tokenAccountInfo1 = await connection.getParsedAccountInfo(poolState?.token1Vault)
    const amount1 = (tokenAccountInfo1?.value?.data as any).parsed?.info?.tokenAmount?.amount
    const protocolFees1 = poolState?.protocolFeesToken1
    const fundFees1 = poolState?.fundFeesToken1
    const swapTokenAmount1 = new BN(amount1)?.sub(protocolFees1?.add(fundFees1))

    const lpTokenSupply = poolState?.lpSupply
    let lpTokenAmount: BN
    let otherTokenAmountInString: string

    if (tokenType === TokenType.Token0) {
      const inputToken0 = convertToNativeValue(givenTokenAmount, poolState?.mint0Decimals)

      //console.log('inputToken0', inputToken0)
      if (swapTokenAmount0.eq(new BN(0))) {
        lpTokenAmount = new BN(0)
      } else {
        lpTokenAmount = new BN(inputToken0).mul(lpTokenSupply).div(swapTokenAmount0)
      }
      //console.log('lpTokenAmount 0', lpTokenAmount?.toNumber(), swapTokenAmount0?.toNumber(),
      //lpTokenSupply?.toNumber())

      let otherTokenAmount: BN
      if (lpTokenSupply.eq(new BN(0))) {
        otherTokenAmount = new BN(0)
      } else {
        otherTokenAmount = lpTokenAmount.mul(swapTokenAmount1).div(lpTokenSupply)
      }
      otherTokenAmountInString = withdrawBigStringFarm(otherTokenAmount?.toString(), poolState?.mint1Decimals)
    } else {
      const inputToken1 = convertToNativeValue(givenTokenAmount, poolState?.mint1Decimals)
      //console.log('inputToken1', inputToken1)
      if (swapTokenAmount1.eq(new BN(0))) {
        lpTokenAmount = new BN(0)
      } else {
        lpTokenAmount = new BN(inputToken1).mul(lpTokenSupply).div(swapTokenAmount1)
      }
      //console.log('lpTokenAmount 1', lpTokenAmount?.toNumber())

      let otherTokenAmount: BN
      if (lpTokenSupply.eq(new BN(0))) {
        otherTokenAmount = new BN(0)
      } else {
        otherTokenAmount = lpTokenAmount.mul(swapTokenAmount0).div(lpTokenSupply)
      }
      otherTokenAmountInString = withdrawBigStringFarm(otherTokenAmount?.toString(), poolState?.mint0Decimals)
    }
    return { lpTokenAmount, otherTokenAmountInString }
  } catch (e) {
    console.log('Error while fetching lptoken amount & othertoken amount for depositing', e)
    return { lpTokenAmount: new BN(0), otherTokenAmountInString: '' }
  }
}

export const lpTokensToTradingTokens = async (
  lpTokenAmount: BN,
  poolState: any,
  connection: Connection
): Promise<{ tokenAmount0: BN; tokenAmount1: BN }> => {
  try {
    const tokenAccountInfo0 = await connection.getParsedAccountInfo(poolState?.token0Vault)
    const amount0 = (tokenAccountInfo0?.value?.data as any).parsed?.info?.tokenAmount?.amount
    const protocolFees0 = poolState?.protocolFeesToken0
    const fundFees0 = poolState?.fundFeesToken0
    const swapTokenAmount0 = new BN(amount0)?.sub(protocolFees0?.add(fundFees0))

    const tokenAccountInfo1 = await connection.getParsedAccountInfo(poolState?.token1Vault)
    const amount1 = (tokenAccountInfo1?.value?.data as any).parsed?.info?.tokenAmount?.amount
    const protocolFees1 = poolState?.protocolFeesToken1
    const fundFees1 = poolState?.fundFeesToken1
    const swapTokenAmount1 = new BN(amount1)?.sub(protocolFees1?.add(fundFees1))

    const lpTokenSupply = poolState?.lpSupply

    let tokenAmount0: BN
    let tokenAmount1: BN

    if (lpTokenSupply.eq(new BN(0))) {
      tokenAmount0 = new BN(0)
      tokenAmount1 = new BN(0)
    } else {
      tokenAmount0 = lpTokenAmount.mul(swapTokenAmount0).div(lpTokenSupply)
      tokenAmount1 = lpTokenAmount.mul(swapTokenAmount1).div(lpTokenSupply)
    }

    return { tokenAmount0, tokenAmount1 }
  } catch (e) {
    console.log('Error while fetching token amounts for withdrawing', e)
    return { tokenAmount0: new BN(0), tokenAmount1: new BN(0) }
  }
}


//Instruction - 8
export const deposit = async (
  userSourceDepositAmount: string,
  userTargetDepositAmount: string,
  lpAmount: BN,
  slippage: number,
  selectedCard: any,
  userPublicKey: PublicKey,
  program: Program<Idl>,
  connection: Connection
): Promise<Transaction> => {
  const mintA = new PublicKey(selectedCard?.mintA?.address)
  const mintB = new PublicKey(selectedCard?.mintB?.address)
  const depositAccounts = await getGammaAccounts(mintA, mintB, userPublicKey, true)
  const liqAccData = await connection.getAccountInfo(depositAccounts?.userPoolLiquidity)
  let liquidityAccIX = undefined
  if (!liqAccData) {
    liquidityAccIX = await createLiquidityAccountIX(
      userPublicKey,
      depositAccounts?.poolState,
      depositAccounts?.userPoolLiquidity,
      program
    )
  }
  //console.log('user deposits', userSourceDepositAmount, userTargetDepositAmount)
  const token0SlippageAmount = handleSlippageCalculation(userSourceDepositAmount, slippage, true)
  const token1SlippageAmount = handleSlippageCalculation(userTargetDepositAmount, slippage, true)
  //console.log('user deposits with slippage', token0SlippageAmount, token1SlippageAmount)
  const token0Amount = convertToNativeValue(token0SlippageAmount, selectedCard?.mintA?.decimals)
  const token1Amount = convertToNativeValue(token1SlippageAmount, selectedCard?.mintB?.decimals)
  //console.log('user deposits of native value', token0Amount, token1Amount, lpAmount?.toNumber())
  const depositIX: TransactionInstruction = await program.methods.deposit(
    lpAmount,
    new BN(token0Amount),
    new BN(token1Amount),
  )
  .accountsStrict(depositAccounts)
  .instruction()
  let depositAmountTX: Transaction
  if (selectedCard?.mintA?.symbol === 'SOL') {
    depositAmountTX = await wrapSolToken(userPublicKey, connection, userSourceDepositAmount)
  } else if (selectedCard?.mintB?.symbol === 'SOL') {
    depositAmountTX = await wrapSolToken(userPublicKey, connection, userTargetDepositAmount)
  } else depositAmountTX = new Transaction()
  if (liquidityAccIX !== undefined) {
    depositAmountTX.add(liquidityAccIX)
  }
  depositAmountTX.add(depositIX)
  //console.log('depositAmountTX', depositAmountTX)
  if (selectedCard?.mintA?.symbol === 'SOL') {
    const ataAddress = await getAssociatedTokenAddress(new PublicKey(selectedCard?.mintA?.address), userPublicKey)
    const tr = createCloseAccountInstruction(ataAddress, userPublicKey, userPublicKey)
    //console.log('mint a is SOL', selectedCard?.mintA?.symbol, ataAddress, depositAmountTX)
    depositAmountTX.add(tr)
  }
  if (selectedCard?.mintB?.symbol === 'SOL') {
    const ataAddress = await getAssociatedTokenAddress(new PublicKey(selectedCard?.mintB?.address), userPublicKey)
    const tr = createCloseAccountInstruction(ataAddress, userPublicKey, userPublicKey)
    //console.log('mint b is SOL', selectedCard?.mintB?.symbol, ataAddress, depositAmountTX)
    depositAmountTX.add(tr)
  }
  //console.log("FINAL TX FOR DEPOSIT: ", depositAmountTX)
  return depositAmountTX
}

//Instruction - 9
export const withdraw = async (
  userSourceWithdrawAmount: string,
  userTargetWithdrawAmount: string,
  lpAmount: BN,
  slippage: number,
  selectedCard: any,
  userPublicKey: PublicKey,
  program: Program<Idl>,
  connection: Connection
): Promise<Transaction> => {
  //console.log('user withdraws', userSourceWithdrawAmount, userTargetWithdrawAmount)
  const mintA = new PublicKey(selectedCard?.mintA?.address)
  const mintB = new PublicKey(selectedCard?.mintB?.address)
  const withdrawAccounts = await getGammaAccounts(mintA, mintB, userPublicKey, false)
  const withdrawInstructionAccount = { ...withdrawAccounts }
  const token0SlippageAmount = handleSlippageCalculation(userSourceWithdrawAmount, slippage, false)
  const token1SlippageAmount = handleSlippageCalculation(userTargetWithdrawAmount, slippage, false)
  const token0Amount = convertToNativeValue(token0SlippageAmount, selectedCard?.mintA?.decimals)
  const token1Amount = convertToNativeValue(token1SlippageAmount, selectedCard?.mintB?.decimals)
  //console.log('user withdraws of native value', token0Amount, token1Amount, lpAmount?.toNumber())
  const withdrawAmountTX = new Transaction()

  const mintAata = await getAssociatedTokenAddress(new PublicKey(selectedCard?.mintA?.address), userPublicKey)
  const createTokenA = await checkIfTokenAccExists(
    new PublicKey(selectedCard?.mintA?.address),
    userPublicKey,
    connection,
    mintAata
  )
  if (createTokenA) withdrawAmountTX.add(createTokenA)

  const mintBata = await getAssociatedTokenAddress(new PublicKey(selectedCard?.mintB?.address), userPublicKey)
  const createTokenB = await checkIfTokenAccExists(
    new PublicKey(selectedCard?.mintB?.address),
    userPublicKey,
    connection,
    mintBata
  )
  if (createTokenB) withdrawAmountTX.add(createTokenB)

  const withdrawIX: TransactionInstruction = await program.methods.withdraw(
    lpAmount,
    new BN(token0Amount),
    new BN(token1Amount),
    {
      accounts: withdrawInstructionAccount
    }
  ).instruction()
  withdrawAmountTX.add(withdrawIX)

  if (selectedCard?.mintA?.symbol === 'SOL') {
    const ataAddress = await getAssociatedTokenAddress(new PublicKey(selectedCard?.mintA?.address), userPublicKey)
    const tr = createCloseAccountInstruction(ataAddress, userPublicKey, userPublicKey)
    //console.log('mint a is SOL', selectedCard?.mintA?.symbol, ataAddress)
    withdrawAmountTX.add(tr)
  }
  if (selectedCard?.mintB?.symbol === 'SOL') {
    const ataAddress = await getAssociatedTokenAddress(new PublicKey(selectedCard?.mintB?.address), userPublicKey)
    const tr = createCloseAccountInstruction(ataAddress, userPublicKey, userPublicKey)
    //console.log('mint b is SOL', selectedCard?.mintB?.symbol, ataAddress)
    withdrawAmountTX.add(tr)
  }
  //console.log("FINAL TX FOR WITHDRAW: ", withdrawAmountTX)
  return withdrawAmountTX
}

//Instruction - 6
export const createPool = async (
  tokenA: JupToken,
  tokenB: JupToken,
  amountTokenA: string,
  amountTokenB: string,
  userPubKey: PublicKey,
  program: Program<Idl>,
  connection: Connection
) => {
  let token0 = new PublicKey(tokenA?.address)
  let token1 = new PublicKey(tokenB?.address)
  let amountToken0 = amountTokenA
  let amountToken1 = amountTokenB
  let decimalsToken0 = tokenA?.decimals
  let decimalsToken1 = tokenB?.decimals
  let token0Symbol = tokenA?.symbol
  let token1Symbol = tokenB?.symbol

  const compare = new PublicKey(tokenA?.address)?.toBuffer()?.compare(new PublicKey(tokenB?.address)?.toBuffer())

  if (compare > 0) {
    token0 = new PublicKey(tokenB?.address)
    token1 = new PublicKey(tokenA?.address)
    amountToken0 = amountTokenB
    amountToken1 = amountTokenA
    decimalsToken0 = tokenB?.decimals
    decimalsToken1 = tokenA?.decimals
    token0Symbol = tokenB?.symbol
    token1Symbol = tokenA?.symbol
  }
  const accsForCreatePool = await getAccountsForCreatePool(token0, token1, userPubKey)
  const createPoolAcc = { ...accsForCreatePool }
  const amountTokenABN = convertToNativeValue(amountToken0, decimalsToken0)
  const amountTokenBBN = convertToNativeValue(amountToken1, decimalsToken1)
  const createPoolIX: TransactionInstruction = await program.methods.initialize(
    new BN(amountTokenABN),
    new BN(amountTokenBBN),
    new BN(Math.floor(Date.now() / 1000)),
    {
      accounts: createPoolAcc
    }
  ).instruction()
  let createPoolTxn: Transaction
  if (token0Symbol === 'SOL') createPoolTxn = await wrapSolToken(userPubKey, connection, amountToken0)
  else if (token1Symbol === 'SOL') createPoolTxn = await wrapSolToken(userPubKey, connection, amountToken1)
  else createPoolTxn = new Transaction()

  createPoolTxn.add(createPoolIX)

  if (token0Symbol === 'SOL') {
    const ataAddress = await getAssociatedTokenAddress(token0, userPubKey)
    const tr = createCloseAccountInstruction(ataAddress, userPubKey, userPubKey)
    createPoolTxn.add(tr)
  }
  if (token1Symbol === 'SOL') {
    const ataAddress = await getAssociatedTokenAddress(token1, userPubKey)
    const tr = createCloseAccountInstruction(ataAddress, userPubKey, userPubKey)
    createPoolTxn.add(tr)
  }
  return createPoolTxn
}

//Instruction - 12
export const migrateMeteoraDlmmToGamma = async (
  connection: Connection,
  program: any, //Program<Idl>,
  user: PublicKey,
  userSourceDepositAmount: string,
  userTargetDepositAmount: string,
  inputMint: PublicKey,
  outputMint: PublicKey,
  tokenAmount: string,
  slippage: number,
  selectedCard: any,
  binLiquidityReduction: BinLiquidityReduction,
) => {
  const meteoraDlmmAccounts = await getAccountsForMeteoraDlmm(connection, inputMint, outputMint, user)
  const gammaAccounts = await getGammaAccounts(inputMint, outputMint, user, true)

  const accounts = {
    ...meteoraDlmmAccounts,
    gammaOwner: gammaAccounts.owner,
    gammaAuthority: gammaAccounts.authority,
    gammaPoolState: gammaAccounts.poolState,
    gammaUserPoolLiquidity: gammaAccounts.userPoolLiquidity,
    gammaToken0Account: gammaAccounts.token0Account,
    gammaToken1Account: gammaAccounts.token1Account,
    gammaToken0Vault: gammaAccounts.token0Vault,
    gammaToken1Vault: gammaAccounts.token1Vault,
    tokenProgram: gammaAccounts.tokenProgram,
    tokenProgram2022: gammaAccounts.tokenProgram2022,
    gammaVault0Mint: gammaAccounts.vault0Mint,
    gammaVault1Mint: gammaAccounts.vault1Mint,
  }
  let poolStateAccount = program.account.poolState.fetch(gammaAccounts.poolState);
  const { lpTokenAmount } = await calculateOtherTokenAndLPAmount(
    tokenAmount, 
    TokenType.Token0, //TODO:
    poolStateAccount, 
    connection
  )
  
  const token0SlippageAmount = handleSlippageCalculation(userSourceDepositAmount, slippage, true)
  const token1SlippageAmount = handleSlippageCalculation(userTargetDepositAmount, slippage, true)
  const token0Amount = convertToNativeValue(token0SlippageAmount, selectedCard?.mintA?.decimals)
  const token1Amount = convertToNativeValue(token1SlippageAmount, selectedCard?.mintB?.decimals)
  
  const migrateMeteoraDlmmToGammaIX: TransactionInstruction = await program.methods.migrateMeteoraDlmmToGamma(
    binLiquidityReduction,
    lpTokenAmount,
    new BN(token0Amount),
    new BN(token1Amount),
  )
  .accountsStrict(accounts)
  .instruction()
  
  const migrateMeteoraDlmmToGammaTxn: Transaction = new Transaction()
  migrateMeteoraDlmmToGammaTxn.add(migrateMeteoraDlmmToGammaIX)
  return migrateMeteoraDlmmToGammaTxn
}

//Instruction - 13
export const migrateOrcaWhirlpoolToGammaV2 = async (
  program: Program,
  rpcURL: string,
  inputMint: PublicKey,
  outputMint: PublicKey,
  tokenProgramInputMint: PublicKey = TOKEN_PROGRAM_ID,
  tokenProgramOutputMint: PublicKey = TOKEN_PROGRAM_ID,
  user: PublicKey
) => {
  const startTick = 0; //TODO:MIGRATION
  const orcaAccounts = await getAccountsForOrcaWhirlpoolV2(
    rpcURL,
    startTick,
    inputMint,
    outputMint,
    tokenProgramInputMint,
    tokenProgramOutputMint,
  )
  const gammaAccounts = await getGammaAccounts(inputMint, outputMint, user, true)

  // TODO: get whirlpoolPosition and whirlpoolPositionTokenAccount

  const accounts = {
    ...orcaAccounts,
    gammaOwner: gammaAccounts.owner,
    gammaAuthority: gammaAccounts.authority,
    gammaPoolState: gammaAccounts.poolState,
    gammaUserPoolLiquidity: gammaAccounts.userPoolLiquidity,
    gammaToken0Account: gammaAccounts.token0Account,
    gammaToken1Account: gammaAccounts.token1Account,
    gammaToken0Vault: gammaAccounts.token0Vault,
    gammaToken1Vault: gammaAccounts.token1Vault,
    tokenProgram: gammaAccounts.tokenProgram,
    tokenProgram2022: gammaAccounts.tokenProgram2022,
    gammaVault0Mint: gammaAccounts.vault0Mint,
    gammaVault1Mint: gammaAccounts.vault1Mint,
  }

  const liquidityAmount = new BN(0) //TODO:MIGARTION
  const tokenMinA = new BN(0) //TODO:MIGARTION
  const tokenMinB = new BN(0) //TODO:MIGARTION
  const remainingAccounts = new BN(0)  //TODO:MIGARTION remove this and use below with proper structs
  // const remainingAccounts: RemainingAccountsInfo = {}  //TODO:MIGARTION
  const maximumToken0Amount = new BN(0) //TODO:MIGARTION
  const maximumToken1Amount = new BN(0) //TODO:MIGARTION

  const migrateOrcaWhirlpoolToGammaIX: TransactionInstruction =
    await program.methods.migrateOrcaWhirlpoolToGammaV2(
      liquidityAmount,
      tokenMinA,
      tokenMinB,
      remainingAccounts,
      maximumToken0Amount,
      maximumToken1Amount,
    )
    .accountsStrict(accounts)
    .instruction()
  
  const migrateOrcaWhirlpoolToGammaTxn: Transaction = new Transaction()
  migrateOrcaWhirlpoolToGammaTxn.add(migrateOrcaWhirlpoolToGammaIX)
  return migrateOrcaWhirlpoolToGammaTxn
}

//Instruction - 14
export const migrateOrcaWhirlpoolToGamma = async (
  program: Program,
  rpcURL: string,
  inputMint: PublicKey,
  outputMint: PublicKey,
  user: PublicKey
) => {
  const startTick = 0; //TODO:MIGRATION 
  const orcaAccounts = await getAccountsForOrcaWhirlpool(rpcURL, startTick, inputMint, outputMint)
  const gammaAccounts = await getGammaAccounts(inputMint, outputMint, user, true)

  // TODO: get whirlpoolPosition and whirlpoolPositionTokenAccount

  const accounts = {
    ...orcaAccounts,
    gammaOwner: gammaAccounts.owner,
    gammaAuthority: gammaAccounts.authority,
    gammaPoolState: gammaAccounts.poolState,
    gammaUserPoolLiquidity: gammaAccounts.userPoolLiquidity,
    gammaToken0Account: gammaAccounts.token0Account,
    gammaToken1Account: gammaAccounts.token1Account,
    gammaToken0Vault: gammaAccounts.token0Vault,
    gammaToken1Vault: gammaAccounts.token1Vault,
    tokenProgram: gammaAccounts.tokenProgram,
    tokenProgram2022: gammaAccounts.tokenProgram2022,
    gammaVault0Mint: gammaAccounts.vault0Mint,
    gammaVault1Mint: gammaAccounts.vault1Mint,
  }

  const liquidityAmount = new BN(0) //TODO:MIGARTION
  const tokenMinA = new BN(0) //TODO:MIGARTION
  const tokenMinB = new BN(0) //TODO:MIGARTION
  const maximumToken0Amount = new BN(0) //TODO:MIGARTION
  const maximumToken1Amount = new BN(0) //TODO:MIGARTION

  const migrateOrcaWhirlpoolToGammaIX: TransactionInstruction =
    await program.methods.migrateOrcaWhirlpoolToGamma(
      liquidityAmount,
      tokenMinA,
      tokenMinB,
      maximumToken0Amount,
      maximumToken1Amount,
    )
    .accountsStrict(accounts)
    .instruction()
  
  const migrateOrcaWhirlpoolToGammaTxn: Transaction = new Transaction()
  migrateOrcaWhirlpoolToGammaTxn.add(migrateOrcaWhirlpoolToGammaIX)
  return migrateOrcaWhirlpoolToGammaTxn
}

//Instruction - 15
export const migrateRaydiumClmmToGamma = async (
  program: Program, 
  tokenA: PublicKey, 
  tokenB: PublicKey,
  user: PublicKey,
) => {
  const raydiumCLMMAccounts = await getAccountsForRaydiumClmmWithdraw(tokenA, tokenB, user)
  const gammaAccounts = await getGammaAccounts(tokenA, tokenB, user, true)

  const accounts = {
    ...raydiumCLMMAccounts,
    gammaOwner: gammaAccounts.owner,
    gammaAuthority: gammaAccounts.authority,
    gammaPoolState: gammaAccounts.poolState,
    gammaUserPoolLiquidity: gammaAccounts.userPoolLiquidity,
    gammaToken0Account: gammaAccounts.token0Account,
    gammaToken1Account: gammaAccounts.token1Account,
    gammaToken0Vault: gammaAccounts.token0Vault,
    gammaToken1Vault: gammaAccounts.token1Vault,
    tokenProgram: gammaAccounts.tokenProgram,
    tokenProgram2022: gammaAccounts.tokenProgram2022,
    gammaVault0Mint: gammaAccounts.vault0Mint,
    gammaVault1Min: gammaAccounts.vault1Mint
  }

  const liquidity = new BN(0) //TODO:MIGRATION
  const amount0Min = new BN(0) //TODO:MIGRATION
  const amount1Min = new BN(0) //TODO:MIGRATION
  const maximumToken0Amount = new BN(0) //TODO:MIGRATION
  const maximumToken1Amount = new BN(0) //TODO:MIGRATION

  const migrateRaydiumClmmToGammaIX: TransactionInstruction =
    await program.methods.migrateRaydiumClmmToGammaV2(
      liquidity,
      amount0Min,
      amount1Min,
      maximumToken0Amount,
      maximumToken1Amount,
    )
    .accountsStrict(accounts)
    .instruction()

  const migrateRaydiumClmmToGammaTxn: Transaction = new Transaction()
  migrateRaydiumClmmToGammaTxn.add(migrateRaydiumClmmToGammaIX)
  return migrateRaydiumClmmToGammaTxn
}

//Instruction - 16
export const migrateRaydiumClmmToGammaV2 = async (
  program: Program, 
  tokenA: PublicKey, 
  tokenB: PublicKey, 
  user: PublicKey
) => {
  const raydiumCLMMAccounts = await getAccountsForRaydiumClmmWithdrawV2(tokenA, tokenB, user)
  const gammaAccounts = await getGammaAccounts(tokenA, tokenB, user, true)

  const accounts = {
    ...raydiumCLMMAccounts,
    gammaOwner: gammaAccounts.owner,
    gammaAuthority: gammaAccounts.authority,
    gammaPoolState: gammaAccounts.poolState,
    gammaUserPoolLiquidity: gammaAccounts.userPoolLiquidity,
    gammaToken0Account: gammaAccounts.token0Account,
    gammaToken1Account: gammaAccounts.token1Account,
    gammaToken0Vault: gammaAccounts.token0Vault,
    gammaToken1Vault: gammaAccounts.token1Vault,
    tokenProgram: gammaAccounts.tokenProgram,
    tokenProgram2022: gammaAccounts.tokenProgram2022,
    gammaVault0Mint: gammaAccounts.vault0Mint,
    gammaVault1Min: gammaAccounts.vault1Mint
  }

  const liquidity = new BN(0) //TODO:MIGRATION
  const amount0Min = new BN(0) //TODO:MIGRATION
  const amount1Min = new BN(0) //TODO:MIGRATION
  const maximumToken0Amount = new BN(0) //TODO:MIGRATION
  const maximumToken1Amount = new BN(0) //TODO:MIGRATION

  const migrateRaydiumClmmToGammaIX: TransactionInstruction =
    await program.methods.migrateRaydiumClmmToGammaV2(
      liquidity,
      amount0Min,
      amount1Min,
      maximumToken0Amount,
      maximumToken1Amount,
    )
    .accountsStrict(accounts)
    .instruction()

  const migrateRaydiumClmmToGammaTxn: Transaction = new Transaction()
  migrateRaydiumClmmToGammaTxn.add(migrateRaydiumClmmToGammaIX)
  return migrateRaydiumClmmToGammaTxn
}

//Instruction - 7
export const migrateRaydiumCpSwapToGamma = async (program: Program, tokenA: PublicKey, tokenB: PublicKey, user: PublicKey) => {
  const raydiumAccounts = await getAccountsForRaydiumCPMMWithdraw(tokenA, tokenB, user)
  const gammaAccounts = await getGammaAccounts(tokenA, tokenB, user, true)

  const accounts = {
    ...raydiumAccounts,
    gammaOwner: gammaAccounts.owner,
    gammaAuthority: gammaAccounts.authority,
    gammaPoolState: gammaAccounts.poolState,
    gammaUserPoolLiquidity: gammaAccounts.userPoolLiquidity,
    gammaToken0Account: gammaAccounts.token0Account,
    gammaToken1Account: gammaAccounts.token1Account,
    gammaToken0Vault: gammaAccounts.token0Vault,
    gammaToken1Vault: gammaAccounts.token1Vault,
    tokenProgram: gammaAccounts.tokenProgram,
    tokenProgram2022: gammaAccounts.tokenProgram2022,
    gammaVault0Mint: gammaAccounts.vault0Mint,
    gammaVault1Min: gammaAccounts.vault1Mint
  }

  const lpTokenAmount = 0
  const minimumToken0Amount = 0
  const minimumToken1Amount = 0
  const maximumToken0Amount = 0
  const maximumToken1Amount = 0
  const migrateRaydiumCpSwapIX: TransactionInstruction = await program.methods.migrateRaydiumCpSwap(
     lpTokenAmount,
     minimumToken0Amount,
     minimumToken1Amount,
     maximumToken0Amount,
     maximumToken1Amount,
    { accounts }
  ).instruction()

  const migrateRaydiumCpSwapTxn: Transaction = new Transaction()
  migrateRaydiumCpSwapTxn.add(migrateRaydiumCpSwapIX)
  return migrateRaydiumCpSwapTxn
}

const checkIfTokenAccExists = async (
  tokenMintAddress: PublicKey,
  wallet: PublicKey,
  connection,
  ataAddress: PublicKey
) => {
  const associatedTokenAccount = await connection.getAccountInfo(ataAddress)

  // CHECK if the associated token account exists or not if not create one
  if (!associatedTokenAccount) {
    try {
      const tr = createAssociatedTokenAccountInstruction(wallet, ataAddress, wallet, tokenMintAddress)
      return tr
    } catch (e) {
      console.log(e)
    }
  }
  return null
}

const wrapSolToken = async (walletPublicKey: PublicKey, connection: Connection, amount: string) => {
  try {
    const tx = new Transaction()
    const nativeAmount = convertToNativeValue(amount, 9) //mint decimal of sol = 9
    const associatedTokenAccount = await getAssociatedTokenAddress(NATIVE_MINT, walletPublicKey)
    const accountExists = await connection.getAccountInfo(associatedTokenAccount)
    // Create token account to hold your wrapped SOL
    if (!accountExists)
      tx.add(
        createAssociatedTokenAccountInstruction(
          walletPublicKey,
          associatedTokenAccount,
          walletPublicKey,
          NATIVE_MINT
        )
      )
    // Transfer SOL to associated token account and use SyncNative to update wrapped SOL balance
    tx.add(
      SystemProgram.transfer({
        fromPubkey: walletPublicKey,
        toPubkey: associatedTokenAccount,
        lamports: +nativeAmount
      }),
      createSyncNativeInstruction(associatedTokenAccount)
    )
    //console.log("nativeAmount", nativeAmount, tx)
    return tx
  } catch (e) {
    console.log('There was an error while wrapping sol to wsol', e)
    return null
  }
}
