export interface IAppParams {
  collectionId: string
  nftId: string
  userId: string
  nftMintAddress: string
}

export interface ILocationState {
  isCreatingProfile?: boolean
  newlyMintedNFT?: any
}
