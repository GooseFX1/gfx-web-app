import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import useBoolean from '@/hooks/useBoolean'
import useBreakPoint from '@/hooks/useBreakPoint'
import { useConnectionConfig, useWalletModal } from '@/context'
import { NATIVE_MINT } from '@solana/spl-token-v2'
import { useLocation } from 'react-router-dom'

export function JupWidget(): JSX.Element {
  const { isDesktop } = useBreakPoint()
  const [isLoaded, setIsLoaded] = useBoolean(false)
  const passthroughWalletContextState = useWallet()
  const { connection, endpoint } = useConnectionConfig()
  const { setVisible } = useWalletModal()
  const { pathname } = useLocation()
  const intervalId = useRef<NodeJS.Timeout | null>()
  const launchWidget = useCallback(() => {
    window.Jupiter.init({
      connectionObj: connection,
      displayMode: 'widget',
      widgetStyle: {
        position: 'bottom-left',
        size: 'sm'
      },
      formProps: {
        initialInputMint: NATIVE_MINT.toBase58(),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        swapMode: 'ExactInOrOut'
      },
      enableWalletPassthrough: true,
      passthroughWalletContextState: passthroughWalletContextState,
      onRequestConnectWallet: () => setVisible(true),
      endpoint,
      defaultExplorer: 'Solscan'
    })
  }, [passthroughWalletContextState, endpoint, setVisible, connection])

  useEffect(() => {
    if (!isLoaded || !window.Jupiter.init || !intervalId.current) {
      intervalId.current = setInterval(() => {
        setIsLoaded.set(Boolean(window.Jupiter.init))
      }, 500)
    }

    if (intervalId.current) {
      return () => clearInterval(intervalId.current)
    }
  }, [isLoaded])
  const isFarmOrSSL = pathname.includes('farm') || pathname.includes('ssl')
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoaded && Boolean(window.Jupiter.init) && isFarmOrSSL && isDesktop) {
        launchWidget()
      }
    }, 200)
    return () => {
      clearTimeout(timeout)
    }
  }, [isLoaded, launchWidget, pathname, isFarmOrSSL, isDesktop])
  useLayoutEffect(() => {
    if (!isFarmOrSSL) {
      window.Jupiter.close()
      window.Jupiter._instance = null
    }
  }, [pathname, isFarmOrSSL])
  // To make sure passthrough wallet are synced
  useEffect(() => {
    if (!window.Jupiter.syncProps) return
    window.Jupiter.syncProps({ passthroughWalletContextState })
  }, [passthroughWalletContextState.connected])

  return <></>
}
