import { FC } from 'react'
import { cn, IconTooltip } from 'gfx-component-lib'

const NetworkStatus: FC = () => {
  const networkStatus: string = 'Connected'
  const status = networkStatus === 'Congested' ? 'yellow' : 'green'
  return (
    <div>
      <p className={'text-b3 font-bold text-text-lightmode-primary dark:text-text-darkmode-primary'}>
        Network Status:
      </p>
      <div>
        <p className={cn('text-b3 font-bold ', `text-background-${status}`)}>{networkStatus}</p>
        <IconTooltip tooltipType={'outline'} outlineColor={`stroke-background-${status}`}>
          Network status here
        </IconTooltip>
      </div>
    </div>
  )
}

export default NetworkStatus
