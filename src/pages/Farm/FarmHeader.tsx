import React, { FC } from 'react'
import { FarmFilter } from './FarmFilterHeader'

export const FarmHeader: FC<{ onFilter?: () => void }> = () => (
  <>
    <FarmFilter />
  </>
)
