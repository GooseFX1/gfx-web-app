import React, { FC, useCallback, useMemo, useState } from 'react'
import {
  Button,
  cn,
  Dialog,
  DialogBody,
  DialogCloseDefault,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
  Icon,
  IconTooltip,
  Popover,
  PopoverContent,
  PopoverTrigger
} from 'gfx-component-lib'
import { FooterItem, FooterItemContent } from '@/components/footer/FooterItem'
import { PriorityFeeName, useConnectionConfig, useDarkMode } from '@/context'
import RadioOptionGroup from '@/components/common/RadioOptionGroup'
import useBreakPoint from '@/hooks/useBreakPoint'
import useBoolean from '@/hooks/useBoolean'

const PriorityFee: FC = () => {
  const { mode } = useDarkMode()
  const { priorityFee, setPriorityFee } = useConnectionConfig()
  const [localPriorityFee, setLocalPriorityFee] = useState<PriorityFeeName>(priorityFee)
  const { isMobile } = useBreakPoint()
  const [isOpen, setIsOpen] = useBoolean(false)
  const { rotation } = useMemo(() => {
    if (priorityFee === 'Default') {
      return {
        rotation: '-rotate-45'
      }
    }
    if (priorityFee === 'Turbo') {
      return {
        rotation: 'rotate-45'
      }
    }
    return {
      rotation: 'rotate-0'
    }
  }, [priorityFee])
  const saveDisabled = priorityFee === localPriorityFee
  const handleSave = useCallback(() => {
    setIsOpen.off()
    if (priorityFee !== localPriorityFee) {
      setPriorityFee(localPriorityFee)
    }
  }, [localPriorityFee, priorityFee])
  const content = useMemo(() => {
    const trigger = (
      <FooterItemContent className={'gap-0 cursor-pointer'}>
        {priorityFee}&nbsp;
        <Icon
          className={cn('transition-all duration-1000', rotation)}
          src={`/img/mainnav/priority_fee_${mode}.svg`}
        />
      </FooterItemContent>
    )
    const renderContent = (
      <>
        <div className={'inline-flex gap-1'}>
          <h5 className={'text-h5 sm:text-h3'}>Priority Fee </h5>
          <IconTooltip tooltipType={'outline'} defaultOpen={false}>
            Add an extra fee to your transaction, increasing its priority in queue, likely to be processed faster
            by the network.
          </IconTooltip>
        </div>
        <RadioOptionGroup
          defaultValue={priorityFee}
          onChange={(value) => setLocalPriorityFee(value as PriorityFeeName)}
          optionClassName={`h-[44px]`}
          options={[
            {
              label: <PriorityFeeItem title={'Default'} fee={0} />,
              value: 'Default'
            },
            {
              label: <PriorityFeeItem title={'Fast'} fee={0.002} />,
              value: 'Fast'
            },
            {
              label: <PriorityFeeItem title={'Turbo'} fee={0.005} />,
              value: 'Turbo'
            }
          ]}
        />
        <Button fullWidth colorScheme={'blue'} disabled={saveDisabled} onClick={handleSave}>
          Save
        </Button>
      </>
    )
    if (isMobile) {
      return (
        <Dialog open={isOpen} onOpenChange={setIsOpen.set}>
          <DialogOverlay />
          <DialogTrigger>{trigger}</DialogTrigger>
          <DialogContent
            placement={'bottom'}
            className={'w-screen rounded-t-[10px]'}
            onOpenAutoFocus={(event) => {
              event.preventDefault()
            }}
          >
            <DialogCloseDefault className={'top-2'} />
            <DialogBody
              className={`border-1 border-solid border-border-lightmode-primary 
          dark:border-border-darkmode-primary rounded-t-[10px] px-2.5 py-3 flex flex-col gap-2.5 sm:gap-3.75`}
            >
              {renderContent}
            </DialogBody>
          </DialogContent>
        </Dialog>
      )
    }
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen.set}>
        <PopoverTrigger>{trigger}</PopoverTrigger>
        <PopoverContent
          className={'mb-3.75'}
          onOpenAutoFocus={(event) => {
            event.preventDefault()
          }}
        >
          {renderContent}
        </PopoverContent>
      </Popover>
    )
  }, [isMobile, priorityFee, setPriorityFee, rotation, mode, saveDisabled, handleSave, isOpen])
  return <FooterItem title={'Priority Fee:'}>{content}</FooterItem>
}
export default PriorityFee

const PriorityFeeItem: FC<{ title: string; fee: string | number }> = ({ title, fee }) => (
  <div className={'flex flex-col'}>
    <p className={`text-h5 font-bold`}>{title}</p>
    <p className={`text-h5 font-bold`}>{fee} SOL</p>
  </div>
)
