/* eslint-disable */

import React, { Dispatch, FC, SetStateAction } from 'react'
import { Pool, poolType } from '@/pages/FarmV4/constants'
import MigrateCard from '@/pages/FarmV4/MigrateCard'
import { truncateBigString } from '@/utils'
import FarmCard from '@/pages/FarmV4/FarmCard'

const FarmItemsLite: FC<{
  pool: Pool
  openPositionImages: string[]
  openPositionsAcrossPrograms: number
  setPool: Dispatch<SetStateAction<Pool>>
  tokens: any
  filteredLiquidityAccounts: any
  isDepositedActive: boolean
}> = ({
        pool,
        openPositionImages,
        openPositionsAcrossPrograms,
        setPool,
        tokens,
        filteredLiquidityAccounts,
        isDepositedActive
      }) => <div className="border-top grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
    {pool.name != poolType.migrate.name && <MigrateCard
      openPositionImages={openPositionImages}
      openPositionsAcrossPrograms={openPositionsAcrossPrograms}
      setPool={setPool}
    />}
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
          (isDepositedActive && Boolean(userDepositedAmount) && userDepositedAmount != '0.00') || !isDepositedActive

        return show ? (
          <FarmCard token={token} key={`${token?.sourceToken}-${token?.targetToken}-${i}`} />
        ) : null
      })}
  </div>


export default FarmItemsLite