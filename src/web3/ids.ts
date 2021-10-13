import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { PublicKey } from '@solana/web3.js'

export const ADDRESSES: {
  [network in WalletAdapterNetwork]: {
    pool: PublicKey
    seeds: {
      pools: {
        [pair: string]: PublicKey
      }
    }
    swap: PublicKey
  }
} = {
  'mainnet-beta': {
    pool: PublicKey.default,
    seeds: { pools: {} },
    swap: PublicKey.default
  },
  testnet: {
    pool: PublicKey.default,
    seeds: { pools: {} },
    swap: PublicKey.default
  },
  devnet: {
    pool: PublicKey.default,
    seeds: {
      pools: {
        'TKNA/TKNB': new PublicKey('Ga9vweHkkvxRVeadA3NRGx2RHfFs6w2t4hKRmBinQzYL')
      }
    },
    swap: new PublicKey('A4HxR7CUzKiudjCRWajsazoSNQ4YHGU5QvE3NgB6fRLd')
  }
}

export const TOKEN_A = '2uig6CL6aQNS8wPL9YmfRNUNcQMgq9purmXK53pzMaQ6'
export const TOKEN_B = '8FUPzLY58ojDaj5yh1MKwyJnGNhCDMbStbHNVkBQ9KjJ'
