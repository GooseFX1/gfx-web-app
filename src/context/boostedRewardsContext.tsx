import React, { createContext, FC, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { BoostedRewardInfo, getAllActiveRewards, getClaimRewardsAccounts } from '@/web3/Farm'
import { usePriceFeedFarm } from './price_feed_farm'
import { PublicKey } from '@solana/web3.js'
import { RewardInfo } from './price_feed_farm'
import { useWallet } from '@solana/wallet-adapter-react'
import { fetchTokensByPublicKey } from '@/api/gamma'
import BigNumber from 'bignumber.js'
import { TokenListToken } from './gamma'

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
  getActiveRewardByPoolId: (poolId: PublicKey) => Promise<{
    publicKey: PublicKey
    rewardInfo: RewardInfo
    token: TokenListToken
    pricePerDay: BigNumber
    pricePerDayUsd: BigNumber
  } | null>
  getClaimableRewardByPoolId: (
    poolId: PublicKey
  ) => Promise<
    | (BoostedRewardInfo & { claimableAmount: BigNumber; claimableAmountUsd: BigNumber; token: TokenListToken })
    | null
  >
  refreshRewards: () => void
}

const BoostedRewardsContext = createContext<IBoostedRewardsConfig | null>(null)

export const BoostedRewardsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [allActiveRewards, setAllActiveRewards] = useState<{ publicKey: PublicKey; rewardInfo: RewardInfo }[]>([])
  const [claimableRewards, setClaimableRewards] = useState<BoostedRewardInfo[]>([])
  const [claimableRewardsWithTokens, setClaimableRewardsWithTokens] = useState<
    IBoostedRewardsConfig['claimableRewardsWithTokens']
  >({
    totalClaimableRewardsUsd: new BigNumber(0),
    rewards: []
  })
  const [isLoadingActiveRewards, setIsLoadingActiveRewards] = useState(false)
  const [isLoadingClaimableRewards, setIsLoadingClaimableRewards] = useState(false)
  const { GammaProgram } = usePriceFeedFarm()
  const { wallet } = useWallet()
  const userPublicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])
  const [tokens, setTokens] = useState<TokenListToken[]>([])

  const fetchAllActiveRewards = async () => {
    setIsLoadingActiveRewards(true)
    const allActiveRewards = await getAllActiveRewards(GammaProgram)
    setAllActiveRewards(allActiveRewards)
    setIsLoadingActiveRewards(false)
  }

  const fetchClaimableRewards = async (_userPublicKey: PublicKey) => {
    if (!_userPublicKey) return
    setIsLoadingClaimableRewards(true)
    const claimableRewards = await getClaimRewardsAccounts(GammaProgram, _userPublicKey)
    setClaimableRewards(claimableRewards)
    setIsLoadingClaimableRewards(false)
  }

  useEffect(() => {
    fetchAllActiveRewards()
  }, [])

  useEffect(() => {
    fetchClaimableRewards(userPublicKey)
  }, [userPublicKey])

  const refreshRewards = useCallback(() => {
    fetchAllActiveRewards()
    fetchClaimableRewards(userPublicKey)
  }, [fetchAllActiveRewards, fetchClaimableRewards, userPublicKey])

  useEffect(() => {
    const fetchTokens = async () => {
      if (!allActiveRewards.length && !claimableRewards.length) return

      const allTokenAddresses = [
        ...new Set(allActiveRewards.map((reward) => reward.rewardInfo.mint)),
        ...new Set(claimableRewards.map((reward) => reward.rewardInfo.mint))
      ]

      if (allTokenAddresses.some((pubKey) => !tokens.find((t) => t.address === pubKey.toString()))) {
        const tokenListData = await fetchTokensByPublicKey(allTokenAddresses.join(','))
        if (!tokenListData.success || tokenListData.data.tokens?.length !== allTokenAddresses.length) return
        setTokens(tokenListData.data.tokens)
      }
    }
    fetchTokens()
  }, [allActiveRewards, claimableRewards])

  useEffect(() => {
    const fetchClaimableRewardsWithToken = async () => {
      if (!claimableRewards.length) return
      if (!tokens.length) return

      const rewardsWithTokens = []

      for (let i = 0; i < claimableRewards.length; i++) {
        const reward = claimableRewards[i]

        const _token = tokens.find((t) => t.address === reward.rewardInfo.mint.toString())
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
      setClaimableRewardsWithTokens({
        totalClaimableRewardsUsd: rewardsWithTokens.reduce(
          (acc, reward) => acc.plus(reward.claimableAmountUsd),
          new BigNumber(0)
        ),
        rewards: rewardsWithTokens
      })
    }
    fetchClaimableRewardsWithToken()
  }, [claimableRewards, tokens])

  const getActiveRewardByPoolId = useCallback(
    async (poolId: PublicKey) => {
      if (isLoadingActiveRewards) return null
      const reward = allActiveRewards.find((reward) => reward.rewardInfo.pool.equals(poolId))
      if (!reward) return null

      let _token = tokens.find((t) => t.address === reward.rewardInfo.mint.toString())

      if (!_token) {
        const tokenListData = await fetchTokensByPublicKey(`${reward.rewardInfo.mint}`)
        if (!tokenListData.success || tokenListData.data.tokens?.length !== 1) return
        _token = tokenListData.data.tokens[0]
      }

      const price = new BigNumber(reward.rewardInfo.totalToDisburse.toString())
        .div(new BigNumber(10 ** _token.decimals))
        .multipliedBy(86400)

      const intervalSecDiff = new BigNumber(reward.rewardInfo.endRewardsAt.toString()).minus(
        new BigNumber(reward.rewardInfo.startAt.toString())
      )

      const pricePerDay = price.div(intervalSecDiff)

      return {
        ...reward,
        token: _token,
        pricePerDay,
        pricePerDayUsd: pricePerDay.multipliedBy(_token.price)
      }
    },
    [allActiveRewards, isLoadingActiveRewards, tokens]
  )

  const getClaimableRewardByPoolId = useCallback(
    async (poolId: PublicKey) => {
      if (isLoadingClaimableRewards) return null
      const reward = claimableRewards.find((reward) => reward.rewardInfo.pool.equals(poolId))
      if (!reward) return null

      let _token = tokens.find((t) => t.address === reward.rewardInfo.mint.toString())

      if (!_token) {
        const tokenListData = await fetchTokensByPublicKey(`${reward.rewardInfo.mint}`)
        if (!tokenListData.success || tokenListData.data.tokens?.length !== 1) return
        _token = tokenListData.data.tokens[0]
      }

      const claimableAmount = new BigNumber(reward.userRewardInfo.totalRewards.toString())
        .minus(new BigNumber(reward.userRewardInfo.totalClaimed.toString()))
        .div(new BigNumber(10 ** _token.decimals))

      const claimableAmountUsd = claimableAmount.multipliedBy(_token.price)

      return {
        ...reward,
        token: _token,
        claimableAmount,
        claimableAmountUsd
      }
    },
    [claimableRewards, isLoadingClaimableRewards, tokens]
  )

  return (
    <BoostedRewardsContext.Provider
      value={{
        allActiveRewards,
        claimableRewards,
        isLoadingActiveRewards,
        isLoadingClaimableRewards,
        getActiveRewardByPoolId,
        getClaimableRewardByPoolId,
        claimableRewardsWithTokens,
        refreshRewards
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
