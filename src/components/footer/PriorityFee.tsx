import { FC, useMemo } from 'react'
import { Icon } from 'gfx-component-lib'
import { FooterItem, FooterItemContent } from '@/components/footer/FooterItem'
import { useDarkMode } from '@/context'

const PriorityFee: FC = () => {
  const { mode } = useDarkMode()
  const { rotation, priorityFee } = useMemo(() => {
    console.log('b')
    return {
      rotation: '-rotate-45',
      priorityFee: 'Default'
    }
  }, [])
  return (
    <FooterItem title={'Priority Fee:'}>
      <FooterItemContent className={'gap-0 cursor-pointer'}>
        {priorityFee} <Icon className={rotation} src={`/img/mainnav/priority_fee_${mode}.svg`} />
      </FooterItemContent>
    </FooterItem>
  )
}
export default PriorityFee
