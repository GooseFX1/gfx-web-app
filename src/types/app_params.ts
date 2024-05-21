import { EndPointName, PriorityFeeName } from '@/context'

type UserFarmConfig = {
  hasFarmOnboarded: boolean
  showDepositedFilter: boolean
}

export interface USER_CONFIG_CACHE {
  endpointName: EndPointName | null
  endpoint: string | null
  farm: UserFarmConfig
  hasSignedTC: boolean
  priorityFee: PriorityFeeName
}
