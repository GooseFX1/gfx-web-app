import { Progress } from 'antd'
import { FC } from 'react'

export const ProgressBar: FC<{
  percent: number
  showInfo: boolean
  strokeWidth: number
  strokeColor: string
  trailColor: string
}> = ({ percent, showInfo, strokeColor, strokeWidth, trailColor }) => {
  return (
    <Progress
      percent={percent}
      showInfo={showInfo}
      strokeWidth={strokeWidth}
      strokeColor={strokeColor}
      trailColor={trailColor}
    />
  )
}
