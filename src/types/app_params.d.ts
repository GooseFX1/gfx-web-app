export interface IAppParams {
  collectionName: string
  nftId: string
  userAddress: string
  nftMintAddress: string
  draftId: string
}

export interface ILocationState {
  isCreatingProfile?: boolean
  newlyMintedNFT?: any
}

export interface RPC_CACHE {
  endpointName: string | null
  endpoint: string | null
  hasSignedTC: boolean
  hasDexOnboarded: boolean
  hasAggOnboarded: boolean
}
