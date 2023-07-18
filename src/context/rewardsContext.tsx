import  {
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
import { GfxStakeRewards, GOFXVault, StakePool, UnstakeableTicket, UserMetadata } from 'goosefx-stake-rewards-sdk'
import * as anchor from '@project-serum/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import { useConnectionConfig } from './settings'
import { Wallet } from '@project-serum/anchor'
import { Keypair, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js'
import { confirmTransaction, signAndSendRawTransaction } from '../web3'
import { notify } from '../utils'
import { Col, Row } from 'antd'
import styled from 'styled-components'

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
  initializeUserAccount: () => Promise<void>
  closeUserAccount: () => Promise<void>
  stake: (amount: number) => Promise<void>
  unstake: (amount: number) => Promise<void>
  claimFees: () => Promise<void>
  redeemUnstakingTickets: (ticketContracts: UnstakeableTicket[]) => Promise<void>
  enterGiveaway: (giveawayContract: string) => void
  getClaimableFees: () => anchor.BN
  getUiAmount: (value: anchor.BN) => number
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
      unstakeableTickets: []
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
const Notification = (title: string, isError: boolean, description: ReactNode) => (
  <MESSAGE>
    <Row className="m-title" justify="space-between" align="middle">
      <Col>{title}</Col>
      <Col>
        <img
          className="m-icon"
          src={`/img/assets/${isError ? 'error-border-icon' : 'reward-notification-success'}.svg`}
          alt=""
        />
      </Col>
    </Row>
    {description}
    <div>
      <p>Rewards Program</p>
    </div>
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
  console.log(
    {
      TAP: rewards.stakePool.totalAccumulatedProfit.toString(),
      lTAP: rewards.user.staking.userMetadata.lastObservedTap.toString(),
      totalStaked: rewards.user.staking.userMetadata.totalStaked.toString(),
      lastClaimed: rewards.user.staking.userMetadata.lastClaimed.toString(),
      totalEarned: rewards.user.staking.userMetadata.totalEarned.toString(),
      unstakingTickets: rewards.user.staking.userMetadata.unstakingTickets,
      unstakeableTickets: rewards.user.staking.unstakeableTickets.map((t) => ({
        totalStaked: t.ticket.totalUnstaked.toString(),
        createdAt: t.ticket.createdAt.toString()
      }))
    },
    walletContext?.publicKey?.toBase58()
  )
  const [stakeRewards, setStakeRewards] = useState<GfxStakeRewards>(
    () => new GfxStakeRewards(connection, getNetwork(), new Wallet(Keypair.generate()))
  )
  const hasRewards = useMemo(() => rewards?.staking?.unstakeableTickets.length > 0, [rewards])
  useEffect(() => {
    const s = stakeRewards
    s.setConnection(connection, getNetwork())
    setStakeRewards(s)
  }, [connection, network])
  useEffect(() => {
    if (!walletContext?.publicKey) {
      return
    }
    console.log('fetching-rewards', walletContext?.publicKey?.toBase58())
    fetchAllRewardData(stakeRewards, walletContext?.publicKey)
      .then((data) => {
        const payload: RewardState = structuredClone(rewards)
        payload.user.staking.userMetadata = data.userMetadata
        payload.user.staking.unstakeableTickets = data.unstakeableTickets
        payload.stakePool = data.stakePool
        payload.gofxVault = data.gofxVault
        dispatch({ type: 'setAll', payload })
      })
      .catch((err) => {
        console.warn('fetch-all-reward-data-failed', err)
      })
  }, [walletContext.publicKey, connection, network])

  const checkForUserAccount = useCallback(
    async (callback: () => Promise<TransactionInstruction>): Promise<Transaction> => {
      const txn = new Transaction()
      if (!stakeRewards) {
        console.warn('stake rewards not loaded')
        return txn
      }
      const userMetadata: UserMetadata | null = await stakeRewards
        .getUserMetaData(walletContext.publicKey)
        .catch((err) => {
          console.log('get-user-metadata-failed', err)
          return null
        })

      if (userMetadata === null) {
        const ix = await stakeRewards.initializeUserAccount(null, walletContext.publicKey)
        console.log('init user account', ix)
        txn.add(ix)
      }
      console.log('check-for-user-account', userMetadata, txn)
      txn.add(await callback())
      return txn
    },
    [stakeRewards, walletContext]
  )

  const initializeUserAccount = useCallback(async () => {
    const txn: TransactionInstruction = await stakeRewards.initializeUserAccount(null, walletContext.publicKey)

    const txnSig = await signAndSendRawTransaction(
      stakeRewards.connection,
      new Transaction().add(txn),
      walletContext
    )

    await confirmTransaction(stakeRewards.connection, txnSig, 'confirmed')
      .then(() =>
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
      )
      .catch((err) => {
        console.log('initialize-failed', err)
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
      })
  }, [stakeRewards, walletContext, confirmTransaction])
  const closeUserAccount = useCallback(async () => {
    const txn: Transaction = await checkForUserAccount(() =>
      stakeRewards.closeUserAccount(null, walletContext.publicKey)
    )

    const txnSig = await signAndSendRawTransaction(stakeRewards.connection, txn, walletContext)
    await confirmTransaction(stakeRewards.connection, txnSig, 'confirmed')
      .then(() => {
        updateStakeDetails()
        notify({
          message: Notification(
            'Close successful!',
            false,
            <div>
              <p>Account closed</p>
            </div>
          ),
          type: 'success'
        })
      })
      .catch((err) => {
        console.log('close-failed', err)
        notify({
          message: Notification(
            'Close failed!',
            true,
            <div>
              <p>{err.msg}</p>
            </div>
          ),
          type: 'error'
        })
      })
  }, [stakeRewards])

  const stake = useCallback(
    async (amount: number) => {
      console.log(amount)
      const stakeAmount = new anchor.BN(amount).mul(ANCHOR_BN.BASE_9)
      const txn: Transaction = await checkForUserAccount(() =>
        stakeRewards.stake(stakeAmount, walletContext.publicKey)
      )
      const txnSig = await signAndSendRawTransaction(stakeRewards.connection, txn, walletContext)

      await confirmTransaction(stakeRewards.connection, txnSig, 'confirmed')
        .then(() => {
          updateStakeDetails()
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
    [stakeRewards, walletContext, confirmTransaction]
  )
  const updateStakeDetails = useCallback(async () => {
    const data = await fetchAllRewardData(stakeRewards, walletContext.publicKey)
    const payload: RewardState = structuredClone(rewards)
    payload.user.staking.userMetadata = data.userMetadata
    payload.user.staking.unstakeableTickets = data.unstakeableTickets
    payload.stakePool = data.stakePool
    payload.gofxVault = data.gofxVault
    dispatch({ type: 'setAll', payload })
  }, [stakeRewards])
  const unstake = useCallback(
    async (amount: number) => {
      const unstakeAmount = new anchor.BN(amount).mul(ANCHOR_BN.BASE_9)
      const txn: Transaction = await checkForUserAccount(() =>
        stakeRewards.unstake(unstakeAmount, walletContext.publicKey)
      )
      //const proposedEndDate = moment().add(7, 'days').calendar()
      const txnSig = await signAndSendRawTransaction(stakeRewards.connection, txn, walletContext)
      await confirmTransaction(stakeRewards.connection, txnSig, 'confirmed')
        .then(() => {
          updateStakeDetails()
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
    [stakeRewards, walletContext]
  )
  const claimFees = useCallback(async () => {
    const txn: Transaction = await checkForUserAccount(() => stakeRewards.claimFees(walletContext.publicKey))
    const amount = getClaimableFees()
    const txnSig = await signAndSendRawTransaction(stakeRewards.connection, txn, walletContext)
    await confirmTransaction(stakeRewards.connection, txnSig, 'confirmed')
      .then(() => {
        updateStakeDetails()
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
        console.log('unstake-failed', err)
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
  }, [stakeRewards, walletContext, connection, rewards])
  const redeemUnstakingTickets = useCallback(
    async (toUnstake: UnstakeableTicket[]) => {
      const txn: Transaction = await checkForUserAccount(
        async () =>
          await stakeRewards.resolveUnstakingTicket(
            toUnstake.map((ticket) => ticket.index),
            walletContext.publicKey
          )
      )
      const totalUnstaked = toUnstake
        .reduce((a, b) => a.add(b.ticket.totalUnstaked), new anchor.BN(0.0))
        .div(ANCHOR_BN.BASE_9)
      const txnSig = await signAndSendRawTransaction(stakeRewards.connection, txn, walletContext)
      await confirmTransaction(stakeRewards.connection, txnSig, 'confirmed')
        .then(() => {
          updateStakeDetails()
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
  const getClaimableFees = useCallback((): anchor.BN => {
    const userLastObservedDifference = rewards.stakePool.totalAccumulatedProfit.sub(
      rewards.user.staking.userMetadata.lastObservedTap
    )
    const gofxValutBN = new anchor.BN(rewards.gofxVault.amount)
    if (rewards.user.staking.userMetadata.totalStaked.isZero()) {
      return ANCHOR_BN.ZERO
    }
    //TODO: flip
    // (global.total_accumulated_profit - user.last_observied_tac) *
    // (user.staked_gofx / global.gofx_vault.amount)
    const userPortion = rewards.user.staking.userMetadata.totalStaked.div(gofxValutBN)
    const div1 = rewards.user.staking.userMetadata.totalStaked.divmod(gofxValutBN)
    const res = userLastObservedDifference
      .muln(parseFloat(`${div1.div.toString()}.${div1.mod.toString()}`))
      .divmod(ANCHOR_BN.BASE_9)
    const portion = new anchor.BN(parseFloat(`${res.div.toString()}.${res.mod.toString()}`))
    console.log({
      lastDif: userLastObservedDifference.toString(),
      gofxVault: gofxValutBN.toString(),
      userV: userPortion.toString(),
      div1: `${div1.div.toString()}.${div1.mod.toString()}`,
      res: `${res.div.toString()}.${res.mod.toString()}`,
      portion: portion
    })

    return portion
  }, [rewards])
  const getUiAmount = useCallback((value: anchor.BN, isUsdc?: boolean) => {
    const uiAmount = value.div(new anchor.BN(isUsdc ? ANCHOR_BN.BASE_6 : ANCHOR_BN.BASE_9)).toNumber()
    return uiAmount
  }, [])

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
