import React, { FC, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { logEvent } from 'firebase/analytics'
import analytics from '../../analytics'
import styled, { css } from 'styled-components'
import { Settings } from './Settings'
import { SwapButton } from './SwapButton'
import { SwapFrom } from './SwapFrom'
import { SwapTo } from './SwapTo'
import { Modal } from '../../components'
import { SkeletonCommon } from '../NFTs/Skeleton/SkeletonCommon'
import {
  useDarkMode,
  useSwap,
  SwapProvider,
  useSlippageConfig,
  ENDPOINTS,
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

const CoinGecko = require('coingecko-api')
const CoinGeckoClient = new CoinGecko()

//@media (max-width: 500px) {
//#region styles
const WRAPPER = styled.div`
  color: ${({ theme }) => theme.text1};
  min-height: calc(100vh - 58px);
  width: 100vw;
  font-family: Montserrat;
  font-stretch: normal;
  font-style: normal;
`

const INNERWRAPPER = styled.div<{ $desktop: boolean }>`
  display: flex;
  max-height: 80%;
  padding-top: 10%;
  justify-content: ${({ $desktop }) => ($desktop ? 'space-between' : 'space-around')};
  align-items: center;
  color: ${({ theme }) => theme.text1};
  width: 100vw;
  margin-bottom: 28px;

  @media (max-width: 500px) {
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;
    height: 100%;
    padding: 15vh 15px 1rem 15px;
  }
`

const SETTING_MODAL = styled(Modal)`
  height: 425px !important;
  width: 628px !important;
  background-color: ${({ theme }) => theme.bg8};
`

const BODY = styled.div`
  position: relative;
  ${({ theme }) => theme.flexColumnNoWrap}
  justify-content: space-between;
  width: 100%;
  margin: ${({ theme }) => theme.margin(5)} 0 ${({ theme }) => theme.margin(4)};
  ${({ theme }) => theme.customScrollBar('6px')};
  ${({ theme }) => theme.measurements('100%')}

  @media (max-width: 500px) {
    margin: ${({ theme }) => theme.margin(4)} 0 ${({ theme }) => theme.margin(6)};
  }
`

const HEADER_TITLE = styled(CenteredDiv)`
  span {
    font-weight: 600;
    font-size: 20px;
    font-family: Montserrat;
    color: ${({ theme }) => theme.text1};
  }
`

const TOKEN_WRAPPER = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  align-items: center;
  min-height: 527px;
  width: 326px;
  font-family: 'Montserrat';
  padding: ${({ theme }) => theme.margin(3)};
  padding-left: ${({ theme }) => theme.margin(4)};
  border-radius: 0px 20px 20px 0px;
  background: ${({ theme }) => theme.swapSides1};

  @media (max-width: 500px) {
    width: 100%;
    border-radius: 20px;
    min-height: 0px;
  }
`

const TokenTitle = styled.div`
  font-weight: 600;
  font-size: 18px;
  color: ${({ theme }) => theme.text1};
`

const SmallTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.text12};
`

const AltSmallTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.text12};
`

const SmallTitleFlex = styled.div`
  margin: 4px 0;
  font-size: 15px;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.text12};

  .token-name {
    font-weight: 600;
  }
`

const SmallerTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  background: linear-gradient(90.25deg, #f7931a 2.31%, #dc1fff 99.9%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`
const TokenHeader = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 18px;
  align-items: center;
`

const SWAP_ROUTE_ITEM = styled.div<{ $clicked?: boolean; $cover: string }>`
  min-width: 330px !important;
  height: 100px;
  border-radius: 15px;
  padding: 1px;
  margin-right: ${({ theme }) => theme.margin(3.5)};
  background: ${({ theme, $clicked }) =>
    $clicked ? 'linear-gradient(90deg,rgba(247,147,26,0.5) 0%,rgba(220,31,255,0.5) 100%)' : theme.bg1};
  box-shadow: 0 6px 9px 0 rgba(36, 36, 36, 0.1);
  cursor: pointer;

  .inner-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    background: ${({ theme, $clicked, $cover }) => ($clicked ? $cover : 'transparent')};
    border-radius: 15px;
    padding: ${({ theme }) => theme.margin(2)};

    @media (max-width: 500px) {
      position: static;
    }

    .content {
      width: 67%;

      div {
        ${({ theme }) => theme.ellipse}
      }

      @media (max-width: 500px) {
        width: 85%;
      }
    }
    .price {
      margin-left: 4px;
      width: 30%;
    }
  }

  @media (max-width: 500px) {
    height: 65px;
    margin: 0px;
    margin-bottom: 16px;
  }
`

const TokenDetail = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: ${({ theme }) => theme.margin(1.5)} 0;
`

const AltTokenDetail = styled(TokenDetail)`
  @media (max-width: 500px) {
    width: 50%;
  }
`

const ListWrapper = styled.div`
  width: 100%;
  @media (max-width: 500px) {
    display: flex;
    padding: ${({ theme }) => theme.margin(1.5)} 0;
    flex-wrap: wrap;
  }
`

const SubHeader = styled.div`
  margin-left: 1.25rem;
  height: 48px;
`

const Socials = styled.div`
  display: flex;
  justify-content: space-between;
  width 100%;
  margin-top: auto;
`

const SocialsButton = styled.div`
  background-color: ${({ theme }) => theme.bg12};
  color: ${({ theme }) => theme.text14};
  padding: ${({ theme }) => theme.margin(0.5)} ${({ theme }) => theme.margin(1.5)};
  border-radius: 1rem;
  font-size: 12px;
  cursor: pointer;
`

const CLICKER_ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margin(6))}
  margin-right: ${({ theme }) => theme.margin(0.5)};
  ${({ theme }) => theme.roundedBorders}
`
const SMALL_CLICKER_ICON = styled(CenteredImg)`
  height: 20px;
  width: 20px;
  margin-right: ${({ theme }) => theme.margin(1)};
  ${({ theme }) => theme.roundedBorders}
`

const PRICE_WRAPPER = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  align-items: center;
  height: 100%;
  width: 326px;
  font-family: Montserrat;
  border-radius: 20px 0px 0px 20px;
  padding: ${({ theme }) => theme.margin(3)};
  background: ${({ theme }) => theme.swapSides2};

  @media (max-width: 500px) {
    width: 100%;
    border-radius: 20px;
    margin-bottom: 3rem;
  }
`

const SWAP_ROUTES = styled.div<{ $less: boolean }>`
  position: relative;

  .swap-content {
    display: flex;
    justify-content: ${({ $less }) => ($less ? 'center' : 'flex-start')};
    align-items: flex-end;
    margin: 0 32px 12px;
    padding: 32px 0;
    overflow-x: auto;
    height: 20%;

    @media (max-width: 500px) {
      flex-direction: column;
      width: 100%;
      align-items: center;
      justify-content: space-around;
      margin: 2rem 0px 3rem 0px;
      padding: 0px;
      height: auto;
    }
  }

  .action {
    position: absolute;
    top: 0;
    right: 32px;

    @media (max-width: 500px) {
      top: ${({ $less }) => ($less ? '80%' : '88%')};
      font-size: 16px !important;
      right: 0 !important;
    }
  }
`

const BestPrice = styled.div`
  position: absolute;
  font-size: 12px;
  line-height: 12px;
  font-weight: 600;
  margin-top: -90px;
  margin-left: 230px;
  text-align: center;
  padding: 8px;
  border-radius: 0.35rem;
  background-color: #be2cff;
  color: white;

  @media (max-width: 500px) {
    margin-top: -60px;
  }
`

const ShowLess = styled.div`
  font-size: 18px;
  font-weight: 600;
  border-radius: 0.5rem;
  cursor: pointer;
`

const ShowMore = styled.div`
  font-size: 18px;
  font-weight: 600;
  border-radius: 0.5rem;
  cursor: pointer;
`

const PriceHeader = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`

// const WRAPPED_LOADER = styled.div`
//   position: relative;
//   height: 14px;
// `

const PriceTitle = styled.div`
  font-weight: 600;
  font-size: 22px;
  background: linear-gradient(90.25deg, #f7931a 2.31%, #dc1fff 99.9%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`

const HEADER_WRAPPER = styled(SpaceBetweenDiv)<{ $iconSize: string }>`
  width: 100%;

  > div {
    display: flex;
    align-items: center;
  }

  .header-icon {
    height: ${({ $iconSize }) => $iconSize};
    cursor: pointer;
  }

  .jup-icon {
    height: 22px;
    margin-left: ${({ theme }) => theme.margin(1)};
  }

  .smaller-header-icon {
    height: 40px;
    width: 40px;
    cursor: pointer;
  }
`

const SETTING_WRAPPER = styled(CenteredImg)`
  margin-left: 8px;
  height: 40px;
  width: 40px;
  border-radius: 50%;
`

const SWITCH = styled(CenteredImg)<{ measurements: number }>`
  position: absolute;
  top: calc(50% - ${({ measurements }) => measurements}px / 2 + ${({ theme }) => theme.margin(3)});
  left: calc(50% - ${({ measurements }) => measurements}px / 2);
  ${({ measurements, theme }) => theme.measurements(measurements + 'px')}
  cursor: pointer;
  z-index: 1;

  .swap-switch {
    height: auto;
    width: auto;

    @media (max-width: 500px) {
      height: 8rem;
      width: 8rem;
      margin-top: 2.5rem;
    }
  }
`

const SWAP_CONTENT = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  align-items: center;
  min-height: 400px;
  max-height: 90%;
  width: 628px;
  padding: ${({ theme }) => theme.margin(4)};
  ${({ theme }) => theme.largeBorderRadius}
  background-color: ${({ theme }) => theme.bg9};
  ${({ theme }) => theme.largeShadow}

  @media (max-width: 500px) {
    width: 100%;
    font-size: 14px !important;
    padding: ${({ theme }) => theme.margin(2.5)};
    margin-bottom: 3rem;
  }
`
//#endregion

const SwapContent: FC<{ exchange?: (any: any) => void; routes: any; clickNo: number }> = ({
  exchange,
  routes,
  clickNo
}) => {
  const location = useLocation<ILocationState>()
  const { setEndpoint, network } = useConnectionConfig()
  const { mode } = useDarkMode()
  const { refreshRates, setFocused, switchTokens, setClickNo, tokenA, tokenB, inTokenAmount } = useSwap()
  const [settingsModalVisible, setSettingsModalVisible] = useState(false)
  const [route, setRoute] = useState(routes[clickNo])

  useEffect(() => {
    const an = analytics()
    an !== null &&
      logEvent(an, 'screen_view', {
        firebase_screen: 'Swap',
        firebase_screen_class: 'load'
      })

    if (network === 'devnet') {
      setEndpoint(ENDPOINTS[0].endpoint)
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

  const dateString = (date: Date) => {
    let datestring = date.toString().split(' ')
    let month = datestring[1]
    let day = datestring[2]
    let time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    return `${month} ${day}, ${time}`
  }

  const height = '65px'

  const localCSS = css`
    .swap-input {
      height: ${height};
      border-radius: 45px;
      border: none;
      padding-right: 20px;
      font-size: 16px;
      font-weight: 600;
    }

    .ant-modal-centered {
      top: -75px;
    }
  `

  return (
    <SWAP_CONTENT>
      <SETTING_MODAL
        setVisible={setSettingsModalVisible}
        bigTitle={true}
        title="Settings"
        visible={settingsModalVisible}
        style={{ overflowY: 'hidden' }}
      >
        <Settings setVisible={setSettingsModalVisible} />
      </SETTING_MODAL>
      <HEADER_WRAPPER $iconSize="40px">
        <HEADER_TITLE>
          <span>{checkMobile() ? 'Swap' : dateString(new Date())}</span>
          <img src={`/img/crypto/jup_${mode}.svg`} alt="jupiter-icon" className={'jup-icon'} />
        </HEADER_TITLE>

        <div>
          <div onClick={refreshRates}>
            <img src={`/img/assets/refresh.svg`} alt="refresh-icon" className={'header-icon'} />
          </div>
          <SETTING_WRAPPER onClick={onClick}>
            <img src={`/img/assets/settings_${mode}_mode.svg`} alt="settings" className={'smaller-header-icon'} />
          </SETTING_WRAPPER>
        </div>
      </HEADER_WRAPPER>
      {/* <Rate /> */}
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
    position: relative;
    margin-left: 8px;
    color: #8a8a8a;
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
    cursor: pointer;
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
  const { tokenA } = useSwap()
  const [tokenDetails, setDetails] = useState([
    { name: 'Price', value: '0', currency: '$' },
    { name: 'FDV', value: '0', currency: '$' },
    { name: 'Max Total Supply', value: '0' },
    { name: 'Holders', value: '0' }
  ])

  const truncate = (address: string) => {
    return address.slice(0, 7) + '...' + address.slice(-6)
  }

  useEffect(() => {
    try {
      fetchCoinGecko()
    } catch (error) {
      console.log(error)
    }
  }, [tokenA])

  const handleCopyTokenMint = (e) => {
    setCopiedAction(true)
    navigator.clipboard.writeText(tokenA.address)
    setTimeout(() => setCopiedAction(false), 800)
  }

  const fetchCoinGecko = async () => {
    const tokens = await CoinGeckoClient.coins.list()
    if (tokenA) {
      const token = tokens.data.find((i) => i.symbol.toLowerCase() === tokenA.symbol.toLowerCase())

      CoinGeckoClient.coins
        .fetch(token?.id || null, {})
        .then(async (cgData: any) => {
          const data = cgData.data
          let res = null

          try {
            const fetchData = await fetch('https://public-api.solscan.io/token/holders?tokenAddress=' + tokenA.address)
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
                Math.floor(data?.market_data?.max_supply || data?.market_data?.total_supply)?.toLocaleString() || '0'
            },
            { name: 'Holders', value: res?.total?.toLocaleString() || 0 }
          ])
          setSocials([
            { name: 'Twitter', link: 'https://twitter.com/' + data?.links?.twitter_screen_name },
            { name: 'Coingecko', link: 'https://coingecko.com' },
            { name: 'Website', link: data?.links?.homepage?.[0] }
          ])
        })
        .catch((err) => console.error('ERROR: CoinGecko fetch'))
    }
  }

  return (
    <TOKEN_WRAPPER>
      <TokenHeader>
        <CLICKER_ICON>
          <img
            src={`/img/crypto/${tokenA?.symbol}.svg`}
            alt=""
            onError={(e) => (e.currentTarget.src = '/img/crypto/Unknown.svg')}
          />
        </CLICKER_ICON>
        <SubHeader>
          <TokenTitle>
            {tokenA?.name} ({tokenA?.symbol})
          </TokenTitle>
          <COPY style={{ display: 'flex', alignItems: 'center' }}>
            <SmallerTitle>{truncate(tokenA?.address)}</SmallerTitle>
            <span className={`copy-button ${copiedAction ? 'copied' : ''}`} onClick={handleCopyTokenMint}>
              {copiedAction ? 'Copied!' : 'Copy'}
            </span>
          </COPY>
        </SubHeader>
      </TokenHeader>
      <ListWrapper>
        {tokenDetails.map((detail) => (
          <AltTokenDetail>
            <TokenTitle>{detail.name}</TokenTitle>
            <SmallTitle>
              {detail.currency || null} {detail.value}
            </SmallTitle>
          </AltTokenDetail>
        ))}
      </ListWrapper>
      <Socials>
        {socials.map((social) => (
          <SocialsButton key={social.id} onClick={() => window.open(social.link, '_blank')}>
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
      name: 'Fees paid to Serum LP',
      value: `${0} ${tokenA.symbol} (${0} %)`,
      extraValue: `0 ${tokenB.symbol} (0%)`
    },
    { name: checkMobile() ? 'Trans. Fee' : 'Transaction Fee', value: '0.00005 SOL', icon: 'info' }
  ])
  const [outAmount, setOutAmount] = useState(0)
  const [outTokenPercentage, setOutTokenPercentage] = useState(0)
  const [cheap, setCheap] = useState(true)

  useEffect(() => {
    const route = routes?.[clickNo]
    if (!route) return
    const totalLp = route.marketInfos[0].lpFee.amount / 10 ** tokenA.decimals
    const percent = +((totalLp / inTokenAmount) * 100)?.toFixed(4)
    const totalLpB = route.marketInfos.slice(-1)[0].lpFee.amount / 10 ** tokenB.decimals
    const out = route.outAmount / 10 ** tokenB.decimals
    const percentB = +((totalLpB / out) * 100)?.toFixed(4)

    setOutAmount(out)

    const priceDetails = [
      { name: 'Price Impact', value: `< ${Number(route.priceImpactPct).toFixed(6)}%` },
      {
        name: checkMobile() ? 'Min. Received' : 'Minimum Received',
        value: `${nFormatter(route.outAmountWithSlippage / 10 ** tokenB.decimals, tokenB.decimals)} ${tokenB.symbol}`
      },
      {
        name: `Fees paid to ${route.marketInfos[0].amm.label || 'GooseFX'} LP`,
        value: `${nFormatter(totalLp, tokenA.decimals)} ${tokenA.symbol} (${percent} %)`,
        extraValue:
          route?.marketInfos?.length > 1
            ? `${nFormatter(totalLpB, tokenB.decimals)} ${tokenB.symbol} (${percentB}%)`
            : `0 ${tokenB.symbol} (0%)`
      },
      { name: checkMobile() ? 'Trans. Fee' : 'Transaction Fee', value: '0.00005 SOL', icon: 'info' }
    ]

    setDetails(priceDetails)

    const percentageCheap = +(((route.outAmount - routes[1]?.outAmount) / route.outAmount) * 100).toFixed(3)
    setOutTokenPercentage(Math.abs(percentageCheap))
    setCheap(percentageCheap < 0 ? false : true)
  }, [clickNo, inTokenAmount, tokenA.symbol, tokenB.symbol, routes])

  return (
    <PRICE_WRAPPER>
      <PriceHeader>
        <PriceTitle>Price Info</PriceTitle>
        {/* <WRAPPED_LOADER>
          <Loader />
        </WRAPPED_LOADER> */}
        {/* <SMALL_CLICKER_ICON>
          <img src={`/img/crypto/GOFX.svg`} alt="" />
        </SMALL_CLICKER_ICON> */}
      </PriceHeader>
      <TokenDetail>
        <TokenTitle>Rate</TokenTitle>
        <SmallTitleFlex>
          <SMALL_CLICKER_ICON>
            <img
              src={`/img/crypto/${tokenA.symbol}.svg`}
              alt=""
              onError={(e) => (e.currentTarget.src = '/img/crypto/Unknown.svg')}
            />
          </SMALL_CLICKER_ICON>
          <span className={'token-name'}>
            {inTokenAmount} {tokenA.symbol} ≈{'  '}
          </span>
          <SMALL_CLICKER_ICON style={{ marginLeft: '0.5rem' }}>
            <img
              src={`/img/crypto/${tokenB.symbol}.svg`}
              alt=""
              onError={(e) => (e.currentTarget.src = '/img/crypto/Unknown.svg')}
            />
          </SMALL_CLICKER_ICON>
          <span className={'token-name'}>
            {+outAmount.toFixed(3)} {tokenB.symbol}
          </span>
        </SmallTitleFlex>
        <SmallTitleFlex>
          <span style={{ color: cheap ? '#5fc8a7' : '#bb3535', marginRight: '0.25rem', fontWeight: '600' }}>
            {outTokenPercentage || 0}% {cheap ? 'cheaper' : 'higher'}
          </span>
          <span style={{ fontWeight: '600' }}>than coingecko</span>
        </SmallTitleFlex>
      </TokenDetail>
      <ListWrapper>
        {details.map((detail) => (
          <AltTokenDetail>
            <TokenTitle>
              {detail.name}{' '}
              {detail.icon && (
                <SVGDynamicReverseMode
                  style={{ height: '12px', width: '12px' }}
                  src={`/img/crypto/${detail.icon}.svg`}
                  alt="jupiter-icon"
                  className={'header-icon'}
                />
              )}
            </TokenTitle>
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
  const { mode } = useDarkMode()
  const { tokenA, tokenB } = useSwap()
  const [tokens, setTokens] = useState([])
  const [details, setDetails] = useState([])

  useEffect(() => {
    fetch(TOKEN_LIST_URL['mainnet-beta'])
      .then((response) => response.json())
      .then((result) => setTokens(result))
  }, [])

  useEffect(() => {
    function getObjectDetails(no: number) {
      const route = routes[no]
      const market = route.marketInfos
      const name =
        market.length === 1
          ? market[0].amm.label
          : market[0].amm.label + ' x ' + route.marketInfos.slice(-1)[0].amm.label
      const value =
        route.marketInfos.length < 2
          ? tokenA.symbol + ' to ' + tokenB.symbol
          : tokenA.symbol +
            ' to ' +
            (tokens.find((i) => i.address === route.marketInfos[0].outputMint.toBase58())?.symbol || 'unknown') +
            ' to ' +
            tokenB.symbol
      const out = +(route.outAmount / 10 ** tokenB.decimals).toFixed(3)
      const outAmount = +(route.outAmount / 10 ** tokenB.decimals).toFixed(7)

      if (no === 0) {
        return { name, value, price: out, outAmount, bestPrice: true }
      } else if (no === 1) {
        return { name, value, price: out, outAmount, fastest: true }
      }
      return { name, value, price: out, outAmount }
    }

    const details = routes.map((_, k) => getObjectDetails(k))
    setDetails(details)
  }, [routes, tokenA.symbol, tokenB.symbol, tokens])

  const [less, setLess] = useState(false)

  return (
    <SWAP_ROUTES $less={less || details.length < 4}>
      <div className="swap-content">
        {routes?.length < 1
          ? Array(3)
              .fill(1)
              .map(() => (
                <SkeletonCommon
                  width={'330px'}
                  height={checkMobile() ? '64px' : '100px'}
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
                $clicked={k === clickNo}
                $cover={mode === 'dark' ? '#3c3b3ba6' : '#ffffffa6'}
                onClick={() => setClickNo(k)}
              >
                <div className={'inner-container'}>
                  <TokenDetail className={'content'}>
                    <TokenTitle>{detail.name.slice(0, 20)}</TokenTitle>
                    <AltSmallTitle>{detail.value}</AltSmallTitle>
                  </TokenDetail>
                  <TokenTitle className={'price'}>{detail.price || null}</TokenTitle>
                  {detail.bestPrice && <BestPrice>Best Price</BestPrice>}
                  {detail.fastest && <BestPrice>Best Choice</BestPrice>}
                </div>
              </SWAP_ROUTE_ITEM>
            ))}
      </div>

      <div className="action">
        {!less ? (
          <ShowLess
            onClick={() => {
              setLess(true)
              setClickNo(1)
            }}
          >
            Show Less
          </ShowLess>
        ) : (
          <ShowMore onClick={() => setLess(false)}>Show More</ShowMore>
        )}
      </div>
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
    clickNo
  } = useSwap()
  const { slippage } = useSlippageConfig()
  const [allowed, setallowed] = useState(false)
  const [inAmountTotal, setInAmountTotal] = useState(0)

  const { routes, exchange } = useJupiter({
    amount: inAmountTotal, // raw input amount of tokens
    inputMint: new PublicKey(tokenA?.address || 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD'),
    outputMint: new PublicKey(tokenB?.address || 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD'),
    slippage: slippage, // 1% slippage
    debounceTime: 250 // debounce ms time before refresh
  })

  useEffect(() => {
    setRoutes([])
    const inAmountTotal = inTokenAmount * 10 ** (tokenA?.decimals || 0)
    setInAmountTotal(inAmountTotal)

    const supported =
      (tokenB?.symbol === 'USDC' && CURRENT_SUPPORTED_TOKEN_LIST.includes(tokenA?.symbol)) ||
      (tokenA?.symbol === 'USDC' && CURRENT_SUPPORTED_TOKEN_LIST.includes(tokenB?.symbol))

    if (tokenA && tokenB) {
      setallowed(true)
    }

    if (!routes) return
    const filteredRoutes = routes?.filter((i) => i.inAmount === inAmountTotal)
    const shortRoutes: any[] = supported ? filteredRoutes?.slice(0, 3) : filteredRoutes?.slice(0, 4)

    if (tokenB && shortRoutes.length > 0) {
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

      if (supported) shortRoutes.splice(1, 0, GoFxRoute)
    }

    setRoutes(shortRoutes)
    //setClickNo(1)
  }, [tokenA?.symbol, tokenB?.symbol, routes, slippage, inTokenAmount, outTokenAmount])

  if (checkMobile()) {
    return (
      <WRAPPER>
        <INNERWRAPPER $desktop={!checkMobile()}>
          <SwapContent exchange={exchange} routes={chosenRoutes} clickNo={clickNo} />
          {allowed && <PriceContent routes={chosenRoutes} clickNo={clickNo} />}
          {allowed && <TokenContent />}
        </INNERWRAPPER>
      </WRAPPER>
    )
  } else {
    return (
      <WRAPPER>
        <INNERWRAPPER $desktop={desktop && allowed}>
          {desktop && allowed && <TokenContent />}
          <SwapContent exchange={exchange} routes={chosenRoutes} clickNo={clickNo} />
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
  const { connection, setTokenA, setTokenB } = useSwap()
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
    const sol = tokens?.find((i) => i.symbol === 'SOL')

    if (token1) {
      setTokenA({ address: token1.address, decimals: token1.decimals, symbol: token1.symbol, name: token1.name })
    } else if (usd) {
      setTokenA({ address: usd.address, decimals: usd.decimals, symbol: usd.symbol, name: usd.name })
    }

    if (token2) {
      setTokenB({ address: token2.address, decimals: token2.decimals, symbol: token2.symbol, name: token2.name })
    } else if (sol) {
      setTokenB({ address: sol.address, decimals: sol.decimals, symbol: sol.symbol, name: sol.name })
    }
  }, [setTokenA, setTokenB, tokens, tradePair])

  return (
    <JupiterProvider connection={connection} cluster="mainnet-beta" userPublicKey={wallet?.publicKey}>
      <SwapMain />
    </JupiterProvider>
  )
}

export const Swap: FC = () => {
  return (
    <SwapProvider>
      <SwapMainProvider />
    </SwapProvider>
  )
}
