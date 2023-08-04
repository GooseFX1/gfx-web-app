/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useEffect } from 'react'

export const PerpsHome: FC = () => {
  useEffect(() => {
    console.log('in use effect')
  }, [])

  return <div>Test</div>
}
