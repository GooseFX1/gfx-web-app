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
       m-auto no-scrollbar gap-7.5`}
      >
        <div
          className="flex items-center sm:h-12 justify-center h-6 bg-yellow-1 !w-[100vw] 
        absolute left-0 sm:relative sm:p-1"
        >
          <h5 className="text-black-1 sm:text-[13px]">
            Pool trading is temporarily disabled for the next 48 hours due to a program upgrade. However, deposits
            and withdrawals remain operational.
          </h5>
        </div>
        <div className="mt-6 sm:mt-0">
          <FarmHeader />
          <div className={'gap-7.5 mt-7.5 p-5 sm:px-2.5 sm:pb-3.75 pt-0'}>
            <FarmTable />
            <Faqs />
          </div>
        </div>
      </div>
    </SSLProvider>
  )
}
export default Farm
