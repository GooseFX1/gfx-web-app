import { ADDRESSES } from './web3'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'

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

export const CURRENT_SUPPORTED_TOKEN_LIST = ['SOL', 'USDC', 'SRM', 'ETH', 'GMT', 'mSOL', 'APT']
export let FARM_SUPPORTED_TOKEN_LIST = ['GOFX']
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

export const TOKEN_BLACKLIST = ['APTtJyaRX5yGTsJU522N4VYWg3vCvSb65eam5GrPT5Rt']
export const POPULAR_TOKENS = ['SOL', 'USDC', 'USDT', 'mSOL', 'GOFX']

export const SUPPORTED_TOKEN_LIST = [
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
]

export const NFT_MARKET_TRANSACTION_FEE = 1

export const stakeTokens = [
  {
    id: '0',
    image: 'GOFX',
    name: 'GOFX',
    earned: undefined,
    rewards: 100,
    liquidity: undefined,
    type: 'Staking',
    currentlyStaked: undefined,
    volume: -1
  }
]

export const generateListOfSSLTokens = (network: WalletAdapterNetwork): any => {
  const sslTokens = []
  const obj = ADDRESSES[network].sslPool
  FARM_SUPPORTED_TOKEN_LIST = ['GOFX']
  for (const key in obj) {
    FARM_SUPPORTED_TOKEN_LIST.push(key)
  }
  for (let i = 1; i < FARM_SUPPORTED_TOKEN_LIST.length; i++) {
    sslTokens.push({
      id: i + 1,
      image: FARM_SUPPORTED_TOKEN_LIST[i],
      name: FARM_SUPPORTED_TOKEN_LIST[i],
      earned: undefined,
      liquidity: undefined,
      type: 'SSL',
      currentlyStaked: undefined
    })
  }
  return sslTokens
}

export const NQ_GOFX_PRICE = 500
export const NQ_SOL_PRICE = 1
