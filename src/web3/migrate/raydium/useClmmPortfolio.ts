import { useMemo, useState, useEffect } from 'react'
import { ApiV3PoolInfoConcentratedItem, ApiV3Token } from '@raydium-io/raydium-sdk-v2'
import useClmmBalance, { ClmmDataMap, ClmmPosition } from './useClmmBalance'
import useFetchPoolById from './useFetchPoolById'
import useTokenPrice from './useTokenPrice'
import Decimal from 'decimal.js'
import { useWalletBalance } from '@/context/walletBalanceContext'

export type { ClmmDataMap, ClmmPosition }

export const wSolToSolString = (name?: string) => (name ? name.replace(/WSOL/gi, 'SOL') : '')
export const transformSymbol = (symbols: ApiV3Token[]) => {
    if (symbols.length < 2) return wSolToSolString(symbols[0].symbol) || symbols[0]?.address.substring(0, 6)
    return `${wSolToSolString(symbols[0].symbol) || symbols[0]?.address.substring(0, 6)} - ${
      wSolToSolString(symbols[1]?.symbol) || symbols[1]?.address.substring(0, 6)
    }`
  }
export const getPoolName = (pool: ApiV3PoolInfoConcentratedItem) => transformSymbol([pool.mintA, pool.mintB])

export default function useClmmPortfolioData<T>({ type }: { type: T }) {
  const { clmmBalanceInfo, getPriceAndAmount, reFetchBalance, isLoading, slot } = useClmmBalance({})
  const { publicKey: owner } = useWalletBalance()
  const allClmmBalanceData = useMemo(() => Array.from(clmmBalanceInfo.entries()), [clmmBalanceInfo])
  const allPositions = useMemo(() => allClmmBalanceData.map((d) => d[1]).flat(), [allClmmBalanceData])
  const { dataMap } = useFetchPoolById({
    idList: allClmmBalanceData.map((d) => d[0]),
    keepPreviousData: !!owner
  })
  const { data: tokenPrices } = useTokenPrice({
    mintList: Array.from(
      new Set(
        Object.values(dataMap)
          .map((p) => [p.mintA.address, p.mintB.address])
          .flat()
      )
    )
  })

  const [clmmAll, setClmmAll] = useState(new Decimal(0))

  const [clmmPoolAssets, clmmPoolAssetsByMint] = useMemo(() => {
    if (!Object.keys(dataMap).length) return [[], {}]
    let localClmmAll = new Decimal(0)
    const groupData: { [key: string]: ClmmPosition[] } = {}
    const groupDataByMint: {
      [key: string]: { mint: ApiV3Token; amount: string; usd: string }
    } = {}
    allClmmBalanceData.forEach(([poolId, positions]) => {
      const poolInfo = dataMap[poolId]
      if (!poolInfo) return
      const poolName = getPoolName(poolInfo);
      if (!groupData[poolName]) groupData[poolName] = positions
      else groupData[poolName] = groupData[poolName].concat(positions)
    })
    const allPositions = Object.keys(groupData).map((poolName) => {
      const positions = groupData[poolName]
      let poolAllValue = new Decimal(0)
      positions.forEach((position) => {
        const poolInfo = dataMap[position.poolId.toBase58()]
        if (!poolInfo) return
        const { amountA, amountB } = getPriceAndAmount({ poolInfo, position })
        const usdValueA = amountA.mul(tokenPrices[poolInfo.mintA.address]?.value || 0)
        const usdValueB = amountB.mul(tokenPrices[poolInfo.mintB.address]?.value || 0)
        poolAllValue = poolAllValue
          .add(amountA.mul(tokenPrices[poolInfo.mintA.address]?.value || 0))
          .add(amountB.mul(tokenPrices[poolInfo.mintB.address]?.value || 0))
        groupDataByMint[poolInfo.mintA.address] = {
          mint: poolInfo.mintA,
          amount: new Decimal(groupDataByMint[poolInfo.mintA.address]?.amount || 0).add(amountA).toString(),
          usd: new Decimal(groupDataByMint[poolInfo.mintA.address]?.usd || 0).add(usdValueA).toString()
        }
        groupDataByMint[poolInfo.mintB.address] = {
          mint: poolInfo.mintB,
          amount: new Decimal(groupDataByMint[poolInfo.mintB.address]?.amount || 0).add(amountB).toString(),
          usd: new Decimal(groupDataByMint[poolInfo.mintB.address]?.usd || 0).add(usdValueB).toString()
        }
      })
      localClmmAll = localClmmAll.add(poolAllValue)
      return {
        key: poolName.replace(' - ', '/'),
        value: poolAllValue.toString(),
        type,
        percentage: 0
      }
    })
    setClmmAll(localClmmAll)
    return [allPositions, groupDataByMint]
  }, [dataMap, tokenPrices, allClmmBalanceData, allPositions.length])

  clmmPoolAssets.forEach(
    (data) =>
      (data!.percentage = clmmAll.isZero() ? 100 : new Decimal(data!.value ?? 0).div(clmmAll).mul(100).toDecimalPlaces(2).toNumber())
  )

  useEffect(
    () => () => {
      setClmmAll(new Decimal(0))
    },
    [owner?.toBase58()]
  )

  return {
    isLoading,
    clmmBalanceInfo,
    totalUSD: clmmAll,
    clmmBalanceByMint: clmmPoolAssetsByMint,
    data: clmmPoolAssets,
    mutate: reFetchBalance,
    slot
  }
}
