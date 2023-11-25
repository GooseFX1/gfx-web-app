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
import { Keypair, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js'
import { confirmTransaction } from '../web3'
import { notify } from '../utils'
import { Col, Row } from 'antd'
import styled from 'styled-components'
import { createAssociatedTokenAccountInstruction, getAssociatedTokenAddress } from '@solana/spl-token-v2'
import useSolSub, { SubType } from '../hooks/useSolSub'
import CoinGecko from 'coingecko-api'

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
const MESSAGE = styled.div`
  margin: -12px 0;
  font-size: 12px;
  font-weight: 700;

  .m-title {
    margin-bottom: 16px;
  }

  .m-icon {
    width: 20.5px;
    height: 20px;
  }
`
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
const Notification = (title: string, isError: boolean, description: ReactNode): JSX.Element => (
  <MESSAGE>
    <Row className="m-title" justify="space-between" align="middle">
      <Col>{title}</Col>
      <Col>
        <img className="m-icon" src={`/img/assets/${isError ? 'notify_error' : 'notify-success'}.svg`} alt="" />
      </Col>
    </Row>
    {description}
  </MESSAGE>
)
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
  const { on, off } = useSolSub()
  useEffect(() => {
    const id = 'gofx-pool'
    on({
      SubType: SubType.AccountChange,
      id,
      pubKeyRetrieval: async () => {
        const t = await stakeRewards.getGoFxVault()
        if (!t) return null
        return (t as any).address
      },
      callback: async () => {
        const t = await stakeRewards.getGoFxVault()
        console.log('goFxVault changed', t)
        if (!t) return
        const gfxVaultVal = Number(((t as any)?.amount ?? BigInt(0)) / BigInt(1e9))
        setTotalStakedGlobally(gfxVaultVal)
        setUserStakeRatio((Number(totalStaked) / gfxVaultVal) * 100)
        setGofxVault(t)
      }
    })
    return () => {
      off(id)
      return
    }
  }, [stakeRewards, totalStaked])
  useEffect(() => {
    const id = 'usermetadata-staking-claimable'
    on({
      SubType: SubType.AccountChange,
      id,
      pubKeyRetrieval: () => {
        if (!walletContext.publicKey) return null
        const [address] = PublicKey.findProgramAddressSync(
          [TOKEN_SEEDS.userMetaData, walletContext.publicKey.toBuffer()],
          GfxStakeRewards.programId
        )
        return address
      },
      callback: async () => {
        const newUserMetaData = await stakeRewards.getUserMetaData(walletContext.publicKey)
        const newUnstakaebleTicekts = stakeRewards.getUnstakeableTickets(userMetaData.unstakingTickets)
        setUserMetaData(newUserMetaData)
        setTotalEarned(getUiAmount(newUserMetaData.totalEarned, true))
        setTotalStaked(getUiAmount(newUserMetaData.totalStaked))
        setUnstakeableTickets(newUnstakaebleTicekts)
        setActiveUnstakingTickets(
          newUserMetaData.unstakingTickets.filter((ticket) => ticket.createdAt.toString() !== '0')
        )
        setHasRewards(Number(claimable) > 0 || newUnstakaebleTicekts.length > 0)
        console.log('user meta data update')
      }
    })
    return () => {
      off(id)
      return
    }
  }, [walletContext.publicKey, stakeRewards, claimable])
  useEffect(() => {
    const id = 'usdc-staking-claimable'
    on({
      SubType: SubType.AccountChange,
      id,
      pubKeyRetrieval: async () => await stakeRewards.getUserRewardsHoldingAccount(walletContext.publicKey),
      callback: async () => {
        const newClaimable = await stakeRewards.getUserRewardsHoldingAmount(walletContext.publicKey)
        setClaimable(Number(newClaimable))
        setHasRewards(Number(newClaimable) > 0 || unstakeableTickets.length > 0)
      }
    })
    return () => {
      off(id)
      return
    }
  }, [stakeRewards, walletContext.publicKey, unstakeableTickets])

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
  }, [stakeRewards, walletContext.publicKey])
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
  }, [walletContext.publicKey, updateStakeDetails, stakeRewards])
  const checkForUserAccount = useCallback(
    async (callback: () => Promise<TransactionInstruction>): Promise<Transaction> => {
      if (!stakeRewards) {
        console.warn('stake rewards not loaded')
      }

      const [userMetadata, usdcAddress] = await Promise.all([
        stakeRewards.getUserMetaData(walletContext.publicKey).catch((err) => {
          console.log('get-user-metadata-failed', err)
          return null
        }),
        getAssociatedTokenAddress(ADDRESSES[getNetwork()].USDC_MINT, walletContext.publicKey)
      ])
      const usdcAccount = await connection.getAccountInfo(usdcAddress)
      const txnForUserAccountRequirements = new Transaction()
      let res = userMetadata != null && usdcAccount != null
      if (!usdcAccount) {
        const txn = createAssociatedTokenAccountInstruction(
          walletContext.publicKey,
          usdcAddress,
          walletContext.publicKey,
          ADDRESSES[getNetwork()].USDC_MINT
        )
        txnForUserAccountRequirements.add(txn)
      }

      if (userMetadata === null) {
        const txn = await stakeRewards.initializeUserAccount(null, walletContext.publicKey)
        txnForUserAccountRequirements.add(txn)
        //const ix = await stakeRewards.initializeUserAccount(null, walletContext.publicKey)
        //console.log('init user account', ix)
        //txn.add(ix)
      }
      if (txnForUserAccountRequirements.instructions.length > 0) {
        const txnSig = await walletContext
          .sendTransaction(txnForUserAccountRequirements, connection)
          .catch((err) => {
            console.log(err)
            return ''
          })

        res = await confirmTransaction(stakeRewards.connection, txnSig, 'confirmed')
          .then(() => {
            notify({
              message: Notification(
                'Initialize successful!',
                false,
                <div>
                  <p>Accounts required for staking initialized.</p>
                </div>
              ),
              type: 'success'
            })
            return true
          })
          .catch((err) => {
            console.log('initialize-failed', err)
            {
              notify({
                message: Notification(
                  'Initialize failed!',
                  true,
                  <div>
                    <p>Failed to initialize accounts for staking.</p>
                  </div>
                ),
                type: 'error'
              })
              return false
            }
          })
      }
      if (!res) {
        return
      }
      const txn = new Transaction()
      txn.add(await callback())
      return txn
    },
    [stakeRewards, walletContext, getNetwork]
  )

  const initializeUserAccount = useCallback(async (): Promise<boolean> => {
    const txn: TransactionInstruction = await stakeRewards.initializeUserAccount(null, walletContext.publicKey)

    const txnSig = await walletContext.sendTransaction(new Transaction().add(txn), connection).catch((err) => {
      console.log(err)
      return ''
    })
    if (txnSig === '') {
      return false
    }
    return await confirmTransaction(stakeRewards.connection, txnSig, 'confirmed')
      .then(() => {
        notify({
          message: Notification(
            'Initialize successful!',
            false,
            <div>
              <p>Account initialized</p>
            </div>
          ),
          type: 'success'
        })
        return true
      })
      .catch((err) => {
        console.log('initialize-failed', err)
        {
          notify({
            message: Notification(
              'Initialize failed!',
              true,
              <div>
                <p>{err.msg}</p>
              </div>
            ),
            type: 'error'
          })
          return false
        }
      })
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
      const txnSig = await walletContext
        .sendTransaction(new Transaction().add(txn), connection, {
          skipPreflight: true,
          preflightCommitment: 'confirmed'
        })
        .catch((err) => {
          console.log(err)
          return ''
        })
      console.log('txnSig', txnSig)
      await confirmTransaction(stakeRewards.connection, txnSig, 'confirmed')
        .then(() => {
          notify({
            message: Notification(
              'Bravo!',
              false,
              <Row>
                <Col>
                  You’ve successfully staked {amount.toFixed(2)} GOFX. Prepare to harvest rich rewards as you
                  continue your journey with us.
                </Col>
              </Row>
            ),
            type: 'success'
          })
        })
        .catch((err) => {
          console.log('stake-failed', err)
          notify({
            message: Notification(
              'Stake failed!',
              true,
              <div>
                <p>{err.msg}</p>
              </div>
            ),
            type: 'error'
          })
        })
    },
    [stakeRewards, walletContext, confirmTransaction, connection]
  )
  const unstake = useCallback(
    async (amount: number) => {
      const unstakeAmount = new anchor.BN(amount * 1e9)
      const txn = await checkForUserAccount(async () =>
        stakeRewards.unstake(unstakeAmount, walletContext.publicKey)
      )
      //const proposedEndDate = moment().add(7, 'days').calendar()
      const txnSig = await walletContext.sendTransaction(new Transaction().add(txn), connection).catch((err) => {
        console.log(err)
        return ''
      })
      await confirmTransaction(stakeRewards.connection, txnSig, 'confirmed')
        .then(() => {
          notify({
            message: Notification(
              'Great News!',
              false,
              <>
                <div>
                  Your cooldown has started, sit tight as the time ticks down, your patience will soon pay off{' '}
                  {amount.toFixed(2)} GOFX!
                </div>
              </>
            )
          })
        })
        .catch((err) => {
          console.log('unstake-failed', err)
          notify({
            message: Notification(
              'Unstake failed!',
              true,
              <div>
                <p>{err.msg}</p>
              </div>
            )
          })
        })
    },
    [stakeRewards, walletContext, connection]
  )
  const getClaimableFees = useCallback(async (): Promise<number> => {
    // retrieves value of claimable amount from contract
    const value = await stakeRewards.getUserRewardsHoldingAmount(walletContext.publicKey)
    return Number(value)
  }, [stakeRewards, walletContext])
  const claimFees = useCallback(async () => {
    const amount = claimable

    const txn = await checkForUserAccount(async () => stakeRewards.claimFees(walletContext.publicKey))
    const txnSig = await walletContext.sendTransaction(new Transaction().add(txn), connection).catch((err) => {
      console.log(err)
      return ''
    })
    await confirmTransaction(connection, txnSig, 'confirmed')
      .then(() => {
        notify({
          message: Notification(
            'Congratulations!',
            false,
            <>
              <div>
                You’ve successfully claimed {amount.toString()} USDC. Here’s to many more victories on your journey
                with us!
              </div>
            </>
          )
        })
      })
      .catch((err) => {
        console.log('CLAIM_FAILED', err)
        notify({
          message: Notification(
            'Claim failed!',
            true,
            <div>
              <p>{err.msg}</p>
            </div>
          )
        })
      })
  }, [stakeRewards, walletContext, connection, claimable])
  const redeemUnstakingTickets = useCallback(
    async (toUnstake: UnstakeableTicket[]) => {
      const txn = await checkForUserAccount(async () =>
        stakeRewards.resolveUnstakingTicket(
          toUnstake.map((ticket) => ticket.index),
          walletContext.publicKey
        )
      )
      const totalUnstaked = toUnstake
        .reduce((a, b) => a.add(b.ticket.totalUnstaked), new anchor.BN(0.0))
        .div(ANCHOR_BN.BASE_9)
      const txnSig = await walletContext.sendTransaction(new Transaction().add(txn), connection).catch((err) => {
        console.log(err)
        return ''
      })

      await confirmTransaction(stakeRewards.connection, txnSig, 'confirmed')
        .then(() => {
          notify({
            message: Notification(
              'Magic!',
              false,
              <div>
                <p>
                  You’ve successfully unstaked {totalUnstaked.toString()} GOFX. Continue the journey with us to
                  harvest more rewards.
                </p>
              </div>
            ),
            type: 'success'
          })
        })
        .catch((err) => {
          console.log('unstake-failed', err)
          notify({
            message: Notification(
              'Unstake failed!',
              true,
              <div>
                <p>{err.msg}</p>
              </div>
            ),
            type: 'error'
          })
        })
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
export { Notification }
