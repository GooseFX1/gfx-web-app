/* eslint-disable */
// @ts-nocheck
import React, { Component } from 'react'
import { Icon, Loader, loaders } from 'gfx-component-lib'
import { SOCIAL_MEDIAS } from '@/constants'

const sessionStorageErrorCount = 'error-count' as const

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false, errorCount: (
        parseInt(sessionStorage.getItem(sessionStorageErrorCount) ?? '0')
      ),
      reloadRef: null
    }
    this.timeoutRef = null
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    const errorCount = parseInt((sessionStorage.getItem(sessionStorageErrorCount) ?? '0')) + 1

    sessionStorage.setItem(sessionStorageErrorCount, errorCount)

    if (localStorage.getItem('gfx-user-cache')) {
      localStorage.removeItem('gfx-user-cache')
    }
    let reloadRef = null
    if (errorCount < 2) {
      reloadRef = setTimeout(() => window.location.reload(), 1000)
    }
    return { hasError: true, errorCount: errorCount, reloadRef: reloadRef }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    clearTimeout(this.timeoutRef)
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutRef)
    clearTimeout(this.state.reloadRef)
  }

  render() {

    if (this.state.hasError) {
      if (this.state.errorCount < 2) {
        // You can render any custom fallback UI
        return <div className={'w-full h-screen flex flex-col justify-center items-center m-auto'}>
          <h1>Something went wrong.</h1>
          <p>Reloading the page.</p>
          <Loader animationData={loaders.loader_generic} className={'w-20 h-20'} />
        </div>
      }
      return <div className={'w-full h-screen flex flex-col justify-center items-center m-auto'}>
        <div className={'flex flex-col gap-2 items-center justify-center'}>
          <h1>Something went wrong.</h1>
          <p>Please contact the team on</p>
          <span className={'inline-flex mx-auto gap-6 '}>
          <a href={SOCIAL_MEDIAS.twitter} target={'_blank'} className={'inline-flex'}>
          <Icon size={'sm'} src={'/img/mainnav/x-active-dark.svg'} className={'w-4 h-4 my-auto'} />
        </a>
          <a href={SOCIAL_MEDIAS.discord} target={'_blank'}>
          <Icon src={'/img/mainnav/discord-active-dark.svg'} className={'w-6 h-6'} />
        </a>
            <a href={SOCIAL_MEDIAS.telegram} target={'_blank'}>
          <Icon src={'/img/mainnav/telegram-active-dark.svg'} className={'w-6 h-6'} />
        </a>
        </span>
        </div>
      </div>
    }

    if (this.state.errorCount > 0 && this.state.hasError == false) {
      this.timeoutRef = setTimeout(() => {
        sessionStorage.removeItem(sessionStorageErrorCount)
        this.setState({ ...this.state, errorCount: 0 })
      }, 2000)
    }
    return this.props.children
  }
}

export default ErrorBoundary