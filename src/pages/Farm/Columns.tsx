import React from 'react'
import styled from 'styled-components'

const STYLED_TITLE = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  .text {
    font-family: Montserrat;
    font-size: 15px;
    font-weight: 500;
    text-align: left;
    color: #fff;
  }
  .info-icon {
    width: 15px;
    height: auto;
    display: block;
    margin-left: ${({ theme }) => theme.margins['1x']};
  }

  .arrow-down {
    width: 14px;
    height: auto;
    display: block;
    margin-left: ${({ theme }) => theme.margins['1x']};
  }
`

const STYLED_NAME = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  .text {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    max-width: 90px;
    margin-left: ${({ theme }) => theme.margins['2.5x']};
  }
  .farm-image {
    width: 91px;
    height: 41px;
    display: block;
  }

  .percent-100 {
    width: 36px;
    height: auto;
    display: block;
    margin-left: ${({ theme }) => theme.margins['2.5x']};
  }
`

const STYLED_EARNED = styled.div`
  font-family: Montserrat;
  font-size: 17px;
  font-weight: 600;
  color: #b1b1b1;
  text-align: center;
`

const Title = (text, isInfo, isArrowDown) => (
  <STYLED_TITLE>
    <div className="text">{text}</div>
    {isInfo && <img className="info-icon" src={`${process.env.PUBLIC_URL}/img/assets/info-icon.svg`} alt="" />}
    {isArrowDown && <img className="arrow-down" src={`${process.env.PUBLIC_URL}/img/assets/arrow-down.svg`} alt="" />}
  </STYLED_TITLE>
)

export const columns = [
  {
    title: Title('Name', false, true),
    dataIndex: 'name',
    key: 'name',
    width: '15%',
    render: (text) => (
      <STYLED_NAME>
        <img className="farm-image" src={`${process.env.PUBLIC_URL}/img/assets/farm-name.svg`} alt="" />
        <div className="text">{text}</div>
        <img className="percent-100" src={`${process.env.PUBLIC_URL}/img/assets/percent-100.svg`} alt="" />
      </STYLED_NAME>
    )
  },
  {
    title: Title('Earned', 1, 1),
    dataIndex: 'earned',
    key: 'earned',
    width: '10%',
    render: (text) => <STYLED_EARNED>{text}</STYLED_EARNED>
  },
  {
    title: Title('APR', 1, 1),
    dataIndex: 'apr',
    key: 'apr',
    width: '12%',
    render: (text) => <div className="apr normal-text">{text}</div>
  },
  {
    title: Title('Rewards', 1, 1),
    dataIndex: 'rewards',
    key: 'rewards',
    render: (text) => <div className="rewards normal-text">{text}</div>
  },
  {
    title: Title('Liquidity', 1, 1),
    dataIndex: 'liquidity',
    key: 'liquidity',
    render: (text) => <div className="liquidity normal-text">{text}</div>
  },
  {
    title: Title('Volume (24h)', false, true),
    dataIndex: 'volume',
    key: 'volume',
    width: '12%',
    render: (text) => <div className="volume normal-text">{text}</div>
  }
]
