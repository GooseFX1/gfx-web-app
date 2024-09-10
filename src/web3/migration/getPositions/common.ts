import { PublicKey } from "@solana/web3.js"
import * as anchor from "@project-serum/anchor"

export type Source = 'RaydiumCLMM' | `MeteoraCLMM` | 'OrcaCLMM'

export type MigratePosition = {
  source: Source,
  tokenA: PublicKey,
  tokenB: PublicKey,
  amountTokenA: anchor.BN,
  amountTokenB: anchor.BN,
}

export const prettifyPositions = (positions: MigratePosition[]): {
  [K in keyof MigratePosition]: string;
}[] => {
  return positions.map(pos => {
    return {
      source: pos.source,
      tokenA: pos.tokenA.toString(),
      tokenB: pos.tokenB.toString(),
      amountTokenA: pos.amountTokenA.toString(),
      amountTokenB: pos.amountTokenB.toString(),
    }
  })
}