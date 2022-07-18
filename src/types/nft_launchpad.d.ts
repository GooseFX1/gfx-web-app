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
    numberOfItems: number
    currency: currency
    mintPrice: number
    image: File
  } | null
  3: {
    vesting: vesting
    date: string
    time: string
  } | null
  4: {
    delayedReveal: boolean
    uploadedFiles: File
  } | null
  5: {
    discord: string
    website?: string
    twitter: string
    roadmap: { heading: string; subHeading: string }[] | null
    team: { name: string; twitterUsername: string; dp_url?: null | string }[] | [] | null
  } | null
}

export type nonceStatus = 'completed' | 'inProgress' | null
