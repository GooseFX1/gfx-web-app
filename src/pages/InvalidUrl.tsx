import React from 'react'
import styled from 'styled-components'
import { MainButton } from '../components'
import { useDarkMode } from '../context'
import { useHistory } from 'react-router-dom'
import Lottie from 'lottie-react'
import notFound from '../animations/404.json'

const PAGE_CONTAINER = styled.div`
  width: 100vw;
  height: calc(100vh - 58px);

  .moveDown {
    position: relative;
    top: 100px;
  }
  .animation-404 {
    height: 500px;
  }
  .plug-icon-left {
    position: absolute;
    bottom: 58px;
    left: 0px;
  }
  .plug-icon-right {
    position: absolute;
    top: 50px;
    right: 0px;
  }
  .not-found-message {
    font-family: 'Montserrat';
    margin: 0 auto;
    color: ${({ theme }) => theme.text11};
    font-size: 25px;
    font-weight: 500;
    width: 30%;
    min-width: 300px;
    text-align: center;
  }
`

const HOME_BTN = styled(MainButton)`
  background: linear-gradient(90deg, #5855ff 0%, #dc1fff 100%);
  margin: 42px auto 0;

  &:hover {
    background: linear-gradient(90deg, #dc1fff 0%, #dc1fff 100%);
  }

  span {
    font-weight: 600;
    font-size: 22px;
    line-height: 27px;
  }
`

export const GenericNotFound = () => {
  const { mode } = useDarkMode()
  const history = useHistory()

  return (
    <PAGE_CONTAINER>
      <Lottie animationData={notFound} className="animation-404" />
      <img className="plug-icon-left" src={`/img/assets/plug2-${mode}.svg`} alt="" />
      <img className="plug-icon-right" src={`/img/assets/plug-${mode}.svg`} alt="" />
      <div className="not-found-message">Oops! We can’t find the page that you are looking for.</div>
      <div>
        <HOME_BTN
          height={'60px'}
          status={'action'}
          width={'267px'}
          radius={'20px'}
          onClick={() => history.push('/swap')}
        >
          <span> Go Back Home</span>
        </HOME_BTN>
      </div>
    </PAGE_CONTAINER>
  )
}
