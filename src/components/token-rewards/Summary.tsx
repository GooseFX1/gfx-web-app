interface SummaryProps {
  selectedPool?: string
  selectedTokens?: string[]
  selectedTimeframe?: string
}

export const Summary = ({ selectedPool, selectedTokens, selectedTimeframe }: SummaryProps) => (
  <div className="w-full">
    <h1 className="mb-6 text-center text-lg font-semibold text-text-lightmode-primary dark:text-text-darkmode-primary">
      Summary
    </h1>

    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-lightmode-secondary dark:text-text-darkmode-secondary">
            1. Select Pool
          </span>
          <div className="flex items-center gap-2">
            <img src="/img/assets/solana.svg" alt="SOL" className="w-4 h-4" />
            <span className="text-sm font-medium text-text-lightmode-primary dark:text-text-darkmode-primary">
              {selectedPool || 'SOL-USDC'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-lightmode-secondary dark:text-text-darkmode-secondary">
            2. Select Reward Tokens
          </span>
          <span className="text-sm text-text-lightmode-secondary dark:text-text-darkmode-secondary">
            {selectedTokens?.length ? selectedTokens.join(', ') : 'No tokens selected'}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-lightmode-secondary dark:text-text-darkmode-secondary">
            3. Add Timeframe
          </span>
          <span className="text-sm text-text-lightmode-secondary dark:text-text-darkmode-secondary">
            {selectedTimeframe || 'No timeframe selected'}
          </span>
        </div>
      </div>
    </div>
  </div>
)
