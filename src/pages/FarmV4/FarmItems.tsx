/* eslint-disable */
import { FC } from 'react'
import NoResultsFound from './NoResultsFound'
import { useGamma, useRewardToggle } from '@/context'
import { Button } from 'gfx-component-lib'
import { poolType } from '@/pages/FarmV4/constants'
import FarmItemsMigrate from '@/pages/FarmV4/FarmItemsMigrate'
import FarmItemsLite from '@/pages/FarmV4/FarmItemsLite'
import FarmItemsPro from '@/pages/FarmV4/FarmItemsPro'

const noPoolsFound = {
  title: 'Oops, no pools found',
  subText: 'Don’t worry, there are more pools coming soon...'
}
const noPoolsDeposited = {
  title: 'Oops, no pools deposited',
  subText: 'Don’t worry, explore our pools and start earning!'
}
// const noCreatedPools = {
//   title: 'Oops, no created pools',
//   subText: 'Don’t worry, you can always create one!'
// }

const FarmItems: FC<{
  tokens: any
  numberOfTokensDeposited: number
  isSearchActive: string
  isDepositedActive: boolean
  isCreatedActive: boolean
}> = ({ tokens, numberOfTokensDeposited, isDepositedActive, isSearchActive, isCreatedActive }) => {
  const { filteredLiquidityAccounts, pool, setPool } = useGamma()
  const { isProMode } = useRewardToggle()

  let noResultsTitle = ''
  let noResultsSubText = ''
  switch (true) {
    case !Boolean(isSearchActive) && !isDepositedActive && !isCreatedActive:
      noResultsTitle = noPoolsFound.title
      noResultsSubText = noPoolsFound.subText
      break
    case Boolean(isSearchActive) && isDepositedActive && isCreatedActive:
      noResultsTitle = noPoolsFound.title
      noResultsSubText = noPoolsFound.subText
      break
    case Boolean(isSearchActive) && !isDepositedActive && !isCreatedActive:
      noResultsTitle = noPoolsFound.title
      noResultsSubText = noPoolsFound.subText
      break
    case Boolean(isSearchActive) && !isDepositedActive && isCreatedActive:
      noResultsTitle = noPoolsFound.title
      noResultsSubText = noPoolsFound.subText
      break
    case Boolean(isSearchActive) && isDepositedActive && !isCreatedActive:
      noResultsTitle = noPoolsDeposited.title
      noResultsSubText = noPoolsDeposited.subText
      break
    case !Boolean(isSearchActive) && isDepositedActive && isCreatedActive:
      noResultsTitle = noPoolsDeposited.title
      noResultsSubText = noPoolsDeposited.subText
      break
    case !Boolean(isSearchActive) && isDepositedActive && !isCreatedActive:
      noResultsTitle = noPoolsDeposited.title
      noResultsSubText = noPoolsDeposited.subText
      break
    case !Boolean(isSearchActive) && !isDepositedActive && isCreatedActive:
      noResultsTitle = noPoolsFound.title
      noResultsSubText = noPoolsFound.subText
      break
    case !isDepositedActive && isCreatedActive:
      noResultsTitle = noPoolsFound.title
      noResultsSubText = noPoolsFound.subText
      break
  }
  const openPositionsAcrossPrograms = 9
  const openPositionImages = [
    '/img/crypto/ORCA.svg',
    '/img/crypto/raydium.svg',
    '/img/crypto/meteora.svg'
  ]
  return (
    <div className={''}>
      {(numberOfTokensDeposited === 0 && isDepositedActive) || tokens?.length === 0 ? (
        <NoResultsFound requestPool={!isDepositedActive} str={noResultsTitle} subText={noResultsSubText} />
      ) : isProMode ? (
        <FarmItemsPro
          tokens={tokens}
          filteredLiquidityAccounts={filteredLiquidityAccounts}
          isDepositedActive={isDepositedActive}
          pool={pool}
        />
      ) : pool.name != poolType.migrate.name ? <FarmItemsLite
        pool={pool}
        openPositionImages={openPositionImages}
        openPositionsAcrossPrograms={openPositionsAcrossPrograms}
        setPool={setPool}
        tokens={tokens}
        filteredLiquidityAccounts={filteredLiquidityAccounts}
        isDepositedActive={isDepositedActive}
      /> : (
        <FarmItemsMigrate openPositionsAcrossPrograms={[{
          tokenA: {
            name: 'SOL',
            balance: '0.24',
            symbol: 'SOL',
            src:'/img/crypto/SOL.svg'
          },
          tokenB: {
            name: 'USDC',
            balance: '0.24',
            symbol: 'USDC',
            src:'/img/crypto/USDC.svg'
          }
        }]}/>
      )}
      {(numberOfTokensDeposited === 0 && isDepositedActive) || tokens?.length === 0 ? (
        <></>
      ) : (
        <div className={'w-full flex items-center mt-4'}>
          <Button
            className="cursor-pointer rounded-full border-[1.5px] border-solid border-purple-5
            dark:bg-black-1 dark:text-white bg-grey-5 mx-auto font-bold text-regular text-black-4"
            variant={'primary'}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}
export default FarmItems


