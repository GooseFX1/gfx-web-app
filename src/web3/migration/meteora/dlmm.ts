import { IDL as DLMM_IDL, LbClmm} from "./dlmm_idl";
import { Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { MAX_BIN_ARRAY_SIZE, MAX_BIN_PER_POSITION, METEORA_DLMM_PROGRAM_ID } from "../constants";
import { getAssociatedTokenAddress, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "solanaspltoken049";
import { AnchorProvider, BN, IdlTypes} from "anchor301";
import { Idl, Program } from "anchor0290";
import DLMM, { deriveBinArray, derivePosition, getPriceOfBinByBinId, getTokenDecimals } from "@meteora-ag/dlmm";
import Decimal from "decimal.js";
import { getAuthorityKey, getpoolId, getPoolVaultKey } from "@/web3/Farm";
import { getLiquidityPoolKey } from "@/web3/Farm";
import { bs58 } from "anchor301/dist/cjs/utils/bytes";

export type BinLiquidityReduction = IdlTypes<LbClmm>["BinLiquidityReduction"];

const DEFAULT_ACTIVE_ID = new BN(5660);
const DEFAULT_BIN_STEP = new BN(10);
const DEFAULT_BASE_FACTOR = new BN(10000);
const DEFAULT_BASE_FACTOR_2 = new BN(4000);

/** private */
function sortTokenMints(tokenX: PublicKey, tokenY: PublicKey) {
    const [minKey, maxKey] =
      tokenX.toBuffer().compare(tokenY.toBuffer()) == 1
        ? [tokenY, tokenX]
        : [tokenX, tokenY];
    return [minKey, maxKey];
}

export function deriveEventAuthority(programId: PublicKey) {
    PublicKey.findProgramAddressSync(
        [Buffer.from("__event_authority")],
        programId
    );
}

export function deriveBinArrayBitmapExtension(
    lbPair: PublicKey,
    programId: PublicKey
) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("bitmap"), lbPair.toBytes()],
      programId
    );
}
  
export function binIdToBinArrayIndex(binId: BN): BN {
    const { div: idx, mod } = binId.divmod(MAX_BIN_ARRAY_SIZE);
    return binId.isNeg() && !mod.isZero() ? idx.sub(new BN(1)) : idx;
}
  
export function deriveLbPair2(
    tokenX: PublicKey,
    tokenY: PublicKey,
    binStep: BN,
    baseFactor: BN,
    programId: PublicKey
) {
    const [minKey, maxKey] = sortTokenMints(tokenX, tokenY);
    return PublicKey.findProgramAddressSync(
      [
        minKey.toBuffer(),
        maxKey.toBuffer(),
        new Uint8Array(binStep.toArrayLike(Buffer, "le", 2)),
        new Uint8Array(baseFactor.toArrayLike(Buffer, "le", 2)),
      ],
      programId
    );
}

export function deriveReserve(
    token: PublicKey,
    lbPair: PublicKey,
    programId: PublicKey
) {
    return PublicKey.findProgramAddressSync(
      [lbPair.toBuffer(), token.toBuffer()],
      programId
    );
}
  
export function getPositionCount(minBinId: BN, maxBinId: BN) {
    const binDelta = maxBinId.sub(minBinId);
    const positionCount = binDelta.div(MAX_BIN_PER_POSITION);
    return positionCount.add(new BN(1));
}
  
export const getAccountsForMeteoraDlmm = async (
    connection: Connection,
    inputMint: PublicKey, 
    outputMint: PublicKey,
    user: PublicKey,
) => {
    let meteoraDlmmProgramId = new PublicKey(METEORA_DLMM_PROGRAM_ID);
    let [lbPair] = deriveLbPair2(
        inputMint, 
        outputMint, 
        DEFAULT_BIN_STEP,
        DEFAULT_BASE_FACTOR,
        meteoraDlmmProgramId,
    );
    const provider = new AnchorProvider(
        connection,
        {} as any,
        AnchorProvider.defaultOptions()
      );
    const program = new Program(
        DLMM_IDL,
        meteoraDlmmProgramId,
        provider
    );
    const [positions, positionsV2] = await Promise.all([
        program.account.position.all([
          {
            memcmp: {
              bytes: bs58.encode(user.toBuffer()),
              offset: 8 + 32,
            },
          },
        ]),
        program.account.positionV2.all([
          {
            memcmp: {
              bytes: bs58.encode(user.toBuffer()),
              offset: 8 + 32,
            },
          },
        ]),
      ]);
  
    const { reserveX, reserveY, tokenXMint, tokenYMint, oracle, baseKey, binStep, activeId } = await program.account.lbPair.fetch(lbPair);
    let tokenXDecimals = await getTokenDecimals(connection, inputMint);
    let tokenYDecimals = await getTokenDecimals(connection, outputMint);
    const priceMultiplier = new Decimal(
        10 ** (tokenYDecimals - tokenXDecimals)
    );
    const minPrice = new Decimal(
        getPriceOfBinByBinId(activeId, binStep)
    )
    .add(1)
    .mul(priceMultiplier);  
    const maxPrice = getPriceOfBinByBinId(
        activeId + 1 + MAX_BIN_PER_POSITION.toNumber() * 3,
        binStep
      ).mul(priceMultiplier);
    const minPricePerLamport = new Decimal(minPrice).mul(priceMultiplier);
    const maxPricePerLamport = new Decimal(maxPrice).mul(priceMultiplier);
      
    const minBinId = new BN(
        DLMM.getBinIdFromPrice(minPricePerLamport, binStep, false)
    );
  
    const maxBinId = new BN(
        DLMM.getBinIdFromPrice(maxPricePerLamport, binStep, true)
    );
   
    // This amount will be deposited to the last bin without compression
    const positionCount = getPositionCount(minBinId, maxBinId.sub(new BN(1)));

    const binArrayLower = deriveBinArray(lbPair, binIdToBinArrayIndex(minBinId), meteoraDlmmProgramId);
    const binArrayUpper = deriveBinArray(lbPair, binIdToBinArrayIndex(maxBinId), meteoraDlmmProgramId);

    const position = derivePosition(lbPair, baseKey, DEFAULT_ACTIVE_ID, MAX_BIN_PER_POSITION, meteoraDlmmProgramId);
    const binArrayBitmapExtension = deriveBinArrayBitmapExtension(lbPair, meteoraDlmmProgramId);
    // let reserveX = deriveReserve(inputMint, lbPair, meteoraDlmmProgramId);
    // let reserveY = deriveReserve(outputMint, lbPair, meteoraDlmmProgramId);
    const eventAuthority = deriveEventAuthority(meteoraDlmmProgramId);


    const poolIdKey = await getpoolId(inputMint, outputMint)
    const poolVaultKeyA = await getPoolVaultKey(poolIdKey, inputMint?.toBase58())
    const poolVaultKeyB = await getPoolVaultKey(poolIdKey, outputMint?.toBase58())
    const authorityKey = await getAuthorityKey()
    const liquidityAccountKey = await getLiquidityPoolKey(poolIdKey, user)
    const tokenAccountAKey = await getAssociatedTokenAddress(inputMint, user)
    const tokenAccountBKey = await getAssociatedTokenAddress(outputMint, user)

    return {
        dlmmPosition: position,
        dlmmLbPair: lbPair,
        dlmmBinArrayBitmapExtension: binArrayBitmapExtension,
        dlmmReserveX: reserveX,
        dlmmReserveY: reserveY,
        dlmmBinArrayLower: binArrayLower,
        dlmmBinArrayUpper: binArrayUpper,
        dlmmProgram: meteoraDlmmProgramId,
        dlmmEventAuthority: eventAuthority,
        tokenXProgram: TOKEN_PROGRAM_ID,
        tokenYProgram: TOKEN_PROGRAM_ID,
        gammaOwner: user,
        gammaAuthority: authorityKey,
        gammaPoolState: poolIdKey,
        gammaUserPoolLiquidity: liquidityAccountKey,
        gammaToken0Account: tokenAccountAKey,
        gammaToken1Account: tokenAccountBKey,
        gammaToken0Vault: poolVaultKeyA,
        gammaToken1Vault: poolVaultKeyB,
        tokenProgram: TOKEN_PROGRAM_ID,
        tokenProgram22: TOKEN_2022_PROGRAM_ID,
        gammaVault0Mint: inputMint,
        gammaVault1Mint: outputMint,
    }
}

export const migrateMeteoraDlmmToGammaIx = async (
    connection: Connection,
    inputMint: PublicKey,
    outputMint: PublicKey,
    user: PublicKey,
    program: Program<Idl>
): Promise<TransactionInstruction> => {
    let accounts = getAccountsForMeteoraDlmm(
        connection,
        inputMint,
        outputMint,
        user,
    )
    let binLiquidityReduction = BinLiq
    let ix : TransactionInstruction = await program.methods.migrateMeteoraDlmmToGamma({
        binLiquidityReduction,
        maximumToken0Amount,
        maximumToken1Amount,
        accounts,
    })
    return ix
}