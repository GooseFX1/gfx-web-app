import { FC, useEffect } from 'react'
import { FarmHeader } from './FarmHeader'
import { usePriceFeedFarm } from '../../context'
import { FarmTable } from './FarmTable'
import { Faqs } from './Faqs'
import { SSLProvider } from '../../context'

const Farm: FC = () => {
  const { refreshTokenData } = usePriceFeedFarm()

  // initial load of all the prices
  useEffect(() => {
    refreshTokenData()
  }, [])

  return (
    <SSLProvider>
      <div
        id="farm-container"
        className={`dark:bg-black-1 bg-grey-5 h-[calc(100vh - 56px)] overflow-auto max-w-[1440px]
       m-auto no-scrollbar`}
      >
        <FarmHeader />
        <div className={'p-5 sm:px-2.5 sm:pb-3.75'}>
          <FarmTable />
          <Faqs />
        </div>
      </div>
    </SSLProvider>
  )
}
export default Farm
