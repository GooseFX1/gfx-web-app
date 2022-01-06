import { Row } from 'antd'
import { FC } from 'react'
import styled, { css } from 'styled-components'
import { IRemainingPanelData } from '../../../types/nft_details'

const REMAINING_PANEL = styled(Row)`
  ${({ theme }) => css`
    width: 100%;
    padding: ${theme.margins['2x']} ${theme.margins['4.5x']};
    background-color: ${theme.timePanelBackground};
    ${theme.largeBorderRadius}
    color: ${theme.text7};

    .rp-bubble {
      font-size: 18px;
      font-weight: 500;
      border-radius: 50%;
      background-color: ${theme.bg0};
      width: 40px;
      height: 40px;
    }

    .rp-text {
      font-size: 12px;
      font-weight: 600;
      margin-left: ${theme.margins['1x']};
      color: ${theme.text7};
    }
  `}
`

export const TimePanel: FC<{ time: IRemainingPanelData }> = ({ time, ...rest }) => {
  return (
    <REMAINING_PANEL justify="space-between" {...rest}>
      <Row align="middle">
        <Row justify="center" align="middle" className="rp-bubble">
          {time?.days}
        </Row>
        <div className="rp-text">Days</div>
      </Row>
      <Row align="middle">
        <Row justify="center" align="middle" className="rp-bubble">
          {time?.hours}
        </Row>
        <div className="rp-text">Hours</div>
      </Row>
      <Row align="middle">
        <Row justify="center" align="middle" className="rp-bubble">
          {time?.minutes}
        </Row>
        <div className="rp-text">Minutes</div>
      </Row>
    </REMAINING_PANEL>
  )
}
