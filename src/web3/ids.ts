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
      pythOracle: {
        address: PublicKey
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
        address: PublicKey.default,
        decimals: 9,
        type: 'crypto'
      },
      gUSD: {
        address: PublicKey.default,
        decimals: 2,
        type: 'synth'
      },
      gAAPL: {
        address: PublicKey.default,
        decimals: 8,
        type: 'synth'
      },
      gAMZN: {
        address: PublicKey.default,
        decimals: 8,
        type: 'synth'
      },
      gFB: {
        address: PublicKey.default,
        decimals: 8,
        type: 'synth'
      },
      gGOOG: {
        address: PublicKey.default,
        decimals: 8,
        type: 'synth'
      },
      gTSLA: {
        address: PublicKey.default,
        decimals: 8,
        type: 'synth'
      }
    },
    pools: {
      POOL_0: {
        address: PublicKey.default,
        listing: PublicKey.default,
        type: 'synth'
      }
    },
    programs: {
      pool: {
        address: PublicKey.default,
        controller: PublicKey.default,
        priceAggregator: PublicKey.default
      },
      pythOracle: {
        address: new PublicKey('AHtgzX45WTKfkPG53L6WYhGEXwQkN1BVknET3sVsLL8J')
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
      pythOracle: {
        address: PublicKey.default
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
        address: new PublicKey('EXceVxfi8hbEoDWMpYq621kTVvBi53oMXih3REnGG9o3'),
        decimals: 2,
        type: 'synth'
      },
      gAAPL: {
        address: new PublicKey('qUY4zvt1wk3qiMjF2F2J771AyLsYeeDTbBP7PbrNoD6'),
        decimals: 8,
        type: 'synth'
      },
      gBTC: {
        address: new PublicKey('Ab3umoUA2DHHRnaDFAF7qnZDFmr9DyHidLh8riaQGg2D'),
        decimals: 8,
        type: 'synth'
      },
      gETH: {
        address: new PublicKey('F3qSM2ZY9K4JsV1aj8wneTK8aP8QUa76sgpePB2bbqCK'),
        decimals: 8,
        type: 'synth'
      },
      gGOOG: {
        address: new PublicKey('3KGstBKxV3iX4ftPCLxt3Q3BEwAF8UueAMmLUDeZNwLa'),
        decimals: 8,
        type: 'synth'
      },
      gTSLA: {
        address: new PublicKey('DUYUVTVeTKXqbQCGq2jCegbNXv2LjP89DVuhPh6HgXRd'),
        decimals: 8,
        type: 'synth'
      }
    },
    pools: {
      POOL_0: {
        address: new PublicKey('8fCDoLwnNAMY2NArYkLGSNfpkk4VfGaxLJDx4f5CsZik'),
        listing: new PublicKey('E9kqgZ3PqbTEVnFKcTBEZwKS8BVE8cAyhWa9RstGSYTE'),
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
        address: new PublicKey('29S8DHSwXLSwTSj25Tdx8Q8vAVqAmZ1TycnJYLp3owk5'),
        controller: new PublicKey('FCngovJKv3V4QdHVaxY1dKE8EJsE7dLJB6Z6ANZUQr9E'),
        priceAggregator: new PublicKey('DzmwQxTM53FvY5HBUQzRdaAsL6bgQ1R1gePqmPvGnYee')
      },
      pythOracle: {
        address: new PublicKey('BmA9Z6FjioHJPpjT39QazZyhDRUdZy2ezwx4GiDdE2u2')
      },
      swap: {
        address: new PublicKey('A4HxR7CUzKiudjCRWajsazoSNQ4YHGU5QvE3NgB6fRLd')
      }
    }
  }
}

export const GOFX = '2uig6CL6aQNS8wPL9YmfRNUNcQMgq9purmXK53pzMaQ6'
export const TOKEN_B = '8FUPzLY58ojDaj5yh1MKwyJnGNhCDMbStbHNVkBQ9KjJ'
