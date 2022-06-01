import React, { FC } from 'react'
import LaunchCollection from '../launchpadComp/LaunchCollection'
import UpcomingCollections from './UpcomingCollections'
import EndedCollections from './EndedCollections'
import { FeaturedLaunch } from './FeaturedLaunch'
import {
  InfoDivLightTheme,
  TokenSwitch,
  MintStarts,
  MintProgressBar,
  DarkDiv,
  InfoDivUSDCTheme,
  GoldenTicketPopup
} from './LaunchpadComponents'
import styled from 'styled-components'
const WRAPPER = styled.div`
  max-width: 99%;
  padding-left: 70px;
  .switchHolder {
    display: flex;
    justify-content: flex-end;
    padding-right: 70px;
    margin-top: 24px;
  }
`

export const LandingPage: FC = () => {
  return (
    <>
      <WRAPPER>
        <span className="switchHolder">
          <TokenSwitch />
        </span>
        <FeaturedLaunch />
        <UpcomingCollections />
        <LaunchCollection />
        {/* <EndedCollections /> */}
      </WRAPPER>
    </>
  )
}
