import React, { FC } from 'react'
import { HeaderProfile } from './HeaderProfile'
import { ContentProfile } from './ContentProfile'

export const Explore: FC = () => (
  <>
    <HeaderProfile isExplore />
    <ContentProfile isExplore />
  </>
)
