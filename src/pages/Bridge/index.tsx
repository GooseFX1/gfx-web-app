import { useLayoutEffect, useMemo, FC, useRef, useState } from 'react'
import useBreakPoint from '../../hooks/useBreakPoint'
import { useDarkMode } from '../../context'
import PageLoader from '../../components/common/PageLoader'
import useWindowSize from '../../utils/useWindowSize'
import { Tooltip, TooltipContent, TooltipTrigger } from 'gfx-component-lib'

const Bridge: FC = () => {
  const { mode } = useDarkMode()
  const breakpoint = useBreakPoint()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { width } = useWindowSize()

  const scriptId = 'uniqueScriptId'
  const scriptRef = useRef(null)
  const deBridgeRef = useRef(null)

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
      borderRadius: 4,
      fontFamily: 'Nunito Sans'
    })

    const base64Styles = btoa(stylesString)

    return JSON.stringify({
      v: '1',
      element: 'debridgeWidget',
      width: breakpoint.isMobile ? width : '600',
      height: '920',
      inputChain: '1',
      outputChain: '7565164',
      affiliateFeePercent: 1,
      affiliateFeeRecipient: '0x2e7964cf9f8166235f24d1f5d025ed04b7bfcab6',
      amount: '0',
      lang: 'en',
      isHideLogo: true,
      showSwapTransfer: true,
      mode: 'deswap',
      styles: `${base64Styles}`,
      theme: `${mode === 'dark' ? mode : 'light'}`,
      r: '6087'
    })
  }, [mode, breakpoint.isMobile, width])

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
    setTimeout(() => setIsLoading(false), 3300)

    // Cleanup function to remove the script when the component unmounts
    return () => {
      if (scriptRef.current) {
        document.body.removeChild(scriptRef.current)
      }

      if (deBridgeRef.current && deBridgeRef.current.childNodes.length > 0) {
        setIsLoading(true)
        deBridgeRef.current.removeChild(deBridgeRef.current.firstChild)
      }
    }
  }, [config])

  return (
    <div className={`[&_*.debridge-widget-iframe]:mx-auto [&_*.debridge-widget-iframe]:my-0`}>
      {isLoading && <PageLoader />}
      <div className="w-[600px] m-auto relative">
        <div className="absolute left-[18px] top-[14px]">
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="border border-solid border-grey-1 w-[178px] sm:w-[160px] h-8 rounded-[100px]
              cursor-pointer py-0.5 pl-2.5 pr-1 flex flex-row items-center 
              justify-between bg-grey-5 dark:bg-black-1 sm:right-0"
              >
                <span className="mr-[5px] font-bold text-regular dark:text-grey-5 text-black-4 sm:text-tiny">
                  Bridge Wallet FAQ
                </span>
                <img className="h-6" src="/img/assets/Leaderboard/questionMark.svg" alt="question-icon" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              The bridge module requires a wallet connection for the source chain separate from the the GooseFX
              dApp. The destiation address for your funds must be pasted below
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div id="debridgeWidget" ref={deBridgeRef} />
    </div>
  )
}

export default Bridge
