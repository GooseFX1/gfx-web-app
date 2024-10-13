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
