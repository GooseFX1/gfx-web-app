import { useWallet } from '@solana/wallet-adapter-react'
import React, { ReactNode, useCallback, useEffect, useReducer, useState } from 'react'
import { GfxStakeRewards, GOFXVault, StakePool, UnstakeableTicket, UserMetadata } from 'goosefx-stake-rewards-sdk'
import { useConnectionConfig } from '../context'
import { Connection, Keypair, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js'
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
export default function useRewards(): IUseRewards {
  const [rewards, dispatch] = useReducer(reducer, initialState)
  const walletContext = useWallet()
  const { network, connection, devnetConnection } = useConnectionConfig()
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
    fetchAllRewardData(stakeRewards, walletContext.publicKey)
      .then((data) => {
        const payload: RewardState = rewards
        payload.user.staking.userMetadata = data.userMetadata
        payload.user.staking.unstakeableTickets = data.unstakeableTickets
        payload.stakePool = data.stakePool
        payload.gofxVault = data.gofxVault
        dispatch({ type: 'setAll', payload })
      })
      .catch((err) => {
        console.warn('fetch-all-reward-data-failed', err)
      })
  }, [walletContext, connection, network, devnetConnection])
  const checkForUserAccount = useCallback(
    async (callback: () => Promise<TransactionInstruction>): Promise<Transaction> => {
      const userMetadata: UserMetadata | null = await stakeRewards
        .getUserMetaData(walletContext.publicKey)
        .catch((err) => {
          console.log('get-user-metadata-failed', err)
          return null
        })
      const txn = new Transaction()
      if (userMetadata == null) {
        txn.add(await stakeRewards.initializeUserAccount(null, walletContext.publicKey))
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

    await confirmTransaction(txnSig)
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

    const txnSig = await signAndSendRawTransaction(stakeRewards.connection, txn, walletContext)
    await confirmTransaction(txnSig)
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
  const confirmTransaction = useCallback(
    async (txnSig: string) => {
      const latestBlockHash = await stakeRewards.connection.getLatestBlockhash()
      await stakeRewards.connection.confirmTransaction(
        {
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: txnSig
        },
        'confirmed'
      )
    },
    [stakeRewards]
  )
  const stake = useCallback(
    async (amount: number) => {
      const txn: Transaction = await checkForUserAccount(() => stakeRewards.stake(amount, walletContext.publicKey))
      const txnSig = await signAndSendRawTransaction(stakeRewards.connection, txn, walletContext)

      await confirmTransaction(txnSig)
        .then(() => {
          updateStakeDetails()
          notify({
            message: Notification(
              'Stake successful!',
              false,
              <Row>
                <Col>Amount:</Col>
                <Col style={{ marginLeft: '4px' }}>{(amount / 1e9).toFixed(2)} GOFX</Col>
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
    [stakeRewards, walletContext]
  )
  const updateStakeDetails = useCallback(async () => {
    const data = await fetchAllRewardData(stakeRewards, walletContext.publicKey)
    const payload: RewardState = rewards
    payload.user.staking.userMetadata = data.userMetadata
    payload.user.staking.unstakeableTickets = data.unstakeableTickets
    payload.stakePool = data.stakePool
    payload.gofxVault = data.gofxVault
    dispatch({ type: 'setAll', payload })
  }, [stakeRewards])
  const unstake = useCallback(
    async (amount: number) => {
      const txn: Transaction = await checkForUserAccount(() =>
        stakeRewards.unstake(amount, walletContext.publicKey)
      )
      const proposedEndDate = moment().add(7, 'days').calendar()
      const txnSig = await signAndSendRawTransaction(stakeRewards.connection, txn, walletContext)
      await confirmTransaction(txnSig)
        .then(() => {
          updateStakeDetails()
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
    await confirmTransaction(txnSig)
      .then(() =>
        notify({
          message: Notification(
            'Fees claimed!',
            false,
            <>
              <div>Amount: {amount.toString()} USDC</div>
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
  const redeemUnstakingTickets = useCallback(
    async (toUnstake: UnstakeableTicket[]) => {
      const txn: Transaction = await checkForUserAccount(
        async () =>
          await stakeRewards.resolveUnstakingTicket(
            toUnstake.map((ticket) => ticket.index),
            walletContext.publicKey
          )
      )

      const txnSig = await signAndSendRawTransaction(stakeRewards.connection, txn, walletContext)
      await confirmTransaction(txnSig)
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
    },
    [stakeRewards, walletContext]
  )
  const enterGiveaway = useCallback(
    (giveawayContract: string) => {
      //TODO: handle entering giveaway
      console.log('enter-giveaway', giveawayContract)
    },
    [stakeRewards]
  )
  const getClaimableFees = useCallback((): anchor.BN => {
    const userLastObservedDifference = rewards.stakePool.totalAccumulatedProfit.sub(
      rewards.user.staking.userMetadata.lastObservedTap
    )
    const amount = new anchor.BN(rewards.gofxVault.amount)
    const userPortion = rewards.user.staking.userMetadata.totalStaked.div(amount)

    return userLastObservedDifference.mul(userPortion)
  }, [rewards])
  const getUiAmount = useCallback((value: anchor.BN) => {
    const uiAmount = value.div(new anchor.BN(1e9)).toNumber()
    return uiAmount
  }, [])
  return {
    rewards,
    initializeUserAccount,
    closeUserAccount,
    stake,
    unstake,
    claimFees,
    redeemUnstakingTickets,
    enterGiveaway,
    getClaimableFees,
    getUiAmount
  }
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
    totalAccumulatedProfit: new anchor.BN(0.0),
    protocolActivatedAt: new anchor.BN(0.0)
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

interface IUseRewards {
  rewards: RewardState
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
