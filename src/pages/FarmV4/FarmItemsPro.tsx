import { FC } from 'react'
import FarmFilter from '@/pages/FarmV4/FarmFilter'
import FarmRow from '@/pages/FarmV4/FarmRow'
import { useGamma } from '@/context'

const FarmItemsPro: FC = () => {
  const { pools, currentPoolType, showDeposited } = useGamma()
  return (
    <>
      <FarmFilter />
      <div>
        <div>
          {pools
            .filter((pool) => {
              if (currentPoolType.name === 'All') return true
              else return currentPoolType.name === pool.type
            })
            .map((token, i) => {
              //TODO: Fetch the balance from contract/api
              const show =
                (showDeposited && Boolean(0)) || !showDeposited

              return show ? (
                <FarmRow token={token} key={`${token?.mintA.name}-${token?.mintB.name}-${i}`} />
              ) : null
            })}
        </div>
      </div>
    </>
  )
}

export default FarmItemsPro
