import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState
} from 'react'
import {
  ADDRESSES,
  GfxStakeRewards,
  GOFXVault,
  StakePool,
  TOKEN_SEEDS,
  UnstakeableTicket,
  UnstakeTicket,
  UserMetadata
} from 'goosefx-stake-rewards-sdk'
import * as anchor from '@project-serum/anchor'
import { BN, Wallet } from '@project-serum/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import { useConnectionConfig } from './settings'
import { Keypair, PublicKey, TransactionInstruction } from '@solana/web3.js'
import { confirmTransaction, createAssociatedTokenAccountIx } from '../web3'
import { createAssociatedTokenAccountInstruction, getAssociatedTokenAddress } from '@solana/spl-token-v2'
import { SubType } from '../hooks/useSolSub'
import CoinGecko from 'coingecko-api'
import { ADDRESSES as rewardAddresses } from 'goosefx-stake-rewards-sdk/dist/constants'
import { useSolSubActivityMulti } from '@/hooks/useSolSubActivity'
import { useWalletBalance } from '@/context/walletBalanceContext'
import useTransaction from '@/hooks/useTransaction'
import TransactionBuilder from '@/web3/Builders/transaction.builder'

const cg = new CoinGecko()

const ANCHOR_BN = {
  ZERO: new anchor.BN(0.0),
  BASE_9: new anchor.BN(1e9),
  BASE_6: new anchor.BN(1e6)
}

interface BaseClaim {
  totalClaimed: number
  claimable: number
}

interface Rewards extends BaseClaim {
  userMetadata: UserMetadata
  activeUnstakingTickets: UnstakeTicket[]
  unstakeableTickets: UnstakeableTicket[]
  totalStaked: number
  totalEarned: number
}

interface Referred extends BaseClaim {
  symbol: string
  referrals: string[]
}

interface Giveaway extends BaseClaim {
  // TODO: fill this in / should it extend base?
  someStateHere?: string
}

interface RewardState {
  user: {
    staking: Rewards
    referred: Referred
    giveaway: Giveaway
  }
  stakePool: StakePool
  gofxVault: GOFXVault
}

interface IRewardsContext {
  stakePool: StakePool
  gofxVault: GOFXVault
  userMetaData: UserMetadata
  claimable: number
  totalStaked: number
  totalEarned: number
  unstakeableTickets: UnstakeableTicket[]
  activeUnstakingTickets: UnstakeTicket[]
  hasRewards: boolean
  initializeUserAccount: () => Promise<boolean>
  closeUserAccount: () => Promise<void>
  stake: (amount: number) => Promise<void>
  unstake: (amount: number) => Promise<void>
  claimFees: () => Promise<void>
  redeemUnstakingTickets: (ticketContracts: UnstakeableTicket[]) => Promise<void>
  enterGiveaway: (giveawayContract: string) => void
  getClaimableFees: () => Promise<number>
  getUiAmount: (value: anchor.BN, isUsdc?: boolean) => number
  totalStakedInUSD: number
  gofxValue: number
  userStakeRatio: number
  totalStakedGlobally: number
}

const initialState: RewardState = {
  // TODO: state
  user: {
    staking: {
      userMetadata: {
        owner: PublicKey.default,
        accountOpenedAt: ANCHOR_BN.ZERO,
        totalStaked: ANCHOR_BN.ZERO,
        lastObservedTap: ANCHOR_BN.ZERO,
        lastClaimed: ANCHOR_BN.ZERO,
        totalEarned: ANCHOR_BN.ZERO,
        unstakingTickets: []
      },
      totalClaimed: 0,
      claimable: 0,
      totalStaked: 0,
      totalEarned: 0,
      unstakeableTickets: [],
      activeUnstakingTickets: []
    },
    referred: {
      symbol: '',
      referrals: [],
      totalClaimed: 0,
      claimable: 0
    },
    giveaway: {
      totalClaimed: 0,
      claimable: 0
    }
  },
  stakePool: {
    totalAccumulatedProfit: ANCHOR_BN.ZERO,
    protocolActivatedAt: ANCHOR_BN.ZERO
  },
  gofxVault: {
    amount: BigInt(1)
  }
}

const RewardsContext = createContext<IRewardsContext | null>(null)

// const fetchUserMetaData = async (stakeRewards: GfxStakeRewards, wallet: PublicKey) => {
//   const userMetadata = await stakeRewards.getUserMetaData(wallet)
//   return userMetadata
// }
// const fetchUserRewardsHoldingAmount = async (stakeRewards: GfxStakeRewards, wallet: PublicKey) => {
//   const claimable = await stakeRewards.getUserRewardsHoldingAmount(wallet)
//   return claimable
// }
// const fetchUnstakingTickets = async (stakeRewards: GfxStakeRewards, wallet: PublicKey) => {
//   const unstakingTickets = await stakeRewards.getUnstakingTickets(wallet)
//   return unstakingTickets
// }
const fetchAllRewardData = async (stakeRewards: GfxStakeRewards, wallet: PublicKey) => {
  // bulk operation to retrieve all cachable values of the contract
  const [userMetadata, stakePool, gofxVault, unstakingTickets, claimable] = await Promise.all([
    stakeRewards.getUserMetaData(wallet),
    stakeRewards.getStakePool(),
    stakeRewards.getGoFxVault(),
    stakeRewards.getUnstakingTickets(wallet),
    stakeRewards.getUserRewardsHoldingAmount(wallet)
  ])

  const unstakeableTickets = stakeRewards.getUnstakeableTickets(unstakingTickets)
  return {
    userMetadata,
    stakePool,
    gofxVault,
    unstakeableTickets,
    claimable
  }
}

export const RewardsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [stakePool, setStakePool] = useState<StakePool>(initialState.stakePool)
  const [gofxVault, setGofxVault] = useState<GOFXVault>(initialState.gofxVault)
  const [userMetaData, setUserMetaData] = useState<UserMetadata>(initialState.user.staking.userMetadata)
  const [claimable, setClaimable] = useState<number>(initialState.user.staking.claimable)
  const [totalStaked, setTotalStaked] = useState<number>(initialState.user.staking.totalStaked)
  const [totalEarned, setTotalEarned] = useState<number>(initialState.user.staking.totalEarned)
  const [unstakeableTickets, setUnstakeableTickets] = useState<UnstakeableTicket[]>(
    initialState.user.staking.unstakeableTickets
  )
  const [activeUnstakingTickets, setActiveUnstakingTickets] = useState<UnstakeTicket[]>(
    initialState.user.staking.activeUnstakingTickets
  )
  const [hasRewards, setHasRewards] = useState(false)
  const [userStakeRatio, setUserStakeRatio] = useState<number>(0)
  const walletContext = useWallet()
  const { network, connection } = useConnectionConfig()
  const [gofxValue, setGofxValue] = useState<number>(0)
  const [totalStakedGlobally, setTotalStakedGlobally] = useState<number>(0)
  const getNetwork = useCallback(
    () => (network == 'mainnet-beta' || network == 'testnet' ? 'MAINNET' : 'DEVNET'),
    [network]
  )
  const [stakeRewards, setStakeRewards] = useState<GfxStakeRewards>(
    () => new GfxStakeRewards(connection, getNetwork(), new Wallet(Keypair.generate()))
  )
  const [pubKeys, setPubKeys] = useState<Record<string, PublicKey>>({})
  const { connectedWalletPublicKey } = useWalletBalance()
  const { createTransactionBuilder, sendTransaction } = useTransaction()
  const resetStakeRewards = useCallback(() => {
    setStakePool(initialState.stakePool)
    setGofxVault(initialState.gofxVault)
    setUserMetaData(initialState.user.staking.userMetadata)
    setClaimable(initialState.user.staking.claimable)
    setTotalStaked(initialState.user.staking.totalStaked)
    setTotalEarned(initialState.user.staking.totalEarned)
    setUnstakeableTickets(initialState.user.staking.unstakeableTickets)
    setActiveUnstakingTickets(initialState.user.staking.activeUnstakingTickets)
    setHasRewards(false)
    setUserStakeRatio(0)
    console.log('calling reset')
  }, [])
  useEffect(() => {
    if (!walletContext.publicKey || !stakeRewards) {
      resetStakeRewards()
      return
    }
    const process = async () => {
      if (!walletContext.publicKey || !stakeRewards) return
      const [vault, userHoldingsAccount, userMetadata] = await Promise.all([
        stakeRewards.getGoFxVault(),
        stakeRewards.getUserRewardsHoldingAccount(walletContext.publicKey),
        PublicKey.findProgramAddressSync(
          [TOKEN_SEEDS.userMetaData, walletContext.publicKey.toBuffer()],
          GfxStakeRewards.programId
        )
      ])
      const gofxVault = (vault as any)?.address || null
      setPubKeys({
        gofxVault,
        userHoldingsAccount,
        userMetadata: userMetadata[0]
      })
    }
    process()
  }, [stakeRewards, walletContext.publicKey, resetStakeRewards])
  const cachedRetrievalKeys = useMemo(
    () => [
      {
        publicKey: pubKeys.gofxVault,
        callback: async () => {
          const t = await stakeRewards.getGoFxVault()
          console.log('goFxVault changed', t)
          if (!t) return
          const gfxVaultVal = Number(((t as any)?.amount ?? BigInt(0)) / BigInt(1e9))
          setTotalStakedGlobally(gfxVaultVal)
          setUserStakeRatio((Number(totalStaked) / gfxVaultVal) * 100)
          setGofxVault(t)
        }
      },
      {
        publicKey: pubKeys.userMetadata,
        callback: async () => {
          const newUserMetaData = await stakeRewards.getUserMetaData(connectedWalletPublicKey)
          const newUnstakaebleTicekts = stakeRewards.getUnstakeableTickets(newUserMetaData.unstakingTickets)
          setUserMetaData(newUserMetaData)
          setTotalEarned(getUiAmount(newUserMetaData.totalEarned, true))
          setTotalStaked(getUiAmount(newUserMetaData.totalStaked))
          setUnstakeableTickets(newUnstakaebleTicekts)
          setActiveUnstakingTickets(
            newUserMetaData.unstakingTickets.filter((ticket) => ticket.createdAt.toString() !== '0')
          )
          console.log('user meta data update', newUserMetaData)
        }
      },
      {
        publicKey: pubKeys.userHoldingsAccount,
        callback: async () => {
          const newClaimable = await stakeRewards.getUserRewardsHoldingAmount(connectedWalletPublicKey)
          setClaimable(Number(newClaimable))
          console.log('FOUND NEW CLAIMABLE')
        }
      }
    ],
    [pubKeys, stakeRewards, connectedWalletPublicKey]
  )
  useSolSubActivityMulti({
    subType: SubType.AccountChange,
    publicKeys: cachedRetrievalKeys
  })

  useEffect(() => {
    console.log(claimable, unstakeableTickets)
    const num = typeof claimable === 'number' ? claimable : Number(claimable)
    setHasRewards(num > 0 || unstakeableTickets.length > 0)
  }, [claimable, unstakeableTickets])
  useEffect(() => {
    const s = stakeRewards
    s.setConnection(connection, getNetwork())
    setStakeRewards(s)
  }, [connection, getNetwork])
  const updateStakeDetails = useCallback(async () => {
    // updates the details of the rewards object
    const data = await fetchAllRewardData(stakeRewards, walletContext.publicKey)
    // deep clone to avoid reference preventing re-render
    setUserMetaData(data.userMetadata)
    setUnstakeableTickets(data.unstakeableTickets)
    setActiveUnstakingTickets(
      data.userMetadata.unstakingTickets.filter((ticket) => ticket.createdAt.toString() !== '0')
    )
    setClaimable(Number(data.claimable))
    setTotalEarned(getUiAmount(data.userMetadata.totalEarned, true))
    const newTotalStaked = getUiAmount(data.userMetadata.totalStaked)
    setTotalStaked(newTotalStaked)
    setStakePool(data.stakePool)
    setGofxVault(data.gofxVault)
    setHasRewards(data.unstakeableTickets.length > 0 || Number(data.claimable) > 0)
    const gfxVaultVal = Number(((data.gofxVault as any)?.amount ?? BigInt(0)) / BigInt(1e9))
    setTotalStakedGlobally(gfxVaultVal)
    setUserStakeRatio((Number(newTotalStaked) / gfxVaultVal) * 100)
  }, [stakeRewards, walletContext.publicKey, walletContext?.wallet?.adapter?.publicKey])
  useLayoutEffect(() => {
    const fetchGofxValue = async () => {
      const res = await cg.coins.fetch('goosefx', {}).catch((err) => {
        console.log(err)
        return Response.error()
      })
      if (res.code != 200) return
      const data = res.data
      if (!data) return
      if (!data.market_data || !data.market_data.current_price || !data.market_data.current_price.usd) return
      setGofxValue(data.market_data.current_price.usd)
    }
    fetchGofxValue()
  }, [])

  useEffect(() => {
    if (!walletContext?.publicKey || !stakeRewards) {
      return
    }
    console.log('fetching-rewards', walletContext?.publicKey?.toBase58())
    updateStakeDetails().catch((err) => {
      console.warn('fetch-all-reward-data-failed', err)
    })
  }, [walletContext.publicKey, walletContext?.wallet?.adapter?.publicKey, updateStakeDetails, stakeRewards])
  const checkForUserAccount = useCallback(
    async (callback: () => Promise<TransactionInstruction>): Promise<TransactionBuilder> => {
      if (!stakeRewards) {
        console.warn('stake rewards not loaded')
      }

      const [userMetadata, usdcAddress, gofxAddress] = await Promise.all([
        stakeRewards.getUserMetaData(walletContext.publicKey).catch((err) => {
          console.log('get-user-metadata-failed', err)
          return null
        }),
        getAssociatedTokenAddress(ADDRESSES[getNetwork()].USDC_MINT, walletContext.publicKey),
        getAssociatedTokenAddress(ADDRESSES[getNetwork()].GOFX_MINT, walletContext.publicKey)
      ])
      const [usdcAccount, gofxAccount] = await Promise.all([
        connection.getAccountInfo(usdcAddress),
        connection.getAccountInfo(gofxAddress)
      ])
      const txBuilder = createTransactionBuilder()

      let res = userMetadata != null && usdcAccount != null && gofxAccount != null
      if (!usdcAccount) {
        const txn = createAssociatedTokenAccountInstruction(
          walletContext.publicKey,
          usdcAddress,
          walletContext.publicKey,
          ADDRESSES[getNetwork()].USDC_MINT
        )
        txBuilder.add(txn)
      }

      if (userMetadata === null) {
        const txn = await stakeRewards.initializeUserAccount(null, walletContext.publicKey)
        txBuilder.add(txn)
        //const ix = await stakeRewards.initializeUserAccount(null, walletContext.publicKey)
        //console.log('init user account', ix)
        //txn.add(ix)
      }

      if (gofxAccount === null) {
        const txn = createAssociatedTokenAccountInstruction(
          walletContext.publicKey,
          gofxAddress,
          walletContext.publicKey,
          ADDRESSES[getNetwork()].GOFX_MINT
        )
        txBuilder.add(txn)
      }
      const txnForUserAccountRequirements = txBuilder.getTransaction()

      if (txnForUserAccountRequirements.instructions.length > (txBuilder._usePriorityFee ? 1 : 0)) {
        res = Boolean(await sendTransaction(txnForUserAccountRequirements))
      }
      if (!res) {
        return
      }
      const txn = createTransactionBuilder()
      txn.add(await callback())
      return txn
    },
    [stakeRewards, walletContext, getNetwork, connection]
  )

  const initializeUserAccount = useCallback(async (): Promise<boolean> => {
    const txn: TransactionInstruction = await stakeRewards.initializeUserAccount(null, walletContext.publicKey)
    const txBuilder = createTransactionBuilder().add(txn)
    const { txSig } = await sendTransaction(txBuilder.getTransaction())
    if (txSig === '') {
      return false
    }

    return true
  }, [stakeRewards, walletContext, confirmTransaction, connection])
  const closeUserAccount = useCallback(async () => {
    //TODO: the below is not currently in use -> removing for now if needed add back in
    // const txn = stakeRewards.closeUserAccount(null, walletContext.publicKey)
    //
    //    const txnSig = await walletContext.sendTransaction(new Transaction().add(txn), connection).catch((err) => {
    //      console.log(err)
    //      return ''
    //    })
    //    await confirmTransaction(stakeRewards.connection, txnSig, 'confirmed')
    //      .then(() => {
    //        notify({
    //          message: Notification(
    //            'Close successful!',
    //            false,
    //            <div>
    //              <p>Account closed</p>
    //            </div>
    //          ),
    //          type: 'success'
    //        })
    //      })
    //      .catch((err) => {
    //        console.log('close-failed', err)
    //        notify({
    //          message: Notification(
    //            'Close failed!',
    //            true,
    //            <div>
    //              <p>{err.msg}</p>
    //            </div>
    //          ),
    //          type: 'error'
    //        })
    //      }).finally(()=>updateStakeDetails()
    //      )
    //
  }, [stakeRewards, connection, walletContext])

  const stake = useCallback(
    async (amount: number) => {
      // console.log(amount)
      const stakeAmount = new anchor.BN(amount * 1e9)

      const txn = await checkForUserAccount(async () => stakeRewards.stake(stakeAmount, walletContext.publicKey))
      console.log('STAKE')
      await sendTransaction(txn.getTransaction())
      console.log('STAKE END')
    },
    [stakeRewards, walletContext, confirmTransaction, connection]
  )
  const unstake = useCallback(
    async (amount: number) => {
      const gofxMint = rewardAddresses[stakeRewards.network].GOFX_MINT
      const account = await connection.getTokenAccountsByOwner(walletContext.publicKey, { mint: gofxMint })
      const txBuilder = createTransactionBuilder().usePriorityFee(false)
      if (!account || !account.value.length) {
        const ata = await getAssociatedTokenAddress(
          gofxMint, // mint
          walletContext.publicKey, // owner
          false
        )
        const tx = createAssociatedTokenAccountIx(gofxMint, ata, walletContext.publicKey)
        txBuilder.add(tx)
      }
      const unstakeAmount = new anchor.BN(amount * 1e9)
      const txn = await checkForUserAccount(async () =>
        stakeRewards.unstake(unstakeAmount, walletContext.publicKey)
      )
      txBuilder.add(txn.getTransaction())
      sendTransaction(txBuilder.getTransaction())
    },
    [stakeRewards, walletContext, connection]
  )
  const getClaimableFees = useCallback(async (): Promise<number> => {
    // retrieves value of claimable amount from contract
    const value = await stakeRewards.getUserRewardsHoldingAmount(walletContext.publicKey)
    return Number(value)
  }, [stakeRewards, walletContext])
  const claimFees = useCallback(async () => {
    const txn = await checkForUserAccount(async () => stakeRewards.claimFees(walletContext.publicKey))
    sendTransaction(txn.getTransaction())
  }, [stakeRewards, walletContext, connection, claimable])
  const redeemUnstakingTickets = useCallback(
    async (toUnstake: UnstakeableTicket[]) => {
      const txn = await checkForUserAccount(async () =>
        stakeRewards.resolveUnstakingTicket(
          toUnstake.map((ticket) => ticket.index),
          walletContext.publicKey
        )
      )
      sendTransaction(txn.getTransaction())
    },
    [stakeRewards, walletContext]
  )
  const enterGiveaway = useCallback(
    (giveawayContract: string) => {
      //TODO: handle entering giveaway
      console.log('enter-giveaway', giveawayContract)
    },
    [stakeRewards, walletContext]
  )

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
    if (!gofxValue) return 0.0
    if (!totalStaked) return 0.0
    return gofxValue * totalStaked
  }, [gofxValue, totalStaked])

  return (
    <RewardsContext.Provider
      value={{
        stakePool,
        gofxVault,
        userMetaData,
        claimable,
        totalStaked,
        totalEarned,
        unstakeableTickets,
        activeUnstakingTickets,
        initializeUserAccount,
        closeUserAccount,
        stake,
        unstake,
        claimFees,
        redeemUnstakingTickets,
        enterGiveaway,
        getClaimableFees,
        getUiAmount,
        hasRewards,
        totalStakedInUSD,
        gofxValue,
        userStakeRatio,
        totalStakedGlobally
      }}
    >
      {children}
    </RewardsContext.Provider>
  )
}
export default function useRewards(): IRewardsContext {
  return useContext(RewardsContext)
}
