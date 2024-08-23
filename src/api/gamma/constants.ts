export const GAMMA_API_BASE = 'gamma-api'

export enum GAMMA_ENDPOINTS_V1 {
    CONFIG = '/config',
    STATS = '/stats',
    POOLS = '/pools',
    USER  = `/user`,
    PORTFOLIO_STATS = `/portfolio-stats`,
    LP_POSITIONS = `/lp-positions`
}

export const GAMMA_TOKENS = [
  {
    sourceToken: 'SOL',
    targetToken: 'USDC',
    liquidity: '$5.17M',
    volume: '$111.18K',
    fees: '$50.21K',
    isOwner: true,
    apr: 185,
    sourceTokenMintAddress: 'So11111111111111111111111111111111111111112',
    sourceTokenMintDecimals: 9,
    targetTokenMintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    targetTokenMintDecimals: 6,
    type: 'Primary'
  },
  {
    sourceToken: 'SOL',
    targetToken: 'BONK',
    liquidity: '$5.17M',
    volume: '$111.18K',
    fees: '$50.21K',
    isOwner: false,
    apr: 185,
    sourceTokenMintAddress: 'So11111111111111111111111111111111111111112',
    sourceTokenMintDecimals: 9,
    targetTokenMintAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    targetTokenMintDecimals: 5,
    type: 'Hyper'
  },
  {
    sourceToken: 'SOL',
    targetToken: 'JITOSOL',
    liquidity: '$5.17M',
    volume: '$111.18K',
    fees: '$50.21K',
    isOwner: false,
    apr: 185,
    sourceTokenMintAddress: 'So11111111111111111111111111111111111111112',
    sourceTokenMintDecimals: 9,
    targetTokenMintAddress: 'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn',
    targetTokenMintDecimals: 9,
    type: 'Primary'
  },
  {
    sourceToken: 'SOL',
    targetToken: 'HXRO',
    liquidity: '$5.17M',
    volume: '$111.18K',
    fees: '$50.21K',
    isOwner: false,
    apr: 185,
    sourceTokenMintAddress: 'So11111111111111111111111111111111111111112',
    sourceTokenMintDecimals: 9,
    targetTokenMintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    targetTokenMintDecimals: 6,
    type: 'Hyper'
  },
  {
    sourceToken: 'USDC',
    targetToken: 'SOL',
    liquidity: '$5.17M',
    volume: '$111.18K',
    fees: '$50.21K',
    isOwner: false,
    apr: 185,
    sourceTokenMintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    sourceTokenMintDecimals: 6,
    targetTokenMintAddress: 'So11111111111111111111111111111111111111112',
    targetTokenMintDecimals: 9,
    type: 'Primary'
  },
  {
    sourceToken: 'BONK',
    targetToken: 'SOL',
    liquidity: '$5.17M',
    volume: '$111.18K',
    fees: '$50.21K',
    isOwner: false,
    apr: 185,
    sourceTokenMintAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    sourceTokenMintDecimals: 5,
    targetTokenMintAddress: 'So11111111111111111111111111111111111111112',
    targetTokenMintDecimals: 9,
    type: 'Hyper'
  },
  {
    sourceToken: 'BONK',
    targetToken: 'USDC',
    liquidity: '$5.17M',
    volume: '$111.18K',
    fees: '$50.21K',
    isOwner: false,
    apr: 185,
    sourceTokenMintAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    sourceTokenMintDecimals: 5,
    targetTokenMintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    targetTokenMintDecimals: 6,
    type: 'Hyper'
  },
  {
    sourceToken: 'USDC',
    targetToken: 'SOL',
    liquidity: '$5.17M',
    volume: '$111.18K',
    fees: '$50.21K',
    isOwner: false,
    apr: 185,
    sourceTokenMintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    sourceTokenMintDecimals: 6,
    targetTokenMintAddress: 'So11111111111111111111111111111111111111112',
    targetTokenMintDecimals: 9,
    type: 'Primary'
  }
]