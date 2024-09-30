import { FC } from 'react'
import FarmFilter from '@/pages/FarmV4/FarmFilter'
import FarmRow from '@/pages/FarmV4/FarmRow'
import { GAMMAPoolWithUserLiquidity } from '@/types/gamma'
import WindowingContainer from '@/pages/FarmV4/WindowingContainer'
import { useGamma } from '@/context'

const FarmItemsPro: FC = () => {
  const { filteredPools } = useGamma()
  return (
    <>
      <FarmFilter />
      <div>
        <WindowingContainer
          items={filteredPools}
          render={(pool: GAMMAPoolWithUserLiquidity, i) => (
            <FarmRow pool={pool} key={`${pool?.mintA.name}-${pool?.mintB.name}-${i}`} />
          )}
        />
      </div>
    </>
  )
}


export default FarmItemsPro
