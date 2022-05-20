import React, { FC } from 'react'
import LaunchCollection from '../launchpadComp/LaunchCollection'
import UpcomingCollections from './UpcomingCollections'
import EndedCollections from './EndedCollections'

export const LandingPage: FC = () => {
  return (
    <>
      <div>Landing Page</div>
      <div>
        <UpcomingCollections />
        <LaunchCollection />

        <EndedCollections />
      </div>
    </>
  )
}
