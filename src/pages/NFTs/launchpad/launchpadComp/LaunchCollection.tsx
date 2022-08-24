import React, { FC, useEffect } from 'react'
import styled from 'styled-components'
import { logData } from '../../../../api'
import LaunchImg from '../../../../assets/launch.svg'
import { SOCIAL_MEDIAS } from '../../../../constants'

const Container = styled.div`
  display: flex;
  justify-content: center;
  background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
  border-radius: 15px;
  margin-right: 40px !important ;
  margin-bottom: 70px;

  .startContainer {
    height: 295px;
    padding-right: 100px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: start;
  }
`
const TEXT = styled.div`
  font-weight: 600;
  font-size: 50px;
`

const IMG = styled.div`
  width: 149.82px;
  height: 166.62px;
  margin-left: 68px;
`
const APPLY_BTN = styled.button`
  background: #ffffff;
  border-radius: 29px;
  border: none;
  width: 219px;
  height: 60px;
  color: #5855ff;
  font-weight: 600;
  font-size: 18px;
  margin-left: 30%;
  margin-top: 16px;
`

const TEXT_CONTAINER = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 130px;
`

const LaunchCollection: FC = () => {
  const handleApplyClick = () => {
    window.open(SOCIAL_MEDIAS.nftCreatorForm)
  }
  useEffect(() => {
    logData('launchpad_page')
  }, [])

  return (
    <Container>
      <div className="startContainer">
        <IMG>
          <img src={LaunchImg} alt="launch-collection" />
        </IMG>
        <TEXT_CONTAINER>
          <TEXT>Launch your collection today!</TEXT>
          <APPLY_BTN onClick={handleApplyClick}>Apply</APPLY_BTN>
        </TEXT_CONTAINER>
      </div>
    </Container>
  )
}
export default LaunchCollection
