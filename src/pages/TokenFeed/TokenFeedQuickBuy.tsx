import React from 'react'
import { cn, Icon, Input, InputElementLeft, InputElementRight, InputGroup } from 'gfx-component-lib'
import { P } from '@/components/text/TextComponents'
import useBoolean from '@/hooks/useBoolean'
import { useTokenFeed } from '@/context/tokenFeedContext'

function TokenFeedQuickBuy() {
  const {quickBuyAmount, updateQuickBuyAmount} = useTokenFeed()
  const [focus, setFocus] = useBoolean(false)
  return (
    <InputGroup
      leftItem={
        <InputElementLeft
          className={cn(`
      bg-white dark:bg-buttons-darkmode-primary p-2 border-1 border-solid
      dark:border-border-darkmode-secondary border-border-lightmode-secondary 
      rounded-l-[2px] border-r-0
      `, focus && `dark:border-border-darkmode-primary border-border-lightmode-primary`)}
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
        onBlur={setFocus.off}
        value={quickBuyAmount}
        onChange={(e)=>updateQuickBuyAmount(e.target.value)}
      />
    </InputGroup>
  )
}

export default TokenFeedQuickBuy
