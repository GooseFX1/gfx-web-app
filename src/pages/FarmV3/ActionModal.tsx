import { Dispatch, FC, SetStateAction, useCallback, useEffect, useMemo } from 'react'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { Button, PopupCustom } from '../../components'
import { SSLToken } from './constants'
import { checkMobile, commafy, truncateBigNumber } from '../../utils'
import { Drawer } from 'antd'
import useBreakPoint from '../../hooks/useBreakPoint'
import { useDarkMode } from '../../context'
import { Tooltip } from 'antd'

//milliseconds in 5 minutes to be used to update the countdown every 5 minutes
const TIMER = 300 * 1000

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
  .tooltipIcon {
    ${tw`h-4 w-4 max-w-none ml-0`}
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
  earlyWithdrawFee: number
  diffTimer: number
  setDiffTimer: Dispatch<SetStateAction<number>>
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
  token,
  earlyWithdrawFee,
  diffTimer,
  setDiffTimer
}) => {
  const { mode } = useDarkMode()
  const breakpoint = useBreakPoint()
  const elem = document.getElementById('farm-container')

  const handleUserAction = () => {
    console.log('handle user action', actionType)
    if (actionType === 'deposit') handleDeposit()
    else if (actionType === 'withdraw') handleWithdraw(+withdrawAmount - earlyWithdrawFee)
    else handleClaim()
  }

  const getTimerCountdown = useMemo(() => {
    const sec = diffTimer % 60
    const min = ((diffTimer - sec) / 60) % 60
    const hr = Math.floor(diffTimer / 3600)
    return (
      <span tw="text-red-2 font-semibold text-tiny">{`${hr}H:${min ? (min < 10 ? `0${min}` : min) : '00'}M`}</span>
    )
  }, [diffTimer])

  useEffect(() => {
    const interval = setTimeout(() => {
      setDiffTimer((prev) => prev - 300)
    }, TIMER)

    if (diffTimer === 0) clearTimeout(interval)

    return () => clearInterval(interval)
  }, [diffTimer])

  const Content = useCallback(
    () => (
      <div>
        {breakpoint.isMobile && (
          <div
            tw="absolute right-[25px] text-[25px] cursor-pointer"
            onClick={() => {
              setActionModal(false)
            }}
          >
            <img key={`close-mobile-button`} src={`/img/mainnav/close-thin-${mode}.svg`} alt="close-icon" />
          </div>
        )}
        <div tw="dark:text-grey-8 text-black-4 text-lg font-semibold mb-3.75 sm:text-average">
          {actionType === 'withdraw' ? (
            <div>Withdraw</div>
          ) : actionType === 'deposit' ? (
            <div>Deposit </div>
          ) : (
            <div>Claim</div>
          )}
        </div>
        <div tw="dark:text-grey-2 text-grey-1 text-regular font-semibold mb-3 sm:text-tiny">
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
                  ? truncateBigNumber(+depositAmount)
                  : '00.00'
                : withdrawAmount
                ? truncateBigNumber(+withdrawAmount)
                : '00.00'
            } ${token?.token}`}</div>
          </div>
        )}
        <div tw="flex flex-row items-center justify-between mb-3.75">
          <div tw="dark:text-grey-2 text-grey-1 text-regular font-semibold">Claimable yield</div>
          <div tw="dark:text-grey-5 text-black-4 text-regular font-semibold">
            {`${claimAmount ? `${truncateBigNumber(claimAmount)} ${token?.token}` : `00.00 ${token?.token}`}`}
          </div>
        </div>
        {actionType === 'withdraw' && earlyWithdrawFee > 0 && (
          <div tw="flex flex-row items-center justify-between mb-3.75">
            <div tw="flex flex-row">
              <div tw="dark:text-grey-2 text-grey-1 text-regular font-semibold">Early Withdraw Fee</div>
              <Tooltip
                color={mode === 'dark' ? '#FFF' : '#1C1C1C'}
                title={
                  <span tw="dark:text-black-4 text-grey-8 font-semibold text-tiny">
                    The early withdrawal penalty fee is to prevent manipulation of our pools by LPs. Please wait{' '}
                    {getTimerCountdown} to avoid paying the fee.
                  </span>
                }
                placement={checkMobile() ? 'topRight' : 'rightBottom'}
                overlayClassName={mode === 'dark' ? 'farm-tooltip dark' : 'farm-tooltip'}
                overlayInnerStyle={{ borderRadius: '8px' }}
              >
                <img
                  src={mode === 'dark' ? '/img/assets/tooltip_holo.svg' : '/img/assets/tooltip_blue.svg'}
                  alt="deposit-cap"
                  tw="ml-2.5 sm:ml-1.25 max-w-none cursor-pointer"
                  height={20}
                  width={20}
                />
              </Tooltip>
            </div>
            <div tw="dark:text-grey-5 text-black-4 text-regular font-semibold">
              {earlyWithdrawFee ? truncateBigNumber(earlyWithdrawFee) + ' ' + token?.token : 0}
            </div>
          </div>
        )}
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
              ? `Deposit ${commafy(+depositAmount, 2)} ${token?.token} + Claim Yield`
              : actionType === 'withdraw'
              ? `Withdraw ${commafy(+withdrawAmount + claimAmount - earlyWithdrawFee, 2)} ${token?.token}`
              : `${claimAmount ? `${commafy(claimAmount, 2)} ${token?.token}` : '00.00 ' + token?.token}`
          }`}
        </Button>
        <div
          tw="text-center text-red-2 font-bold text-regular cursor-pointer mb-2.5"
          onClick={() => setActionModal(false)}
        >
          Cancel
        </div>
        <div tw="text-regular dark:text-grey-2 text-grey-1 text-tiny font-semibold text-center">
          By {actionType === 'withdraw' ? 'withdrawing' : actionType === 'deposit' ? 'depositing' : 'claiming'},
          you agree to our{' '}
          <a
            href="https://www.goosefx.io/terms"
            target={'_blank'}
            rel={'noreferrer'}
            tw="text-tiny font-semibold underline dark:text-white text-blue-1"
          >
            Terms of Service
          </a>
          .
        </div>
      </div>
    ),
    [breakpoint, mode, isButtonLoading, diffTimer]
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
          : actionType === 'withdraw' && earlyWithdrawFee > 0
          ? '330px'
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
