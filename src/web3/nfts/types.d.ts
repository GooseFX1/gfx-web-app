import { WalletAdapter } from '@solana/wallet-adapter-base'
import { MetadataKey } from '../metaplex'
export type ENDPOINT_NAME = 'mainnet-beta' | 'testnet' | 'devnet' | 'localnet' | 'lending'

export type ParsedAccount = {
  mint: string
  updateAuthority: string
  data: { creators: Creator[]; name: string; symbol: string; uri: string; sellerFeeBasisPoints: number }
  key: MetadataKey
  primarySaleHappened: boolean
  isMutable: boolean
  editionNonce: number
  masterEdition?: string
  edition?: string
}

export type WalletSigner = Pick<WalletAdapter, 'publicKey' | 'signTransaction' | 'signAllTransactions'>

interface PromiseFulfilledResult<T> {
  status: 'fulfilled'
  value: T
}

interface PromiseRejectedResult {
  status: 'rejected'
  reason: any
}

type PromiseSettledResult<T> = PromiseFulfilledResult<T> | PromiseRejectedResult
