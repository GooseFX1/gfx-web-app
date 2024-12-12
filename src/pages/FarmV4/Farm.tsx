import { FC, useEffect } from 'react'
import { FarmHeader } from './FarmHeader'
import { FarmContainer } from './FarmContainer'
import { Faqs } from './Faqs'
import GammaOnboard from './GammaOnboard'
import { useGamma } from '@/context'
import { POOL_TYPE } from './constants'
import LottieConfetti from '@/pages/FarmV4/LottieConfetti'

const FarmV4: FC = () => {
  const { setCurrentPoolType, isConfettiVisible, setIsConfettiVisible, isCardMode } = useGamma()

  useEffect(() => {
    setCurrentPoolType(POOL_TYPE.primary)
  }, [isCardMode])

  useEffect(() => {
    setTimeout(() => setIsConfettiVisible(false), 10000)
  }, [isConfettiVisible])

  return (
    <div
      id="farm-container"
      className={`dark:bg-black-1 bg-grey-5 h-[calc(100vh - 56px)] overflow-auto max-w-[1440px]
       m-auto no-scrollbar gap-7.5`}
    >
      {isConfettiVisible && <LottieConfetti onClick={() => setIsConfettiVisible(false)} />
      }
      <GammaOnboard />
      <FarmHeader />
      <div className={'gap-7.5 p-5 max-sm:px-2.5 max-sm:pb-3.75 pt-0'}>
        <FarmContainer />
        <Faqs />
      </div>
    </div>
  )
}
export default FarmV4