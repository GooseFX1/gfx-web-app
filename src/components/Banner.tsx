import React from 'react'
import styled from 'styled-components'
import { SVGDynamicReverseMode } from '../styles'

const BANNER = styled.div`
  background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
  border-radius: 10px;
  padding: 1px;
  max-width: 364px;

  .inner {
    padding: 12px 24px;
    border-radius: 10px;
    background: ${({ theme }) => theme.bg9};
  }

  h6 {
    color: ${({ theme }) => theme.text1};
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
  }

  p {
    color: ${({ theme }) => theme.text6};
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    margin: 0;
  }

  .banner-icon {
    float: left;
    margin-right: 12px;
  }

  .close-button {
    position: absolute;
    top: 4px;
    right: 8px;
    background: transparent;
    border: none;

    .close-icon {
      height: 8px;
    }
  }
`

interface IProps {
  title: string
  support?: string | JSX.Element
  iconFileName?: string
  handleDismiss?: (bool: boolean) => void
  [x: string]: any
}

export const Banner = ({ title, support, handleDismiss, iconFileName }: IProps) => (
  <BANNER>
    <div className={'inner'}>
      <div>
        {iconFileName && (
          <SVGDynamicReverseMode className="banner-icon" src={`/img/assets/${iconFileName}`} alt="banner-icon" />
        )}
        <h6>{title}</h6>
      </div>
      {support && <p>{support}</p>}
      {handleDismiss && (
        <button className={'close-button'} onClick={() => handleDismiss(false)}>
          <SVGDynamicReverseMode className="close-icon" src={`/img/assets/close-white-icon.svg`} alt="close" />
        </button>
      )}
    </div>
  </BANNER>
)
