import React, { FC, ReactElement } from 'react'

import { match, Pattern } from 'ts-pattern'
import { Tooltip } from '../../components/Tooltip'
import { moneyFormatter, moneyFormatterWithComma } from '../../utils/math'
import { Skeleton } from 'antd'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { IFarmData } from './CustomTableList'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connect } from '../../layouts'
import { RefreshBtnWithAnimation } from './FarmFilterHeader'
import { useDarkMode } from '../../context'
import { nFormatter, ConditionalData } from '../../utils'
const DISPLAY_DECIMAL = 3

interface Column {
  sortColumn: string
  setSortColumn: React.Dispatch<React.SetStateAction<string>>
}

// TEMP_DEP_DISABLE const DEPOSIT_BTN = styled.button`
//   ${tw`h-[34px] w-[130px] -mt-3 text-white rounded-3xl border-none font-semibold`}
//   font-size: 15px;
//   background: #5855ff;
//   @media (max-width: 500px) {
//     ${tw`h-7 w-[90px] -mt-0.5`}
//     margin-left: -5.5rem;
//   }
// `
export const STYLED_TITLE = styled.div`
  ${tw`flex flex-row items-center justify-center`}
  .textTitle {
    ${tw`font-semibold text-base text-white`}
    text-transform: capitalize;
  }
  .info-icon {
    ${tw`w-[20px] h-[20px] block ml-2`}
  }
  .arrowDown {
    ${tw`sm:w-[17px] cursor-pointer sm:h-[7px] w-[17px] h-[7px] ml-[10px] duration-500`}
  }
  .invert {
    transform: rotate(180deg);
    transition: transform 500ms ease-out;
  }
  .tooltipIcon {
    margin-right: 8px;
  }
`

export const STYLED_NAME = styled.div`
  ${tw`flex items-center`}
  .textName {
    ${tw`text-regular font-semibold max-w-[90px] ml-5 sm:ml-3.75`}
    color: ${({ theme }) => theme.text4};
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

const ICON_WRAPPER_TD = styled.td`
  cursor: pointer;
  .invertArrow {
    transform: rotate(180deg);
    transition: transform 500ms ease-out;
  }
  .dontInvert {
    transition: transform 500ms ease-out;
  }
  @media (max-width: 500px) {
    width: 33%;
    img {
      transition: transform 500ms ease-out;
      ${tw`mt-1.5 ml-3 absolute`}
    }
  }
`

export const Loader: FC = () => (
  <Skeleton.Button
    active
    size="small"
    style={{ display: 'flex', height: '15px', width: '25px', borderRadius: '5px' }}
  />
)
export const LoaderForImg: FC = () => (
  <Skeleton.Button
    active
    size="small"
    style={{ height: '47px', marginRight: '10px', width: '40px', borderRadius: '100%' }}
  />
)

export const HeaderTooltip: FC<{ text: string }> = ({ text }): JSX.Element => {
  const { mode } = useDarkMode()
  return (
    <img className="info-icon" src={`/img/assets/info-icon.svg`} alt="" /> && (
      <Tooltip dark placement="bottomLeft" color={mode === 'dark' ? '#eeeeee' : '#000'}>
        <span>{text}</span>
      </Tooltip>
    )
  )
}

export const GenericTooltip: FC<{ text: string; children?: any }> = ({ text, children }): JSX.Element => {
  const { mode } = useDarkMode()
  if (children)
    return (
      <Tooltip dark title={text} infoIcon={false} color={mode === 'dark' ? '#eeeeee' : '#000'}>
        {children}
      </Tooltip>
    )
  return (
    <img className="info-icon" src={`/img/assets/info-icon.svg`} alt="" /> && (
      <Tooltip dark placement="bottomLeft" infoIcon={true} color={mode === 'dark' ? '#eeeeee' : '#000'}>
        <span>{text}</span>
      </Tooltip>
    )
  )
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const Title = (text: string, infoText: string, isArrowDown: boolean, invert?: boolean) => (
  <STYLED_TITLE>
    <div className="textTitle">{text}</div>
    {infoText && <HeaderTooltip text={infoText} />}
    {isArrowDown && (
      <img className={'arrowDown' + (invert ? ' invert' : '')} src={`/img/assets/arrow-down.svg`} alt="" />
    )}
  </STYLED_TITLE>
)

export const columns = [
  {
    title: Title('Name', '', true),
    dataIndex: 'name',
    key: 'name',
    width: '15',
    render: (text, record): JSX.Element => (
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
    render: (text): JSX.Element => (
      <div className="liquidity normal-text"> {text >= 0 ? `${moneyFormatter(text)}` : <Loader />}</div>
    )
  },
  {
    title: Title('Total Earned', `Yearly amount earned on your deposit.`, true),
    dataIndex: 'earned',
    key: 'earned',
    width: '16.6%',
    render: (text): JSX.Element => (
      <div className="liquidity normal-text">{text !== undefined ? `${moneyFormatter(text)}` : <Loader />}</div>
    )
  },
  {
    title: Title(
      'APY',
      `The total profit and loss from SSL 
    and is measured by comparing the total value of a pool's assets
     ( excluding trading fees) to their value if they had not been traded and instead were just held`,
      true
    ),
    dataIndex: 'apr',
    key: 'apr',
    width: '16.6%',
    render: (text): JSX.Element => (
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
    render: (text): JSX.Element => (
      <div className="liquidity normal-text">{text >= 0 ? `$ ${moneyFormatter(text)}` : <Loader />}</div>
    )
  },
  {
    title: Title('7D volume', '', true),
    dataIndex: 'volume',
    width: '16.6%',
    key: 'volume',
    render: (text): JSX.Element => (
      <div className="liquidity normal-text">
        {text === '-' ? `-` : text >= 0 ? `$ ${moneyFormatter(text)}` : <Loader />}
      </div>
    )
  }
]
const APYTooltip = `The total profit and loss from SSL and is measured by comparing the total 
value of a pool’s assets (excluding trading fees) to their value if they had not been traded and instead were just held`

const TotalEarnedTooltip = 'Total amount earned on your deposit.'
const LiquidityTooltip = "Total value of funds in this farm's liquidity pool."

const displayApr = (data: ConditionalData<number>): ReactElement<any, any> =>
  match(data)
    .with('not-supported', () => <div>'-'</div>)
    .with('loading', () => <Loader />)
    .with(Pattern.number, (value) => <text>{nFormatter(value) + '%'}</text>)
    .exhaustive()

// TEMP_DEP_DISABLE const DepositButton = () => <DEPOSIT_BTN>Deposit</DEPOSIT_BTN>

const DISPLAY_VAR = styled.div`
  ${tw`flex items-center justify-center`}
  .variable {
    cursor: auto !important;
  }
`
const DisplayVariable = ({ data, isOpen }: any) => {
  const preventClose = (event) => {
    isOpen && event.stopPropagation()
  }
  return (
    <DISPLAY_VAR>
      <div className="variable" onClick={preventClose}>
        {data}
      </div>
    </DISPLAY_VAR>
  )
}
export const ColumnWeb: FC<{ farm: IFarmData; isOpen: boolean; index: number }> = ({ farm, isOpen, index }) => {
  const { name, earned, currentlyStaked, apr, volume, liquidity } = farm
  const { wallet } = useWallet()
  const showConnect = index === 0
  // TEMP_DEP_DISABLE const toggle = () => setIsOpen((prev) => !prev)
  const { mode } = useDarkMode()

  const preventClose = (event) => {
    isOpen && event.stopPropagation()
  }

  return (
    <>
      <td className="nameColumn">
        <div onClick={preventClose}>
          <img src={`/img/crypto/${name.toUpperCase()}.svg`} />
        </div>
        <div className="columnText" onClick={preventClose}>
          {name}
        </div>
      </td>
      {!wallet?.adapter?.publicKey ? (
        <td className={showConnect ? 'balanceConnectWallet' : ''}>
          {showConnect ? (
            <div style={{ marginTop: -7 }}>
              <Connect />
            </div>
          ) : (
            '----'
          )}
        </td>
      ) : (
        <td className="balanceColumn">
          {/* TEMP_DEP_DISABLE {currentlyStaked === 0 ? (
            <DEPOSIT_BTN onClick={toggle}>Deposit</DEPOSIT_BTN>
          ) : currentlyStaked !== undefined ? (
            currentlyStaked?.toFixed(DISPLAY_DECIMAL)
          ) : (
            <Loader />
          )} */}
          {currentlyStaked !== undefined ? (
            <DisplayVariable data={currentlyStaked?.toFixed(DISPLAY_DECIMAL)} isOpen={isOpen} />
          ) : (
            <Loader />
          )}
        </td>
      )}
      <td className="earnedColumn">
        {!wallet?.adapter?.publicKey ? (
          '----'
        ) : earned !== undefined ? (
          <DisplayVariable data={moneyFormatter(earned)} isOpen={isOpen} />
        ) : (
          <Loader />
        )}
      </td>
      <td className="tableData">
        {' '}
        <DisplayVariable data={displayApr(apr)} isOpen={isOpen} />
      </td>
      <td className="tableData">
        {liquidity !== undefined ? (
          <DisplayVariable data={moneyFormatterWithComma(farm.liquidity, '$')} isOpen={isOpen} />
        ) : (
          <Loader />
        )}
      </td>
      <td className="volumeColumn">
        {match(volume)
          .with('not-supported', () => '-')
          .with('loading', () => <Loader />)
          .otherwise(() => (
            <DisplayVariable data={moneyFormatterWithComma(volume, '$', 0)} isOpen={isOpen} />
          ))}
      </td>
      <ICON_WRAPPER_TD>
        <img
          className={isOpen ? 'invertArrow' : 'dontInvert'}
          src={`/img/assets/arrow-down-${mode}.svg`}
          alt="arrow"
        />
      </ICON_WRAPPER_TD>
    </>
  )
}

export const ColumnHeadersWeb: FC<Column> = ({ sortColumn, setSortColumn }) => (
  <>
    <th onClick={() => setSortColumn((prev) => (prev !== 'name' ? 'name' : undefined))} className="borderRow">
      {Title('Name', '', true, sortColumn === 'name')}
    </th>
    <th onClick={() => setSortColumn((p) => (p !== 'currentlyStaked' ? 'currentlyStaked' : undefined))}>
      {Title('Deposited', '', true, sortColumn === 'currentlyStaked')}
    </th>
    <th onClick={() => setSortColumn((p) => (p !== 'earned' ? 'earned' : undefined))}>
      {Title('Total earned', TotalEarnedTooltip, true, sortColumn === 'earned')}
    </th>
    <th onClick={() => setSortColumn((p) => (p !== 'apr' ? 'apr' : undefined))}>
      {Title('APY', APYTooltip, true, sortColumn === 'apr')}
    </th>
    <th onClick={() => setSortColumn('liquidity')}>
      {Title('Liquidity', LiquidityTooltip, true, sortColumn === 'liquidity')}
    </th>
    <th
      onClick={() => setSortColumn((p) => (p !== 'volume' ? 'volume' : undefined))}
      style={{ paddingRight: '40px' }}
    >
      {Title('7D volume', '', true, sortColumn === 'volume')}
    </th>
    <th className="borderRow2"></th>
  </>
)

export const ColumnHeadersMobile: FC<Column> = ({ sortColumn, setSortColumn }) => (
  <>
    <th onClick={() => setSortColumn((p) => (p !== 'name' ? 'name' : undefined))} className="borderRow">
      {Title('Name', '', true, sortColumn === 'name')}
    </th>

    <th onClick={() => setSortColumn((p) => (p !== 'apr' ? 'apr' : undefined))}>
      {Title('APY', APYTooltip, true, sortColumn === 'apr')}
    </th>
    <th className="borderRow2">
      <RefreshBtnWithAnimation />
    </th>
  </>
)
export const ColumnMobile: FC<{ farm: IFarmData; isOpen: boolean; index: number }> = ({ farm, isOpen }) => {
  // TEMP_DEP_DISABLE const { name, apr, currentlyStaked } = farm
  const { name, apr } = farm
  const { mode } = useDarkMode()

  return (
    <>
      <td className="nameColumn">
        <div>
          <img src={`/img/crypto/${name.toUpperCase()}.svg`} />
        </div>
        <div className="columnText">{name}</div>
      </td>
      <td className="tableData">{displayApr(apr)}</td>
      <ICON_WRAPPER_TD>
        {/* TEMP_DEP_DISABLE {currentlyStaked === 0 && <DepositButton />} */}
        <img className={isOpen ? 'invertArrow' : ''} src={`/img/assets/arrow-down-${mode}.svg`} alt="arrow" />
      </ICON_WRAPPER_TD>
    </>
  )
}
