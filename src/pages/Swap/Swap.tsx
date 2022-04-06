import React, { FC, useEffect, useState } from 'react'
import { logEvent } from 'firebase/analytics'
import analytics from '../../analytics'
import styled, { css } from 'styled-components'
import { Rate } from './Rate'
import { Settings } from './Settings'
import { SwapButton } from './SwapButton'
import { SwapFrom } from './SwapFrom'
import { SwapTo } from './SwapTo'
import { Modal } from '../../components'
import { useDarkMode, useSwap, SwapProvider } from '../../context'
import { CenteredImg, SpaceBetweenDiv } from '../../styles'

const WRAPPER = styled.div`
  color: ${({ theme }) => theme.text1};
  height: calc(100vh - 81px);
  width: 100vw;
`

const INNERWRAPPER = styled.div`
  display: flex;
  max-height: 80%;
  margin-top: 10%;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.text1};
  width: 100vw;
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

const HEADER_TITLE = styled.span`
  font-weight: 600;
  font-size: 30px;
  line-height: 37px;
  color: ${({ theme }) => theme.text1};
`

const TOKEN_WRAPPER = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  align-items: center;
  height: 100%;
  width: 400px;
  padding: ${({ theme }) => theme.margin(4)};
  border-radius: 0px 20px 20px 0px;
  background-color: ${({ theme }) => theme.bg9};
  background: linear-gradient(256deg, #2a2a2a 1.49%, #181818 93.4%);

  ${({ theme }) => theme.largeShadow}
`

const Token_Title = styled.div`
  font-weight: 600;
  font-size: 18px;
  color: ${({ theme }) => theme.text1};
`

const SmallTitle = styled.div`
  font-size: 15px;
  color: ${({ theme }) => theme.text12};
`

const SmallTitleFlex = styled.div`
  font-size: 15px;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.text12};
`

const Smaller_Title = styled.div`
  font-size: 15px;
  background: linear-gradient(90.25deg, #f7931a 2.31%, #dc1fff 99.9%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`
const Token_Header = styled.div`
  display: flex;
  width: 100%;
  padding: 1rem;
`

const Alternative_Header = styled.div<{ $clicked?: boolean }>`
  display: flex;
  border-radius: 20px;
  background: ${({ theme, $clicked }) =>
    $clicked ? 'linear-gradient(180deg, rgba(247, 147, 26, 0.1) 0%, rgba(220, 31, 255, 0.1) 100%)' : theme.bg9};
  width: 330px;
  height: 100px;
  justify-content: center;
  align-items: center;
  padding: 1rem;
`

const Token_Detail = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
`

const SubHeader = styled.div`
  margin-left: 1rem;
  height: 40px;
`

const Socials = styled.div`
  display: flex;
  justify-content: space-around;
  width 90%;
  margin-top: 3rem;
`

const SocialsButton = styled.div`
  background-color: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text15};
  padding: 0.5rem 1rem 0.5rem 1rem;
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
  ${({ theme }) => theme.measurements(theme.margin(2))}
  margin-right: ${({ theme }) => theme.margin(1)};
  ${({ theme }) => theme.roundedBorders}
`

const PRICE_WRAPPER = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  align-items: center;
  height: 100%;
  width: 400px;
  border-radius: 20px 0px 0px 20px;
  padding: ${({ theme }) => theme.margin(4)};
  background-color: ${({ theme }) => theme.bg9};
  background: linear-gradient(88.61deg, #2a2a2a 1.49%, #181818 93.4%);
  ${({ theme }) => theme.largeShadow}
`

const ALTERNATIVE_WRAPPER = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  width: 100%;

  height: 20%;
`

const BestPrice = styled.div`
  position: absolute;
  font-size: 12px;
  margin-top: -90px;
  margin-left: 285px;
  padding: 0.25rem;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.text3};
`

const ShowLess = styled.span`
  position: absolute;
  font-size: 18px;
  top: 90%;
  right: 60px;
  border-radius: 0.5rem;
  cursor: pointer;
`

const ShowMore = styled.span`
  position: absolute;
  font-size: 18px;
  top: 97.5%;
  right: 25px;
  border-radius: 0.5rem;
  cursor: pointer;
`

const Price_Header = styled.div`
  display: flex;
  width: 100%;
  padding: 1rem;
  align-items: center;
`

const Price_Title = styled.div`
  font-weight: 600;
  font-size: 22px;
  margin-right: 1rem;
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

  .smaller-header-icon {
    height: 25px;
    cursor: pointer;
  }
`

const SETTING_WRAPPER = styled(CenteredImg)`
  margin-left: 8px;
  border-radius: 50%;
  padding: 0.5rem;
  background-color: ${({ theme }) => theme.bg10};
`

const SWITCH = styled(CenteredImg)<{ measurements: number }>`
  position: absolute;
  top: calc(50% - ${({ measurements }) => measurements}px / 2 + ${({ theme }) => theme.margin(2)});
  left: calc(50% - ${({ measurements }) => measurements}px / 2);
  ${({ measurements, theme }) => theme.measurements(measurements + 'px')}
  z-index: 1;
  cursor: pointer;
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

const SwapContent: FC = () => {
  const { mode } = useDarkMode()
  const { refreshRates, setFocused, switchTokens } = useSwap()
  const [settingsModalVisible, setSettingsModalVisible] = useState(false)

  useEffect(() => {
    const an = analytics()
    an !== null &&
      logEvent(an, 'screen_view', {
        firebase_screen: 'Swap',
        firebase_screen_class: 'load'
      })
  }, [])

  const onClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setSettingsModalVisible(true)
  }

  const height = '80px'
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
        <HEADER_TITLE>Swap</HEADER_TITLE>
        <div>
          <div onClick={refreshRates}>
            <img src={`/img/assets/refresh_rate.svg`} alt="refresh-icon" className={'header-icon'} />
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
          <img src={`/img/assets/swap_switch_${mode}_mode.svg`} alt="switch" />
        </SWITCH>
        <SwapTo height={height} />
      </BODY>
      <SwapButton />
    </SWAP_CONTENT>
  )
}

const TokenContent: FC = () => {
  // const { mode } = useDarkMode()
  // const { refreshRates, setFocused, switchTokens } = useSwap()
  // const [settingsModalVisible, setSettingsModalVisible] = useState(false)

  // useEffect(() => {
  //   const an = analytics()
  //   an !== null &&
  //     logEvent(an, 'screen_view', {
  //       firebase_screen: 'Swap',
  //       firebase_screen_class: 'load'
  //     })
  // }, [])

  // const onClick = (e: React.MouseEvent<HTMLElement>) => {
  //   e.stopPropagation()
  //   setSettingsModalVisible(true)
  // }

  // const height = '80px'
  // const localCSS = css`
  //   .swap-input {
  //     height: ${height};
  //     border-radius: 45px;
  //     border: none;
  //     padding-right: 20px;
  //     font-size: 16px;
  //   }

  //   .ant-modal-centered {
  //     top: -75px;
  //   }
  // `

  const tokenDetails = [
    { name: 'Price', value: '0.0932', currency: '$' },
    { name: 'FDV', value: '64786923', currency: '$' },
    { name: 'Max Total Supply', value: '1000000' },
    { name: 'Holders', value: '400000' }
  ]

  const socials = ['Twitter', 'Coingecko', 'Website']

  return (
    <TOKEN_WRAPPER>
      <Token_Header>
        <CLICKER_ICON>
          <img src={`/img/crypto/GOFX.svg`} alt="" />
        </CLICKER_ICON>
        <SubHeader>
          <Token_Title>GooseFX (GOFX)</Token_Title>
          <div style={{ display: 'flex' }}>
            <Smaller_Title>AHtgzX...VsLL8J</Smaller_Title>
            <span style={{ marginLeft: '1rem', color: '#999', cursor: 'pointer' }}>copy</span>
          </div>
        </SubHeader>
      </Token_Header>
      {tokenDetails.map((detail) => (
        <Token_Detail>
          <Token_Title>{detail.name}</Token_Title>
          <SmallTitle>
            {detail.currency || null} {detail.value}
          </SmallTitle>
        </Token_Detail>
      ))}

      <Socials>
        {socials.map((social) => (
          <SocialsButton>{social}</SocialsButton>
        ))}
      </Socials>
    </TOKEN_WRAPPER>
  )
}

const PriceContent: FC = () => {
  const priceDetails = [
    { name: 'Price Impact', value: '< 0.1%' },
    { name: 'Minimum Received', value: '0.025167 UDSC' },
    { name: 'Fees paid to Serum LP', value: '1.2e-9 GOFX (0.04 %)', extraValue: '0 USDC (0.04 %)' },
    { name: 'Transaction fee', value: '0.00005 SOL' }
  ]

  return (
    <PRICE_WRAPPER>
      <Price_Header>
        <Price_Title>Price Info</Price_Title>
        <SMALL_CLICKER_ICON>
          <img src={`/img/crypto/GOFX.svg`} alt="" />
        </SMALL_CLICKER_ICON>
      </Price_Header>
      <Token_Detail>
        <Token_Title>Rate</Token_Title>
        <SmallTitleFlex>
          {' '}
          <SMALL_CLICKER_ICON>
            <img src={`/img/crypto/GOFX.svg`} alt="" />
          </SMALL_CLICKER_ICON>{' '}
          1 GOFX ={'  '}
          <SMALL_CLICKER_ICON style={{ marginLeft: '0.5rem' }}>
            <img src={`/img/crypto/USDC.svg`} alt="" />
          </SMALL_CLICKER_ICON>
          2.345 USDC
        </SmallTitleFlex>
        <SmallTitleFlex>
          <span style={{ color: 'green', marginRight: '0.25rem' }}>24% cheaper</span>
          <span>than coingecko</span>
        </SmallTitleFlex>
      </Token_Detail>
      {priceDetails.map((detail) => (
        <Token_Detail>
          <Token_Title>{detail.name}</Token_Title>
          <SmallTitle>{detail.value}</SmallTitle>
          <SmallTitle>{detail.extraValue || null}</SmallTitle>
        </Token_Detail>
      ))}
    </PRICE_WRAPPER>
  )
}

const AlternativesContent: FC = () => {
  const alternativeDetails = [
    { name: 'Raydium x Raydium', value: 'GOFX to wDingcoin to USDC', price: '2.5569' },
    { name: 'Aldrin x Raydium', value: 'GOFX to BIXBIT to USDC', price: '2.4589', bestPrice: true },
    { name: 'Raydium x Raydium', value: 'GOFX to wDingcoin to USDC', price: '2.5569' },
    { name: 'Aldrin x Raydium', value: 'GOFX to BIXBIT to USDC', price: '2.4589' }
  ]
  const [clickNo, setClickNo] = useState(null)
  const [less, setLess] = useState(false)

  return (
    <ALTERNATIVE_WRAPPER>
      {(!less ? alternativeDetails : alternativeDetails.slice(0, 2)).map((detail, k) => (
        <Alternative_Header $clicked={k == clickNo} onClick={() => setClickNo(k)}>
          <Token_Detail>
            <Token_Title>{detail.name}</Token_Title>
            <SmallTitle>{detail.value}</SmallTitle>
          </Token_Detail>
          <Token_Title>{detail.price || null}</Token_Title>
          {detail.bestPrice && <BestPrice>Best Price</BestPrice>}
        </Alternative_Header>
      ))}
      {!less ? (
        <ShowLess onClick={() => setLess(true)}>Show Less</ShowLess>
      ) : (
        <ShowMore onClick={() => setLess(false)}>Show More</ShowMore>
      )}
    </ALTERNATIVE_WRAPPER>
  )
}

export const Swap: FC = () => {
  return (
    <SwapProvider>
      <WRAPPER>
        <INNERWRAPPER>
          <TokenContent />
          <SwapContent />
          <PriceContent />
        </INNERWRAPPER>
        <AlternativesContent />
      </WRAPPER>
    </SwapProvider>
  )
}
