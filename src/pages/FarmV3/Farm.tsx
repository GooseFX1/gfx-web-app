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
              SSLv2 is currently paused and under development for Phase 3. We will resume work after our GAMMA
              launch. See our socials for more info.
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
