import React, { useEffect, useRef } from 'react'
import { useLottie } from 'lottie-react'
import swapCountDownDark from '@/animations/swap_countdown_dark.json'
import swapCountDownLite from '@/animations/swap_countdown_lite.json'
import { useDarkMode } from '@/context'

type LottieSwapCountDownProps = {
  onFinish: () => Promise<void>
  isRefreshing: boolean
  hasInput: boolean
}

function LottieSwapCountDown({ onFinish, isRefreshing, hasInput }: LottieSwapCountDownProps) {
  const { isDarkMode } = useDarkMode()
  const lastFrameRef = useRef(0)

  const { View, goToAndPlay, goToAndStop } = useLottie(
    {
      animationData: isDarkMode ? swapCountDownDark : swapCountDownLite,
      loop: false,
      autoplay: false,
      onEnterFrame: (e) => {
        const element = e as unknown as { currentTime: number }
        if (element.currentTime < lastFrameRef.current) {
          goToAndPlay(lastFrameRef.current, true)
        } else {
          lastFrameRef.current = element.currentTime
        }
      },
      onComplete: async (e) => {
        console.log('COMPLETE', e)
        lastFrameRef.current = 0
        stop()
        await onFinish()
        console.log('refresh check done')
        goToAndPlay(0, true)
      },
      onDOMLoaded: (e) => {
        console.log('DOM LOADED', e)
        goToAndPlay(0)
      }
      // ref: lottieRef,
    },
    {
      width: '20px',
      height: '20px'
    }
  )
  useEffect(() => {
    if (isRefreshing) {
      // refresh triggered
      lastFrameRef.current = 0
      goToAndStop(0, true)
    }
    else if (!hasInput) {
      // has no input - pause at point; we can't countdown with no input
      lastFrameRef.current = 0
      goToAndStop(0, true)
    }
    else if (!isRefreshing) {
      // finished refreshing - resume from last frame - should be 0
      goToAndPlay(lastFrameRef.current, true)
    }
  }, [isRefreshing, hasInput])
  return <>{View}</>
}

export default LottieSwapCountDown
