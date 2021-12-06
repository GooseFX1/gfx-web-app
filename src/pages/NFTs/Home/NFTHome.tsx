import React from 'react'
import styled from 'styled-components'
import { Header } from '../Header'
import NFTHeaderCarousel from '../NFTHeaderCarousel'
import NFTFooter from '../NFTFooter'
import NFTCarousel, { NFTCarouselType } from '../NFTCarousel'

const SCROLLING_CONTENT = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  position: relative;
`

const NFTHome = () => {
  const prevScrollY = React.useRef(0)
  const [goingUp, setGoingUp] = React.useState(false)
  const [isBigCarouselVisible, setBisCarouselVisible] = React.useState(true)

  const onScroll = (e) => {
    const currentScrollY = e.target.scrollTop
    if (prevScrollY.current < currentScrollY && goingUp) {
      setGoingUp(false)
    }
    if (prevScrollY.current > currentScrollY && !goingUp) {
      setGoingUp(true)
    }
    prevScrollY.current = currentScrollY
    console.log('currentScrollY', currentScrollY)
    if (currentScrollY >= 402.5) {
      setBisCarouselVisible(false)
    } else {
      setBisCarouselVisible(true)
    }
  }

  return (
    <>
      <Header />
      <NFTHeaderCarousel isBig={false} isBigVisible={isBigCarouselVisible} />
      <SCROLLING_CONTENT onScroll={onScroll}>
        <NFTHeaderCarousel isBig isBigVisible={isBigCarouselVisible} />
        <NFTCarousel type={NFTCarouselType.launchPad} title="Launchpad" showTopArrow isLaunch />
        <NFTCarousel type={NFTCarouselType.upcomming} title="Upcoming Collections" />
        <NFTCarousel type={NFTCarouselType.popular} title="Popular Collections" />
        <NFTFooter />
      </SCROLLING_CONTENT>
    </>
  )
}

export default NFTHome
