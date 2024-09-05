import { SuccessClaimAll, SuccessSSLMessage, TransactionErrorMsgSSL } from '../../components'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'

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
export type JupToken = {
  "address": string,
  "name": string,
  "symbol": string,
  "decimals": number,
  "logoURI": string,
}

export type SSLTableData = {
  apy: string
  fee: number
  volume: number
  totalVolume: number
}

export const poolType = {
  primary: {
    index: 1,
    name: 'Primary'
  },
  hyper: {
    index: 2,
    name: 'Hyper'
  },
  migrate: {
    index: 3,
    name: 'Migrate'
  }
}

export const ADDRESSES: {
  [network in WalletAdapterNetwork]: {
      token: string
      name: string
      address: PublicKey
      cappedDeposit?: number
  }[]
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
    question: 'What is the difference between LITE and PRO mode on GAMMA?',
    answer: (
      <div>
        <p>Lite Mode, offers a simplified interface making it easier to deposit, withdraw, and claim rewards for new
          users.
          It’s designed for users who prefer a straightforward experience.</p> <br/>
        <p>Pro Mode, provides a more advanced interface, allowing you to track multiple pools at once, view detailed
          stats for each pool, and manage your entire portfolio. It’s ideal for users who want deeper insights and more
          control over their LP positions.
        </p>
      </div>
    )
  },
  {
    question: 'Which mode should I use, Lite or Pro?',
    answer: (
      <div>
        It depends on your needs. If you’re looking for simplicity and speed, Lite Mode is perfect. If you want to dive
        deeper into analytics and track multiple LP positions, Pro Mode is the way to go.
      </div>
    )
  },
  {
    question: 'What are the dynamic fee min and max ranges?',
    answer: (
      <div>
        The distinction among stable, primary, and hyper pools lies in the types of assets they hold. Stable pools are
        composed of stablecoins, primary pools house prevalent ecosystem tokens, while hyper pools cater to more
        volatile assets.
      </div>
    )
  },
  {
    question: 'What are the fees for depositing, withdrawing, claiming, and creating a pool?',
    answer: (
      <div>
        Deposit: None, Withdraw: None, Claim: None. Pool Creation: 0.2 SOL
      </div>
    )
  },
  {
    question: 'How often can I claim my LP rewards?',
    answer: <div>Whenever there is any pending yield that was earned from your LP position, you can claim.</div>
  }
]
export const faqsMigrate = [
  {
    question: 'What is migration?',
    answer: (
      <div>
        Migration allows you to transfer your existing LP positions from other AMMs on Solana, such as Raydium/Orca/etc.
        , directly to GAMMA.
      </div>
    )
  },
  {
    question: 'Can I partially migrate my LP position from other AMMs to GAMMA?',
    answer: (
      <div>
        No, partial migration isn’t supported. When you migrate an LP position, it is fully withdrawn from the other AMM
        and deposited into GAMMA.
      </div>
    )
  },
  {
    question: 'What happens to my pending yield on the AMM I migrate from?',
    answer: (
      <div>
        Any pending yield will remain on the original AMM. You’ll need to visit their site to claim it. Only the LP
        position is migrated to GAMMA.
      </div>
    )
  },
  {
    question: 'Which AMMs are supported for migration?',
    answer: (
      <div>
        Currently, GAMMA supports migration from Raydium and Orca pools.
      </div>
    )
  },
  {
    question: 'What is the lock-in period for migrated LP positions?',
    answer: <div>Migrated LP positions are locked for 2 days, during which they earn extra $GOFX rewards on selected
      pools. This is to prevent abuse from migrating back and forth and claiming extra $GOFX.
    </div>
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

// export const depositCapError = (token: JupToken, liquidity: number): Message => ({
//   type: 'error',
//   message: `You cannot deposit more than $${truncateBigNumber(token?.cappedDeposit - liquidity)}
//   ${token.token} because the ${token.token} pool is capped at $${truncateBigNumber(token?.cappedDeposit)}!`
// })

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
