import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import React, { ReactNode, useCallback, useEffect, useReducer, useState } from 'react'
import { GfxStakeRewards, GOFXVault, StakePool, UnstakeableTicket, UserMetadata } from 'goosefx-stake-rewards-sdk'
import { useConnectionConfig } from '../context'
import { Keypair, Transaction, TransactionInstruction } from '@solana/web3.js'
import { notify } from '../utils'
import styled from 'styled-components'
import { Col, Row } from 'antd'
import moment from 'moment'
import * as anchor from '@project-serum/anchor'
import { signAndSendRawTransaction } from '../web3'
import { Wallet } from '@project-serum/anchor'

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
const fetchAllRewardData = async (stakeRewards: GfxStakeRewards) => {
  const [userMetadata, stakePool, gofxVault] = await Promise.all([
    stakeRewards.getUserMetaData(),
    stakeRewards.getStakePool(),
    stakeRewards.getGoFxVault()
  ])
  return {
    userMetadata,
    stakePool,
    gofxVault
  }
}
export default function useRewards(): IUseRewards {
  const [rewards, dispatch] = useReducer(reducer, initialState)
  const walletContext = useWallet()
  const { connection } = useConnection()
  const { network } = useConnectionConfig()
  const [stakeRewards, setStakeRewards] = useState<GfxStakeRewards | null>(null)

  useEffect(() => {
    if (!walletContext.connected || !walletContext.wallet) {
      return
    }
    const rewardNetwork = network == 'mainnet-beta' || network == 'testnet' ? 'MAINNET' : 'DEVNET'
    // anchor wallet not used
    const wallet = new Wallet(Keypair.generate())
    const stakeRewards = new GfxStakeRewards(connection, rewardNetwork, wallet)
    setStakeRewards(stakeRewards)
    fetchAllRewardData(stakeRewards).then((data) => {
      const payload = JSON.parse(JSON.stringify(rewards))
      payload.user.staking.userMetadata = data.userMetadata
      payload.stakePool = data.stakePool
      payload.gofxVault = data.gofxVault
      dispatch({ type: 'setAll', payload })
    })
  }, [walletContext, connection])
  const checkForUserAccount = useCallback(
    async (callback: () => Promise<TransactionInstruction>): Promise<Transaction> => {
      const userMetadata = await stakeRewards.getUserMetaData()
      const txn = new Transaction()
      if (!userMetadata) {
        txn.add(await stakeRewards.initializeUserAccount())
      }
      txn.add(await callback())
      return txn
    },
    [stakeRewards]
  )
  const initializeUserAccount = useCallback(async () => {
    const txn: TransactionInstruction = await stakeRewards.initializeUserAccount(null, walletContext.publicKey)
    signAndSendRawTransaction(stakeRewards.connection, new Transaction().add(txn), walletContext)
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
  }, [stakeRewards, walletContext])
  const closeUserAccount = useCallback(async () => {
    const txn: Transaction = await checkForUserAccount(() =>
      stakeRewards.closeUserAccount(null, walletContext.publicKey)
    )

    signAndSendRawTransaction(stakeRewards.connection, txn, walletContext)
      .then(() =>
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
      )
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
      const txn: Transaction = await checkForUserAccount(() => stakeRewards.stake(amount, walletContext.publicKey))
      signAndSendRawTransaction(stakeRewards.connection, txn, walletContext)
        .then(() =>
          notify({
            message: Notification(
              'Stake successful!',
              false,
              <Row>
                <Col>Amount:</Col>
                <Col>{amount.toFixed(2)} GOFX</Col>
              </Row>
            ),
            type: 'success'
          })
        )
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
    [stakeRewards, walletContext]
  )
  const unstake = useCallback(
    async (amount: number) => {
      const txn: Transaction = await checkForUserAccount(() =>
        stakeRewards.unstake(amount, walletContext.publicKey)
      )
      const proposedEndDate = moment().add(7, 'days').calendar()
      signAndSendRawTransaction(stakeRewards.connection, txn, walletContext)
        .then(() =>
          notify({
            message: Notification(
              'Cooldown started!',
              false,
              <>
                <div>Amount: {amount.toFixed(2)} GOFX</div>
                <div>End Date: {proposedEndDate}</div>
              </>
            )
          })
        )
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
    signAndSendRawTransaction(stakeRewards.connection, txn, walletContext)
      .then(() =>
        notify({
          message: Notification(
            'Fees claimed!',
            false,
            <>
              <div>Amount: {amount.toFixed(2)} USDC</div>
            </>
          )
        })
      )
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
  }, [stakeRewards, walletContext])
  const redeemUnstakingTickets = useCallback(async () => {
    const txn: Transaction = await checkForUserAccount(async () => {
      const unstakingTickets = await stakeRewards.getUnstakingTickets(walletContext.publicKey)
      const unstakeableTickets = stakeRewards.getUnstakeableTickets(unstakingTickets)
      return stakeRewards.resolveUnstakingTicket(
        unstakeableTickets.map((t) => t.index),
        walletContext.publicKey
      )
    })

    signAndSendRawTransaction(stakeRewards.connection, txn, walletContext)
      .then(() =>
        notify({
          message: Notification(
            'Unstake successful!',
            false,
            <div>
              <p>Amount: {rewards.earned.claimable.toFixed(2)} GOFX</p>
            </div>
          ),
          type: 'success'
        })
      )
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
  }, [stakeRewards, walletContext])
  const enterGiveaway = useCallback(
    (giveawayContract: string) => {
      //TODO: handle entering giveaway
      console.log('enter-giveaway', giveawayContract)
    },
    [stakeRewards]
  )
  const getClaimableFees = useCallback((): number => {
    if (!stakeRewards) return 0

    return (
      (rewards.stakePool.totalAccumulatedProfit.toNumber() -
        rewards.user.staking.userMetadata.lastObservedTap.toNumber()) *
      (rewards.user.staking.userMetadata.totalStaked.toNumber() / rewards.gofxVault.amount.toNumber())
    )
  }, [stakeRewards])

  return {
    rewards,
    initializeUserAccount,
    closeUserAccount,
    stake,
    unstake,
    claimFees,
    redeemUnstakingTickets,
    enterGiveaway,
    getClaimableFees
  }
}

interface BaseClaim {
  totalClaimed: number
  claimable: number
}

interface Rewards extends BaseClaim {
  userMetadata: UserMetadata
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

const initialState: RewardState = {
  // TODO: state
  user: {
    staking: {
      userMetadata: {
        accountOpenedAt: new anchor.BN(0.0),
        totalStaked: new anchor.BN(0.0),
        lastObservedTap: new anchor.BN(0.0),
        lastClaimed: new anchor.BN(0.0),
        totalEarned: new anchor.BN(0.0),
        unstakingTickets: []
      },
      totalClaimed: 0,
      claimable: 0
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
    totalAccumulatedProfit: new anchor.BN(0.0),
    protocolActivatedAt: new anchor.BN(0.0)
  },
  gofxVault: {}
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

interface IUseRewards {
  rewards: RewardState
  initializeUserAccount: () => Promise<void>
  closeUserAccount: () => Promise<void>
  stake: (amount: number) => Promise<void>
  unstake: (amount: number) => Promise<void>
  claimFees: () => Promise<void>
  redeemUnstakingTickets: (ticketContracts: UnstakeableTicket[]) => Promise<void>
  enterGiveaway: (giveawayContract: string) => void
  getClaimableFees: () => number
}
