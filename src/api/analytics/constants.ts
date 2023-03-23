export const localhost = 'http://localhost:4000'
export const ANALYTICS_BASE = 'https://api-services.goosefx.io'
export const ANALYTICS_SUBDOMAIN = 'api-services'

export enum ANALYTICS_ENDPOINTS {
  GOFX_TOKEN = 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD',
  META_DATA = '/meta?token=',
  GET_LIQUIDITY = '/getLiquidityData',
  LOG_DATA = '/logData',
  GET_ALL_LAUNCHES = '/nft-launchpad/getAllLaunches',
  GET_SELECTED_LAUNCH = '/nft-launchpad/getOneLaunch',
  IS_CREATOR_ALLOWED = '/nft-launchpad/isUserAllowed',
  IS_ADMIN_ALLOWED = '/nft-launchpad/isAdminAllowed',
  GET_CREATOR_PROJECT = '/nft-launchpad/getCreatorProjects',
  GET_WORKING_RPC_ENDPOINT = '/getRPC'
}
