/* eslint-disable @typescript-eslint/no-unused-vars */
import { getCronUpTimeData } from '@/api/analytics'
import { getTodaysDate } from '../../../utils'
import React, { FC, ReactElement, useEffect, useState } from 'react'
import { Tooltip } from 'antd'
import { PropsWithKey } from '@/pages/TradeV3/mobile/PlaceOrderMobi'

const getCurrentTimeSlot = (): string => {
  const now = new Date() // Get the current date and time
  const hour = now.getUTCHours() // Get the current hour
  let minute = now.getUTCMinutes() // Get the current minute

  // Round down the minute to the nearest 0, 15, 30, or 45
  minute = minute - (minute % 15)

  // Format hour and minute to two digits
  const formattedHour = hour.toString().padStart(2, '0')
  const formattedMinute = minute.toString().padStart(2, '0')

  // Construct the time slot key
  const timeKey = `${formattedHour}:${formattedMinute}`
  return timeKey
}
const CronUpTime = (): ReactElement => {
  const [cronData, setData] = useState([])
  const [date, setDate] = useState('')
  const timeSlot = getCurrentTimeSlot()
  useEffect(() => {
    const getCronUpTime = async () => {
      const res = await getCronUpTimeData()
      setData(res)
      setDate(getTodaysDate())
    }
    getCronUpTime()
  }, [])

  return (
    <div>
      {cronData[date] && (
        <div>
          <h1>Cron Uptime IN UTC TimeZone</h1>
          <h2>Today's Date: {date}</h2>

          {Object.entries(cronData[date]).map(([repoName, repoData], index) => (
            <RepositoryDetails key={repoName} repoData={repoData} repoName={repoName} />
          ))}
        </div>
      )}
    </div>
  )
}

interface RepositoryDetailsProps {
  repoData: Record<string, any> // Assuming repoData is an object with string keys and any type values.
  repoName: string
}

const RepositoryDetails: FC<PropsWithKey<RepositoryDetailsProps>> = ({ repoData, repoName }) => {
  const timeSlot = getCurrentTimeSlot()

  // Create an array of JSX elements to render based on the condition
  const elementsToRender = []
  for (const [key, value] of Object.entries(repoData)) {
    if (key === timeSlot) {
      break // Stop adding elements once the condition is met
    }
    const approved = value === 1
    elementsToRender.push(
      <div className="flex">
        <Tooltip color={'#1C1C1C'} title={key}>
          <div key={key} className="">
            <img src={`/img/assets/${approved ? 'approved' : 'reject'}.svg`} />
          </div>
        </Tooltip>
      </div>
    )
  }

  return (
    <div className="repository-details">
      <h3>{repoName}</h3>
      <div className="flex">{elementsToRender}</div>
    </div>
  )
}

export default CronUpTime
