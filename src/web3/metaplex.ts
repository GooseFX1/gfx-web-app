const METADATA_PREFIX = 'metadata'
const METADATA_PROGRAM = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'

export type StringPublicKey = string

export enum MetadataKey {
  Uninitialized = 0,
  MetadataV1 = 4,
  EditionV1 = 1,
  MasterEditionV1 = 2,
  MasterEditionV2 = 6,
  EditionMarker = 7
}

export class Creator {
  address: StringPublicKey
  verified: boolean
  share: number

  constructor(args: { address: StringPublicKey; verified: boolean; share: number }) {
    this.address = args.address
    this.verified = args.verified
    this.share = args.share
  }
}

// TODO: Reconcile MetaplexMetadata and Metadata class
class MetaplexMetadata {
  key: MetadataKey
  updateAuthority: StringPublicKey
  mint: StringPublicKey
  data: Data
  primarySaleHappened: boolean
  isMutable: boolean
  editionNonce: number | null

  // set lazy
  masterEdition?: StringPublicKey
  edition?: StringPublicKey

  constructor(args: {
    updateAuthority: StringPublicKey
    mint: StringPublicKey
    data: Data
    primarySaleHappened: boolean
    isMutable: boolean
    editionNonce: number | null
  }) {
    this.key = MetadataKey.MetadataV1
    this.updateAuthority = args.updateAuthority
    this.mint = args.mint
    this.data = args.data
    this.primarySaleHappened = args.primarySaleHappened
    this.isMutable = args.isMutable
    this.editionNonce = args.editionNonce ?? null
  }
}

export class Data {
  name: string
  symbol: string
  uri: string
  sellerFeeBasisPoints: number
  creators: Creator[] | null
  constructor(args: {
    name: string
    symbol: string
    uri: string
    sellerFeeBasisPoints: number
    creators: Creator[] | null
  }) {
    this.name = args.name
    this.symbol = args.symbol
    this.uri = args.uri
    this.sellerFeeBasisPoints = args.sellerFeeBasisPoints
    this.creators = args.creators
  }
}

export { MetaplexMetadata, METADATA_PREFIX, METADATA_PROGRAM }
