import { useEffect, useMemo } from 'react'
import { useAccounts, useConnectionConfig } from '@/context'
import {
  getPdaPersonalPositionAddress,
  PositionInfoLayout,
  TickUtils,
  ApiV3PoolInfoConcentratedItem,
  PositionUtils
} from '@raydium-io/raydium-sdk-v2'
import { PublicKey, Connection } from '@solana/web3.js'
import Decimal from 'decimal.js'
import useSWR from 'swr'

import { useEpochInfo } from './useEpochInfo'
import { useEvent } from './useEvent'
import { useWalletBalance } from '@/context/walletBalanceContext'

const RAYDIUM_CLMM_PROGRAM: PublicKey = new PublicKey(`CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK`);

export type ClmmPosition = ReturnType<typeof PositionInfoLayout.decode> & { key?: string }
export type ClmmDataMap = Map<string, ClmmPosition[]>

const fetcher = async ([connection, publicKeyList]: [Connection, PublicKey[]]) => {
  console.log('rpc: get clmm position balance info')

  const chunkSize = 100
  const keyGroup = []
  for (let i = 0; i < publicKeyList.length; i += chunkSize) {
    keyGroup.push(publicKeyList.slice(i, i + chunkSize))
  }

  const res = await Promise.all(
    keyGroup.map((list) =>
      connection.getMultipleAccountsInfoAndContext(list, 'confirmed')
    )
  )

  return res.flat()
}

export default function useRaydiumClmmBalance({
  raydiumClmmProgramId,
  refreshInterval = 1000 * 60 * 5
}: {
  raydiumClmmProgramId?: PublicKey
  refreshInterval?: number
}) {
  const { connection } = useConnectionConfig();
  const clmmProgramId = raydiumClmmProgramId ?? RAYDIUM_CLMM_PROGRAM
  const { publicKey: activeWallet } = useWalletBalance()
  const { balances, fetchAccounts, fetching, getAmount, getUIAmount, setBalances, setFetching } = useAccounts()
  const { epochInfo } = useEpochInfo();

  const balanceMints = useMemo(() => {
    return Object.entries(balances)
      .filter(([_, accountInfo]) => accountInfo.amount === '1')
      .map(([mint, _]) => new PublicKey(mint));
  }, [balances]);
  const getPriceAndAmount = useEvent(({ poolInfo, position }: { poolInfo: ApiV3PoolInfoConcentratedItem; position: ClmmPosition }) => {
    const priceLower = TickUtils.getTickPrice({
      poolInfo,
      tick: position.tickLower,
      baseIn: true
    })
    const priceUpper = TickUtils.getTickPrice({
      poolInfo,
      tick: position.tickUpper,
      baseIn: true
    })

    const { amountA, amountB, amountSlippageA, amountSlippageB } = PositionUtils.getAmountsFromLiquidity({
      poolInfo,
      ownerPosition: position,
      liquidity: position.liquidity,
      slippage: 0,
      add: false,
      epochInfo: epochInfo || {
        epoch: 0,
        slotIndex: 0,
        slotsInEpoch: 0,
        absoluteSlot: 0
      }
    })
    const [_amountA, _amountB] = [
      new Decimal(amountA.amount.toString()).div(10 ** poolInfo.mintA.decimals),
      new Decimal(amountB.amount.toString()).div(10 ** poolInfo.mintB.decimals)
    ]
    const [_amountSlippageA, _amountSlippageB] = [
      new Decimal(amountSlippageA.amount.toString()).sub(amountSlippageA.fee?.toString() ?? 0).div(10 ** poolInfo.mintA.decimals),
      new Decimal(amountSlippageB.amount.toString()).sub(amountSlippageB.fee?.toString() ?? 0).div(10 ** poolInfo.mintB.decimals)
    ]

    return {
      priceLower,
      priceUpper,
      amountA: _amountA,
      amountB: _amountB,
      amountSlippageA: _amountSlippageA,
      amountSlippageB: _amountSlippageB
    }
  })

  const allPositionKey = useMemo(
    () => balanceMints.map((mint) => getPdaPersonalPositionAddress(new PublicKey(clmmProgramId), mint).publicKey.toBase58()),
    [balanceMints]
  )

  const needFetch = !fetching && clmmProgramId && connection && Object.keys(balances).length > 0 && allPositionKey.length > 0
  const {
    data: chunkData,
    isLoading,
    isValidating,
    mutate,
    ...swrProps
  } = useSWR(needFetch ? [connection!, allPositionKey] : null, fetcher, {
    dedupingInterval: refreshInterval,
    focusThrottleInterval: refreshInterval,
    refreshInterval,
    keepPreviousData: !!needFetch && !!activeWallet
  })

  const data = useMemo(() => chunkData?.filter(Boolean) || [], [chunkData])

  const balanceData = useMemo(() => {
    const allData = data.map((d) => d.value).flat()
    const positionMap: ClmmDataMap = new Map()
    allData.forEach((positionRes, idx) => {
      if (!positionRes) return
      const position = PositionInfoLayout.decode(positionRes.data)
      const poolId = position.poolId.toBase58()
      if (!positionMap.get(poolId))
        positionMap.set(poolId, [
          {
            ...position,
            key: allPositionKey[idx]
          }
        ])
      else positionMap.set(poolId, [...Array.from(positionMap.get(poolId)!), position])
    })
    return positionMap
  }, [data, allPositionKey])

  return {
    clmmBalanceInfo: balanceData,
    reFetchBalance: mutate,
    getPriceAndAmount,
    isLoading,
    isValidating,
    slot: data?.[0]?.context.slot ?? 0,
    ...swrProps
  }
}
