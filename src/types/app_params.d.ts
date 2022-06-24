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
