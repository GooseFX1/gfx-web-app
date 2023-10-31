import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState
} from 'react'
import {
  ADDRESSES,
  GfxStakeRewards,
  GOFXVault,
  StakePool,
  UnstakeableTicket,
  UnstakeTicket,
  UserMetadata
} from 'goosefx-stake-rewards-sdk'
import * as anchor from '@project-serum/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import { useConnectionConfig } from './settings'
import { BN, Wallet } from '@project-serum/anchor'
import { Keypair, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js'
import { confirmTransaction } from '../web3'
import { notify } from '../utils'
import { Col, Row } from 'antd'
import styled from 'styled-components'
import { createAssociatedTokenAccountInstruction, getAssociatedTokenAddress } from '@solana/spl-token-v2'

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
  rewards: RewardState
  hasRewards: boolean
  initializeUserAccount: () => Promise<boolean>
  closeUserAccount: () => Promise<void>
  stake: (amount: number) => Promise<void>
  unstake: (amount: number) => Promise<void>
  claimFees: () => Promise<void>
  redeemUnstakingTickets: (ticketContracts: UnstakeableTicket[]) => Promise<void>
  enterGiveaway: (giveawayContract: string) => void
  getClaimableFees: () => number
  getUiAmount: (value: anchor.BN, isUsdc?: boolean) => number
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

function reducer(state: RewardState, action) {
  switch (action.type) {
    // Initial Cases - allows for higher order setting
    case 'setAll':
      return action.payload
    case 'setStaking':
      state.user.staking = action.payload
      return state
    case 'setReferred':
      state.user.referred = action.payload
      return state
    case 'setGiveaway':
      state.user.giveaway = action.payload
      return state
    case 'setStakePool':
      state.stakePool = action.payload
      return state
    case 'setGoFxVault':
      state.gofxVault = action.payload
      return state
    // Individual Cases - allows for finer grain setting
    case 'setUserMetadata':
      state.user.staking.userMetadata = action.payload
      return state
    case 'setStakingTotalClaimed':
      state.user.staking.totalClaimed = action.payload
      return state
    case 'setStakingClaimable':
      state.user.staking.claimable = action.payload
      return state
    case 'setReferralSymbol':
      state.user.referred.symbol = action.payload
      return state
    case 'setReferralReferrals':
      state.user.referred.referrals = action.payload
      return state
    case 'setReferredTotalClaimed':
      state.user.referred.totalClaimed = action.payload
      return state
    case 'setReferredClaimable':
      state.user.referred.claimable = action.payload
      return state
    //TODO: add giveaway unique -  cases
    default:
      console.warn('unknown action--->', action)
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
  const [userMetadata, stakePool, gofxVault, unstakingTickets] = await Promise.all([
    stakeRewards.getUserMetaData(wallet),
    stakeRewards.getStakePool(),
    stakeRewards.getGoFxVault(),
    stakeRewards.getUnstakingTickets(wallet)
  ])

  const unstakeableTickets = stakeRewards.getUnstakeableTickets(unstakingTickets)
  return {
    userMetadata,
    stakePool,
    gofxVault,
    unstakeableTickets
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
  const [rewards, dispatch] = useReducer(reducer, initialState)
  const walletContext = useWallet()
  const { network, connection } = useConnectionConfig()
  const getNetwork = useCallback(
    () => (network == 'mainnet-beta' || network == 'testnet' ? 'MAINNET' : 'DEVNET'),
    [network]
  )
  const [stakeRewards, setStakeRewards] = useState<GfxStakeRewards>(
    () => new GfxStakeRewards(connection, getNetwork(), new Wallet(Keypair.generate()))
  )

  useEffect(() => {
    const s = stakeRewards
    s.setConnection(connection, getNetwork())
    setStakeRewards(s)
  }, [connection, getNetwork])
  useEffect(() => {
    if (!walletContext?.publicKey) {
      return
    }
    console.log('fetching-rewards', walletContext?.publicKey?.toBase58())
    fetchAllRewardData(stakeRewards, walletContext?.publicKey)
      .then(async (data) => {
        const payload: RewardState = structuredClone(rewards)
        payload.user.staking.userMetadata = data.userMetadata
        payload.user.staking.unstakeableTickets = data.unstakeableTickets
        payload.user.staking.activeUnstakingTickets = data.userMetadata.unstakingTickets.filter(
          (ticket) => ticket.createdAt.toString() !== '0'
        )

        payload.stakePool = data.stakePool
        payload.gofxVault = data.gofxVault
        dispatch({ type: 'setAll', payload })
      })
      .catch((err) => {
        console.warn('fetch-all-reward-data-failed', err)
      })
  }, [walletContext.publicKey, connection, network])
  const updateStakeDetails = useCallback(async () => {
    const data = await fetchAllRewardData(stakeRewards, walletContext.publicKey)
    const payload: RewardState = structuredClone(rewards)
    payload.user.staking.userMetadata = data.userMetadata
    payload.user.staking.unstakeableTickets = data.unstakeableTickets
    payload.user.staking.activeUnstakingTickets = data.userMetadata.unstakingTickets.filter(
      (ticket) => ticket.createdAt.toString() !== '0'
    )
    payload.stakePool = data.stakePool
    payload.gofxVault = data.gofxVault
    dispatch({ type: 'setAll', payload })
  }, [stakeRewards, connection, network, walletContext.publicKey])

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
          .finally(() => updateStakeDetails())
      }
      if (!res) {
        return
      }
      const txn = new Transaction()
      txn.add(await callback())
      return txn
    },
    [stakeRewards, walletContext, rewards, getNetwork]
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
      .finally(() => updateStakeDetails())
  }, [stakeRewards, walletContext, confirmTransaction, connection, updateStakeDetails])
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
  }, [stakeRewards, connection, walletContext, updateStakeDetails])

  const stake = useCallback(
    async (amount: number) => {
      // console.log(amount)
      const stakeAmount = new anchor.BN(amount).mul(ANCHOR_BN.BASE_9)
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
        .finally(() => updateStakeDetails())
    },
    [stakeRewards, walletContext, confirmTransaction, connection, updateStakeDetails]
  )
  const unstake = useCallback(
    async (amount: number) => {
      const unstakeAmount = new anchor.BN(amount).mul(ANCHOR_BN.BASE_9)
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
        .finally(() => updateStakeDetails())
    },
    [stakeRewards, walletContext, connection, updateStakeDetails]
  )
  const getClaimableFees = useCallback((): number => {
    if (rewards.user.staking.userMetadata.totalStaked.isZero()) {
      return 0.0
    }

    return (
      ((rewards.stakePool.totalAccumulatedProfit.toString() -
        rewards.user.staking.userMetadata.lastObservedTap.toString()) *
        (rewards.user.staking.userMetadata.totalStaked.toString() / rewards.gofxVault.amount.toString())) /
      1e6
    )
  }, [
    rewards.user.staking.userMetadata.totalStaked,
    rewards.gofxVault.amount,
    rewards.stakePool.totalAccumulatedProfit,
    rewards.user.staking.userMetadata.lastObservedTap
  ])
  const claimFees = useCallback(async () => {
    const amount = getClaimableFees()

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
      .finally(() => updateStakeDetails())
  }, [stakeRewards, walletContext, connection, rewards, getClaimableFees])
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
        .finally(() => updateStakeDetails())
    },
    [stakeRewards, walletContext, updateStakeDetails]
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

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const v = value.toString() / base.toString()

    return v
  }, [])
  const hasRewards = useMemo(
    () => rewards?.user?.staking?.unstakeableTickets.length > 0 || getClaimableFees() > 0.0,
    [rewards?.user?.staking?.unstakeableTickets, getClaimableFees]
  )
  return (
    <RewardsContext.Provider
      value={{
        rewards,
        initializeUserAccount,
        closeUserAccount,
        stake,
        unstake,
        claimFees,
        redeemUnstakingTickets,
        enterGiveaway,
        getClaimableFees,
        getUiAmount,
        hasRewards
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
