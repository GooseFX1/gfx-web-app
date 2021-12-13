import React, { FC } from 'react'
import { HeaderProfile } from './HeaderProfile'
import { TabProfile } from './TabProfile'

export const Explore: FC = () => (
  <>
    <HeaderProfile isExplore />
    <TabProfile isExplore />
  </>
)
