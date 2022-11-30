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

const BORDER = styled.div`
  background: linear-gradient(96.79deg, #f7931a 100%, #ac1cc7 100%);
  border-radius: 10px;
  padding: 1px;
`
const ATTRIBUTES_ITEM = styled.div`
  ${tw`overflow-scroll sm:h-full`}
  height: 60px;
  background: linear-gradient(96.79deg, #f7931a 10%, #ac1cc7 97.61%);
  padding: ${({ theme }) => theme.margin(1)};
  border-radius: 10px;

  .ai-title {
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.text30};
  }

  .ai-value {
    font-size: 15px;
    font-weight: 600;
    color: #eee;
  }
`

export const AttributesTabContent: FC<{ data: IAttributesTabItemData[] }> = ({ data, ...rest }) => (
  <ATTRIBUTES_TAB_CONTENT {...rest}>
    {data.map((item, index) => (
      <BORDER key={index}>
        <ATTRIBUTES_ITEM>
          <div className="ai-title">{item.trait_type}</div>
          <div className="ai-value">{item.value}</div>
        </ATTRIBUTES_ITEM>
      </BORDER>
    ))}
  </ATTRIBUTES_TAB_CONTENT>
)
