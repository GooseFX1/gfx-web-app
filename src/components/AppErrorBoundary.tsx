/* eslint-disable */
// @ts-nocheck
import React, { Component } from 'react'
import { Icon, Loader, loaders } from 'gfx-component-lib'
import { SOCIAL_MEDIAS } from '@/constants'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false};
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    if (localStorage.getItem('gfx-user-cache') && localStorage.getItem('clear-cache') !== 'true'){
      localStorage.removeItem('gfx-user-cache')
      setTimeout(()=>window.location.reload(),1000)
    }

    return { hasError: true};
  }

  render() {
    if (this.state.hasError) {
      if (localStorage.getItem('clear-cache') !== 'true'){
        localStorage.setItem('clear-cache', 'true')

        // You can render any custom fallback UI
        return <div className={'w-full h-screen flex flex-col justify-center items-center m-auto'}>
          <h1>Something went wrong.</h1>
          <p>Reloading the page.</p>
          <Loader animationData={loaders.loader_generic} className={'w-20 h-20'}/>
        </div>
      }
      return <div className={'w-full h-screen flex flex-col justify-center items-center m-auto'}>
        <h1>Something went wrong.</h1>
        <p>Please contact the team on</p>
        <span>
          <a href={SOCIAL_MEDIAS.twitter} target={'_blank'}>
          <Icon src={'/img/assets/twitter.svg'} className={'w-6 h-6'} />
        </a>
          <a href={SOCIAL_MEDIAS.discord} target={'_blank'}>
          <Icon src={'/img/assets/discord.svg'} className={'w-6 h-6'} />
        </a>
        </span>
      </div>
    }
    localStorage.removeItem('clear-cache')
    return this.props.children;
  }
}

export default ErrorBoundary