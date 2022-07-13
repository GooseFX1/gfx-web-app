import { ADDRESSES } from './web3'
export const LITEPAPER_ADDRESS: string = 'https://docs.goosefx.io'
export const SOCIAL_MEDIAS: { [key: string]: string } = {
  discord: 'https://discord.gg/cDEPXpY26q',
  medium: 'https://medium.com/goosefx',
  telegram: 'https://www.t.me/goosefx',
  twitter: 'https://www.twitter.com/GooseFX1',
  nestquest: 'https://nestquest.io',
  nftCreatorForm: 'https://docs.google.com/forms/d/e/1FAIpQLSeg1OzYlHdNqWiAEPl2QUZj7XwLvEpXAkGtWd4-H9SyyQe1DQ/viewform'
}

export const CURRENT_SUPPORTED_TOKEN_LIST = ['SOL', 'USDC', 'SRM', 'ETH', 'GMT', 'mSOL']
export let FARM_SUPPORTED_TOKEN_LIST = ['GOFX']
export const MODAL_TYPES = {
  FEES: 'FEES',
  REWARDS: 'REWARDS'
}
export const NETWORK_CONSTANTS = {
  DEVNET: 'devnet',
  MAINNET: 'mainnet-beta',
  DEVNET_SDK: 'DEVNET',
  MAINNET_SDK: 'MAINNET'
}
export const TOKEN_NAMES = {
  SOL: 'SOL',
  GOFX: 'GOFX',
  GMT: 'GMT'
}

export const TOKEN_BLACKLIST = [
  'totCSh2TfEPTRovc4rMGz1ezukAdPxYWzh9jnXppeqY',
  '6hQpbdmmX6gXGUkmjJ82UtfFBzyTP3Hiqv1KZMtHWXpv',
  'ES4isqfcWbeBZwtH2eLRjk5oUzaMyZZrW2uhDM6yde6h'
]

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
  'YFI'
]

export const NFT_MARKET_TRANSACTION_FEE: number = 1

export const stakeTokens = [
  {
    id: '0',
    image: 'GOFX',
    name: 'GOFX',
    earned: undefined,
    rewards: 100,
    liquidity: -1,
    type: 'Staking',
    currentlyStaked: -1,
    volume: '-'
  }
]

export const generateListOfSSLTokens = (network): any => {
  const sslTokens = []
  const obj = ADDRESSES[network].sslPool
  FARM_SUPPORTED_TOKEN_LIST = ['GOFX']
  for (let key in obj) {
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
