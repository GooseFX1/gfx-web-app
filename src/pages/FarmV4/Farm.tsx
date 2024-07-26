import { FC, useEffect } from 'react'
import { FarmHeader } from './FarmHeader'
import { usePriceFeedFarm, FarmProvider } from '../../context'
import { FarmContainer } from './FarmContainer'
import { Faqs } from './Faqs'

const FarmV4: FC = () => {
  const { refreshTokenData } = usePriceFeedFarm()

  // initial load of all the prices
  useEffect(() => {
    refreshTokenData()
  }, [])

  return (
    <FarmProvider>
      <div
        id="farm-container"
        className={`dark:bg-black-1 bg-grey-5 h-[calc(100vh - 56px)] overflow-auto max-w-[1440px]
       m-auto no-scrollbar gap-7.5`}
      >
        <FarmHeader />
        <div className={'gap-7.5 mt-7.5 p-5 max-sm:px-2.5 max-sm:pb-3.75 pt-0'}>
          <FarmContainer />
          <Faqs />
        </div>
      </div>
    </FarmProvider>
  )
}
export default FarmV4
