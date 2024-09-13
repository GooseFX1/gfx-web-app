import { Connection, PublicKey } from "@solana/web3.js"
import DLMM from "@meteora-ag/dlmm"
import { MigratePosition, Source } from "./common";
import { BN } from "bn.js";
import Decimal from "decimal.js";

// "DLMM"
// https://github.com/MeteoraAg/dlmm-sdk
// programId = LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo
export const getMeteoraDynamicCLMMPositions = async (
  connection: Connection, 
  user: PublicKey
): Promise<Array<MigratePosition>> => {
  DLMM.migratePosition
  return DLMM.getAllLbPairPositionsByUser(connection, user).then(
    info => Array.from(info.values()).map(info => {
    return info.lbPairPositionsData.map(position => {
      const amountTokenA = new BN(new Decimal(position.positionData.totalXAmount).floor().toString());
      const amountTokenB = new BN(new Decimal(position.positionData.totalYAmount).floor().toString());
      return {
        source: 'MeteoraCLMM' as Source,
        tokenA: info.tokenX.publicKey,
        tokenB: info.tokenY.publicKey,
        amountTokenA,
        amountTokenB,
      }
    })
  }).flat())
}