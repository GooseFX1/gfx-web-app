import React, { useEffect } from 'react'
import {
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  Icon,
  Input,
  InputElementLeft,
  InputElementRight,
  InputGroup
} from 'gfx-component-lib'
import { P } from '@/components/text/TextComponents'
import useBoolean from '@/hooks/useBoolean'
import { useTokenFeed } from '@/context/tokenFeedContext'
import useTokenInput from '@/hooks/useTokenInput'
import IconWithFallbackAndLoader from '@/components/IconWithFallbackAndLoader'

function TokenFeedQuickBuy() {
  const { updateQuickBuyAmount, updateQuickBuyToken, quickBuyTokenQuery } = useTokenFeed()
  const [value, valueOperations] = useTokenInput()
  const [focus, setFocus] = useBoolean(false)
  const [isDropDownOpen, setIsDropDownOpen] = useBoolean(false)
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
          <DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropDownOpen.set}>
            <DropdownMenuTrigger>
              <IconWithFallbackAndLoader
                src={quickBuyTokenQuery.data?.logoURI}
                size={'sm'}
                isLoading={quickBuyTokenQuery.isLoading}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align={'end'} className={`mt-2`}>
              <DropdownMenuRadioGroup value={quickBuyTokenQuery?.data?.address} className={`gap-[6px]`}>
                <DropdownMenuRadioItem
                  value={'So11111111111111111111111111111111111111112'}
                  onSelect={() => updateQuickBuyToken(`So11111111111111111111111111111111111111112`)}
                >
                  <Icon src={`/img/crypto/Solana (SOL).svg`} size={'sm'} />
                  <P className={'text-b2 ml-2'}>SOL</P>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value={'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'}
                  onSelect={() => updateQuickBuyToken(`EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`)}
                >
                  <Icon src={`/img/crypto/USD Coin (USDC).svg`} size={'sm'} />
                  <P className={'text-b2 ml-2'}>USDC)</P>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
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
