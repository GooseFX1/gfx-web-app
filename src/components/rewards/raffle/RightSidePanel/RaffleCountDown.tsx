import React, { FC } from 'react'
import useTimer from '../../../../hooks/useTimer'
import tw from 'twin.macro'
import Button from '../../../twComponents/Button'
import useBoolean from '../../../../hooks/useBoolean'
import { Loader } from '../../../Loader'

const Countdown: FC<{ timestamp: number }> = ({ timestamp }) => {
  const [isLoading, setIsLoading] = useBoolean(false)
  // const [timeLeft, setTimeLeft] = useState('')
  //
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const now = new Date().getTime()
  //     const targetDate = new Date(timestamp * 1000).getTime() // Fix: Convert targetDate to number using getTime()
  //     const difference = targetDate - now
  //
  //     if (difference <= 0) {
  //       clearInterval(interval)
  //       setTimeLeft('Started')
  //     } else {
  //       const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  //       const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  //       const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  //
  //       setTimeLeft(`${days} D : ${hours} H : ${minutes} Min`)
  //     }
  //   }, 3 * 1000)
  //
  //   return () => clearInterval(interval)
  // }, [timestamp])
  const fakeLoad = () => {
    setIsLoading.on()
    setTimeout(setIsLoading.off, 2000)
  }
  const { time, isDone } = useTimer({ targetTime: timestamp ?? 0 })
  return (
    <Button
      cssClasses={[
        tw`bg-white flex justify-center w-[320px] h-10 text-blue-1 font-semibold text-average opacity-50`,
        isDone && tw`opacity-100`
      ]}
      disabled={!isDone || isLoading}
      onClick={fakeLoad}
    >
      {isDone ? isLoading ? <Loader zIndex={2} color={'#5855FF'} /> : 'Started' : time}
    </Button>
  )
}

export default Countdown
