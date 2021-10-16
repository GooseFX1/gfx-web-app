import React, { FC } from 'react'
import { Progress } from 'antd'
import styled from 'styled-components'
import { Tooltip } from '../../../components'
import { SpaceBetweenDiv } from '../../../styles'

const PROGRESS_BAR = styled(Progress)`
  width: 170px;
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
    flex: 1;
    font-size: 11px;
    text-align: right;
    color: ${({ theme }) => theme.text1};
  }
`

export const Stat: FC<{
  title: string
  tooltip: string
  percent: number
  strokeColor: string
  trailColor: string
  value: string
}> = ({ title, tooltip, percent, strokeColor, trailColor, value }) => {
  return (
    <WRAPPER>
      <TITLE>
        <span>{title}</span>
        <Tooltip>{tooltip}</Tooltip>
      </TITLE>
      <PROGRESS_BAR
        percent={percent}
        showInfo={false}
        strokeWidth={16}
        strokeColor={strokeColor}
        trailColor={trailColor}
      />
      <span>{value}</span>
    </WRAPPER>
  )
}
