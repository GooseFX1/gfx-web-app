import { FC } from 'react'
import FarmItemsProSort from '@/pages/FarmV4/FarmItemsProSort'
import FarmRow from '@/pages/FarmV4/FarmRow'
import { GAMMAPoolWithUserLiquidity } from '@/types/gamma'
import WindowingContainer from '@/pages/FarmV4/WindowingContainer'

const FarmItemsPro: FC = () => (
  <>
    <FarmItemsProSort />
    <div>
      <WindowingContainer
        itemPadding={15}
        render={(pool: GAMMAPoolWithUserLiquidity, i) => (
          <FarmRow pool={pool} key={`${pool?.mintA.name}-${pool?.mintB.name}-${i}`} />
        )}
      />
    </div>
  </>
)

export default FarmItemsPro
