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
import { TokenFeedTokenColumn, useTokenFeed } from '@/context/tokenFeedContext'

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
    <Checkbox disabled={disabled} id={id} checked={checked} onCheckedChange={onCheckedChange} />
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
        type={'number'}
        onChange={(e) => setMinValue(e.target.value)}
      />
      <P className={`text-b2`}>-</P>
      <Input
        className={`min-w-[166px]`}
        value={maxValue}
        placeholder={'Max'}
        type={'number'}
        onChange={(e) => setMaxValue(e.target.value)}
      />
    </div>
  </div>
)

function isMaxGreaterThanMin(max: string | undefined, min: string | undefined): boolean {
  if (!max || !min) return true
  const maxValue = parseFloat(max)
  const minValue = parseFloat(min)
  if (isNaN(maxValue) || isNaN(minValue)) return true
  return maxValue >= minValue
}

function TokenFeedSettings({ column }: { column: TokenFeedTokenColumn }) {
  const [isOpen, setIsOpen] = useBoolean(false)
  const { columnFilters, updateColumnFilters } = useTokenFeed()
  const { mode } = useDarkMode()
  const currentFilter = columnFilters[column]

  const updateProperty = (property: Exclude<keyof typeof currentFilter, 'enabledSocials'>) => ({
    setMaxValue: (value: string) => {
      if (!isMaxGreaterThanMin(value, currentFilter[property]?.min)) return
      updateColumnFilters(column, {
        ...currentFilter,
        [property]: {
          ...currentFilter[property],
          max: value
        }
      })
    },
    setMinValue: (value: string) => {
      console.log(
        `Setting min value for ${property} to ${value}`,
        !isMaxGreaterThanMin(currentFilter[property]?.max, value)
      )
      if (!isMaxGreaterThanMin(currentFilter[property]?.max, value)) return
      updateColumnFilters(column, {
        ...currentFilter,
        [property]: {
          ...currentFilter[property],
          min: value
        }
      })
    }
  })
  const enableSocial = (social: keyof typeof currentFilter.enabledSocials) => (state: boolean) =>
    updateColumnFilters(column, {
      ...currentFilter,
      enabledSocials: {
        ...currentFilter.enabledSocials,
        [social]: state
      }
    })
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
            maxValue={currentFilter?.volume?.max}
            minValue={currentFilter?.volume?.min}
            setMaxValue={updateProperty('volume').setMaxValue}
            setMinValue={updateProperty('volume').setMinValue}
          />
          <TokenSettingsMinMaxInput
            label={'Market Cap'}
            maxValue={currentFilter?.marketCap?.max}
            minValue={currentFilter?.marketCap?.min}
            setMaxValue={updateProperty('marketCap').setMaxValue}
            setMinValue={updateProperty('marketCap').setMinValue}
          />
          <TokenSettingsMinMaxInput
            label={'Bonding Curve %'}
            maxValue={currentFilter?.bondingCurveProgress?.max}
            minValue={currentFilter?.bondingCurveProgress?.min}
            setMaxValue={updateProperty('bondingCurveProgress').setMaxValue}
            setMinValue={updateProperty('bondingCurveProgress').setMinValue}
          />
          <TokenSettingsMinMaxInput
            label={'Age (Mins)'}
            maxValue={currentFilter?.age?.max}
            minValue={currentFilter?.age?.min}
            setMaxValue={updateProperty('age').setMaxValue}
            setMinValue={updateProperty('age').setMinValue}
          />
          <TokenSettingsMinMaxInput
            label={'Holders'}
            maxValue={currentFilter?.holders?.max}
            minValue={currentFilter?.holders?.min}
            setMaxValue={updateProperty('holders').setMaxValue}
            setMinValue={updateProperty('holders').setMinValue}
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
            <TokenFeedSettingsCheckBox
              checked={currentFilter?.enabledSocials?.x}
              onCheckedChange={enableSocial('x')}
              id={'x'}
              label={'X'}
            />
            <TokenFeedSettingsCheckBox
              checked={currentFilter?.enabledSocials?.website}
              onCheckedChange={enableSocial('website')}
              id={'website'}
              label={'Website'}
            />
          </div>
          <div className={`flex gap-4 px-2 w-1/2`}>
            <TokenFeedSettingsCheckBox
              checked={currentFilter?.enabledSocials?.telegram}
              onCheckedChange={enableSocial('telegram')}
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
