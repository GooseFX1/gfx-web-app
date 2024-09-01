import { SuccessClaimAll, SuccessSSLMessage, TransactionErrorMsgSSL } from '../../components'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import { GFX_LINK } from '../../styles'
import { truncateBigNumber } from '../../utils'

interface Message {
  type?: string
  message: string | JSX.Element
}

export type Faq = {
  question: string
  answer: string | JSX.Element
}

export type Pool = {
  index: number
  name: string
}

export type LiquidityAccount = {
  amountDeposited: BN
  createdAt: BN
  lastClaimed: BN
  lastObservedTap?: BN
  mint?: PublicKey
  owner?: PublicKey
  poolRegistry?: PublicKey
  space?: number[]
  totalEarned?: BN
}

export type SSLToken = {
  token: string
  name: string
  address: PublicKey
  assetType?: number
  bump?: number
  mathParams?: any
  mint?: PublicKey
  mintDecimals?: number
  oraclePriceHistories?: number[]
  pad0?: number[]
  pad1?: number[]
  space?: number[]
  status?: number
  totalAccumulatedLpReward?: BN
  totalLiquidityDeposits?: BN
  cappedDeposit?: number
}

export type SSLTableData = {
  apy: string
  fee: number
  volume: number
  totalVolume: number
}

export const poolType = {
  all: {
    index: 0,
    name: 'All'
  },
  primary: {
    index: 1,
    name: 'Primary'
  },
  hyper: {
    index: 2,
    name: 'Hyper'
  }
}

export const ADDRESSES: {
  [network in WalletAdapterNetwork]: SSLToken[]
} = {
  'mainnet-beta': [
    {
      token: 'SOL',
      name: 'Solana',
      address: new PublicKey('So11111111111111111111111111111111111111112'),
      cappedDeposit: 500000
    },
    {
      token: 'USDC',
      name: 'USDC coin',
      address: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
      cappedDeposit: 500000
    },
    {
      token: 'USDT',
      name: 'USDT Coin',
      address: new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'),
      cappedDeposit: 500000
    },
    {
      token: 'MSOL',
      name: 'MSOL',
      address: new PublicKey('mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So'),
      cappedDeposit: 500000
    },
    {
      token: 'BONK',
      name: 'BONK',
      address: new PublicKey('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'),
      cappedDeposit: 500000
    },
    {
      token: 'JITOSOL',
      name: 'Jito Staked SOL',
      address: new PublicKey('J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn'),
      cappedDeposit: 500000
    }
  ],
  devnet: [
    {
      token: 'USDT',
      name: 'USDT Coin',
      address: new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'),
      cappedDeposit: 500000
    },
    {
      token: 'USDC',
      name: 'USDC coin',
      address: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
      cappedDeposit: 500000
    },
    {
      token: 'SOL',
      name: 'Solana',
      address: new PublicKey('So11111111111111111111111111111111111111112'),
      cappedDeposit: 500000
    },
    {
      token: 'MSOL',
      name: 'MSOL',
      address: new PublicKey('mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So'),
      cappedDeposit: 500000
    },
    {
      token: 'BONK',
      name: 'BONK',
      address: new PublicKey('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'),
      cappedDeposit: 500000
    },
    {
      token: 'JITOSOL',
      name: 'Jito Staked SOL',
      address: new PublicKey('J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn'),
      cappedDeposit: 500000
    }
  ],
  testnet: [
    {
      token: 'USDT',
      name: 'USDT Coin',
      address: new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB')
    },
    {
      token: 'USDC',
      name: 'USDC coin',
      address: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
    },
    {
      token: 'SOL',
      name: 'Solana',
      address: new PublicKey('So11111111111111111111111111111111111111112')
    },
    {
      token: 'MSOL',
      name: 'MSOL',
      address: new PublicKey('mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So')
    },
    {
      token: 'BONK',
      name: 'BONK',
      address: new PublicKey('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263')
    }
  ]
}

export const faqs = [
  {
    question: 'What is a liquidity pool?',
    answer: (
      <div>
        Single-sided liquidity is a revolutionary AMM which allows you to deposit a single asset to earn yield. The
        yield is derived from the arbitrage profit from the spread between the quoted oracle and pool price and the
        swap fee.
      </div>
    )
  },
  {
    question: 'How do I add liquidity to a pool?',
    answer: (
      <div>
        APY is calculated based on the swap fees generated by the liquidity pools. The APY provides an indication
        of the potential returns that LPs might earn over a year from profit/loss of marketing making and
        arbitrage. It is calculated on a rolling three day basis and then annualized. The SSL system is designed so
        that impermanent loss doesn't occur, but because of the occasional exposure that the single sided pools get
        due to trading, there is some risk. We control the token exposure risk using thresholds and by updating the
        prices we quote in order to balance the trade-off between profitable market making and holding inventory.
        For more information see our{' '}
        <GFX_LINK
          href="https://docs.goosefx.io/features/farm/faq-ssl-v2"
          target="_blank"
          rel="noreferrer"
          fontSize={15}
        >
          docs
        </GFX_LINK>
        .
      </div>
    )
  },
  {
    question: 'What are impermanent losses?',
    answer: (
      <div>
        The distinction among stable, primary, and hyper pools lies in the types of assets they hold. Stable pools
        are composed of stablecoins, primary pools house prevalent ecosystem tokens, while hyper pools cater to
        more volatile assets.
      </div>
    )
  },
  {
    question: 'How can I withdraw liquidity from a pool?',
    answer: (
      <div>
        The risks associated with single-sided liquidity are price inventory risk which is common for any market
        maker. This risk occurs when the price of the assets used for market making decline in value in excess of
        the fees generated. In periods of high volatility certain pools may become imbalanced. While no actual
        losses occur users may have to wait until the pool rebalances itself to fully withdraw their total earned
        amount.
      </div>
    )
  },
  {
    question: 'How can I optimize yield farming strategies?',
    answer: <div>Fees and arbitrage profits are earned in the deposited asset.</div>
  },
  {
    question: 'What are slippage and liquidity depth?',
    answer: (
      <div>
        Please make sure you have the token in your wallet before withdrawing. For example, if you wish to withdraw
        BONK you need at least 1 BONK in your wallet to withdraw successfully.
      </div>
    )
  },
  {
    question: 'How are transaction fees calculated in liquidity pools?',
    answer: (
      <div>
        If a user comes in and deposits a large amount of liquidity, it leads to dilution of rewards further
        lowering your current rewards by a bit. We recommend claiming rewards at least once a day!
      </div>
    )
  },
  {
    question: 'Can I create custom pools with specific parameters?',
    answer: (
      <div>
        If a user comes in and deposits a large amount of liquidity, it leads to dilution of rewards further
        lowering your current rewards by a bit. We recommend claiming rewards at least once a day!
      </div>
    )
  }
]

export const SSL_TOKENS: {
  sourceToken: string
  targetToken: string
  liquidity: string
  volume: string
  fees: string
  apr: number
  sourceTokenMintAddress: string
  sourceTokenMintDecimals: number
  targetTokenMintAddress: string
  targetTokenMintDecimals: number
  type: string
}[] = [
  {
    sourceToken: 'USDT',
    targetToken: 'USDC',
    liquidity: '$5.17M',
    volume: '$111.18K',
    fees: '$50.21K',
    apr: 185,
    sourceTokenMintAddress: 'M1N29VNS1mEmqK83VyEyXcrJ6A39c2NB3NSCXJhXsiL',
    sourceTokenMintDecimals: 9,
    targetTokenMintAddress: 'm1n13267SbQXczvpsbWGEYw5pBEscGWoduJf5J1PVy7',
    targetTokenMintDecimals: 6,
    type: 'Primary'
  },
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
    targetToken: 'JITOSOL',
    liquidity: '$5.17M',
    volume: '$111.18K',
    fees: '$50.21K',
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
    apr: 185,
    sourceTokenMintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    sourceTokenMintDecimals: 6,
    targetTokenMintAddress: 'So11111111111111111111111111111111111111112',
    targetTokenMintDecimals: 9,
    type: 'Primary'
  }
]

export const ModeOfOperation = {
  DEPOSIT: 'Deposit',
  WITHDRAW: 'Withdraw'
}

export const insufficientSOLMsg = (): Message => ({
  type: 'error',
  message: 'You need minimum of 0.000001 SOL in your wallet to perform this transaction'
})

export const invalidDepositErrMsg = (tokenBalance: number | string, name: string): Message => ({
  type: 'error',
  message: `Please give valid input from 0.000001 to ${tokenBalance} ${name}`
})

export const invalidWithdrawErrMsg = (tokenBalance: number, name: string): Message => ({
  type: 'error',
  message: `You can withdraw a maximum of ${tokenBalance?.toFixed(3)} ${name}`
})

export const invalidInputErrMsg = (name: string): Message => ({
  type: 'error',
  message: `Please give valid input greater than 0.00001 ${name}`
})

export const genericErrMsg = (error: string): Message => ({
  type: 'error',
  message: error
})

export const depositCapError = (token: SSLToken, liquidity: number): Message => ({
  type: 'error',
  message: `You cannot deposit more than $${truncateBigNumber(token?.cappedDeposit - liquidity)} 
  ${token.token} because the ${token.token} pool is capped at $${truncateBigNumber(token?.cappedDeposit)}!`
})

export const claimAllSuccess = (): Message => ({
  message: <SuccessClaimAll />
})

export const sslSuccessfulMessage = (
  operation: string,
  price: string | number,
  name: string,
  wallet_name: string
): Message => ({
  message: <SuccessSSLMessage operation={operation} amount={price} token={name} wallet_name={wallet_name} />
})

export const sslErrorMessage = (): Message => ({
  type: 'error',
  message: <TransactionErrorMsgSSL />
})

export const GET_24_CHANGES = '/ssl-apis/get24hChanges'
export const TOTAL_VOLUME = 'ssl-apis/getTotalVolumeSSL'
export const TOTAL_FEES = 'ssl-apis/getTotalFeesSSL'
export const IS_WHITELIST = '/wallet-apis/isWhitelist'
export const SSL_CHARTS = '/ssl-apis/charts/prices/'
export const BONK_MINT = 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'
export const ALL_PAIRS = 'ssl-apis/getSSLPairs'
export const ALLOWED_WALLETS = [
  'DXuH9hNWkL7ev2rw9fyC9xG9jBfUkp3HBWuAaSAu4oKV',
  'HUko8TzqwEzhBceAKwHwKpoerUvYZ2zvLD88Rk3hF3uv',
  'CrFs1vtZ2gAtVsXLUEoesLPruLkpkhNRxSLKNTYfdzuC',
  'SmWd75HVb9tESGmvyAe7c1jGAB51SNtnQYMvA9Zs1X1',
  '3UkKMebXhKsGavP62sMW6ERD3zXHCFiL6RcwwnpK6ggf'
]
