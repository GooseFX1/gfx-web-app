import { ADDRESSES } from './web3'
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

export const CURRENT_SUPPORTED_TOKEN_LIST = ['SOL', 'USDC', 'SRM', 'ETH', 'GMT', 'mSOL']
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
  REJECT_PROJECT: 'REJECT_PROJECT'
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

export const TOKEN_BLACKLIST = [
  'totCSh2TfEPTRovc4rMGz1ezukAdPxYWzh9jnXppeqY',
  '6hQpbdmmX6gXGUkmjJ82UtfFBzyTP3Hiqv1KZMtHWXpv',
  'ES4isqfcWbeBZwtH2eLRjk5oUzaMyZZrW2uhDM6yde6h',
  'FJtaAZd6tXNCFGTq7ifRHt9AWoVdads6gWNc4SXCPw1k',
  'GeJ3ZUT42ywiaj9jUJQr7XPpBWyrKgpmRsdaH6wamvJy',
  'CReAmEhV7CCMaQ8YCEc23SAY2ARXnXZQX7M2AkR5LRqw',
  '8RGdXex7StmeGsxmTcZDt37qhmtiRpDmHJDyCA97nhaY',
  '2QHx6MmrsAXSKLynJ55GofBbveYaDPLvn6qgdefey5za',
  'wmcSVkHBkGa9MH633Cs1BoPKD2FbuFe8bQBoRTnaEuv',
  'FDM3oFJ8tfr9VnZMFrFKvGLAUzaVhQyfgxv2YhkBjsBL',
  '2ueY1bLcPHfuFzEJq7yN1V2Wrpu8nkun9xG2TVCE1mhD',
  '64L6o4G2H7Ln1vN7AHZsUMW4pbFciHyuwn4wUdSbcFxh',
  'KeeXNee3oU933sbyAo9A1H71zT4ZWZrdrSMxnfDgvMk',
  '5Wc4U1ZoQRzF4tPdqKQzBwRSjYe8vEf3EvZMuXgtKUW6',
  'MSRMcoVyrFxnSgo5uXwone5SKcGhT1KEJMFEkMEWf9L',
  'H5K7BAvYMtkA6yw2ceQ9uhVNcSg821oYoiYZGiKWkWDT',
  'BRWmzjdY5dHgXsWRa7a3kuM22NEyDk6eAX8d7yx4bR7L',
  '3nGtw9cDwi8Nj81p2t53KxCQ8jjAdRScEX1yPSkwmcY6',
  'Ha8pzMaX6shu6N3pCehkGZ1nNuryUn24qh14xr4cgvYR',
  'EnuMQfSqi7vWq69yF2popGkBg2M7ioUxZ2snT9igkuff',
  '3G23ehQ6puSm6e29q7CN6uA1kMVpwiTsMWJb3KrE5RwC',
  '9AaKcdu5eymQwR19qwYFsqiqcXgL3iAxMQyshRpbqg6z',
  '9vagRqeuePiHniXNR6uGQbMYJabbjqKQsokL5QNPRXT8',
  'HavbxBPK1uY9kMNqKPkWDEQXWw6FYERrLxeMtWiXnwko',
  'FTtXEUosNn6EKG2SQtfbGuYB4rBttreQQcoWn1YDsuTq',
  'CW2sMRF3JJ7q8rqamJz3iZcdPRNiv3RYKDQ4LfKTkUm7',
  '8gYZZsmP1v2WEebzNL1gH12WYqAFcspVByWZ2ejuJMm5',
  '47WYC41xdUjs1ZghfppBRFGmC3ztzecHhdy51QyBXgLz',
  'SRYWvj5Xw1UoivpdfJN4hFZU1qbtceMvfM5nBc3PsRC',
  'CYCPEtrCYjNycxZiZ2RyeBBUqzsgRh7yGjn4SwX2AnPF',
  'JetNnLZpbECCfyeZSvJdgg5gf37QfCkPrp2X8XfmNWn',
  'iouQcQBAiEXe6cKLS85zmZxUqaCqBdeHFpqKoSz615u',
  'BWnE6wM3DYyVCMHxsiSxKfNwrJy4G6kcKpSYESGxZWKf'
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

export const generateListOfSSLTokens = (network): any => {
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
