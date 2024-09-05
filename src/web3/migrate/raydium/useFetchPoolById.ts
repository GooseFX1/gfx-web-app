import { useEffect, useMemo } from 'react'
import {
  ApiV3PoolInfoConcentratedItem,
  ApiV3Token,
  FetchPoolParams,
  PoolFarmRewardInfo,
  PoolFetchType
} from '@raydium-io/raydium-sdk-v2'
import useSWR, { KeyedMutator } from 'swr'
// import shallow from 'zustand/shallow'
import { AxiosResponse } from 'axios'
import axios from 'axios'
import { isValidPublicKey } from './pubkeyUtil'
import { MILLISECONDS_IN_MINUTE } from './useEvent'
import { axiosFetchWithRetries } from '@/context'
import { PublicKey } from '@solana/web3.js'
import { useAccounts } from '@/context'

// import { ConditionalPoolType } from './type'
// import { useAppStore, useTokenStore } from '@/store'
// import { formatPoolData, poolInfoCache, formatAprData } from './formatter'
// import Decimal from 'decimal.js'

// export enum AprKey {
//     Day = 'day',
//     Week = 'week',
//     Month = 'month'
//   }
// export type WeeklyRewardData = { orgAmount: string; amount: string; token: ApiV3Token; startTime?: number; endTime?: number }[]
// export type AprData = { apr: number; percent: number; token?: ApiV3Token; isTradingFee?: boolean }[]
// export type TimeAprData = Record<AprKey, { apr: number; percent: number; token?: ApiV3Token; isTradingFee?: boolean }[]>
// export type TotalApr = Record<AprKey, number>

// export interface FormattedPoolReward extends PoolFarmRewardInfo {
//     apr: number
//     weekly: string
//     periodString: string
//     periodDays: number
//     unEmit: string
//     upcoming: boolean
//     ongoing: boolean
//     ended: boolean
//     totalRewards: string
// }

// type FormattedExtendInfo = {
//     poolName: string
//     poolDecimals: number
//     isOpenBook: boolean
//     weeklyRewards: WeeklyRewardData
//     allApr: TimeAprData
//     totalApr: TotalApr
//     recommendDecimal: (val: string | number | Decimal) => number
//     formattedRewardInfos: FormattedPoolReward[]
//     isRewardEnded: boolean
// }
// export type FormattedPoolInfoConcentratedItem = ApiV3PoolInfoConcentratedItem & FormattedExtendInfo


const fetcher = ([url]: [url: string]) => axios.get<ApiV3PoolInfoConcentratedItem[]>(url, { skipError: true })

export default function useFetchPoolById(
  props: {
    shouldFetch?: boolean
    idList?: (string | undefined)[]
    refreshInterval?: number
    readFromCache?: boolean
    refreshTag?: number
    keepPreviousData?: boolean
  } & FetchPoolParams
): {
  data?: ApiV3PoolInfoConcentratedItem[]
  dataMap: { [key: string]: ApiV3PoolInfoConcentratedItem }
  isLoading: boolean
  error?: any
  isEmptyResult: boolean
  isValidating: boolean
  mutate: KeyedMutator<AxiosResponse<ApiV3PoolInfoConcentratedItem[], any>>
} {
  const { balances, fetchAccounts, fetching, getAmount, getUIAmount, setBalances, setFetching } = useAccounts()
  const {
    shouldFetch = true,
    idList = [],
    refreshInterval = MILLISECONDS_IN_MINUTE * 3,
    readFromCache,
    type,
    refreshTag,
    keepPreviousData
  } = props || {}
  const mints = useMemo(() => {
    return new Map(Object.entries(balances)
      .filter(([_, accountInfo]) => accountInfo.amount === '1'))
  }, [balances]);
  const readyIdList = idList.filter((i) => i && isValidPublicKey(i) && !mints.get(i)) as string[]
  const [host, searchIdUrl] = useAppStore((s) => [s.urlConfigs.BASE_HOST, s.urlConfigs.POOL_SEARCH_BY_ID], shallow)

  const cacheDataList = useMemo(
    () =>
      readFromCache
        ? readyIdList
            .map((id) => poolInfoCache.get(id))
            .filter(
              (d) => d !== undefined && (!type || type === PoolFetchType.All || type.toLocaleLowerCase() === d.type.toLocaleLowerCase())
            )
        : [],
    [JSON.stringify(readyIdList)]
  ) as ApiV3PoolInfoConcentratedItem[]

  const url = !readyIdList.length || readyIdList.length === cacheDataList.length || !shouldFetch ? null : host + searchIdUrl

  const { data, isLoading, error, ...rest } = useSWR(url ? [url + `?ids=${readyIdList.join(',')}`, refreshTag] : null, fetcher, {
    dedupingInterval: refreshInterval,
    focusThrottleInterval: refreshInterval,
    refreshInterval,
    keepPreviousData
  })
  const resData = useMemo(
    () => [
      ...cacheDataList,
      ...(data?.data.filter(
        (d) => !!d && (!type || type === PoolFetchType.All || type.toLocaleLowerCase() === d.type.toLocaleLowerCase())
      ) || [])
    ],
    [data, cacheDataList, type]
  )
  const dataMap = useMemo(() => resData.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {}), [resData]) as {
    [key: string]: ApiV3PoolInfoConcentratedItem
  }
  const isEmptyResult = !!idList.length && !isLoading && (!data || !resData.length || !!error)

  useEffect(() => {
    if (resData) resData.forEach((d) => poolInfoCache.set(d.id, d))
  }, [resData])

  return {
    data: data?.data.filter(Boolean).map(formatAprData) as T[],
    dataMap,
    isLoading,
    error,
    isEmptyResult,
    ...rest
  }
}
