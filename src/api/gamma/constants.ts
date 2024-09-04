export const GAMMA_API_BASE = 'gamma-api'

export enum GAMMA_ENDPOINTS_V1 {
  CONFIG = '/config',
  STATS = '/stats',
  POOLS = '/pools',
  USER = `/user`,
  PORTFOLIO_STATS = `/portfolio-stats`,
  LP_POSITIONS = `/lp-positions`,
  TOKEN_LIST = '/token-list'
}

export const GAMMA_TOKENS = [
  {
    sourceToken: 'JITOSOL',
    targetToken: 'BONK',
    liquidity: '$5.17M',
    volume: '$111.18K',
    fees: '$50.21K',
    apr: 185,
    sourceTokenMintAddress: 'M1N4uXEQxqGNmFK5jgEcfUtHM1hz59vNNxtM48QK7Ar',
    sourceTokenMintDecimals: 6,
    targetTokenMintAddress: 'M1N3AoeSDNHXFB8hL7951Ubf77o9STpdz8W9VhqUT3L',
    targetTokenMintDecimals: 9,
    type: 'Hyper'
  },
  {
    sourceToken: 'SOL',
    targetToken: 'BONK',
    liquidity: 3.14,
    volume: 234.56,
    fees: 98.76,
    isOwner: false,
    apr: 431,
    sourceTokenMintAddress: 'So11111111111111111111111111111111111111112',
    sourceTokenMintDecimals: 9,
    targetTokenMintAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    targetTokenMintDecimals: 5,
    type: 'Hyper'
  },
  {
    sourceToken: 'SOL',
    targetToken: 'JITOSOL',
    liquidity: 2.71,
    volume: 345.67,
    fees: 122.33,
    isOwner: false,
    apr: 83,
    sourceTokenMintAddress: 'So11111111111111111111111111111111111111112',
    sourceTokenMintDecimals: 9,
    targetTokenMintAddress: 'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn',
    targetTokenMintDecimals: 9,
    type: 'Primary'
  },
  {
    sourceToken: 'SOL',
    targetToken: 'HXRO',
    liquidity: 1.62,
    volume: 456.78,
    fees: 145.67,
    isOwner: false,
    apr: 341,
    sourceTokenMintAddress: 'So11111111111111111111111111111111111111112',
    sourceTokenMintDecimals: 9,
    targetTokenMintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    targetTokenMintDecimals: 6,
    type: 'Hyper'
  },
  {
    sourceToken: 'MSOL',
    targetToken: 'USDC',
    liquidity: 123,
    volume: 567.89,
    fees: 168.92,
    isOwner: false,
    apr: 88,
    sourceTokenMintAddress: 'N4CdHcZYMj7DufSu89m1gi3RFxt8NiJQ9PmfNg8kc8P',
    sourceTokenMintDecimals: 9,
    targetTokenMintAddress: 'N5Y2m9HSPDBr8ft6UVWL4vLoaBfqPYawxhM1uEMx5Gk',
    targetTokenMintDecimals: 6,
    type: 'Primary'
  },
  {
    sourceToken: 'BONK',
    targetToken: 'USDT',
    liquidity: 4.99,
    volume: 678.90,
    fees: 192.34,
    isOwner: false,
    apr: 202,
    sourceTokenMintAddress: 'M1N29VNS1mEmqK83VyEyXcrJ6A39c2NB3NSCXJhXsiL',
    sourceTokenMintDecimals: 5,
    targetTokenMintAddress: 'm1n13267SbQXczvpsbWGEYw5pBEscGWoduJf5J1PVy7',
    targetTokenMintDecimals: 9,
    type: 'Hyper'
  },
  {
    sourceToken: 'BONK',
    targetToken: 'USDC',
    liquidity: 2.54,
    volume: 789.01,
    fees: 215.46,
    isOwner: false,
    apr: 164,
    sourceTokenMintAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    sourceTokenMintDecimals: 5,
    targetTokenMintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    targetTokenMintDecimals: 6,
    type: 'Hyper'
  },
  {
    sourceToken: 'USDC',
    targetToken: 'SOL',
    liquidity: 1.23,
    volume: 890.12,
    fees: 238.56,
    isOwner: false,
    apr: 387,
    sourceTokenMintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    sourceTokenMintDecimals: 6,
    targetTokenMintAddress: 'So11111111111111111111111111111111111111112',
    targetTokenMintDecimals: 9,
    type: 'Primary'
  }
]