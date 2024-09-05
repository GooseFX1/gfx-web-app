import { Button, cn, Input, InputAddonRight, InputGroup } from 'gfx-component-lib'
import { FC, useCallback, useMemo, useRef } from 'react'
import { useDarkMode } from '@/context'

const DepositWithdrawInput: FC<{
  isDeposit: boolean
  onChange: any
  depositAmount: string
  withdrawAmount: string
  handleHalf: any
  handleMax: any
  userSourceTokenBal?: number
  userTargetTokenBal?: number
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

    const disabled = useMemo(() => {
      if(sourceToken && userSourceTokenBal <= 0) return true
      else if(!sourceToken && userTargetTokenBal <= 0) return true
      else return false
    }, [sourceToken, userSourceTokenBal, userTargetTokenBal])
    
    return (
      <div className="m-2.5">
        <InputGroup
          className={'group'}
          aria-disabled={disabled}
          onClick={focusInput}
          rightItem={
            <InputAddonRight className={`border-1 border-solid !outline-none border-l-0
            group-focus-within:border-border-lightmode-primary group-focus:dark:border-border-darkmode-primary
            dark:border-border-darkmode-secondary border-border-lightmode-secondary
            disabled:dark:border-border-darkmode-secondary disabled:border-border-lightmode-secondary
            dark:bg-black-1 bg-grey-5
            `}>
              <Button
                variant={'outline'}
                colorScheme={isDarkMode ? 'white' : 'blue'}
                className={cn(`p-1.5 text-text-black-4 dark:text-text-darkmode-primary`)}
                size={'xs'}
                onClick={handleHalf}
                disabled={disabled}
              >
                Half
              </Button>
              <Button
                variant={'outline'}
                className={cn(`p-1.5 text-text-black-4 dark:text-text-darkmode-primary`)}
                size={'xs'}
                colorScheme={isDarkMode ? 'white' : 'blue'}
                onClick={handleMax}
                disabled={disabled}
              >
                Max
              </Button>
            </InputAddonRight>
          }
        >
          <Input
            ref={inputRef}
            placeholder={'0.00'}
            className={'text-left !p-1.5'}
            onChange={onChange}
            value={
              isDeposit
                ? !depositAmount
                  ? ''
                  : depositAmount
                : !withdrawAmount
                  ? ''
                  : withdrawAmount
            }
          />
        </InputGroup>
      </div>
    )
  }
export default DepositWithdrawInput
