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
  bottom: -27%;

  .outer-bg {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: ${({ theme }) => theme.bg9};
    border: 6px solid ${({ theme }) => theme.circleBoxShadow};
  }
  .inner-bg {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 351px;
    height: 351px;
    border-radius: 50%;
    background: ${({ theme }) => theme.innerCircle};
    box-shadow: 0px -10px 10px ${({ theme }) => theme.circleBoxShadow};
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
    color: ${({ theme }) => theme.bg0};
    background: ${({ theme }) => theme.goBtn};
  }
  .go-text {
    margin-top: -50px;
    color: white;
  }
  .cmg-soon {
    width: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    height: 150px;
    font-weight: 600;
    font-size: 18px;
    color: ${({ theme }) => theme.bg0};
    background: ${({ theme }) => theme.comingSoon};
  }
  .cmg-soon-text {
    margin-top: -60px;
    color: ${({ theme }) => theme.text7};
    text-align: center;
  }
  .semiCircle {
    position: absolute;
    margin-left: 0px;
    top: 0px;
    z-index: 100;
  }
  .leftArrow {
    position: absolute;
    transform: scale(1);
    margin-left: -80px;
    margin-top: -220px;
    cursor: pointer;
  }

  .rightArrow {
    cursor: pointer;
    position: absolute;
    margin-right: 150px;
    margin-top: -220px;
    transform: rotate(180deg) scale(1);
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
          <img src={`/img/assets/arrow-left${mode}.svg`} alt="arrow" />
        </span>
        <span className="rightArrow" onClick={prev}>
          <img src={`/img/assets/arrow-left${mode}.svg`} alt="arrow" />
        </span>

        <div className="outer-bg">
          <div className="inner-bg">
            {carousel[0].redirect ? (
              <div className="go-btn" onClick={redirectToPage}>
                <div className="go-text">Go!</div>
              </div>
            ) : (
              <div className="cmg-soon">
                <div className="cmg-soon-text">
                  Comming
                  <br /> Soon
                </div>
              </div>
            )}
          </div>
        </div>
      </CircularDiv>
    </WRAPPER>
  )
}

export default MenuPopup
