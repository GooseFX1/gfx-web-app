import React, { createContext, FC, ReactNode, useCallback, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { INTERVALS } from '@/utils/time'
import { GAMMAPoolWithUserLiquidity } from '@/types/gamma'
import { QUERY_KEY } from '@/queries/query.helper'
import { fetchTokensByPublicKey } from '@/api/gamma'
import { TokenListToken } from './gamma'
import { KAMINO_API_ENDPOINTS, KAMINO_API_MARKET_ID } from '@/api/gamma/constants'

interface KaminoReserve {
    reserve: string
    liquidityToken: string
    liquidityTokenMint: string
    maxLtv: string
    borrowApy: string
    supplyApy: string
    totalSupply: string
    totalBorrow: string
    totalBorrowUsd: string
    totalSupplyUsd: string
}

interface IKaminoConfig {
    kaminoReserves: KaminoReserve[] | undefined
    getKaminoReservePerToken: (tokenMint: string) => KaminoReserve | undefined
    apyForPool: (pool: GAMMAPoolWithUserLiquidity) => {apy: number, token: TokenListToken}[]
}

const KaminoContext = createContext<IKaminoConfig | null>(null)

export const KaminoProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const { data: kaminoReserves } = useQuery({
        queryKey: ['kamino-reserves', KAMINO_API_MARKET_ID],
        queryFn: async () => {
            const response = await fetch(
                KAMINO_API_ENDPOINTS.RESERVES_METRICS(KAMINO_API_MARKET_ID) 
            )
            const data = await response.json()
            return data as KaminoReserve[]
        },
        staleTime: INTERVALS.MINUTE * 5
    })

    const getKaminoReservePerToken = (tokenMint: string) => 
        kaminoReserves?.find(reserve => reserve.liquidityTokenMint === tokenMint)

    const tokensInKaminoQuery = useQuery({
        queryKey: [QUERY_KEY, 'kamino-tokens', kaminoReserves],
        queryFn: async () => {
          const allTokenAddresses = [
            ...new Set(kaminoReserves?.map((reserve) => reserve.liquidityTokenMint))
          ]
          if (allTokenAddresses.length === 0) return []
          const res = await fetchTokensByPublicKey(allTokenAddresses.join(','))
    
          if (!res || !res.success || res.data.tokens?.length === 0) return []
          return res.data.tokens
        },
        staleTime: INTERVALS.MINUTE * 5
    })

    const apyForPool = useCallback((pool: GAMMAPoolWithUserLiquidity) => {
        const reserve1 = getKaminoReservePerToken(pool.mintA.address)
        const reserve2 = getKaminoReservePerToken(pool.mintB.address)
        if (!reserve1 && !reserve2) return []

        const apyList = []
        if(reserve1){
            const token = tokensInKaminoQuery.data?.find(token => token.address === reserve1.liquidityTokenMint)
            if(token)
                apyList.push({
                    apy: parseFloat(reserve1.supplyApy) * 100,
                    token
                })
        }
        if(reserve2){
            const token = tokensInKaminoQuery.data?.find(token => token.address === reserve2.liquidityTokenMint)
            if(token)
                apyList.push({
                    apy: parseFloat(reserve2.supplyApy) * 100,
                    token
                })
        }

        return apyList
    }, [kaminoReserves, tokensInKaminoQuery.data])

    return (
        <KaminoContext.Provider
            value={{
                kaminoReserves,
                getKaminoReservePerToken,
                apyForPool
            }}
        >
            {children}
        </KaminoContext.Provider>
    )
}

export const useKamino = (): IKaminoConfig => {
    const context = useContext(KaminoContext)

    if (!context) {
        throw new Error('Missing kamino context')
    }
    return context
}


