import React, { FC } from 'react'
import styled from 'styled-components'
import { Tooltip } from '../../components/Tooltip'
import { moneyFormatter, moneyFormatterWithComma } from '../../utils/math'
import { Skeleton } from 'antd'
import tw from 'twin.macro'
import { IFarmData } from './CustomTableList'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connect } from '../../layouts/App/Connect'
import { RefreshBtnWithAnimation } from './FarmFilterHeader'
const DISPLAY_DECIMAL = 3

const DEPOSIT_BTN = styled.button`
  ${tw`h-8 w-32 text-white rounded-3xl border-none font-semibold`}
  font-size: 15px;
  background: #5855ff;
  @media (max-width: 500px) {
    ${tw`h-7 w-20 absolute -ml-20 -mt-0.5`}
  }
`

export const STYLED_TITLE = styled.div`
  ${tw`flex flex-row items-center justify-center`}
  .textTitle {
    ${tw`font-semibold text-base text-white`}
  }
  .info-icon {
    ${tw`w-[15px] h-auto block ml-2`}
  }
  .arrowDown {
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
  border: 1px solid;
  ${tw`flex flex-col items-end h-10 w-20`}
  .arrowDown {
    cursor: pointer;
    filter: ${({ theme }) => theme.filterArrowDown};
  }
`
const ICON_WRAPPER_TD = styled.td`
  cursor: pointer;
  filter: ${({ theme }) => theme.filterArrowDown};
  .invertArrow {
    transform: rotate(180deg);
  }
  @media (max-width: 500px) {
    width: 30%;
    img {
      ${tw`mt-1.5 ml-3 absolute`}
    }
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
    {isArrowDown && <img className="arrowDown" src={`/img/assets/arrow-down.svg`} alt="" />}
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
const TotalEarnedTooltip = `The total profit and loss from SSL and is measured by comparing the total 
value of a pool’s assets (excluding trading fees) to their value if they had not been traded and instead were just held`

const APRTooltip = 'Yearly deposit earned on your deposit.'
const LiquidityTooltip = "Total value of funds in this farm's liquidity pool."

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
        <img className="arrowDown" src={`/img/assets/arrow-down-large.svg`} alt="arrow" />
      </ICON_WRAPPER>
    )
  }
]

const DepositButton = () => <DEPOSIT_BTN>Deposit</DEPOSIT_BTN>

export const ColumnWeb: FC<{ farm: IFarmData; setIsOpen: any; isOpen: boolean; index: number }> = ({
  farm,
  setIsOpen,
  isOpen,
  index
}) => {
  const { name, earned, currentlyStaked, apr, volume, liquidity } = farm
  const { publicKey } = useWallet()
  const showConnect = index === 0

  return (
    <>
      <td className="nameColumn">
        <div>
          <img src={`/img/crypto/${name.toUpperCase()}.svg`} />
        </div>
        <div className="columnText">{name}</div>
      </td>
      {!publicKey ? (
        <td className={showConnect ? 'balanceConnectWallet' : 'balanceColumn'}>
          {showConnect ? <Connect /> : '----'}
        </td>
      ) : (
        <td className="balanceColumn">
          {currentlyStaked === 0 ? (
            <DepositButton />
          ) : currentlyStaked !== undefined ? (
            currentlyStaked?.toFixed(DISPLAY_DECIMAL)
          ) : (
            <Loader />
          )}
        </td>
      )}
      <td className="earnedColumn">
        {!publicKey ? '----' : earned !== undefined ? moneyFormatter(earned) : <Loader />}
      </td>
      <td className="tableData">
        {
          //@ts-ignore
          apr === '-' ? '-' : apr !== undefined ? `${parseFloat(apr)?.toFixed(0)}%` : <Loader />
        }
      </td>
      <td className="tableData">
        {liquidity !== undefined ? moneyFormatterWithComma(farm.liquidity, '$') : <Loader />}
      </td>
      <td className="volumeColumn">
        {
          //@ts-ignore
          volume === '-' ? '-' : volume >= 0 ? moneyFormatterWithComma(parseFloat(volume), '$') : <Loader />
        }
      </td>
      <ICON_WRAPPER_TD onClick={() => publicKey && setIsOpen((prev) => !prev)}>
        <img className={isOpen ? 'invertArrow' : ''} src={`/img/assets/arrow-down-large.svg`} alt="arrow" />
      </ICON_WRAPPER_TD>
    </>
  )
}

export const ColumnHeadersWeb = () => (
  <>
    <th className="borderRow">Name</th>
    <th>{Title('Deposited', '', false)}</th>
    <th>{Title('Total earned', TotalEarnedTooltip, false)}</th>
    <th>{Title('APR', APRTooltip, false)}</th>
    <th>{Title('Liquidity', LiquidityTooltip, false)}</th>
    <th style={{ paddingRight: '40px' }}>{Title('7d volume', '', false)}</th>
    <th className="borderRow2"></th>
  </>
)

export const ColumnHeadersMobile = () => (
  <>
    <th className="borderRow">Name</th>
    <th>{Title('APR', APRTooltip, false)}</th>
    <th className="borderRow2">
      <RefreshBtnWithAnimation />
    </th>
  </>
)
export const ColumnMobile: FC<{ farm: IFarmData; setIsOpen: any; isOpen: boolean; index: number }> = ({
  farm,
  setIsOpen,
  isOpen
}) => {
  const { name, currentlyStaked, apr } = farm
  const { publicKey } = useWallet()

  return (
    <>
      <td className="nameColumn">
        <div>
          <img src={`/img/crypto/${name.toUpperCase()}.svg`} />
        </div>
        <div className="columnText">{name}</div>
      </td>
      <td className="tableData">
        {
          //@ts-ignore
          apr === '-' ? '-' : apr !== undefined ? `${parseFloat(apr)?.toFixed(0)}%` : <Loader />
        }
      </td>
      <ICON_WRAPPER_TD onClick={() => publicKey && setIsOpen((prev) => !prev)}>
        {!currentlyStaked && <DepositButton />}
        <img className={isOpen ? 'invertArrow' : ''} src={`/img/assets/arrow-down-large.svg`} alt="arrow" />
      </ICON_WRAPPER_TD>
    </>
  )
}
