import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { useDarkMode, useWalletModal } from '../../context'
import { CircularMenu } from './CircularMenu'
import { CAROUSEL } from '../../constants'
import { useHistory } from 'react-router-dom'

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
    font-size: 14px;
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

interface IMenuPopup {
  rewardToggle: (bool: boolean) => void
}

const MenuPopup = ({ rewardToggle }: IMenuPopup) => {
  const { mode } = useDarkMode()
  const history = useHistory()
  const { publicKey } = useWallet()
  const { setVisible: setModalVisible } = useWalletModal()
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
  const redirectToPage = (isSell: boolean) => {
    console.log(isSell)

    if (isSell) {
      publicKey ? locateToSell() : handleWalletModal()
    } else if (carousel[0].redirect && !isSell) {
      rewardToggle(false)
      history.push(carousel[0].redirect)
    }
  }

  const locateToSell = () => {
    rewardToggle(false)
    history.push(`${carousel[0].redirect}/${publicKey.toBase58()}`)
  }

  const handleWalletModal = useCallback(() => {
    setModalVisible(true)
  }, [setModalVisible])

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
              <div className="go-btn" onClick={() => redirectToPage(carousel[0].name === 'Sell')}>
                <div className="go-text">{carousel[0].name === 'Sell' && !publicKey ? 'Connect' : 'Go!'}</div>
              </div>
            ) : (
              <div className="cmg-soon">
                <div className="cmg-soon-text">
                  Coming
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
