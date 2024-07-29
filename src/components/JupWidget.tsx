import { useCallback, useEffect, useLayoutEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import useBoolean from '@/hooks/useBoolean'
import { useConnectionConfig, useWalletModal } from '@/context'
import { NATIVE_MINT } from '@solana/spl-token-v2'
import { useLocation } from 'react-router-dom'

export function JupWidget() : JSX.Element {
  const [isLoaded, setIsLoaded] = useBoolean(false);
  const passthroughWalletContextState = useWallet();
  const {connection, endpoint} = useConnectionConfig()
  const {setVisible} = useWalletModal()
  const {pathname} = useLocation()

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
    let intervalId: NodeJS.Timeout | undefined = undefined;
    if (!isLoaded || !window.Jupiter.init || !intervalId) {
      intervalId = setInterval(() => {
        setIsLoaded.set(Boolean(window.Jupiter.init));
      }, 500);
    }

    if (intervalId) {
      return () => clearInterval(intervalId);
    }
  }, [isLoaded]);
  const isTradeOrFarm = pathname.includes("trade") || pathname.includes("farm");
  useEffect(() => {
   const timeout = setTimeout(() => {
      if (isLoaded && Boolean(window.Jupiter.init) && isTradeOrFarm) {
        launchWidget();
      }
    }, 200);
   return ()=> {
      clearTimeout(timeout)
   }
  }, [isLoaded, launchWidget,pathname,isTradeOrFarm]);
  useLayoutEffect(() => {
    if (!isTradeOrFarm) {
      window.Jupiter.close();
      window.Jupiter._instance = null
    }
  }, [pathname,isTradeOrFarm])
// To make sure passthrough wallet are synced
  useEffect(() => {
    if (!window.Jupiter.syncProps) return;
    window.Jupiter.syncProps({ passthroughWalletContextState });
  }, [passthroughWalletContextState.connected]);

  return (
    <></>
  )
}

