import React, { FC, useEffect, useState } from 'react'
import { FarmHeader } from './FarmHeader'
import { FarmContainer } from './FarmContainer'
//import { Faqs } from './Faqs'
import GammaOnboard from './GammaOnboard'
import { useConnectionConfig, useGamma, useWalletModal } from '@/context'
import LottieConfetti from '@/pages/FarmV4/LottieConfetti'
import { DepositWithdrawSlider } from '@/pages/FarmV4/DepositWithdrawSlider'
import useWallet from '@/hooks/useWallet'

const FarmV4: FC = () => {
  const { isConfettiVisible, setIsConfettiVisible } = useGamma()
  const { userCache, termsOfServiceVisible } = useConnectionConfig()
  const { visible } = useWalletModal()
  const { connected } = useWallet()
  const [depositContainer, setDepositContainer] = useState<Element>(null)
  const [onboardContainer, setOnboardContainer] = useState<Element>(null)

  useEffect(() => {
    setTimeout(() => setIsConfettiVisible(false), 10000)
  }, [isConfettiVisible])
  const preventDepositAutoClose =
    !userCache.gamma.hasGAMMAOnboarded ||
    (!userCache.hasSignedTC && termsOfServiceVisible) ||
    (!connected && visible)

  return (
    <div
      id="farm-container"
      className={`dark:bg-black-1 bg-grey-5 h-[calc(100vh - 56px)] overflow-auto max-w-[1440px]
       m-auto no-scrollbar gap-7.5`}
      ref={setOnboardContainer}
    >
      {isConfettiVisible && <LottieConfetti onClick={() => setIsConfettiVisible(false)} />}
      <FarmHeader />
      <DepositWithdrawSlider preventAutoClose={preventDepositAutoClose} container={depositContainer} />

      <div className={'gap-7.5 p-5 max-sm:px-2.5 max-sm:pb-3.75 pt-0'} ref={setDepositContainer}>
        <FarmContainer />
        {/* <Faqs /> */}
      </div>
      <GammaOnboard container={onboardContainer} />
    </div>
  )
}
export default FarmV4
