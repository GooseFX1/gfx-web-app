/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useEffect } from 'react'
import { Fractional } from '../dexterity/types'
import * as anchor from '@project-serum/anchor'

export const PerpsHome: FC = () => {
  useEffect(() => {
    console.log('in use effect')
  }, [])

  return <div>Test</div>
}
