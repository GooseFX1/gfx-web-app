import { EndPointName, PriorityFeeName } from '@/context'

type UserFarmConfig = {
  hasFarmOnboarded: boolean
  showDepositedFilter: boolean
}

type UserGAMMAConfig = {
  hasGAMMAOnboarded: boolean
  showDepositedFilter: boolean
}

export interface USER_CONFIG_CACHE {
  hasDexOnboarded: boolean
  endpointName: EndPointName
  endpoint: string
  farm: UserFarmConfig
  gamma: UserGAMMAConfig
  hasSignedTC: boolean
  priorityFee: PriorityFeeName
}
