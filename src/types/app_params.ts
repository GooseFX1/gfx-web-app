import { EndPointName, PriorityFeeName } from '@/context'

type UserFarmConfig = {
  hasFarmOnboarded: boolean
  showDepositedFilter: boolean
}

type UserGAMMAConfig = {
  hasGAMMAOnboarded: boolean
  showDepositedFilter: boolean
  showCreatedFilter: boolean
  docsBanner: boolean
  currentSort: string
  viewMode: 'row' | 'card'
  jtoRewardsBanner: boolean
}

type UserSWAPConfig = {
  slippage: number
}
type UserTokenFeedConfig = {
  enabledColumns: {
    social: boolean
    new: boolean
    migrated: boolean
  }
}
export interface USER_CONFIG_CACHE {
  hasDexOnboarded: boolean
  endpointName: EndPointName
  endpoint: string
  farm: UserFarmConfig
  gamma: UserGAMMAConfig
  tokenFeed: UserTokenFeedConfig
  hasSignedTC: boolean
  priorityFee: PriorityFeeName
  swap: UserSWAPConfig
}
