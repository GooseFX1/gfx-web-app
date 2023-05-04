import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useCallback, useEffect, useReducer } from 'react'

export default function useRewards(): IUseRewards {
  const [earned, dispatch] = useReducer(reducer, initialState)
  const { wallet, connected } = useWallet()
  const { connection } = useConnection()

  useEffect(() => {
    if (!wallet || !connected) return
    // TOOD: fetch data from solana
    connection.getAccountInfo(wallet.adapter.publicKey)
    //TODO: dispatch data
    dispatch({ type: 'set_earned_symbol', payload: 'USDC' })
  }, [wallet, connected])
  const createAccount = useCallback(() => {
    //TODO: create account
  }, [])
  const closeAccount = useCallback(() => {
    //TODO: close account
  }, [])
  const stakeToken = useCallback((symbol: string, amount: number) => {
    //TODO: handle staking - generified for future proof
  }, [])
  const unstakeToken = useCallback((symbol: string, tokenContract: string) => {
    //TODO: handle unstaking
  }, [])
  const claimFees = useCallback((tokenContracts: string[]) => {
    //TODO: handle claiming fees
  }, [])
  const redeemTickets = useCallback((ticketContracts: string[]) => {
    //TODO: handle redeeming tickets
  }, [])
  const enterGiveaway = useCallback((giveawayContract: string) => {
    //TODO: handle entering giveaway
  }, [])
  return {
    earned,
    createAccount,
    closeAccount,
    stakeToken,
    unstakeToken,
    claimFees,
    redeemTickets,
    enterGiveaway
  }
}
interface IBaseClaim {
  totalClaimed: number
  claimable: number
}

interface IEarned extends IBaseClaim {
  symbol: string
  cooldown: number
  lastClaimed: number
  totalStaked: number
}

interface IReferred extends IBaseClaim {
  symbol: string
  referrals: string[]
}

interface IGiveaway extends IBaseClaim {
  // TODO: fill this in / should it extend base?
  someStateHere?: string
}

interface RewardState {
  earned: IEarned
  referred: IReferred
  giveaway: IGiveaway
}

const initialState: RewardState = {
  // TODO: state
  earned: {
    symbol: '',
    cooldown: 0,
    lastClaimed: 0,
    totalStaked: 0,
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
}

function reducer(state: RewardState, action) {
  switch (action.type) {
    // Initial Cases - allows for higher order setting
    case 'set_all':
      return action.payload
    case 'set_earned':
      state.earned = action.payload
      return state
    case 'set_referred':
      state.referred = action.payload
      return state
    case 'set_giveaway':
      state.giveaway = action.payload
      return state
    // Individual Cases - allows for finer grain setting
    case 'set_earned_symbol':
      state.earned.symbol = action.payload
      return state
    case 'set_earned_cooldown':
      state.earned.cooldown = action.payload
      return state
    case 'set_earned_last_claimed':
      state.earned.lastClaimed = action.payload
      return state
    case 'set_earned_total_staked':
      state.earned.totalStaked = action.payload
      return state
    case 'set_earned_total_claimed':
      state.earned.totalClaimed = action.payload
      return state
    case 'set_earned_claimable':
      state.earned.claimable = action.payload
      return state
    case 'set_referred_symbol':
      state.referred.symbol = action.payload
      return state
    case 'set_referred_referrals':
      state.referred.referrals = action.payload
      return state
    case 'set_referred_total_claimed':
      state.referred.totalClaimed = action.payload
      return state
    case 'set_referred_claimable':
      state.referred.claimable = action.payload
      return state
    //TODO: add giveaway unique -  cases
    default:
      console.warn('unknown action--->', action)
  }
}
interface IUseRewards {
  earned: IEarned
  createAccount: () => void
  closeAccount: () => void
  stakeToken: (symbol: string, amount: number) => void
  unstakeToken: (symbol: string, tokenContract: string) => void
  claimFees: (tokenContracts: string[]) => void
  redeemTickets: (ticketContracts: string[]) => void
  enterGiveaway: (giveawayContract: string) => void
}
