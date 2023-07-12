/* eslint-disable */
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
