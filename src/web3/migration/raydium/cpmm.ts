import { PublicKey, TransactionInstruction } from "@solana/web3.js"
import { 
    RAYDIUM_CPMM_AMM_CONFIG_SEED, 
    RAYDIUM_CPMM_AUTHORITY_SEED, 
    RAYDIUM_CPMM_OBSERVATION_SEED, 
    RAYDIUM_CPMM_POOL_SEED, 
    RAYDIUM_CPMM_POOL_VAULT_SEED, 
    RAYDIUM_CPMM_PROGRAM_ID, 
} from "../constants"
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "solanaspltoken049";
import { toPublicKey } from "@/web3/ids";
import { MEMO_PROGRAM_ID } from "@raydium-io/raydium-sdk-v2";


const u16ToBytes = (num: number): Uint8Array => {
    const arr = new ArrayBuffer(2);
    const view = new DataView(arr);
    view.setUint16(0, num, false);
    return new Uint8Array(arr);
}

const getCpmmPoolVaultKey = async (poolIdKey: PublicKey, mintAddress: string): Promise<undefined | PublicKey> => {
    try {
        const getPoolVaultKey: [PublicKey, number] = PublicKey.findProgramAddressSync(
            [Buffer.from(RAYDIUM_CPMM_POOL_VAULT_SEED), poolIdKey?.toBuffer(), new PublicKey(mintAddress).toBuffer()],
            toPublicKey(RAYDIUM_CPMM_PROGRAM_ID)
        )
        return getPoolVaultKey[0]
    } catch (err) {
        return undefined
    }
}

const getCpmmAuthorityKey = async (): Promise<undefined | PublicKey> => {
    try {
        const getAuthorityKey: [PublicKey, number] = PublicKey.findProgramAddressSync(
            [Buffer.from(RAYDIUM_CPMM_AUTHORITY_SEED)], 
            toPublicKey(RAYDIUM_CPMM_PROGRAM_ID)
        )
        return getAuthorityKey[0]
    } catch (err) {
        return undefined
    }
}


const getCpmmAmmConfigId = async (index: number): Promise<undefined | PublicKey> => {
    try {
        const ammConfigId: [PublicKey, number] = PublicKey.findProgramAddressSync(
            [Buffer.from(RAYDIUM_CPMM_AMM_CONFIG_SEED), u16ToBytes(index)],
            new PublicKey(RAYDIUM_CPMM_PROGRAM_ID)
        )
        return ammConfigId[0]
    } catch (err) {
        return undefined
    }
}

const getCpmmPoolIdKey = async (ammConfigId: PublicKey, mintA: PublicKey, mintB: PublicKey)
    : Promise<undefined | PublicKey> => {
    try {
        const getPoolIdKey: [PublicKey, number] = await PublicKey.findProgramAddressSync(
            [Buffer.from(RAYDIUM_CPMM_POOL_SEED), ammConfigId?.toBuffer(), mintA?.toBuffer(), mintB?.toBuffer()],
            new PublicKey(RAYDIUM_CPMM_PROGRAM_ID)
        )
        return getPoolIdKey[0]
    } catch (err) {
        return undefined
    }
}

const getCpmmObservationStateKey = async (poolId: PublicKey)
    : Promise<undefined | PublicKey> => {
    try {
        const observationStateKey: [PublicKey, number] = await PublicKey.findProgramAddressSync(
            [Buffer.from(RAYDIUM_CPMM_OBSERVATION_SEED), poolId?.toBuffer()],
            new PublicKey(RAYDIUM_CPMM_PROGRAM_ID)
        )
        return observationStateKey[0]
    } catch (err) {
        return undefined
    }
}

export const getAccountsForRaydiumCPMMWithdraw = async (inputMint: PublicKey, outputMint: PublicKey, userPubKey: PublicKey) => {

    const configIdKey = await getCpmmAmmConfigId(0)
    const authorityKey = await getCpmmAuthorityKey()
    const userInputAta = await getAssociatedTokenAddress(inputMint, userPubKey)
    const userOutputAta = await getAssociatedTokenAddress(outputMint, userPubKey)
    const poolIdKey = await getCpmmPoolIdKey(configIdKey, inputMint, outputMint)
    const poolVaultInputMint = await getCpmmPoolVaultKey(poolIdKey, inputMint?.toBase58())
    const poolVaultOutputMint = await getCpmmPoolVaultKey(poolIdKey, outputMint?.toBase58())

    const accountObj = {
        raydiumCpSwapProgram: toPublicKey(RAYDIUM_CPMM_PROGRAM_ID),
        owner: userPubKey,
        raydiumCpSwapAuthority: authorityKey,
        raydiumCpSwapPoolState: poolIdKey,
        raydiumCpSwapOwnerLpToken: null, // TODO:MIGRATION 
        raydiumCpSwapToken0Vault: poolVaultInputMint,
        raydiumCpSwapToken1Vault: poolVaultOutputMint,
        inputTokenAccount: userInputAta,
        outputTokenAccount: userOutputAta,
        inputTokenProgram: TOKEN_PROGRAM_ID,
        outputTokenProgram: TOKEN_PROGRAM_ID,
        raydiumCpSwapVault0Mint: inputMint,
        raydiumCpSwapVault1Mint: outputMint,
        raydiumCpSwapLpMint: null, //TODO:MIGRATION
        memoProgram: MEMO_PROGRAM_ID,
    }

    return accountObj
}
