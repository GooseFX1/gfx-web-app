import React, { FC } from 'react'
import styled from 'styled-components'
import { Tooltip } from '../../components/Tooltip'
import { moneyFormatter, nFormatter } from '../../utils/math'
import { Skeleton } from 'antd'
import tw from 'twin.macro'
 
export const STYLED_TITLE = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  .textTitle{
    ${tw`sm:font-semibold sm:text-base text-tiny font-medium text-left`}
    font-family: Montserrat;
    color: #fff;

    @media(max-width: 500px){
      ${tw`text-[#eee]`}
      line-height: normal;
    }
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
  .textName{
    ${tw`sm:ml-[15px]`}
    font-size: 18px;
    font-weight: 600;
    color: ${({ theme }) => theme.text8};
    max-width: 90px;
    margin-left: ${({ theme }) => theme.margin(2.5)};
    @media(max-width: 500px){
      margin-left: 15px;
    }
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

const ICON_WRAPPER = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .arrow-down{
        filter: ${({ theme }) => theme.filterArrowDown};
  }
`

export const Loader: FC = () => {
  return <Skeleton.Button active size="small" style={{ display: 'flex', height: '15px', borderRadius: '5px' }} />
}
export const HeaderTooltip = (text: string) => {
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
    <div className="textTitle">{text}</div>
    {infoText && HeaderTooltip(infoText)}
    {isArrowDown && <img className="arrow-down" src={`/img/assets/arrow-down.svg`} alt="" />}
  </STYLED_TITLE>
)

export const columns = [
  {
    title: Title('Name', '', true),
    dataIndex: 'name',
    key: 'name',
    width: '15',
    render: (text, record) => (
      <STYLED_NAME>
        <img
          className={`coin-image ${record.type === 'Double Sided' ? 'double-sided' : ''}`}
          src={`/img/crypto/${text?.toUpperCase().replace(' ', '-')}.svg`}
          alt=""
        />
        <div className="textName">{text}</div>
      </STYLED_NAME>
    )
  },
  {
    title: Title('Balance', '', true),
    dataIndex: 'currentlyStaked',
    key: 'Balance',
    width: '16.6%',
    render: (text) => {
      return <div className="liquidity normal-text"> {text >= 0 ? `${moneyFormatter(text)}` : <Loader />}</div>
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
    width: '16.6%',
    render: (text) => <div className="liquidity normal-text">{text >= 0 ? `${moneyFormatter(text)}` : <Loader />}</div>
  },
  {
    title: Title('APR', 'Yearly deposit earned on your deposit.', true),
    dataIndex: 'apr',
    key: 'apr',
    width: '16.6%',
    render: (text) => (
      <div className="apr normal-text">
        {text === '-' ? '-' : text !== undefined ? `${text.toFixed(0)}%` : <Loader />}
      </div>
    )
  },
  {
    title: Title('Liquidity', "Total value of funds in this farm's liquidity pool.", true),
    dataIndex: 'liquidity',
    width: '16.6%',
    key: 'liquidity',
    render: (text) => (
      <div className="liquidity normal-text">{text >= 0 ? `$ ${moneyFormatter(text)}` : <Loader />}</div>
    )
  },
  {
    title: Title('7d Volume', '', true),
    dataIndex: 'volume',
    width: '16.6%',
    key: 'volume',
    render: (text) => (
      <div className="liquidity normal-text">
        {text === '-' ? `-` : text >= 0 ? `$ ${moneyFormatter(text)}` : <Loader />}
      </div>
    )
  }
]

export const mobileColumns = [
  {
    title: Title('Name', '', true),
    dataIndex: 'name',
    key: 'name',
    width: '10%',
    render: (text, record) => (
      <STYLED_NAME>
        <img
          className={`coin-image ${record.type === 'Double Sided' ? 'double-sided' : ''}`}
          src={`/img/crypto/${text.toUpperCase().replace(' ', '-')}.svg`}
          alt=""
        />
        <div className="textName">{text}</div>
      </STYLED_NAME>
    )
  },
  {
    title: Title('APR', 'Yearly deposit earned on your deposit.', true),
    dataIndex: 'apr',
    key: 'apr',
    width: '30%',
    render: (text) => (
      <ICON_WRAPPER>
        <div className="apr normal-text">
          {text === '-' ? '-' : text !== undefined ? `${text.toFixed(0)}%` : <Loader />}
        </div>
      </ICON_WRAPPER>
    )
  },
  {
    title: (
    <a href="/farm">
      <img style={{display: "block", margin: "auto", marginRight: "25%"}}src={'/img/assets/refresh.svg'} />
    </a>
    ),
    dataIndex: 'apr',
    key: 'apr',
    width: '30%',
    render: (text) => (
      <ICON_WRAPPER>
        <img className="arrow-down" src={`/img/assets/arrow-down-large.svg`}/>
      </ICON_WRAPPER>
    )
  },
]