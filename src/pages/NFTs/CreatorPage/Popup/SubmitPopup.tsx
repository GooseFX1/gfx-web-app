import React, { useState } from 'react'
import { ModalSlide } from '../../../../components/ModalSlide'
import { MODAL_TYPES } from '../../../../constants'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { Button, Checkbox, Col, Row } from 'antd'
import { useNFTCreator } from '../../../../context/nft_creator'
import { useNFTLaunchpad } from '../../../../context/nft_launchpad'
import { useHistory } from 'react-router-dom'
import { useNavCollapse } from '../../../../context'

const TEXT = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  margin-left: 20px;
  margin-top: 20px;
  background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`
export const CENTER_WRAP = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10%;
  font-family: 'Montserrat';
  font-style: normal;
`
const WRAPPER = styled.div`
  position: absolute;
  width: 610px;
  height: 85%;
  background: #2a2a2a;
  border-radius: 25px;
  .titleText {
    margin-top: 10px;
    color: #b5b5b5;
    font-weight: 500;

    font-size: 22px;
    text-align: center;
    padding-bottom: 10px;
    border-bottom: 2px solid #3d3d3d;
  }
  .stepsContainer {
    overflow-y: scroll;
    overflow-x: hidden;
    height: 65%;
  }
  .save-button {
    margin-left: 30px;
    ${tw`absolute bottom-0 flex justify-center items-center w-11/12 mb-5`}
    .button-save {
      ${tw`h-full rounded-[29px] w-10/12 h-12 text-[15px] font-medium flex justify-center items-center cursor-pointer`}
      background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
      opacity: 0.6;
      color: ${({ theme }) => theme.text11};
      cursor: no-drop;
      &.active {
        background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
        color: #eeeeee;
        opacity: 1 !important;
        cursor: pointer;
      }
    }
  }
  .submitContainer {
    height: 120px;
    width: 100%;
    bottom: 0;
    border-top: 2px solid #3d3d3d;
    position: absolute;
  }
  .checkmark {
    margin-left: 90px;
    margin-top: 10px;
    margin-right: 20px;
  }
  .reviewItems {
    font-weight: 600;
    font-size: 17px;
    line-height: 21px;
    margin-top: 10px;
    padding-left: 20px;
  }
  .closeImg {
    position: absolute;
    right: 30px;
    top: 30px;
    cursor: pointer;
  }

  .checkboxContainer {
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
    margin-top: -20px;
    margin-left: 25px;
    border: none;
    :hover {
      color: white;
    }
  }
`

const SubmitPopup = ({ rewardToggle }) => {
  const [disclaimer, setDisclaimer] = useState<boolean>(false)
  const [acceptRisk, setRisk] = useState<boolean>(false)
  const { creatorData } = useNFTCreator()
  const history = useHistory()
  const { setRelaxPopup } = useNavCollapse()
  const handleCheckboxClick = (e) => {
    setRisk(e.target.checked)
  }
  const handleSubmitClicked = () => {
    setRelaxPopup(true)
    history.push('/NFTs/launchpad')
  }
  return (
    <CENTER_WRAP>
      {disclaimer && <ModalSlide rewardToggle={setDisclaimer} modalType={MODAL_TYPES.CREATOR_DISCLAIMER} />}
      <WRAPPER>
        <div className="titleText">
          <img className="closeImg" src="/img/assets/close-white-icon.svg" alt="" onClick={() => rewardToggle(false)} />
          You are about to submit <br />
          <strong style={{ color: 'white' }}>
            {`Tier #1 "The Egg"`} by {`NestQuest`}
          </strong>
        </div>
        <Row className="stepsContainer">
          <Col span={24}>
            {' '}
            <StepText text={1} />
          </Col>
          <br />
          <Col span={12} className="reviewItems">
            Legal Permission
          </Col>
          <Col span={12} className="reviewItems">
            {creatorData[1]?.legality}
          </Col>
          <Col span={12} className="reviewItems">
            Project Name
          </Col>
          <Col span={12} className="reviewItems">
            {creatorData[1]?.projectName}
          </Col>
          <Col span={12} className="reviewItems">
            Collection Name
          </Col>
          <Col span={12} className="reviewItems">
            {creatorData[1]?.collectionName}
          </Col>
          <Col span={12} className="reviewItems">
            Collection description
          </Col>
          <Col span={12} className="reviewItems">
            {creatorData[1]?.collectionDescription.substring(0, 20) + '...'}
          </Col>

          {/* Step 2 */}
          <Col span={24}>
            {' '}
            <StepText text={2} />
          </Col>
          <br />
          <Col span={12} className="reviewItems">
            Cover image launchpad
          </Col>
          <Col span={12} className="reviewItems">
            {creatorData[2]?.image.name.substring(0, 24) + '...'}
          </Col>
          <Col span={12} className="reviewItems">
            Number of items
          </Col>
          <Col span={12} className="reviewItems">
            {creatorData[2]?.numberOfItems}
          </Col>
          <Col span={12} className="reviewItems">
            Raised token
          </Col>
          <Col span={12} className="reviewItems">
            {creatorData[2]?.currency}
          </Col>
          <Col span={12} className="reviewItems">
            Mint Price
          </Col>
          <Col span={12} className="reviewItems">
            {creatorData[2]?.mintPrice}
          </Col>
          {/* Step 3 */}
          <Col span={24}>
            {' '}
            <StepText text={3} />
          </Col>
          <br />
          <Col span={12} className="reviewItems">
            Do you vest your funds ?
          </Col>
          <Col span={12} className="reviewItems">
            {creatorData[3]?.vesting}
          </Col>
          <Col span={12} className="reviewItems">
            Project will be ready to mint by
          </Col>
          <Col span={12} className="reviewItems">
            {creatorData[3]?.date}
          </Col>
          <Col span={12} className="reviewItems">
            Time Selected
          </Col>
          <Col span={12} className="reviewItems">
            {creatorData[3]?.time}
          </Col>

          {/* Step 4 */}
          <Col span={24}>
            {' '}
            <StepText text={4} />
          </Col>
          <br />
          <Col span={12} className="reviewItems">
            Deleyed reveal
          </Col>
          <Col span={12} className="reviewItems">
            {creatorData[4]?.delayedReveal.toString()}
          </Col>
          <Col span={12} className="reviewItems">
            Zip file name
          </Col>
          <Col span={12} className="reviewItems">
            {creatorData[4]?.uploadedFiles.name.substring(0, 24) + '...'}
          </Col>

          {/* Step 5 */}
          <Col span={24}>
            {' '}
            <StepText text={5} />
          </Col>
          <br />
          <Col span={12} className="reviewItems">
            Socials
          </Col>
          <Col span={12} className="reviewItems">
            {creatorData[5]?.discord}
            <br />
            {creatorData[5]?.twitter}
          </Col>
        </Row>

        <div className="submitContainer">
          <Checkbox className="checkmark" onChange={(e) => handleCheckboxClick(e)} />
          <div className="checkboxContainer">
            I agree to the{' '}
            <u style={{ cursor: 'pointer' }} onClick={() => setDisclaimer(true)}>
              {' '}
              Risks and Disclaimers Policy.{' '}
            </u>
          </div>
          <Row className="save-button">
            <div onClick={() => handleSubmitClicked()} className={acceptRisk ? 'active button-save' : 'button-save'}>
              Submit
            </div>
          </Row>
        </div>
      </WRAPPER>
    </CENTER_WRAP>
  )
}

export default SubmitPopup

const StepText = ({ text }) => {
  return <TEXT>Step {text}</TEXT>
}
