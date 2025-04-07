import { FC, useMemo } from 'react'
import NoResultsFound from './NoResultsFound'
import { useGamma } from '@/context'
import FarmItemsLite from '@/pages/FarmV4/FarmItemsLite'
import FarmItemsPro from '@/pages/FarmV4/FarmItemsPro'

export const noPoolsFound = {
  title: 'Oops, no pools found',
  subText: 'Don’t worry, there are more pools coming soon...'
}
export const noPoolsDeposited = {
  title: 'Oops, no pools deposited',
  subText: 'Don’t worry, explore our pools and start earning!'
}

const FarmItems: FC<{
  numberOfTokensDeposited: number
  isCreatedActive: boolean
}> = ({ numberOfTokensDeposited, isCreatedActive }) => {
  const {
    filteredPools,
    searchTokens,
    showDeposited,
    isCardMode,
    isLoadingPools
  } = useGamma()
  const isSearchActive = useMemo(() => searchTokens.length > 0, [searchTokens])

  let noResultsTitle = ''
  let noResultsSubText = ''
  switch (true) {
    //eslint-disable-next-line
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
    //eslint-disable-next-line
    case !Boolean(isSearchActive) && showDeposited && isCreatedActive:
      noResultsTitle = noPoolsDeposited.title
      noResultsSubText = noPoolsDeposited.subText
      break
    //eslint-disable-next-line
    case !Boolean(isSearchActive) && showDeposited && !isCreatedActive:
      noResultsTitle = noPoolsDeposited.title
      noResultsSubText = noPoolsDeposited.subText
      break
    //eslint-disable-next-line
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

  return (
    <div>
      {(numberOfTokensDeposited === 0 && showDeposited) || (filteredPools.length === 0 && !isLoadingPools) ? (
        <NoResultsFound requestPool={!showDeposited} str={noResultsTitle} subText={noResultsSubText} />
      ) : isCardMode === 'card' ? (
        <FarmItemsLite
          openPositionImages={openPositionImages}
          openPositionsAcrossPrograms={openPositionsAcrossPrograms}
        />
      ) :
        <FarmItemsPro />
      }
    </div>
  )
}
export default FarmItems
