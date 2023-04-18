import { useDarkMode } from '../../../context'
import { checkMobile } from '../../../utils'
import React, { FC } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { PopupCustom } from '../Popup/PopupCustom'

export const STYLED_POPUP = styled(PopupCustom)`
  ${tw`flex flex-col `}
  .ant-modal-close-x {
    img {
      ${tw`hidden`}
    }
  }

  &.ant-modal {
    ${tw`max-w-full sm:bottom-[-10px] sm:mt-auto sm:absolute sm:h-[600px]`}
    background-color: ${({ theme }) => theme.bg26};
  }
  color: ${({ theme }) => theme.text20};
  .holdTightText {
    color: ${({ theme }) => theme.text30};
    ${tw`text-[35px] font-semibold mt-[70px]`}
  }
`

export const HoldTight: FC<{ isLoading: boolean; setLoading: any }> = ({ isLoading, setLoading }) => {
  const { mode } = useDarkMode()

  return (
    <STYLED_POPUP
      height={checkMobile() ? '655px' : '780px'}
      width={checkMobile() ? '100%' : '580px'}
      title={null}
      onCancle={() => (isLoading ? null : setLoading(false))}
      visible={isLoading ? true : false}
      footer={null}
    >
      <div tw="flex flex-col mt-[33%] items-center justify-center">
        <div>
          <img src={`/img/assets/nft-preview-${mode}.svg`} tw="h-[180px] w-[180px]" alt="nft-preview" />
        </div>
        <div className="holdTightText">Hold tight!</div>
        <div tw="text-[25px] font-semibold mt-4 ">We are almost there</div>
      </div>
    </STYLED_POPUP>
  )
}
