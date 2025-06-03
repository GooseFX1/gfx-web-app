import {
  Button,
  Checkbox,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Icon
} from 'gfx-component-lib'
import { Circle } from '@/components/common/Circle'
import React, { FC } from 'react'
import useBoolean from '@/hooks/useBoolean'
import { useDarkMode } from '@/context'
import { useTokenFeed } from '@/context/tokenFeedContext'
import { H4, P } from '@/components/text/TextComponents'

const GridSettingsCheckBox: FC<{
  checked: boolean
  id: string
  label: string
  onCheckedChange: (state: boolean) => void
  disabled?: boolean
}> = ({ checked, id, label, onCheckedChange,disabled }) => (
  <div className={'w-full flex justify-between'} aria-disabled={disabled}>
    <label
      className="text-b2 font-semibold text-text-lightmode-primary dark:text-text-darkmode-primary"
      htmlFor={id}
    >
      {label}
    </label>
    <Checkbox disabled={disabled} id={id} defaultChecked={false} checked={checked} onCheckedChange={onCheckedChange} />
  </div>
)

function TokenFeedGridSettings() {
  const { mode } = useDarkMode()
  const [isOpen, setIsOpen] = useBoolean(false)
  const { enabledColumns, enableColumn, isUserSettingsCustom, totalColumnsEnabled } = useTokenFeed()
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen.set}>
      <DropdownMenuTrigger asChild className={'focus-visible:outline-none'}>
        <Button
          variant={'outline'}
          colorScheme={'grey'}
          className={cn('px-[10px] py-[5px] max-w-[35px] relative ml-auto', isOpen && `dark:border-border-white`)}
        >
          {isUserSettingsCustom && (
            <Circle
              className={`absolute top-0 -left-1 bg-background-red border-1 border-solid border-[#F7F0FD]
             dark:border-[#131313]`}
            />
          )}
          <Icon
            src={`/img/assets/grid_${mode}.svg`}
            size={'sm'}
            className={`!w-[20px] !max-w-[20px] !min-w-[20px] !h-[20px] !max-h-[20px] !min-h-[20px]`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={'end'} portal={false} className={`flex flex-col gap-2 py-3 max-w-[259px]`}>
        <H4>Column Selection</H4>
        <P className={`text-b2`}>Select at least 2 up to 3 options, flexible layout coming soon...</P>
        <P className={`text-b2 text-text-lightmode-tertiary dark:text-text-darkmode-tertiary`}>
          <span className={`text-text-lightmode-secondary dark:text-text-darkmode-secondary`}>
            {totalColumnsEnabled}
          </span>
          &nbsp; of 3 selected
        </P>
        <div className={`flex flex-col gap-2`}>
          <GridSettingsCheckBox
            checked={enabledColumns.social}
            id={'social'}
            label={'Social Feed'}
            onCheckedChange={(state) => enableColumn('social', state as boolean)}
          />
          <GridSettingsCheckBox
            checked={enabledColumns.new}
            id={'new'}
            label={'New Tokens'}
            onCheckedChange={(state) => enableColumn('new', state as boolean)}/>
          <GridSettingsCheckBox
            checked={enabledColumns.migrated}
            id={'migrated'}
            label={'Migrated Tokens'}
            onCheckedChange={(state) => enableColumn('migrated', state as boolean)}/>
          <GridSettingsCheckBox
            checked={enabledColumns.soon}
            id={'soon'}
            label={'Soon'}
            disabled={true}
            onCheckedChange={(state) => enableColumn('soon', state as boolean)}/>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default TokenFeedGridSettings
