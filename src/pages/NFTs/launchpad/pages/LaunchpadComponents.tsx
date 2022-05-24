import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Progress, Switch } from 'antd'
import { ModalSlide } from '../../../../components/ModalSlide'

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
  position: absolute;
  margin-top: 20px;
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
const INFO_DIV_LIGHT = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
  border-radius: 47px !important;
  padding: 1px;

  .inner {
    border-radius: 47px;
    background: ${({ theme }) => theme.bg9};
  }

  .inner-2 {
    padding: 12px 24px;
    border-radius: 47px !important;
    background: ${({ theme }) => theme.infoDivBackground};
    color: ${({ theme }) => theme.text1};
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
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
  width: 610px;
  height: 70px;
  display: flex;
  align-items: center;
  background: #2a2a2a;
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
  .mintedNFT {
    font-weight: 600;
    color: #7d7d7d;
    font-size: 18px;
  }
  .totalNFT {
    font-size: 18px;
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

const DARK_DIV = styled.div`
  .dark-1 {
    //biggest
    position: absolute;
    margin-left: 200px;
    width: 501px;
    height: 501px;
    margin-top: 50px;
    background: #2a2a2a;
    opacity: 0.6;
    border-radius: 20px;
  }
  .dark-2 {
    //smaller
    position: absolute;
    margin-left: 140px;
    margin-top: 75px;
    width: 451px;
    height: 451px;
    background: #2a2a2a;
    opacity: 0.5;
    border-radius: 20px;
  }
  .dark-3 {
    //smallest
    margin-left: 100px;
    margin-top: 100px;
    position: absolute;
    width: 401px;
    height: 401px;
    background: #2a2a2a;
    opacity: 0.3;
    border-radius: 20px;
  }
  .image-border {
    margin-left: 280px;
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    position: absolute;
    width: 567px;
    height: 567px;
    border-radius: 20px;
    margin-top: 18px;
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

export const MintProgressBar = () => {
  const minted = 2000
  const totalNFTs = 10000
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
          <span className="mintedNFT"> {minted}</span>
          <span className="totalNFT">/{totalNFTs}</span>
        </>
      </ProgressBarBG>
    </>
  )
}

export const InfoDivLightTheme = () => {
  return (
    <>
      <INFO_DIV_LIGHT>
        <div className={'inner'}>
          <div className="inner-2">Items 5,555</div>
        </div>
      </INFO_DIV_LIGHT>
      <br />
      <br />
      <br />
      <br />
      <INFO_DIV_BRIGHT>
        <div className="inner-2">Items 5,555</div>
      </INFO_DIV_BRIGHT>
    </>
  )
}
export const InfoDivUSDCTheme = () => {
  const [goldenTicket, setGoldenTicket] = useState<Boolean>()

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

export const MintStarts = () => {
  return (
    <>
      <ProgressBarBG>
        <div className="mintStarts">
          Mint starts:
          <TimerCircle data={23} /> <div className="timeText"> Days </div>
          <TimerCircle data={23} /> <div className="timeText"> Hours </div>
          <TimerCircle data={23} /> <div className="timeText"> Minutes </div>
        </div>
      </ProgressBarBG>
    </>
  )
}
const TimerCircle = ({ data }) => {
  return <div className="timer-circle">{data}</div>
}

export const TokenSwitch = () => {
  const onChange = (change) => {
    console.log(change)
  }
  return (
    <>
      <ToggleBG>
        <span className="toggle-text">SOL</span>

        <Switch className="switch" defaultChecked onChange={onChange} />
        <span className="toggle-text">USDC</span>
      </ToggleBG>
    </>
  )
}

export const DarkDiv = () => {
  return (
    <div>
      <DARK_DIV>
        <div className="dark-3" />
        <div className="dark-2" />
        <div className="dark-1" />

        <div className="image-border">
          <div className="inner-image-bg">
            <img className="inner-image" src="/img/assets/NestQuest.png" />
          </div>
        </div>
      </DARK_DIV>
    </div>
  )
}

export const GoldenTicketPopup = ({}) => {
  const closeGoldenPopup = (e) => {
    if (e.target.id !== 'golden-ticket-popup') console.log('close popup')
  }
  return (
    <GOLDEN_POPUP id="golden-ticket-popup" onClick={(e) => closeGoldenPopup(e)}>
      <div className="circle">
        <img className="ticket" src="/img/assets/GoldenTicket.png" />
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
