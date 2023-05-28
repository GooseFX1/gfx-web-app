export const NFT_API_BASE = 'nest-api'

export enum NFT_PROFILE_OPTIONS {
  ALL = 'All',
  OFFERS = 'Offers',
  ON_SALE = 'Listed'
}
export enum TIMELINE {
  TWENTY_FOUR_H = '24H',
  THIRTY_D = '30D',
  SEVEN_D = '7D'
}
export enum NFT_COL_FILTER_OPTIONS {
  COLLECTION_NAME = 'CollectionName',
  FLOOR_PRICE = 'FloorPrice',
  DAILY_VOLUME = 'DailyVolume',
  WEEKLY_VOLUME = 'WeeklyVolume',
  MONTHLY_VOLUME = 'MonthlyVolume',
  TOTAL_VOLUME = 'TotalVolume',
  MARKET_CAP = 'MarketCap'
}
export enum NFT_ACTIVITY_ENDPOINT {
  WALLET_ADDRESS = 'wallet_address',
  MINT_ADDRESS = 'mint_address',
  COLLECTION_ADDRESS = 'collection_address'
}
export const NFT_VOLUME_OPTIONS = {
  '7D': 'WeeklyVolume',
  '30D': 'MonthlyVolume',
  '24H': 'DailyVolume',
  All: 'TotalVolume'
}

export enum NFT_MARKETS {
  TENSOR = 'TENSOR',
  MAGIC_EDEN = 'MAGIC_EDEN'
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
  NFTS_COLLECTION = '/nfts',
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
  ACTIVITY = '/activity',
  STATS = '/banner_stats',
  TENSOR_BUY = '/tensor/buy_tx'
}
