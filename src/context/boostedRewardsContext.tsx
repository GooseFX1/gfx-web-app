import React, { createContext, FC, ReactNode, useContext, useMemo } from 'react'
import { BoostedRewardInfo, getAllActiveRewards, getClaimRewardsAccounts } from '@/web3/Farm'
import { usePriceFeedFarm } from './price_feed_farm'
import { PublicKey } from '@solana/web3.js'
import { RewardInfo } from './price_feed_farm'
import { fetchTokensByPublicKey } from '@/api/gamma'
import BigNumber from 'bignumber.js'
import { TokenListToken } from './gamma'
import { QUERY_KEY } from '@/queries/query.helper'
import { useQuery } from '@tanstack/react-query'
import { INTERVALS } from '@/utils/time'
import { useWalletBalance } from '@/context/walletBalanceContext'

export interface IBoostedRewardsConfig {
  allActiveRewards: { publicKey: PublicKey; rewardInfo: RewardInfo }[]
  claimableRewards?: BoostedRewardInfo[]
  claimableRewardsWithTokens: {
    totalClaimableRewardsUsd: BigNumber
    rewards: (BoostedRewardInfo & {
      claimableAmount: BigNumber
      claimableAmountUsd: BigNumber
      token: TokenListToken
    })[]
  }
  isLoadingActiveRewards: boolean
  isLoadingClaimableRewards: boolean
  getActiveRewardByPoolId: (poolId: PublicKey) =>
    | {
        rewards: { publicKey: PublicKey; rewardInfo: RewardInfo }[]
        token: TokenListToken
        pricePerDay: BigNumber
        pricePerDayUsd: BigNumber
      }[]
    | null
  getClaimableRewardByPoolId: (
    poolId: PublicKey
  ) => { claimableAmount: BigNumber; claimableAmountUsd: BigNumber } | null
  refreshRewards: () => Promise<boolean>
}

const BoostedRewardsContext = createContext<IBoostedRewardsConfig | null>(null)

export const BoostedRewardsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { GammaProgram } = usePriceFeedFarm()
  const { publicKey: userPublicKey } = useWalletBalance()

  const allActiveRewardsQuery = useQuery({
    queryKey: [QUERY_KEY, 'boosted-all-active-rewards'],
    queryFn: async () => await getAllActiveRewards(GammaProgram),
    staleTime: INTERVALS.MINUTE * 2
  })

  const claimableRewardsQuery = useQuery({
    queryKey: [QUERY_KEY, 'boosted-claimable-rewards', userPublicKey?.toString()],
    queryFn: async () => {
      if (!userPublicKey) return []
      return await getClaimRewardsAccounts(GammaProgram, userPublicKey)
    },
    staleTime: INTERVALS.MINUTE * 2,
    enabled: !!userPublicKey
  })

  const tokensInRewardsQuery = useQuery({
    queryKey: [QUERY_KEY, 'boosted-tokens-rewards', allActiveRewardsQuery.data, claimableRewardsQuery.data],
    queryFn: async () => {
      const allActiveRewards = allActiveRewardsQuery.data || []
      const claimableRewards = claimableRewardsQuery.data || []
      const allTokenAddresses = [
        ...new Set(allActiveRewards.map((reward) => reward.rewardInfo.mint)),
        ...new Set(claimableRewards.map((reward) => reward.rewardInfo.mint))
      ]
      const res = await fetchTokensByPublicKey(allTokenAddresses.join(','))
      if (!res || !res.success || res.data.tokens?.length === 0) return []
      return res.data.tokens
    }
  })
  const claimableRewardsWithTokens = useMemo(() => {
    if (!claimableRewardsQuery.data || !tokensInRewardsQuery.data)
      return {
        totalClaimableRewardsUsd: new BigNumber(0),
        rewards: []
      }
    const rewardsWithTokens = []
    const tokesLookup = new Map<string, TokenListToken>(tokensInRewardsQuery.data.map((t) => [t.address, t]))
    for (let i = 0; i < claimableRewardsQuery.data.length; i++) {
      const reward = claimableRewardsQuery.data[i]

      const _token = tokesLookup.get(reward.rewardInfo.mint.toBase58())
      if (!_token) continue

      const claimableAmount = new BigNumber(reward.userRewardInfo.totalRewards.toString())
        .minus(new BigNumber(reward.userRewardInfo.totalClaimed.toString()))
        .div(new BigNumber(10 ** _token.decimals))

      const claimableAmountUsd = claimableAmount.multipliedBy(_token.price)

      rewardsWithTokens.push({
        ...reward,
        claimableAmount,
        claimableAmountUsd,
        token: _token
      })
    }
    return {
      totalClaimableRewardsUsd: rewardsWithTokens.reduce(
        (acc, reward) => acc.plus(reward.claimableAmountUsd),
        new BigNumber(0)
      ),
      rewards: rewardsWithTokens
    }
  }, [claimableRewardsQuery.data, tokensInRewardsQuery.data])

  const getActiveRewardByPoolId = (poolId: PublicKey) => {
    if (!allActiveRewardsQuery.data || !tokensInRewardsQuery.data) return []

    const activeRewards = allActiveRewardsQuery.data.filter((reward) => reward.rewardInfo.pool.equals(poolId))
    if (activeRewards.length == 0) return []
    const tokensLookup = new Map<string, TokenListToken>(tokensInRewardsQuery.data.map((t) => [t.address, t]))
    const mappedRewards = new Map<
      string,
      {
        token: TokenListToken
        pricePerDay: BigNumber
        pricePerDayUsd: BigNumber
        rewards: { publicKey: PublicKey; rewardInfo: RewardInfo }[]
      }
    >()
    for (const reward of activeRewards) {
      const token = tokensLookup.get(reward.rewardInfo.mint.toBase58())

      if (!token) {
        continue
      }

      const price = new BigNumber(reward.rewardInfo.totalToDisburse.toString())
        .div(new BigNumber(10 ** token.decimals))
        .multipliedBy(86400)

      const intervalSecDiff = new BigNumber(reward.rewardInfo.endRewardsAt.toString()).minus(
        new BigNumber(reward.rewardInfo.startAt.toString())
      )

      const pricePerDay = price.div(intervalSecDiff)
      // aggregate multiple rewards of same token type
      if (!mappedRewards.has(reward.rewardInfo.mint.toBase58())) {
        mappedRewards.set(reward.rewardInfo.mint.toBase58(), {
          token,
          pricePerDay: new BigNumber(0),
          pricePerDayUsd: new BigNumber(0),
          rewards: []
        })
      }
      const currentReward = mappedRewards.get(reward.rewardInfo.mint.toBase58())
      mappedRewards.set(reward.rewardInfo.mint.toBase58(), {
        ...currentReward,
        rewards: [...currentReward.rewards, reward],
        pricePerDay: currentReward.pricePerDay.plus(pricePerDay),
        pricePerDayUsd: currentReward.pricePerDayUsd.plus(pricePerDay.multipliedBy(token.price))
      })
    }

    return Array.from(mappedRewards.values())
  }
  const getClaimableRewardByPoolId = (poolId: PublicKey) => {
    if (!claimableRewardsQuery.data || !tokensInRewardsQuery.data) return null
    const rewards = claimableRewardsQuery.data.filter((reward) => reward.rewardInfo.pool.equals(poolId))
    if (!rewards) return null
    const mappedRewards = rewards.map((reward) => {
      const token = tokensInRewardsQuery.data.find((t) => t.address === reward.rewardInfo.mint.toString())
      if (!token) return
      const claimableAmount = new BigNumber(reward.userRewardInfo.totalRewards.toString())
        .minus(new BigNumber(reward.userRewardInfo.totalClaimed.toString()))
        .div(new BigNumber(10 ** token.decimals))

      const claimableAmountUsd = claimableAmount.multipliedBy(token.price)
      return {
        ...reward,
        claimableAmount,
        claimableAmountUsd,
        token
      }
    })
    return {
      claimableAmount: mappedRewards.reduce((acc, curr) => acc.plus(curr.claimableAmount), new BigNumber(0)),
      claimableAmountUsd: mappedRewards.reduce((acc, curr) => acc.plus(curr.claimableAmountUsd), new BigNumber(0))
    }
  }

  return (
    <BoostedRewardsContext.Provider
      value={{
        allActiveRewards: allActiveRewardsQuery.data || [],
        claimableRewards: claimableRewardsQuery.data || [],
        isLoadingActiveRewards: allActiveRewardsQuery.isLoading,
        isLoadingClaimableRewards: claimableRewardsQuery.isLoading,
        getActiveRewardByPoolId,
        getClaimableRewardByPoolId,
        claimableRewardsWithTokens,
        refreshRewards: async () => {
          await Promise.all([allActiveRewardsQuery.refetch(), claimableRewardsQuery.refetch()])
          return true
        }
      }}
    >
      {children}
    </BoostedRewardsContext.Provider>
  )
}

export const useBoostedRewards = (): IBoostedRewardsConfig => {
  const context = useContext(BoostedRewardsContext)

  if (!context) {
    throw new Error('Missing boosted rewards context')
  }
  return context
}
