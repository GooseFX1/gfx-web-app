import { PublicKey, TransactionInstruction, Connection } from "@solana/web3.js"
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token-v2'
import { Idl, Program } from "@project-serum/anchor"
import { Transaction } from "@solana/web3.js"
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
    POOL_SEED,
    GAMMA_FEE_ACCOUNT
} from './ids'
import { convertToNativeValue, withdrawBigString } from "@/utils"
import { JupToken } from "@/pages/FarmV4/constants"
import { ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token"

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
            [Buffer.from(AUTHORITY_PREFIX)], toPublicKey(GAMMA_PROGRAM_ID)
        )
        return getAuthorityKey[0]
    } catch (err) {
        return undefined
    }
}

const getLiquidityPoolKey = async (poolIdKey: PublicKey, userPublicKey: PublicKey): Promise<undefined | PublicKey> => {
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
const u16ToBytes = (num: number): Uint8Array => {
    const arr = new ArrayBuffer(2);
    const view = new DataView(arr);
    view.setUint16(0, num, false);
    return new Uint8Array(arr);
}

const getAmmConfigId = async (programId: PublicKey, index: number): Promise<undefined | PublicKey> => {
    try {
        const ammConfigId: [PublicKey, number] = await PublicKey.findProgramAddress(
            [Buffer.from(AMM_CONFIG), u16ToBytes(index)],
            programId
        )
        return ammConfigId[0]
    } catch (err) {
        return undefined
    }
}

const getPoolIdKey = async (programId: PublicKey, ammConfigId: PublicKey, mintA: PublicKey, mintB: PublicKey)
    : Promise<undefined | PublicKey> => {
    try {
        const getPoolIdKey: [PublicKey, number] = await PublicKey.findProgramAddress(
            [Buffer.from(POOL_SEED), ammConfigId?.toBuffer(), mintA?.toBuffer(), mintB?.toBuffer()],
            programId
        )
        return getPoolIdKey[0]
    } catch (err) {
        return undefined
    }
}

export const getpoolId = async (selectedCard: any): Promise<PublicKey> => {
    if (!selectedCard) return
    const programId = new PublicKey(GAMMA_PROGRAM_ID)
    const configIdKey = await getAmmConfigId(programId, 0)
    const vaultAMintKey = new PublicKey(selectedCard?.sourceTokenMintAddress)
    const vaultBMintKey = new PublicKey(selectedCard?.targetTokenMintAddress)
    const poolIdKey = await getPoolIdKey(
        programId,
        configIdKey,
        vaultAMintKey,
        vaultBMintKey
    )
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
    const createLiquidityIX: TransactionInstruction = await program.instruction.initUserPoolLiquidity({
        accounts: createLiquidityInstructionAccount
    })
    return createLiquidityIX
}

const getAccountsForDepositWithdraw = async (selectedCard: any, userPublicKey: PublicKey, isDeposit: boolean) => {

    const poolIdKey = await getpoolId(selectedCard)
    const vaultAMintKey = new PublicKey(selectedCard?.sourceTokenMintAddress)
    const vaultBMintKey = new PublicKey(selectedCard?.targetTokenMintAddress)
    const poolVaultKeyA = await getPoolVaultKey(poolIdKey, selectedCard?.sourceTokenMintAddress)
    const poolVaultKeyB = await getPoolVaultKey(poolIdKey, selectedCard?.targetTokenMintAddress)
    const authorityKey = await getAuthorityKey()
    const liquidityAccountKey = await getLiquidityPoolKey(poolIdKey, userPublicKey)
    const tokenAccountAKey = await getAssociatedTokenAddress(vaultAMintKey, userPublicKey)
    const tokenAccountBKey = await getAssociatedTokenAddress(vaultBMintKey, userPublicKey)

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
        vault0Mint: vaultAMintKey,
        vault1Mint: vaultBMintKey
    }

    if (!isDeposit) accountObj["memoProgram"] = MEMO_ID
    return accountObj
}

const handleSlippageCalculation = (amount: string, slippage: number, isDeposit: boolean): string => {
    if (!amount || !slippage) return ''

    let slippageAmount = 0
    if (isDeposit) slippageAmount = Math.ceil(+amount + ((slippage / 100) * +amount))
    else slippageAmount = Math.floor(+amount + ((slippage / 100) * +amount))
    return slippageAmount?.toString()
}

const getAccountsForCreatePool = async (tokenA: JupToken, tokenB: JupToken, userPubKey: PublicKey) => {

    const programId = new PublicKey(GAMMA_PROGRAM_ID)
    const configIdKey = await getAmmConfigId(programId, 0)
    const authorityKey = await getAuthorityKey()
    const token0 = new PublicKey(tokenA?.address)
    const token1 =  new PublicKey(tokenB?.address)
    const token0ata = await getAssociatedTokenAddress(token0, userPubKey)
    const token1ata = await getAssociatedTokenAddress(token1, userPubKey)
    const poolIdKey = await getPoolIdKey(programId, 
        configIdKey, 
        new PublicKey(tokenA?.address), 
        new PublicKey(tokenB?.address)
    )
    const poolVaultKeyA = await getPoolVaultKey(poolIdKey, tokenA?.address)
    const poolVaultKeyB = await getPoolVaultKey(poolIdKey, tokenB?.address)
    const poolFeeAcc = new PublicKey(GAMMA_FEE_ACCOUNT)

    const accountObj = {
        creator: userPubKey,
        ammConfig: configIdKey,
        authority: authorityKey,
        poolState: poolIdKey,
        token0Mint: token0,
        token1Mint: token1, 
        creatorToken0: token0ata,
        creatorToken1: token1ata,
        token0Vault: poolVaultKeyA,
        token1Vault: poolVaultKeyB,
        createPoolFee: poolFeeAcc,
        observationState: poolIdKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        token0Program: TOKEN_2022_PROGRAM_ID,
        token1Program: TOKEN_2022_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SYSTEM,
        rent: SYSTEM
    }

    return accountObj
}

export const calculateOtherTokenAndLPAmount = async (
    givenTokenAmount: string,
    tokenType: TokenType,
    poolState: any,
    connection: Connection
): Promise<{ lpTokenAmount: BN, otherTokenAmountInString: string }> => {

    if (!givenTokenAmount || +givenTokenAmount <= 0) {
        return { lpTokenAmount: new BN(0), otherTokenAmountInString: '' }
    }
    let lpTokenAmount: BN;
    let otherTokenAmountInString: string;

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

    if (tokenType === TokenType.Token0) {
        const inputToken0 = convertToNativeValue(givenTokenAmount, poolState?.mint0Decimals)
        lpTokenAmount = new BN(inputToken0)?.mul(lpTokenSupply)?.div(swapTokenAmount0)
        const otherTokenAmount = lpTokenAmount?.mul(swapTokenAmount1)?.div(lpTokenSupply)
        otherTokenAmountInString = withdrawBigString(otherTokenAmount?.toString(), poolState?.mint1Decimals)
    } else {
        const inputToken1 = convertToNativeValue(givenTokenAmount, poolState?.mint1Decimals)
        lpTokenAmount = new BN(inputToken1)?.mul(lpTokenSupply)?.div(swapTokenAmount1)
        const otherTokenAmount = lpTokenAmount?.mul(swapTokenAmount0)?.div(lpTokenSupply)
        otherTokenAmountInString = withdrawBigString(otherTokenAmount?.toString(), poolState?.mint0Decimals)
    }

    return { lpTokenAmount, otherTokenAmountInString }
}

//Instruction - 1
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
    const depositAccounts = await getAccountsForDepositWithdraw(selectedCard, userPublicKey, true)
    const depositInstructionAccount = { ...depositAccounts }
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
    const token0SlippageAmount = handleSlippageCalculation(userSourceDepositAmount, slippage, true)
    const token1SlippageAmount = handleSlippageCalculation(userTargetDepositAmount, slippage, true)
    const token0Amount = convertToNativeValue(token0SlippageAmount, selectedCard?.sourceTokenMintDecimals)
    const token1Amount = convertToNativeValue(token1SlippageAmount, selectedCard?.targetTokenMintDecimals)
    const depositIX: TransactionInstruction = await program.instruction.deposit(
        lpAmount,
        new BN(token0Amount),
        new BN(token1Amount), {
        accounts: depositInstructionAccount
    })
    const depositAmountTX = new Transaction()
    if (liquidityAccIX !== undefined) {
        depositAmountTX.add(liquidityAccIX)
    }
    depositAmountTX.add(depositIX)
    return depositAmountTX
}

//Instruction - 2
export const withdraw = async (
    userSourceWithdrawAmount: string,
    userTargetWithdrawAmount: string,
    lpAmount: BN,
    slippage: number,
    selectedCard: any,
    userPublicKey: PublicKey,
    program: Program<Idl>
): Promise<Transaction> => {
    const withdrawAccounts = await getAccountsForDepositWithdraw(selectedCard, userPublicKey, false)
    const withdrawInstructionAccount = { ...withdrawAccounts }
    const token0SlippageAmount = handleSlippageCalculation(userSourceWithdrawAmount, slippage, false)
    const token1SlippageAmount = handleSlippageCalculation(userTargetWithdrawAmount, slippage, false)
    const token0Amount = convertToNativeValue(token0SlippageAmount, selectedCard?.sourceTokenMintDecimals)
    const token1Amount = convertToNativeValue(token1SlippageAmount, selectedCard?.targetTokenMintDecimals)
    const withdrawIX: TransactionInstruction = await program.instruction.withdraw(
        lpAmount,
        new BN(token0Amount),
        new BN(token1Amount), {
        accounts: withdrawInstructionAccount
    })
    const withdrawAmountTX = new Transaction()
    withdrawAmountTX.add(withdrawIX)
    return withdrawAmountTX
}

//Instruction - 3
export const createPool = async (
    tokenA: JupToken,
    tokenB: JupToken,
    amountTokenA: string,
    amountTokenB: string,
    userPubKey: PublicKey,
    program: Program
) => {
    const getAccsForCreatePool = await getAccountsForCreatePool(tokenA, tokenB, userPubKey)
    const createPoolAcc = { ...getAccsForCreatePool }
    const createPoolIX: TransactionInstruction = await program.instruction.initialize(
        new BN(1),
        new BN(2),
        new BN(+new Date()), {
        accounts: createPoolAcc
    })
    const createPoolTxn = new Transaction()
    createPoolTxn.add(createPoolIX)
    return createPoolTxn
}