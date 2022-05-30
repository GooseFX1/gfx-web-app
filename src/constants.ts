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

export const CURRENT_SUPPORTED_TOKEN_LIST = ['SOL', 'USDC']
export const FARM_SUPPORTED_TOKEN_LIST = ['GOFX']
export const MODAL_TYPES = {
  FEES: 'FEES',
  REWARDS: 'REWARDS'
}

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
    earned: -1,
    rewards: 100,
    liquidity: -1,
    type: 'Staking',
    currentlyStaked: -1,
    volume: '-'
  }
]

export const generateListOfSSLTokens = (): any => {
  const sslTokens = []
  const obj = ADDRESSES['mainnet-beta'].sslPool
  for (let key in obj) {
    FARM_SUPPORTED_TOKEN_LIST.push(key)
  }
  for (let i = 1; i < FARM_SUPPORTED_TOKEN_LIST.length; i++) {
    sslTokens.push({
      id: i + 1,
      image: FARM_SUPPORTED_TOKEN_LIST[i],
      name: FARM_SUPPORTED_TOKEN_LIST[i],
      earned: -1,
      liquidity: -1,
      type: 'SSL',
      currentlyStaked: -1
    })
  }
  return sslTokens
}

// ,
//   {
//     id: '4',
//     image: 'MSOL',
//     name: 'MSOL',
//     earned: 0,
//     apr: 0,
//     liquidity: 0,
//     type: 'SSL',
//     currentlyStaked: 0
//   }
