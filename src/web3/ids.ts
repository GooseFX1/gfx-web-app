import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { PublicKey } from '@solana/web3.js'

export type Mint = {
  address: PublicKey
  decimals: number
  type: 'crypto' | 'synth'
}

export type Pool = {
  address: PublicKey
  listing: PublicKey
  type: 'crypto' | 'synth'
}

export const ADDRESSES: {
  [network in WalletAdapterNetwork]: {
    mints: {
      [token: string]: Mint
    }
    pools: {
      [pair: string]: Pool
    }
    programs: {
      pool: {
        address: PublicKey
        controller: PublicKey
        priceAggregator: PublicKey
      }
      swap: {
        address: PublicKey
      }
    }
  }
} = {
  'mainnet-beta': {
    mints: {
      GOFX: {
        address: new PublicKey('2uig6CL6aQNS8wPL9YmfRNUNcQMgq9purmXK53pzMaQ6'),
        decimals: 9,
        type: 'crypto'
      },
      gUSD: {
        address: PublicKey.default,
        decimals: 2,
        type: 'synth'
      }
    },
    pools: {
      POOL_A: {
        address: new PublicKey('4hkhVuQkpJJDhpvjEn65LmwuPnAZoMzjXdQ5FjW5KcpY'),
        listing: new PublicKey('QwtKuSQcz8rdY5T3ZBavkoFZev777rcJ1BFWe5KHvVW'),
        type: 'synth'
      }
    },
    programs: {
      pool: {
        address: PublicKey.default,
        controller: PublicKey.default,
        priceAggregator: PublicKey.default
      },
      swap: {
        address: PublicKey.default
      }
    }
  },
  testnet: {
    mints: {},
    pools: {},
    programs: {
      pool: {
        address: PublicKey.default,
        controller: PublicKey.default,
        priceAggregator: PublicKey.default
      },
      swap: {
        address: PublicKey.default
      }
    }
  },
  devnet: {
    mints: {
      GOFX: {
        address: new PublicKey('2uig6CL6aQNS8wPL9YmfRNUNcQMgq9purmXK53pzMaQ6'),
        decimals: 9,
        type: 'crypto'
      },
      gUSD: {
        address: new PublicKey('8e9DijtBDU1swHentbMS91z5NkuWe1xos9dLX7A2R39J'),
        decimals: 2,
        type: 'synth'
      },
      gAAPL: {
        address: new PublicKey('HeprdyqtmWbxk9DNkiaLJkZimKf2juTdT8VdHDDd6ZbC'),
        decimals: 8,
        type: 'synth'
      },
      gAMZN: {
        address: new PublicKey('4DLS3s4u4LEbDU1rT6h5qz5Gm58T6dJYHNNZpc9z887K'),
        decimals: 8,
        type: 'synth'
      },
      gFB: {
        address: new PublicKey('4DLS3s4u4LEbDU1rT6h5qz5Gm58T6dJYHNNZpc9z887K'),
        decimals: 8,
        type: 'synth'
      },
      gGOOGL: {
        address: new PublicKey('4DLS3s4u4LEbDU1rT6h5qz5Gm58T6dJYHNNZpc9z887K'),
        decimals: 8,
        type: 'synth'
      },
      gTSLA: {
        address: new PublicKey('4DLS3s4u4LEbDU1rT6h5qz5Gm58T6dJYHNNZpc9z887K'),
        decimals: 8,
        type: 'synth'
      }
    },
    pools: {
      POOL_A: {
        address: new PublicKey('4hkhVuQkpJJDhpvjEn65LmwuPnAZoMzjXdQ5FjW5KcpY'),
        listing: new PublicKey('QwtKuSQcz8rdY5T3ZBavkoFZev777rcJ1BFWe5KHvVW'),
        type: 'synth'
      },
      'GOFX/TKNB': {
        address: new PublicKey('Ga9vweHkkvxRVeadA3NRGx2RHfFs6w2t4hKRmBinQzYL'),
        listing: PublicKey.default,
        type: 'crypto'
      }
    },
    programs: {
      pool: {
        address: new PublicKey('Wo2kK51ruxwnM38VrqWSZCMjX1Mmcu4yBMcfg83Nufp'),
        controller: new PublicKey('Agf85Co1n9NTTzy36rGUen4kCEBzhvkKyks8rTLdVeP8'),
        priceAggregator: new PublicKey('pZ1frxrqntkZN2zCwRBS4Z6Ur3fFaCswvzUti57ukHw')
      },
      swap: {
        address: new PublicKey('A4HxR7CUzKiudjCRWajsazoSNQ4YHGU5QvE3NgB6fRLd')
      }
    }
  }
}

export const GOFX = '2uig6CL6aQNS8wPL9YmfRNUNcQMgq9purmXK53pzMaQ6'
export const TOKEN_B = '8FUPzLY58ojDaj5yh1MKwyJnGNhCDMbStbHNVkBQ9KjJ'
