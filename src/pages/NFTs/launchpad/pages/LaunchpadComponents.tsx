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
  display: flex;
  margin-right: 20px;
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
  margin-bottom: 100px;
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
  width: 747px;

  .dark-1 {
    //biggest
    position: absolute;
    margin-left: 100px;
    width: 501px;
    height: 501px;
    margin-top: 25px;
    background: #2a2a2a;
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
    background: #2a2a2a;
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
    background: #2a2a2a;
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

export const MintProgressBar = ({ minted, totalNFTs }) => {
  // const minted = 2000
  // const totalNFTs = 10000
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
export const SWITCH_HOLDER = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 70px;
  margin-top: 24px;
`
export const InfoDivLightTheme = ({ items, price }) => {
  return (
    <>
      <INFO_DIV_LIGHT>
        <div className={'inner'}>
          {price ? (
            <div className="inner-2">{'Price ' + price}</div>
          ) : (
            <div className="inner-2">{'Items ' + items}</div>
          )}
        </div>
      </INFO_DIV_LIGHT>
    </>
  )
}
export const InfoDivBrightTheme = ({ items }) => {
  return (
    <>
      <INFO_DIV_BRIGHT>
        <div className="inner-2">{items}</div>
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

export const MintStarts = ({ time }) => {
  const getRemaningTime = (time) => {
    //item?.startsOn;
    const startsOn = time
    const timeDiffrence = startsOn - Date.now()
    let seconds = Number(timeDiffrence / 1000)
    var d = Math.floor(seconds / (3600 * 24))
    var h = Math.floor((seconds % (3600 * 24)) / 3600)
    var m = Math.floor((seconds % 3600) / 60)
    var s = Math.floor(seconds % 60)

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
const TimerCircle = ({ data }) => {
  return <div className="timer-circle">{data}</div>
}

export const TokenSwitch = () => {
  const onChange = (change) => {
    console.log(change)
  }
  return (
    <>
      <SWITCH_HOLDER>
        <ToggleBG>
          <span className="toggle-text">SOL</span>

          <Switch className="switch" defaultChecked onChange={onChange} />
          <span className="toggle-text">USDC</span>
        </ToggleBG>
      </SWITCH_HOLDER>
    </>
  )
}

export const DarkDiv = ({ coverUrl }) => {
  return (
    <DARK_DIV>
      <div className="dark-3" />
      <div className="dark-2" />
      <div className="dark-1" />

      <div className="image-border">
        <div className="inner-image-bg">
          <img className="inner-image" src={coverUrl} />
        </div>
      </div>
    </DARK_DIV>
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
