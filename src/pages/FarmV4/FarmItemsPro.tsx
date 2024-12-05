import { FC } from 'react'
import FarmItemsProSort from '@/pages/FarmV4/FarmItemsProSort'
import FarmRow from '@/pages/FarmV4/FarmRow'
import { GAMMAPoolWithUserLiquidity } from '@/types/gamma'
import InfiniteProPoolList from '@/pages/FarmV4/InfiniteProPoolList'

const FarmItemsPro: FC = () => (
  <>
    <FarmItemsProSort />
    <div>
      <InfiniteProPoolList
        itemPadding={15}
        render={(pool: GAMMAPoolWithUserLiquidity, i) => (
          <FarmRow pool={pool} key={`${pool?.mintA.name}-${pool?.mintB.name}-${i}`} />
        )}
      />
    </div>
  </>
)

export default FarmItemsPro
