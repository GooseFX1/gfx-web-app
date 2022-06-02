export interface IAppParams {
  collectionId: string
  nftId: string
  userAddress: string
  nftMintAddress: string
}

export interface ILocationState {
  isCreatingProfile?: boolean
  newlyMintedNFT?: any
}
