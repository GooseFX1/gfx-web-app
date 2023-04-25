export const NFT_API_BASE = 'nest-api'

export enum NFT_COL_FILTER_OPTIONS {
  COLLECTION_NAME = 'CollectionName',
  FLOOR_PRICE = 'FloorPrice',
  DAILY_VOLUME = 'DailyVolume',
  WEEKLY_VOLUME = 'WeeklyVolume',
  MONTHLY_VOLUME = 'MonthlyVolume',
  TOTAL_VOLUME = 'TotalVolume'
}
export enum NFT_ACTIVITY_ENDPOINT {
  WALLET_ADDRESS = 'wallet_address',
  MINT_ADDRESS = 'mint_address',
  COLLECTION_ADDRESS = 'collection_address'
}
export const NFT_VOLUME_OPTIONS = {
  '7d': 'WeeklyVolume',
  '30d': 'MonthlyVolume',
  '24h': 'DailyVolume',
  All: 'TotalVolume'
}
export enum NFT_API_ENDPOINTS {
  SESSION_USER = '/user',
  NON_SESSION_USER = '/user',
  USER_ACTIVITY = '/user-activity',
  ALL_COLLECTIONS = '/all-collections',
  ALL_LIKES = '/all-likes',
  FEATURED_COLLECTIONS = '/featured-collections',
  UPCOMING_COLLECTIONS = '/upcoming-collections',
  SINGLE_COLLECTION = '/collection',
  LIVE_AUCTIONS = '/live-auctions',
  OPEN_BID = '/open-bid',
  FIXED_PRICE = '/fixed-price',
  SINGLE_NFT = '/nft',
  SINGLE_ITEM = '/single-item',
  ALL_SINGLE_ITEM = '/all-single-items',
  BID = '/bid',
  ASK = '/ask',
  LIKE = '/like',
  ALL_USER_LIKES = '/all-likes',
  REWARDS = '/rewards',
  OWNERS = '/owners',
  DRAFTS = '/nft_drafts',
  SEARCH = '/search',
  ACTIVITY = '/activity'
}
