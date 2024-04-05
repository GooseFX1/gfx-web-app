import { Dispatch, FC, SetStateAction, useCallback, useEffect, useMemo } from 'react'
import { SSLToken } from './constants'
import { truncateBigNumber } from '../../utils'
import useBreakPoint from '../../hooks/useBreakPoint'
import { useDarkMode } from '../../context'
import { Button, cn, Dialog, DialogBody, DialogContent, DialogOverlay, IconTooltip } from 'gfx-component-lib'

//milliseconds in 5 minutes to be used to update the countdown every 5 minutes
const TIMER = 300 * 1000
//
// const STYLED_POPUP = styled(PopupCustom)`
//   .ant-modal-content {
//     ${tw`h-full dark:bg-black-2 bg-white rounded-bigger`}
//   }
//   .ant-modal-close-x {
//     > img {
//       ${tw`sm:!h-4 sm:!w-4 absolute bottom-2 opacity-60`}
//     }
//   }
//   .ant-modal-body {
//     ${tw`p-5 sm:p-[15px]`}
//   }
//   .tooltipIcon {
//     ${tw`h-4 w-4 max-w-none ml-0`}
//   }
// `

export const ActionModal: FC<{
  actionModal: boolean
  setActionModal: Dispatch<SetStateAction<boolean>>
  handleWithdraw: any
  handleDeposit: any
  handleClaim: any
  handleCancel: () => void
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
  handleCancel,
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
      <div className="w-full h-full flex flex-col justify-between">
        <div>
          <div
            className="absolute right-[25px] text-[25px] cursor-pointer"
            onClick={() => {
              setActionModal(false)
            }}
          >
            <img key={`close-mobile-button`} src={`/img/mainnav/close-thin-${mode}.svg`} alt="close-icon" />
          </div>

          <div className="dark:text-grey-8 text-black-4 text-lg font-semibold mb-3.75 sm:text-average">
            {actionType === 'withdraw' ? (
              <h3>Withdraw</h3>
            ) : actionType === 'deposit' ? (
              <h3>Deposit </h3>
            ) : (
              <h3>Claim</h3>
            )}
          </div>
          <div className="dark:text-grey-2 text-grey-1 text-regular font-semibold mb-3 sm:text-tiny">
            <h5>
              {' '}
              By
              {actionType === 'withdraw'
                ? ' withdrawing, you will claim any '
                : actionType === 'deposit'
                ? ' depositing, you will claim any '
                : ' claiming, you will get all '}
              pending yield available
            </h5>
          </div>
          {actionType !== 'claim' && (
            <div className="flex flex-row items-center justify-between mb-3.75">
              <div className="dark:text-grey-2 text-grey-1 text-regular font-semibold">
                {<div>{actionType === 'deposit' ? 'Deposit' : 'Withdraw'} Amount</div>}
              </div>
              <div className="dark:text-grey-5 text-black-4 text-regular font-semibold">{`${
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
          <div className="flex flex-row items-center justify-between mb-3.75">
            <div className="dark:text-grey-2 text-grey-1 text-regular font-semibold">Claimable yield</div>
            <div className="dark:text-grey-5 text-black-4 text-regular font-semibold">
              {`${claimAmount ? `${truncateBigNumber(claimAmount)} ${token?.token}` : `00.00 ${token?.token}`}`}
            </div>
          </div>
          {actionType === 'withdraw' && earlyWithdrawFee > 0 && (
            <div className="flex flex-row items-center justify-between mb-3.75">
              <div className="flex flex-row">
                <div className="dark:text-grey-2 text-grey-1 text-regular font-semibold">Early Withdraw Fee</div>
                <IconTooltip
                  tooltipType={'outline'}
                  tooltipClassName={'h-4 w-4 max-w-none ml-1'}
                  // color={mode === 'dark' ? '#FFF' : '#1C1C1C'}
                >
                  <span className="dark:text-black-4 text-grey-8 font-semibold text-tiny">
                    The early withdrawal penalty fee is to prevent manipulation of our pools by LPs. Please wait{' '}
                    {getTimerCountdown} to avoid paying the fee.
                  </span>
                </IconTooltip>
              </div>
              <div className="dark:text-grey-5 text-black-4 text-regular font-semibold">
                {earlyWithdrawFee ? truncateBigNumber(earlyWithdrawFee) + ' ' + token?.token : 0}
              </div>
            </div>
          )}
        </div>
        <div>
          <Button
            fullWidth
            colorScheme={'blue'}
            className={`duration-500`}
            onClick={handleUserAction}
            loading={isButtonLoading}
            disabled={
              (actionType === 'claim' && !claimAmount) ||
              (actionType === 'deposit' && !depositAmount) ||
              (actionType === 'withdraw' && !withdrawAmount)
            }
          >
            {`${
              actionType === 'deposit'
                ? `Deposit ${truncateBigNumber(+depositAmount)} ${token?.token} + Claim Yield`
                : actionType === 'withdraw'
                ? `Withdraw ${truncateBigNumber(+withdrawAmount + claimAmount - earlyWithdrawFee)} ${token?.token}`
                : `${claimAmount ? `${truncateBigNumber(claimAmount)} ${token?.token}` : '00.00 ' + token?.token}`
            }`}
          </Button>
          <Button
            variant={'link'}
            colorScheme={'red'}
            fullWidth
            onClick={() => {
              handleCancel()
              setActionModal(false)
            }}
          >
            Cancel
          </Button>
          <div className="text-regular dark:text-grey-2 text-grey-1 text-tiny font-semibold text-center">
            By {actionType === 'withdraw' ? 'withdrawing' : actionType === 'deposit' ? 'depositing' : 'claiming'},
            you agree to our{' '}
            <a
              href="https://www.goosefx.io/terms"
              target={'_blank'}
              rel={'noreferrer'}
              className="text-tiny font-semibold underline dark:text-white text-blue-1"
            >
              Terms of Service
            </a>
            .
          </div>
        </div>
      </div>
    ),
    [breakpoint, mode, isButtonLoading, diffTimer]
  )
  return (
    <Dialog open={actionModal}>
      <DialogOverlay />
      <DialogContent
        className={cn(
          'w-full min-lg:w-[560px] sm:rounded-b-none p-6',
          breakpoint.isMobile
            ? actionType === 'withdraw'
              ? 'h-[320px]'
              : actionType === 'claim'
              ? 'h-[250px]'
              : 'h-[275px]'
            : actionType === 'claim'
            ? 'h-[250px]'
            : actionType === 'withdraw' && earlyWithdrawFee > 0
            ? 'h-[330px]'
            : 'h-[295px]'
        )}
        placement={breakpoint.isMobile ? 'bottom' : 'default'}
      >
        <DialogBody className={'w-full mx-auto'}>{Content()}</DialogBody>
      </DialogContent>
    </Dialog>
  )
}
