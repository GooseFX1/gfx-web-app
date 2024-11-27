import { 
    CLMM_PROGRAM_ID, 
    MEMO_PROGRAM_ID,
    u16ToBytes,
    u32ToBytes
} from "@raydium-io/raydium-sdk-v2"
import { PublicKey } from "@solana/web3.js"
import { 
    RAYDIUM_CLMM_AMM_CONFIG_SEED, 
    RAYDIUM_CLMM_OBSERVATION_SEED, 
    RAYDIUM_CLMM_POOL_SEED, 
    RAYDIUM_CLMM_POOL_VAULT_SEED, 
    RAYDIUM_CLMM_PROGRAM_ID, 
    RAYDIUM_CLMM_TICK_ARRAY_SEED, 
} from "../constants"
import { getAssociatedTokenAddressSync, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "solanaspltoken049";
import { toPublicKey } from "@/web3/ids";
  
  
const getClmmPoolVaultKey = async (poolIdKey: PublicKey, mintAddress: string): Promise<undefined | PublicKey> => {
    try {
      const getPoolVaultKey: [PublicKey, number] = PublicKey.findProgramAddressSync(
        [Buffer.from(RAYDIUM_CLMM_POOL_VAULT_SEED), poolIdKey?.toBuffer(), new PublicKey(mintAddress).toBuffer()],
        toPublicKey(RAYDIUM_CLMM_PROGRAM_ID)
      )
      return getPoolVaultKey[0]
    } catch (err) {
      return undefined
    }
}
  
const getClmmAmmConfigId = async (index: number): Promise<undefined | PublicKey> => {
    try {
        const ammConfigId: [PublicKey, number] = PublicKey.findProgramAddressSync(
            [Buffer.from(RAYDIUM_CLMM_AMM_CONFIG_SEED), u16ToBytes(index)],
            new PublicKey(RAYDIUM_CLMM_PROGRAM_ID)
        )
        return ammConfigId[0]
    } catch (err) {
        return undefined
    }
}
  
const getClmmPoolIdKey = async (ammConfigId: PublicKey, mintA: PublicKey, mintB: PublicKey)
    : Promise<undefined | PublicKey> => {
    try {
        const getPoolIdKey: [PublicKey, number] = await PublicKey.findProgramAddressSync(
            [Buffer.from(RAYDIUM_CLMM_POOL_SEED), ammConfigId?.toBuffer(), mintA?.toBuffer(), mintB?.toBuffer()],
            new PublicKey(RAYDIUM_CLMM_PROGRAM_ID)
        )
        return getPoolIdKey[0]
    } catch (err) {
        return undefined
    }
}
  
const getClmmObservationStateKey = async (poolId: PublicKey)
    : Promise<undefined | PublicKey> => {
    try {
        const observationStateKey: [PublicKey, number] = await PublicKey.findProgramAddressSync(
            [Buffer.from(RAYDIUM_CLMM_OBSERVATION_SEED), poolId?.toBuffer()],
            new PublicKey(RAYDIUM_CLMM_PROGRAM_ID)
        )
        return observationStateKey[0]
    } catch (err) {
        return undefined
    }
}
  
const getClmmTickArrayKey = async (poolId: PublicKey, tickArrayStartIndex: number): Promise<undefined | PublicKey> => {
    try {
      const tickArrayKey: [PublicKey, number] = await PublicKey.findProgramAddressSync(
        [Buffer.from(RAYDIUM_CLMM_TICK_ARRAY_SEED), poolId?.toBuffer(), u32ToBytes(tickArrayStartIndex)],
        new PublicKey(RAYDIUM_CLMM_PROGRAM_ID)
      )
      return tickArrayKey[0]
    } catch (err) {
      return undefined
    }
}


export const getAccountsForRaydiumClmmWithdraw = async (
    inputMint: PublicKey, 
    outputMint: PublicKey, 
    userPubKey: PublicKey
) => {
    const ammConfig = await getClmmAmmConfigId(0) // TODO:MIGRATION check the index of amm config for raydium CLMM pools
    const poolState = await getClmmPoolIdKey(ammConfig, inputMint, outputMint)
    const inputVault = await getClmmPoolVaultKey(poolState, inputMint?.toBase58())
    const outputVault = await getClmmPoolVaultKey(poolState, outputMint?.toBase58())
    
    return {
      raydiumClmmProgram: toPublicKey(CLMM_PROGRAM_ID),
      raydiumClmmNftOwner: userPubKey,
      raydiumClmmNftAccount: null, // TODO:MIGRATION 
      raydiumClmmPersonalPosition: null, // TODO:MIGRATION 
      raydiumClmmPoolState: poolState,
      raydiumClmmProtocolPosition: null, // TODO:MIGRATION 
      raydiumClmmTokenVault0: inputVault,
      raydiumClmmTokenVault1: outputVault,
      raydiumClmmTickArrayLower: null, // TODO:MIGRATION 
      raydiumClmmTickArrayUpper: null, // TODO:MIGRATION 
    }
}

export const getAccountsForRaydiumClmmWithdrawV2 = async (
    inputMint: PublicKey, 
    outputMint: PublicKey, 
    userPubKey: PublicKey
) => {
    const ammConfig = await getClmmAmmConfigId(0) // TODO:MIGRATION check the index of amm config for raydium CLMM pools
    const poolState = await getClmmPoolIdKey(ammConfig, inputMint, outputMint)
    const inputVault = await getClmmPoolVaultKey(poolState, inputMint?.toBase58())
    const outputVault = await getClmmPoolVaultKey(poolState, outputMint?.toBase58())
    
    return {
      raydiumClmmProgram: toPublicKey(CLMM_PROGRAM_ID),
      raydiumClmmNftOwner: userPubKey,
      raydiumClmmNftAccount: null, // TODO:MIGRATION 
      raydiumClmmPersonalPosition: null, // TODO:MIGRATION 
      raydiumClmmPoolState: poolState,
      raydiumClmmProtocolPosition: null, // TODO:MIGRATION 
      raydiumClmmTokenVault0: inputVault,
      raydiumClmmTokenVault1: outputVault,
      raydiumClmmTickArrayLower: null, // TODO:MIGRATION 
      raydiumClmmTickArrayUpper: null, // TODO:MIGRATION 
      memoProgram: MEMO_PROGRAM_ID
    }
}