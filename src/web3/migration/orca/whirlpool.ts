import { PublicKey, TransactionInstruction } from "@solana/web3.js"
import { Accounts, BN } from "anchor301"
import { 
  ORCA_WHIRLPOOL_PROGRAM_ID, 
  WHIRLPOOL_ORACLE_SEED, 
  WHIRLPOOL_SEED, 
  WHIRLPOOL_TICK_ARRAY_SEED 
} from "../constants"
import { getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from "solanaspltoken049"
import { MEMO_PROGRAM_ADDRESS } from "@orca-so/whirlpools-sdk"
import { fetchWhirlpoolsByTokenPair } from "@orca-so/whirlpools"
// import { fetchWhirlpool} from "@orca-so/whirlpools-client"
import { createSolanaRpc, mainnet } from 'solanaweb3js200rc1';

export function getWhirlpool(
  programId: PublicKey,
  whirlpoolsConfigKey: PublicKey,
  tokenMintAKey: PublicKey,
  tokenMintBKey: PublicKey,
  tickSpacing: number,
) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(WHIRLPOOL_SEED),
      whirlpoolsConfigKey.toBuffer(),
      tokenMintAKey.toBuffer(),
      tokenMintBKey.toBuffer(),
      new BN(tickSpacing).toArrayLike(Buffer, "le", 2),
    ],
    programId,
  );
}


export function getTickArray(
  programId: PublicKey,
  whirlpoolAddress: PublicKey,
  startTick: number,
) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(WHIRLPOOL_TICK_ARRAY_SEED),
      whirlpoolAddress.toBuffer(),
      Buffer.from(startTick.toString()),
    ],
    programId,
  );
}

export function getOracle(programId: PublicKey, whirlpoolAddress: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(WHIRLPOOL_ORACLE_SEED), whirlpoolAddress.toBuffer()],
    programId,
  );
}


export const getAccountsForOrcaWhirlpoolV2 = async (
  rpcURL: string,
  startTick: number,
  inputMint: PublicKey,
  outputMint: PublicKey,
  tokenProgramInputMint: PublicKey = TOKEN_PROGRAM_ID,
  tokenProgramOutputMint: PublicKey = TOKEN_PROGRAM_ID,
) : Promise<Accounts> => {
  const mainnetRpc = createSolanaRpc(mainnet(rpcURL));
  const whirlpoolPools = await fetchWhirlpoolsByTokenPair(mainnetRpc, inputMint, outputMint);
  const tokenVaultA = getAssociatedTokenAddressSync(inputMint, whirlpoolPools[0].address, true); //TODO:MIGRATION check if 0th index is the actual pool
  const tokenVaultB = getAssociatedTokenAddressSync(outputMint, whirlpoolPools[0].address, true);
  let whirlpoolProgramId = new PublicKey(ORCA_WHIRLPOOL_PROGRAM_ID);
  let tickArray0 = getTickArray(whirlpoolProgramId, whirlpoolPools[0].address, startTick)[0];

  const accounts: Accounts = {
    whirlpoolProgram: whirlpoolProgramId,
    whirlpool: whirlpoolPools[0].address,
    tokenProgramA: tokenProgramInputMint,
    tokenProgramB: tokenProgramOutputMint,
    memoProgram: MEMO_PROGRAM_ADDRESS,
    whirlpoolPosition: inputMint,
    whirlpoolPositionTokenAccount: outputMint,
    whirlpoolTokenVaultA: tokenVaultA,
    whirlpoolTokenVaultB: tokenVaultB,
    whirlpoolTickArrayLower: tickArray0,
    whirlpoolTickArrayUpper: tickArray0,
  }

  return accounts
}

export const getAccountsForOrcaWhirlpool = async (
  rpcURL: string,
  startTick: number,
  inputMint: PublicKey,
  outputMint: PublicKey,
) : Promise<Accounts> => {
  const mainnetRpc = createSolanaRpc(mainnet(rpcURL));
  const whirlpoolPools = await fetchWhirlpoolsByTokenPair(mainnetRpc, inputMint, outputMint);
  const tokenVaultA = getAssociatedTokenAddressSync(inputMint, whirlpoolPools[0].address, true); //TODO:MIGRATION check if 0th index is the actual pool
  const tokenVaultB = getAssociatedTokenAddressSync(outputMint, whirlpoolPools[0].address, true);
  let whirlpoolProgramId = new PublicKey(ORCA_WHIRLPOOL_PROGRAM_ID);
  let tickArray0 = getTickArray(whirlpoolProgramId, whirlpoolPools[0].address, startTick)[0];

  const accounts: Accounts = {
    whirlpoolProgram: whirlpoolProgramId,
    whirlpool: whirlpoolPools[0].address,
    whirlpoolPosition: inputMint,
    whirlpoolPositionTokenAccount: outputMint,
    whirlpoolTokenVaultA: tokenVaultA,
    whirlpoolTokenVaultB: tokenVaultB,
    whirlpoolTickArrayLower: tickArray0,
    whirlpoolTickArrayUpper: tickArray0,
  }

  return accounts
}