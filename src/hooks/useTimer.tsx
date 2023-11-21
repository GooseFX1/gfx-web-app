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
  isUtc = true
}: UseTimerProps): {
  time: string
  isDone: boolean
} {
  const [time, setTime] = useState<string>('00:00')
  const [isDone, setIsDone] = useState(false)
  const getUtcTime = useCallback(
    (d: dayjs.Dayjs) => {
      if (!isUtc) return d
      return d.utc()
    },
    [isUtc]
  )
  const target = useMemo(() => {
    let target: dayjs.Dayjs
    if (typeof targetTime == 'number') {
      target = dayjs(targetTime)
    } else {
      target = dayjs()
      Object.keys(targetTime).forEach((k) => {
        target = target.set(k as UnitType, targetTime[k])
      })
    }
    if (dayjs().utc().isAfter(target) && offsetToFuture) {
      // If it has passed, calculate the time for tomorrow
      target.add(1, 'day')
    }
    return getUtcTime(target)
  }, [targetTime, offsetToFuture, getUtcTime])
  const calculateTime = useCallback(() => {
    const currentTime = getUtcTime(dayjs())

    const offset = target.diff(currentTime)
    const offsetDayjs = getUtcTime(dayjs(offset))

    setTime(offsetDayjs.format(format))
    const done = offsetDayjs.hour() == 0 && offsetDayjs.minute() == 0 && offsetDayjs.second() == 0
    setIsDone(done)
  }, [target, format, isUtc])

  useEffect(() => {
    const id = setInterval(() => {
      calculateTime()
    }, 1000)
    return () => clearInterval(id)
  }, [calculateTime])

  return {
    time,
    isDone
  }
}
