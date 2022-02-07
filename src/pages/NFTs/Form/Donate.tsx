import React from 'react'
import { Row, Col } from 'antd'
import styled from 'styled-components'
import { LabelSection } from './LabelSection'

export const STYLED_DONATE = styled(Row)`
  .description {
    font-size: 10px;
    font-weight: 600;
    color: #828282;
  }
  .percents {
    display: flex;
    align-items: center;
    .item {
      height: 32px;
      border-radius: 2px;
      color: ${({ theme }) => theme.text11};
      margin-right: ${({ theme }) => theme.margin(1)};
      font-size: 13px;
      font-weight: 600;
      text-align: center;
      line-height: 30px;
      &.active {
        width: 45px;
        color: #fff;
        background: #9625ae;
      }
    }
  }
`

type Props = {
  className?: string
  label: string
  desc: string
  percents: Array<number>
  selectPercentage: (num: number) => void
}

export const Donate = ({ label, desc, percents, selectPercentage }: Props) => {
  return (
    <STYLED_DONATE align="middle">
      <Col span={12}>
        <LabelSection isIcon label={label} size="20px" />
        <div className="description">{desc}</div>
      </Col>
      <Col span={12}>
        <div className="percents">
          {percents.map((per, index) => (
            <div
              className={`item ${index === 0 ? 'active' : ''}`}
              onClick={(e) => selectPercentage(per)}
            >{`${per}%`}</div>
          ))}
        </div>
      </Col>
    </STYLED_DONATE>
  )
}
