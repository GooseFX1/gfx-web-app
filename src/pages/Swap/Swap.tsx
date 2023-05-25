import React, { FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { Image } from 'antd'
import { Settings } from './Settings'
import { Wrap } from './Wrap'
import { History } from './History'
import { SwapButton } from './SwapButton'
import { SwapFrom } from './SwapFrom'
import { SwapTo } from './SwapTo'
import { Modal, Tooltip, SwapTokenToggle } from '../../components'
import { SkeletonCommon } from '../NFTs/Skeleton/SkeletonCommon'
import {
  useDarkMode,
  useSwap,
  SwapProvider,
  useSlippageConfig,
  APP_RPC,
  useConnectionConfig,
  useNavCollapse,
  useTokenRegistry
} from '../../context'
import { CenteredImg, SpaceBetweenDiv, CenteredDiv } from '../../styles'
import { JupiterProvider, useJupiter } from '@jup-ag/react-hook'
import { PublicKey } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { ILocationState } from '../../types/app_params.d'
import { notify, moneyFormatter, nFormatter, checkMobile, clamp, aborter } from '../../utils'
import { CURRENT_SUPPORTED_TOKEN_LIST } from '../../constants'
import { useParams } from 'react-router-dom'
import { logData } from '../../api/analytics'
import JSBI from 'jsbi'
import tw from 'twin.macro'
import 'styled-components/macro'
import useBreakPoint from '../../hooks/useBreakPoint'

const WRAPPER = styled.div`
  ${tw`w-screen not-italic`}
  color: ${({ theme }) => theme.text1};
  font-family: Montserrat;
  background-color: ${({ theme }) => theme.bg2};

  .rotateRefreshBtn {
    ${tw`h-[40px]`}
  }

  .rotateRefreshBtn-rotate {
    -webkit-animation: cog 1.5s infinite;
    -moz-animation: cog 1.5s infinite;
    -ms-animation: cog 1.5s infinite;
    animation: cog 1.5s infinite;
    -webkit-animation-timing-function: linear;
    -moz-animation-timing-function: linear;
    -ms-animation-timing-function: linear;
    animation-timing-function: linear;
    @keyframes cog {
      100% {
        -moz-transform: rotate(-360deg);
        -ms-transform: rotate(-360deg);
        transform: rotate(-360deg);
      }
    }
  }
`

const RefreshAlert = styled.div<{ $active: boolean; $isMobile: boolean; $navCollapsed: boolean }>`
  ${tw`flex w-full absolute left-0 top-0 justify-center p-2 items-center 
    font-medium text-center text-base sm:text-sm`}
  color: ${({ theme }) => theme.tabNameColor};
  display: ${({ $active }) => ($active ? 'block' : 'none')};
  opacity: 0;
  animation: ${({ $active }) => ($active ? 'openAnimation 3s' : 'none')};

  @keyframes openAnimation {
    0% {
      top: 0px;
      opacity: 0;
    }
    20% {
      top: ${({ $isMobile, $navCollapsed }) => ($isMobile ? '88px' : $navCollapsed ? '45px' : '125px')};
      opacity: 1;
    }
    80% {
      top: ${({ $isMobile, $navCollapsed }) => ($isMobile ? '88px' : $navCollapsed ? '45px' : '125px')};
      opacity: 1;
    }
    100% {
      opacity: 0;
      top: 0px;
    }
  }
`

const INNERWRAPPER = styled.div<{ $desktop: boolean; $navCollapsed: boolean }>`
  ${tw`flex items-center w-screen mb-[42px] sm:justify-start sm:flex-col sm:items-center sm:h-full`}

  margin-top: ${({ $navCollapsed }) => ($navCollapsed ? '35px' : '142px')};
  color: ${({ theme }) => theme.text1};
  justify-content: ${({ $desktop }) => ($desktop ? 'space-between' : 'space-around')};

  @media (max-width: 500px) {
    padding: 1rem;
  }
`

const SETTING_MODAL = styled(Modal)`
  width: 628px !important;
  background-color: ${({ theme }) => theme.bg20} !important;
`

const SWAP_HISTORY_MODAL = styled(Modal)`
  width: 628px !important;
  background-color: ${({ theme }) => theme.bg20} !important;

  .ant-modal-body {
    max-height: 80vh !important;

    ::-webkit-scrollbar {
      display: none !important;
    }
  }
`

const BODY = styled.div`
  ${tw`relative justify-between w-full mt-10 mb-8 h-full w-full sm:mt-8 sm:mb-12`}
  ${({ theme }) => theme.flexColumnNoWrap}
  ${({ theme }) => theme.customScrollBar('6px')};
`

const HEADER_TITLE = styled(CenteredDiv)`
  span {
    ${tw`text-[20px] font-semibold mt-[1px] `}
    color: ${({ theme }) => theme.text1};
    font-family: Montserrat;
  }
`

const TOKEN_WRAPPER = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  ${tw`justify-between items-center w-81.5 rounded-r-bigger py-[16px] pr-[16px] pl-[44px] h-[575px] 
    sm:w-full sm:rounded-bigger sm:h-[400px] sm:pl-[32px]`}
  background: ${({ theme }) => theme.swapSides1};
`

const TokenTitle = styled.div`
  ${tw`font-semibold text-[18px]`}
  color: ${({ theme }) => theme.text1};
  line-height: inherit;
`

const TokenTitleFees = styled(TokenTitle)`
  ${tw`flex items-center`}
`

const TokenPrice = styled(TokenTitle)`
  ${tw`text-[16px]`}
`

const TokenTitleFDV = styled(TokenTitle)`
  ${tw`text-[18px]`}
`

const SmallTitle = styled.div`
  ${tw`font-semibold text-tiny`}
  color: ${({ theme }) => theme.text12};
`

const AltSmallTitle = styled.div`
  ${tw`font-semibold text-[15px]`}
  color: ${({ theme }) => theme.text12};
  line-height: inherit;
`

const SmallTitleFlex = styled.div`
  ${tw`flex items-center text-tiny my-1`}
  color: ${({ theme }) => theme.text12};

  .token-name {
    ${tw`font-semibold`}
  }
`

const SmallerTitle = styled.div`
  ${tw`text-tiny font-semibold`}
  background: linear-gradient(90.25deg, #f7931a 2.31%, #dc1fff 99.9%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`
const TokenHeader = styled.div`
  ${tw`flex flex-col w-full mb-2.5 sm:ml-0 sm:items-center`}
`

const SWAP_ROUTE_ITEM = styled.div<{ $clicked?: boolean; $cover: string }>`
  ${tw`h-[75px] rounded-[10px] p-px cursor-pointer mr-7 !min-w-[342px] mb-4 
  sm:h-16.25 sm:mt-0 sm:mx-0 sm:mb-4 sm:min-w-[80vw] sm:!w-[316px]`}

  background: ${({ theme, $clicked }) =>
    $clicked ? 'linear-gradient(90deg,rgba(247,147,26,0.5) 0%,rgba(220,31,255,0.5) 100%)' : theme.bg20};
  box-shadow: 0 6px 9px 0 rgba(36, 36, 36, 0.1);

  .inner-container {
    ${tw`relative flex justify-center items-center h-full w-full rounded-[10px] p-2`}
    background: ${({ $clicked, $cover }) => ($clicked ? $cover : 'transparent')};

    .content {
      ${tw`w-[55%]`}
      div {
        ${({ theme }) => theme.ellipse}
      }
    }

    .price {
      ${tw`w-1/2 text-right`}
    }
  }
`

const SWAP_ROUTES = styled.div<{ less: boolean }>`
  ${tw`relative mx-[24px] pb-[24px]`}
  .swap-content {
    ${tw`relative flex h-1/5 mt-0 mx-auto pb-3 pt-4 pl-4 justify-center
    sm:flex sm:flex-col sm:w-full sm:items-center sm:h-auto sm:justify-around 
    sm:mt-8 sm:mb-12 sm:mx-0 sm:p-0 sm:pt-[12px]`}
    overflow-x: auto;

    @media (max-width: 1515px) {
      justify-content: ${({ less }) => (less ? 'center' : 'start')};
    }
    ${({ theme }) => theme.customScrollBar('4px')};
  }

  .action {
    ${tw`absolute right-0 bottom-0 sm:!text-base cursor-pointer text-lg font-semibold cursor-pointer`}
    text-decoration: underline;

    @media (max-width: 500px) {
      top: ${({ less }) => (less ? '80%' : '88%')};
    }

    div {
      ${tw`text-right`}
    }
  }
`

const TokenDetail = styled.div`
  ${tw`flex flex-col w-full py-3`}
`

const AltTokenDetail = styled(TokenDetail)`
  ${tw`sm:w-1/2`}
`

const ListWrapper = styled.div`
  ${tw`w-full sm:flex flex-wrap sm:py-3 overflow-y-scroll`}
`

const TokenListWrapper = styled(ListWrapper)`
  ${tw`sm:ml-0 sm:w-full sm:items-center`}
`

const SubHeader = styled.div`
  ${tw`ml-0 sm:ml-0 h-12`}
`

const Socials = styled.div`
  ${tw`flex justify-between	w-full`}
`
const SocialsIcon = styled.div<{ $image: string }>`
  ${tw`w-8 h-8`}
  -webkit-mask-image: url(${({ $image }) => $image});
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-position-content: bottom;
  background: ${({ theme }) => theme.text20};
  &:hover {
    -webkit-mask-image: url(${({ $image }) => $image});
    -webkit-mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    -webkit-position-content: bottom;
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
  }
`
const SocialsButton = styled.div`
  ${tw` cursor-pointer text-smaller rounded-2xl leading-normal font-semibold`}

  line-height: inherit;
`

//background-color: ${({ theme }) => theme.bg19};

const SMALL_CLICKER_ICON = styled(Image)`
  overflow: hidden;
  ${tw`h-5 w-5 mr-2 rounded-circle`}
`

const PRICE_WRAPPER = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  ${tw`items-center h-full w-81.5 p-6 rounded-tl-bigger 
  h-[575px] rounded-bl-bigger sm:h-[400px] sm:w-full sm:rounded-bigger sm:mb-12`}

  background: ${({ theme }) => theme.swapSides2};
`

const ROUTE_TAG = styled.div`
  ${tw`absolute top-[-12px] right-[-18px] font-semibold items-center text-xs p-2 rounded-md  
   text-white leading-3 sm:right-0`}
  background-color: #be2cff;
  z-index: 100;
`

const PriceHeader = styled.div`
  ${tw`flex w-full items-center`}
`

const PriceTitle = styled.div`
  ${tw`font-semibold text-average`}
  background: linear-gradient(90.25deg, #f7931a 2.31%, #dc1fff 99.9%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`

const HEADER_WRAPPER = styled(SpaceBetweenDiv)<{ $iconSize: string }>`
  ${tw`w-full`}
  > div {
    ${tw`flex items-center`}
  }

  .header-icon {
    ${tw`items-center`}
  }

  .jup-icon {
    ${tw`ml-2 h-5.5`}
  }

  .smaller-header-icon {
    ${tw`cursor-pointer h-10 w-10`}
  }
`

const SETTING_WRAPPER = styled(CenteredImg)`
  ${tw`h-10 w-10 rounded-circle ml-2`}
`

const SWITCH = styled(CenteredDiv)<{ measurements: number }>`
  ${tw`absolute h-[64px] w-[64px] cursor-pointer rounded-circle z-[100]`}
  top: calc(50% - ${({ measurements }) => measurements}px / 2 + 18px);
  left: calc(50% - ${({ measurements }) => measurements}px / 2);
  background-color: rgb(88 85 255);
  box-shadow: 0 4.5px 26px 11px rgb(88 85 255 / 43%);
  animation: 1.5s ease-in-out 0s 1 normal forwards running fadein;

  @media (max-width: 500px) {
    top: calc(58% - ${({ measurements }) => measurements}px / 2 + 18px);
    left: calc(52% - ${({ measurements }) => measurements}px / 2);
  }

  .swap-switch {
    ${tw`h-[90px] w-auto sm:h-[84px] z-[100]`}
  }

  @keyframes fadein {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`

const SWAP_CONTENT = styled.div`
  ${tw`items-center p-8 w-628 max-h-90p min-h-400 rounded-bigger 
  dark:bg-black-2 bg-white flex flex-col flex-nowrap shadow-[0 7px 15px 5px rgba(0, 0, 0, 0.15)] 
  sm:w-full sm:mb-12 sm:p-5 sm:text-sm sm:leading-normal`}

  wrapped-sol
`

const SwapContent: FC<{
  exchange?: (any: any) => void
  setRefreshed: React.Dispatch<React.SetStateAction<boolean>>
  refreshed: boolean
}> = ({ exchange, setRefreshed, refreshed }) => {
  const { wallet } = useWallet()
  const location = useLocation<ILocationState>()
  const { setEndpointName, network } = useConnectionConfig()
  const { mode } = useDarkMode()
  const { amountPool, setFocused, switchTokens, setClickNo, setRoutes, tokenA, tokenB, inTokenAmount } = useSwap()
  const [settingsModalVisible, setSettingsModalVisible] = useState<boolean>(false)

  const [historyVisible, setHistoryVisible] = useState<boolean>(false)
  const [reloadTrigger, setReloadTrigger] = useState<boolean>(false)
  const [wrapModalVisible, setWrapModalVisible] = useState<boolean>(false)
  const timeoutRef = useRef<NodeJS.Timeout>(null)
  useEffect(() => {
    logData('swap_page')

    if (network === 'devnet') {
      setEndpointName(APP_RPC.name)
      notify({ message: `Switched to mainnet` })
    }
  }, [location])

  const openSettings = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setSettingsModalVisible(true)
  }, [])

  const openHistory = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setHistoryVisible(true)
    setReloadTrigger((prev) => !prev)
  }, [])

  const refresh = useCallback(() => {
    setClickNo(0)
    setRoutes([])
    setRefreshed(true)
    if (timeoutRef.current != null) {
      //prevents duplicate timeouts from happening at once causing odd behaviour
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setRefreshed(false)
      amountPool?.()
      timeoutRef.current = null
    }, 3000)
  }, [amountPool])

  const dateString = useCallback((date: Date) => {
    const datestring = date.toString().split(' ')
    const month = datestring[1]
    const day = datestring[2]
    const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    return `${month} ${day}, ${time}`
  }, [])
  //TODO: clean up and use proper property parsing for both localCSS + switch{from/to}
  const height = '56px'

  const localCSS = useMemo(
    () => css`
      .swap-input {
        height: ${height};
        border-radius: 45px;
        border: none;
        padding-right: 20px;
        font-size: 20px !important;
        font-weight: 600;

        &:hover {
          border-color: #5755ff;
        }

        &:focus {
          border-color: #5755ff;
          box-shadow: 0 0 0 2px rgb(23 125 220 / 20%);
        }
      }
      .ant-modal {
        border-radius: 20px;
      }
    `,
    [height]
  )
  const showWrapSolModal = useCallback(() => {
    setWrapModalVisible(true)
  }, [])
  const onSwitchClick = useCallback(() => {
    setFocused('from')
    switchTokens()
  }, [switchTokens, setFocused])
  const breakpoint = useBreakPoint()
  return (
    <SWAP_CONTENT>
      <SETTING_MODAL
        setVisible={setSettingsModalVisible}
        bigTitle={false}
        title="Settings"
        visible={settingsModalVisible}
        style={{ overflowY: 'hidden', backgroundColor: mode === 'dark' ? '#1c1c1c' : 'white' }}
      >
        <Settings setVisible={setSettingsModalVisible} />
      </SETTING_MODAL>
      <SETTING_MODAL
        setVisible={setWrapModalVisible}
        bigTitle={false}
        title="SOL / WSOL"
        visible={wrapModalVisible}
        style={{ overflowY: 'hidden', backgroundColor: mode === 'dark' ? '#1c1c1c' : 'white' }}
      >
        <Wrap setVisible={setWrapModalVisible} />
      </SETTING_MODAL>
      <SWAP_HISTORY_MODAL
        setVisible={setHistoryVisible}
        bigTitle={false}
        title="Swap History"
        visible={historyVisible}
        style={{ overflowY: 'auto', backgroundColor: mode === 'dark' ? '#1c1c1c' : 'white' }}
      >
        <History reload={reloadTrigger} />
      </SWAP_HISTORY_MODAL>
      <HEADER_WRAPPER $iconSize="40px">
        <HEADER_TITLE>
          <span>{breakpoint.isMobile ? 'Swap' : dateString(new Date())}</span>
          <img src={`/img/crypto/jup_${mode}.svg`} alt="jupiter-icon" className={'jup-icon'} />
        </HEADER_TITLE>

        <div>
          {wallet?.adapter?.publicKey && (
            <div
              onClick={openHistory}
              tw="flex justify-center items-center dark:bg-black-1 bg-grey-4 h-10 w-10
                  rounded-circle mr-2 cursor-pointer"
            >
              <img
                src={`/img/assets/history.svg`}
                alt="history"
                tw="h-4! w-4!"
                style={{
                  filter:
                    mode === 'dark'
                      ? 'sepia(70%) brightness(150%) invert(60%)'
                      : 'sepia(30%) brightness(100%) invert(20%)'
                }}
              />
            </div>
          )}
          {!checkMobile() && (
            <div
              onClick={showWrapSolModal}
              tw="mr-2.5 text-black-3 text-center cursor-pointer h-[40px] w-[40px] text-smallest
            dark:text-white dark:bg-black-4 bg-grey-4 rounded-[100%] leading-10"
            >
              wSOL
            </div>
          )}
          <div onClick={refresh} style={{ cursor: 'pointer' }}>
            <img
              src={`/img/assets/refresh.svg`}
              alt="refresh-icon"
              className={`rotateRefreshBtn ${refreshed ? 'rotateRefreshBtn-rotate' : ''}`}
            />
          </div>
          <SETTING_WRAPPER onClick={openSettings}>
            <img src={`/img/assets/settings_${mode}_mode.svg`} alt="settings" className={'smaller-header-icon'} />
          </SETTING_WRAPPER>
        </div>
      </HEADER_WRAPPER>
      <BODY>
        <style>{localCSS}</style>
        <SwapFrom height={height} />
        <SWITCH measurements={64} onClick={onSwitchClick}>
          <img className={`swap-switch`} src={`/img/assets/swap_switch.svg`} alt="switch" />
        </SWITCH>
        <SwapTo height={height} />
      </BODY>
      {breakpoint.isMobile && tokenA && tokenB && inTokenAmount > 0 && <AlternativesContent />}
      <SwapButton exchange={exchange} />
    </SWAP_CONTENT>
  )
}

const COPY = styled.div`
  .copy-button {
    ${tw`relative ml-2 font-semibold cursor-pointer text-tiny leading-[18px]`}
    color: #8a8a8a;
  }

  .copied:after {
    content: 'Copied!';
    position: absolute;
    display: inline;
    left: 0;
    bottom: 0;
    color: white;
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
    animation: 1s ease-in-out 0s 1 normal forwards running copyit;
  }

  @keyframes copyit {
    0% {
      bottom: 1px;
      opacity: 1;
    }
    100% {
      bottom: 1.7em;
      opacity: 0;
    }
  }
`

const TokenContent: FC = () => {
  const [socials, setSocials] = useState([])
  const [copiedAction, setCopiedAction] = useState(false)
  //CoinGeckoClient
  const { tokenA, tokenB, CoinGeckoClient, coingeckoTokenMap } = useSwap()
  const [tokenDetails, setDetails] = useState([
    { name: 'Price', value: '0', currency: '$' },
    { name: 'FDV', value: '0', currency: '$' },
    { name: 'Max Total Supply', value: '0' },
    { name: 'Holders', value: '0' }
  ])
  const [tokenDetailsB, setDetailsB] = useState([
    { name: 'Price', value: '0', currency: '$' },
    { name: 'FDV', value: '0', currency: '$' },
    { name: 'Max Total Supply', value: '0' },
    { name: 'Holders', value: '0' }
  ])
  const [toggle, setToggle] = useState(false) //tokenA

  useEffect(() => {
    try {
      fetchCoinGecko()
    } catch (error) {
      console.log(error)
    }
    return () => {
      aborter.abortBulkWithPrefix('tokens-content-fetch-coin-gecko')
    }
  }, [tokenA, tokenB, coingeckoTokenMap])

  const handleCopyTokenMint = useCallback(() => {
    setCopiedAction(true)
    navigator.clipboard.writeText(toggle ? tokenB.address : tokenA.address)
    setTimeout(() => setCopiedAction(false), 800)
  }, [tokenA, tokenB, toggle])

  const fetchCoinGecko = useCallback(async () => {
    try {
      if (tokenA) {
        const token = coingeckoTokenMap.get(tokenA.name.toLowerCase())
        if (token) {
          const execution = []
          execution.push(
            CoinGeckoClient.coins.fetch(token?.id || null, {
              signal: aborter.addSignal('tokens-content-fetch-coin-gecko-' + token?.id)
            }),
            fetch('https://public-api.solscan.io/token/holders?tokenAddress=' + tokenA.address, {
              signal: aborter.addSignal('tokens-content-fetch-coin-gecko-' + tokenA.address)
            })
          )
          Promise.all(execution)
            .then(async ([coinGeckoA, tokenHoldersA]) => {
              const data = coinGeckoA?.data
              // rate limiting causing data offset - find better way to query holder count
              const res = tokenHoldersA?.status == 200 && (await tokenHoldersA?.json())

              setDetails([
                { name: 'Price', value: data?.market_data?.current_price?.usd || '0.0', currency: '$' },
                {
                  name: 'FDV',
                  value:
                    moneyFormatter(
                      Math.floor(
                        data?.market_data?.fully_diluted_valuation?.usd ||
                          data?.market_data?.total_supply * data?.market_data?.current_price?.usd
                      )
                    ) || '0',
                  currency: '$'
                },
                {
                  name: 'Total Max Supply',
                  value:
                    Math.floor(
                      data?.market_data?.max_supply || data?.market_data?.total_supply
                    )?.toLocaleString() || '0'
                },
                { name: 'Holders', value: res?.total?.toLocaleString() || 0 }
              ])
              setSocials([
                { name: 'Twitter', link: 'https://twitter.com/' + data?.links?.twitter_screen_name },
                { name: 'Website', link: data?.links?.homepage?.[0] },
                { name: 'Coingecko', link: 'https://coingecko.com' }
              ])
            })
            .catch((err) => console.error('ERROR: CoinGecko fetch failed for tokenA', err))
        }
      }

      if (tokenB) {
        const token = coingeckoTokenMap.get(tokenB.name.toLowerCase())
        if (token) {
          const execution = []
          execution.push(
            CoinGeckoClient.coins.fetch(token?.id || null, {
              signal: aborter.addSignal('tokens-content-fetch-coin-gecko-' + token?.id)
            }),
            fetch('https://public-api.solscan.io/token/holders?tokenAddress=' + tokenB.address, {
              signal: aborter.addSignal('tokens-content-fetch-coin-gecko-' + tokenB.address)
            })
          )
          Promise.all(execution)
            .then(async ([coingGeckoB, tokenHoldersB]) => {
              const dataB = coingGeckoB?.data
              const resB = tokenHoldersB?.status == 200 && (await tokenHoldersB?.json())
              setDetailsB([
                { name: 'Price', value: dataB?.market_data?.current_price?.usd || '0.0', currency: '$' },
                {
                  name: 'FDV',
                  value:
                    moneyFormatter(
                      Math.floor(
                        dataB?.market_data?.fully_diluted_valuation?.usd ||
                          dataB?.market_data?.total_supply * dataB?.market_data?.current_price?.usd
                      )
                    ) || '0',
                  currency: '$'
                },
                {
                  name: 'Total Max Supply',
                  value:
                    Math.floor(
                      dataB?.market_data?.max_supply || dataB?.market_data?.total_supply
                    )?.toLocaleString() || '0'
                },
                { name: 'Holders', value: resB?.total?.toLocaleString() || 0 }
              ])
            })
            .catch((err) => console.error('ERROR: CoinGecko Fetch for tokenB failed', err))
        }
      }
    } catch (e) {
      console.log(e)
    }
  }, [tokenA, tokenB, coingeckoTokenMap, CoinGeckoClient])
  const toggleToken = useCallback(() => {
    setToggle((prev) => !prev)
  }, [])
  const { shortTokenName, address }: { shortTokenName: string; address: string } = useMemo(() => {
    const returnObj = {
      shortTokenName: '',
      address: ''
    }
    if (toggle) {
      returnObj.shortTokenName = tokenB.name
      returnObj.address = `${tokenB.address.slice(0, 7)}...${tokenB.address.slice(-6)}`
    } else {
      returnObj.shortTokenName = tokenA.name
      returnObj.address = `${tokenA.address.slice(0, 7)}...${tokenA.address.slice(-6)}`
    }

    if (returnObj.shortTokenName.length > 12) {
      returnObj.shortTokenName = returnObj.shortTokenName.slice(0, 12)
      returnObj.shortTokenName += '...'
    }
    returnObj.shortTokenName = `${returnObj.shortTokenName} (${toggle ? tokenB.symbol : tokenA.symbol})`
    return returnObj
  }, [toggle, tokenA, tokenB])
  const tokenDetailItems: ReactNode[] = useMemo(() => {
    if (!tokenDetails || tokenDetails.length == 0) {
      return []
    }
    return tokenDetails.map((detail) => (
      <AltTokenDetail key={detail.name + detail.value}>
        <TokenTitleFDV>{detail.name}</TokenTitleFDV>
        <SmallTitle>
          {detail.currency || null} {detail.value}
        </SmallTitle>
      </AltTokenDetail>
    ))
  }, [tokenDetails])
  const tokenDetailItemsB: ReactNode[] = useMemo(() => {
    if (!tokenDetailsB || tokenDetailsB.length == 0) {
      return []
    }
    return tokenDetailsB.map((detail) => (
      <AltTokenDetail key={detail.name + detail.value}>
        <TokenTitleFDV>{detail.name}</TokenTitleFDV>
        <SmallTitle>
          {detail.currency || null} {detail.value}
        </SmallTitle>
      </AltTokenDetail>
    ))
  }, [tokenDetailsB])
  const handleSocialLinkClick = useCallback((link: string) => () => window.open(link, '_blank'), [])
  const socialItems = useMemo(
    () =>
      socials.map((social) => (
        <SocialsButton className={'group'} key={social.name} onClick={handleSocialLinkClick(social.link)}>
          <SocialsIcon
            $image={
              social.name == 'Twitter'
                ? '/img/assets/website.svg'
                : social.name == 'Coingecko'
                ? '/img/assets/coingecko.svg'
                : '/img/assets/discord.svg'
            }
          />
        </SocialsButton>
      )),
    [socials]
  )
  return (
    <TOKEN_WRAPPER>
      <TokenHeader>
        <SwapTokenToggle toggleToken={toggleToken} />

        <SubHeader>
          <TokenTitle>{shortTokenName}</TokenTitle>
          <COPY style={{ display: 'flex', alignItems: 'center' }}>
            <SmallerTitle>{address}</SmallerTitle>
            <span className={`copy-button ${copiedAction ? 'copied' : ''}`} onClick={handleCopyTokenMint}>
              {copiedAction ? 'Copied!' : 'Copy'}
            </span>
          </COPY>
        </SubHeader>
      </TokenHeader>
      <TokenListWrapper className={'no-scrollbar'}>
        {!toggle ? tokenDetailItems : tokenDetailItemsB}
      </TokenListWrapper>
      <Socials>{socialItems}</Socials>
    </TOKEN_WRAPPER>
  )
}

interface PriceContentDetail {
  name: string
  value: string
  extraValue?: string
  icon?: string
}

const PriceContent: FC = () => {
  const { tokenA, tokenB, inTokenAmount, clickNo, chosenRoutes: routes } = useSwap()
  const { tokenMap } = useTokenRegistry()
  const breakpoint = useBreakPoint()
  const [details, setDetails] = useState<PriceContentDetail[]>([
    { name: 'Price Impact', value: '0%' },
    {
      name: breakpoint.isMobile ? 'Min. Received' : 'Minimum Received',
      value: 0 + ' ' + tokenB.symbol
    },
    {
      name: 'Fees paid to GooseFx LP',
      value: `${0} ${tokenA.symbol} (${0} %)`,
      extraValue: `0 ${tokenB.symbol} (0%)`
    },
    { name: breakpoint.isMobile ? 'Trans. Fee' : 'Transaction Fee', value: '0.00005 SOL', icon: 'info' }
  ])
  const [outAmount, setOutAmount] = useState(0)
  const [outTokenPercentage, setOutTokenPercentage] = useState(0)
  const [cheap, setCheap] = useState(true)

  const getPriceDetails = useCallback(
    (out: number, route: any) => {
      const totalLp = route.lpFee.amount / 10 ** tokenA.decimals || 0.0
      let percent = route.lpFee.pct || +((totalLp / inTokenAmount) * 100)?.toFixed(4) || 0.0
      percent = isFinite(percent) ? percent : 0.0
      const totalLpB = route.lpFee.amount / 10 ** tokenB.decimals || 0.0
      let percentB = +((totalLpB / out) * 100)?.toFixed(4) || 0.0
      percentB = isFinite(percentB) ? percentB : 0.0

      const token = tokenMap.get(route.lpFee.mint)
      return { totalLp, totalLpB, percent, percentB, token }
    },
    [tokenMap, tokenA, inTokenAmount]
  )
  useEffect(() => {
    const route = routes?.[clickNo]
    if (!route) return
    const out = route.outAmount / 10 ** tokenB.decimals

    setOutAmount(out)

    const priceDetails: PriceContentDetail[] = [
      { name: 'Price Impact', value: `< ${Number(route.priceImpactPct).toFixed(6)}%` },
      {
        name: breakpoint.isMobile ? 'Min. Received' : 'Minimum Received',
        value: `${nFormatter(route.outAmountWithSlippage / 10 ** tokenB.decimals, tokenB.decimals)} ${
          tokenB.symbol
        }`
      }
    ]

    for (let i = 0; i < clamp(route?.marketInfos.length ?? 0, 0, 3); i++) {
      const market = route.marketInfos[i]
      const calculatedPriceDetails = getPriceDetails(out, market)
      priceDetails.push({
        name: `Fees paid to ${market.amm.label || 'GooseFX'} LP`,
        value: `${nFormatter(
          calculatedPriceDetails.totalLp,
          calculatedPriceDetails.token?.decimals || tokenA.decimals
        )} ${calculatedPriceDetails.token?.symbol || tokenA.symbol} (${calculatedPriceDetails.percent} %)`
      })
    }
    priceDetails.push({
      name: breakpoint.isMobile ? 'Trans. Fee' : 'Transaction Fee',
      value: '0.00005 SOL',
      icon: 'info'
    })

    setDetails(priceDetails)

    const percentageCheap = +(((route.outAmount - routes[0]?.outAmount) / route.outAmount) * 100).toFixed(5)
    setOutTokenPercentage(Math.abs(percentageCheap))
    setCheap(percentageCheap >= 0)
  }, [clickNo, inTokenAmount, tokenA.symbol, tokenB.symbol, routes, breakpoint.isMobile])
  const detailItems: ReactNode[] = useMemo(() => {
    if (!details || details.length == 0) {
      return []
    }
    return details.map((detail) => (
      <AltTokenDetail key={detail.name + detail.value}>
        <TokenTitleFees>
          {detail.name}{' '}
          {detail.icon && (
            <Tooltip dark placement="top" color="#fff">
              <span style={{ color: '#000' }}>
                {'The amount of fee we take, in order to process your transaction.'}
              </span>
            </Tooltip>
          )}
        </TokenTitleFees>
        <SmallTitle>{detail.value}</SmallTitle>
        <SmallTitle>{detail.extraValue || null}</SmallTitle>
      </AltTokenDetail>
    ))
  }, [details])
  return (
    <PRICE_WRAPPER>
      <PriceHeader>
        <PriceTitle>Price Info</PriceTitle>
      </PriceHeader>
      <TokenDetail>
        <TokenTitle>Rate</TokenTitle>
        <SmallTitleFlex>
          <SMALL_CLICKER_ICON
            draggable={false}
            preview={false}
            src={`/img/crypto/${tokenA.symbol}.svg`}
            fallback={tokenA.logoURI || '/img/crypto/Unknown.svg'}
            alt="inputToken"
          />
          <span className={'token-name'}>
            {inTokenAmount} {tokenA.symbol} ≈{'  '}
          </span>
          <SMALL_CLICKER_ICON
            draggable={false}
            preview={false}
            src={`/img/crypto/${tokenB.symbol}.svg`}
            fallback={tokenB.logoURI || '/img/crypto/Unknown.svg'}
            alt="out-token"
            style={{ marginLeft: '8px' }}
          />
          <span className={'token-name'}>
            {+outAmount.toFixed(3)} {tokenB.symbol}
          </span>
        </SmallTitleFlex>
        <SmallTitleFlex>
          <strong style={{ color: cheap ? '#5fc8a7' : '#bb3535', marginRight: '0.25rem' }}>
            {isFinite(outTokenPercentage) ? outTokenPercentage.toFixed(2) : 0}% {cheap ? 'cheaper' : 'higher'}
          </strong>
          <strong>than CoinGecko</strong>
        </SmallTitleFlex>
      </TokenDetail>
      <ListWrapper className={'no-scrollbar'}>{detailItems}</ListWrapper>
    </PRICE_WRAPPER>
  )
}

const AlternativesContent: FC = () => {
  const [less, setLess] = useState(false)
  const { mode } = useDarkMode()
  const { tokenMap } = useTokenRegistry()
  const { tokenA, tokenB, outTokenAmount, chosenRoutes: routes, clickNo, setClickNo } = useSwap()
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1200 && window.innerWidth < 1300 && !less) {
        setLess(true)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const { details, lessDetails }: { details: ReactNode[]; lessDetails: ReactNode[] } = useMemo(() => {
    let goosefx = -1
    const newDetails: {
      name: any
      value: string
      price: number
      outAmount: number
      bestPrice?: boolean
      fastest?: boolean
    }[] = []
    for (let i = 0; i < routes.length; i++) {
      const market = routes[i].marketInfos
      const name =
        market.length === 1 ? market[0].amm.label : market[0].amm.label + ' x ' + market.slice(-1)[0].amm.label

      const price = +(routes[i].outAmount / 10 ** tokenB.decimals).toFixed(6)

      newDetails.push({
        name: name.length > 18 ? name.slice(0, 18) + '...' : name,
        value:
          market.length < 2
            ? `${tokenA.symbol} • ${tokenB.symbol}`
            : tokenA.symbol +
              ' • ' +
              (tokenMap.get(market[0].outputMint.toBase58())?.symbol || 'unknown') +
              ' • ' +
              tokenB.symbol,
        price,
        outAmount: price
      })
      if (goosefx == -1 && name.toLowerCase().includes('goosefx')) {
        goosefx = i
      }
    }
    // does intitial check before prepending gooesefx if possible and adds tags (best/fastest)
    if (newDetails.length > 0) {
      if (goosefx >= 0) {
        newDetails[0].fastest = true
        if (newDetails[goosefx].price < newDetails[goosefx + 1]?.price) {
          newDetails[goosefx + 1].bestPrice = true
        }
      } else {
        newDetails[0].bestPrice = true
      }
    }
    const renderDetails = newDetails.map((detail, k) => (
      <SWAP_ROUTE_ITEM
        key={detail?.name + detail?.price + k}
        $clicked={k === clickNo}
        $cover={mode === 'dark' ? '#3c3b3ba6' : '#ffffffa6'}
        onClick={() => setClickNo(k)}
      >
        <div className={'inner-container'}>
          <TokenDetail className={'content'}>
            <TokenTitle>{detail?.name}</TokenTitle>
            <AltSmallTitle>{detail?.value}</AltSmallTitle>
          </TokenDetail>
          <TokenPrice className={'price'}>{detail?.price || null}</TokenPrice>
          {detail.bestPrice && <ROUTE_TAG>Best Price</ROUTE_TAG>}
          {detail.fastest && <ROUTE_TAG>Preferred</ROUTE_TAG>}
        </div>
      </SWAP_ROUTE_ITEM>
    ))
    return {
      details: renderDetails,
      lessDetails: renderDetails.slice(0, 2)
    }
  }, [routes, tokenA.symbol, tokenB.symbol, tokenMap, outTokenAmount, mode])
  const toggleSetLess = useCallback(() => {
    setLess((prev) => !prev)
  }, [])
  const breakpoint = useBreakPoint()
  return (
    <SWAP_ROUTES less={less || details.length < 3}>
      <div className="swap-content">
        {details?.length < 1 ? (
          <>
            <SkeletonCommon
              width={'342px'}
              height={breakpoint.isMobile ? '64px' : '75px'}
              borderRadius="10px"
              style={{
                marginRight: breakpoint.isMobile ? '0px' : '16px',
                marginBottom: breakpoint.isMobile ? '16px' : '0px',
                boxShadow: '0 6px 9px 0 rgba(36, 36, 36, 0.1)'
              }}
            />
            <SkeletonCommon
              width={'342px'}
              height={breakpoint.isMobile ? '64px' : '75px'}
              borderRadius="10px"
              style={{
                marginRight: breakpoint.isMobile ? '0px' : '16px',
                marginBottom: breakpoint.isMobile ? '16px' : '0px',
                boxShadow: '0 6px 9px 0 rgba(36, 36, 36, 0.1)'
              }}
            />
          </>
        ) : less ? (
          lessDetails
        ) : (
          details
        )}
      </div>
      {routes.length > 3 && (
        <div className="action">
          <div onClick={toggleSetLess}>{less ? 'Show More' : 'Show Less'}</div>
        </div>
      )}
    </SWAP_ROUTES>
  )
}

export const SwapMain: FC = () => {
  const { isCollapsed } = useNavCollapse()

  const { tokenA, tokenB, inTokenAmount, outTokenAmount, gofxOutAmount, priceImpact, setRoutes, revertRoute } =
    useSwap()
  const { network } = useConnectionConfig()
  const { slippage } = useSlippageConfig()
  const [allowed, setallowed] = useState<boolean>(false)
  const [inAmountTotal, setInAmountTotal] = useState<number>(0)
  const [refreshed, setRefreshed] = useState<boolean>(false)
  const breakpoint = useBreakPoint()
  const { routes, exchange } = useJupiter({
    amount: JSBI.BigInt(inAmountTotal), // raw input amount of tokens
    inputMint: new PublicKey(tokenA?.address || 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD'),
    outputMint: new PublicKey(tokenB?.address || 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD'),
    slippage: slippage, // 1% slippage
    debounceTime: 2000 // debounce ms time before refresh
  })

  useEffect(() => {
    const inAmountTotal = inTokenAmount * 10 ** (tokenA?.decimals || 0)
    const roundedTotal = Math.round(inAmountTotal)
    setInAmountTotal(roundedTotal)
    const newRoutes = []
    const supported =
      (tokenB?.symbol === 'USDC' && CURRENT_SUPPORTED_TOKEN_LIST.has(tokenA?.symbol)) ||
      (tokenA?.symbol === 'USDC' && CURRENT_SUPPORTED_TOKEN_LIST.has(tokenB?.symbol))
    if (network !== 'devnet') {
      if (tokenA && tokenB) {
        setallowed(true)
      } else if (!routes || routes.length == 0) {
        return
      }

      for (let i = 0; i < routes?.length; i++) {
        const route = revertRoute(routes[i], true)
        if (route.inAmount !== roundedTotal) {
          continue
        }
        newRoutes.push(route)
      }

      if (tokenB && newRoutes.length > 0 && supported) {
        newRoutes.unshift({
          marketInfos: [
            {
              outputMint: new PublicKey(tokenB.address || 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD'),
              lpFee: { amount: 0.001 * inAmountTotal },

              amm: {
                label: 'GooseFX'
              }
            }
          ],
          outAmount: +((gofxOutAmount || 0) * 10 ** tokenB.decimals).toFixed(7),
          outAmountWithSlippage: +((gofxOutAmount || 0) * 10 ** tokenB.decimals * (1 - slippage)).toFixed(7),
          priceImpactPct: priceImpact || 0
        })
      }
    } else if (tokenA && tokenB && inAmountTotal > 0) {
      newRoutes.push({
        marketInfos: [
          {
            outputMint: new PublicKey(tokenB.address || 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD'),
            lpFee: { amount: 0.001 * inAmountTotal },

            amm: {
              label: 'GooseFX'
            }
          }
        ],
        outAmount: +((gofxOutAmount || 0) * 10 ** tokenB.decimals).toFixed(7),
        outAmountWithSlippage: +((gofxOutAmount || 0) * 10 ** tokenB.decimals * (1 - slippage)).toFixed(7),
        priceImpactPct: priceImpact || 0
      })
    }
    if (newRoutes.length > 0) {
      // truncates routes to 2 or 3
      newRoutes.length = clamp(newRoutes.length, 0, 3)
      setRoutes(newRoutes)
    }
  }, [tokenA, tokenB, routes, slippage, inTokenAmount, outTokenAmount, gofxOutAmount, network, priceImpact])

  const RefreshedAnimation: FC<{ active: boolean; isMobile: boolean; navCollapsed: boolean }> = useCallback(
    ({ active, isMobile, navCollapsed }) => (
      <RefreshAlert $active={active} $isMobile={isMobile} $navCollapsed={navCollapsed}>
        <div>
          Last updated: {checkMobile() && <br />} {new Date().toUTCString()}
        </div>
      </RefreshAlert>
    ),
    []
  )

  if (checkMobile()) {
    return (
      <WRAPPER>
        <RefreshedAnimation active={refreshed} isMobile={true} navCollapsed={isCollapsed} />
        <INNERWRAPPER $desktop={false} $navCollapsed={false}>
          <SwapContent exchange={exchange} setRefreshed={setRefreshed} refreshed={refreshed} />
          {allowed && <PriceContent />}
          {allowed && <TokenContent />}
        </INNERWRAPPER>
      </WRAPPER>
    )
  } else {
    return (
      <WRAPPER>
        <RefreshedAnimation active={refreshed} isMobile={false} navCollapsed={isCollapsed} />
        <INNERWRAPPER $desktop={breakpoint.isDesktop && allowed} $navCollapsed={isCollapsed}>
          {breakpoint.isDesktop && allowed && <TokenContent />}
          <SwapContent exchange={exchange} setRefreshed={setRefreshed} refreshed={refreshed} />
          {breakpoint.isDesktop && allowed && <PriceContent />}
        </INNERWRAPPER>
        {allowed && inTokenAmount > 0 && <AlternativesContent />}
      </WRAPPER>
    )
  }
}

interface RouteParams {
  tradePair: string
}

const SwapMainProvider: FC = () => {
  const { setTokenA, setTokenB } = useSwap()
  const { network, connection } = useConnectionConfig()
  const { wallet } = useWallet()
  const { tokenMap } = useTokenRegistry()
  const { tradePair } = useParams<RouteParams>()

  useEffect(() => {
    const [tradePairA, tradePairB] = (tradePair ?? '-').split('-')
    //constant fetch time as opposed to n * 4 ops: token1 + token2 + usd + gofx = n*4 ops
    const token1 = tokenMap.get(tradePairA)
    const token2 = tokenMap.get(tradePairB)
    const usd = tokenMap.get('USDC')
    const sol = tokenMap.get('SOL')

    if (token1) {
      setTokenA({ address: token1.address, decimals: token1.decimals, symbol: token1.symbol, name: token1.name })
    } else if (sol) {
      setTokenA({ address: sol.address, decimals: sol.decimals, symbol: sol.symbol, name: sol.name })
    }

    if (token2) {
      setTokenB({ address: token2.address, decimals: token2.decimals, symbol: token2.symbol, name: token2.name })
    } else if (usd) {
      setTokenB({ address: usd.address, decimals: usd.decimals, symbol: usd.symbol, name: usd.name })
    }
  }, [setTokenA, setTokenB, tokenMap, tradePair])
  return (
    <JupiterProvider connection={connection} cluster={network} userPublicKey={wallet?.adapter?.publicKey}>
      <SwapMain />
    </JupiterProvider>
  )
}

export const Swap: FC = () => (
  <SwapProvider>
    <SwapMainProvider />
  </SwapProvider>
)
