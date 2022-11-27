import React, { FC, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Image } from 'antd'
import { logEvent } from 'firebase/analytics'
import analytics from '../../analytics'
import styled, { css } from 'styled-components'
import { Settings } from './Settings'
import { Wrap } from './Wrap'
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
  DEFAULT_MAINNET_RPC,
  useConnectionConfig,
  useTokenRegistry
} from '../../context'
import { CenteredImg, SpaceBetweenDiv, CenteredDiv, SVGDynamicReverseMode } from '../../styles'
import { JupiterProvider, useJupiter } from '@jup-ag/react-hook'
import { PublicKey } from '@solana/web3.js'
import { TOKEN_LIST_URL } from '@jup-ag/core'
import { useWallet } from '@solana/wallet-adapter-react'
import { ILocationState } from '../../types/app_params.d'
import { notify, moneyFormatter, nFormatter, checkMobile } from '../../utils'
import { CURRENT_SUPPORTED_TOKEN_LIST } from '../../constants'
import { useParams } from 'react-router-dom'
import tw from 'twin.macro'
import JSBI from 'jsbi'
import { logData } from '../../api'

const WRAPPER = styled.div`
  ${tw`w-screen not-italic`}
  min-height: calc(100vh - 58px);
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

const RefreshAlert = styled.div<{ $active: boolean; $isMobile: boolean }>`
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
      top: ${({ $isMobile }) => ($isMobile ? '88px' : '125px')};
      opacity: 1;
    }
    80% {
      top: ${({ $isMobile }) => ($isMobile ? '88px' : '125px')};
      opacity: 1;
    }
    100% {
      opacity: 0;
      top: 0px;
    }
  }
`

const INNERWRAPPER = styled.div<{ $desktop: boolean }>`
  ${tw`flex pt-[142px] items-center w-screen mb-7 
  max-h-80p sm:justify-start sm:flex sm:flex-col sm:items-center sm:h-full`}

  color: ${({ theme }) => theme.text1};
  justify-content: ${({ $desktop }) => ($desktop ? 'space-between' : 'space-around')};

  @media (max-width: 500px) {
    padding: 142px 15px 1rem;
  }
`

const SETTING_MODAL = styled(Modal)`
  width: 628px !important;
  background-color: ${({ theme }) => theme.bg20} !important;
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
  ${tw`items-center w-81.5 rounded-r-bigger py-6 pr-6 pl-8 h-[575px] sm:w-full sm:rounded-bigger sm:min-h-0`}
  font-family: Montserrat;
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
  ${tw`flex flex-col w-full mb-2.5 ml-10 sm:ml-0 sm:items-center`}
`

const SWAP_ROUTE_ITEM = styled.div<{ $clicked?: boolean; $cover: string }>`
  ${tw`h-[75px] rounded-[10px] p-px cursor-pointer mr-7 !min-w-[342px] mb-4 
  sm:h-16.25 sm:mt-0 sm:mx-0 sm:mb-4 sm:min-w-[80vw] sm:!w-[316px]`}

  background: ${({ theme, $clicked }) =>
    $clicked
      ? 'linear-gradient(90deg,rgba(247,147,26,0.5) 0%,rgba(220,31,255,0.5) 100%)'
      : checkMobile()
      ? theme.bg10
      : theme.bg20};
  box-shadow: 0 6px 9px 0 rgba(36, 36, 36, 0.1);

  .inner-container {
    ${tw`relative flex justify-center items-center h-full w-full rounded-[10px] p-2 sm:static`}
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
  ${tw`relative mx-[24px] pt-4`}

  .swap-content {
    ${tw`flex h-1/5 mt-0 pb-3 pt-4 pl-4 justify-center
    sm:flex sm:flex-col sm:w-full sm:items-center sm:h-auto sm:justify-around 
    sm:mt-8 sm:mb-12 sm:mx-0 sm:p-0`}
    overflow-x: auto;

    @media (max-width: 1515px) {
      justify-content: ${({ less }) => (less ? 'center' : 'start')};
    }
  }

  .action {
    ${tw`mb-2 sm:absolute sm:!text-base sm:!right-0`}

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
  ${tw`w-full sm:flex sm:py-3 flex-wrap`}
`

const TokenListWrapper = styled(ListWrapper)`
  ${tw`ml-10 sm:ml-0 sm:w-full sm:items-center`}
`

const SubHeader = styled.div`
  ${tw`ml-0 sm:ml-0 h-12`}
`

const Socials = styled.div`
  ${tw`flex justify-between	w-full mt-2`}
`

const SocialsButton = styled.div`
  ${tw`cursor-pointer text-xs rounded-2xl py-1 px-3 leading-normal`}
  background-color: ${({ theme }) => theme.bg12};
  color: ${({ theme }) => theme.text14};
  line-height: inherit;
`
//background-color: ${({ theme }) => theme.bg19};

const SMALL_CLICKER_ICON = styled(CenteredImg)`
  overflow: hidden;
  ${tw`h-5 w-5 mr-2 rounded-circle`}
`

const PRICE_WRAPPER = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  ${tw`items-center h-full w-81.5 p-6 rounded-tl-bigger 
  h-[575px] rounded-bl-bigger sm:w-full sm:rounded-bigger sm:mb-12`}
  font-family: Montserrat;
  background: ${({ theme }) => theme.swapSides2};
`

const ROUTE_TAG = styled.div`
  ${tw`absolute top-[-12px] right-[-18px] font-semibold items-center text-xs p-2 rounded-md text-white leading-3 
  sm:top-[32px] sm:right-0`}
  background-color: #be2cff;
  z-index: 100;
`

const ShowLess = styled.div`
  ${tw`font-semibold cursor-pointer rounded-lg text-lg mr-[9.5%]! sm:mr-0!`}
`

const ShowMore = styled.div`
  ${tw`font-semibold cursor-pointer rounded-lg text-lg mr-[30%]! sm:mr-0!`}
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

const SWITCH = styled(CenteredImg)<{ measurements: number }>`
  ${tw`absolute cursor-pointer`}
  top: calc(50% - ${({ measurements }) => measurements}px / 2 + ${({ theme }) => theme.margin(3)});
  left: calc(50% - ${({ measurements }) => measurements}px / 2);
  ${({ measurements, theme }) => theme.measurements(measurements + 'px')}
  z-index: 1;

  .swap-switch {
    ${tw`h-auto w-auto sm:h-32 sm:w-32 sm:mt-10`}
  }
`

const SWAP_CONTENT = styled.div`
  ${tw`items-center p-8 w-628 max-h-90p min-h-400 rounded-bigger sm:w-full sm:mb-12 sm:p-5 sm:text-sm`}
  ${({ theme }) => theme.flexColumnNoWrap}
  background-color: ${({ theme }) => theme.bg20};

  box-shadow: 0 7px 15px 5px rgba(0, 0, 0, 0.15);
  @media (max-width: 500px) {
    line-height: inherit;
  }

  .wrapped-sol {
    margin-right: 10px;
    height: 2.5rem;
    width: 2.5rem;
    border-radius: 100%;
    text-align: center;
    line-height: 2.5rem;
    font-size: 10px;
    background-color: ${({ theme }) => theme.bg22};
    cursor: pointer;
  }
`

const SwapContent: FC<{
  exchange?: (any: any) => void
  routes: any
  clickNo: number
  setRefreshed: React.Dispatch<React.SetStateAction<boolean>>
  refreshed: boolean
}> = ({ exchange, routes, clickNo, setRefreshed, refreshed }) => {
  const location = useLocation<ILocationState>()
  const { setEndpointName, network } = useConnectionConfig()
  const { mode } = useDarkMode()
  const { amountPool, setFocused, switchTokens, setClickNo, setRoutes, tokenA, tokenB, inTokenAmount } = useSwap()
  const [settingsModalVisible, setSettingsModalVisible] = useState(false)
  const [route, setRoute] = useState(routes[clickNo])
  const [wrapModalVisible, setWrapModalVisible] = useState(false)

  useEffect(() => {
    const an = analytics()
    an !== null &&
      logEvent(an, 'screen_view', {
        firebase_screen: 'Swap',
        firebase_screen_class: 'load'
      })
    logData('swap_page')

    if (network === 'devnet') {
      setEndpointName(DEFAULT_MAINNET_RPC)
      notify({ message: `Switched to mainnet` })
    }
  }, [location])

  useEffect(() => {
    setRoute(routes[clickNo])
  }, [routes, clickNo])

  const onClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setSettingsModalVisible(true)
  }

  const refresh = () => {
    setClickNo(0)
    setRoutes([])
    setRefreshed(true)
    setTimeout(() => {
      setRefreshed(false)
      amountPool()
    }, 3000)
  }

  const dateString = (date: Date) => {
    const datestring = date.toString().split(' ')
    const month = datestring[1]
    const day = datestring[2]
    const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    return `${month} ${day}, ${time}`
  }

  const height = '56px'

  const localCSS = css`
    .swap-input {
      height: ${height};
      border-radius: 45px;
      border: none;
      padding-right: 20px;
      font-size: 20px !important;
      font-weight: 600;
    }

    .ant-modal-centered {
      top: -75px;
    }
    .ant-modal {
      border-radius: 20px;
    }
  `

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
      <HEADER_WRAPPER $iconSize="40px">
        <HEADER_TITLE>
          <span>{checkMobile() ? 'Swap' : dateString(new Date())}</span>
          <img src={`/img/crypto/jup_${mode}.svg`} alt="jupiter-icon" className={' jup-icon'} />
        </HEADER_TITLE>

        <div>
          <div onClick={() => setWrapModalVisible(true)} className="wrapped-sol">
            wSOL
          </div>
          <div onClick={refresh} style={{ cursor: 'pointer' }}>
            <img
              src={`/img/assets/refresh.svg`}
              alt="refresh-icon"
              className={`rotateRefreshBtn ${refreshed ? 'rotateRefreshBtn-rotate' : ''}`}
            />
          </div>
          <SETTING_WRAPPER onClick={onClick}>
            <img src={`/img/assets/settings_${mode}_mode.svg`} alt="settings" className={'smaller-header-icon'} />
          </SETTING_WRAPPER>
        </div>
      </HEADER_WRAPPER>
      <BODY>
        <style>{localCSS}</style>
        <SwapFrom height={height} />
        <SWITCH
          measurements={100}
          onClick={() => {
            setFocused('from')
            switchTokens()
          }}
        >
          <img className={`swap-switch`} src={`/img/assets/swap_switch.svg`} alt="switch" />
        </SWITCH>
        <SwapTo height={height} />
      </BODY>
      {checkMobile() && tokenA && tokenB && inTokenAmount > 0 && (
        <AlternativesContent routes={routes} clickNo={clickNo} setClickNo={setClickNo} />
      )}
      <SwapButton exchange={exchange} route={route} />
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
  const { tokenA, tokenB, CoinGeckoClient, coingeckoTokens } = useSwap()
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
  const [token, setToken] = useState(tokenA)

  const truncate = (address: string) => address.slice(0, 7) + '...' + address.slice(-6)

  useEffect(() => {
    try {
      fetchCoinGecko()
    } catch (error) {
      console.log(error)
    }
  }, [tokenA, tokenB])

  useEffect(() => {
    if (toggle) {
      setToken(tokenB)
    } else {
      setToken(tokenA)
    }
  }, [tokenA, tokenB])

  const handleCopyTokenMint = () => {
    setCopiedAction(true)
    navigator.clipboard.writeText(token.address)
    setTimeout(() => setCopiedAction(false), 800)
  }

  const fetchCoinGecko = async () => {
    try {
      if (tokenA) {
        const token = coingeckoTokens.find((i) => i.symbol.toLowerCase() === tokenA.symbol.toLowerCase())

        CoinGeckoClient.coins
          .fetch(token?.id || null, {})
          .then(async (cgData: any) => {
            const data = cgData.data
            let res = null

            try {
              const fetchData = await fetch(
                'https://public-api.solscan.io/token/holders?tokenAddress=' + tokenA.address
              )
              res = await fetchData.json()
            } catch (e) {
              console.error(e)
            }

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
                  Math.floor(data?.market_data?.max_supply || data?.market_data?.total_supply)?.toLocaleString() ||
                  '0'
              },
              { name: 'Holders', value: res?.total?.toLocaleString() || 0 }
            ])
            setSocials([
              { name: 'Twitter', link: 'https://twitter.com/' + data?.links?.twitter_screen_name },
              { name: 'Coingecko', link: 'https://coingecko.com' },
              { name: 'Website', link: data?.links?.homepage?.[0] }
            ])
          })
          .catch((err) => console.error('ERROR: CoinGecko fetch', err))
      }

      if (tokenB) {
        const token = coingeckoTokens.find((i) => i.symbol.toLowerCase() === tokenB.symbol.toLowerCase())

        CoinGeckoClient.coins
          .fetch(token?.id || null, {})
          .then(async (cgData: any) => {
            const data = cgData.data
            let res = null

            try {
              const fetchData = await fetch(
                'https://public-api.solscan.io/token/holders?tokenAddress=' + tokenB.address
              )
              res = await fetchData.json()
            } catch (e) {
              console.error(e)
            }

            setDetailsB([
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
                  Math.floor(data?.market_data?.max_supply || data?.market_data?.total_supply)?.toLocaleString() ||
                  '0'
              },
              { name: 'Holders', value: res?.total?.toLocaleString() || 0 }
            ])
          })
          .catch((err) => console.error('ERROR: CoinGecko fetch', err))
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <TOKEN_WRAPPER>
      <TokenHeader>
        <SwapTokenToggle
          toggleToken={() => {
            setToggle(!toggle)
            !toggle ? setToken(tokenB) : setToken(tokenA)
          }}
          tokenA={tokenA}
          tokenB={tokenB}
        />

        <SubHeader>
          <TokenTitle>
            {token?.name.length < 12 ? token?.name : token?.name.slice(0, 12) + '...'} ({token?.symbol})
          </TokenTitle>
          <COPY style={{ display: 'flex', alignItems: 'center' }}>
            <SmallerTitle>{truncate(token?.address)}</SmallerTitle>
            <span className={`copy-button ${copiedAction ? 'copied' : ''}`} onClick={handleCopyTokenMint}>
              {copiedAction ? 'Copied!' : 'Copy'}
            </span>
          </COPY>
        </SubHeader>
      </TokenHeader>
      <TokenListWrapper>
        {(!toggle ? tokenDetails : tokenDetailsB).map((detail) => (
          <AltTokenDetail key={detail.name}>
            <TokenTitleFDV>{detail.name}</TokenTitleFDV>
            <SmallTitle>
              {detail.currency || null} {detail.value}
            </SmallTitle>
          </AltTokenDetail>
        ))}
      </TokenListWrapper>
      <Socials>
        {socials.map((social) => (
          <SocialsButton key={social.name} onClick={() => window.open(social.link, '_blank')}>
            {social.name}
          </SocialsButton>
        ))}
      </Socials>
    </TOKEN_WRAPPER>
  )
}

const PriceContent: FC<{ clickNo: number; routes: any[] }> = ({ clickNo, routes }) => {
  const { tokenA, tokenB, inTokenAmount } = useSwap()

  const [details, setDetails] = useState([
    { name: 'Price Impact', value: '0%' },
    {
      name: checkMobile() ? 'Min. Received' : 'Minimum Received',
      value: 0 + ' ' + tokenB.symbol
    },
    {
      name: 'Fees paid to GooseFx LP',
      value: `${0} ${tokenA.symbol} (${0} %)`,
      extraValue: `0 ${tokenB.symbol} (0%)`
    },
    { name: checkMobile() ? 'Trans. Fee' : 'Transaction Fee', value: '0.00005 SOL', icon: 'info' }
  ])
  const [outAmount, setOutAmount] = useState(0)
  const [outTokenPercentage, setOutTokenPercentage] = useState(0)
  const [cheap, setCheap] = useState(true)
  const [tokens, setTokens] = useState([])

  useEffect(() => {
    fetch(TOKEN_LIST_URL['mainnet-beta'])
      .then((response) => response.json())
      .then((result) => setTokens(result))
  }, [])

  useEffect(() => {
    const route = routes?.[clickNo]
    if (!route) return
    const out = route.outAmount / 10 ** tokenB.decimals

    const getPriceDetails = (num: number) => {
      const totalLp = route.marketInfos[num].lpFee.amount / 10 ** tokenA.decimals || 0.0
      let percent = route.marketInfos[num].lpFee.pct || +((totalLp / inTokenAmount) * 100)?.toFixed(4) || 0.0
      percent = isFinite(percent) ? percent : 0.0
      const totalLpB = route.marketInfos[num].lpFee.amount / 10 ** tokenB.decimals || 0.0
      let percentB = +((totalLpB / out) * 100)?.toFixed(4) || 0.0
      percentB = isFinite(percentB) ? percentB : 0.0
      const token = tokens.find((tk) => tk.address === route.marketInfos[num].lpFee.mint)
      return { totalLp, totalLpB, percent, percentB, token }
    }

    setOutAmount(out)

    const priceDetails = [
      { name: 'Price Impact', value: `< ${Number(route.priceImpactPct).toFixed(6)}%` },
      {
        name: checkMobile() ? 'Min. Received' : 'Minimum Received',
        value: `${nFormatter(route.outAmountWithSlippage / 10 ** tokenB.decimals, tokenB.decimals)} ${
          tokenB.symbol
        }`
      },
      ...route?.marketInfos.slice(0, 3).map((market: any, num: number) => ({
        name: `Fees paid to ${market.amm.label || 'GooseFX'} LP`,
        value: `${nFormatter(
          getPriceDetails(num).totalLp,
          getPriceDetails(num).token?.decimals || tokenA.decimals
        )} ${getPriceDetails(num).token?.symbol || tokenA.symbol} (${getPriceDetails(num).percent} %)`
      })),

      { name: checkMobile() ? 'Trans. Fee' : 'Transaction Fee', value: '0.00005 SOL', icon: 'info' }
    ]

    setDetails(priceDetails)

    const percentageCheap = +(((route.outAmount - routes[0]?.outAmount) / route.outAmount) * 100).toFixed(5)
    setOutTokenPercentage(Math.abs(percentageCheap))
    setCheap(percentageCheap < 0 ? false : true)
  }, [clickNo, inTokenAmount, tokenA.symbol, tokenB.symbol, routes])

  return (
    <PRICE_WRAPPER>
      <PriceHeader>
        <PriceTitle>Price Info</PriceTitle>
      </PriceHeader>
      <TokenDetail>
        <TokenTitle>Rate</TokenTitle>
        <SmallTitleFlex>
          <SMALL_CLICKER_ICON>
            <Image
              draggable={false}
              preview={false}
              src={`/img/crypto/${tokenA.symbol}.svg`}
              fallback={tokenA.logoURI || '/img/crypto/Unknown.svg'}
              alt="inputToken"
            />
          </SMALL_CLICKER_ICON>
          <span className={'token-name'}>
            {inTokenAmount} {tokenA.symbol} ≈{'  '}
          </span>
          <SMALL_CLICKER_ICON style={{ marginLeft: '0.5rem' }}>
            <Image
              draggable={false}
              preview={false}
              src={`/img/crypto/${tokenB.symbol}.svg`}
              fallback={tokenB.logoURI || '/img/crypto/Unknown.svg'}
              alt="out-token"
            />
          </SMALL_CLICKER_ICON>
          <span className={'token-name'}>
            {+outAmount.toFixed(3)} {tokenB.symbol}
          </span>
        </SmallTitleFlex>
        <SmallTitleFlex>
          <span style={{ color: cheap ? '#5fc8a7' : '#bb3535', marginRight: '0.25rem', fontWeight: '600' }}>
            {isFinite(outTokenPercentage) ? outTokenPercentage : 0}% {cheap ? 'cheaper' : 'higher'}
          </span>
          <span style={{ fontWeight: '600' }}>than coingecko</span>
        </SmallTitleFlex>
      </TokenDetail>
      <ListWrapper>
        {details.map((detail, index) => (
          <AltTokenDetail key={index}>
            <TokenTitleFees>
              {detail.name}{' '}
              {detail.icon && (
                  <SVGDynamicReverseMode
                    style={{ height: '12px', width: '12px' }}
                    src={`/img/crypto/${detail.icon}.svg`}
                    alt="jupiter-icon"
                    className={'header-icon'}
                  />
                ) && (
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
        ))}
      </ListWrapper>
    </PRICE_WRAPPER>
  )
}

const AlternativesContent: FC<{ clickNo: number; setClickNo: (n: number) => void; routes: any[] }> = ({
  setClickNo,
  clickNo,
  routes
}) => {
  const [less, setLess] = useState(false)
  const { mode } = useDarkMode()
  const { tokenA, tokenB, outTokenAmount } = useSwap()
  const [tokens, setTokens] = useState([])
  const [details, setDetails] = useState([])

  const swapAndFindBestPrice = (details) => {
    const gfxindx = details.findIndex((deet) => deet.name.toLowerCase().includes('goosefx'))

    if (
      gfxindx >= 0 &&
      details.length > 0 &&
      details[gfxindx] &&
      details[gfxindx]?.name.toLowerCase().includes('goosefx')
    ) {
      details[0].fastest = true
      if (details[gfxindx].price < details[gfxindx + 1]?.price) {
        details[gfxindx + 1].bestPrice = true
      }
    } else {
      details[0].bestPrice = true
    }
    return details
  }
  useEffect(() => {
    fetch(TOKEN_LIST_URL['mainnet-beta'])
      .then((response) => response.json())
      .then((result) => setTokens(result))
  }, [])

  useEffect(() => {
    function getObjectDetails(no: number) {
      const route = routes[no]
      const market = route.marketInfos
      let name =
        market.length === 1
          ? market[0].amm.label
          : market[0].amm.label + ' x ' + route.marketInfos.slice(-1)[0].amm.label
      name = name.length > 18 ? name.slice(0, 18) + '...' : name
      const value =
        route.marketInfos.length < 2
          ? tokenA.symbol + ' • ' + tokenB.symbol
          : tokenA.symbol +
            ' • ' +
            (tokens.find((i) => i.address === route.marketInfos[0].outputMint.toBase58())?.symbol || 'unknown') +
            ' • ' +
            tokenB.symbol
      const out = +(route.outAmount / 10 ** tokenB.decimals).toFixed(6)
      const outAmount = +(route.outAmount / 10 ** tokenB.decimals).toFixed(6)
      return { name, value, price: out, outAmount }
    }
    let details = routes.map((_, k) => getObjectDetails(k))
    if (details.length > 0) {
      details = swapAndFindBestPrice(details)
    }
    setDetails(details)
  }, [routes, tokenA.symbol, tokenB.symbol, tokens, outTokenAmount])

  return (
    <SWAP_ROUTES less={less || details.length < 4}>
      <div className="swap-content">
        {routes?.length < 1
          ? Array(2)
              .fill(1)
              .map((_, i) => (
                <SkeletonCommon
                  key={i}
                  width={'342px'}
                  height={checkMobile() ? '64px' : '75px'}
                  borderRadius="10px"
                  style={{
                    marginRight: checkMobile() ? '0px' : '16px',
                    marginBottom: checkMobile() ? '16px' : '0px',
                    boxShadow: '0 6px 9px 0 rgba(36, 36, 36, 0.1)'
                  }}
                />
              ))
          : (!less ? details : details.slice(0, 2)).map((detail, k) => (
              <SWAP_ROUTE_ITEM
                key={k}
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
            ))}
      </div>

      {routes.length > 2 && (
        <div className="action">
          {!less ? (
            <ShowLess
              onClick={() => {
                setLess(true)
              }}
            >
              Show Less
            </ShowLess>
          ) : (
            <ShowMore onClick={() => setLess(false)}>Show More</ShowMore>
          )}
        </div>
      )}
    </SWAP_ROUTES>
  )
}

export const SwapMain: FC = () => {
  const desktop = window.innerWidth > 1300
  const {
    tokenA,
    tokenB,
    inTokenAmount,
    outTokenAmount,
    gofxOutAmount,
    priceImpact,
    chosenRoutes,
    setRoutes,
    setClickNo,
    clickNo,
    network
  } = useSwap()
  const { slippage } = useSlippageConfig()
  const [allowed, setallowed] = useState(false)
  const [inAmountTotal, setInAmountTotal] = useState(0)
  const [refreshed, setRefreshed] = useState(false)

  const { routes, exchange } = useJupiter({
    amount: JSBI.BigInt(inAmountTotal), // raw input amount of tokens
    inputMint: new PublicKey(tokenA?.address || 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD'),
    outputMint: new PublicKey(tokenB?.address || 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD'),
    slippage: slippage, // 1% slippage
    debounceTime: 850 // debounce ms time before refresh
  })

  function marketInfoFormat(mkt: any) {
    return {
      ...mkt,
      inAmount: JSBI.toNumber(mkt.inAmount),
      outAmount: JSBI.toNumber(mkt.outAmount),
      lpFee: {
        ...mkt.lpFee,
        amount: JSBI.toNumber(mkt.lpFee.amount)
      },
      platformFee: {
        ...mkt.platformFee,
        amount: JSBI.toNumber(mkt.platformFee.amount)
      }
    }
  }

  useEffect(() => {
    if (network === 'devnet') {
      devnetRoutes()
    } else {
      mainnetRoutes()
    }
  }, [tokenA?.symbol, tokenB?.symbol, routes, slippage, inTokenAmount, outTokenAmount, gofxOutAmount, network])

  function devnetRoutes() {
    setRoutes([])
    const inAmountTotal = inTokenAmount * 10 ** (tokenA?.decimals || 0)
    setInAmountTotal(Math.round(inAmountTotal))

    if (!tokenA || !tokenB || inAmountTotal <= 0) return
    const GoFxRoute = {
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
    }
    setRoutes([GoFxRoute])
  }

  function mainnetRoutes() {
    setRoutes([])
    const inAmountTotal = inTokenAmount * 10 ** (tokenA?.decimals || 0)
    setInAmountTotal(Math.round(inAmountTotal))

    const supported =
      (tokenB?.symbol === 'USDC' && CURRENT_SUPPORTED_TOKEN_LIST.includes(tokenA?.symbol)) ||
      (tokenA?.symbol === 'USDC' && CURRENT_SUPPORTED_TOKEN_LIST.includes(tokenB?.symbol))

    if (tokenA && tokenB) {
      setallowed(true)
    }

    if (!routes && (!tokenA || !tokenB)) return
    const filteredRoutes =
      routes
        ?.map((route) => ({
          ...route,
          inAmount: JSBI.toNumber(route.inAmount),
          outAmount: JSBI.toNumber(route.outAmount),
          amount: JSBI.toNumber(route.amount),
          outAmountWithSlippage: JSBI.toNumber(route.otherAmountThreshold),
          marketInfos: route.marketInfos.map((mkt) => marketInfoFormat(mkt))
        }))
        ?.filter((i) => i.inAmount === Math.round(inAmountTotal)) || []

    const shortRoutes: any[] = supported ? filteredRoutes?.slice(0, 3) : filteredRoutes?.slice(0, 4)

    if (tokenB && shortRoutes.length >= 0) {
      const GoFxRoute = {
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
      }

      if (supported) {
        shortRoutes.splice(0, 0, GoFxRoute)
      }
    }

    setRoutes(shortRoutes)
  }

  const RefreshedAnimation: FC<{ active: boolean; isMobile: boolean }> = ({ active, isMobile }) => (
    <RefreshAlert $active={active} $isMobile={isMobile}>
      <div>
        Last updated: {checkMobile() && <br />} {new Date().toUTCString()}
      </div>
    </RefreshAlert>
  )

  if (checkMobile()) {
    return (
      <WRAPPER>
        <RefreshedAnimation active={refreshed} isMobile={true} />
        <INNERWRAPPER $desktop={false}>
          <SwapContent
            exchange={exchange}
            routes={chosenRoutes}
            clickNo={clickNo}
            setRefreshed={setRefreshed}
            refreshed={refreshed}
          />
          {allowed && <PriceContent routes={chosenRoutes} clickNo={clickNo} />}
          {allowed && <TokenContent />}
        </INNERWRAPPER>
      </WRAPPER>
    )
  } else {
    return (
      <WRAPPER>
        <RefreshedAnimation active={refreshed} isMobile={false} />
        <INNERWRAPPER $desktop={desktop && allowed}>
          {desktop && allowed && <TokenContent />}
          <SwapContent
            exchange={exchange}
            routes={chosenRoutes}
            clickNo={clickNo}
            setRefreshed={setRefreshed}
            refreshed={refreshed}
          />
          {desktop && allowed && <PriceContent routes={chosenRoutes} clickNo={clickNo} />}
        </INNERWRAPPER>
        {allowed && inTokenAmount > 0 && (
          <AlternativesContent routes={chosenRoutes} clickNo={clickNo} setClickNo={setClickNo} />
        )}
      </WRAPPER>
    )
  }
}

interface RouteParams {
  tradePair: string
}

const SwapMainProvider: FC = () => {
  const { connection, setTokenA, setTokenB, network } = useSwap()
  const wallet = useWallet()
  const { tokens } = useTokenRegistry()
  const { tradePair } = useParams<RouteParams>()

  useEffect(() => {
    const token1 = tradePair
      ? tokens?.find((i) => i.symbol.toLowerCase() === tradePair?.split('-')[0].toLowerCase())
      : null
    const token2 = tradePair
      ? tokens?.find((i) => i.symbol.toLowerCase() === tradePair?.split('-')[1].toLowerCase())
      : null
    const usd = tokens?.find((i) => i.symbol === 'USDC')
    const gfx = tokens?.find((i) => i.symbol === 'GOFX')

    if (token1) {
      setTokenA({ address: token1.address, decimals: token1.decimals, symbol: token1.symbol, name: token1.name })
    } else if (gfx) {
      setTokenA({ address: gfx.address, decimals: gfx.decimals, symbol: gfx.symbol, name: gfx.name })
    }

    if (token2) {
      setTokenB({ address: token2.address, decimals: token2.decimals, symbol: token2.symbol, name: token2.name })
    } else if (usd) {
      setTokenB({ address: usd.address, decimals: usd.decimals, symbol: usd.symbol, name: usd.name })
    }
  }, [setTokenA, setTokenB, tokens, tradePair])

  return (
    <JupiterProvider connection={connection} cluster={network} userPublicKey={wallet?.publicKey}>
      <SwapMain />
    </JupiterProvider>
  )
}

export const Swap: FC = () => (
  <SwapProvider>
    <SwapMainProvider />
  </SwapProvider>
)
