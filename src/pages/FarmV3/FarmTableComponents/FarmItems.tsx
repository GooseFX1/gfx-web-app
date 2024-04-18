import { SSLToken } from '@/pages/FarmV3/constants'
import React, { FC, useState } from 'react'
import { Accordion, AccordionItem } from 'gfx-component-lib'
import { StatsModal } from '@/pages/FarmV3/StatsModal'
import NoResultsFound from '@/pages/FarmV3/FarmTableComponents/NoResultsFound'
import FarmContent from '@/pages/FarmV3/FarmTableComponents/FarmTableBalanceItem'
import { useSSLContext } from '@/context'
import { truncateBigString } from '@/utils'

const FarmItems: FC<{
  tokens: SSLToken[]
  numberOfCoinsDeposited: number
  searchTokens: string
  showDeposited: boolean
}> = ({ tokens, numberOfCoinsDeposited, showDeposited, searchTokens }) => {
  const [statsModal, setStatsModal] = useState<boolean>(false)
  const { filteredLiquidityAccounts } = useSSLContext()

  const noResultsTitle =
    Boolean(searchTokens) && !showDeposited ? 'Oops, no pools found' : 'Oops, no pools deposited'
  const noResultsSubText =
    Boolean(searchTokens) && !showDeposited
      ? 'Don’t worry, there are more pools coming soon...'
      : 'Don’t worry, explore our pools and start earning!'
  console.log(numberOfCoinsDeposited, showDeposited, tokens, numberOfCoinsDeposited === 0 && showDeposited)
  return (
    <div className={''}>
      {((numberOfCoinsDeposited === 0 && showDeposited) || tokens?.length === 0) && (
        <NoResultsFound requestPool={!showDeposited} str={noResultsTitle} subText={noResultsSubText} />
      )}
      <Accordion type={'multiple'} collapsible={true} variant={'secondary'} className={'lg:min-w-full gap-3.75'}>
        {tokens.map((coin) => {
          if (!coin || !filteredLiquidityAccounts) return null
          const liqAcc = filteredLiquidityAccounts[coin.mint.toBase58()]
          const userDepositedAmount = truncateBigString(liqAcc?.amountDeposited.toString(), coin.mintDecimals)

          const show =
            (showDeposited && Boolean(userDepositedAmount) && userDepositedAmount != '0.00') || !showDeposited

          return show ? (
            <AccordionItem value={coin.token} variant={'secondary'} key={coin.token}>
              {statsModal && <StatsModal token={coin} statsModal={statsModal} setStatsModal={setStatsModal} />}
              <FarmContent coin={coin} key={`content-${coin.token}`} />
            </AccordionItem>
          ) : null
        })}
      </Accordion>
    </div>
  )
}
export default FarmItems
