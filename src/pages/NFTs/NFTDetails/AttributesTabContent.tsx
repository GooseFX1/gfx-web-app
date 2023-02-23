/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from 'react'
import styled, { css } from 'styled-components'
import { IAttributesTabItemData } from '../../../types/nft_details'
import tw from 'twin.macro'
import 'styled-components/macro'
import { useDarkMode } from '../../../context'

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
  opacity: 0.5;
  padding: ${({ theme }) => theme.margin(1)};
  border-radius: 10px;
  overflow: hidden;
`
const trimString = (str: string) => (str.length > 20 ? str.substring(0, 20) + '...' : str)

export const AttributesTabContent: FC<{ data: IAttributesTabItemData[] }> = ({ data, ...rest }) => {
  const { mode } = useDarkMode()
  return (
    <ATTRIBUTES_TAB_CONTENT {...rest}>
      {data.map((item, index) => (
        <PILL_SECONDARY $mode={`${mode}`} key={index}>
          <div className="layer">
            <div tw="text-[13px] font-medium">{item.trait_type} </div>
            <div>{trimString(item.value)}</div>
          </div>
        </PILL_SECONDARY>
      ))}
    </ATTRIBUTES_TAB_CONTENT>
  )
}

const PILL_SECONDARY = styled.div<{ $mode: string }>`
  background: ${({ $mode }) =>
    $mode === 'dark'
      ? 'linear-gradient(96deg, #f7931a 1%, #ac1cc7 99%)'
      : `linear-gradient(to bottom, rgba(116, 116, 116, 0.2), rgba(116, 116, 116, 0.2)), 
      linear-gradient(to right, #f7931a 1%, #e03cff 100%), linear-gradient(96deg, #f7931a 1%, #ac1cc7 99%)`};
  ${tw`rounded-[5px] h-[45px] p-[2px] text-[#fff] w-[174px]`}

  .layer {
    height: 100%;
    ${tw`flex flex-col font-semibold text-[15px] items-start pl-2 w-[170px] leading-[18px]`}
    align-items: left;
    background: ${({ $mode }) => ($mode === 'dark' ? '#3c3b3ba6' : '#ffffff57')};
    border-radius: 5px;
    filter: drop-shadow(0px 6px 9px rgba(36, 36, 36, 0.15));
  }
`
