import { FC } from 'react'
import styled, { css } from 'styled-components'
import { IAttributesTabItemData } from '../../../types/nft_details'

const ATTRIBUTES_TAB_CONTENT = styled.div`
  ${({ theme }) => css`
    display: grid;
    grid-template-columns: repeat(2, minmax(auto, 50%));
    grid-gap: ${theme.margins['1.5x']};
    padding: ${theme.margins['2x']} ${theme.margins['3x']};
    height: 100%;
    color: #fff;
    overflow-y: auto;
  `}
`

const ATTRIBUTES_ITEM = styled.div`
  height: 60px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.atrributeBg};
  padding: ${({ theme }) => theme.margins['1x']};

  .ai-title {
    font-size: 11px;
    font-weight: 500;
    color: ${({ theme }) => theme.text9};
    background-color: ${({ theme }) => theme.atrributeBg};
  }

  .ai-value {
    font-size: 12px;
    font-weight: 600;
    color: #fff;
  }
`

export const AttributesTabContent: FC<{ data: IAttributesTabItemData[] }> = ({ data, ...rest }) => {
  return (
    <ATTRIBUTES_TAB_CONTENT {...rest}>
      {data.map((item, index) => (
        <ATTRIBUTES_ITEM key={index}>
          <div className="ai-title">{item.title}</div>
          <div className="ai-value">{item.value}</div>
        </ATTRIBUTES_ITEM>
      ))}
    </ATTRIBUTES_TAB_CONTENT>
  )
}
