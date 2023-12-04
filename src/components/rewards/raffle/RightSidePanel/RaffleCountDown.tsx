import React, { FC, useEffect, useState } from 'react'

const Countdown: FC<{ timestamp: number }> = ({ timestamp }) => {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const targetDate = new Date(timestamp * 1000).getTime() // Fix: Convert targetDate to number using getTime()
      const difference = targetDate - now

      if (difference <= 0) {
        clearInterval(interval)
        setTimeLeft('Started')
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))

        setTimeLeft(`${days} D : ${hours} H : ${minutes} Min`)
      }
    }, 3 * 1000)

    return () => clearInterval(interval)
  }, [timestamp])

  return <div>{timeLeft}</div>
}

export default Countdown
