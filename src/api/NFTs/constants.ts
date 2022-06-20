export const NFT_API_BASE = 'nest-api'

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
  DRAFTS = '/nft_drafts'
}
