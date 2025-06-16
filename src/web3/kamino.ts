import { Program, Provider, utils } from '@project-serum/anchor'
import KaminoIDL from './idl/kamino_lending.json'
import { Connection, PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
// import { getNodeWallet } from '../perps/perpsUtils'

import { Idl } from '@project-serum/anchor'
import { AnchorWallet } from '@/hooks/useWallet'
import { GAMMA_PROGRAM_ID } from './ids'

export const LENDING_MARKET_AUTH_SEED = 'lma'

export function getLendingMarketAuthority(lendingMarket: PublicKey, programId: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(LENDING_MARKET_AUTH_SEED), lendingMarket.toBuffer()],
    programId
  )
}

export function getGammaPoolDestinationCollateral(poolAddress: PublicKey, tokenMint: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [utils.bytes.utf8.encode('pool_kamino_deposits'), poolAddress.toBuffer(), tokenMint.toBuffer()],
    new PublicKey(GAMMA_PROGRAM_ID)
  )[0]
}

export const KAMINO_PROGRAM_ID = new PublicKey('KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD')
export const KAMINO_MARKET_ID = new PublicKey('7u3HeHxYDLhnCoErrtycNokbQYbWGzLs6JSDqGAv5PfF')

export interface KaminoReserve {
  address: PublicKey
  state: KaminoReserveAccount
}
interface KaminoReserveAccount {
  version: BN
  lendingMarket: PublicKey
  farmCollateral: PublicKey
  farmDebt: PublicKey
  liquidity: ReserveLiquidity
  collateral: ReserveCollateral
  /** incomplete field definitions */
}

interface ReserveLiquidity {
  mintPubkey: PublicKey
  supplyVault: PublicKey
  feeVault: PublicKey
  /** incomplete field definitions */
}

interface ReserveCollateral {
  mintPubkey: PublicKey
  supplyVault: PublicKey
  /** incomplete field definitions */
}

export async function getReservesForMarket(
  connection: Connection,
  wallet: AnchorWallet
): Promise<Map<string, KaminoReserve>> {
  const provider = new Provider(connection, wallet, { commitment: 'finalized' })

  const kamino = new Program(KaminoIDL as unknown as Idl, KAMINO_PROGRAM_ID, provider)
  const reserves = await kamino.account.reserve.all([
    {
      memcmp: {
        offset: 32,
        bytes: KAMINO_MARKET_ID.toBase58()
      }
    }
  ])
  const reservesByAddress = new Map<string, KaminoReserve>()

  reserves.forEach((reserve) => {
    reservesByAddress.set(reserve.publicKey.toBase58(), {
      address: reserve.publicKey,
      state: {
        version: reserve.account.version as unknown as BN,
        lendingMarket: reserve.account.lendingMarket as unknown as PublicKey,
        farmCollateral: reserve.account.farmCollateral as unknown as PublicKey,
        farmDebt: reserve.account.farmDebt as unknown as PublicKey,
        liquidity: reserve.account.liquidity as unknown as ReserveLiquidity,
        collateral: reserve.account.collateral as unknown as ReserveCollateral
      }
    })
  })
  return reservesByAddress
}

export function getReservesForMarketLiquidityToken(
  reservesByAddress: Map<string, KaminoReserve>,
  liquidityToken: PublicKey
): { pubkey: PublicKey; reserve: KaminoReserve } | null {
  for (const [pubkey, reserve] of reservesByAddress.entries()) {
    if (reserve.state.liquidity.mintPubkey.equals(liquidityToken)) {
      return {
        pubkey: new PublicKey(pubkey),
        reserve
      }
    }
  }

  return null
}
