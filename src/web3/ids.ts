import { NATIVE_MINT } from '@solana/spl-token-v2'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { AccountInfo, PublicKey } from '@solana/web3.js'
import { SSLToken } from '../pages/FarmV3/constants'

export type Mint = {
  address: PublicKey
  decimals: number
  sslPool?: boolean
  name?: string
  controller?: PublicKey
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
    stable: SSLToken[]
    hyper: SSLToken[]
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
    }
  }
} = {
  'mainnet-beta': {
    sslPool: {
      SOL: {
        address: WRAPPED_SOL_MINT,
        decimals: 9,
        name: 'Solana'
      },
      USDC: {
        address: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
        decimals: 9,
        name: 'USDC Coin'
      },
      USDT: {
        address: new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'),
        decimals: 9,
        name: 'USDT'
      },
      ETH: {
        address: new PublicKey('7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs'),
        decimals: 9,
        name: 'Wrapped Ether (Wormhole)'
      }
    },
    stable: [
      {
        token: 'SOL',
        address: new PublicKey('So11111111111111111111111111111111111111112'),
        name: 'Solana'
      },
      {
        token: 'USDC',
        address: new PublicKey('BNWkCAoNdXmG6Z5jnscA64fjgpu9WSHdkhf7Nc6X6SPM'),
        name: 'USDC Coin'
      },
      {
        token: 'USDT',
        address: new PublicKey('6jjKDiFUohqfSk6KofB3xEG46ENASWpSvbaPUX7Tbqgq'),
        name: 'USDT'
      }
    ],
    hyper: [
      {
        token: 'ETH',
        address: new PublicKey('HsxJynHah88rWuJ3FeP4fPzyLDt8KDoPGJzsAP57T1Ba'),
        name: 'Wrapped Ether (Wormhole)'
      }
    ],
    mints: {
      GOFX: {
        address: new PublicKey('GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD'),
        decimals: 9
      },
      SOL: {
        address: WRAPPED_SOL_MINT,
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
      }
    }
  },
  devnet: {
    stable: [
      {
        token: 'SOL',
        address: new PublicKey('So11111111111111111111111111111111111111112'),
        name: 'Solana'
      },
      {
        token: 'USDC',
        address: new PublicKey('BNWkCAoNdXmG6Z5jnscA64fjgpu9WSHdkhf7Nc6X6SPM'),
        name: 'USDC Coin'
      },
      {
        token: 'USDT',
        address: new PublicKey('6jjKDiFUohqfSk6KofB3xEG46ENASWpSvbaPUX7Tbqgq'),
        name: 'USDT'
      }
    ],
    hyper: [
      {
        token: 'USDT',
        address: new PublicKey('GofVPcuBh2BzNexQ3BbfDGhxHboGGEf43q4vEq6hEzVs'),
        name: 'USDT'
      },
      {
        token: 'ETH',
        address: new PublicKey('HsxJynHah88rWuJ3FeP4fPzyLDt8KDoPGJzsAP57T1Ba'),
        name: 'Wrapped Ether (Wormhole)'
      }
    ],
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
    },
    pools: {},
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
      }
    }
  },
  testnet: {
    mints: {},
    pools: {},
    sslPool: {},
    stable: [
      {
        token: 'SOL',
        address: new PublicKey('So11111111111111111111111111111111111111112'),
        name: 'Solana'
      },
      {
        token: 'USDC',
        address: new PublicKey('BNWkCAoNdXmG6Z5jnscA64fjgpu9WSHdkhf7Nc6X6SPM'),
        name: 'USDC Coin'
      },
      {
        token: 'USDT',
        address: new PublicKey('6jjKDiFUohqfSk6KofB3xEG46ENASWpSvbaPUX7Tbqgq'),
        name: 'USDT'
      }
    ],
    hyper: [
      {
        token: 'USDT',
        address: new PublicKey('GofVPcuBh2BzNexQ3BbfDGhxHboGGEf43q4vEq6hEzVs'),
        name: 'USDT'
      },
      {
        token: 'ETH',
        address: new PublicKey('HsxJynHah88rWuJ3FeP4fPzyLDt8KDoPGJzsAP57T1Ba'),
        name: 'Wrapped Ether (Wormhole)'
      }
    ],
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
      }
    }
  }
}

const PubKeysInternedMap = new Map<string, PublicKey>()

export const toPublicKey = (key: string | PublicKey): PublicKey => {
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

export const pubkeyToString = (key: PublicKey | null | string = ''): string =>
  typeof key === 'string' ? key : key?.toBase58() || ''

export interface PublicKeyStringAndAccount<T> {
  pubkey: string
  account: AccountInfo<T>
}

export const WRAPPED_SOL_MINT = new PublicKey('So11111111111111111111111111111111111111112')

export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')

export const TOKEN_2022_PROGRAM_ID = new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb')

export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
)

export const MEMO_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr')

export const SYS_VAR_RENT = new PublicKey('SysvarRent111111111111111111111111111111111')

export const SYSTEM = new PublicKey('11111111111111111111111111111111')

export const GOFX_MINT = 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD'
export const GOFX_MINT_PUBKEY = new PublicKey(GOFX_MINT)

// SSL-V2 CONSTANTS

export const SSL_PREFIX = 'ssl'
export const LIQUIDITY_ACCOUNT_PREFIX = 'liquidity-account'
export const PT_MINT_PREFIX = 'pt-mint'
export const STAKE_PREFIX = 'staking'
export const POOL_REGISTRY_PREFIX = 'pool-registry'
export const SSL_POOL_SIGNER_PREFIX = 'ssl-pool-signer'
export const EVENT_EMITTER = 'event-emitter'
export const SSL_V2_ADMIN = '5JAm5YViPHY8rJz9FwNsa2LpW2y2JvjHn3e4wz3y7E9Z'

// STAKE CONSTANTS

export const STAKE_PROGRAM_ID = '8KJx48PYGHVC9fxzRRtYp4x4CM2HyYCm2EjVuAP4vvrx'

// AUCTION HOUSE CONSTANTS
export const TREASURY_MINT = new PublicKey('So11111111111111111111111111111111111111112')
export const TREASURY_MINT_WRAPPED_SOL = 'So11111111111111111111111111111111111111112'

// GooseFX
// TODO: When new goosefx-ssl-sdk is released, we can use the constants from there instead
export const GFX_CONTROLLER = new PublicKey(
  process.env.REACT_APP_NETWORK === 'devnet'
    ? 'FMqznan48D4hMvwKSSH5fMhZR3z3LRwDHoVAs3gEBB4S'
    : '8CxKnuJeoeQXFwiG6XiGY2akBjvJA5k3bE52BfnuEmNQ'
)
export const SSL_PROGRAM_ID = new PublicKey(
  process.env.REACT_APP_NETWORK === 'devnet'
    ? 'JYe7AcuQ7CqhkGvchJGvSKF8ei41FuDKb1h47qkbFNf'
    : '7WduLbRfYhTJktjLw5FDEyrqoEv61aTTCuGAetgLjzN5'
)
// GAMMA CONSTANTS:

export const GAMMA_PROGRAM_ID = 'GAMMA7meSFWaBXF25oSUgmGRwaW6sCMFLmBNiMSdbHVT'

export const GAMMA_FEE_ACCOUNT = '8PhehuioLjhJ35A5eavazJSwoXcA4J7WwzgoWDBDFSuY'

export const POOL_VAULT_SEED_PREFIX = 'pool_vault'

export const AUTHORITY_PREFIX = 'vault_and_lp_mint_auth_seed'

export const USER_POOL_LIQUIDITY_PREFIX = 'user-pool-liquidity'

export const AMM_CONFIG = 'amm_config'

export const POOL_SEED_PRFIX = 'pool'

export const OBSERVATION_PREFIX = 'observation'

export const REWARD_INFO_SEED = 'reward_info_seed'

export const REWARD_VAULT_SEED = 'reward_vault_seed'

export const PARTNER_INFOS_SEED = 'partner_infos'