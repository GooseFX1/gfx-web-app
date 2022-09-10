import React, { FC } from 'react'
import styled from 'styled-components'
import { Tooltip } from '../../components/Tooltip'
import { moneyFormatter } from '../../utils/math'
import { Skeleton } from 'antd'
import tw from 'twin.macro'

export const STYLED_TITLE = styled.div`
  ${tw`flex flex-row items-center justify-center`}
  .textTitle {
    ${tw`sm:font-semibold sm:text-base sm:text-white text-tiny font-medium text-left text-white`}
    font-family: Montserrat;
  }
  .info-icon {
    ${tw`w-[15px] h-auto block ml-2`}
  }
  .arrow-down {
    ${tw`sm:w-[17px] sm:h-[7px] w-[14px] h-auto block ml-2`}
  }
`

export const STYLED_NAME = styled.div`
  ${tw`flex items-center`}
  .textName {
    ${tw`text-regular font-semibold max-w-[90px] ml-5 sm:ml-3.75`}
    color: ${({ theme }) => theme.text8};
  }
  .coin-image {
    ${tw`w-[41px] h-[41px] block`}
    &.double-sided {
      ${tw`w-[91px]`}
    }
  }
  .percent-100 {
    ${tw`w-9 h-auto block ml-5`}
  }
`

export const STYLED_EARNED = styled.div`
  ${tw`text-[17px] font-semibold text-[#b1b1b1] text-center`}
  font-family: Montserrat;
`

const ICON_WRAPPER = styled.div`
  ${tw`flex flex-col items-center`}

  .arrow-down {
    filter: ${({ theme }) => theme.filterArrowDown};
  }
`

const RefreshIcon = styled.a`
  ${tw`cursor-pointer mr-[25px] ml-10 rounded-full border-0 p-0 bg-transparent flex`}
`

export const Loader: FC = () => (
  <Skeleton.Button active size="small" style={{ display: 'flex', height: '15px', borderRadius: '5px' }} />
)

export const HeaderTooltip = (text: string) =>
  <img className="info-icon" src={`/img/assets/info-icon.svg`} alt="" /> && (
    <Tooltip dark placement="bottomLeft" color="#000000">
      <span>{text}</span>
    </Tooltip>
  )

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
    render: (text) => (
      <div className="liquidity normal-text"> {text >= 0 ? `${moneyFormatter(text)}` : <Loader />}</div>
    )
  },
  {
    title: Title(
      'Total Earned',
      `The total profit and loss from SSL and is measured by comparing the total value of a pool’s assets (
        excluding trading fees) to their value if they had not been traded and instead were just held`,
      true
    ),
    dataIndex: 'earned',
    key: 'earned',
    width: '16.6%',
    render: (text) => (
      <div className="liquidity normal-text">{text !== undefined ? `${moneyFormatter(text)}` : <Loader />}</div>
    )
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
      <RefreshIcon href="/farm">
        <img style={{ display: 'block', margin: 'auto' }} src={'/img/assets/refresh.svg'} alt="refresh" />
      </RefreshIcon>
    ),
    dataIndex: 'apr',
    key: 'apr',
    width: '30%',
    render: () => (
      <ICON_WRAPPER>
        <img className="arrow-down" src={`/img/assets/arrow-down-large.svg`} alt="arrow" />
      </ICON_WRAPPER>
    )
  }
]
