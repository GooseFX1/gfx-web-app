/* eslint-disable */
import { SuccessfulListingMsg, TransactionErrorMsg } from '../../components'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { PublicKey } from '@solana/web3.js'

interface Message {
  type?: string
  message: string | JSX.Element
}

export type SSLToken = {
  token: string
  address: PublicKey
  decimals: number
  name: string
  assetType?: number
}

export const PoolType = [
  {
    id: 1,
    pool: 'Primary'
  },
  {
    id: 2,
    pool: 'Secondary'
  },
  {
    id: 3,
    pool: 'Tertiary'
  }
]

export const ADDRESSES: {
  [network in WalletAdapterNetwork]: {
    primary: SSLToken[]
    stable: SSLToken[]
    hyper: SSLToken[]
  }
} = {
  'mainnet-beta': {
    primary: [
      {
        token: 'ETH',
        address: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
        decimals: 9,
        name: 'Wrapped Ether (Wormhole)'
      }
    ],
    stable: [
      {
        token: 'SOL',
        address: new PublicKey('So11111111111111111111111111111111111111112'),
        decimals: 9,
        name: 'Solana'
      },
      {
        token: 'MSOL',
        address: new PublicKey('mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So'),
        decimals: 9,
        name: 'MSOL'
      },
      {
        token: 'BONK',
        address: new PublicKey('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'),
        decimals: 5,
        name: 'BONK'
      },
      {
        token: 'USDT',
        address: new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'),
        decimals: 6,
        name: 'USDT Coin'
      },
      {
        token: 'USDC',
        address: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
        decimals: 6,
        name: 'USDC coin'
      }
    ],
    hyper: [
      {
        token: 'ETH',
        address: new PublicKey('HsxJynHah88rWuJ3FeP4fPzyLDt8KDoPGJzsAP57T1Ba'),
        decimals: 9,
        name: 'Wrapped Ether (Wormhole)'
      }
    ]
  },
  devnet: {
    primary: [
      {
        token: 'ETH',
        address: new PublicKey('HsxJynHah88rWuJ3FeP4fPzyLDt8KDoPGJzsAP57T1Ba'),
        decimals: 9,
        name: 'Wrapped Ether (Wormhole)'
      }
    ],
    stable: [
      {
        token: 'SOL',
        address: new PublicKey('So11111111111111111111111111111111111111112'),
        decimals: 9,
        name: 'Solana'
      },
      {
        token: 'USDC',
        address: new PublicKey('BNWkCAoNdXmG6Z5jnscA64fjgpu9WSHdkhf7Nc6X6SPM'),
        decimals: 9,
        name: 'USDC Coin'
      },
      {
        token: 'USDT',
        address: new PublicKey('6jjKDiFUohqfSk6KofB3xEG46ENASWpSvbaPUX7Tbqgq'),
        decimals: 9,
        name: 'USDT'
      }
    ],
    hyper: [
      {
        token: 'USDT',
        address: new PublicKey('GofVPcuBh2BzNexQ3BbfDGhxHboGGEf43q4vEq6hEzVs'),
        decimals: 9,
        name: 'USDT'
      },
      {
        token: 'ETH',
        address: new PublicKey('HsxJynHah88rWuJ3FeP4fPzyLDt8KDoPGJzsAP57T1Ba'),
        decimals: 9,
        name: 'Wrapped Ether (Wormhole)'
      }
    ]
  },
  testnet: {
    primary: [
      {
        token: 'ETH',
        address: new PublicKey('HsxJynHah88rWuJ3FeP4fPzyLDt8KDoPGJzsAP57T1Ba'),
        decimals: 9,
        name: 'Wrapped Ether (Wormhole)'
      }
    ],
    stable: [
      {
        token: 'SOL',
        address: new PublicKey('So11111111111111111111111111111111111111112'),
        decimals: 9,
        name: 'Solana'
      },
      {
        token: 'USDC',
        address: new PublicKey('BNWkCAoNdXmG6Z5jnscA64fjgpu9WSHdkhf7Nc6X6SPM'),
        decimals: 9,
        name: 'USDC Coin'
      },
      {
        token: 'USDT',
        address: new PublicKey('6jjKDiFUohqfSk6KofB3xEG46ENASWpSvbaPUX7Tbqgq'),
        decimals: 9,
        name: 'USDT'
      }
    ],
    hyper: [
      {
        token: 'USDT',
        address: new PublicKey('GofVPcuBh2BzNexQ3BbfDGhxHboGGEf43q4vEq6hEzVs'),
        decimals: 9,
        name: 'USDT'
      },
      {
        token: 'ETH',
        address: new PublicKey('HsxJynHah88rWuJ3FeP4fPzyLDt8KDoPGJzsAP57T1Ba'),
        decimals: 9,
        name: 'Wrapped Ether (Wormhole)'
      }
    ]
  }
}

export const faqs = [
  {
    question: 'How does single sided liquidity work?',
    answer: (
      <div>
        Single-sided liquidity pools offered by GooseFX, also known as vaults, are designed to optimize returns for
        users by allowing them to deposit individual tokens, such as SOL or USDC, rather than having to provide
        liquidity for both sides of a trading pair. Each vault maintains a distinct pool for each supported token,
        streamlining the process of earning swap fees and market-making profits. This structure not only simplifies
        participation for users but also aims to minimize the risks associated with traditional two-sided liquidity
        pools.
      </div>
    )
  },
  {
    question: 'How is APY and impermanent loss calculated?',
    answer: (
      <div>
        Since the pools in the vaults are single-sided there is no impermanent loss that occurs due to a difference
        in withdrawable tokens as you would experience in a traditional two-token pool. Instead, loss can occur in
        the case where the pool suffers losses and thus total withdrawable tokens will be less than total deposits.
        <br />
        <br />
        <strong>Annual Percentage Yield (APY):</strong> APY is the estimated annualized return on an investment,
        taking into account the effect of compounding interest. In the context of DeFi and liquidity provision, APY
        is calculated based on the expected returns from swap fees, market-making profits, as well as the frequency
        of compounding. The formula for APY is: APY = (1 + r/n)^(nt) - 1 Where 'r' is the interest rate (as a
        decimal), 'n' is the number of times interest is compounded per year, and 't' is the number of years.
      </div>
    )
  },
  {
    question: 'What is the difference between Stable, and Hyper pools?',
    answer: (
      <div>
        <strong>Primary Vault:</strong> The primary vault consists of less volatile assets, typically with larger
        market capitalizations. These assets tend to have more stable yields, making the primary vault a more
        conservative option for users seeking lower-risk exposure.
        <br />
        <br />
        <strong>Hyper Vault:</strong> The hyper vault, on the other hand, contains tokens that are more volatile
        and may have smaller market capitalizations. These assets can offer potentially higher returns but come
        with greater risks due to their volatility. Users seeking higher returns and willing to accept the
        increased risks associated with less established or more volatile assets may opt for the hyper vault.
        Examples of assets in hyper vaults might include newly launched tokens, DeFi tokens, or smaller-cap
        cryptocurrencies.
      </div>
    )
  },
  {
    question: 'Is the platform audited?',
    answer: (
      <div>
        Yes, the platform has been audited by both OSEC and Halborn and the audit reports can be found here:{' '}
        <a
          href="https://github.com/GooseFX1/gfx-swap/blob/master/audit/goosefx_ssl-audit-public.pdf"
          target="_blank"
          className="doc-link"
        >
          Halborn
        </a>{' '}
        <a
          href="https://github.com/GooseFX1/gfx-swap/blob/master/audit/GooseFX_Swap_Program_Security_Audit_Report_Halborn_Final.pdf"
          target="_blank"
          className="doc-link"
        >
          OSEC
        </a>
      </div>
    )
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

export const invalidDepositErrMsg = (tokenBalance: number, name: string): Message => ({
  type: 'error',
  message: `Please give valid input from 0.00001 to ${tokenBalance?.toFixed(3)} ${name}`
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

export const sslSuccessfulMessage = (
  signature: string,
  price: string | number,
  name: string,
  network: WalletAdapterNetwork,
  operation: string
): Message => ({
  message: (
    <SuccessfulListingMsg
      title={`${name} ${operation} sucessfull!`}
      itemName={`You ${operation} ${price} ${name}`}
      supportText={`Farm ${name}`}
      tx_url={`https://solscan.io/tx/${signature}?cluster=${network}`}
    />
  )
})

export const sslErrorMessage = (
  name: string,
  supportTxt: string,
  signature: string,
  network: WalletAdapterNetwork,
  operation: string
): Message => ({
  type: 'error',
  message: (
    <TransactionErrorMsg
      title={`${operation} error!`}
      itemName={`${operation} ${name} Error`}
      supportText={supportTxt}
      tx_url={signature ? `https://solscan.io/tx/${signature}?cluster=${network}` : null}
    />
  )
})

export const TOKEN_NAMES = {
  SOL: 'SOL',
  GOFX: 'GOFX',
  GMT: 'GMT',
  USDT: 'USDT',
  USDC: 'USDC'
}
