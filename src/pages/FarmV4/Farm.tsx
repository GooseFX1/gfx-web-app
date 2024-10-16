import { FC, useEffect } from 'react'
import { FarmHeader } from './FarmHeader'
import { FarmContainer } from './FarmContainer'
import { Faqs } from './Faqs'
import GammaOnboard from './GammaOnboard'
import { useGamma, useRewardToggle } from '@/context'
import { POOL_TYPE } from './constants'
import CreatePoolConfetti from '@/animations/createPoolConfetti.json'
import Lottie from 'lottie-react'

const FarmV4: FC = () => {
  const { isProMode } = useRewardToggle()
  const { setCurrentPoolType, isConfettiVisible, setIsConfettiVisible } = useGamma()

  useEffect(() => {
    setCurrentPoolType(POOL_TYPE.primary)
  }, [isProMode])

  useEffect(() => {
    setTimeout(() => setIsConfettiVisible(false), 10000)
  }, [isConfettiVisible])

  return (
    <div
      id="farm-container"
      className={`dark:bg-black-1 bg-grey-5 h-[calc(100vh - 56px)] overflow-auto max-w-[1440px]
       m-auto no-scrollbar gap-7.5`}
    >
      {isConfettiVisible && <Lottie
        animationData={CreatePoolConfetti}
        className="h-full w-full bg-transparent absolute top-0 left-0 z-10"
        onClick={() => setIsConfettiVisible(false)}
      />
      }
      <GammaOnboard />
      <FarmHeader />
      <div className={'gap-7.5 mt-7.5 p-5 max-sm:px-2.5 max-sm:pb-3.75 pt-0'}>
        <FarmContainer />
        <Faqs />
      </div>
    </div>
  )
}
export default FarmV4