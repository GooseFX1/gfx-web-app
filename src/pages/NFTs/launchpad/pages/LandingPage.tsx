import React, { FC } from 'react'
import LaunchCollection from '../launchpadComp/LaunchCollection'
import UpcomingCollections from './UpcomingCollections'
import EndedCollections from './EndedCollections'
import {
  InfoDivLightTheme,
  TokenSwitch,
  MintStarts,
  MintProgressBar,
  DarkDiv,
  InfoDivUSDCTheme,
  GoldenTicketPopup
} from './LaunchpadComponents'

export const LandingPage: FC = () => {
  return (
    <>
      <div>Landing Page</div>
      <div>
        {/* <TokenSwitch /> */}
        {/* <EndedCollections /> */}

        {/* <InfoDivLightTheme /> */}
        {/* <MintStarts /><br /> */}
        {/* <MintProgressBar /> */}
        <DarkDiv />
        <InfoDivUSDCTheme />
        <GoldenTicketPopup />
      </div>
    </>
  )
}
