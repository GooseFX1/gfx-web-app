import { SuccessClaimAll, SuccessSSLMessage, TransactionErrorMsgSSL } from '../../components'

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
  type: 'hyper' | 'primary' | 'migrate'
}

export type JupToken = {
  "address": string,
  "name": string,
  "symbol": string,
  "decimals": number,
  "logoURI": string,
}

export type PoolType = {
  primary: Pool
  hyper: Pool
  migrate: Pool
}
export const POOL_TYPE: PoolType = {
  primary: {
    index: 1,
    name: 'Primary',
    type: 'primary'
  },
  hyper: {
    index: 2,
    name: 'Hyper',
    type: 'hyper'
  },
  migrate: {
    index: 3,
    name: 'Migrate',
    type: 'migrate'
  }
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

// current supported sort oreder
// 'liquidity',
//   'volume24h',
//   'volume7d',
//   'fee24h',
//   'fee7d',
//   'apr24h',
//   'apr7d'
export const GAMMA_SORT_CONFIG: GAMMASortConfig[] = [
  { id: '1', name: 'Liquidity: High to Low', direction: 'DESC', key: 'liquidity' },
  { id: '2', name: 'Liquidity: Low to High', direction: 'ASC', key: 'liquidity' },
  { id: '3', name: 'Volume: High to Low', direction: 'DESC', key: 'volume24h' },
  { id: '4', name: 'Volume: Low to High', direction: 'ASC', key: 'volume24h' },
  { id: '5', name: 'Fees: High to Low', direction: 'DESC', key: 'fee24h' },
  { id: '6', name: 'Fees: Low to High', direction: 'ASC', key: 'fee24h' },
  { id: '7', name: 'APR: High to Low', direction: 'DESC', key: 'apr24h' },
  { id: '8', name: 'APR: Low to High', direction: 'ASC', key: 'apr24h' }
]
export type GAMMASortConfig = {
  id: string
  name: string
  direction: 'ASC' | 'DESC'
  key: string
}
export const GAMMA_SORT_CONFIG_MAP: Map<string, GAMMASortConfig> =
  new Map(GAMMA_SORT_CONFIG.map((item) => [item.id, item]))
export const BASE_SLIPPAGE = [0.1, 0.5, 1.0]
export const TOKEN_LIST_PAGE_SIZE = 50
export const POOL_LIST_PAGE_SIZE = 200

export const DEVNET_NEW_TOKENS = [
  {
    "address": "7FRQvjgX2VDqVJQRpXdpfdZCNgqdBHH5hwzJFnE6wj7k",
    "daily_volume": 474232.9597861851,
    "decimals": 6,
    "freeze_authority": "Q6XprfkF8RQQKoQVG33xT88H7wi8Uk1B1CC7YAs69Gi",
    "logoURI": "https://cf-ipfs.com/ipfs/QmXoj9Jp29JNYLMWQ4Z4AZASVPZXnJjJjSCcYsyaTqZj4v",
    "mint_authority": null,
    "tags": ["unknown"],
    "name": "cpmint1",
    "symbol": "CPMINT1",
    "price": 0.0
  },
  {
    "address": "5a7H92vpeAkVruej7cnfCN1aRUi1an3xGdoSVYR9gE4b",
    "daily_volume": 346781.3214512356,
    "decimals": 9,
    "freeze_authority": "Z4xAptL9BPT2GXi8SM1QA8fk8dJZ4bJrZvNxQ1S4i8Fp",
    "logoURI": "https://cf-ipfs.com/ipfs/QmW34Zv8k4N1A9Ht5P8S5YHsZ3DQsfdlPQJ6CpP9YXWxA",
    "tags": ["unknown"],
    "mint_authority": "ZyMvD3xG9PgkZQmA47JD6W3mV41W3CVgCfSxYqXJ91Xb",
    "name": "cpmint2",
    "symbol": "CPMINT2",
    "price": 0.0
  },
  {
    "address": "FEi9VrHaE8bRkwUPzoeADwx1yECWCchAHcY83Bs2HRzH",
    "daily_volume": 256982.4983128795,
    "decimals": 6,
    "freeze_authority": null,
    "logoURI": "https://cf-ipfs.com/ipfs/QmT98JhF4Wq7Mn7Wr7WwZQaDmGYXA7Jj3dW3bHpJYQyVrZ",
    "tags": ["unknown"],
    "mint_authority": "P8T2H2fR4vZ3ZbLv5jW5tQwQ8PnPfXgJZ8HkSgK2L1fL",
    "name": "cpmint3",
    "symbol": "CPMINT3",
    "price": 0.0
  },
  {
    "address": "DLwsBn662NHFLkgb81VrvKyXQX89aEF2TMka7iH6RKUV",
    "daily_volume": 198372.6548723124,
    "decimals": 9,
    "freeze_authority": "Q9B1yDkC3mV4F9Js5FJ4LzU9pK4KzV5LfP1H9F2Y1Z7S",
    "logoURI": "https://cf-ipfs.com/ipfs/QmU9X5YkJ3Z4NpYy5S5K8QYjF9CjXh4XwGpJzWmR4X9p7V",
    "tags": ["unknown"],
    "mint_authority": null,
    "name": "cpmint4",
    "symbol": "CPMINT4",
    "price": 0.0
  },
  {
    "address": "A1qhLMWoZJ8fPLFcXobYyciXCynEij9SnDgES5pV1rqt",
    "daily_volume": 587293.8923418752,
    "decimals": 9,
    "freeze_authority": "P7G2RqJ5X3w4yKxFw8L3ZsQ2Vp5TzLwM8F2J6T4Z6Q5D",
    "logoURI": "https://cf-ipfs.com/ipfs/QmXkJ4HfX4R5N8Ls5W5X5Y3ZyY9YxJh7RrH9W8R8Z9dX6J",
    "tags": ["unknown"],
    "mint_authority": null,
    "name": "cpmint5",
    "symbol": "CPMINT5",
    "price": 0.0
  },
  {
    "address": "D8cZrC9F5N1VfGw6LjS7Lp7VmW6KmXpW7Y5J8QnF3Z1K",
    "daily_volume": 134872.7859217463,
    "decimals": 6,
    "freeze_authority": "Z8X2JmP6F7d9QkZtW8L4XsN2Fw3XkJ5TqJ5Z9N7X9Q2F",
    "logoURI": "https://cf-ipfs.com/ipfs/QmW8P9JxV5B2F4Lr5Y6W5P7YjY7Yh4VjK5T8L3R3V2X1H3",
    "tags": ["unknown"],
    "mint_authority": "Q5Y2L3K6P9F7RqKxFw6P7YfT5F2S7LqZtX6J9X8R4F5K",
    "name": "cpmint6",
    "symbol": "CPMINT6",
    "price": 0.0
  },
  {
    "address": "H3j9vF6vW5LxCpHqP1L9Rh6FfT4K9YkXqS6J8F7Z1J4K",
    "daily_volume": 472389.8659423178,
    "decimals": 8,
    "freeze_authority": null,
    "logoURI": "https://cf-ipfs.com/ipfs/QmT8G9N6X8P5K7RqVw9X8W7Y4N7ZfH7L8S6R5Y4R6Z3L1P",
    "tags": ["unknown"],
    "mint_authority": "P8T3Y5L9V7K5FwL9F7W5ZrK9V7L9S7Y8T9Q2F5S9Q3X7",
    "name": "cpmint7",
    "symbol": "CPMINT7",
    "price": 0.0
  },
  {
    "address": "C5p7TzN3V8M1XkTwG9R2KqH6T4J6XpY9Z8F3N5S1J9X3",
    "daily_volume": 235891.4512391874,
    "decimals": 9,
    "freeze_authority": "Y8X4KqR7W5P7KxZtX6J7T9L7F4LqYtP9Q2R3V5S7Q6X",
    "logoURI": "https://cf-ipfs.com/ipfs/QmX2Y3K5N6J7L4RqT5F5W7Y7N6F9T7ZkS5T9X6R9Z3V5X9",
    "tags": ["unknown"],
    "mint_authority": null,
    "name": "cpmint8",
    "symbol": "CPMINT8",
    "price": 0.0
  }
]
