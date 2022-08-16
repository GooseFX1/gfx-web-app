export const NFT_LAUNCHPAD_API_BASE = 'nest-api'

export enum NFT_LAUNCHPAD_API_ENDPOINTS {
  SESSION_USER = '/user',
  NFT_LAUNCHPAD_API_BASE = 'https://nft-launchpad.goosefx.io',
  GET_ALL_LAUNCHES = '/nft-launchpad/getAllLaunches',
  GET_SELECTED_LAUNCH = '/nft-launchpad/getOneLaunch',
  IS_CREATOR_ALLOWED = '/nft-launchpad/isUserAllowed',
  UPLOAD_FILES = '/nft-launchpad/uploadFiles',
  SAVE_DATA = '/nft-launchpad/saveData',
  SAVE_TRANSACTION = '/nft-launchpad/saveTransaction',
  APPROVE_PROJECT = '/nft-launchpad/approveProject',
  REJECT_PROJECT = '/nft-launchpad/rejectProject',
  IS_ADMIN_ALLOWED = '/nft-launchpad/isAdminAllowed',
  GET_CREATOR_PROJECT = '/nft-launchpad/getCreatorProjects',

  //trade apis but here since domain name same
  GET_TOKEN_INFO = '/dex-data/getTokenData'
}
