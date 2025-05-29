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
import React from 'react'
import useBoolean from '@/hooks/useBoolean'
import { useDarkMode } from '@/context'
import { useTokenFeed } from '@/context/tokenFeedContext'

function TokenFeedGridSettings() {
  const { mode } = useDarkMode()
  const [isOpen, setIsOpen] = useBoolean(false)
  const { enabledColumns, enableColumn } = useTokenFeed()
  console.log({enabledColumns})
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen.set}>
      <DropdownMenuTrigger asChild className={'focus-visible:outline-none'}>
        <Button
          variant={'outline'}
          colorScheme={'grey'}
          className={cn('px-[10px] py-[5px] max-w-[35px] relative ml-auto', isOpen && `dark:border-border-white`)}
        >
          <Circle
            className={`absolute top-0 -left-1 bg-background-red border-1 border-solid border-[#F7F0FD]
             dark:border-[#131313]`}
          />
          <Icon
            src={`/img/assets/grid_${mode}.svg`}
            size={'sm'}
            className={`!w-[20px] !max-w-[20px] !min-w-[20px] !h-[20px] !max-h-[20px] !min-h-[20px]`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={'end'} portal={false} className={`flex flex-col gap-2 py-3 max-w-[259px]`}>
        <h4 className={`text-text-lightmode-primary dark:text-text-darkmode-primary`}>Column Selection</h4>
        <p className={`text-b2 text-text-lightmode-secondary dark:text-text-darkmode-secondary font-semibold`}>
          Select at least 2 up to 3 options, flexible layout coming soon...
        </p>
        <p className={`text-text-lightmode-tertiary dark:text-text-darkmode-tertiary`}>
          <span className={`text-text-lightmode-secondary dark:text-text-darkmode-secondary`}>
            {Object.values(enabledColumns).filter((v) => v).length}
          </span>{' '}
          of 3 selected
        </p>
        <div className={`flex flex-col gap-2`}>
          <div className={'w-full flex justify-between'}>
            <label
              className="text-b2 font-semibold text-text-lightmode-primary dark:text-text-darkmode-primary"
              htmlFor="c1"
            >
              Social Feed
            </label>
            <Checkbox
              id={'c1'}
              defaultChecked={false}
              checked={enabledColumns.social}
              onCheckedChange={(state) => enableColumn('social', state as boolean)}
            />
          </div>
          <div className={'w-full flex justify-between'}>
            <label
              className="text-b2 font-semibold text-text-lightmode-primary dark:text-text-darkmode-primary"
              htmlFor="c2"
            >
              New Tokens
            </label>
            <Checkbox id={'c2'}
                      checked={enabledColumns.new}
                      defaultChecked={false}
                      onCheckedChange={(state) => enableColumn('new', state as boolean)}
            />
          </div>
          <div className={'w-full flex justify-between'}>
            <label
              className="text-b2 font-semibold text-text-lightmode-primary dark:text-text-darkmode-primary"
              htmlFor="c3"
            >
              Migrated Tokens
            </label>
            <Checkbox id={'c3'}
                      defaultChecked={false}
                      checked={enabledColumns.migrated}
                      onCheckedChange={(state) => enableColumn('migrated', state as boolean)}/>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default TokenFeedGridSettings
