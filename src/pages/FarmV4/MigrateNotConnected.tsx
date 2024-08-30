import React, { FC } from 'react'
import { Connect } from '@/layouts'

const MigrateNotConnected: FC = () => <div className={'mx-auto flex flex-col  items-center gap-2.5 max-w-[330px]'}>
    <div className={'flex flex-col gap-1.25 text-center'}>
      <h2 className={`text-text-lightmode-primary dark:text-text-darkmode-secondary`}>
        Boost Your Earnings!
      </h2>
      <p className={`text-b2 font-semibold text-text-lightmode-secondary 
        dark:text-text-darkmode-secondary`}>
        Easily migrate your open LP positions from other AMMs to our platform to enjoy all the GooseFX
        benefits!
      </p>
    </div>
    <Connect />
  </div>


export default MigrateNotConnected