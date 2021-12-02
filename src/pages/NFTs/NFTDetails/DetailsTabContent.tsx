import { Col, Row } from 'antd'
import { FC } from 'react'
import styled, { css } from 'styled-components'
import { IDetailTabItemData } from '../../../types/nft_details'

const DETAILS_TAB_CONTENT = styled.div`
  ${({ theme }) => css`
    height: 100%;
    padding: ${theme.margins['0.5x']} ${theme.margins['3x']};
    color: ${theme.white};

    .dtc-item {
      padding: ${theme.margins['0.5x']} 0;
      font-size: 14px;
      font-weight: 500;

      .dtc-item-value {
        color: #949494;
      }
    }
  `}
`

export const DetailsTabContent: FC<{ data: IDetailTabItemData[] }> = ({ data, ...rest }) => {
  return (
    <DETAILS_TAB_CONTENT {...rest}>
      {data.map((item, index) => (
        <Row justify="space-between" align="middle" className="dtc-item" key={index}>
          <Col className="dtc-item-title">{item.title}</Col>
          <Col className="dtc-item-value">{item.value}</Col>
        </Row>
      ))}
    </DETAILS_TAB_CONTENT>
  )
}
