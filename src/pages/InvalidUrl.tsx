import { useEffect } from 'react'
import styled from 'styled-components'
import Lottie from 'lottie-react'
import notFound from './404.json'

const PAGE_CONTAINER = styled.div`
  width: 100%;
  min-height: 100vh;
  position: absolute;
  top: 0px;
  display: flex;
  justify-content: center;
  .moveDown {
    position: relative;
    top: 100px;
  }
  .animation-404 {
    position: absolute;
    top: 80px;
    height: 50%;
  }
  .plug-icon-left {
    position: absolute;
    bottom: 0px;
    left: 0px;
  }
  .plug-icon-right {
    position: absolute;
    top: 50px;
    right: 0px;
    transform: rotate(180deg);
  }
  .not-found-message {
    position: absolute;
    height: 100px;
    top: 500px;
    color: ${({ theme }) => theme.text11};
    font-size: 25px;
    font-weight: 500;
    width: 30%;
    min-width: 300px;
    text-align: center;
  }
`

export const GenericNotFound = () => {
  return (
    <PAGE_CONTAINER>
      <Lottie animationData={notFound} className="animation-404" />
      <img className="plug-icon-left" src={`/img/assets/plug.svg`} alt="" />
      <img className="plug-icon-right" src={`/img/assets/plug.svg`} alt="" />
      <div className="not-found-message">Oops! We can’t find the page that you are looking for.</div>
    </PAGE_CONTAINER>
  )
}
