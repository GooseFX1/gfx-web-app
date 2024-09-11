import { FC } from 'react'
import FarmFilter from '@/pages/FarmV4/FarmFilter'
import FarmRow from '@/pages/FarmV4/FarmRow'
import { GAMMAPool } from '@/types/gamma'
import WindowingContainer from '@/pages/FarmV4/WindowingContainer'

const FarmItemsPro: FC<{
  poolsToRender: GAMMAPool[]
}> = ({
        poolsToRender
      }) =>
  <>
    <FarmFilter />
    <div>
      <WindowingContainer
        items={poolsToRender}
        render={(token: GAMMAPool, i) =>
          <FarmRow token={token} key={`${token?.mintA.name}-${token?.mintB.name}-${i}`} />}
      />
    </div>
  </>
  

export default FarmItemsPro
