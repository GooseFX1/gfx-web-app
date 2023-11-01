import { Dispatch, FC, SetStateAction } from 'react'
import { checkMobile } from '../../utils'
import { PopupCustom } from '../NFTs/Popup/PopupCustom'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { Button } from '../../components'
import { SSLToken } from './constants'

const STYLED_POPUP = styled(PopupCustom)`
  .ant-modal-content {
    ${tw`h-full dark:bg-black-2 bg-white rounded-bigger`}
  }
  .ant-modal-close-x {
    > img {
      ${tw`sm:!h-4 sm:!w-4 absolute bottom-2 opacity-60`}
    }
  }
  .ant-modal-body {
    ${tw`p-5 sm:p-[15px]`}
  }
`

const WRAPPER = styled.div``

export const WithdrawModal: FC<{
  withdrawModal: boolean
  setWithdrawModal: Dispatch<SetStateAction<boolean>>
  handleWithdraw: any
  isButtonLoading: boolean
  withdrawAmount: number
  token: SSLToken
}> = ({ withdrawModal, setWithdrawModal, handleWithdraw, isButtonLoading, withdrawAmount, token }) => (
  <STYLED_POPUP
    height={checkMobile() ? '300px' : '250px'}
    width={checkMobile() ? '95%' : '560px'}
    title={null}
    centered={true}
    visible={withdrawModal ? true : false}
    onCancel={() => setWithdrawModal(false)}
    footer={null}
  >
    <WRAPPER>
      <div tw="dark:text-grey-5 text-grey-1 text-lg font-semibold mb-3.75 text-center sm:text-average">
        Are you sure you want to {checkMobile() && <br />} withdraw?
      </div>
      <div tw="dark:text-grey-2 text-grey-1 text-regular font-semibold text-center mb-3 sm:text-tiny">
        By withdrawing you will claim any pending yield available.
      </div>
      <div tw="flex flex-row items-center justify-between mb-3.75">
        <div tw="dark:text-grey-2 text-grey-1 text-regular font-semibold">Withdraw Amount</div>
        <div tw="dark:text-grey-5 text-black-4 text-regular font-semibold">{`${withdrawAmount} ${token?.token}`}</div>
      </div>
      <Button
        height="35px"
        cssStyle={tw`duration-500 w-[530px] sm:w-[100%] !h-8.75 bg-blue-1 text-regular border-none mx-auto my-3.75
                    !text-white font-semibold rounded-[50px] flex items-center justify-center outline-none`}
        onClick={handleWithdraw}
        loading={isButtonLoading}
      >
        {`Withdraw ${withdrawAmount} ${token?.token}`}
      </Button>
      <div
        tw="text-center text-red-2 font-bold text-regular cursor-pointer mb-2.5"
        onClick={() => setWithdrawModal(false)}
      >
        Cancel
      </div>
      <div tw="text-regular dark:text-grey-2 text-grey-1 text-tiny font-semibold text-center">
        By withdrawing, you agree to our Terms of Service.
      </div>
    </WRAPPER>
  </STYLED_POPUP>
)
