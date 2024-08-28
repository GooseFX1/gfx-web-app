import { Dispatch, FC, SetStateAction, useMemo } from 'react'
import { TERMS_OF_SERVICE } from '../../constants'
import { truncateBigNumber, truncateBigString } from '../../utils'
import useBreakPoint from '../../hooks/useBreakPoint'
import { useDarkMode } from '../../context'
import { Button, cn, Dialog, DialogBody, DialogContent, DialogOverlay, IconTooltip } from 'gfx-component-lib'
import BigNumber from 'bignumber.js'
import { PropsWithKey } from '@/pages/TradeV3/mobile/PlaceOrderMobi'
//milliseconds in 5 minutes to be used to update the countdown every 5 minutes
const TIMER = 300 * 1000

export const GAMMAActionModal: FC<PropsWithKey<{
  actionModal: boolean
  setActionModal: Dispatch<SetStateAction<boolean>>
  handleWithdraw: (BigNumber) => void
  handleDeposit: () => void
  handleClaim: () => void
  handleCancel: () => void
  isButtonLoading: boolean
  sourceAmount: string
  targetAmount: string
  claimAmount: BigNumber
  actionType: string
  selectedCard: any
}>> = ({
         actionModal,
         setActionModal,
         handleWithdraw,
         handleDeposit,
         handleClaim,
         isButtonLoading,
         sourceAmount,
         targetAmount,
         claimAmount,
         actionType,
       }) => {
  const { mode } = useDarkMode()
  const breakpoint = useBreakPoint()

  const handleUserAction = () => {
    console.log('handle user action', actionType)
    if (actionType === 'deposit') handleDeposit()
    else if (actionType === 'withdraw') handleWithdraw(new BigNumber(sourceAmount).minus(earlyWithdrawFee))
    else handleClaim()
  }



  const Content = useMemo(() => {
    let heading = 'Claim'
    let description = ' claiming, you will get all '
    let amount = 0.0
    let actionText = `${
      claimAmount
        ? `${truncateBigString(claimAmount.toString(), token.mintDecimals)} ${token.token}`
        : '00.00 ' + token.token
    }`
    let actionDisabled = !claimAmount
    switch (actionType) {
      case 'withdraw':
        heading = 'Withdraw'
        description = ' withdrawing, you will claim any '
        amount = +sourceAmount
        actionText = `Withdraw 
          ${truncateBigString(
          claimAmount.plus(sourceAmount).minus(earlyWithdrawFee).toString(),
          token.mintDecimals
        )}
           ${token.token}`
        actionDisabled = !sourceAmount
        break
      case 'deposit':
        heading = 'Deposit'
        description = ' depositing, you will claim any '
        amount = +targetAmount
        actionText = `Deposit ${targetAmount} ${token.token} + Claim Yield`
        actionDisabled = !targetAmount
        break
      default:
        break
    }

    return (
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

          <div className="dark:text-grey-8 text-black-4 text-lg font-semibold mb-3.75 max-sm:text-average">
            <h3>{heading}</h3>
          </div>
          <div className="dark:text-grey-2 text-grey-1 text-regular font-semibold mb-3 max-sm:text-tiny">
            <h5>
              By
              {description}
              pending yield available
            </h5>
          </div>
          {actionType !== 'claim' && (
            <div className="flex flex-row items-center justify-between mb-3.75">
              <div className="dark:text-grey-2 text-grey-1 text-regular font-semibold">
                {<div>{actionType === 'deposit' ? 'Deposit' : 'Withdraw'} Amount</div>}
              </div>
              <div className="dark:text-grey-5 text-black-4 text-regular font-semibold">{`${
                amount ? truncateBigNumber(amount) : '00.00'
              } ${token.token}`}</div>
            </div>
          )}
          <div className="flex flex-row items-center justify-between mb-3.75">
            <div className="dark:text-grey-2 text-grey-1 text-regular font-semibold">Claimable Yield</div>
            <div className="dark:text-grey-5 text-black-4 text-regular font-semibold">
              {claimAmount ? `${truncateBigString(claimAmount.toString(), token.mintDecimals)}` : `00.00`}{' '}
              {token.token}
            </div>
          </div>
          {actionType === 'withdraw' && earlyWithdrawFee > 0 && (
            <div className="flex flex-row items-center justify-between mb-3.75">
              <div className="flex flex-row">
                <div className="dark:text-grey-2 text-grey-1 text-regular font-semibold">Early Withdraw Fee</div>
                <IconTooltip tooltipType={'outline'} tooltipClassName={'h-4 w-4 max-w-none ml-1'}>
                  <span className=" font-semibold text-tiny">
                    The early withdrawal penalty fee is to prevent manipulation of our pools by LPs. Please wait{' '}
                    {getTimerCountdown} to avoid paying the fee.
                  </span>
                </IconTooltip>
              </div>
              <div className="dark:text-grey-5 text-black-4 text-regular font-semibold">
                {earlyWithdrawFee ? truncateBigNumber(earlyWithdrawFee) + ' ' + token.token : 0}
              </div>
            </div>
          )}
        </div>
        <div className={'flex flex-col flex-1 gap-1'}>
          <Button
            fullWidth
            colorScheme={'blue'}
            className={`duration-500 my-auto`}
            onClick={handleUserAction}
            isLoading={isButtonLoading}
            disabled={actionDisabled}
          >
            {actionText}
          </Button>
          <div className="text-regular dark:text-grey-2 text-grey-1 text-tiny font-semibold text-center">
            By {actionType === 'withdraw' ? 'withdrawing' : actionType === 'deposit' ? 'depositing' : 'claiming'},
            you agree to our{' '}
            <a
              href={TERMS_OF_SERVICE}
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
    )
  }, [breakpoint, mode, isButtonLoading, diffTimer])
  return (
    <Dialog open={actionModal}>
      <DialogOverlay />
      <DialogContent
        size={'md'}
        className={cn(
          'w-full max-sm:rounded-t-[10px] max-sm:rounded-b-none p-6',
          breakpoint.isMobile
            ? actionType === 'withdraw'
              ? 'h-[320px]'
              : actionType === 'claim'
                ? 'h-[250px]'
                : 'h-[275px]'
            : 'h-[250px]'
        )}
        placement={breakpoint.isMobile ? 'bottom' : 'default'}
      >
        <DialogBody className={'w-full mx-auto'}>{Content}</DialogBody>
      </DialogContent>
    </Dialog>
  )
}
