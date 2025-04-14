import { createContext, FC, ReactNode, useCallback, useContext, useMemo } from 'react'
import {
  ADDRESSES,
  GfxStakeRewards,
  UnstakeableTicket,
  UnstakeTicket,
  UserMetadata
} from 'goosefx-stake-rewards-sdk'
import * as anchor from '@project-serum/anchor'
import { BN, Wallet } from '@project-serum/anchor'
import { useConnectionConfig } from './settings'
import { Keypair, TransactionInstruction } from '@solana/web3.js'
import { createAssociatedTokenAccountIx } from '../web3'
import { createAssociatedTokenAccountInstruction, getAssociatedTokenAddress } from '@solana/spl-token-v2'
import CoinGecko from 'coingecko-api'
import { ADDRESSES as rewardAddresses } from 'goosefx-stake-rewards-sdk/dist/constants'
import { useWalletBalance } from '@/context/walletBalanceContext'
import useTransaction from '@/hooks/useTransaction'
import TransactionBuilder from '@/web3/Builders/transaction.builder'
import { useMutation, UseMutationResult, useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/queries/query.helper'

const cg = new CoinGecko()

const ANCHOR_BN = {
  ZERO: new anchor.BN(0.0),
  BASE_9: new anchor.BN(1e9),
  BASE_6: new anchor.BN(1e6)
}

interface IRewardsContext {
  userMetaData: UserMetadata
  claimable: number
  totalStaked: number
  totalEarned: number
  unstakeableTickets: UnstakeableTicket[]
  activeUnstakingTickets: UnstakeTicket[]
  hasRewards: boolean
  stakeMutation: UseMutationResult<void, unknown, number, unknown>
  unstakeMutation: UseMutationResult<void, unknown, number, unknown>
  claimFeesMutation: UseMutationResult<void, unknown, void, unknown>
  redeemUnstakingTicketsMutation: UseMutationResult<void, unknown, UnstakeableTicket[], unknown>
  getUiAmount: (value: anchor.BN, isUsdc?: boolean) => number
  totalStakedInUSD: number
  gofxValue: number
  userStakeRatio: number
  totalStakedGlobally: number
}

const RewardsContext = createContext<IRewardsContext | null>(null)

const getNetwork = (network) => (network == 'mainnet-beta' || network == 'testnet' ? 'MAINNET' : 'DEVNET')

export const RewardsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { network, connection, endpoint } = useConnectionConfig()
  const { base58PublicKey, publicKey } = useWalletBalance()
  const gofxValueQuery = useQuery({
    queryKey: [QUERY_KEY, 'gofx-value'],
    queryFn: async () => {
      const res = await cg.coins.fetch('goosefx', {}).catch((err) => {
        console.log(err)
        return Response.error()
      })
      if (res.code != 200) return
      const data = res.data
      if (!data) return
      if (!data.market_data || !data.market_data.current_price || !data.market_data.current_price.usd) return
      return data.market_data.current_price.usd
    },
    staleTime: Infinity
  })
  const programQuery = useQuery({
    queryKey: [QUERY_KEY, 'gfx-stake-program', endpoint],
    queryFn: () => new GfxStakeRewards(connection, getNetwork(network), new Wallet(Keypair.generate())),
    staleTime: Infinity
  })

  const poolStateQuery = useQuery({
    queryKey: [QUERY_KEY, 'gfx-stake-rewards'],
    queryFn: async () => {
      const [stakePool, gofxVault] = await Promise.all([
        programQuery.data.getStakePool(),
        programQuery.data.getGoFxVault()
      ])
      return {
        stakePool,
        gofxVault,
        totalStakedGlobally: Number(((gofxVault as any)?.amount ?? BigInt(0)) / BigInt(1e9))
      }
    },
    staleTime: Infinity,
    enabled: !!programQuery.data,
    placeholderData: {
      stakePool: null,
      gofxVault: null,
      totalStakedGlobally: 0
    }
  })

  const userDataQuery = useQuery({
    queryKey: [QUERY_KEY, 'gfx-stake-user', base58PublicKey],
    queryFn: async () => {
      const [userMetadata, unstakingTickets, claimable] = await Promise.all([
        programQuery.data.getUserMetaData(publicKey),
        programQuery.data.getUnstakingTickets(publicKey),
        programQuery.data.getUserRewardsHoldingAmount(publicKey)
      ])

      const unstakeableTickets = programQuery.data.getUnstakeableTickets(unstakingTickets)
      return {
        userMetadata,
        claimable: Number(claimable),
        activeUnstakingTickets: userMetadata.unstakingTickets.filter(
          (ticket) => ticket.createdAt.toString() !== '0'
        ),
        unstakeableTickets,
        totalEarned: getUiAmount(userMetadata.totalEarned, true),
        totalStaked: getUiAmount(userMetadata.totalStaked)
      }
    },
    staleTime: Infinity,
    enabled: !!programQuery.data && !!base58PublicKey,
    placeholderData: {
      userMetadata: null,
      claimable: 0,
      totalEarned: 0,
      totalStaked: 0,
      unstakeableTickets: [],
      activeUnstakingTickets: []
    }
  })
  const userStakeRatio = (Number(userDataQuery.data?.totalStaked) / poolStateQuery.data?.totalStakedGlobally) * 100
  const hasRewards = userDataQuery.data?.claimable > 0 || userDataQuery.data?.unstakeableTickets?.length > 0
  console.log({
    hasRewards,
    claimable: userDataQuery.data?.claimable,
    userStakeRatio
  })
  console.log('STAKE REWARDS',{
    hasRewards,
    userData: userDataQuery.data
  })
  const { createTransactionBuilder, sendTransaction } = useTransaction()

  const checkForUserAccount = async (
    callback: () => Promise<TransactionInstruction>
  ): Promise<TransactionBuilder> => {
    const [userMetadata, usdcAddress, gofxAddress] = await Promise.all([
      programQuery.data.getUserMetaData(publicKey).catch((err) => {
        console.log('get-user-metadata-failed', err)
        return null
      }),
      getAssociatedTokenAddress(ADDRESSES[getNetwork(network)].USDC_MINT, publicKey),
      getAssociatedTokenAddress(ADDRESSES[getNetwork(network)].GOFX_MINT, publicKey)
    ])
    const [usdcAccount, gofxAccount] = await Promise.all([
      connection.getAccountInfo(usdcAddress),
      connection.getAccountInfo(gofxAddress)
    ])
    const txBuilder = createTransactionBuilder()

    let res = userMetadata != null && usdcAccount != null && gofxAccount != null
    if (!usdcAccount) {
      const txn = createAssociatedTokenAccountInstruction(
        publicKey,
        usdcAddress,
        publicKey,
        ADDRESSES[getNetwork(network)].USDC_MINT
      )
      txBuilder.add(txn)
    }

    if (userMetadata === null) {
      const txn = await programQuery.data.initializeUserAccount(null, publicKey)
      txBuilder.add(txn)
      //const ix = await stakeRewards.initializeUserAccount(null, publicKey)
      //console.log('init user account', ix)
      //txn.add(ix)
    }

    if (gofxAccount === null) {
      console.log('ACC gofx account')
      const txn = createAssociatedTokenAccountInstruction(
        publicKey,
        gofxAddress,
        publicKey,
        ADDRESSES[getNetwork(network)].GOFX_MINT
      )
      txBuilder.add(txn)
    }
    const txnForUserAccountRequirements = txBuilder

    if (txnForUserAccountRequirements._instructions.length > 0) {
      res = Boolean(await sendTransaction(txnForUserAccountRequirements))
    }

    if (!res) {
      console.log('ACC missing', res, { userMetadata, usdcAccount, gofxAccount })
      return
    }
    const txn = createTransactionBuilder()
    txn.add(await callback())
    return txn
  }

  const stakeMutation = useMutation({
    mutationFn: async (amount: number) => {
      const stakeAmount = new anchor.BN(amount * 1e9)
      const txn = await checkForUserAccount(async () => programQuery.data.stake(stakeAmount, publicKey))
      await sendTransaction(txn)
    },
    onSuccess: () => {
      userDataQuery.refetch()
      poolStateQuery.refetch()
    }
  })
  const unstakeMutation = useMutation({
    mutationFn: async (amount: number) => {
      const gofxMint = rewardAddresses[programQuery.data.network].GOFX_MINT
      const account = await connection.getTokenAccountsByOwner(publicKey, { mint: gofxMint })
      const txBuilder = createTransactionBuilder().usePriorityFee(false)
      if (!account || !account.value.length) {
        const ata = await getAssociatedTokenAddress(
          gofxMint, // mint
          publicKey, // owner
          false
        )
        const tx = createAssociatedTokenAccountIx(gofxMint, ata, publicKey)
        txBuilder.add(tx)
      }
      const unstakeAmount = new anchor.BN(amount * 1e9)
      const txn = await checkForUserAccount(async () => programQuery.data.unstake(unstakeAmount, publicKey))
      txBuilder.add(txn._instructions)
      await sendTransaction(txBuilder)
    },
    onSuccess: () => {
      userDataQuery.refetch()
      poolStateQuery.refetch()
    }
  })

  const claimFeesMutation = useMutation({
    mutationFn: async () => {
      const txn = await checkForUserAccount(async () => programQuery.data.claimFees(publicKey))
      await sendTransaction(txn)
    },
    onSuccess: () => {
      userDataQuery.refetch()
    }
  })
  const redeemUnstakingTicketsMutation = useMutation({
    mutationFn: async (toUnstake: UnstakeableTicket[]) => {
      const txn = await checkForUserAccount(async () =>
        programQuery.data.resolveUnstakingTicket(
          toUnstake.map((ticket) => ticket.index),
          publicKey
        )
      )
      await sendTransaction(txn)
    },
    onSuccess: () => {
      userDataQuery.refetch()
    }
  })

  const getUiAmount = useCallback((value: BN, isUsdc = false) => {
    const base = isUsdc ? ANCHOR_BN.BASE_6 : ANCHOR_BN.BASE_9
    //const uiAmount = new anchor.BN(5163).divmod(base)
    // TODO: quick fix -> below will need to be fixed; decimal issue with BN.js
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const v = value.toString() / base.toString()

    return v
  }, [])
  const totalStakedInUSD = useMemo(() => {
    if (!gofxValueQuery.data) return 0.0
    if (!poolStateQuery.data?.totalStakedGlobally) return 0.0
    return gofxValueQuery.data * poolStateQuery.data.totalStakedGlobally
  }, [gofxValueQuery.data, poolStateQuery.data?.totalStakedGlobally])

  return (
    <RewardsContext.Provider
      value={{
        userMetaData: userDataQuery.data?.userMetadata,
        claimable: userDataQuery.data?.claimable ?? 0,
        totalStaked: userDataQuery.data?.totalStaked ?? 0,
        totalEarned: userDataQuery.data?.totalEarned ?? 0,
        unstakeableTickets: userDataQuery.data?.unstakeableTickets ?? [],
        activeUnstakingTickets: userDataQuery.data?.activeUnstakingTickets ?? [],
        stakeMutation: stakeMutation,
        unstakeMutation: unstakeMutation,
        claimFeesMutation: claimFeesMutation,
        redeemUnstakingTicketsMutation: redeemUnstakingTicketsMutation,
        getUiAmount,
        hasRewards,
        totalStakedInUSD,
        gofxValue: gofxValueQuery.data ?? 0,
        userStakeRatio,
        totalStakedGlobally: poolStateQuery.data?.totalStakedGlobally ?? 0
      }}
    >
      {children}
    </RewardsContext.Provider>
  )
}
export default function useRewards(): IRewardsContext {
  return useContext(RewardsContext)
}
