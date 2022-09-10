import { FC } from 'react'
import styled, { css } from 'styled-components'
import { IAttributesTabItemData } from '../../../types/nft_details'
import tw from 'twin.macro'

const ATTRIBUTES_TAB_CONTENT = styled.div`
  ${({ theme }) => css`
    display: grid;
    grid-template-columns: repeat(2, minmax(auto, 50%));
    grid-gap: ${theme.margin(1.5)};
    padding: ${theme.margin(2)} ${theme.margin(3)};
    height: 100%;
    color: #fff;
    overflow-y: auto;
  `}
`

const ATTRIBUTES_ITEM = styled.div`
  ${tw`overflow-scroll`}
  height: 60px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.atrributeBg};
  padding: ${({ theme }) => theme.margin(1)};

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

export const AttributesTabContent: FC<{ data: IAttributesTabItemData[] }> = ({ data, ...rest }) => (
  <ATTRIBUTES_TAB_CONTENT {...rest}>
    {data.map((item, index) => (
      <ATTRIBUTES_ITEM key={index}>
        <div className="ai-title">{item.trait_type}</div>
        <div className="ai-value">{item.value}</div>
      </ATTRIBUTES_ITEM>
    ))}
  </ATTRIBUTES_TAB_CONTENT>
)
