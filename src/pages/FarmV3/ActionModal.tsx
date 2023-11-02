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

const WRAPPER = styled.div`
  .header {
    ${tw`dark:text-grey-5 text-grey-1 text-lg font-semibold mb-3.75 text-center sm:text-average`}
  }
  .sub-header {
    ${tw`dark:text-grey-2 text-grey-1 text-regular font-semibold text-center mb-3 sm:text-tiny`}
  }
`

export const ActionModal: FC<{
  actionModal: boolean
  setActionModal: Dispatch<SetStateAction<boolean>>
  handleWithdraw: any
  handleDeposit: any
  handleClaim: any
  isButtonLoading: boolean
  withdrawAmount: number
  depositAmount: number
  claimAmount: number
  actionType: string
  token: SSLToken
}> = ({
  actionModal,
  setActionModal,
  handleWithdraw,
  handleDeposit,
  handleClaim,
  isButtonLoading,
  withdrawAmount,
  depositAmount,
  claimAmount,
  actionType,
  token
}) => {
  const handleUserAction = () => {
    if (actionType === 'deposit') handleDeposit()
    else if (actionType === 'withdraw') handleWithdraw()
    else handleClaim()
  }

  return (
    <STYLED_POPUP
      height={
        checkMobile()
          ? actionType === 'withdraw'
            ? '320px'
            : actionType === 'claim'
            ? '250px'
            : '275px'
          : actionType === 'claim'
          ? '250px'
          : '295px'
      }
      width={checkMobile() ? '95%' : '560px'}
      title={null}
      centered={true}
      visible={actionModal ? true : false}
      onCancel={() => setActionModal(false)}
      footer={null}
    >
      <WRAPPER>
        <div>
          {actionType === 'withdraw' ? (
            <div className="header">Are you sure you want to {checkMobile() && <br />} withdraw?</div>
          ) : actionType === 'deposit' ? (
            <div className="header">Deposit {token?.token} </div>
          ) : (
            <div className="header">Claim {token?.token}</div>
          )}
        </div>
        <div>
          {actionType === 'withdraw' ? (
            <div className="sub-header">By withdrawing, you will claim any pending yield available.</div>
          ) : actionType === 'deposit' ? (
            <div className="sub-header">By depositing, you will claim any pending yield available.</div>
          ) : (
            <div className="sub-header">By claimimg, you will get all pending yield available. </div>
          )}
        </div>
        {actionType !== 'claim' && (
          <div tw="flex flex-row items-center justify-between mb-3.75">
            <div tw="dark:text-grey-2 text-grey-1 text-regular font-semibold">
              {<div>{actionType === 'deposit' ? 'Deposit' : 'Withdraw'} Amount</div>}
            </div>
            <div tw="dark:text-grey-5 text-black-4 text-regular font-semibold">{`${
              actionType === 'deposit' ? depositAmount : withdrawAmount
            } ${token?.token}`}</div>
          </div>
        )}
        <div tw="flex flex-row items-center justify-between mb-3.75">
          <div tw="dark:text-grey-2 text-grey-1 text-regular font-semibold">Claimable rewards</div>
          <div tw="dark:text-grey-5 text-black-4 text-regular font-semibold">{`${
            claimAmount + ' ' + token?.token
          }`}</div>
        </div>
        <Button
          height="35px"
          cssStyle={tw`duration-500 w-[530px] sm:w-[100%] !h-8.75 bg-blue-1 text-regular border-none mx-auto my-3.75
                    !text-white font-semibold rounded-[50px] flex items-center justify-center outline-none`}
          onClick={handleUserAction}
          loading={isButtonLoading}
          disabled={actionType === 'claim' && claimAmount === 0}
          disabledColor={tw`dark:bg-black-1 bg-grey-5 !text-grey-1 opacity-70`}
        >
          {`${
            actionType === 'deposit'
              ? `Deposit ${depositAmount} ${token?.token} + Claim rewards`
              : actionType === 'withdraw'
              ? `Withdraw ${withdrawAmount + claimAmount} ${token?.token}`
              : `${claimAmount + ' ' + token?.token}`
          }`}
        </Button>
        <div
          tw="text-center text-red-2 font-bold text-regular cursor-pointer mb-2.5"
          onClick={() => setActionModal(false)}
        >
          Cancel
        </div>
        <div tw="text-regular dark:text-grey-2 text-grey-1 text-tiny font-semibold text-center">
          By withdrawing, you agree to our Terms of Service.
        </div>
      </WRAPPER>
    </STYLED_POPUP>
  )
}
