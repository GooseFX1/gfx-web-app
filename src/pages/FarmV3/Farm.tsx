import { FC, useEffect } from 'react'
import { FarmHeader } from './FarmHeader'
import { SSLProvider, usePriceFeedFarm } from '../../context'
import { FarmTable } from './FarmTable'
import { Faqs } from './Faqs'
import { Alert, AlertDescription } from 'gfx-component-lib'

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
        <div className="mt-4 px-3">
          <Alert className="p-2 dark:border-white border-grey-2">
            <AlertDescription className="dark:text-white text-black-4 ">
              <h5 className="inline">Notice: </h5>
              SSLv2 pools have officially been deprecated, withdrawals were allowed for a 12 month window
              between July 2024 to July 2025. The withdrawal period is now over and we are not processing any
              further withdrawals. This page will be discontinued end of July 2025.{' '}
            </AlertDescription>
          </Alert>
        </div>
        <FarmHeader />
        <div className={'gap-7.5 mt-7.5 p-5 max-sm:px-2.5 max-sm:pb-3.75 pt-0'}>
          <FarmTable />
          <Faqs />
        </div>
      </div>
    </SSLProvider>
  )
}
export default Farm
