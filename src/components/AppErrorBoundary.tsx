/* eslint-disable */
// @ts-nocheck
import React, { Component } from 'react'
import { Loader, loaders } from 'gfx-component-lib'
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
          <img src={'/img/assets/error_egg.svg'} className={'h-40'} />
          <h1 className={'dark:text-text-darkmode-primary mb-5'}>Sorry, Something Went Wrong...</h1>
          <p>Attempting Recovery, Hold Tight!</p>
          <Loader animationData={loaders.loader_generic} className={'w-20 h-20'} />
        </div>
      }
      return <div className={'w-full h-screen flex flex-col justify-center items-center m-auto'}>
        <div className={'flex flex-col gap-5 items-center justify-center'}>
          <img src={'/img/assets/error_egg.svg'} className={'h-40'} />
          <h1 className={'dark:text-text-darkmode-primary'}>Sorry, Something Went Wrong...</h1>
          <div className={'flex flex-col items-center justify-center'}>
            <p className={'text-text-darkmode-tertiary text-b2'}>
              We are sorry, but there was an issue with the crash
            </p>
            <p className={'text-text-darkmode-tertiary text-b2'}>
              Please contact us on&nbsp;
              <a className={'underline text-text-darkmode-primary font-bold'}
                 href={SOCIAL_MEDIAS.twitter} target={'_blank'}
              >
                X
              </a>,&nbsp;
              <a className={'underline text-text-darkmode-primary font-bold'}
                 href={SOCIAL_MEDIAS.discord} target={'_blank'}
              >
                Discord
              </a>,&nbsp;or&nbsp;<a
              className={'underline text-text-darkmode-primary font-bold'}
              href={SOCIAL_MEDIAS.telegram} target={'_blank'}
            >
              Telegram
            </a>
            </p>
          </div>
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