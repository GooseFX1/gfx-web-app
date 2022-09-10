import React from 'react'
import styled from 'styled-components'

const WRAPPER = styled.div`
  height: 416px;
  display: flex;
  flex-direction: column;
  width: 768px;
  position: absolute;
  background: #2a2a2a;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
  left: 0;
  right: 0;
  margin: auto;
  .image {
    width: 130px;
    height: 130px;
    margin-top: -20px;
  }
  .relaxText {
    margin-top: 20px;
    font-style: normal;
    font-weight: 600;
    font-size: 30px;
    line-height: 37px;
    text-align: center;
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
  .closeIcon {
    position: absolute;
    top: 30px;
    cursor: pointer;
    right: 30px;
  }
  .thanksText {
    font-style: normal;
    font-weight: 500;
    font-size: 22px;
    line-height: 27px;
    text-align: center;
    color: #ffffff;
    margin-top: 20px;
  }
`

const RelaxPopup = ({ rewardToggle }: { rewardToggle: (b: boolean) => void }) => (
  <WRAPPER>
    <img className="image" src="/img/assets/Launchpad.png" alt="" />
    <img className="closeIcon" src="/img/assets/close-white-icon.svg" alt="" onClick={() => rewardToggle(false)} />
    <div className="relaxText">Relax and get ready!</div>
    <div className="thanksText">
      Thanks for submitting your collection to the
      <br /> launchpad, we will review all the information and
      <br />
      get back to you as soon as possible.
    </div>
  </WRAPPER>
)

export default RelaxPopup
