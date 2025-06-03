import React, { FC } from 'react'
import {
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Icon,
  Input
} from 'gfx-component-lib'

import { useDarkMode } from '@/context'
import useBoolean from '@/hooks/useBoolean'
import { H4, P } from '@/components/text/TextComponents'

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
const TokenSettingsMinMaxInput: FC<{
  label: string
  minValue?: string
  maxValue?: string
  setMinValue: (value: string) => void
  setMaxValue: (value: string) => void
}> = ({ label, minValue, maxValue, setMinValue, setMaxValue }) => (
  <div className={`flex flex-col gap-2 px-2`}>
    <P className={'text-b2'}>{label}</P>
    <div className={`flex gap-2 items-center`}>
      <Input
        className={`min-w-[166px]`}
        value={minValue}
        placeholder={'Min'}
        onChange={(e) => setMinValue(e.target.value)}
      />
      <P className={`text-b2`}>-</P>
      <Input
        className={`min-w-[166px]`}
        value={maxValue}
        placeholder={'Max'}
        onChange={(e) => setMaxValue(e.target.value)}
      />
    </div>
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
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent portal={false} align={'end'} className={'p-0 pt-1 pb-2 w-[374px] flex flex-col gap-2'}>
        <div className={`flex flex-col gap-2`}>
          <div
            className={`w-full border-b-solid border-b-1 border-border-lightmode-secondary
           dark:border-border-darkmode-secondary pb-2`}
          >
            <H4 className={'px-2'}>Filters</H4>
          </div>
          <TokenSettingsMinMaxInput
            label={'Volume'}
            maxValue={undefined}
            minValue={undefined}
            setMaxValue={() => console.log('')}
            setMinValue={() => console.log('')}
          />
          <TokenSettingsMinMaxInput
            label={'Market Cap'}
            maxValue={undefined}
            minValue={undefined}
            setMaxValue={() => console.log('')}
            setMinValue={() => console.log('')}
          />
          <TokenSettingsMinMaxInput
            label={'Bonding Curve %'}
            maxValue={undefined}
            minValue={undefined}
            setMaxValue={() => console.log('')}
            setMinValue={() => console.log('')}
          />
          <TokenSettingsMinMaxInput
            label={'Age (Mins)'}
            maxValue={undefined}
            minValue={undefined}
            setMaxValue={() => console.log('')}
            setMinValue={() => console.log('')}
          />
          <TokenSettingsMinMaxInput
            label={'Holders'}
            maxValue={undefined}
            minValue={undefined}
            setMaxValue={() => console.log('')}
            setMinValue={() => console.log('')}
          />
          <TokenSettingsMinMaxInput
            label={'Top 10 Holders %'}
            maxValue={undefined}
            minValue={undefined}
            setMaxValue={() => console.log('')}
            setMinValue={() => console.log('')}
          />
        </div>
        <div className={`flex flex-col gap-2`}>
          <div
            className={`w-full border-b-solid border-b-1 border-border-lightmode-secondary
           dark:border-border-darkmode-secondary pb-2`}
          >
            <H4 className={`px-2`}>Socials</H4>
          </div>
          <div className={`flex gap-4 px-2`}>
            <TokenFeedSettingsCheckBox checked={false} onCheckedChange={() => console.log()} id={'x'} label={'X'} />
            <TokenFeedSettingsCheckBox
              checked={false}
              onCheckedChange={() => console.log()}
              id={'website'}
              label={'Website'}
            />
          </div>
          <div className={`flex gap-4 px-2 w-1/2`}>
            <TokenFeedSettingsCheckBox
              checked={false}
              onCheckedChange={() => console.log()}
              id={'Telegram'}
              label={'Telegram'}
            />
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default TokenFeedSettings
