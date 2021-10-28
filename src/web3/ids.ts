import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { PublicKey } from '@solana/web3.js'

export const SYNTH_DEFAULT_MINT = new PublicKey('11111111111111111111111111111111')

export type Mint = {
  address: PublicKey
  decimals: number
}

export type Pool = {
  address: PublicKey
  listing?: PublicKey
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
        address: new PublicKey('GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD'),
        decimals: 9
      },
      gUSD: {
        address: PublicKey.default,
        decimals: 2
      },
      gAAPL: {
        address: PublicKey.default,
        decimals: 8
      },
      gAMZN: {
        address: PublicKey.default,
        decimals: 8
      },
      gFB: {
        address: PublicKey.default,
        decimals: 8
      },
      gGOOG: {
        address: PublicKey.default,
        decimals: 8
      },
      gTSLA: {
        address: PublicKey.default,
        decimals: 8
      }
    },
    pools: {
      CRYPTO: {
        address: PublicKey.default,
        listing: PublicKey.default,
        type: 'synth'
      },
      STOCK: {
        address: PublicKey.default,
        listing: PublicKey.default,
        type: 'synth'
      },
      'GOFX/TKNB': {
        address: PublicKey.default,
        type: 'crypto'
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
        decimals: 9
      },
      gUSD: {
        address: new PublicKey('DCLDuMH8B97Vri5x6yHjrFjEWAZeeZarhCzV2KKbEcvw'),
        decimals: 2
      },
      gBTC: {
        address: new PublicKey('6WAa7ppJD7QAExhse21XUjFcYn9utTYEzPMvMpjea3pM'),
        decimals: 8
      },
      gETH: {
        address: new PublicKey('89wbRM3MCCoTuTzFK4UNWG1vsd4iqadxHTjGiHZ7kc5Q'),
        decimals: 8
      },
      gMNGO: {
        address: new PublicKey('BJUGa4AGbuvWix35UZcdkfKZHnr94d5n67aVqTJqH4vX'),
        decimals: 8
      },
      gDOGE: {
        address: new PublicKey('FyJmXCfvKX1Q4zifMBcvYAdqEiUbeZWoSvAkuiy7BEyL'),
        decimals: 8
      },
      gSABER: {
        address: new PublicKey('7BCgsMbDakNHx7Mb7ErJykE3eTzqjwYsDvJMGVia9Ff3'),
        decimals: 8
      },
      gRAY: {
        address: new PublicKey('BVneTUZCE9ePHUATdtwin3PjS1n9QQ1QzMZWf7CJPfyW'),
        decimals: 8
      },
      gCOPE: {
        address: new PublicKey('5axcoFsk588MaS4CE5D1KFFDsExowzMjKVHFyHZvcdRG'),
        decimals: 8
      },
      gBNB: {
        address: new PublicKey('C4a5suEMGogxkJVwGzam9yUgxyQ3pLFXESLqjwHg1Vwc'),
        decimals: 8
      },
      gFTT: {
        address: new PublicKey('88fcHMmVLEpp3kHTUDki1QBMdfzTfxNaN6awCniSbPTN'),
        decimals: 8
      },
      gLUNA: {
        address: new PublicKey('DztJtx4Zjz4bTpnno4R6DXQ7twA8DLPEFm1DY3qYC4Zd'),
        decimals: 8
      },
      gSOL: {
        address: new PublicKey('BeRxNUMoa3Q66hhsacUu6nJcApJt3dzCAFFpYvFWeVPk'),
        decimals: 8
      },
      gSRM: {
        address: new PublicKey('Fg4E5t5Vbt8QzG7Uy7U1H6r6MHduLtEwP9FVZUMeScai'),
        decimals: 8
      },
      gAAPL: {
        address: new PublicKey('qUY4zvt1wk3qiMjF2F2J771AyLsYeeDTbBP7PbrNoD6'),
        decimals: 8
      },
      gTSLA: {
        address: new PublicKey('5vRDUMS4B1Gsxu79NL2NfQqPf365urokq6SCHbgqtgTU'),
        decimals: 8
      },
      gGME: {
        address: new PublicKey('HuyZCb7rHHucRxFJX9eg9B6THpbywgYuEHXGbCVhFqgG'),
        decimals: 8
      },
      gSPY: {
        address: new PublicKey('7VY2Hp3CJjRLn27xW6EmjzuDyf7wYpbrrBYKobBQEKCw'),
        decimals: 8
      },
      gGE: {
        address: new PublicKey('CUeFGD4RDbb6Gh9KRCNQa75JmLS4MjxsWkd3waz7qHse'),
        decimals: 8
      },
      gAMC: {
        address: new PublicKey('DeStTq4cj3h2WC35CPwwcbn9VhAgdpey9xD9gbTt5FiU'),
        decimals: 8
      },
      gAMZN: {
        address: new PublicKey('2sV7HYKFvu3G8SWRsQMS4yuHCgU7pT8omJD6W6vFp5hY'),
        decimals: 8
      },
      gNFLX: {
        address: new PublicKey('GAKT9KGRT3uC641dcMqR6CLozDaSDkAddymFY3qWEjQR'),
        decimals: 8
      },
      gGOOG: {
        address: new PublicKey('BfJpBqRGqNeAsNTio4PDutmUyGsk4RGGi78BuaCjiuy'),
        decimals: 8
      },
      gQQQ: {
        address: new PublicKey('5L6yBfXZARi2UQVLkwnLqifYLcLXVEKSeBo6FR7kp2zg'),
        decimals: 8
      }
    },
    pools: {
      CRYPTO: {
        address: new PublicKey('Gi5j5JVxhsYhyek2yReiZTzUnj38dgh5phb9Ue3pWpMX'),
        listing: new PublicKey('F5xcJSy4c6MZvdPMoNHUPY7w6gV6pTAi3L6kRezbBwiM'),
        type: 'synth'
      },
      STOCK: {
        address: new PublicKey('L4mn5JMUBAKkuWbEv1YGP65eeJAE2Z4neVxMkT8ncEJ'),
        listing: new PublicKey('Bg8HQ2AN6vhjTL4Ht8jn18VFTZh1LTUuzPu1kg71vvkQ'),
        type: 'synth'
      },
      'GOFX/TKNB': {
        address: new PublicKey('Ga9vweHkkvxRVeadA3NRGx2RHfFs6w2t4hKRmBinQzYL'),
        type: 'crypto'
      }
    },
    programs: {
      pool: {
        address: new PublicKey('29S8DHSwXLSwTSj25Tdx8Q8vAVqAmZ1TycnJYLp3owk5'),
        controller: new PublicKey('FMqznan48D4hMvwKSSH5fMhZR3z3LRwDHoVAs3gEBB4S'),
        priceAggregator: new PublicKey('CbYdUPCnLko4p1qehuR21WgjuVCvTkaMoQhUeYyw1Z1y')
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
