type UserFarmConfig = {
  hasFarmOnboarded: boolean
  showDepositedFilter: boolean
}

export interface USER_CONFIG_CACHE {
  endpointName: string | null
  endpoint: string | null
  farm: UserFarmConfig
  hasSignedTC: boolean
}
