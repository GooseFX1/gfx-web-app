import {
  Connection,
  PublicKey,
  SystemProgram,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  Transaction,
  TransactionInstruction
} from '@solana/web3.js'
import {
  createAssociatedTokenAccountInstruction,
  createCloseAccountInstruction,
  createSyncNativeInstruction,
  getAssociatedTokenAddress,
  NATIVE_MINT,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token-v2'
import { Program } from '@coral-xyz/anchor'
import BN from 'bn.js'
import {
  AUTHORITY_PREFIX,
  GAMMA_FEE_ACCOUNT,
  GAMMA_PROGRAM_ID,
  MEMO_ID,
  OBSERVATION_PREFIX,
  POOL_SEED_PRFIX,
  POOL_VAULT_SEED_PREFIX,
  REWARD_INFO_SEED,
  REWARD_VAULT_SEED,
  SYS_VAR_RENT,
  SYSTEM,
  TOKEN_2022_PROGRAM_ID,
  toPublicKey,
  USER_POOL_LIQUIDITY_PREFIX,
  PARTNER_INFOS_SEED
} from './ids'
import { convertToNativeValue, withdrawBigStringFarm } from '@/utils'
import { JupToken } from '@/pages/FarmV4/constants'
import { ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token'
import Decimal from 'decimal.js-light'
import * as anchor from '@coral-xyz/anchor'
import { GAMMAPoolPartner, GAMMAToken } from '@/types/gamma'
import { CurveCalculator, SYSTEM_PROGRAM_ID } from 'goosefx-amm-sdk'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import {
  getGammaPoolDestinationCollateral,
  getLendingMarketAuthority,
  getReservesForMarket,
  getReservesForMarketLiquidityToken,
  KAMINO_MARKET_ID,
  KAMINO_PROGRAM_ID,
  KaminoReserve
} from './kamino'
import { Wallet } from '@solana/wallet-adapter-react'
import {
  GammaAccountWithInfo,
  GammaAmmConfig,
  GammaObservationState,
  GammaPoolState,
  RewardInfo,
  UserRewardInfo
} from '@/context/price_feed_farm'
import { Gamma } from '@/pages/FarmV4/idl/gamma.type'
import * as gammaWasm from '../../gamma-wasm'

enum TokenType {
  Token0,
  Token1
}

const getPoolVaultKey = async (poolIdKey: PublicKey, mintAddress: string): Promise<undefined | PublicKey> => {
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

const getAuthorityKey = async (): Promise<undefined | PublicKey> => {
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

export const getPoolIdKey = async (
  ammConfigId: PublicKey,
  mintA: PublicKey,
  mintB: PublicKey
): Promise<undefined | PublicKey> => {
  try {
    const compare = mintB?.toBuffer()?.compare(new Uint8Array(mintA?.toBuffer()))

    const getPoolIdKey: [PublicKey, number] = await PublicKey.findProgramAddress(
      [
        Buffer.from(POOL_SEED_PRFIX),
        ammConfigId?.toBuffer(),
        compare > 0 ? mintA?.toBuffer() : mintB?.toBuffer(),
        compare > 0 ? mintB?.toBuffer() : mintA?.toBuffer()
      ],
      new PublicKey(GAMMA_PROGRAM_ID)
    )
    return getPoolIdKey[0]
  } catch (err) {
    return undefined
  }
}

const getObservationStateKey = async (poolId: PublicKey): Promise<undefined | PublicKey> => {
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

const getPartnerInfosKey = async (poolId: PublicKey): Promise<undefined | PublicKey> => {
  try {
    const partnerInfosKey: [PublicKey, number] = await PublicKey.findProgramAddress(
      [Buffer.from(PARTNER_INFOS_SEED), poolId?.toBuffer()],
      new PublicKey(GAMMA_PROGRAM_ID)
    )
    return partnerInfosKey[0]
  } catch (err) {
    return undefined
  }
}

export const getpoolId = async (selectedCard: any, ammConfigId: PublicKey): Promise<PublicKey> => {
  if (!selectedCard) return
  const mintA = new PublicKey(selectedCard?.mintA?.address)
  const mintB = new PublicKey(selectedCard?.mintB?.address)
  const poolIdKey = await getPoolIdKey(ammConfigId, mintA, mintB)
  return poolIdKey
}

const createLiquidityAccountIX = async (
  userPublicKey: PublicKey,
  poolIdKey: PublicKey,
  liquidityAccountKey: PublicKey,
  poolPartners: PublicKey,
  program: Program<Gamma>,
  referralCode: PublicKey | null = null
): Promise<TransactionInstruction> => {
  const createLiquidityInstructionAccount = {
    user: userPublicKey,
    poolState: poolIdKey,
    userPoolLiquidity: liquidityAccountKey,
    poolPartners,
    systemProgram: SYSTEM
  }
  const createLiquidityIX: TransactionInstruction = await program.instruction.initUserPoolLiquidity(referralCode, {
    accounts: createLiquidityInstructionAccount
  })
  //console.log('createLiquidityIX', createLiquidityIX, userPublicKey?.toBase58())
  return createLiquidityIX
}

const getAccountsForDepositWithdraw = async (
  selectedCard: any,
  userPublicKey: PublicKey,
  isDeposit: boolean,
  userSourceTokenType: 'spl-token' | 'native' | 'spl-token-2022' | '',
  userTargetTokenType: 'spl-token' | 'native' | 'spl-token-2022' | '',
  poolIdKey: PublicKey,
  liquidityAccountKey: PublicKey
) => {
  const mintA = new PublicKey(selectedCard?.mintA?.address)
  const mintB = new PublicKey(selectedCard?.mintB?.address)
  const [poolVaultKeyA, poolVaultKeyB, authorityKey, poolPartners, tokenAccountAKey, tokenAccountBKey] =
    await Promise.all([
      getPoolVaultKey(poolIdKey, selectedCard?.mintA?.address),
      getPoolVaultKey(poolIdKey, selectedCard?.mintB?.address),
      getAuthorityKey(),
      getPartnerInfosKey(poolIdKey),
      getAssociatedTokenAddress(
        mintA,
        userPublicKey,
        null,
        userSourceTokenType === 'spl-token-2022' ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
      ),
      getAssociatedTokenAddress(
        mintB,
        userPublicKey,
        null,
        userTargetTokenType === 'spl-token-2022' ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
      )
    ])

  const accountObj = {
    owner: userPublicKey,
    authority: authorityKey,
    poolState: poolIdKey,
    poolPartners,
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

export const getAccountsForSwappingTokens = async (
  mintA: string,
  mintB: string,
  userSourceTokenType: 'spl-token' | 'native' | 'spl-token-2022' | '',
  userTargetTokenType: 'spl-token' | 'native' | 'spl-token-2022' | '',
  poolState: GammaPoolState,
  userPublicKey: PublicKey,
  ammConfigId: PublicKey,
  poolIdKey: PublicKey
) => {
  const mintAPublicKey = new PublicKey(mintA)
  const mintBPublickey = new PublicKey(mintB)
  const [authorityKey, inputTokenAccount, outputTokenAccount] = await Promise.all([
    getAuthorityKey(),
    getAssociatedTokenAddress(
      mintAPublicKey,
      userPublicKey,
      null,
      userSourceTokenType === 'spl-token-2022' ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
    ),
    getAssociatedTokenAddress(
      mintBPublickey,
      userPublicKey,
      null,
      userTargetTokenType === 'spl-token-2022' ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
    )
  ])

  const compare = mintAPublicKey?.toBuffer()?.compare(new Uint8Array(poolState.token0Mint?.toBuffer()))

  return {
    ammConfig: ammConfigId,
    poolState: poolIdKey,
    inputVault: compare > 0 ? poolState.token1Vault : poolState.token0Vault,
    outputVault: compare > 0 ? poolState.token0Vault : poolState.token1Vault,
    observationState: poolState.observationKey,
    payer: userPublicKey,
    inputTokenAccount: inputTokenAccount,
    outputTokenAccount: outputTokenAccount,
    inputTokenMint: mintAPublicKey,
    outputTokenMint: mintBPublickey,
    inputTokenProgram: userSourceTokenType === 'spl-token-2022' ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID,
    outputTokenProgram: userTargetTokenType === 'spl-token-2022' ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID,
    authority: authorityKey
  }
}

const handleSlippageCalculation = (amount: string, slippage: number, isDeposit: boolean): string => {
  if (!amount) return ''

  let slippageAmount = 0
  if (isDeposit) slippageAmount = Math.ceil(+amount + (slippage / 100) * +amount)
  else slippageAmount = Math.floor(+amount - (slippage / 100) * +amount)
  return slippageAmount?.toString()
}

const getAccountsForCreatePool = async (
  token0: PublicKey,
  token1: PublicKey,
  userPubKey: PublicKey,
  token0Type: 'spl-token' | 'native' | 'spl-token-2022',
  token1Type: 'spl-token' | 'native' | 'spl-token-2022',
  ammConfigId: PublicKey
) => {
  const authorityKey = await getAuthorityKey()
  const token0ata = await getAssociatedTokenAddress(
    token0,
    userPubKey,
    null,
    token0Type === 'spl-token-2022' ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
  )
  const token1ata = await getAssociatedTokenAddress(
    token1,
    userPubKey,
    null,
    token1Type === 'spl-token-2022' ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
  )
  const poolIdKey = await getPoolIdKey(ammConfigId, token0, token1)
  const observationStateKey = await getObservationStateKey(poolIdKey)
  const poolVaultKeyA = await getPoolVaultKey(poolIdKey, token0?.toBase58())
  const poolVaultKeyB = await getPoolVaultKey(poolIdKey, token1?.toBase58())
  const poolFeeAcc = new PublicKey(GAMMA_FEE_ACCOUNT)
  const userPoolLiquidityAcc = await getLiquidityPoolKey(poolIdKey, userPubKey)

  const accountObj = {
    creator: userPubKey,
    ammConfig: ammConfigId,
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
    token0Program: token0Type === 'spl-token-2022' ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID,
    token1Program: token1Type === 'spl-token-2022' ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    systemProgram: SYSTEM,
    rent: SYS_VAR_RENT
  }

  return accountObj
}

export const calculateOtherTokenAndLPAmount = (
  givenTokenAmount: string,
  tokenType: TokenType,
  poolState: GammaPoolState
): { lpTokenAmount: BN; otherTokenAmountInString: string } => {
  try {
    if (!givenTokenAmount || +givenTokenAmount <= 0) {
      return { lpTokenAmount: new BN(0), otherTokenAmountInString: '' }
    }
    const swapTokenAmount0 = new BN(poolState?.token0VaultAmount)
    const swapTokenAmount1 = new BN(poolState?.token1VaultAmount)

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

export const lpTokensToTradingTokens = (
  lpTokenAmount: BN,
  poolState: GammaPoolState
): { tokenAmount0: BN; tokenAmount1: BN } => {
  try {
    const lpTokenSupply = poolState?.lpSupply
    if (lpTokenSupply.eq(new BN(0))) {
      return { tokenAmount0: new BN(0), tokenAmount1: new BN(0) }
    }
    const swapTokenAmount0 = new BN(poolState?.token0VaultAmount)
    const swapTokenAmount1 = new BN(poolState?.token1VaultAmount)

    const tokenAmount0 = lpTokenAmount.mul(swapTokenAmount0).div(lpTokenSupply)
    const tokenAmount1 = lpTokenAmount.mul(swapTokenAmount1).div(lpTokenSupply)

    return { tokenAmount0, tokenAmount1 }
  } catch (e) {
    console.log('Error while fetching token amounts for withdrawing', e)
    return { tokenAmount0: new BN(0), tokenAmount1: new BN(0) }
  }
}

export const getMaxSolDepositAmount = async (userSourceDepositAmount: number, connection: Connection) => {
  const priorityFees = 0.0008 //average priority fees for gamma instructions on turbo level
  const baseFees = 0.000005 //base fees for one signer
  const buffer = 0.0005 //buffer for network congestion
  const rentExemptBalance = (await connection.getMinimumBalanceForRentExemption(0)) / 1000000000 //rent
  const liquidityAccCreationFee = 0.00217152 //liquidity account creation fees
  const eligibleSolToDeposit =
    +userSourceDepositAmount - (priorityFees + baseFees + buffer + rentExemptBalance + liquidityAccCreationFee)

  return eligibleSolToDeposit?.toString()
}

//Instruction - 1
export const deposit = async (
  userSourceDepositAmount: string,
  userTargetDepositAmount: string,
  lpAmount: BN,
  slippage: number,
  selectedCard: any,
  userPublicKey: PublicKey,
  program: Program<Gamma>,
  connection: Connection,
  userSourceTokenType: 'spl-token' | 'native' | 'spl-token-2022' | '',
  userTargetTokenType: 'spl-token' | 'native' | 'spl-token-2022' | '',
  poolIdKey: PublicKey,
  liqKey: PublicKey,
  isSolMaxDeposit?: boolean,
  referralDetails?: GAMMAPoolPartner | null
): Promise<Transaction> => {
  const depositAccounts = await getAccountsForDepositWithdraw(
    selectedCard,
    userPublicKey,
    true,
    userSourceTokenType,
    userTargetTokenType,
    poolIdKey,
    liqKey
  )
  const depositInstructionAccount = { ...depositAccounts }
  const liqAccData = await connection.getAccountInfo(depositAccounts?.userPoolLiquidity)
  let liquidityAccIX = undefined
  if (!liqAccData) {
    liquidityAccIX = await createLiquidityAccountIX(
      userPublicKey,
      depositAccounts?.poolState,
      depositAccounts?.userPoolLiquidity,
      depositAccounts?.poolPartners,
      program,
      referralDetails?.address ? new PublicKey(referralDetails.address) : null
    )
  }
  const userSourceAmount =
    selectedCard?.mintA?.symbol === 'SOL' && isSolMaxDeposit
      ? await getMaxSolDepositAmount(+userSourceDepositAmount, connection)
      : userSourceDepositAmount
  const userTargetAmount =
    selectedCard?.mintB?.symbol === 'SOL' && isSolMaxDeposit
      ? await getMaxSolDepositAmount(+userTargetDepositAmount, connection)
      : userTargetDepositAmount
  //console.log('user deposits', userSourceAmount, userTargetAmount)
  const token0SlippageAmount = handleSlippageCalculation(userSourceAmount, slippage, true)
  const token1SlippageAmount = handleSlippageCalculation(userTargetAmount, slippage, true)
  //console.log('user deposits with slippage', token0SlippageAmount, token1SlippageAmount)
  const token0Amount = convertToNativeValue(token0SlippageAmount, selectedCard?.mintA?.decimals)
  const token1Amount = convertToNativeValue(token1SlippageAmount, selectedCard?.mintB?.decimals)
  //console.log('user deposits of native value', token0Amount, token1Amount, lpAmount?.toNumber())
  const depositIX: TransactionInstruction = await program.instruction.deposit(
    lpAmount,
    new BN(token0Amount),
    new BN(token1Amount),
    {
      accounts: depositInstructionAccount
    }
  )
  let depositAmountTX: Transaction
  const slippageRatio = slippage / 100
  if (selectedCard?.mintA?.symbol === 'SOL') {
    const depAmount = new Decimal(userSourceAmount).mul(1 + slippageRatio).toString()
    depositAmountTX = await wrapSolToken(userPublicKey, connection, depAmount)
  } else if (selectedCard?.mintB?.symbol === 'SOL') {
    const depAmount = new Decimal(userTargetAmount).mul(1 + slippageRatio).toString()
    depositAmountTX = await wrapSolToken(userPublicKey, connection, depAmount)
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

const getWithdrawRemainingAccounts = async (
  selectedCard: any,
  poolAddress: PublicKey,
  connection: Connection,
  wallet: Wallet
) => {
  const kaminoReserves = await getReservesForMarket(connection, wallet)
  const kaminoReserveToken0 = getReservesForMarketLiquidityToken(
    kaminoReserves,
    new PublicKey(selectedCard.mintA.address)
  )
  const kaminoReserveToken1 = getReservesForMarketLiquidityToken(
    kaminoReserves,
    new PublicKey(selectedCard.mintB.address)
  )

  const remainingAccounts = []
  const addAccountsFromReserve = (reservePubkey: PublicKey, reserve: KaminoReserve) => {
    remainingAccounts.push({
      pubkey: reservePubkey,
      isWritable: true,
      isSigner: false
    })
    remainingAccounts.push({
      pubkey: KAMINO_MARKET_ID,
      isWritable: true,
      isSigner: false
    })
    remainingAccounts.push({
      pubkey: getLendingMarketAuthority(KAMINO_MARKET_ID, KAMINO_PROGRAM_ID)[0],
      isWritable: false,
      isSigner: false
    })
    remainingAccounts.push({
      pubkey: reserve.state.liquidity.supplyVault,
      isWritable: true,
      isSigner: false
    })
    remainingAccounts.push({
      pubkey: reserve.state.collateral.mintPubkey,
      isWritable: true,
      isSigner: false
    })
    remainingAccounts.push({
      pubkey: getGammaPoolDestinationCollateral(poolAddress, reserve.state.liquidity.mintPubkey),
      isWritable: true,
      isSigner: false
    })
  }

  if (kaminoReserveToken0) {
    addAccountsFromReserve(kaminoReserveToken0.pubkey, kaminoReserveToken0.reserve)
  }
  if (kaminoReserveToken1) {
    if (kaminoReserveToken0 == null) {
      // If there is no kamino reserve for token 0, we need to add the system program as a remaining account
      // This is done because the remaining accounts in the instruction are always read in order.
      remainingAccounts.push(
        ...Array(6).fill({
          pubkey: SYSTEM_PROGRAM_ID,
          isWritable: false,
          isSigner: false
        })
      )
    }

    addAccountsFromReserve(kaminoReserveToken1.pubkey, kaminoReserveToken1.reserve)
  }

  return remainingAccounts
}

//Instruction - 2
export const withdraw = async (
  userSourceWithdrawAmount: string,
  userTargetWithdrawAmount: string,
  lpAmount: BN,
  slippage: number,
  selectedCard: any,
  userPublicKey: PublicKey,
  program: Program<Gamma>,
  connection: Connection,
  userSourceTokenType: 'spl-token' | 'native' | 'spl-token-2022' | '',
  userTargetTokenType: 'spl-token' | 'native' | 'spl-token-2022' | '',
  wallet: Wallet,
  poolIdKey,
  liqKey
): Promise<Transaction> => {
  //console.log('user withdraws', userSourceWithdrawAmount, userTargetWithdrawAmount)
  const withdrawAccounts = await getAccountsForDepositWithdraw(
    selectedCard,
    userPublicKey,
    false,
    userSourceTokenType,
    userTargetTokenType,
    poolIdKey,
    liqKey
  )

  const withdrawInstructionAccount = {
    ...withdrawAccounts,
    kaminoProgram: KAMINO_PROGRAM_ID,
    instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY
  }
  const token0SlippageAmount = handleSlippageCalculation(userSourceWithdrawAmount, slippage, false)
  const token1SlippageAmount = handleSlippageCalculation(userTargetWithdrawAmount, slippage, false)
  const token0Amount = convertToNativeValue(token0SlippageAmount, selectedCard?.mintA?.decimals)
  const token1Amount = convertToNativeValue(token1SlippageAmount, selectedCard?.mintB?.decimals)
  //console.log('user withdraws of native value', token0Amount, token1Amount, lpAmount?.toNumber())
  const withdrawAmountTX = new Transaction()

  const remainingAccounts = await getWithdrawRemainingAccounts(
    selectedCard,
    withdrawAccounts.poolState,
    connection,
    wallet
  )

  const mintAata = await getAssociatedTokenAddress(
    new PublicKey(selectedCard?.mintA?.address),
    userPublicKey,
    null,
    userSourceTokenType === 'spl-token-2022' ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
  )
  const createTokenA = await checkIfTokenAccExists(
    new PublicKey(selectedCard?.mintA?.address),
    userPublicKey,
    connection,
    mintAata
  )
  if (createTokenA) withdrawAmountTX.add(createTokenA)

  const mintBata = await getAssociatedTokenAddress(
    new PublicKey(selectedCard?.mintB?.address),
    userPublicKey,
    null,
    userTargetTokenType === 'spl-token-2022' ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
  )
  const createTokenB = await checkIfTokenAccExists(
    new PublicKey(selectedCard?.mintB?.address),
    userPublicKey,
    connection,
    mintBata
  )
  if (createTokenB) withdrawAmountTX.add(createTokenB)

  const withdrawIX: TransactionInstruction = await program.methods
    .withdraw(lpAmount, new BN(token0Amount), new BN(token1Amount))
    .accounts(withdrawInstructionAccount)
    .remainingAccounts(remainingAccounts)
    .instruction()
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

//Instruction - 3
export const createPool = async (
  tokenA: JupToken,
  tokenB: JupToken,
  amountTokenA: string,
  amountTokenB: string,
  userPubKey: PublicKey,
  program: Program<Gamma>,
  connection: Connection,
  tokenAType: 'spl-token' | 'native' | 'spl-token-2022',
  tokenBType: 'spl-token' | 'native' | 'spl-token-2022',
  poolType: string,
  ammConfigId: PublicKey
) => {
  let token0 = new PublicKey(tokenA?.address)
  let token1 = new PublicKey(tokenB?.address)
  let amountToken0 = amountTokenA
  let amountToken1 = amountTokenB
  let decimalsToken0 = tokenA?.decimals
  let decimalsToken1 = tokenB?.decimals
  let token0Symbol = tokenA?.symbol
  let token1Symbol = tokenB?.symbol
  let token0Type = tokenAType
  let token1Type = tokenBType

  const compare = new PublicKey(tokenA?.address)
    ?.toBuffer()
    ?.compare(new Uint8Array(new PublicKey(tokenB?.address)?.toBuffer()))

  if (compare > 0) {
    token0 = new PublicKey(tokenB?.address)
    token1 = new PublicKey(tokenA?.address)
    amountToken0 = amountTokenB
    amountToken1 = amountTokenA
    decimalsToken0 = tokenB?.decimals
    decimalsToken1 = tokenA?.decimals
    token0Symbol = tokenB?.symbol
    token1Symbol = tokenA?.symbol
    token0Type = tokenBType
    token1Type = tokenAType
  }
  const accsForCreatePool = await getAccountsForCreatePool(
    token0,
    token1,
    userPubKey,
    token0Type,
    token1Type,
    ammConfigId
  )
  const createPoolAcc = { ...accsForCreatePool }
  const amountTokenABN = convertToNativeValue(amountToken0, decimalsToken0)
  const amountTokenBBN = convertToNativeValue(amountToken1, decimalsToken1)
  const createPoolIX: TransactionInstruction = await program.methods
    .initialize(
      new BN(amountTokenABN),
      new BN(amountTokenBBN),
      new BN(Math.floor(Date.now() / 1000)),
      poolType === 'Stable' ? new BN(10000) : poolType === 'Primary' ? new BN(25000) : new BN(100000),
      new BN(0)
    )
    .accounts(createPoolAcc)
    .instruction()
  const createPartnersIX: TransactionInstruction = await program.methods
    .initializePoolPartners()
    .accounts({
      payer: userPubKey,
      poolState: accsForCreatePool.poolState
    })
    .instruction()
  let createPoolTxn: Transaction
  if (token0Symbol === 'SOL') createPoolTxn = await wrapSolToken(userPubKey, connection, amountToken0)
  else if (token1Symbol === 'SOL') createPoolTxn = await wrapSolToken(userPubKey, connection, amountToken1)
  else createPoolTxn = new Transaction()

  createPoolTxn.add(createPoolIX)
  createPoolTxn.add(createPartnersIX)

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

export const getPriceQuotes = (
  amountToken: string,
  mintA: GAMMAToken | JupToken,
  mintB: GAMMAToken | JupToken,
  ammConfigState: GammaAccountWithInfo<GammaAmmConfig>,
  poolState: GammaAccountWithInfo<GammaPoolState>,
  observationState: GammaAccountWithInfo<GammaObservationState>
) => {
  const mintAPublicKey = new PublicKey(mintA?.address)

  const inputToken0Amount = convertToNativeValue(amountToken, mintA?.decimals)

  const swapTokenAmount0 = new BN(poolState?.account.token0VaultAmount)
  const swapTokenAmount1 = new BN(poolState?.account.token1VaultAmount)

  const zeroForOne = mintAPublicKey.equals(poolState.account.token0Mint)
  const spotPriceBeforeSwap = zeroForOne
    ? new BigNumber(poolState.account.token1VaultAmount.toString()).div(
        poolState.account.token0VaultAmount.toString()
      )
    : new BigNumber(poolState.account.token0VaultAmount.toString()).div(
        poolState.account.token1VaultAmount.toString()
      )

  const swapResult = CurveCalculator.swap(
    new BN(inputToken0Amount),
    mintAPublicKey.equals(poolState.account.token0Mint) ? swapTokenAmount0 : swapTokenAmount1,
    mintAPublicKey.equals(poolState.account.token0Mint) ? swapTokenAmount1 : swapTokenAmount0,
    ammConfigState.account.tradeFeeRate,
    observationState.account
  )

  const executionPrice = new BigNumber(swapResult.destinationAmountSwapped.toString()).div(
    new BigNumber(inputToken0Amount)
  )
  const priceDifference = executionPrice.minus(spotPriceBeforeSwap).abs()
  const priceImpact = priceDifference.div(spotPriceBeforeSwap).multipliedBy(100).toFixed(2)

  return {
    destinationAmountSwapped: new BigNumber(swapResult.destinationAmountSwapped.toNumber())
      .div(10 ** mintB?.decimals)
      .toString(),
    tradeFee:
      new BigNumber(swapResult.tradeFee.toNumber()).div(10 ** mintA?.decimals).toString() + ` ${mintA?.symbol}`,
    priceImpact
  }
}

//Instruction - 4 swapping TokenA -> TokenB
export const swapTokens = async (
  amountToken: string,
  mintA: GAMMAToken | JupToken,
  mintB: GAMMAToken | JupToken,
  userPublicKey: PublicKey,
  slippage: number,
  program: Program<Gamma>,
  connection: Connection,
  ammConfigState: GammaAccountWithInfo<GammaAmmConfig>,
  poolState: GammaAccountWithInfo<GammaPoolState>,
  observationState: GammaAccountWithInfo<GammaObservationState>,
  accounts: any
) => {
  const mintAPublicKey = new PublicKey(mintA?.address)
  const mintBPublickey = new PublicKey(mintB?.address)

  const amount = convertToNativeValue(amountToken, mintA?.decimals)

  const { destinationAmountSwapped: quote } = getPriceQuotes(
    amountToken,
    mintA,
    mintB,
    ammConfigState,
    poolState,
    observationState
  )

  const slippageAmount = new anchor.BN(+quote * (1 + slippage / 100))

  let swapTxn: Transaction = new Transaction()
  if (mintA?.symbol === 'SOL') swapTxn = await wrapSolToken(userPublicKey, connection, amountToken)

  if (mintB?.symbol === 'SOL') swapTxn = await wrapSolToken(userPublicKey, connection, '0')
  else {
    const accountExists = await connection.getAccountInfo(accounts.outputTokenAccount)
    if (!accountExists) {
      swapTxn.add(
        createAssociatedTokenAccountInstruction(
          userPublicKey,
          accounts.outputTokenAccount,
          userPublicKey,
          accounts.outputTokenMint
        )
      )
    }
  }

  const swapIX: TransactionInstruction = await program.instruction.swapBaseInput(
    new anchor.BN(amount),
    slippageAmount,
    {
      accounts: accounts
    }
  )
  swapTxn.add(swapIX)

  if (mintA?.symbol === 'SOL') {
    const ataAddress = await getAssociatedTokenAddress(mintAPublicKey, userPublicKey)
    const tr = createCloseAccountInstruction(ataAddress, userPublicKey, userPublicKey)
    swapTxn.add(tr)
  } else if (mintB?.symbol === 'SOL') {
    const ataAddress = await getAssociatedTokenAddress(mintBPublickey, userPublicKey)
    const tr = createCloseAccountInstruction(ataAddress, userPublicKey, userPublicKey)
    swapTxn.add(tr)
  }

  return swapTxn
}

export const createTokenRewards = async (
  program: Program<Gamma>,
  poolId: string,
  startTime: dayjs.Dayjs,
  endTime: dayjs.Dayjs,
  rewardAmount: string,
  rewardMint: JupToken,
  userPublicKey: PublicKey
) => {
  const startTimeBN = new BN(startTime.add(5, 'minute').unix())
  const endTimeBN = new BN(endTime.unix())
  const rewardAmountBN = new BN(
    new BigNumber(rewardAmount).times(new BigNumber(10).pow(rewardMint.decimals)).toNumber()
  )
  const authorityKey = await getAuthorityKey()
  const pool = new PublicKey(poolId)
  const rewardMintPublicKey = new PublicKey(rewardMint.address)

  const rewardInfo = await getRewardInfoKey(startTimeBN, pool, rewardMintPublicKey)

  const tokenRewardsTxn: Transaction = new Transaction()

  const tokenRewardsIX = program.instruction.createRewards(startTimeBN, endTimeBN, rewardAmountBN, {
    accounts: {
      poolState: pool,
      authority: authorityKey,
      rewardMint: rewardMintPublicKey,
      rewardProvider: userPublicKey,
      rewardProvidersTokenAccount: await getAssociatedTokenAddress(rewardMintPublicKey, userPublicKey),
      rewardInfo: rewardInfo,
      rewardVault: await getRewardVaultKey(rewardInfo),
      systemProgram: SYSTEM,
      tokenProgram: TOKEN_PROGRAM_ID,
      tokenProgram2022: TOKEN_2022_PROGRAM_ID
    }
  })

  tokenRewardsTxn.add(tokenRewardsIX)

  return tokenRewardsTxn
}

const getRewardInfoKey = async (startTime: BN, poolState: PublicKey, rewardMint: PublicKey) => {
  const [rewardInfoKey] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(REWARD_INFO_SEED),
      poolState.toBuffer(),
      startTime.toArrayLike(Buffer, 'le', 8),
      rewardMint.toBuffer()
    ],
    new PublicKey(GAMMA_PROGRAM_ID)
  )
  return rewardInfoKey
}
const getRewardVaultKey = async (rewardInfo: PublicKey) => {
  const [rewardVaultKey] = PublicKey.findProgramAddressSync(
    [Buffer.from(REWARD_VAULT_SEED), rewardInfo.toBuffer()],
    new PublicKey(GAMMA_PROGRAM_ID)
  )
  return rewardVaultKey
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

export const doesPoolWithMintsExist = async (
  mintA: string,
  mintB: string,
  program: Program<Gamma>,
  ammConfigId: PublicKey
): Promise<boolean> => {
  try {
    const mintAPublicKey = new PublicKey(mintA)
    const mintBPublickey = new PublicKey(mintB)
    const poolIdKey = await getPoolIdKey(ammConfigId, mintAPublicKey, mintBPublickey)
    const poolState = await program.account.poolState.fetch(poolIdKey)
    return poolState != null
  } catch (e) {
    return false
  }
}

export interface BoostedRewardInfo {
  userRewardInfoPublicKey: PublicKey
  userRewardInfo: UserRewardInfo
  rewardInfo: RewardInfo
}

export const getClaimRewardsAccounts = async (
  program: Program<Gamma>,
  userPublicKey: PublicKey
): Promise<BoostedRewardInfo[]> => {
  const userRewardInfos = await program.account.userRewardInfo.all([
    {
      memcmp: {
        offset: 8,
        encoding: 'base58',
        bytes: userPublicKey.toBase58()
      }
    }
  ])

  const userRewardInfosWithWithdrawableRewards = userRewardInfos.filter((userRewardInfo) => {
    const userRewardInfoAccount = userRewardInfo.account as UserRewardInfo
    return userRewardInfoAccount.totalRewards.sub(userRewardInfoAccount.totalClaimed).gt(new BN(0))
  })
  const allRewardInfoKeys = userRewardInfosWithWithdrawableRewards.map(
    (userRewardInfo) => (userRewardInfo.account as UserRewardInfo).rewardInfo
  )
  const allRewardInfos = await program.account.rewardInfo.fetchMultiple(allRewardInfoKeys)

  const withdrawalRewardInfos = userRewardInfosWithWithdrawableRewards.map((userRewardInfo) => {
    const indexOfRewardInfoKey = allRewardInfoKeys.findIndex((rewardInfoKey) =>
      rewardInfoKey.equals(userRewardInfo.account.rewardInfo)
    )
    const rewardInfo = allRewardInfos[indexOfRewardInfoKey]
    return {
      userRewardInfoPublicKey: userRewardInfo.publicKey,
      userRewardInfo: userRewardInfo.account as UserRewardInfo,
      rewardInfo: rewardInfo as RewardInfo
    } as BoostedRewardInfo
  })

  return withdrawalRewardInfos
}

export const getAllActiveRewards = async (
  program: Program<Gamma>
): Promise<{ publicKey: PublicKey; rewardInfo: RewardInfo }[]> => {
  const currentTime = new BN(dayjs().unix())
  const userRewardInfos = await program.account.rewardInfo.all()

  const activeRewards = userRewardInfos.filter((rewardInfo) => {
    const rewardInfoAccount = rewardInfo.account as RewardInfo
    return rewardInfoAccount.startAt.lte(currentTime) && rewardInfoAccount.endRewardsAt.gte(currentTime)
  })

  return activeRewards.map((rewardInfo) => ({
    publicKey: rewardInfo.publicKey,
    rewardInfo: rewardInfo.account as RewardInfo
  }))
}

export const claimRewards = async (
  program: Program<Gamma>,
  userPublicKey: PublicKey,
  connection: Connection,
  boostedRewardInfo: BoostedRewardInfo
) => {
  // const userRewards = await getUserRewards(program, userPublicKey)
  const claimRewardsTxn = new Transaction()

  const associatedTokenAccount = await getAssociatedTokenAddress(boostedRewardInfo.rewardInfo.mint, userPublicKey)
  const accountExists = await connection.getAccountInfo(associatedTokenAccount)
  // Create token account to hold your wrapped SOL
  if (!accountExists)
    claimRewardsTxn.add(
      createAssociatedTokenAccountInstruction(
        userPublicKey,
        associatedTokenAccount,
        userPublicKey,
        boostedRewardInfo.rewardInfo.mint
      )
    )

  const tokenRewardsIX = program.instruction.claimRewards({
    accounts: {
      user: userPublicKey,
      userTokenAccount: await getAssociatedTokenAddress(boostedRewardInfo.rewardInfo.mint, userPublicKey),
      userRewardInfo: boostedRewardInfo.userRewardInfoPublicKey,
      poolState: boostedRewardInfo.rewardInfo.pool,
      authority: await getAuthorityKey(),
      rewardMint: boostedRewardInfo.rewardInfo.mint,
      rewardInfo: boostedRewardInfo.userRewardInfo.rewardInfo,
      rewardVault: await getRewardVaultKey(boostedRewardInfo.userRewardInfo.rewardInfo),
      systemProgram: SYSTEM,
      tokenProgram: TOKEN_PROGRAM_ID,
      tokenProgram2022: TOKEN_2022_PROGRAM_ID
    }
  })
  claimRewardsTxn.add(tokenRewardsIX)

  return claimRewardsTxn
}

export const getPriceQuotesForOracleBasedSwaps = (
  amountToken: string,
  mintA: GAMMAToken | JupToken,
  mintB: GAMMAToken | JupToken,
  ammConfigState: GammaAccountWithInfo<GammaAmmConfig>,
  poolState: GammaAccountWithInfo<GammaPoolState>,
  observationState: GammaAccountWithInfo<GammaObservationState>
) => {
  gammaWasm.solana_program_init()
  const mintAPublicKey = new PublicKey(mintA?.address)

  const inputToken0Amount = convertToNativeValue(amountToken, mintA?.decimals)
  const zeroForOne = mintAPublicKey.equals(poolState.account.token0Mint)
  const spotPriceBeforeSwap = zeroForOne
    ? new BigNumber(poolState.account.token1VaultAmount.toString()).div(
        poolState.account.token0VaultAmount.toString()
      )
    : new BigNumber(poolState.account.token0VaultAmount.toString()).div(
        poolState.account.token1VaultAmount.toString()
      )

  console.log('Pool', poolState.account)
  console.log('Pool', poolState.account.oraclePriceToken0ByToken1.toString())
  const swapResult = gammaWasm.getOracleBasedSwapQuoteAmount({
    sourceAmountToBeSwapped: parseInt(inputToken0Amount),
    ammConfigData: ammConfigState.accountInfo.data,
    poolStateData: poolState.accountInfo.data,
    observationStateData: observationState.accountInfo.data,
    zeroForOne,
    isInvokedBySignedSegmenter: false
  })
  const executionPrice = new BigNumber(swapResult.destinationAmountSwapped).div(new BigNumber(inputToken0Amount))

  const priceDifference = executionPrice.minus(spotPriceBeforeSwap).abs()
  const priceImpact = priceDifference.div(spotPriceBeforeSwap).multipliedBy(100).toFixed(2)
  return {
    destinationAmountSwapped: new BigNumber(swapResult.destinationAmountSwapped)
      .div(10 ** mintB?.decimals)
      .toString(),
    tradeFee: new BigNumber(swapResult.dynamicFee).div(10 ** mintA?.decimals).toString() + ` ${mintA?.symbol}`,
    priceImpact
  }
}

//Instruction - 4 swapping TokenA -> TokenB
export const oracleBasedSwap = async (
  amountToken: string,
  mintA: GAMMAToken | JupToken,
  mintB: GAMMAToken | JupToken,
  userPublicKey: PublicKey,
  slippage: number,
  program: Program<Gamma>,
  connection: Connection,
  ammConfigState: GammaAccountWithInfo<GammaAmmConfig>,
  poolState: GammaAccountWithInfo<GammaPoolState>,
  observationState: GammaAccountWithInfo<GammaObservationState>,
  accounts: any
) => {
  const mintAPublicKey = new PublicKey(mintA?.address)
  const mintBPublickey = new PublicKey(mintB?.address)

  const amount = convertToNativeValue(amountToken, mintA?.decimals)

  const { destinationAmountSwapped: quote } = getPriceQuotesForOracleBasedSwaps(
    amountToken,
    mintA,
    mintB,
    ammConfigState,
    poolState,
    observationState
  )

  const slippageAmount = new anchor.BN(+quote * (1 + slippage / 100))

  let swapTxn: Transaction = new Transaction()
  if (mintA?.symbol === 'SOL') swapTxn = await wrapSolToken(userPublicKey, connection, amountToken)

  if (mintB?.symbol === 'SOL') swapTxn = await wrapSolToken(userPublicKey, connection, '0')
  else {
    const accountExists = await connection.getAccountInfo(accounts.outputTokenAccount)
    if (!accountExists) {
      swapTxn.add(
        createAssociatedTokenAccountInstruction(
          userPublicKey,
          accounts.outputTokenAccount,
          userPublicKey,
          accounts.outputTokenMint
        )
      )
    }
  }

  const swapIX: TransactionInstruction = await program.methods
    .oracleBasedSwapBaseInput(new anchor.BN(amount), slippageAmount)
    .accountsStrict(accounts)
    .instruction()
  swapTxn.add(swapIX)

  if (mintA?.symbol === 'SOL') {
    const ataAddress = await getAssociatedTokenAddress(mintAPublicKey, userPublicKey)
    const tr = createCloseAccountInstruction(ataAddress, userPublicKey, userPublicKey)
    swapTxn.add(tr)
  } else if (mintB?.symbol === 'SOL') {
    const ataAddress = await getAssociatedTokenAddress(mintBPublickey, userPublicKey)
    const tr = createCloseAccountInstruction(ataAddress, userPublicKey, userPublicKey)
    swapTxn.add(tr)
  }

  return swapTxn
}
