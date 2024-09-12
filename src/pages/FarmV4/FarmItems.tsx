/* eslint-disable */
import { FC, useMemo } from 'react'
import NoResultsFound from './NoResultsFound'
import { useGamma, useRewardToggle } from '@/context'
import { Button } from 'gfx-component-lib'
import { POOL_TYPE } from '@/pages/FarmV4/constants'
import FarmItemsMigrate from '@/pages/FarmV4/FarmItemsMigrate'
import FarmItemsLite from '@/pages/FarmV4/FarmItemsLite'
import FarmItemsPro from '@/pages/FarmV4/FarmItemsPro'
import { GAMMAPool } from '@/types/gamma'

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
  numberOfTokensDeposited: number
  isCreatedActive: boolean
}> = ({ numberOfTokensDeposited, isCreatedActive }) => {
  const { pools, currentPoolType, searchTokens, showDeposited } = useGamma()
  const { isProMode } = useRewardToggle()

  const isSearchActive = useMemo(() => searchTokens.length > 0, [searchTokens])

  let noResultsTitle = ''
  let noResultsSubText = ''
  switch (true) {
    case !Boolean(isSearchActive) && !showDeposited && !isCreatedActive:
      noResultsTitle = noPoolsFound.title
      noResultsSubText = noPoolsFound.subText
      break
    case Boolean(isSearchActive) && showDeposited && isCreatedActive:
      noResultsTitle = noPoolsFound.title
      noResultsSubText = noPoolsFound.subText
      break
    case Boolean(isSearchActive) && !showDeposited && !isCreatedActive:
      noResultsTitle = noPoolsFound.title
      noResultsSubText = noPoolsFound.subText
      break
    case Boolean(isSearchActive) && !showDeposited && isCreatedActive:
      noResultsTitle = noPoolsFound.title
      noResultsSubText = noPoolsFound.subText
      break
    case Boolean(isSearchActive) && showDeposited && !isCreatedActive:
      noResultsTitle = noPoolsDeposited.title
      noResultsSubText = noPoolsDeposited.subText
      break
    case !Boolean(isSearchActive) && showDeposited && isCreatedActive:
      noResultsTitle = noPoolsDeposited.title
      noResultsSubText = noPoolsDeposited.subText
      break
    case !Boolean(isSearchActive) && showDeposited && !isCreatedActive:
      noResultsTitle = noPoolsDeposited.title
      noResultsSubText = noPoolsDeposited.subText
      break
    case !Boolean(isSearchActive) && !showDeposited && isCreatedActive:
      noResultsTitle = noPoolsFound.title
      noResultsSubText = noPoolsFound.subText
      break
    case !showDeposited && isCreatedActive:
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

  const poolsToRender = useMemo(() => {
    const poolsToShow: GAMMAPool[] = []
    const tokens = searchTokens.toLowerCase()
    for (const pool of pools) {
      // three stage filter:
      /**
       * 1. If search is active, check if pool contains search tokens
       * 2. If showDeposited is active, check if user has deposited in pool
       * 3. Check if pool type matches current pool type
       */
      let addPool = true
      if (isSearchActive &&
        !tokens.includes(pool.mintA.name.toLowerCase()) && !tokens.includes(pool.mintB.name.toLowerCase())
      ) {
        addPool = false
      }

      // TODO: add deposit value for user to show/hide
      if (showDeposited) {
        addPool = false
      }

      addPool = pool.pool_type === currentPoolType.type
      
      if (addPool) {
        poolsToShow.push(pool)
      }
    }

    return poolsToShow
  }, [isSearchActive, searchTokens, showDeposited, currentPoolType])
  return (
    <div>
      {currentPoolType.name === POOL_TYPE.migrate.name ? (
        <FarmItemsMigrate
          openPositionsAcrossPrograms={[
            {
              tokenA: {
                name: 'SOL',
                balance: '0.24',
                symbol: 'SOL',
                src: '/img/crypto/SOL.svg'
              },
              tokenB: {
                name: 'USDC',
                balance: '0.24',
                symbol: 'USDC',
                src: '/img/crypto/USDC.svg'
              }
            }
          ]}
        />
      ) : (numberOfTokensDeposited === 0 && showDeposited) || poolsToRender.length === 0 ? (
        <NoResultsFound requestPool={!showDeposited} str={noResultsTitle} subText={noResultsSubText} />
      ) : isProMode ? (
        <FarmItemsPro
          poolsToRender={poolsToRender}
        />
      ) : <FarmItemsLite
        poolsToRender={poolsToRender}
        openPositionImages={openPositionImages}
        openPositionsAcrossPrograms={openPositionsAcrossPrograms}
      />
      }
      {(numberOfTokensDeposited === 0 && showDeposited) || poolsToRender.length === 0 ? (
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


