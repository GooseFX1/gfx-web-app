import React, { ReactNode, createContext, useState, useEffect, useContext, FC, useMemo } from 'react'
import { useConnectionConfig } from '@/context/settings'
import { TokenListToken } from '@/context'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { PublicKey, Connection } from '@solana/web3.js'
import { getRaydiumCLMMPositions } from '@/web3/migration/raydium'
import { getMeteoraDynamicCLMMPositions } from '@/web3/migration/meteora'
import { getOrcaCLMMPositionsForUser } from '@/web3/migration/orca'
import { fetchTokensByPublicKey } from '@/api/gamma/actions'
import { GAMMAListTokenResponse } from '@/types/gamma'

const WHIRLPOOL_PROGRAM_ID = new PublicKey(`whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc`)

export type Source = 'Raydium' | `Meteora` | 'Orca'

type PositionFromSDK = {
  source: Source
  tokenA: PublicKey
  tokenB: PublicKey
  amountTokenA: anchor.BN
  amountTokenB: anchor.BN
}

export type MigratePosition = {
  source: Source
  tokenA: TokenListToken
  tokenB: TokenListToken
  amountTokenA: anchor.BN
  amountTokenB: anchor.BN
}

interface LPMigratePositionsDataModel {
  lpPositions: MigratePosition[] | null
  positionsByPair: Record<string, MigratePosition[]>
  lpSources: Record<string, string>
}

export const LPMigratePositionsContext = createContext<LPMigratePositionsDataModel | null>(null)

export const CurrentLPPositionsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { connection } = useConnectionConfig()
  const { connected, publicKey } = useWalletBalance()
  const [lpPositions, setLPPositions] = useState<MigratePosition[] | null>(null)

  const positionsByPair: Record<string, MigratePosition[]> = useMemo(() => {
    if (lpPositions === null || lpPositions.length === 0) return {}
    return lpPositions.reduce((acc, pos) => {
      const { tokenA, tokenB } = pos
      const key = `${tokenA.address}-${tokenB.address}`
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(pos)
      return acc
    }, {})
  }, [lpPositions])

  const lpSources = useMemo(() => {
    if (lpPositions === null) return {};
    const platforms = {
      Raydium: '/img/crypto/raydium.svg',
      Orca: '/img/crypto/ORCA.svg',
      Meteora: '/img/crypto/meteora.svg'
    }
    return lpPositions.reduce((acc, pos) => {
      const key = pos.source;
      const value = platforms[key];
      if (value) {
        acc[key] = value;
      }
      return acc;
    }, {});
  }, [lpPositions])

  useEffect(() => {
    if (publicKey) {
      getAllPositions(connection, publicKey).then((pos) => setLPPositions(pos))
    } else {
      setLPPositions([])
    }
  }, [publicKey, connected, connection])

  const getAllPositions = async (con: Connection, pKey: PublicKey) => {
    const epochInfo = await con.getEpochInfo()

    try {
      const [raydiumPositions, meteoraPositions, orcaPositions] = await Promise.all([
        getRaydiumCLMMPositions(con, pKey, {}, false, epochInfo),
        getMeteoraDynamicCLMMPositions(con, pKey),
        getOrcaCLMMPositionsForUser(con, pKey, WHIRLPOOL_PROGRAM_ID)
      ])

      const allPositions = [...raydiumPositions, ...meteoraPositions, ...orcaPositions]
      if (allPositions.length == 0) return []

      const tokenMap = await fetchTokensForPublicKey(allPositions)

      const positionsEnrichedWithTokenData = allPositions.map((pos) => ({
        ...pos,
        tokenA: tokenMap.get(pos.tokenA.toString())!,
        tokenB: tokenMap.get(pos.tokenB.toString())!
      }))
      console.log(positionsEnrichedWithTokenData)

      return positionsEnrichedWithTokenData
    } catch (error) {
      console.error('Error fetching positions:', error)
      return []
    }
  }

  async function fetchTokensForPublicKey(
    positions: PositionFromSDK[]
  ): Promise<Map<string, TokenListToken | null>> {
    const allTokenAddresses = [
      ...positions.map((pos) => pos.tokenA.toString()),
      ...positions.map((pos) => pos.tokenB.toString())
    ]
    // Initialize a set to track unique token addresses
    const tokenMap: Map<string, TokenListToken | null> = new Map(
      Array.from(allTokenAddresses).map((address) => [address, null])
    )

    // Fetch tokens only for addresses that haven't been fetched yet
    try {
      const res: GAMMAListTokenResponse | null = await fetchTokensByPublicKey([...tokenMap.keys()].join(','))
      console.log('Tokens fetch:', res)
      if (res.success && res.data.tokens.length > 0) {
        res.data.tokens.map((t) => tokenMap.set(t.address, t))
      } else {
        console.warn('No tokens returned from fetchTokensByPublicKey.')
      }
      return tokenMap
    } catch (error) {
      console.log('Error fetching tokens:', error)
      // Handle the error appropriately, possibly rethrow or return partial results
      throw error
    }
  }

  return (
    <LPMigratePositionsContext.Provider
      value={{
        lpPositions,
        positionsByPair,
        lpSources
      }}
    >
      {children}
    </LPMigratePositionsContext.Provider>
  )
}

export const useLPMigratePositions = (): LPMigratePositionsDataModel => useContext(LPMigratePositionsContext)
