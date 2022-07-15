import React, { FC, ReactNode } from 'react'
import { Tooltip as ANTDTooltip } from 'antd'
import { TooltipPlacement } from 'antd/lib/tooltip'
import styled from 'styled-components'
import { useDarkMode } from '../context'
import { CenteredImg } from '../styles'

const ICON = styled(CenteredImg)<{ notDoxxed?: boolean }>`
  ${({ theme, notDoxxed }) => !notDoxxed && theme.measurements(theme.margin(1.5))}
  margin-left: ${({ theme }) => theme.margin(1)};

  @media(max-width: 500px){
    height: 18px;
    width: 18px;
    margin-left: 6px;
  }
`

const TEXT = styled.span`
  font-size: 10px;
  color: white;
  padding-bottom: 10px;
`

export const Tooltip: FC<{
  dark?: boolean
  lite?: boolean
  placement?: TooltipPlacement
  color?: string
  children: ReactNode
  notInherit?: boolean
}> = ({ dark, lite, placement = 'topLeft', color = '#4b4b4b', children, notInherit }) => {
  const { mode } = useDarkMode()

  const icon = `/img/assets/tooltip_${dark ? 'dark' : lite ? 'lite' : mode}_mode_icon.svg`

  return (
    <ANTDTooltip
      arrowPointAtCenter
      color={color}
      overlayInnerStyle={{
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        padding: '8px 8px 0',
        maxWidth: '132px'
      }}
      placement={placement}
      title={<TEXT>{children}</TEXT>}
    >
      <ICON notDoxxed={!!notInherit}>
        <img src={icon} alt="tooltip" />
      </ICON>
    </ANTDTooltip>
  )
}
