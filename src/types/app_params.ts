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
  viewMode: 'lite' | 'pro';
}
type UserSWAPConfig = {
  slippage: number
}
export interface USER_CONFIG_CACHE {
  hasDexOnboarded: boolean
  endpointName: EndPointName
  endpoint: string
  farm: UserFarmConfig
  gamma: UserGAMMAConfig
  hasSignedTC: boolean
  priorityFee: PriorityFeeName
  swap: UserSWAPConfig
}
