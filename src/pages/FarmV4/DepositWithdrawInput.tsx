import { Button, cn, Input, InputAddonRight, InputGroup } from 'gfx-component-lib'
import { FC, useCallback, useRef } from 'react'
import { useDarkMode } from '@/context'

const DepositWithdrawInput: FC<{
  isDeposit: boolean
  onChange: any
  depositAmount: string
  withdrawAmount: string
  handleHalf: any
  handleMax: any
  disabled: boolean
}> = ({
  isDeposit,
  onChange,
  depositAmount,
  withdrawAmount,
  handleHalf,
  handleMax,
  disabled
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
          className={'group'}
          aria-disabled={disabled}
          onClick={focusInput}
          rightItem={
            <InputAddonRight
              className={`border-1 border-solid !outline-none border-l-0
            group-focus-within:border-border-lightmode-primary group-focus-within:dark:border-white
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
                onMouseDown={(e)=> {
                  e.preventDefault()
                }}
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
                onMouseDown={(e)=> {
                  e.preventDefault()
                }}
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
