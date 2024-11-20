import { IDL as DLMM_IDL } from "./dlmm_idl";
import { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
import { MAX_BIN_ARRAY_SIZE, MAX_BIN_PER_POSITION, METEORA_DLMM_PROGRAM_ID } from "../constants";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "solanaspltoken049";
import { AnchorProvider, BN} from "anchor301";
import { Program } from "anchor0290";
import DLMM, { deriveBinArray, derivePosition, getPriceOfBinByBinId, getTokenDecimals } from "@meteora-ag/dlmm";
import Decimal from "decimal.js";
import { getTokenDecimal } from "@/web3/ssl";

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

    const binArrayLower = deriveBinArray(lbPair, , meteoraDlmmProgramId);

    let position = derivePosition(lbPair, baseKey, DEFAULT_ACTIVE_ID, MAX_BIN_PER_POSITION, meteoraDlmmProgramId);
    let binArrayBitmapExtension = deriveBinArrayBitmapExtension(lbPair, meteoraDlmmProgramId);
    let reserveX = deriveReserve(inputMint, lbPair, meteoraDlmmProgramId);
    let reserveY = deriveReserve(outputMint, lbPair, meteoraDlmmProgramId);
    let userTokenX = getAssociatedTokenAddress(inputMint, user);
    let userTokenY = getAssociatedTokenAddress(outputMint, user);
    let eventAuthority = deriveEventAuthority(meteoraDlmmProgramId);

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
        tokenXMint: inputMint,
        tokenYMint: outputMint,
        sender: user,
        userTokenX: userTokenX,
        userTokenY: userTokenY
    }
}