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

export const getAccountsForOrcaWhirlpool = async (
  rpcURL: string,
  inputMint: PublicKey,
  outputMint: PublicKey,
  user: PublicKey
) : Promise<Accounts> => {
  const mainnetRpc = createSolanaRpc(mainnet(rpcURL));
  const whirlpoolPools = await fetchWhirlpoolsByTokenPair(mainnetRpc, inputMint, outputMint);
  // const whirlpool = await fetchWhirlpool(mainnetRpc, whirlpoolPools[0].address);
  const tokenOwnerAccountA = getAssociatedTokenAddressSync(inputMint, user);
  const tokenOwnerAccountB = getAssociatedTokenAddressSync(outputMint, user);
  const tokenVaultA = getAssociatedTokenAddressSync(inputMint, whirlpoolPools[0].address, true);
  const tokenVaultB = getAssociatedTokenAddressSync(outputMint, whirlpoolPools[0].address, true);
  let whirlpoolProgramId = new PublicKey(ORCA_WHIRLPOOL_PROGRAM_ID);
  // let whirlpoolPdaAddress = getWhirlpool(whirlpoolProgramId,);
  let startTick = 0;
  let tickArray0 = getTickArray(whirlpoolProgramId, whirlpoolPools[0].address, startTick)[0];
  let oracle = getOracle(whirlpoolProgramId, whirlpoolPools[0].address)[0];

  const accounts: Accounts = {
    whirlpoolProgram: whirlpoolProgramId,
    whirlpool: whirlpoolPools[0].address,
    tokenProgramA: TOKEN_PROGRAM_ID,
    tokenProgramB: TOKEN_PROGRAM_ID,
    memoProgram: MEMO_PROGRAM_ADDRESS,
    whirlpoolPosition: inputMint,
    whirlpoolPositionTokenAccount: outputMint,
    whirlpoolTokenVaultA: tokenVaultA,
    whirlpoolTokenVaultB: tokenVaultB,
    whirlpoolTickArrayLower: tickArray0,
    whirlpoolTickArrayUpper: tickArray0,
  }
  //  tokenOwnerAccountA: tokenOwnerAccountA,
  // tokenOwnerAccountB: tokenOwnerAccountB,
  // tickArray2: tickArray0,
  // tokenAuthority: user,
  // oracle: oracle,

  return accounts
}