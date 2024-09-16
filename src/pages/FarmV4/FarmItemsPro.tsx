import { FC } from 'react'
import FarmFilter from '@/pages/FarmV4/FarmFilter'
import FarmRow from '@/pages/FarmV4/FarmRow'
import { GAMMAPool } from '@/types/gamma'
import WindowingContainer from '@/pages/FarmV4/WindowingContainer'

const FarmItemsPro: FC<{
  poolsToRender: GAMMAPool[]
}> = ({ poolsToRender }) => (
  <>
    <FarmFilter />
    <div>
      <WindowingContainer
        items={poolsToRender}
        render={(pool: GAMMAPool, i) => (
          <FarmRow pool={pool} key={`${pool?.mintA.name}-${pool?.mintB.name}-${i}`} />
        )}
      />
    </div>
  </>
)


export default FarmItemsPro
