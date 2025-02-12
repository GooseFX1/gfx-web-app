import React, { useEffect, useState } from 'react'
import { Calendar, TimeInput, TimeInputValue, CalendarProps } from 'gfx-component-lib'
import dayjs from 'dayjs'

type DateTimePickerProps = {
  value: dayjs.Dayjs
  onChange: (date: dayjs.Dayjs) => void
} & Omit<CalendarProps, 'mode'>

function DateTimePicker({ value, onChange, ...props }: DateTimePickerProps) {
  const [date, setDate] = useState<dayjs.Dayjs>(() => value || dayjs())
  const [time, setTime] = useState<TimeInputValue>(() => {
    if (!value) {
      return {
        hours: '01',
        minutes: '00',
        format: 'AM'
      }
    }
    return {
      hours: value.hour().toString(),
      minutes: value.minute().toString(),
      format: value.hour() >= 12 ? 'PM' : 'AM'
    }
  })
  useEffect(() => {
    const finalDate = (date || dayjs())
      .set('hour', parseInt(time.hours) + (time.format === 'PM' ? 12 : 0))
      .set('minute', parseInt(time.minutes))
      .set('second', 0)
    onChange(finalDate)
  }, [date, time])
  return (
    <Calendar
      disabled={{
        before: dayjs().toDate()
      }}
      selected={date.toDate()}
      onSelect={(date) => {
        const newDate = dayjs(date)
          .set('hour', parseInt(time.hours) + (time.format === 'PM' ? 12 : 0))
          .set('minute', parseInt(time.minutes))
          .set('second', 0)
        setDate(newDate)
      }}
      footer={
        <div className={`flex flex-col w-full gap-2`}>
          <p className={`text-b2 font-semibold text-text-lightmode-primary dark:text-text-darkmode-primary`}>
            Select Time:
          </p>
          <TimeInput value={time} onValueChange={setTime} />
        </div>
      }
      {...props}
    />
  )
}

export default DateTimePicker
