import React, { FC } from 'react'
import {
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Icon
} from 'gfx-component-lib'

import { useDarkMode } from '@/context'
import useBoolean from '@/hooks/useBoolean'

const TokenFeedSettingsCheckBox: FC<{
  checked: boolean
  id: string
  label: string
  onCheckedChange: (state: boolean) => void
  disabled?: boolean
}> = ({ checked, disabled, id, label, onCheckedChange }) => (
  <div className={'w-full flex justify-between'} aria-disabled={disabled}>
    <label
      className="text-b2 font-semibold text-text-lightmode-primary dark:text-text-darkmode-primary"
      htmlFor={id}
    >
      {label}
    </label>
    <Checkbox
      disabled={disabled}
      id={id}
      defaultChecked={false}
      checked={checked}
      onCheckedChange={onCheckedChange}
    />
  </div>
)

function TokenFeedSettings() {
  const [isOpen, setIsOpen] = useBoolean(false)

  const { mode } = useDarkMode()

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen.set}>
      <DropdownMenuTrigger asChild className={'focus-visible:outline-none'}>
        <Button className="p-0 !h-[35px] !w-[35px] mx-3 sm-lg:ml-2 sm-lg:mr-0 relative m-0" variant={'ghost'}>
          <Icon
            src={`/img/assets/farm_filter_${mode}.svg`}
            size={'md'}
            className={'!max-h-[35px] !max-w-[35px] !h-[35px] !w-[35px] max-sm:ml-2.5'}
          />
          {/*{(!isPortfolio && currentSort !== GAMMA_MAIN_SORT_CONFIG_DEFAULT) ||*/}
          {/*(isPortfolio && currentSort != GAMMA_PORTFOLIO_SORT_CONFIG_DEFAULT) ||*/}
          {/*showCreatedPools ||*/}
          {/*(!isPortfolio && showDeposited) ? (*/}
          {/*  <img*/}
          {/*    className={`absolute top-0.5 left-0 border-1 border-solid w-2.5 h-2.5*/}
          {/*              border-background-lightmode-primary dark:border-background-darkmode-primary rounded-full`}*/}
          {/*    src={'/img/assets/red-notification-circle.svg'}*/}
          {/*  />*/}
          {/*) : null}*/}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent portal={false} align={'end'} className={'max-w-[374px]'}>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Filters</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem></DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Socials</DropdownMenuSubTrigger>
          <DropdownMenuSubContent className={'flex flex-col p-2 gap-2'}>
            <DropdownMenuItem asChild>
              <TokenFeedSettingsCheckBox
                checked={false}
                onCheckedChange={() => console.log()}
                id={'x'}
                label={'X'}
              />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <TokenFeedSettingsCheckBox
                checked={false}
                onCheckedChange={() => console.log()}
                id={'website'}
                label={'Website'}
              />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <TokenFeedSettingsCheckBox
                checked={false}
                onCheckedChange={() => console.log()}
                id={'Telegram'}
                label={'Telegram'}
              />
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default TokenFeedSettings
