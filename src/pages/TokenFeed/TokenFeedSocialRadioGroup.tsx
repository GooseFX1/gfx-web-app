import React from 'react'
import { cn, RadioGroup, RadioGroupItem } from 'gfx-component-lib'
import { useTokenFeed } from '@/context/tokenFeedContext'

function TokenFeedSocialRadioGroup({
  groupClassName,
  itemClassName,
  itemSize = 'md'
                                   }:{
  groupClassName?: string
  itemClassName?: string
  itemSize?: 'sm' | 'md' | 'lg'
}) {
  const { updateSocialPanelTab, socialPanelTab } = useTokenFeed()
  return (
    <RadioGroup
      defaultValue={'social'}
      value={socialPanelTab}
      onValueChange={updateSocialPanelTab}
      className={cn('flex-shrink gap-1.25 w-max', groupClassName)}
    >
      <RadioGroupItem value={'social'} variant={'primary'} size={itemSize}
      className={itemClassName}
      >
        Social Feed
      </RadioGroupItem>
      <RadioGroupItem
        value={'performance'}
        variant={'primary'}
        size={itemSize}
        className={cn('flex flex-row gap-1 items-center justify-center',itemClassName)}
      >
        My Performance
      </RadioGroupItem>
    </RadioGroup>
  )
}

export default TokenFeedSocialRadioGroup
