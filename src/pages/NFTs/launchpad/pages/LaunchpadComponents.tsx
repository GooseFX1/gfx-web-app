import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Progress, Switch } from 'antd'
import { ModalSlide } from '../../../../components/ModalSlide'
import { useUSDCToggle, useNFTLPSelected } from '../../../../context/nft_launchpad'
import { useNavCollapse } from '../../../../context'
import { Row, Col } from 'antd'
import { SVGBlackToGrey } from '../../../../styles'
import { checkMobile } from '../../../../utils'

const ROADMAP_WRAPPER = styled.div`
  color: ${({ theme }) => theme.text4};

  .elipse {
    @media (max-width: 500px) {
      height: 45px;
      width: 45px;
    }
    height: 60px;
    width: 60px;
    margin-left: 2%;
    margin-top: -60px;
    border: none;
  }
  .verticalLine {
    @media (max-width: 500px) {
      width: 25%;
      margin-left: 2%;
    }
    width: 35%;
    height: 5px;
    margin-top: -60px;
    margin-left: 20px;
  }
  .verticalContainer {
    @media (max-width: 500px) {
      margin-top: 75px;
    }
    margin-top: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 30px;
  }
  .headingText {
    @media (max-width: 500px) {
      font-weight: 500;
      font-size: 15px;
      line-height: 20px;
    }
    font-weight: 600;
    font-size: 18px;
    margin-left: 10%;
    line-height: 20px;
    right: 15px;
    text-align: center;
  }
  .subHeadingText {
    @media (max-width: 500px) {
      width: auto;
    }
    font-weight: 500;
    font-size: 15px;
    right: 10px;
    line-height: 18px;
    color: #b5b5b5;
    text-align: center;
    width: 300px;
    padding-top: 5px;
  }
`
const GOLDEN_POPUP = styled.div`
  background: ${({ theme }) => theme.bg2};
  margin: auto;
  margin-top: -5%;
  width: 570px;
  height: 625px;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  .circle {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 70px;
  }
  .available {
    font-weight: 600;
    font-size: 18px;
    color: #b5b5b5;
    line-height: 22px;
  }
  .available-text {
    font-weight: 600;
    font-size: 28px;
    line-height: 34px;
    color: #eeeeee;
  }

  .available-text {
    font-weight: 600;
    font-size: 28px;
    line-height: 34px;
    color: #eeeeee;
  }
  .need-more-text {
    font-weight: 500;
    font-size: 22px;
    line-height: 27px;
    text-align: center;
  }
`

const ToggleBG = styled.span`
  background: #2a2a2a;
  border-radius: 13px;
  padding: 10px;
  .toggle-text {
    padding: 10px;
  }
  .switch {
    border-radius: 27px;
    border: none;
  }
  .ant-switch {
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
  }
  .ant-switch-checked {
    background: linear-gradient(96.79deg, #5855ff 4.25%, #dc1fff 97.61%) !important;
  }
`
const TEAM_MEMBER_WRAPPER = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  color: ${({ theme }) => theme.text4};
  @media (max-width: 500px) {
    grid-template-columns: auto auto;
    padding: 5%;
  }

  .teamContainer {
    width: 80%;
    display: flex;
    flex-direction: column;
    height: 160px;
    align-items: center;
  }
  .avatar {
    cursor: pointer;
    margin-bottom: 20px;
    margin-top: 15px;
    width: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      border-radius: 50%;
      height: 75px;
      width: 75px;
    }
  }
  .userNameText {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 16px;
  }
`

const INFO_DIV_LIGHT = styled.div`
  display: flex;
  margin-right: 20px;
  width: 170px;
  height: 45px;
  justify-content: center;
  align-items: center;
  background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
  border-radius: 47px !important;
  padding: 1px;

  @media (max-width: 500px) {
    width: 40%;
    height: 42px;
    margin-right: 0;
  }

  .inner {
    width: 100%;
    height: 100%;
    border-radius: 47px;
    background: '#2a2a2a';
  }

  .inner-2 {
    @media (max-width: 500px) {
      font-size: 13px;
    }
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 47px !important;
    background: ${({ theme }) => theme.infoDivBackground};
    color: white;
    font-weight: 600;
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
  .priceImg {
    height: 25px;
    width: 25px;
  }
`
const USDC_INFO = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 47px !important;
  padding: 1px;
  background: linear-gradient(90deg, #5855ff 0%, #dc1fff 100%);
  .inner {
    border-radius: 47px;
    background: ${({ theme }) => theme.bg9};
  }

  .usdc-inner {
    padding: 12px 24px;
    background: linear-gradient(0deg, rgba(116, 116, 116, 0.2), rgba(116, 116, 116, 0.2)),
      linear-gradient(274.05deg, rgba(220, 31, 255, 0.5) 8.16%, rgba(88, 85, 255, 0.5) 93.57%);

    border-radius: 47px !important;
  }
`

const INFO_DIV_BRIGHT = styled.div`
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
  border-radius: 47px !important;
  padding: 1px;
  .inner-2 {
    padding: 12px 24px;
    border-radius: 47px !important;
    color: ${({ theme }) => theme.text1};
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
  }
`

const ProgressBarBG = styled.div`
  @media (max-width: 500px) {
    width: 90%;
    margin: 20px auto;
    height: 60px;
  }
  height: 70px;
  margin: 20px auto;
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.bg18};
  border-radius: 15px;
  font-weight: 600;
  font-size: 17px;
  .progress-bar {
    width: 460px;
    justify-content: start;
    margin-left: 12px;
    display: flex;
  }
  .ant-progress-text {
    margin-left: -80%;
    z-index: 1;
    margin-top: 2.5%;
    font-weight: 600;
    font-size: 18px;
  }
  .ant-progress-inner {
    background: ${({ theme }) => theme.pbbg};
  }

  .mintedNFT {
    font-weight: 600;
    color: #7d7d7d;
    font-size: 18px;
  }
  .totalNFT {
    font-size: 18px;
    color: ${({ theme }) => theme.text2};
  }
  .timer-circle {
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    margin-left: 20px;
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
  }
  .mintStarts {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 12px;
  }
  .timeText {
    margin-left: 10px;
    margin-right: 30px;
  }
`

const VESTING_WRAPPER = styled.div`
  color: ${({ theme }) => theme.text4};
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 18%;
  }
  display: flex;
  flex-direction: column;
  .vestingStr {
    @media (max-width: 500px) {
      font-weight: 500;
      font-size: 15px;
      color: #eeeeee;
      line-height: 1.5;
    }
    margin: auto;
    margin-left: 40px;
    margin-right: 40px;
    text-align: center;
    font-weight: 600;
    font-size: 22px;
    .percentText {
      font-weight: 600;
      font-size: 22px;
      color: #50bb35;
    }
  }
  .currencyImg {
    width: 35px;
    height: 35px;
    margin-right: 15px;
  }
  .raisedText {
    font-weight: 600;
    font-size: 25px;
  }
`
const SOCIAL_ICON = styled.button`
  background: transparent;
  border: none;

  img {
    height: 24px;
  }
`

const DARK_DIV = styled.div`
  width: 45vw;

  .dark-1 {
    //biggest
    position: absolute;
    margin-left: 100px;
    width: 501px;
    height: 501px;
    margin-top: 25px;
    background: ${({ theme }) => theme.lpbg} !important;
    opacity: 0.6;
    border-radius: 20px;
  }
  .dark-2 {
    //smaller
    position: absolute;
    margin-left: 40px;
    margin-top: 50px;
    width: 451px;
    height: 451px;
    background: ${({ theme }) => theme.lpbg} !important;
    opacity: 0.5;
    border-radius: 20px;
  }
  .dark-3 {
    //smallest
    margin-left: 0px;
    margin-top: 75px;
    position: absolute;
    width: 401px;
    height: 401px;
    background: ${({ theme }) => theme.lpbg} !important;
    opacity: 0.3;
    border-radius: 20px;
  }
  .image-border {
    margin-left: 180px;
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    position: absolute;
    width: 567px;
    height: 567px;
    border-radius: 20px;
    margin-top: -7px;
    padding: 5px;
  }
  .inner-image-bg {
    border-radius: 20px;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${({ theme }) => theme.bg2} !important;
  }
  .inner-image {
    width: 515.65px;
    height: 517px;
    object-fit: cover;
    border-radius: 20px;
  }
`
const LIVE_BTN = styled.div`
  width: 135px;
  height: 40px;
  border: 1.5px solid #ffffff;
  backdrop-filter: blur(23.9091px);
  position: absolute;
  margin-left: 575px;
  margin-top: 30px;
  z-index: 299;
  border-radius: 10px;
  .liveText {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    margin-top: 2px;
    font-size: 18px;
    background: linear-gradient(96.79deg, #f7931a 4.25%, #d832f7 97.61%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`

export const MintProgressBar = ({ minted, totalNFTs }: { minted: number; totalNFTs: number }) => {
  let mintPercent = (minted / totalNFTs) * 100
  mintPercent = parseFloat(mintPercent.toFixed(0))
  return (
    <>
      <ProgressBarBG>
        <Progress
          className="progress-bar"
          percent={mintPercent}
          strokeWidth={40}
          strokeColor={'linear-gradient(96.79deg, #5855FF 4.25%, #DC1FFF 97.61%)'}
        />
        <>
          <span className="mintedNFT"> {minted ? minted : 0} </span>
          <span className="totalNFT">/{totalNFTs ? totalNFTs : 0}</span>
        </>
      </ProgressBarBG>
    </>
  )
}
export const SWITCH_HOLDER = styled.div<{ $navCollapsed: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  margin-top: calc(100px - ${({ $navCollapsed }) => ($navCollapsed ? '80px' : '0px')});
`

export const InfoDivLightTheme = ({ items, price, currency }: { items: any; price: number; currency: string }) => (
  <>
    <INFO_DIV_LIGHT>
      <div className={'inner'}>
        {price ? (
          <>
            <div className="inner-2">
              <>
                {'Price ' + price + ' '}
                <img className="priceImg" src={`/img/crypto/${currency}.svg`} />
                {currency}
              </>
            </div>
          </>
        ) : (
          <div className="inner-2">{'Items ' + items}</div>
        )}
      </div>
    </INFO_DIV_LIGHT>
  </>
)

export const Socials = () => {
  const { selectedProject } = useNFTLPSelected()
  return (
    <Row
      justify={checkMobile() ? 'center' : 'space-between'}
      align="middle"
      style={{ marginLeft: checkMobile() ? '0' : '10px' }}
    >
      <Col span={2} style={{ marginRight: checkMobile() ? '16px' : '0', maxWidth: checkMobile() ? '100%' : '' }}>
        <SOCIAL_ICON onClick={() => window.open(selectedProject?.website)}>
          <SVGBlackToGrey src="/img/assets/domains.svg" alt="domain-icon" />
        </SOCIAL_ICON>
      </Col>
      <Col span={2} style={{ marginRight: checkMobile() ? '16px' : '0', maxWidth: checkMobile() ? '100%' : '' }}>
        <SOCIAL_ICON onClick={() => window.open(selectedProject?.discord)}>
          <SVGBlackToGrey src="/img/assets/discord_small.svg" alt="discord-icon" />
        </SOCIAL_ICON>
      </Col>
      <Col span={2} style={{ marginRight: checkMobile() ? '16px' : '0', maxWidth: checkMobile() ? '100%' : '' }}>
        <SOCIAL_ICON onClick={() => window.open(selectedProject?.twitter)}>
          <SVGBlackToGrey src="/img/assets/twitter_small.svg" alt="twitter-icon" />
        </SOCIAL_ICON>
      </Col>
    </Row>
  )
}
//eslint-disable-next-line
export const Vesting = ({ currency, str }) => {
  return (
    <>
      <VESTING_WRAPPER>
        <div className="wrapper"></div>

        <div className="vestingStr">This project will receive all funds upfront and are not vested.</div>
      </VESTING_WRAPPER>
    </>
  )
}
export const InfoDivBrightTheme = ({ items }: { items: any }) => (
  <>
    <INFO_DIV_BRIGHT>
      <div className="inner-2">{items}</div>
    </INFO_DIV_BRIGHT>
  </>
)
export const InfoDivUSDCTheme = () => {
  const [goldenTicket, setGoldenTicket] = useState<boolean>()

  return (
    <>
      <USDC_INFO onClick={() => setGoldenTicket((prev) => !prev)}>
        <div className="inner">
          <div className="usdc-inner">Price $2500 USDC</div>
        </div>
      </USDC_INFO>
      {goldenTicket && <ModalSlide modalType="GOLDEN_TICKET" rewardToggle={setGoldenTicket} />}
    </>
  )
}

export const MintStarts = ({ time }: { time: string }) => {
  const getRemaningTime = (time) => {
    const startsOn = parseFloat(time)
    const timeDiffrence = startsOn - Date.now()
    const seconds = Number(timeDiffrence / 1000)
    const d = Math.floor(seconds / (3600 * 24))
    const h = Math.floor((seconds % (3600 * 24)) / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)

    return { dDisplay: d, hDisplay: h, mDisplay: m, sDisplay: s }
  }
  const rTime = getRemaningTime(time)
  return (
    <>
      <ProgressBarBG>
        <div className="mintStarts">
          Mint starts:
          <TimerCircle data={rTime?.dDisplay} />{' '}
          <div className="timeText"> {rTime?.dDisplay > 1 ? 'Days' : 'Day'} </div>
          <TimerCircle data={rTime?.hDisplay} />{' '}
          <div className="timeText"> {rTime?.hDisplay > 1 ? 'hours' : 'hour'} </div>
          <TimerCircle data={rTime?.mDisplay} />{' '}
          <div className="timeText"> {rTime?.mDisplay > 1 ? 'minutes' : 'minute'} </div>
        </div>
      </ProgressBarBG>
    </>
  )
}
const TimerCircle = ({ data }: { data: any }) => <div className="timer-circle">{data}</div>

export const TokenSwitch = ({ disabled, currency }: { disabled: boolean; currency: string }) => {
  const { isUSDC, setIsUSDC } = useUSDCToggle()
  const { isCollapsed } = useNavCollapse()

  useEffect(() => {
    if (currency === 'SOL') setIsUSDC(false)
    else setIsUSDC(true)
  }, [currency])

  const onChange = () => {
    setIsUSDC((prev) => !prev)
  }
  return (
    <>
      <SWITCH_HOLDER $navCollapsed={isCollapsed}>
        <ToggleBG>
          <span className="toggle-text">SOL</span>
          <Switch disabled={disabled} className="switch" checked={isUSDC} onChange={onChange} />
          <span className="toggle-text">USDC</span>
        </ToggleBG>
      </SWITCH_HOLDER>
    </>
  )
}

export const LiveButton = () => (
  <LIVE_BTN>
    <div className="liveText">Live</div>
  </LIVE_BTN>
)

export const DarkDiv = ({ coverUrl }: { coverUrl: string }) => (
  <DARK_DIV>
    <div className="dark-3" />
    <div className="dark-2" />
    <div className="dark-1" />
    <LiveButton />

    <div className="image-border">
      <div className="inner-image-bg">
        <img className="inner-image" src={coverUrl} alt="cover" />
      </div>
    </div>
  </DARK_DIV>
)

export const GoldenTicketPopup = () => {
  const closeGoldenPopup = (e: any) => {
    if (e.target.id !== 'golden-ticket-popup') console.log('close popup')
  }
  return (
    <GOLDEN_POPUP id="golden-ticket-popup" onClick={(e) => closeGoldenPopup(e)}>
      <div className="circle">
        <img className="ticket" src="/img/assets/GoldenTicket.png" alt="ticket" />
      </div>
      <div className="available-text">Available:</div>
      <div className="available-text">3 Golden Tickets</div>
      <div className="need-more-text">
        {'You need 1 '}
        <span className="golden-text">{' Golden Ticket '}</span>
        to get on the Okay Bears Whitelist.
      </div>
    </GOLDEN_POPUP>
  )
}

export const TeamMembers = ({ teamMembers }: { teamMembers: any[] }) => (
  <TEAM_MEMBER_WRAPPER>
    {teamMembers?.map((team, key) => (
      <div className="teamContainer" key={key}>
        {team?.dp_url ? (
          <div className="avatar">
            <img src={team?.dp_url} alt="" />
          </div>
        ) : (
          <div className="avatar">
            <img src={`/img/assets/avatarDark.png`} alt="" />
          </div>
        )}
        <div className="userNameText">{team?.name}</div>
      </div>
    ))}
  </TEAM_MEMBER_WRAPPER>
)

export const RoadMap = ({ roadmap }: { roadmap: any[] }) => (
  <ROADMAP_WRAPPER>
    {roadmap?.map((road, key) => (
      <div className="verticalContainer" key={key}>
        <img className="elipse" src={`/img/assets/elipse.png`} alt="" />
        <img className="verticalLine" src="/img/assets/vectorLine.svg" alt="" />
        <div style={{ marginTop: '-50px', marginLeft: '10px' }}>
          <div className="headingText">{road?.heading}</div>
          <div className="subHeadingText">{road?.subheading}</div>
        </div>
      </div>
    ))}
  </ROADMAP_WRAPPER>
)
