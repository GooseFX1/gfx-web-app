import { PublicKey, TransactionInstruction, Connection } from "@solana/web3.js"
import { getCpmmPdaAmmConfigId, getCpmmPdaPoolId } from "external/src/gfx/cpmm/pda"
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token-v2'
import { Idl, Program } from "@project-serum/anchor"
import { Transaction } from "@solana/web3.js"
import BN from 'bn.js'
import BigNumber from "bignumber.js"
import {
    GAMMA_PROGRAM_ID,
    POOL_VAULT_SEED_PREFIX,
    toPublicKey,
    AUTHORITY_PREFIX,
    USER_POOL_LIQUIDITY_PREFIX,
    TOKEN_2022_PROGRAM_ID,
    SYSTEM,
    MEMO_ID
} from './ids'

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

export const getpoolId = (selectedCard: any): PublicKey => {
    if (!selectedCard) return
    const programId = new PublicKey(GAMMA_PROGRAM_ID)
    const configId = getCpmmPdaAmmConfigId(programId, 0)
    const vaultAMintKey = new PublicKey(selectedCard?.sourceTokenMintAddress)
    const vaultBMintKey = new PublicKey(selectedCard?.targetTokenMintAddress)
    const configIdKey = configId?.publicKey
    const poolId = getCpmmPdaPoolId(
        programId,
        configIdKey,
        vaultAMintKey,
        vaultBMintKey
    )
    const poolIdKey = poolId?.publicKey
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

    const poolIdKey = getpoolId(selectedCard)
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

export const deposit = async (
    userSourceDepositAmount: BigNumber,
    userTargetDepositAmount: BigNumber,
    //eslint-disable-next-line
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
    const depositIX: TransactionInstruction = await program.instruction.deposit(
        new BN(Math.sqrt(450)),
        new BN(3),
        new BN(150), {
        accounts: depositInstructionAccount
    })
    const depositAmountTX = new Transaction()
    if (liquidityAccIX !== undefined) {
        depositAmountTX.add(liquidityAccIX)
    }
    depositAmountTX.add(depositIX)
    return depositAmountTX
}

export const calculateTokenAndLPAmount = async (
    givenTokenAmount: BigNumber,
    tokenType: TokenType,
    poolState: any,
    connection: Connection
): Promise<void> => {
    let lpTokenAmount: BigNumber;
    let otherTokenAmount: BigNumber;
    if (tokenType === TokenType.Token0) {
        const lpTokenSupply = poolState?.lpSupply?.toNumber()
        const tokenAccountInfo0 = await connection.getParsedAccountInfo(poolState?.token0Vault)
        const amount0 = (tokenAccountInfo0?.value?.data as any).parsed?.info?.tokenAmount?.uiAmount
        const protocolFees0 = poolState?.protocolFeesToken0?.toNumber()
        const fundFees0 = poolState?.fundFeesToken0?.toNumber()
        const swapTokenAmount0 = amount0 - (protocolFees0 + fundFees0)

        const tokenAccountInfo1 = await connection.getParsedAccountInfo(poolState?.token1Vault)
        const amount1 = (tokenAccountInfo1?.value?.data as any).parsed?.info?.tokenAmount?.uiAmount
        const protocolFees1 = poolState?.protocolFeesToken1?.toNumber()
        const fundFees1 = poolState?.fundFeesToken1?.toNumber()
        const swapTokenAmount1 = amount1 - (protocolFees1 + fundFees1)
        lpTokenAmount = givenTokenAmount?.multipliedBy(new BigNumber(lpTokenSupply))
            .dividedBy(new BigNumber(swapTokenAmount0))
        otherTokenAmount = lpTokenAmount?.multipliedBy(new BigNumber(swapTokenAmount1).
            dividedBy(new BigNumber(lpTokenSupply)))

        console.log('amounts:', lpTokenSupply, givenTokenAmount?.toNumber(), swapTokenAmount0, swapTokenAmount1)
        console.log('amounts: is', lpTokenAmount?.toNumber(), otherTokenAmount?.toNumber())
    }   //20.3435837316 -> 
    // } else {
    //     // Calculate LP token amount based on token1
    //     lpTokenAmount = givenTokenAmount.mul(lpTokenSupply).div(swapTokenAmount1)
    //     // Calculate token0 amount
    //     otherTokenAmount = lpTokenAmount.mul(swapTokenAmount0).div(lpTokenSupply)
    // }
}


export const withdraw = async (
    userSourceWithdrawAmount: BigNumber,
    userTargetWithdrawAmount: BigNumber,
    //eslint-disable-next-line
    selectedCard: any,
    userPublicKey: PublicKey,
    program: Program<Idl>
): Promise<Transaction> => {
    const withdrawAccounts = await getAccountsForDepositWithdraw(
        selectedCard,
        userPublicKey,
        false
    )
    const withdrawInstructionAccount = { ...withdrawAccounts }
    const withdrawIX: TransactionInstruction = await program.instruction.withdraw(
        new BN(Math.sqrt(450)),
        new BN(3),
        new BN(150), {
        accounts: withdrawInstructionAccount
    })
    const withdrawAmountTX = new Transaction()
    withdrawAmountTX.add(withdrawIX)
    return withdrawAmountTX
}