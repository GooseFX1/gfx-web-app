import React, { FC } from 'react'
import { Progress } from 'antd'
import styled from 'styled-components'
import { Tooltip } from '../../../components'
import { SpaceBetweenDiv } from '../../../styles'

const PROGRESS_BAR = styled(Progress)`
  flex: 1;
  min-width: 150px;
  margin: 0 ${({ theme }) => theme.margins['3x']};
`

const TITLE = styled(SpaceBetweenDiv)`
  min-width: 90px;

  > span {
    color: ${({ theme }) => theme.text4};
  }
`

const WRAPPER = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > span {
    width: 100px;
    font-size: 11px;
    text-align: right;
    white-space: nowrap;
    color: ${({ theme }) => theme.text1};
  }
`

export const Stat: FC<{
  percent?: number
  progressBar?: boolean
  strokeColor?: string
  title: string
  tooltip: string
  trailColor?: string
  value: string
}> = ({ title, tooltip, percent, progressBar = false, strokeColor, trailColor, value }) => {
  return (
    <WRAPPER>
      <TITLE>
        <span>{title}</span>
        <Tooltip>{tooltip}</Tooltip>
      </TITLE>
      {progressBar && (
        <PROGRESS_BAR
          percent={percent}
          showInfo={false}
          strokeWidth={16}
          strokeColor={strokeColor}
          trailColor={trailColor}
        />
      )}
      <span>{value}</span>
    </WRAPPER>
  )
}
