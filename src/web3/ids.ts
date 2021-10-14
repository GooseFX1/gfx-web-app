import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { PublicKey } from '@solana/web3.js'

export const ADDRESSES: {
  [network in WalletAdapterNetwork]: {
    seeds: {
      pools: {
        [pair: string]: PublicKey
      }
    }
    swap: PublicKey
  }
} = {
  'mainnet-beta': {
    seeds: { pools: {} },
    swap: PublicKey.default
  },
  testnet: {
    seeds: { pools: {} },
    swap: PublicKey.default
  },
  devnet: {
    seeds: {
      pools: {
        'TKNA/TKNB': new PublicKey('Ga9vweHkkvxRVeadA3NRGx2RHfFs6w2t4hKRmBinQzYL')
      }
    },
    swap: new PublicKey('A4HxR7CUzKiudjCRWajsazoSNQ4YHGU5QvE3NgB6fRLd')
  }
}

export const SOLANA_REGISTRY_TOKEN_MINT = 'So11111111111111111111111111111111111111112'

export const TOKEN_A = '2uig6CL6aQNS8wPL9YmfRNUNcQMgq9purmXK53pzMaQ6'
export const TOKEN_B = '8FUPzLY58ojDaj5yh1MKwyJnGNhCDMbStbHNVkBQ9KjJ'
