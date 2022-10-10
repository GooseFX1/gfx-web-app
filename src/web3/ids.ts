import { NATIVE_MINT } from '@solana/spl-token-v2'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { AccountInfo, PublicKey } from '@solana/web3.js'
import { StringPublicKey } from './metaplex'

export const SYNTH_DEFAULT_MINT = new PublicKey('So11111111111111111111111111111111111111112')

export type Mint = {
  address: PublicKey
  decimals: number
  sslPool?: boolean
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
    sslPool: {
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
      stake: {
        address: PublicKey
        controller?: PublicKey
        admin?: PublicKey
      }
      swap: {
        address: PublicKey
        controller?: PublicKey
      }
      ssl: {
        address: PublicKey
        controller?: PublicKey
      }
      nestquestSale: {
        address: PublicKey
        civic_gatekeeper: PublicKey
        sol_revenue: PublicKey
        gofx_revenue: PublicKey
        program_id: PublicKey
      }
    }
  }
} = {
  'mainnet-beta': {
    sslPool: {
      SOL: {
        address: SYNTH_DEFAULT_MINT,
        decimals: 9
      },
      USDC: {
        address: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
        decimals: 6
      },
      USDT: {
        address: new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'),
        decimals: 6
      },
      ETH: {
        address: new PublicKey('7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs'),
        decimals: 8
      },
      mSOL: {
        address: new PublicKey('mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So'),
        decimals: 9
      },
      SRM: {
        address: new PublicKey('SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt'),
        decimals: 6
      },
      GMT: {
        address: new PublicKey('7i5KKsX2weiTkry7jA4ZwSuXGhs5eJBEjY8vVxR4pfRx'),
        decimals: 9
      },
      stSOL: {
        address: new PublicKey('7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj'),
        decimals: 9
      },
      ORCA: {
        address: new PublicKey('orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE'),
        decimals: 6
      }
    },
    mints: {
      GOFX: {
        address: new PublicKey('GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD'),
        decimals: 9
      },
      SOL: {
        address: SYNTH_DEFAULT_MINT,
        decimals: 9,
        sslPool: true
      },
      USDC: {
        address: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
        decimals: 6,
        sslPool: true
      },

      ETH: {
        address: new PublicKey('7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs'),
        decimals: 8
      },
      mSOL: {
        address: new PublicKey('mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So'),
        decimals: 9
      },
      SRM: {
        address: new PublicKey('SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt'),
        decimals: 6
      },
      gUSD: {
        address: PublicKey.default,
        decimals: 6
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
      stake: {
        address: new PublicKey('8KJx48PYGHVC9fxzRRtYp4x4CM2HyYCm2EjVuAP4vvrx'),
        controller: new PublicKey('8CxKnuJeoeQXFwiG6XiGY2akBjvJA5k3bE52BfnuEmNQ'),
        admin: new PublicKey('9zmM8D5iwnzqc25n9zXZ4HfGcvM32xF99w3awCRPiUtN')
      },
      swap: {
        address: new PublicKey('JYe7AcuQ7CqhkGvchJGvSKF8ei41FuDKb1h47qkbFNf'),
        controller: new PublicKey('483AtY5eistVBBcXr9Tq2XH6MTrxCWfFRingputiZC2B')
      },
      ssl: {
        address: new PublicKey('7WduLbRfYhTJktjLw5FDEyrqoEv61aTTCuGAetgLjzN5'),
        controller: new PublicKey('8CxKnuJeoeQXFwiG6XiGY2akBjvJA5k3bE52BfnuEmNQ')
      },
      nestquestSale: {
        address: new PublicKey('EBNsQvZppDTRgcW6jc93QbEqFUm2aJRyxK4CEFhgQ3V8'),
        civic_gatekeeper: new PublicKey('ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6'),
        sol_revenue: new PublicKey('4puafxtL1437aibBy4pCteADWjja9aQvygD9LhkwRMG5'),
        gofx_revenue: new PublicKey('AfbSheiV3PJdA8ydTDQjGnQfHLafsqZJFkJp2iENWcGb'),
        program_id: new PublicKey('NQSGXu86wvXx88mvzhh9PfD3dJfGX3n1SdFdYacGX9H')
      }
    }
  },
  devnet: {
    sslPool: {
      USDC: {
        address: new PublicKey('USDhTjkUXFfigLELiFpbBnpLmEm4aXHvdY2kDSadJDH'),
        decimals: 9
      },
      ETH: {
        address: new PublicKey('ETHEUsA7cMt4z3GPeAJbK9B6NpTckrvzGBLUigsjQpFN'),
        decimals: 9
      },
      SOL: {
        address: new PublicKey(NATIVE_MINT),
        decimals: 9
      }
    },
    mints: {
      GOFX: {
        address: new PublicKey('2uig6CL6aQNS8wPL9YmfRNUNcQMgq9purmXK53pzMaQ6'),
        decimals: 9
      },
      gUSD: {
        address: new PublicKey('USDhTjkUXFfigLELiFpbBnpLmEm4aXHvdY2kDSadJDH'),
        decimals: 2
      },
      gBTC: {
        address: new PublicKey('6WAa7ppJD7QAExhse21XUjFcYn9utTYEzPMvMpjea3pM'),
        decimals: 8
      },
      gETH: {
        address: new PublicKey('ETHEUsA7cMt4z3GPeAJbK9B6NpTckrvzGBLUigsjQpFN'),
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
        address: new PublicKey('SoLrqFDDRzCazB7n6EeL7VbKjhvmNKRpnjQxea9HRTg'),
        decimals: 8
      },
      gSRM: {
        address: new PublicKey('Fg4E5t5Vbt8QzG7Uy7U1H6r6MHduLtEwP9FVZUMeScai'),
        decimals: 8
      },
      gAAPL: {
        address: new PublicKey('9sqW7s2oDvCw291grpzuRQ1Y4x38ABNVEqoCyyBZFpUv'),
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
      gAVAX: {
        address: new PublicKey('AVAXrcSeoZKHuiTH7MQPLz7xSuGa33DEkMmB3pUaBoct'),
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
      stake: {
        address: new PublicKey('3Gwyhoudx8XgYry8dzKQ2GGsofkUdm7VZUvddHxchL3x'),
        controller: new PublicKey('ApkmzBaTPUAeVj3QuqDcz6iLE6xZSLd29nke4McqrKw5'),
        admin: new PublicKey('Cir93Do3LGMYtYnbxpQAb5Gr5R5mS2c7gTS1AZkvYA3w')
      },
      swap: {
        address: new PublicKey('JYe7AcuQ7CqhkGvchJGvSKF8ei41FuDKb1h47qkbFNf'),
        controller: new PublicKey('ApkmzBaTPUAeVj3QuqDcz6iLE6xZSLd29nke4McqrKw5')
      },
      ssl: {
        address: new PublicKey('7WduLbRfYhTJktjLw5FDEyrqoEv61aTTCuGAetgLjzN5'),
        controller: new PublicKey('8CxKnuJeoeQXFwiG6XiGY2akBjvJA5k3bE52BfnuEmNQ')
      },
      nestquestSale: {
        address: new PublicKey('3QvkzDXSgrLmsCK5ZDoddPFL7tYjzC5oHiiA5TJ9NsoA'),
        civic_gatekeeper: new PublicKey('ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6'),
        sol_revenue: new PublicKey('4puafxtL1437aibBy4pCteADWjja9aQvygD9LhkwRMG5'),
        gofx_revenue: new PublicKey('8mYdcqseZ327gLW1b5Mr19srw6yMP7z2ZG6sNbq8R8G2'),
        program_id: new PublicKey('MKT2yrwL977mJwu9suRUBkckpnBShxtKN3ppasBseAb')
      }
    }
  },
  testnet: {
    mints: {},
    pools: {},
    sslPool: {},
    programs: {
      pool: {
        address: PublicKey.default,
        controller: PublicKey.default,
        priceAggregator: PublicKey.default
      },
      pythOracle: {
        address: PublicKey.default
      },
      stake: {
        address: PublicKey.default
      },
      swap: {
        address: PublicKey.default
      },
      ssl: {
        address: PublicKey.default
      },
      nestquestSale: {
        address: PublicKey.default,
        civic_gatekeeper: PublicKey.default,
        sol_revenue: PublicKey.default,
        gofx_revenue: PublicKey.default,
        program_id: PublicKey.default
      }
    }
  }
}

export class LazyAccountInfoProxy<T> {
  executable = false
  owner: StringPublicKey = ''
  lamports = 0

  get data() {
    //
    return undefined as unknown as T
  }
}

export interface LazyAccountInfo {
  executable: boolean
  owner: StringPublicKey
  lamports: number
  data: [string, string]
}

const PubKeysInternedMap = new Map<string, PublicKey>()

export const toPublicKey = (key: string | PublicKey) => {
  if (typeof key !== 'string') {
    return key
  }

  let result = PubKeysInternedMap.get(key)
  if (!result) {
    result = new PublicKey(key)
    PubKeysInternedMap.set(key, result)
  }

  return result
}

export const pubkeyToString = (key: PublicKey | null | string = '') =>
  typeof key === 'string' ? key : key?.toBase58() || ''

export interface PublicKeyStringAndAccount<T> {
  pubkey: string
  account: AccountInfo<T>
}

export const AR_SOL_HOLDER_ID = new PublicKey('6FKvsq4ydWFci6nGq9ckbjYMtnmaqAoatz5c9XWjiDuS')

export const WRAPPED_SOL_MINT = new PublicKey('So11111111111111111111111111111111111111112')

export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')

export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
)

export const BPF_UPGRADE_LOADER_ID = new PublicKey('BPFLoaderUpgradeab1e11111111111111111111111')

export const MEMO_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr')

export const METADATA_PROGRAM_ID = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as StringPublicKey

export const VAULT_ID = 'vau1zxA2LbssAUEF7Gpw91zMM1LvXrvpzJtmZ58rPsn' as StringPublicKey

export const AUCTION_ID = 'auctxRXPeJoc4817jDhf4HbjnhEcr1cCXenosMhK5R8' as StringPublicKey

export const METAPLEX_ID = 'p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98' as StringPublicKey

export const PACK_CREATE_ID = new PublicKey('packFeFNZzMfD9aVWL7QbGz1WcU7R9zpf6pvNsw2BLu')

export const ORACLE_ID = new PublicKey('rndshKFf48HhGaPbaCd3WQYtgCNKzRgVQ3U2we4Cvf9')

export const SYSTEM = new PublicKey('11111111111111111111111111111111')

// STAKE CONSTANTS

export const STAKE_PREFIX = 'GFX-STAKINGACCOUNT'

export const SSL_PREFIX = 'GFX-SSL'

export const LIQUIDITY_ACCOUNT_PREFIX = 'GFX-LIQUIDITYACCOUNT'

export const PT_MINT_PREFIX = 'GFX-SSL-PTMINT'

export const STAKE_PROGRAM_ID: StringPublicKey = '8KJx48PYGHVC9fxzRRtYp4x4CM2HyYCm2EjVuAP4vvrx'

// AUCTION HOUSE CONSTANTS
export const AUCTION_HOUSE_PREFIX = 'auction_house'

export const AUCTION_HOUSE_PROGRAM_ID: StringPublicKey = 'hausS13jsjafwWwGqZTUQRmWyvyxn9EQpqMwV1PBBmk'

export const AUCTION_HOUSE: StringPublicKey = '5GtAPDZWwnWRDjaTgjHDnvpiGBi9TbLVqRrggLH5Ztuv'

export const TREASURY_MINT: StringPublicKey = 'So11111111111111111111111111111111111111112'

export const AUCTION_HOUSE_AUTHORITY: StringPublicKey = '4puafxtL1437aibBy4pCteADWjja9aQvygD9LhkwRMG5'

export const AUCTION_HOUSE_CREATOR: StringPublicKey = '4puafxtL1437aibBy4pCteADWjja9aQvygD9LhkwRMG5'

export const AH_FEE_ACCT: StringPublicKey = 'JD8Jfejdfxq7KkRisP465aCrWkXGZ8JYqqPHCn9hz7Kc'

export const TREASURY_ACCT: StringPublicKey = '3wRqpyrETku2x2EZyfRKJeKVVb6F9J8HQLGcNf5VwuJ9'

export const FEE_PAYER_WITHDRAWAL_ACCT: StringPublicKey = '4puafxtL1437aibBy4pCteADWjja9aQvygD9LhkwRMG5'

export const TREASURY_WITHDRAWAL_ACCT: StringPublicKey = '4puafxtL1437aibBy4pCteADWjja9aQvygD9LhkwRMG5'

export const FEE_PAYER_BAL_GENESIS = 0

export const TREASURY_BAL_GENESIS = 0

export const SELLER_FEE_BASIS_POINTS = 100

export const REQUIRES_SIGN_OFF = false

export const CAN_CHANGE_SALE_PRICE = false

export const AH_BUMP = 253

export const AH_FEE_BUMP = 251

export const AH_TREASURY_BUMP = 255
