import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { useDarkMode } from '../../context'
import { SVGDynamicReverseMode } from '../../styles'
import { useWallet } from '@solana/wallet-adapter-react'
import { logData } from '../../api'
import { checkMobile } from '../../utils'

const WRAPPER = styled.div`
  width: 100%;
  height: 100%;
  .carouselContainer {
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }
  .carousel {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 180px;
    width: 850px;
    height: 850px;
    border-radius: 50%;
  }
  .rotateLeft {
    transform: rotate(-60deg);
    transition: 0.3s ease;
    position: absolute;
    margin-left: 25%;
    margin-top: 10%;
    width: 850px;
    height: 850px;
    border-radius: 50%;
  }
  .rotateRight {
    transform: rotate(60deg);
    transition: 0.3s ease;
    position: absolute;
    margin-left: 25%;
    margin-top: 10%;
    width: 850px;
    height: 850px;
    border-radius: 50%;
  }
  .carousel::before {
    /* content: ""; */
    position: absolute;
    width: 50%;
    height: 100%;
    background: #000;
    border-radius: 50% 0 0 50%;
  }

  .buttonContainer {
    position: absolute;
    left: 38vw;
    bottom: 210px;
    z-index: 999;
  }
  .active {
    cursor: pointer;
    transition: 0.1s ease;
  }
  .featuresText {
    position: absolute;
    width: 135px;
    height: 37px;
    left: 29px;
    top: 35px;
    font-weight: 600;
    font-size: 30px;
    line-height: 37px;
    text-align: center;
    background: linear-gradient(88.69deg, #f8941b 32.01%, #e95aff 60.5%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
  .inactive {
    width: 144px;
    height: 144px;
    opacity: 0.5;
    transition: 2s ease;
  }
  .menuText {
    font-weight: 600;
    font-size: 25px;
    line-height: 30px;
    position: absolute;
    margin-top: 220px;
    transition: 5s ease;
  }
  // с = 2 Pr
  .exploreFeaturesText {
    position: absolute;
    width: 208px;
    height: 48px;
    left: 29px;
    top: 88px;
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
  }
  .closeIcon {
    position: absolute;
    right: 29px;
    top: 35px;
    transform: scale(1.3);
    cursor: pointer;
  }
  .item-carousel {
    position: absolute;
    border-radius: 50%;
    width: 00px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    margin: 2px;
    bottom: 0;

    &:nth-child(1) {
      //done create

      right: 420px;
      top: -10px;
    }
    &:nth-child(2) {
      //done sell
      right: 100px;
      top: 135px;
    }
    &:nth-child(3) {
      //done Launchpad
      right: 20px;
      top: 400px;
    }
    &:nth-child(4) {
      // do later hatra fract

      right: 500px;
      top: 1100px;
    }
    &:nth-child(5) {
      // lend
      right: 830px;
      top: 400px;
    }
    &:nth-child(6) {
      // borrow
      right: 775px;
      top: 135px;
    }
  }
`

export const CircularMenu = ({
  carousel,
  rotateClicked,
  clickCounter,
  rewardToggle
}: {
  carousel: any[]
  rotateClicked: string
  clickCounter: number
  rewardToggle: (b: boolean) => void
}) => {
  const { mode } = useDarkMode()
  const { publicKey } = useWallet()
  const [rotationClass, setRotationClass] = useState('carousel')
  const [indexClass, setIndexClass] = useState<'active' | 'inactive'>()
  const history = useHistory()

  useEffect(() => {
    logData(checkMobile() ? 'menu_clicked_mobile' : 'menu_clicked_desktop')
  }, [])

  useEffect(() => {
    setRotationClass(rotateClicked === 'left' ? 'rotateLeft' : 'rotateRight')
    setIndexClass('inactive')
    setTimeout(() => {
      setRotationClass('carousel')
      setIndexClass('active')
    }, 110)
  }, [clickCounter])

  const redirectToPage = () => {
    if (publicKey && carousel[0].name === 'Sell') {
      rewardToggle(false)
      history.push(`${carousel[0].redirect}/${publicKey.toBase58()}`)
    } else if (carousel[0].redirect && carousel[0].name !== 'Sell') {
      rewardToggle(false)
      history.push(carousel[0].redirect)
    }
  }

  return (
    <>
      <WRAPPER>
        <div className="closeIcon" onClick={() => rewardToggle(false)}>
          <SVGDynamicReverseMode src={`/img/assets/close-white-icon.svg`} alt="close" />
        </div>
        <div className="featuresText">Features</div>
        <div className="exploreFeaturesText">
          Explore our <br /> amazing features!
        </div>
        <div className="carouselContainer">
          <div className={rotationClass}>
            {carousel.map((item, index) => (
              <div className={`item-carousel ${index}`} key={item.id} id={item.id.toString()}>
                <img
                  className={index === 0 ? indexClass : 'inactive'}
                  alt={item.name}
                  onClick={index === 0 ? redirectToPage : null}
                  src={`/img/assets/nft-menu/${item.name.toLowerCase() + mode}.svg`}
                />

                <div className="menuText">{index === 0 && indexClass === 'active' ? carousel[0].name : ''}</div>
              </div>
            ))}
          </div>
        </div>
      </WRAPPER>
    </>
  )
}
