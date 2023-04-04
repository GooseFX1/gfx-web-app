import React, { useEffect } from 'react'
import './App.less'
import { checkMobile } from './utils'
import { logData } from './api/analytics'
import AppInner from './AppInner'

export default function App(): JSX.Element {
  useEffect(() => {
    if (checkMobile()) logData('mobile_view')
  }, [])

  return <AppInner />
}
