export interface IProjectParams {
  collectionId: string
  urlName: string
}

export interface ICreatorParams {
  walletAddress: string
}
type legality = 'author' | 'permission' | 'no'
type currency = 'SOL' | 'USDC'
type vesting = false | [50, 25, 25] | [40, 30, 30]

export interface ICreatorData {
  0: null
  1: {
    legality: legality
    projectName: string
    collectionName: string
    collectionDescription: string
  } | null
  2: {
    items: number
    currency: currency
    price: number
    image: string
  } | null
  3: {
    vesting: vesting
    date: string
    time: string
  } | null
  4: {
    delayedReveal: boolean
    uploadedFiles: string
  } | null
  5: {
    discord: string
    website?: string
    twitter: string
    roadmap: { heading: string; subHeading: string }[] | null
    team: { name: string; twitterUsername: string; dp_url?: null | string }[] | [] | null
  } | null
}
export interface INFTProjectConfig {
  collectionId: number
  collectionName: string
  coverUrl: string
  items: number
  price: 100
  startsOn: string
  status: string
  ended?: boolean | string
  currency: string
  whitelist: string
  tagLine?: string
  time?: string
  date?: string
}
export type nonceStatus = 'completed' | 'inProgress' | null
