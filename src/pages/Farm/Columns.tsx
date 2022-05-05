import React from 'react'
import styled from 'styled-components'
import { Tooltip } from '../../components/Tooltip'
import { moneyFormatter, nFormatter } from '../../utils/math'

export const STYLED_TITLE = styled.div`
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
    margin-left: ${({ theme }) => theme.margin(1)};
  }

  .arrow-down {
    width: 14px;
    height: auto;
    display: block;
    margin-left: ${({ theme }) => theme.margin(1)};
  }
`

export const STYLED_NAME = styled.div`
  display: flex;
  align-items: center;
  .text {
    font-size: 18px;
    font-weight: 600;
    color: ${({ theme }) => theme.text8};
    max-width: 90px;
    margin-left: ${({ theme }) => theme.margin(2.5)};
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
    margin-left: ${({ theme }) => theme.margin(2.5)};
  }
`

export const STYLED_EARNED = styled.div`
  font-family: Montserrat;
  font-size: 17px;
  font-weight: 600;
  color: #b1b1b1;
  text-align: center;
`

const HeaderTooltip = (text: string) => {
  return (
    <img className="info-icon" src={`/img/assets/info-icon.svg`} alt="" /> && (
      <Tooltip dark placement="bottomLeft" color="#000000">
        <span>{text}</span>
      </Tooltip>
    )
  )
}

const Title = (text: string, infoText: string, isArrowDown: boolean) => (
  <STYLED_TITLE>
    <div className="text">{text}</div>
    {infoText && HeaderTooltip(infoText)}
    {isArrowDown && <img className="arrow-down" src={`/img/assets/arrow-down.svg`} alt="" />}
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
          src={`/img/crypto/${text.replace(' ', '-')}.svg`}
          alt=""
        />
        <div className="text">{text}</div>
      </STYLED_NAME>
    )
  },
  {
    title: Title('Balance', '', true),
    dataIndex: 'currentlyStaked',
    key: 'Balance',
    width: '20%',
    render: (text) => {
      return <div className="liquidity normal-text"> {text ? `${moneyFormatter(text)}` : 0.0}</div>
    }
  },
  {
    title: Title(
      'Total Earned',
      'The total profit and loss from SSL and is measured by comparing the total value of a pool’s assets (excluding trading fees) to their value if they had not been traded and instead were just held',
      true
    ),
    dataIndex: 'earned',
    key: 'earned',
    width: '20%',
    render: (text) => <div className="liquidity normal-text">{text ? `${moneyFormatter(text)}` : 0.0}</div>
  },
  {
    title: Title('APR', 'Yearly deposit earned on your deposit.', true),
    dataIndex: 'apr',
    key: 'apr',
    width: '20%',
    render: (text) => <div className="apr normal-text">{`${text.toFixed(0)}%`}</div>
  },
  {
    title: Title('Liquidity', "Total value of funds in this farm's liquidity pool.", true),
    dataIndex: 'liquidity',
    width: '20%',
    key: 'liquidity',
    render: (text) => <div className="liquidity normal-text">{text ? `$ ${moneyFormatter(text)}` : 0.0}</div>
  }
]
