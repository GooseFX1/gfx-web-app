import { FC } from 'react'
import styled from 'styled-components'
import { IAttributesTabItemData } from '../../../types/nft_details'

const ATTRIBUTES_TAB_CONTENT = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(auto, 50%));
  grid-gap: ${({ theme }) => theme.margins['1.5x']};
  padding: ${({ theme }) => `${theme.margins['2x']} ${theme.margins['3x']}`};
  height: 100%;
  color: #fff;
  overflow-y: auto;
`

const ATTRIBUTES_ITEM = styled.div`
  height: 60px;
  border-radius: 10px;
  background-color: #2a2a2a;
  padding: ${({ theme }) => theme.margins['1x']};

  .ai-title {
    font-size: 11px;
    font-weight: 500;
    color: #616161;
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
      {data.map((item) => (
        <ATTRIBUTES_ITEM>
          <div className="ai-title">{item.title}</div>
          <div className="ai-value">{item.value}</div>
        </ATTRIBUTES_ITEM>
      ))}
    </ATTRIBUTES_TAB_CONTENT>
  )
}
