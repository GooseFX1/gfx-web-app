import React from 'react'
import { P } from '@/components/text/TextComponents'
import { cn } from 'gfx-component-lib'

function ProgressBar({
  progressPercentage,
  progressBarClass = '',
  progressBarMeterClass = '',
  showProgress = true
}: {
  progressPercentage: number
  showProgress?: boolean
  progressBarClass?: string
  progressBarMeterClass?: string
}) {
  return (
    <div className={`inline-flex w-full items-center`}>
      <div
        className={cn(
          `w-full bg-background-lightmode-primary rounded-full h-2  
                  dark:bg-background-darkmode-primary `,
          progressBarClass
        )}
      >
        <div
          className={cn(
            `bg-background-green h-2 rounded-full transition-all duration-300 ease-in-out`,
            progressBarMeterClass
          )}
          style={{
            width: `${progressPercentage}%`
          }}
        ></div>
      </div>
      {showProgress && <P className={`text-b2`}>{progressPercentage}%</P>}
    </div>
  )
}

export default ProgressBar
