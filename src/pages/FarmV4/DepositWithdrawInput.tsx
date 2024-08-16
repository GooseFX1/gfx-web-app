import { Button, cn, Input, InputElementRight, InputGroup } from 'gfx-component-lib'
import { useCallback, useRef, FC } from 'react'
import { useDarkMode } from '@/context'
import BigNumber from 'bignumber.js'

const DepositWithdrawInput: FC<{
  isDeposit: boolean
  onChange: any
  depositAmount: BigNumber
  withdrawAmount: BigNumber
  handleHalf: any
  handleMax: any
  userSourceTokenBal?: BigNumber
  userTargetTokenBal?: BigNumber
  sourceToken?: boolean
}> = ({
  isDeposit,
  onChange,
  depositAmount,
  withdrawAmount,
  handleHalf,
  handleMax,
  userSourceTokenBal,
  userTargetTokenBal,
  sourceToken
})
    : JSX.Element => {
    const { isDarkMode } = useDarkMode()
    const inputRef = useRef<HTMLInputElement>(null)

    const focusInput = useCallback(() => {
      inputRef.current?.focus()
    }, [inputRef])

    return (
      <div className="m-2.5">
        <InputGroup
          onClick={focusInput}
          rightItem={
            <InputElementRight>
              <Button
                variant={'outline'}
                colorScheme={isDarkMode ? 'white' : 'blue'}
                className={cn(`p-1.5 text-text-black-4 dark:text-text-darkmode-primary`)}
                size={'xs'}
                onClick={handleHalf}
                disabled={(sourceToken && !userSourceTokenBal?.gt(BigNumber(0)) ||
                  !sourceToken && !userTargetTokenBal?.gt(BigNumber(0)))}
              >
                Half
              </Button>
              <Button
                variant={'outline'}
                className={cn(`p-1.5 text-text-black-4 dark:text-text-darkmode-primary`)}
                size={'xs'}
                colorScheme={isDarkMode ? 'white' : 'blue'}
                onClick={handleMax}
                disabled={(sourceToken && !userSourceTokenBal?.gt(BigNumber(0)) ||
                  !sourceToken && !userTargetTokenBal?.gt(BigNumber(0)))}
              >
                Max
              </Button>
            </InputElementRight>
          }
        >
          <Input
            ref={inputRef}
            placeholder={'0.00'}
            className={'text-left !p-1.5'}
            onChange={onChange}
            value={
              isDeposit
                ? depositAmount?.isZero()
                  ? ''
                  : depositAmount?.toNumber()
                : withdrawAmount?.isZero()
                  ? ''
                  : withdrawAmount?.toNumber()
            }
          />
        </InputGroup>
      </div>
    )
  }
export default DepositWithdrawInput
