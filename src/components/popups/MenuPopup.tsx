import React, { useState } from 'react'
import styled from 'styled-components'
import { useDarkMode } from '../../context'
import { CircularMenu } from './CircularMenu'
import { CAROUSEL } from '../../constants'
import { Link, useHistory } from 'react-router-dom'

const WRAPPER = styled.div`
  height: 650px;
  width: 100%;
  bottom: 0;
  font-family: Montserrat !important;
  background-color: ${({ theme }) => theme.bg9};
  border-radius: 20px 20px 0 0;
  position: absolute;
`

const CircularDiv = styled.div`
  position: absolute;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: -32%;
  margin-left: -130px;

  .outer-bg {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    border: 6px solid #262626;
    background: #2a2a2a;
  }
  .inner-bg {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 351px;
    height: 351px;
    border-radius: 50%;
    background: #373636;
  }
  .go-btn {
    width: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 50%;
    height: 150px;
    font-weight: 600;
    font-size: 25px;
    background: linear-gradient(142.39deg, #c922f7 21.76%, rgba(71, 51, 194, 0) 67.58%);
  }
  .go-text {
    margin-top: -50px;
  }
  .semiCircle {
    position: relative;
    margin-left: 125px;
    bottom: -18px;
  }
  .leftArrow {
    position: absolute;
    transform: rotate(90deg) scale(1.3);
    margin-left: 180px;
    margin-top: -220px;
    cursor: pointer;
  }

  .rightArrow {
    cursor: pointer;
    position: absolute;
    margin-right: -125px;
    margin-top: -220px;
    transform: rotate(270deg) scale(1.3);
    margin-left: 220px;
  }
`

const MenuPopup = ({ rewardToggle }) => {
  const { mode } = useDarkMode()
  const history = useHistory()
  const [rotateClicked, setRotateClicked] = useState<'left' | 'right'>()
  const [clickCounter, setClickCounter] = useState<number>(0)

  const [carousel, setCarousel] = useState([...CAROUSEL])
  const next = () => {
    setRotateClicked('right')
    setClickCounter((prev) => prev + 1)
    const arr = [],
      n = carousel.length

    for (let i = 0; i < n; i++) {
      arr[i] = carousel[(n + i - 1) % n]
    }
    setTimeout(() => {
      setCarousel([...arr])
    }, 150)
  }
  const prev = () => {
    setRotateClicked('left')
    setClickCounter((prev) => prev + 1)

    const arr = [],
      n = carousel.length
    for (let i = 0; i < n; i++) {
      arr[i] = carousel[(n + i + 1) % n]
    }
    setTimeout(() => {
      setCarousel([...arr])
    }, 150)
  }
  const redirectToPage = () => {
    if (carousel[0].redirect) {
      history.push(carousel[0].redirect)
    }
  }
  return (
    <WRAPPER>
      <CircularMenu
        rewardToggle={rewardToggle}
        carousel={carousel}
        rotateClicked={rotateClicked}
        clickCounter={clickCounter}
      />

      <CircularDiv>
        <div className="semiCircle">
          <img src="/img/assets/semiCircle.png" alt="semi circle" />
        </div>
        <span className="leftArrow" onClick={next}>
          <img src="/img/assets/arrow-down-large.svg" alt="arrow" />
        </span>
        <span className="rightArrow" onClick={prev}>
          <img src="/img/assets/arrow-down-large.svg" alt="arrow" />
        </span>

        <div className="outer-bg">
          <div className="inner-bg">
            <div className="go-btn" onClick={redirectToPage}>
              <div className="go-text">Go!</div>
            </div>
          </div>
        </div>
      </CircularDiv>
    </WRAPPER>
  )
}

export default MenuPopup
