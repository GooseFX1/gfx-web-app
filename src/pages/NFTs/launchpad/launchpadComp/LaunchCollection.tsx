import React, { FC } from 'react'
import styled from 'styled-components'
import LaunchImg from '../../../../assets/launch.svg'

const Container = styled.div`
  width: 90%;
  height: 295px;
  margin: auto;
  display: flex;
  background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
  border-radius: 15px;
  align-items: center;
`
const TEXT = styled.div`
  font-weight: 600;
  font-size: 50px;
`

const IMG = styled.image`
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
  return (
    <>
      <Container>
        <IMG>
          <img src={LaunchImg} />
        </IMG>
        <TEXT_CONTAINER>
          <TEXT>Launch your collection today!</TEXT>
          <APPLY_BTN>Apply</APPLY_BTN>
        </TEXT_CONTAINER>
      </Container>
    </>
  )
}
export default LaunchCollection
