import React, { FC, ReactNode } from 'react'
import { Tooltip as ANTDTooltip } from 'antd'
import { TooltipPlacement } from 'antd/lib/tooltip'
import styled from 'styled-components'
import { useDarkMode } from '../context'
import { CenteredImg } from '../styles'

const ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margins['1.5x'])}
  margin-left: ${({ theme }) => theme.margins['1x']};
`

const TEXT = styled.span`
  font-size: 10px;
  color: white;
`

export const Tooltip: FC<{
  dark?: boolean
  lite?: boolean
  placement?: TooltipPlacement
  color?: string
  children: ReactNode
}> = ({ dark, lite, placement = 'topLeft', color = '#4b4b4b', children }) => {
  const { mode } = useDarkMode()

  const icon = `${process.env.PUBLIC_URL}/img/assets/tooltip_${dark ? 'dark' : lite ? 'lite' : mode}_mode_icon.svg`

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
      <ICON>
        <img src={icon} alt="tooltip" />
      </ICON>
    </ANTDTooltip>
  )
}
