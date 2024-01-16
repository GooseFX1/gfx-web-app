import { useEffect, useMemo, FC, useRef } from 'react'
// import debridgeLoader from './debridgeLoader'
import styled from 'styled-components'
import { useDarkMode } from '../../context'

const CONTAINER = styled.div`
  #debridgeWidget {
    * > {
      font-family: 'Nunito Sans';
    }
    .debridge-widget-iframe {
      margin: 84px auto;
    }
  }
`

const Bridge: FC = () => {
  const { mode } = useDarkMode()
  const scriptId = 'uniqueScriptId'
  const scriptRef = useRef(null)
  const deBridgeRef = useRef(null)

  const config = useMemo(() => {
    const stylesString = JSON.stringify({
      appBackground: mode === 'dark' ? '#131313' : '#F7F0FD',
      appAccentBg: '#000',
      chartBg: '#F7F0FD',
      primary: '#A934FF',
      secondary: '#9625AE',
      badge: '#000',
      borderColor: '#000',
      borderRadius: 5,
      fontColor: mode === 'dark' ? '#fff' : '#000',
      fontColorAccent: mode === 'dark' ? '#fff' : '#000',
      fontFamily: 'Nunito Sans'
    })
    const base64Styles = btoa(stylesString)

    return JSON.stringify({
      element: 'debridgeWidget',
      v: '1',
      title: 'Bridge',
      width: '600',
      height: '800',
      inputChain: '56',
      outputChain: '1',
      inputCurrency: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      outputCurrency: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      address: '0x64023dEcf09f20bA403305F5A2946b5b33d1933B',
      amount: '10',
      lang: 'en',
      mode: 'deswap',
      styles: `${base64Styles}`,
      theme: mode,
      r: '3981'
    })
  }, [mode])

  useEffect(() => {
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

    scriptRef.current.textContent = `deBridge.widget(${config})`

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
