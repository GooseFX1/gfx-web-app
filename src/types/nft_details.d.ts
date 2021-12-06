export interface IInfoItemData {
  thumbnail: string
  title: string
}

export interface IDetailTabItemData {
  title?: string
  value?: string
}

export interface ITradingHistoryTabItemData {
  id?: string
  price?: number
  event?: string
  from?: string
  to?: string
  date?: string
}

export interface IAttributesTabItemData {
  title?: string
  value?: string
}

export interface IRemainingPanelData {
  days: string
  hours: string
  minutes: string
}

export interface INFTDetailsGeneralData {
  image?: string
  type?: string
  isFavorite?: boolean
  hearts?: number
  remaining?: RemainingPanelTimeType
  name?: string
  price?: number
  fiat?: string
  isForCharity?: string
  percent?: string
  intro?: string
  creator?: IInfoItemData
  collection?: IInfoItemData
  category?: IInfoItemData
}

export type NFTDEtailsProviderMode =
  | 'live-auction-NFT'
  | 'my-created-NFT'
  | 'fixed-price-NFT'
  | 'open-bid-NFT'
  | 'mint-item-view'

export type MintItemViewStatus = '' | 'placed' | 'successful' | 'unsuccessful'
export interface INFTDetailsConfig {
  general: INFTDetailsGeneralData
  detailTab: IDetailTabItemData[]
  tradingHistoryTab: ITradingHistoryTabItemData[]
  attributesTab: IAttributesTabItemData[]
  fetchGeneral: (general) => void
  fetchDetailTab: (detailTab) => void
  fetchTradingHistoryTab: (tradingHistoryTab) => void
  fetchAttributesTab: (attributesTab) => void
}
