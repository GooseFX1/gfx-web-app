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
}> = ({ tokens, numberOfCoinsDeposited, searchTokens, showDeposited }) => {
  const [statsModal, setStatsModal] = useState<boolean>(false)
  const { filteredLiquidityAccounts } = useSSLContext()
  return (
    <div className={''}>
      {numberOfCoinsDeposited === 0 && showDeposited && searchTokens?.length === 0 && (
        <NoResultsFound
          str="Oops, no pools deposited"
          subText="Don’t worry, explore our pools and start earning!"
        />
      )}
      {tokens?.length === 0 && searchTokens?.length > 0 && (
        <NoResultsFound
          requestPool={true}
          str="Oops, no pools found"
          subText="Don’t worry, there are more pools coming soon..."
        />
      )}
      <Accordion type={'multiple'} collapsible={true} variant={'secondary'} className={'lg:min-w-full gap-3.75'}>
        {tokens.map((coin) => {
          const userDepositedAmount = truncateBigString(
            filteredLiquidityAccounts?.[coin?.mint?.toBase58()]?.amountDeposited?.toString(),
            coin?.mintDecimals
          )

          const show =
            (showDeposited && Boolean(userDepositedAmount) && userDepositedAmount != '0.00') || !showDeposited
          return show ? (
            <AccordionItem value={coin?.token} variant={'secondary'} key={coin?.token}>
              {statsModal && <StatsModal token={coin} statsModal={statsModal} setStatsModal={setStatsModal} />}
              <FarmContent coin={coin} key={`content-${coin?.token}`} />
            </AccordionItem>
          ) : null
        })}
      </Accordion>
    </div>
  )
}
export default FarmItems
