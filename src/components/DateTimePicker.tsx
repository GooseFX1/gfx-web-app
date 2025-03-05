/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Calendar, TimeInput, TimeInputValue, CalendarProps } from 'gfx-component-lib'
import dayjs from 'dayjs'

export type DateTimePickerProps = {
  value: dayjs.Dayjs
  onChange: (date: dayjs.Dayjs) => void
} & Omit<CalendarProps, 'mode'>
function calculateHour(time: TimeInputValue) {
  let hour = parseInt(time.hours)

  if (time.format === 'PM') {
    hour += 12
    if (hour === 24) { // 12PM is noon 12AM is midnight
      hour = 12
    }
  } else {
    if (hour === 12) { // 12AM is midnight
      hour = 0
    }
  }

  return hour
}
function DateTimePicker({ value, onChange, disabled, ...props }: DateTimePickerProps) {
  const [date, setDate] = useState<dayjs.Dayjs>(() => value || dayjs())
  const [time, setTime] = useState<TimeInputValue>(() => {
    if (!value) {
      return {
        hours: '01',
        minutes: '00',
        format: 'AM'
      }
    }
    let hour = value.hour() % 12
    if (hour === 0) { // input displays 1-12 not 00-11 to account for AM/PM
      hour = 12
    }
    // display purposes
    return {
      hours: hour.toString(),
      minutes: value.minute().toString(),
      format: value.hour() >= 12 ? 'PM' : 'AM'
    }
  })
  useEffect(() => {
    // actual date
    const hour = calculateHour(time)
    const finalDate = (date || dayjs())
      .set('hour', hour)
      .set('minute', parseInt(time.minutes))
      .set('second', 0)
    onChange(finalDate)
  }, [date, time])
  const onSelect = useCallback((date)=>{
    const newDate = dayjs(date)
      .set('hour', parseInt(time.hours) + (time.format === 'PM' ? 12 : 0))
      .set('minute', parseInt(time.minutes))
      .set('second', 0)
    setDate(newDate)
  },[time]);
  const selected = useMemo(()=>date.toDate(),[date])
  return (
    <Calendar
      disabled={disabled ?? {
        before: dayjs().toDate()
      }}
      selected={selected}
      onSelect={onSelect}
      footer={
        <div className={`flex flex-col w-full gap-2 mt-2`}>
          <p className={`text-b2 font-semibold text-text-lightmode-primary dark:text-text-darkmode-primary`}>
            Select Time:
          </p>
          <TimeInput
            value={time}
            onValueChange={setTime}
            classNames={{
              container: 'text-text-lightmode-primary dark:text-text-darkmode-primary',
              content: 'z-[1002]'
            }}
          />
        </div>
      }
      {...props}
    />
  )
}

export default DateTimePicker
