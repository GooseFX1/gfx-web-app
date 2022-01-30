import { WalletAdapter } from '@solana/wallet-adapter-base'
import { PublicKey } from '@solana/web3.js'

export type ENDPOINT_NAME = 'mainnet-beta' | 'testnet' | 'devnet' | 'localnet' | 'lending'

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

export type StringPublicKey = string

export type Creator = {
  address: PublicKey
  verified: boolean
  share: number
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
