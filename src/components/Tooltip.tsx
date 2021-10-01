import React, { FC, ReactNode } from 'react'
import { Tooltip as ANTDTooltip } from 'antd'
import { TooltipPlacement } from 'antd/lib/tooltip'
import styled from 'styled-components'
import { useDarkMode } from '../context'
import { CenteredImg, MainText } from '../styles'

const ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margins['1.5x'])}
  margin-left: ${({ theme }) => theme.margins['1x']};
`

const TEXT = MainText(
  styled.span`
    font-size: 10px;
  `,
  'white'
)


export const Tooltip: FC<{
  placement?: TooltipPlacement
  children: ReactNode
}> = ({ placement = 'topLeft', children }) => {
  const { mode } = useDarkMode()

  return (
    <ANTDTooltip
      arrowPointAtCenter
      color="#4b4b4b"
      overlayInnerStyle={{ borderRadius: '8px', display: 'flex', alignItems: 'center', padding: '8px' }}
      placement={placement}
      title={
        <TEXT>
          {children}
        </TEXT>
      }
    >
      <ICON>
        <img src={`${process.env.PUBLIC_URL}/img/assets/tooltip_${mode}_mode_icon.svg`} alt="tooltip" />
      </ICON>
    </ANTDTooltip>
  )
}
