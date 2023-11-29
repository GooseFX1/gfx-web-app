import { useEffect, useMemo, useRef, FC } from 'react'
import mayanLoader from './mayanLoader'
import styled from 'styled-components'

const CONTAINER = styled.div`
  #MAYAN_SWAP_PV_ROOT {
    margin: 84px auto;
  }

  #MAYAN_SWAP_PV_ROOT * {
    font-family: Montserrat !important;
    letter-spacing: normal !important;
    border-radius: 10px;

    [role='dialog'] {
      padding: 0;
    }
  }

  #MAYAN_SWAP_PV_ROOT button {
    border-radius: 50px !important;
  }
`

const Bridge: FC = () => {
  const config = useMemo(
    () => ({
      appIdentity: {
        name: 'Bridge',
        icon: '/img/mainnav/g-logo.svg',
        uri: 'https://goosefx.io'
      },
      referrerAddress: 'F6zoE2sU5jCCWpDGMUasxcCEwCa8dc1y7Q6f5LHkjELy',
      colors: {
        N000: '#131313',
        N100: '#131313',
        N300: '#1F1F1F',
        N500: '#1E1E1E',
        N600: '#7D7D7D',
        N700: '#E2E2E2',
        green: '#50BB35',
        lightGreen: '#80CE00',
        red: '#F06565',
        primary: '#A934FF',
        primaryGradient: '#131313',
        mainBox: '#131313',
        background: '#131313',
        darkPrimary: '#131313',
        alwaysWhite: '#fff',
        tableBg: '#1F1F1F',
        transparentBg: '#131313',
        transparentBgDark: '#131313',
        buttonBackground: '#A934FF',
        toastBgRed: '#F06565',
        toastBgGreen: '#50BB35'
        // tLightBlue: 'string',
        // toastBgNatural: 'string',
        // lightRed: 'string',
        // lightYellow: 'string',
      }
    }),
    []
  )

  const mayan = useRef(null)

  useEffect(() => {
    ;(async function () {
      const mayanInstance = await mayanLoader()
      if (mayanInstance) {
        mayan.current = mayanInstance
        if (mayan.current) {
          mayan.current.init('mayanContainer', config)
        }
      }
    })()

    return () => {
      if (mayan.current && mayan.current.destroy) {
        mayan.current.destroy()
      }
    }
  }, [])

  return (
    <CONTAINER>
      <div id="mayanContainer" />
    </CONTAINER>
  )
}

export default Bridge
