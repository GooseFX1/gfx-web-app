import { WalletAdapter } from '@solana/wallet-adapter-base'
import { ENV as ChainId } from '@solana/spl-token-registry'
import { clusterApiUrl } from '@solana/web3.js'
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

type Endpoint = {
  name: ENDPOINT_NAME
  label: string
  url: string
  chainId: ChainId
}

export const ENDPOINTS: Array<Endpoint> = [
  {
    name: 'mainnet-beta',
    label: 'mainnet-beta',
    url: 'https://api.metaplex.solana.com/',
    chainId: ChainId.MainnetBeta
  },
  {
    name: 'testnet',
    label: 'testnet',
    url: clusterApiUrl('testnet'),
    chainId: ChainId.Testnet
  },
  {
    name: 'devnet',
    label: 'devnet',
    url: clusterApiUrl('devnet'),
    chainId: ChainId.Devnet
  }
]

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
