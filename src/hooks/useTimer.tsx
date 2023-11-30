import { useCallback, useEffect, useMemo, useState } from 'react'
import dayjs, { UnitType } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)
type TargetTime = Record<UnitType, number>

interface UseTimerProps {
  targetTime: number | Partial<TargetTime>
  format?: string
  offsetToFuture?: boolean
  isUtc?: boolean
  updateInterval?: number
  isDoneByDefault?: boolean
}

/**
 * Expects a datetimestamp as input
 *
 *
 * @returns  time the current time left that returns as 00:00 or the passed in format
 * @returns  isDone if the time is 0
 *
 * */
export default function useTimer({
  targetTime,
  format = 'HH:mm:ss',
  offsetToFuture = true,
  isUtc = true,
  updateInterval = 1000,
  isDoneByDefault = false
}: UseTimerProps): {
  time: string
  isDone: boolean
} {
  const [time, setTime] = useState<string>('')
  const [isDone, setIsDone] = useState(isDoneByDefault)
  const getUtcTime = useCallback(
    (d: dayjs.Dayjs) => {
      if (!isUtc) return d
      return d.utc()
    },
    [isUtc]
  )
  const target = useMemo(() => {
    let newTarget: dayjs.Dayjs
    if (typeof targetTime == 'number') {
      newTarget = getUtcTime(dayjs(targetTime))
    } else {
      newTarget = getUtcTime(dayjs())
      Object.keys(targetTime).forEach((k) => {
        newTarget = newTarget.set(k as UnitType, targetTime[k])
      })
    }

    if (newTarget.isBefore(getUtcTime(dayjs())) && offsetToFuture) {
      // If it has passed, calculate the time for tomorrow
      newTarget = newTarget.add(1, 'day')
    }
    return newTarget
  }, [targetTime, offsetToFuture, getUtcTime])
  const calculateTime = useCallback(() => {
    const currentTime = getUtcTime(dayjs())

    const offset = target.diff(currentTime)
    const year = Math.floor(offset / (1000 * 60 * 60 * 24 * 30 * 12))
    const month = Math.floor(offset / (1000 * 60 * 60 * 24 * 30))
    const days = Math.floor(offset / (1000 * 60 * 60 * 24))
    const hours = Math.floor((offset % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((offset % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((offset % (1000 * 60)) / 1000)
    const milliseconds = Math.floor((offset % 1000) / 100)
    const offsetDayjs = getUtcTime(dayjs(offset))
      .year(year)
      .month(month)
      .day(days)
      .hour(hours)
      .minute(minutes)
      .second(seconds)
      .millisecond(milliseconds)

    setTime(offsetDayjs.format(format))
    setIsDone(offset <= 0)
  }, [target, format, isUtc])

  useEffect(() => {
    calculateTime()
    const id = setInterval(calculateTime, updateInterval)
    return () => clearInterval(id)
  }, [calculateTime, updateInterval])

  return {
    time,
    isDone
  }
}
