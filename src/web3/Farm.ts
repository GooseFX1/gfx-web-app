import { PublicKey, TransactionInstruction, Connection, SystemProgram } from "@solana/web3.js"
import {
    TOKEN_PROGRAM_ID,
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    createSyncNativeInstruction,
    NATIVE_MINT,
    createCloseAccountInstruction
} from '@solana/spl-token-v2'
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
    POOL_SEED_PRFIX,
    GAMMA_FEE_ACCOUNT,
    OBSERVATION_PREFIX,
    SYS_VAR_RENT
} from './ids'
import { convertToNativeValue, withdrawBigStringFarm } from "@/utils"
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

export const getLiquidityPoolKey = async (poolIdKey: PublicKey, userPublicKey: PublicKey):
    Promise<undefined | PublicKey> => {
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

const getAmmConfigId = async (index: number): Promise<undefined | PublicKey> => {
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

const getPoolIdKey = async (ammConfigId: PublicKey, mintA: PublicKey, mintB: PublicKey)
    : Promise<undefined | PublicKey> => {
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

const getObservationStateKey = async (poolId: PublicKey)
    : Promise<undefined | PublicKey> => {
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

export const getpoolId = async (selectedCard: any): Promise<PublicKey> => {
    if (!selectedCard) return
    const configIdKey = await getAmmConfigId(0)
    const mintA = new PublicKey(selectedCard?.mintA?.address)
    const mintB = new PublicKey(selectedCard?.mintB?.address)
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
    const createLiquidityIX: TransactionInstruction = await program.instruction.initUserPoolLiquidity({
        accounts: createLiquidityInstructionAccount
    })
    console.log('createLiquidityIX', createLiquidityIX, userPublicKey?.toBase58())
    return createLiquidityIX
}

const getAccountsForDepositWithdraw = async (selectedCard: any, userPublicKey: PublicKey, isDeposit: boolean) => {

    const poolIdKey = await getpoolId(selectedCard)
    const mintA = new PublicKey(selectedCard?.mintA?.address)
    const mintB = new PublicKey(selectedCard?.mintB?.address)
    const poolVaultKeyA = await getPoolVaultKey(poolIdKey, selectedCard?.mintA?.address)
    const poolVaultKeyB = await getPoolVaultKey(poolIdKey, selectedCard?.mintB?.address)
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

    if (!isDeposit) accountObj["memoProgram"] = MEMO_ID
    return accountObj
}

const handleSlippageCalculation = (amount: string, slippage: number, isDeposit: boolean): string => {
    if (!amount) return ''

    let slippageAmount = 0
    if (isDeposit) slippageAmount = Math.ceil(+amount + ((slippage / 100) * +amount))
    else slippageAmount = Math.floor(+amount - ((slippage / 100) * +amount))
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
        rent: SYS_VAR_RENT
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
        lpTokenAmount = new BN(inputToken0)?.mul(lpTokenSupply)
        if (lpTokenAmount.eq(new BN(0))) lpTokenAmount = new BN(0) //to prevent divide by zero erro
        else lpTokenAmount = new BN(inputToken0)?.mul(lpTokenSupply)?.div(swapTokenAmount0)
        let otherTokenAmount = lpTokenAmount?.mul(swapTokenAmount1)
        if (otherTokenAmount.eq(new BN(0))) otherTokenAmount = new BN(0) //to prevent divide by zero error 
        else otherTokenAmount = lpTokenAmount?.mul(swapTokenAmount1)?.div(lpTokenSupply)
        otherTokenAmountInString = withdrawBigStringFarm(otherTokenAmount?.toString(), poolState?.mint1Decimals)
    } else {
        const inputToken1 = convertToNativeValue(givenTokenAmount, poolState?.mint1Decimals)
        lpTokenAmount = new BN(inputToken1)?.mul(lpTokenSupply)
        if (lpTokenAmount.eq(new BN(0))) lpTokenAmount = new BN(0) //to prevent divide by zero error
        else lpTokenAmount = new BN(inputToken1)?.mul(lpTokenSupply)?.div(swapTokenAmount1)
        let otherTokenAmount = lpTokenAmount?.mul(swapTokenAmount0)
        if (otherTokenAmount.eq(new BN(0))) otherTokenAmount = new BN(0) //to prevent divide by zero error       
        else otherTokenAmount = lpTokenAmount?.mul(swapTokenAmount0)?.div(lpTokenSupply)
        otherTokenAmountInString = withdrawBigStringFarm(otherTokenAmount?.toString(), poolState?.mint0Decimals)
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
    const token0Amount = convertToNativeValue(token0SlippageAmount, selectedCard?.mintA?.decimals)
    const token1Amount = convertToNativeValue(token1SlippageAmount, selectedCard?.mintB?.decimals)
    const depositIX: TransactionInstruction = await program.instruction.deposit(
        lpAmount,
        new BN(token0Amount),
        new BN(token1Amount), {
        accounts: depositInstructionAccount
    })
    let depositAmountTX: Transaction
    if (selectedCard?.mintA?.symbol === 'SOL') {
        depositAmountTX = await wrapSolToken(userPublicKey, connection, userSourceDepositAmount)
    }
    else if (selectedCard?.mintB?.symbol === 'SOL') {
        depositAmountTX = await wrapSolToken(userPublicKey, connection, userTargetDepositAmount)
    }
    else depositAmountTX = new Transaction()
    if (liquidityAccIX !== undefined) {
        depositAmountTX.add(liquidityAccIX)
    }
    depositAmountTX.add(depositIX)
    console.log('depositAmountTX', depositAmountTX)
    if (selectedCard?.mintA?.symbol === 'SOL') {
        const ataAddress = await getAssociatedTokenAddress(new PublicKey(selectedCard?.mintA?.address), userPublicKey)
        const tr = createCloseAccountInstruction(ataAddress, userPublicKey, userPublicKey)
        depositAmountTX.add(tr)
    }
    if (selectedCard?.mintB?.symbol === 'SOL') {
        const ataAddress = await getAssociatedTokenAddress(new PublicKey(selectedCard?.mintB?.address), userPublicKey)
        const tr = createCloseAccountInstruction(ataAddress, userPublicKey, userPublicKey)
        depositAmountTX.add(tr)
    }
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
    program: Program<Idl>,
    connection: Connection
): Promise<Transaction> => {
    const withdrawAccounts = await getAccountsForDepositWithdraw(selectedCard, userPublicKey, false)
    const withdrawInstructionAccount = { ...withdrawAccounts }
    const token0SlippageAmount = handleSlippageCalculation(userSourceWithdrawAmount, slippage, false)
    const token1SlippageAmount = handleSlippageCalculation(userTargetWithdrawAmount, slippage, false)
    const token0Amount = convertToNativeValue(token0SlippageAmount, selectedCard?.mintA?.decimals)
    const token1Amount = convertToNativeValue(token1SlippageAmount, selectedCard?.mintB?.decimals)
    const withdrawAmountTX = new Transaction()

    const mintAata = await getAssociatedTokenAddress(new PublicKey(selectedCard?.mintA?.address), userPublicKey)
    const createTokenA = await checkIfTokenAccExists(new PublicKey(selectedCard?.mintA?.address),
        userPublicKey,
        connection,
        mintAata)
    if (createTokenA) withdrawAmountTX.add(createTokenA)

    const mintBata = await getAssociatedTokenAddress(new PublicKey(selectedCard?.mintB?.address), userPublicKey)
    const createTokenB = await checkIfTokenAccExists(new PublicKey(selectedCard?.mintB?.address),
        userPublicKey,
        connection,
        mintBata)
    if (createTokenB) withdrawAmountTX.add(createTokenB)

    const withdrawIX: TransactionInstruction = await program.instruction.withdraw(
        lpAmount,
        new BN(token0Amount),
        new BN(token1Amount), {
        accounts: withdrawInstructionAccount
    })
    withdrawAmountTX.add(withdrawIX)

    if (selectedCard?.mintA?.symbol === 'SOL') {
        const ataAddress = await getAssociatedTokenAddress(new PublicKey(selectedCard?.mintA?.address), userPublicKey)
        const tr = createCloseAccountInstruction(ataAddress, userPublicKey, userPublicKey)
        withdrawAmountTX.add(tr)
    }
    if (selectedCard?.mintB?.symbol === 'SOL') {
        const ataAddress = await getAssociatedTokenAddress(new PublicKey(selectedCard?.mintB?.address), userPublicKey)
        const tr = createCloseAccountInstruction(ataAddress, userPublicKey, userPublicKey)
        withdrawAmountTX.add(tr)
    }
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
    let token0 = new PublicKey(tokenA?.address)
    let token1 = new PublicKey(tokenB?.address)
    let amountToken0 = amountTokenA
    let amountToken1 = amountTokenB
    let decimalsToken0 = tokenA?.decimals
    let decimalsToken1 = tokenB?.decimals

    const compare = new PublicKey(tokenA?.address)?.toBuffer()?.compare(new PublicKey(tokenB?.address)?.toBuffer())

    if (compare > 0) {
        token0 = new PublicKey(tokenB?.address)
        token1 = new PublicKey(tokenA?.address)
        amountToken0 = amountTokenB
        amountToken1 = amountTokenA
        decimalsToken0 = tokenB?.decimals
        decimalsToken1 = tokenA?.decimals
    }
    const accsForCreatePool = await getAccountsForCreatePool(token0, token1, userPubKey)
    const createPoolAcc = { ...accsForCreatePool }
    const amountTokenABN = convertToNativeValue(amountToken0, decimalsToken0)
    const amountTokenBBN = convertToNativeValue(amountToken1, decimalsToken1)
    const createPoolIX: TransactionInstruction = await program.instruction.initialize(
        new BN(amountTokenABN),
        new BN(amountTokenBBN),
        new BN(+new Date()), {
        accounts: createPoolAcc
    })
    const createPoolTxn = new Transaction()
    createPoolTxn.add(createPoolIX)
    return createPoolTxn
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
        console.log("nativeAmount", nativeAmount, tx)
        return tx
    } catch (e) {
        console.log('There was an error while wrapping sol to wsol', e)
        return null
    }
}