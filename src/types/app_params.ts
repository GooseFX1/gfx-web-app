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
  endpointName: EndPointName | null
  endpoint: string | null
  farm: UserFarmConfig
  gamma: UserGAMMAConfig
  hasSignedTC: boolean
  priorityFee: PriorityFeeName
}
