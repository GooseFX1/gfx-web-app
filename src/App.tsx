import React from 'react'
import './App.less'
import AppInner from './AppInner'
import AppErrorBoundary from '@/components/AppErrorBoundary'

export default function App(): JSX.Element {
  return (
    <AppErrorBoundary>
      <AppInner />
    </AppErrorBoundary>
  )
}
