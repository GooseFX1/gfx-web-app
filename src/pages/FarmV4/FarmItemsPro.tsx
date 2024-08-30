/* eslint-disable */

import React, { FC, useState } from 'react'
import { Pool } from '@/pages/FarmV4/constants'
import FarmFilter from '@/pages/FarmV4/FarmFilter'
import { truncateBigString } from '@/utils'
import FarmRow from '@/pages/FarmV4/FarmRow'

const FarmItemsPro: FC<{
  tokens: any
  pool: Pool
  filteredLiquidityAccounts: any
  isDepositedActive: boolean
}> = ({ tokens, pool, filteredLiquidityAccounts, isDepositedActive }) => {
  const [sort, setSort] = useState<string>('ASC')
  const [sortType, setSortType] = useState<string>(null)
  return <>
    <FarmFilter sort={sort} sortType={sortType} />
    <div>
      <div>
        {tokens
          .filter((token: any) => {
            if (pool.name === 'All') return true
            else return pool.name === token.type
          })
          .map((token, i) => {
            if (!token || !filteredLiquidityAccounts) return null
            const liqAcc = filteredLiquidityAccounts[token.sourceTokenMintAddress]
            const userDepositedAmount = truncateBigString(
              liqAcc?.amountDeposited.toString(),
              token.sourceTokenMintDecimals
            )

            const show =
              (isDepositedActive && Boolean(userDepositedAmount) && userDepositedAmount != '0.00') ||
              !isDepositedActive

            return show ? (
              <FarmRow token={token} key={`${token?.sourceToken}-${token?.targetToken}-${i}`} />
            ) : null
          })}
      </div>
    </div>
  </>
}

export default FarmItemsPro