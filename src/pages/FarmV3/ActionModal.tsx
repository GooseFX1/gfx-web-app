import { Dispatch, FC, SetStateAction, useCallback } from 'react'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { Button, PopupCustom } from '../../components'
import { SSLToken } from './constants'
import { commafy } from '../../utils'
import { Drawer } from 'antd'
import useBreakPoint from '../../hooks/useBreakPoint'
import { useDarkMode } from '../../context'

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

export const ActionModal: FC<{
  actionModal: boolean
  setActionModal: Dispatch<SetStateAction<boolean>>
  handleWithdraw: any
  handleDeposit: any
  handleClaim: any
  isButtonLoading: boolean
  withdrawAmount: string
  depositAmount: string
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
  const { mode } = useDarkMode()
  const breakpoint = useBreakPoint()
  const elem = document.getElementById('farm-container')

  const handleUserAction = () => {
    if (actionType === 'deposit') handleDeposit()
    else if (actionType === 'withdraw') handleWithdraw()
    else handleClaim()
  }

  const Content = useCallback(
    () => (
      <div>
        <div tw="dark:text-grey-5 text-grey-1 text-lg font-semibold mb-3.75 text-center sm:text-average">
          {actionType === 'withdraw' ? (
            <div>Are you sure you want to {breakpoint.isMobile && <br />} withdraw?</div>
          ) : actionType === 'deposit' ? (
            <div>Deposit {token?.token} </div>
          ) : (
            <div>Claim {token?.token}</div>
          )}
        </div>
        <div tw="dark:text-grey-2 text-grey-1 text-regular font-semibold text-center mb-3 sm:text-tiny">
          {actionType === 'withdraw' ? (
            <div>By withdrawing, you will claim any pending yield available.</div>
          ) : actionType === 'deposit' ? (
            <div>By depositing, you will claim any pending yield available.</div>
          ) : (
            <div>By claiming, you will get all pending yield available. </div>
          )}
        </div>
        {actionType !== 'claim' && (
          <div tw="flex flex-row items-center justify-between mb-3.75">
            <div tw="dark:text-grey-2 text-grey-1 text-regular font-semibold">
              {<div>{actionType === 'deposit' ? 'Deposit' : 'Withdraw'} Amount</div>}
            </div>
            <div tw="dark:text-grey-5 text-black-4 text-regular font-semibold">{`${
              actionType === 'deposit'
                ? depositAmount
                  ? commafy(+depositAmount, 4)
                  : '00.00'
                : withdrawAmount
                ? commafy(+withdrawAmount, 4)
                : '00.00'
            } ${token?.token}`}</div>
          </div>
        )}
        <div tw="flex flex-row items-center justify-between mb-3.75">
          <div tw="dark:text-grey-2 text-grey-1 text-regular font-semibold">Claimable yield</div>
          <div tw="dark:text-grey-5 text-black-4 text-regular font-semibold">{`${
            claimAmount ? `${commafy(claimAmount, 4)} ${token?.token}` : `00.00 ${token?.token}`
          }`}</div>
        </div>
        <Button
          height="35px"
          cssStyle={tw`duration-500 w-[530px] sm:w-[100%] !h-8.75 bg-blue-1 text-regular border-none mx-auto my-3.75
                    !text-white font-semibold rounded-[50px] flex items-center justify-center outline-none`}
          onClick={handleUserAction}
          loading={isButtonLoading}
          disabled={
            (actionType === 'claim' && !claimAmount) ||
            (actionType === 'deposit' && !depositAmount) ||
            (actionType === 'withdraw' && !withdrawAmount)
          }
          disabledColor={tw`dark:bg-black-1 bg-grey-5 !text-grey-1 opacity-70`}
        >
          {`${
            actionType === 'deposit'
              ? `Deposit ${commafy(+depositAmount, 4)} ${token?.token} + Claim yield`
              : actionType === 'withdraw'
              ? `Withdraw ${commafy(+withdrawAmount + claimAmount, 4)} ${token?.token}`
              : `${claimAmount ? `${commafy(claimAmount, 4)} ${token?.token}` : '00.00 ' + token?.token}`
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
      </div>
    ),
    [breakpoint, mode]
  )

  return breakpoint.isMobile ? (
    <Drawer
      title={null}
      placement="bottom"
      closable={false}
      key="bottom"
      open={actionModal}
      getContainer={elem}
      maskClosable={true}
      height="auto"
      destroyOnClose={true}
      className={'gfx-drawer'}
    >
      {Content()}
    </Drawer>
  ) : (
    <STYLED_POPUP
      height={
        breakpoint.isMobile
          ? actionType === 'withdraw'
            ? '320px'
            : actionType === 'claim'
            ? '250px'
            : '275px'
          : actionType === 'claim'
          ? '250px'
          : '295px'
      }
      width={'560px'}
      title={null}
      centered={true}
      visible={actionModal ? true : false}
      onCancel={() => setActionModal(false)}
      footer={null}
    >
      {Content()}
    </STYLED_POPUP>
  )
}
