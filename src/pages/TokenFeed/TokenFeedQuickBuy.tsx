import React, { useEffect } from 'react'
import { cn, Icon, Input, InputElementLeft, InputElementRight, InputGroup } from 'gfx-component-lib'
import { P } from '@/components/text/TextComponents'
import useBoolean from '@/hooks/useBoolean'
import { useTokenFeed } from '@/context/tokenFeedContext'
import useTokenInput from '@/hooks/useTokenInput'

function TokenFeedQuickBuy() {
  const { updateQuickBuyAmount } = useTokenFeed()
  const [value, valueOperations] = useTokenInput()
  const [focus, setFocus] = useBoolean(false)
  useEffect(() => {
    if (+value > 0 || !value) {
      updateQuickBuyAmount(value)
    }
  }, [value])
  return (
    <InputGroup
      leftItem={
        <InputElementLeft
          className={cn(
            `
      bg-white dark:bg-buttons-darkmode-primary p-2 border-1 border-solid
      dark:border-border-darkmode-secondary border-border-lightmode-secondary 
      rounded-l-[2px] border-r-0
      `,
            focus && `dark:border-border-darkmode-primary border-border-lightmode-primary`
          )}
        >
          <Icon src={`/img/assets/swap_gradient.svg`} size={'sm'} />
          <P className={'text-b2'}>Quick Buy</P>
        </InputElementLeft>
      }
      rightItem={
        <InputElementRight>
          <Icon src={`/img/crypto/Solana (SOL).svg`} size={'sm'} />
        </InputElementRight>
      }
    >
      <Input
        className={`text-right`}
        placeholder={'0.00'}
        type={'number'}
        onFocus={setFocus.on}
        onBlur={(e) => {
          setFocus.off()
          valueOperations.onBlur(e)
        }}
        value={value}
        onChange={valueOperations.onChange}
      />
    </InputGroup>
  )
}

export default TokenFeedQuickBuy
