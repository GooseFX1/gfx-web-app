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
type MinMaxFilter = {
  min?: string
  max?: string
}
export type UserTokenFeedFilterConfig = {
  volume: MinMaxFilter
  marketCap: MinMaxFilter
  bondingCurveProgress: MinMaxFilter
  age: MinMaxFilter
  holders: MinMaxFilter
  topHolders: MinMaxFilter
  enabledSocials: {
    x: boolean
    website: boolean
    telegram: boolean
  }
}
type UserTokenFeedConfig = {
  enabledColumns: {
    social: boolean
    new: boolean
    migrated: boolean
    soon: boolean
  },
  quickBuyAmount?: string,
  quickBuyToken?: string,
  columnFilters: {
    new: UserTokenFeedFilterConfig,
    migrated: UserTokenFeedFilterConfig,
    soon: UserTokenFeedFilterConfig
  },
  socialPanelTab: 'social' | 'performance',
  mobileSelectedColumn: 'new' | 'migrated' | 'soon',
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
