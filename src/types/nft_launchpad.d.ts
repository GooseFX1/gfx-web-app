export interface IProjectParams {
  collectionId: string
  urlName: string
}

export interface ICreatorParams {
  walletAddress: string
}
type legality = 'author' | 'permission' | 'no'
type currency = 'SOL' | 'USDC'
type vesting = false | [50, 25, 25] | [40, 40, 40]

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
    pickDate: Date
  } | null
  4: {
    preReveal: boolean
  } | null
  5: {
    discord: string
    website?: string
    twitter: string
    roadmap: [
      heading: {
        title: string
        year: string
      },
      subHeading: string
    ]
    team: [name: string, twitterUsername: string]
  } | null
}
