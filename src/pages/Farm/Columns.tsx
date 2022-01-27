import React from 'react'
import styled from 'styled-components'
import { Tooltip } from '../../components/Tooltip'

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
  .text {
    font-size: 18px;
    font-weight: 600;
    color: ${({ theme }) => theme.text8};
    max-width: 90px;
    margin-left: ${({ theme }) => theme.margins['2.5x']};
  }
  .coin-image {
    width: 41px;
    height: 41px;
    display: block;
    &.double-sided {
      width: 91px;
    }
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

const HeaderTooltip = (text: string) => {
  return (
    <img className="info-icon" src={`${process.env.PUBLIC_URL}/img/assets/info-icon.svg`} alt="" /> && (
      <Tooltip dark placement="bottomLeft" color="#000000">
        <p>{text}</p>
      </Tooltip>
    )
  )
}

const Title = (text: string, infoText: string, isArrowDown: boolean) => (
  <STYLED_TITLE>
    <div className="text">{text}</div>
    {infoText && HeaderTooltip(infoText)}
    {isArrowDown && <img className="arrow-down" src={`${process.env.PUBLIC_URL}/img/assets/arrow-down.svg`} alt="" />}
  </STYLED_TITLE>
)

export const columns = [
  {
    title: Title('Name', '', true),
    dataIndex: 'name',
    key: 'name',
    width: '15%',
    render: (text, record) => (
      <STYLED_NAME>
        <img
          className={`coin-image ${record.type === 'Double Sided' ? 'double-sided' : ''}`}
          src={`${process.env.PUBLIC_URL}/img/assets/${text.replace(' ', '-')}-icon.svg`}
          alt=""
        />
        <div className="text">{text}</div>
        <img className="percent-100" src={`${process.env.PUBLIC_URL}/img/assets/percent-100.svg`} alt="" />
      </STYLED_NAME>
    )
  },
  {
    title: Title('Earned', '', true),
    dataIndex: 'earned',
    key: 'earned',
    width: '10%',
    render: (text) => <STYLED_EARNED>{text}</STYLED_EARNED>
  },
  {
    title: Title('APR', 'Yearly deposit earned on your deposit.', true),
    dataIndex: 'apr',
    key: 'apr',
    width: '12%',
    render: (text) => <div className="apr normal-text">{text}</div>
  },
  {
    title: Title('Rewards', '', true),
    dataIndex: 'rewards',
    key: 'rewards',
    render: (text) => <div className="rewards normal-text">{text}</div>
  },
  {
    title: Title('Liquidity', "Total value of funds in this farm's liquidity pool.", true),
    dataIndex: 'liquidity',
    key: 'liquidity',
    render: (text) => <div className="liquidity normal-text">{text}</div>
  },
  {
    title: Title('Volume (24h)', '', true),
    dataIndex: 'volume',
    key: 'volume',
    width: '12%',
    render: (text) => <div className="volume normal-text">{text}</div>
  }
]
