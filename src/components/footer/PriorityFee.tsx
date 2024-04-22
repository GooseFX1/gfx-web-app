import { FC, useMemo } from 'react'
import { cn, Icon, IconTooltip, Popover, PopoverContent, PopoverTrigger } from 'gfx-component-lib'
import { FooterItem, FooterItemContent } from '@/components/footer/FooterItem'
import { PriorityFeeName, useConnectionConfig, useDarkMode } from '@/context'
import RadioOptionGroup from '@/components/common/RadioOptionGroup'

const PriorityFee: FC = () => {
  const { mode } = useDarkMode()
  const { priorityFee, setPriorityFee } = useConnectionConfig()
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

  return (
    <FooterItem title={'Priority Fee:'}>
      <Popover>
        <PopoverTrigger>
          <FooterItemContent className={'gap-0 cursor-pointer'}>
            {priorityFee}{' '}
            <Icon
              className={cn('transition-all duration-1000', rotation)}
              src={`/img/mainnav/priority_fee_${mode}.svg`}
            />
          </FooterItemContent>
        </PopoverTrigger>
        <PopoverContent className={'mb-3.75'}>
          <div className={'inline-flex gap-1'}>
            <p>Priority Fee </p>
            <IconTooltip tooltipType={'outline'} defaultOpen={false}>
              Add an extra fee to your transaction, increasing its priority in queue, likely to be processed faster
              by the network.
            </IconTooltip>
          </div>
          <RadioOptionGroup
            defaultValue={priorityFee}
            onChange={(value) => setPriorityFee(value as PriorityFeeName)}
            optionClassName={`h-[44px]`}
            options={[
              {
                label: <PriorityFeeItem title={'Default'} fee={0} />,
                value: 'Default'
              },
              {
                label: <PriorityFeeItem title={'Fast'} fee={0.04} />,
                value: 'Fast'
              },
              {
                label: <PriorityFeeItem title={'Turbo'} fee={0.05} />,
                value: 'Turbo'
              }
            ]}
          />
        </PopoverContent>
      </Popover>
    </FooterItem>
  )
}
export default PriorityFee

const PriorityFeeItem: FC<{ title: string; fee: string | number }> = ({ title, fee }) => (
  <div className={'flex flex-col'}>
    <p className={`text-h5 font-bold`}>{title}</p>
    <p className={`text-h5 font-bold`}>{fee} SOL</p>
  </div>
)
