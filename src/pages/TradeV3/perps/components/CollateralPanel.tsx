/* eslint-disable */
import { FC, useMemo, useState } from 'react'
import { Row, Col } from 'antd'
import tw, { styled } from 'twin.macro'
import { Tooltip } from '../../../../components/Tooltip'
import { useTraderConfig } from '../../../../context/trader_risk_group'
import { PERPS_FEES } from '../perpsConstants'
import { useWallet } from '@solana/wallet-adapter-react'
import { useCrypto, useDarkMode } from '../../../../context'
import useWindowSize from '../../../../utils/useWindowSize'

const TABS_WRAPPER = styled.div<{ $isLocked: boolean }>`
  .header-wrapper {
    display: flex;
    height: 30px;

    > div {
      width: 34%;
      height: 100%;
    }

    .disable {
      cursor: not-allowed;
    }
  }
  .tab {
    border: ${({ theme }) => '1px solid ' + theme.tokenBorder};
    border-top: none;
    cursor: pointer;
  }
  .active {
    ${tw`text-[#3C3C3C] dark:text-[#EEEEEE]`}
    background: linear-gradient(94deg, #f7931a 0%, #ac1cc7 100%);
    padding: 2px;
  }
  .white-background {
    background-color: ${({ theme }) => theme.bg2};
    width: 100%;
    height: 100%;
  }
  .activeTab {
    background-image: linear-gradient(to right, rgba(247, 147, 26, 0.4) 0%, rgba(172, 28, 199, 0.4) 100%);
  }
  .field {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    font-weight: 600;
    height: 100%;
  }
  ${tw`h-full w-full relative overflow-y-hidden`}
  filter: blur(${({ $wallet }) => ($wallet ? 0 : 3)}px) !important;
  border: ${({ theme }) => '1px solid ' + theme.tokenBorder};
`

const WRAPPER = styled.div<{ $height: boolean }>`
  padding: ${({ $height }) => ($height > 900 ? '20px 15px' : '8px 15px')};
  .coin-icon {
    ${tw`mr-2.5`}
  }
  .heart-icon {
    ${tw`ml-2`}
  }
  .tooltipIcon {
    ${tw`!w-3.5 !h-3.5 ml-0 cursor-pointer`}
  }
  .health-icon {
    ${tw`flex items-center`}
  }
  .bar-holder {
    ${tw`flex`}
  }
  .bars {
    ${tw`h-5 w-1.5 mr-2.5 inline-block rounded-[15px] `}
  }
  .bars:last-child {
    ${tw`mr-4`}
  }
  .green {
    ${tw`bg-[#71C25D]`}
  }
  .red {
    ${tw`bg-[#F06565]`}
  }
  .greenText {
    ${tw`!text-[#71C25D]`}
  }
  .redText {
    ${tw`!text-[#F06565]`}
  }
  .yellow {
    ${tw`bg-[#F0B865]`}
  }
  .gray {
    background: ${({ theme }) => theme.bg24};
  }
  .separator {
    ${tw`mb-3.75 border-b-[5px] border-dashed border-[#4a4a4a]`}
  }
`

const ACCOUNT_ROW = styled.div<{ $height: boolean }>`
  ${tw`flex flex-row justify-between items-start`}
  margin-bottom: ${({ $height }) => ($height > 900 ? '18px' : '16px')};
  line-height: normal;
  .key {
    ${tw`text-tiny font-semibold text-[#636363] dark:text-[#B5B5B5]`}
  }
  .value {
    ${tw`text-tiny font-semibold text-[#3C3C3C] dark:text-[#EEEEEE]`}
  }
  .balances {
    ${tw`text-right`}
    > div {
      ${tw`text-right mb-[2px]`}
    }
  }
  .positive {
    color: green;
    ${tw`text-regular font-black`}
  }
  .negative {
    color: red;
    ${tw`text-regular font-black`}
  }
  .tooltip-row {
    display: flex;
    align-items: center;
  }
`

const FEES = styled.div<{ $height: boolean }>`
  padding: ${({ $height }) => ($height > 900 ? '20px' : '4px 20px')};
  .tier-info {
    ${tw`text-center mb-2`}
    line-height: normal;
    margin-bottom: ${({ $height }) => ($height > 900 ? '12px' : '8px')};
  }
  .spacing {
    ${tw`mb-1`}
  }
  .value {
    ${tw`text-tiny font-semibold`}
    color: ${({ theme }) => theme.text37};
  }
  .tier {
    ${tw`text-tiny font-semibold mb-[5px]`}
    color: ${({ theme }) => theme.text11};
    > span {
      ${tw`text-tiny font-semibold`}
      background: -webkit-linear-gradient(96.79deg, #f7931a, #dc1fff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .disclaimer {
    ${tw`text-[9px] font-medium mb-2 text-gray-2`}
  }
`

const Accounts: FC<{ isSolAccount: boolean }> = ({ isSolAccount }) => {
  const { collateralInfo, traderInfo, activeProduct } = useTraderConfig()
  const { mode } = useDarkMode()
  const { height } = useWindowSize()
  const { getAskSymbolFromPair, selectedCrypto } = useCrypto()

  const ask = useMemo(() => getAskSymbolFromPair(selectedCrypto.pair), [getAskSymbolFromPair, selectedCrypto.pair])

  const currentMarketBalance: string = useMemo(() => {
    let balance = '0'
    traderInfo?.balances?.map((item) => {
      if (item.productKey.toBase58() === activeProduct.id) {
        balance = item.balance
      }
    })
    return balance + ' ' + ask
  }, [traderInfo, activeProduct])

  const pnl = useMemo(() => {
    if (traderInfo.pnl === '0' || !Number(traderInfo.pnl)) return <span>0.00</span>
    const isNegative = traderInfo.pnl[0] === '-'
    return (
      <span className={isNegative ? 'redText' : 'greenText'}>
        {(!isNegative ? '+' : '') + Number(traderInfo.pnl).toFixed(2)} $
      </span>
    )
  }, [traderInfo])

  const accountHealth = useMemo(() => {
    const health = Number(traderInfo.health)
    if (health) return health
    return 100
  }, [traderInfo.health])

  const getHealthData = () => {
    const percent = accountHealth
    let barColour = ''
    if (percent <= 20) barColour = 'red'
    else if (percent > 20 && percent <= 80) barColour = 'yellow'
    else barColour = 'green'
    return (
      <div className="bar-holder">
        <span>
          {[0, 20, 40, 60, 80].map((item, index) => (
            <div key={index} className={percent <= item ? 'bars gray' : `bars ${barColour}`}></div>
          ))}
        </span>
        <span className="value">{percent}%</span>
      </div>
    )
  }

  return (
    <WRAPPER $height={height}>
      <ACCOUNT_ROW $height={height}>
        <div className="health-icon">
          <span className="key">Health</span>
          <img src="/img/assets/heart-red.svg" alt="heart-icon" width="19" height="17" className="heart-icon" />
          <Tooltip color={mode === 'dark' ? '#EEEEEE' : '#1C1C1C'}>
            The health bar shows how close you are to being liquidated.{' '}
          </Tooltip>
        </div>
        {getHealthData()}
      </ACCOUNT_ROW>
      {/* <ACCOUNT_ROW $height={height}>
        <div className="tooltip-row">
          <span className="key">{isSolAccount ? 'Balance' : 'Balances'}</span>
          <Tooltip color={mode === 'dark' ? '#EEEEEE' : '#1C1C1C'}>
              The health bar shows how close you are to being liquidated.{' '}
          </Tooltip>
        </div>
        {isSolAccount ? (
          <span className="value">{currentMarketBalance}</span>
        ) : (
          <div className="balances value">
            <div>${(Number(traderInfo.collateralAvailable) * Number(collateralInfo.price)).toFixed(2)}</div>
            <div>0.3344 BTC</div>
            <span className="value">1,888.55 USDC</span>
          </div>
        )}
      </ACCOUNT_ROW> */}
      <ACCOUNT_ROW $height={height}>
        <div className="tooltip-row">
          <span
            className={
              (traderInfo && traderInfo.pnl && Number(traderInfo.pnl)
                ? traderInfo.pnl[0] === '-'
                  ? 'redText '
                  : 'greenText '
                : ' ') + 'key '
            }
          >
            Unrealized P&L
          </span>
          <Tooltip color={mode === 'dark' ? '#EEEEEE' : '#1C1C1C'}>
            The total profit and loss from your positions in your account{' '}
          </Tooltip>
        </div>
        <span className="value">{pnl}</span>
      </ACCOUNT_ROW>
      <ACCOUNT_ROW $height={height}>
        <div className="tooltip-row">
          <span className="key">Balance</span>
          <Tooltip color={mode === 'dark' ? '#EEEEEE' : '#1C1C1C'}>
            Balance refers to the total value of your cash balance that you can use as collateral for opening new
            positions or maintaining existing ones.{' '}
          </Tooltip>
        </div>
        <span className="value">{Number(traderInfo.collateralAvailable).toFixed(2)} $</span>
      </ACCOUNT_ROW>
      <ACCOUNT_ROW $height={height}>
        <div className="tooltip-row">
          <span className="key">Margin Available</span>
          <Tooltip color={mode === 'dark' ? '#EEEEEE' : '#1C1C1C'}>
            Margin Available is the amount of funds available in your account that can be used to open new
            positions or increase your position size. This is calculated based on your Balance and the margin
            requirements for the specific assets you are trading{' '}
          </Tooltip>
        </div>
        <span className="value">{Number(traderInfo.marginAvailable).toFixed(2)} $</span>
      </ACCOUNT_ROW>
      {isSolAccount && (
        <ACCOUNT_ROW $height={height}>
          <div className="tooltip-row">
            <span className="key">{ask + ' Liquidation Price'}</span>
            <Tooltip color={mode === 'dark' ? '#EEEEEE' : '#1C1C1C'}>
              The Liquidation Price is the price at which your position will be automatically closed out by the
              trading platform if your margin falls below a certain threshold. The Liquidation Price is calculated
              based on the current market price, your position size, and the margin requirements for the specific
              assets you are trading.{' '}
            </Tooltip>
          </div>
          <span className="value">{Number(traderInfo.liquidationPrice).toFixed(2)} $</span>
        </ACCOUNT_ROW>
      )}
    </WRAPPER>
  )
}

const Fees = () => {
  const feesInfo = PERPS_FEES
  const currentTier = feesInfo[1]
  const { height } = useWindowSize()
  return (
    <FEES $height={height}>
      <div className="tier">
        My current tier:{' '}
        <span>
          {currentTier.taker} Taker / {currentTier.maker} Maker
        </span>
      </div>
      <div className="disclaimer">*Disclaimer: Perps fees for GooseFx are subject to change.</div>
      {feesInfo &&
        feesInfo.map((item, index) => (
          <Row key={index}>
            <Col className={index === 0 ? 'spacing value' : 'value'} span={4}>
              {item.tier}
            </Col>
            <Col className={index === 0 ? 'spacing tier-info value' : 'tier-info value'} span={12}>
              {item.stake}
            </Col>
            <Col className={index === 0 ? 'spacing tier-info value' : 'tier-info value'} span={4}>
              {item.taker}
            </Col>
            <Col className={index === 0 ? 'spacing tier-info value' : 'tier-info value'} span={4}>
              {item.maker}
            </Col>
          </Row>
        ))}
    </FEES>
  )
}

export const CollateralPanel: FC = (): JSX.Element => {
  const { wallet } = useWallet()
  const tabs = ['SOL Account', 'All Accounts', 'Fees']
  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <TABS_WRAPPER $wallet={wallet}>
        <div className="header-wrapper">
          {tabs.map((item, index) => (
            <div
              key={index}
              className={index === activeTab ? 'active tab' : index === 1 ? 'tab disable' : 'tab'}
              onClick={
                index === 1
                  ? () => {
                      null
                    }
                  : () => setActiveTab(index)
              }
            >
              <div className="white-background">
                <div className={index === activeTab ? 'field activeTab' : 'field'}>{item}</div>
              </div>
            </div>
          ))}
        </div>
        {activeTab === 0 ? (
          <Accounts isSolAccount={true} />
        ) : activeTab === 1 ? (
          <Accounts isSolAccount={false} />
        ) : activeTab === 2 ? (
          <Fees />
        ) : null}
      </TABS_WRAPPER>
    </>
  )
}
