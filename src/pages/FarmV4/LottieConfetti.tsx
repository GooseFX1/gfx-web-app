import React from 'react'
import CreatePoolConfetti from '@/animations/createPoolConfetti.json'
import Lottie from 'lottie-react'

function LottieConfetti({
                          // eslint-disable-next-line @typescript-eslint/no-empty-function
                          onClick = () => {
                          }
                        }: { onClick?: () => void}) {
  return <Lottie
    animationData={CreatePoolConfetti}
    className="h-full w-full bg-transparent absolute top-0 left-0 z-10"
    onClick={onClick}
  />
}

export default LottieConfetti