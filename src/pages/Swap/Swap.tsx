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
import { useDarkMode, useSwap, SwapProvider, useSlippageConfig, ENDPOINTS, useConnectionConfig } from '../../context'
import { CenteredImg, SpaceBetweenDiv, CenteredDiv, SVGDynamicReverseMode } from '../../styles'
import { JupiterProvider, useJupiter } from '@jup-ag/react-hook'
import { PublicKey } from '@solana/web3.js'
import { TOKEN_LIST_URL } from '@jup-ag/core'
import { useWallet } from '@solana/wallet-adapter-react'
import { ILocationState } from '../../types/app_params.d'
import { notify, moneyFormatter, nFormatter } from '../../utils'

const CoinGecko = require('coingecko-api')
const CoinGeckoClient = new CoinGecko()

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
  ${({ theme }) => theme.largeShadow}
`

const TokenTitle = styled.div`
  font-weight: 600;
  font-size: 18px;
  color: ${({ theme }) => theme.text1};
`

const SmallTitle = styled.div`
  font-size: 15px;
  color: ${({ theme }) => theme.text12};
`

const AltSmallTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.text12};
`

const SmallTitleFlex = styled.div`
  font-size: 15px;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.text12};
`

const SmallerTitle = styled.div`
  font-size: 15px;
  background: linear-gradient(90.25deg, #f7931a 2.31%, #dc1fff 99.9%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`
const TokenHeader = styled.div`
  display: flex;
  width: 100%;
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

    .content {
      width: 67%;

      div {
        ${({ theme }) => theme.ellipse}
      }
    }
    .price {
      margin-left: 4px;
      width: 30%;
    }
  }
`

const TokenDetail = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: ${({ theme }) => theme.margin(1.5)} 0;
`

const SubHeader = styled.div`
  margin-left: 1rem;
  height: 40px;
`

const Socials = styled.div`
  display: flex;
  justify-content: space-around;
  width 90%;
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
  ${({ theme }) => theme.measurements(theme.margin(5))}
  margin-right: ${({ theme }) => theme.margin(0.5)};
  ${({ theme }) => theme.roundedBorders}
`
const SMALL_CLICKER_ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margin(2))}
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
  ${({ theme }) => theme.largeShadow}
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
  }

  .action {
    position: absolute;
    top: 0;
    right: 32px;
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
`
//#endregion

const SwapContent: FC<{ exchange?: (any: any) => void; routes: any; clickNo }> = ({ exchange, routes, clickNo }) => {
  const location = useLocation<ILocationState>()
  const { setEndpoint, network } = useConnectionConfig()
  const { mode } = useDarkMode()
  const { refreshRates, setFocused, switchTokens } = useSwap()
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
          <span>{dateString(new Date())}</span>
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
      <SwapButton exchange={exchange} route={route} />
    </SWAP_CONTENT>
  )
}

const TokenContent: FC = () => {
  //CoinGeckoClient
  const { tokenA } = useSwap()
  const [tokenDetails, setDetails] = useState([
    { name: 'Price', value: '0', currency: '$' },
    { name: 'FDV', value: '0', currency: '$' },
    { name: 'Max Total Supply', value: '0' },
    { name: 'Holders', value: '0' }
  ])

  const [socials, setSocials] = useState([])

  const coinsIds = {
    SOL: 'solana',
    USDC: 'usd-coin'
  }
  const truncate = (address: string) => {
    return address.slice(0, 7) + '...' + address.slice(-6)
  }

  useEffect(() => {
    if (tokenA) {
      CoinGeckoClient.coins.fetch(coinsIds[tokenA.symbol], {}).then(async (data: any) => {
        data = data.data
        const fetchData = await fetch('https://public-api.solscan.io/token/holders?tokenAddress=' + tokenA.address)
        const res = await fetchData.json()
        // await connection.getProgramAccounts(TOKEN_PROGRAM_ID, {
        //   // dataSlice: {
        //   //   offset: 0, // number of bytes
        //   //   length: 0 // number of bytes
        //   // },
        //   filters: [
        //     {
        //       dataSize: 165 // number of bytes
        //     },
        //     {
        //       memcmp: {
        //         offset: 0, // number of bytes
        //         bytes: tokenA.address // base58 encoded string
        //       }
        //     }
        //   ]
        // })
        setDetails([
          { name: 'Price', value: data.market_data.current_price.usd, currency: '$' },
          {
            name: 'FDV',
            value:
              moneyFormatter(
                Math.floor(
                  data.market_data.fully_diluted_valuation.usd ||
                    data.market_data.total_supply * data.market_data.current_price.usd
                )
              ) || '0',
            currency: '$'
          },
          {
            name: 'Max Total Supply',
            value: Math.floor(data.market_data.max_supply || data.market_data.total_supply).toLocaleString() || '0'
          },
          { name: 'Holders', value: res?.total.toLocaleString() || 0 }
        ])
        setSocials([
          { name: 'Twitter', link: 'https://twitter.com/' + data.links.twitter_screen_name },
          { name: 'Coingecko', link: 'https://coingecko.com' },
          { name: 'Website', link: data.links.homepage[0] }
        ])
      })
    }
  }, [tokenA])

  return (
    <TOKEN_WRAPPER>
      <TokenHeader>
        <CLICKER_ICON>
          <img src={`/img/crypto/${tokenA.symbol}.svg`} alt="" />
        </CLICKER_ICON>
        <SubHeader>
          <TokenTitle>
            {tokenA.name} ({tokenA.symbol})
          </TokenTitle>
          <div style={{ display: 'flex' }}>
            <SmallerTitle>{truncate(tokenA.address)}</SmallerTitle>
            <span
              style={{ marginLeft: '1rem', color: '#999', cursor: 'pointer' }}
              onClick={() => navigator.clipboard.writeText(tokenA.address)}
            >
              copy
            </span>
          </div>
        </SubHeader>
      </TokenHeader>
      {tokenDetails.map((detail) => (
        <TokenDetail>
          <TokenTitle>{detail.name}</TokenTitle>
          <SmallTitle>
            {detail.currency || null} {detail.value}
          </SmallTitle>
        </TokenDetail>
      ))}

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
  const { tokenA, tokenB, inTokenAmount, outTokenAmount } = useSwap()

  const [details, setDetails] = useState([
    { name: 'Price Impact', value: '0%' },
    {
      name: 'Minimum Received',
      value: 0 + ' ' + tokenB.symbol
    },
    {
      name: 'Fees paid to Serum LP',
      value: `${0} ${tokenA.symbol} (${0} %)`,
      extraValue: `0 ${tokenB.symbol} (0%)`
    },
    { name: 'Transaction fee', value: '0.00005 SOL', icon: 'info' }
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
    const percentB = +((totalLpB / outTokenAmount) * 100)?.toFixed(4)
    const out = route.outAmount / 10 ** tokenB.decimals
    setOutAmount(out)

    const priceDetails = [
      { name: 'Price Impact', value: `< ${route.priceImpactPct.toFixed(6)}%` },
      {
        name: 'Minimum Received',
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
      { name: 'Transaction fee', value: '0.00005 SOL', icon: 'info' }
    ]

    setDetails(priceDetails)

    const percentageCheap = +(((out - outTokenAmount) / out) * 100).toFixed(3)
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
            <img src={`/img/crypto/${tokenA.symbol}.svg`} alt="" />
          </SMALL_CLICKER_ICON>
          {inTokenAmount} {tokenA.symbol} ≈{'  '}
          <SMALL_CLICKER_ICON style={{ marginLeft: '0.5rem' }}>
            <img src={`/img/crypto/${tokenB.symbol}.svg`} alt="" />
          </SMALL_CLICKER_ICON>
          {+outAmount.toFixed(3)} {tokenB.symbol}
        </SmallTitleFlex>
        <SmallTitleFlex>
          <span style={{ color: cheap ? 'green' : 'red', marginRight: '0.25rem' }}>
            {outTokenPercentage}% {cheap ? 'cheaper' : 'higher'}
          </span>
          <span>than coingecko</span>
        </SmallTitleFlex>
      </TokenDetail>
      {details.map((detail) => (
        <TokenDetail>
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
        </TokenDetail>
      ))}
    </PRICE_WRAPPER>
  )
}

const AlternativesContent: FC<{ clickNo: number; setClickNo: (n: number) => void; routes: any[] }> = ({
  setClickNo,
  clickNo,
  routes
}) => {
  const { mode } = useDarkMode()
  const { tokenA, tokenB, setOutTokenAmount } = useSwap()
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
    <SWAP_ROUTES $less={less}>
      <div className="swap-content">
        {(!less ? details : details.slice(0, 2)).map((detail, k) => (
          <SWAP_ROUTE_ITEM
            $clicked={k === clickNo}
            $cover={mode === 'dark' ? '#3c3b3ba6' : '#ffffffa6'}
            onClick={() => {
              setClickNo(k)
              setOutTokenAmount(detail.outAmount || null)
            }}
          >
            <div className={'inner-container'}>
              <TokenDetail className={'content'}>
                <TokenTitle>{detail.name}</TokenTitle>
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
  const desktop = window.innerWidth > 1200
  const { tokenA, tokenB, inTokenAmount, outTokenAmount, priceImpact } = useSwap()
  const { slippage } = useSlippageConfig()
  const [allowed, setallowed] = useState(false)
  const [clickNo, setClickNo] = useState(1)
  const [chosenRoutes, setChosenRoutes] = useState([])
  const [inAmountTotal, setInAmountTotal] = useState(0)

  const { routes, exchange } = useJupiter({
    amount: inAmountTotal, // raw input amount of tokens
    inputMint: new PublicKey(tokenA?.address || 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD'),
    outputMint: new PublicKey(tokenB?.address || 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD'),
    slippage: slippage, // 1% slippage
    debounceTime: 250 // debounce ms time before refresh
  })

  useEffect(() => {
    const inAmountTotal = inTokenAmount * 10 ** (tokenA?.decimals || 0)
    setInAmountTotal(inAmountTotal)

    if (tokenA && tokenB) {
      setallowed(true)
    }

    let shortRoutes: any[] = routes?.filter((i) => i.inAmount === inAmountTotal)?.slice(0, 3)
    if (!routes) return
    if (tokenB && outTokenAmount) {
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
        outAmount: +(outTokenAmount * 10 ** tokenB.decimals).toFixed(7),
        outAmountWithSlippage: +(outTokenAmount * 10 ** tokenB.decimals * (1 - slippage)).toFixed(7),
        priceImpactPct: priceImpact
      }

      shortRoutes.splice(1, 0, GoFxRoute)
    }
    setChosenRoutes(shortRoutes)
  }, [tokenA, tokenB, routes, slippage, inTokenAmount, outTokenAmount])

  return (
    <WRAPPER>
      <INNERWRAPPER $desktop={desktop && allowed}>
        {desktop && allowed && <TokenContent />}
        <SwapContent exchange={exchange} routes={chosenRoutes} clickNo={clickNo} />
        {desktop && allowed && <PriceContent routes={chosenRoutes} clickNo={clickNo} />}
      </INNERWRAPPER>
      {desktop && allowed && inTokenAmount > 0 && (
        <AlternativesContent routes={chosenRoutes} clickNo={clickNo} setClickNo={setClickNo} />
      )}
    </WRAPPER>
  )
}

const SwapMainProvider: FC = () => {
  const { connection } = useSwap()
  const wallet = useWallet()

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
