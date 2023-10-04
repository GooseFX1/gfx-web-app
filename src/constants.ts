import tw from 'twin.macro'

export const LITEPAPER_ADDRESS = 'https://docs.goosefx.io'
export const SOCIAL_MEDIAS: { [key: string]: string } = {
  discord: 'https://discord.gg/cDEPXpY26q',
  medium: 'https://medium.com/goosefx',
  telegram: 'https://www.t.me/goosefx',
  twitter: 'https://www.twitter.com/GooseFX1',
  nestquest: 'https://nestquest.io',
  nftCreatorForm:
    'https://docs.google.com/forms/d/e/1FAIpQLSeg1OzYlHdNqWiAEPl2QUZj7XwLvEpXAkGtWd4-H9SyyQe1DQ/viewform'
}

export const SOLSCAN_BASE = 'https://api.solscan.io'

export const SOL_TX_STATUS = {
  FINALIZED: 'finalized',
  PROCESSED: 'processed',
  CONFIRMED: 'confirmed'
}

export const CURRENT_SUPPORTED_TOKEN_LIST = new Set(['SOL', 'USDC', 'SRM', 'ETH', 'GMT', 'mSOL', 'APT'])
export const FARM_SUPPORTED_TOKEN_LIST = new Set(['GOFX'])
export const MODAL_TYPES = {
  FEES: 'FEES',
  REWARDS: 'REWARDS',
  GOLDEN_TICKET: 'GOLDEN_TICKET',
  NFT_MENU: 'NFT_MENU',
  CREATOR_DISCLAIMER: 'CREATOR_DISCLAIMER',
  SUBMIT: 'SUBMIT',
  RELAX: 'RELAX',
  APPROVE_PROJECT: 'APPROVE_PROJECT',
  REJECT_PROJECT: 'REJECT_PROJECT',
  NFT_AGG_WELCOME: 'NFT_AGG_WELCOME'
}
export const CAROUSEL = [
  { name: 'Create', id: 0, position: 1, redirect: 'NFTs/create' },
  { name: 'Sell', id: 1, position: 2, redirect: 'NFTs/profile' },
  { name: 'Launchpad', id: 2, position: 3, redirect: 'NFTs/launchpad' },
  { name: 'Fractionalization', id: 3, position: 4 },
  { name: 'Lend', id: 4, position: 5 },
  { name: 'Borrow', id: 5, position: 6 }
]
export const NETWORK_CONSTANTS = {
  DEVNET: 'devnet',
  MAINNET: 'mainnet-beta',
  DEVNET_SDK: 'DEVNET',
  MAINNET_SDK: 'MAINNET'
}
export const TOKEN_NAMES = {
  SOL: 'SOL',
  GOFX: 'GOFX',
  GMT: 'GMT',
  USDT: 'USDT',
  USDC: 'USDC'
}

export const TOKEN_BLACKLIST = new Set(['APTtJyaRX5yGTsJU522N4VYWg3vCvSb65eam5GrPT5Rt'])
export const POPULAR_TOKENS = new Set([
  'So11111111111111111111111111111111111111112',
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
  'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD'
])
//
export const SUPPORTED_TOKEN_LIST = new Set([
  'AKRO',
  'ALEPH',
  'BOP',
  'BTC',
  'COPE',
  'CREAM',
  'DXL',
  'ETH',
  'FIDA',
  'FRONT',
  'FTT',
  'GOFX',
  'GMT',
  'GST',
  'HGET',
  'HNT',
  'HXRO',
  'KARMA',
  'KEEP',
  'KIN',
  'LIKE',
  'LINK',
  'LUA',
  'MAPS',
  'MATH',
  'MEDIA',
  'MER',
  'MNGO',
  'MSRM',
  'mSOL',
  'OXY',
  'PAI',
  'PORT',
  'RAY',
  'ROPE',
  'SAMO',
  'SLRS',
  'SNY',
  'SOL',
  'SRM',
  'STEP',
  'SUSHI',
  'SWAP',
  'SXP',
  'TOMO',
  'TULIP',
  'UBXT',
  'UNI',
  'USDC',
  'USDT',
  'WOO',
  'XRP',
  'YFI',
  'GRT',
  'WAVES',
  'AUDIO',
  'REN',
  'C98',
  'MNGO',
  'RAMP',
  'FORGE',
  'SHDW',
  'ORCA',
  'SLND',
  'PRISM',
  'SLIM',
  'MER',
  'SLX',
  'SUNNY',
  'COPE',
  'SBR',
  'PORT',
  'DXL',
  'TULIP',
  'PRQ',
  'JET',
  'REN',
  'VLX',
  'KIN',
  'FIDA',
  'AURY',
  'ICHI',
  'ATLAS',
  'SWAG',
  'GENE'
])

export const NFT_MARKET_TRANSACTION_FEE = 0.1
export const NFT_MARKET_PLACE_FEES = {
  TENSOR: 1.4,
  MAGIC_EDEN: 1.5
}
export const GFX_APPRAISAL_ENABLED = false

export const USER_SOCIALS = {
  TWITTER: 'twitter.com/',
  DISCORD: 'discordapp.com/users/',
  TELEGRAM: 't.me/'
}
export const NQ_GOFX_PRICE = 500
export const NQ_SOL_PRICE = 1
export const LAMPORTS_PER_SOL = BigInt(1000000000)
export const LAMPORTS_PER_SOL_NUMBER = 1000000000
export const ZERO = BigInt(0)

export const TWIN_MACRO_ANIMATIONS = {
  slideInBottom: tw`animate-slideInBottom`
}
interface StateMachine {
  stateMachineName: string
  inputs: {
    theme: string
    [key: string]: string
  }
}
interface StateMachines {
  [key: string]: StateMachine
}
export interface RiveAnimation {
  src: string
  stateMachines: StateMachines
}
export interface RiveAnimations {
  [key: string]: RiveAnimation
}
export const RIVE_ANIMATION: RiveAnimations = {
  aggregator: {
    src: 'https://media.goosefx.io/webapp/nfts.riv',
    stateMachines: {
      'Aggregator Interactions': {
        stateMachineName: 'Aggregator Interactions',
        inputs: {
          theme: 'Theme',
          state: 'State'
        }
      }
    }
  },
  swap: {
    src: 'https://media.goosefx.io/webapp/swap.riv',
    stateMachines: {
      'Swap Interactions': {
        stateMachineName: 'Swap Interactions',
        inputs: {
          theme: 'Theme',
          state: 'State'
        }
      }
    }
  },
  dex: {
    src: 'https://media.goosefx.io/webapp/trade.riv',
    stateMachines: {
      'DEX Interactions': {
        stateMachineName: 'DEX Interactions',
        inputs: {
          theme: 'Theme',
          state: 'State'
        }
      }
    }
  },
  farm: {
    src: 'https://media.goosefx.io/webapp/farm.riv',
    stateMachines: {
      'Farm Interactions': {
        stateMachineName: 'Farm Interactions',
        inputs: {
          theme: 'Theme',
          state: 'State'
        }
      }
    }
  },
  referrals: {
    src: 'https://media.goosefx.io/webapp/referrals.riv',
    stateMachines: {
      Referrals: {
        stateMachineName: 'Referrals',
        inputs: {
          theme: 'Theme'
        }
      }
    }
  },
  rewards: {
    src: '/rive/rewards.riv',
    stateMachines: {
      Rewards: {
        stateMachineName: 'Rewards',
        inputs: {
          theme: 'Theme'
        }
      }
    }
  }
}
