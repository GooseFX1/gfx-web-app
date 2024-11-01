import { FC } from 'react'
import FarmFilter from '@/pages/FarmV4/FarmFilter'
import FarmRow, { FarmRowLoader } from '@/pages/FarmV4/FarmRow'
import { GAMMAPoolWithUserLiquidity } from '@/types/gamma'
import WindowingContainer from '@/pages/FarmV4/WindowingContainer'
import { useGamma } from '@/context'

const FarmItemsPro: FC = () => {
  const { filteredPools, isLoadingPools } = useGamma()
  return (
    <>
      <FarmFilter />
      <div>
        {isLoadingPools ? <div className={'flex flex-col gap-2 mt-2'}>
          <FarmRowLoader />
          <FarmRowLoader />
          <FarmRowLoader />
          <FarmRowLoader />
        </div> : <WindowingContainer
          items={filteredPools}
          render={(pool: GAMMAPoolWithUserLiquidity, i) => (
            <FarmRow pool={pool} key={`${pool?.mintA.name}-${pool?.mintB.name}-${i}`} />
          )}
        />}
      </div>
    </>
  )
}


export default FarmItemsPro