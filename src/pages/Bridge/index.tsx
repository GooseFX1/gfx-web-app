import { useLayoutEffect, useMemo, FC, useRef } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import useBreakPoint from '../../hooks/useBreakPoint'
import { useDarkMode } from '../../context'
import { styled } from 'twin.macro'

const CONTAINER = styled.div`
  .debridge-widget-iframe {
    margin: 0px auto;
  }
`

const Bridge: FC = () => {
  const { mode } = useDarkMode()
  const breakpoint = useBreakPoint()
  const scriptId = 'uniqueScriptId'
  const scriptRef = useRef(null)
  const deBridgeRef = useRef(null)
  const { wallet } = useWallet()
  const publicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])

  const config = useMemo(() => {
    const bg = mode === 'dark' ? '#131313' : '#F7F0FD'

    const stylesString = JSON.stringify({
      appBackground: bg,
      appAccentBg: bg,
      chartBg: bg,
      badge: '#cacaca',
      tooltipBg: '#cacaca',
      formControlBg: mode === 'dark' ? '#000' : '#ffffff',
      formControlBgAccent: '#000',
      dropdownBg: mode === 'dark' ? '#000' : '#ffffff',
      primary: '#a934ff',
      secondary: '#5855ff',
      light: '#f7f0fd',
      success: '#8ade75',
      error: '#f06565',
      warning: '#f0a30b',
      iconColor: mode === 'dark' ? '#ffffff' : '#5855ff',
      fontColorAccent: '#5855ff',
      primaryBtnText: '#ffffff',
      secondaryBtnText: '#ffffff',
      lightBtnText: '#000',
      borderRadius: 50,
      fontFamily: 'Nunito Sans'
    })

    const base64Styles = btoa(stylesString)

    return JSON.stringify({
      v: '1',
      element: 'debridgeWidget',
      title: 'Bridge',
      width: breakpoint.isMobile ? '372' : '600',
      height: '920',
      inputChain: '1',
      outputChain: '7565164',
      address: publicKey ? publicKey.toBase58() : '',
      supportedChains: {
        inputChains: {
          '1': 'all',
          '10': 'all',
          '56': 'all',
          '137': 'all',
          '8453': 'all',
          '42161': 'all',
          '43114': 'all',
          '59144': 'all',
          '7565164': 'all'
        },
        outputChains: { '7565164': 'all' }
      },
      amount: '0',
      lang: 'en',
      isHideLogo: true,
      showSwapTransfer: false,
      mode: 'deswap',
      styles: `${base64Styles}`,
      theme: `${mode === 'dark' ? mode : 'light'}`,
      r: '3981'
    })
  }, [mode, publicKey])

  useLayoutEffect(() => {
    // Create a new script element
    const script = document.createElement('script')
    // Assign a unique id to the script
    script.id = scriptId
    // Set the script content or source URL
    script.textContent = `deBridge.widget(${config})`
    // Append the script to the document's head
    document.body.appendChild(script)
    // Save a reference to the script for later use
    scriptRef.current = script

    // Cleanup function to remove the script when the component unmounts
    return () => {
      if (scriptRef.current) {
        document.body.removeChild(scriptRef.current)
      }

      if (deBridgeRef.current && deBridgeRef.current.childNodes.length > 0) {
        deBridgeRef.current.removeChild(deBridgeRef.current.firstChild)
      }
    }
  }, [config])

  return (
    <CONTAINER>
      <div id="debridgeWidget" ref={deBridgeRef} />
    </CONTAINER>
  )
}

export default Bridge
