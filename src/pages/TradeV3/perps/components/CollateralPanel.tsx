import { FC, useMemo } from 'react'
import { Tabs, Row, Col } from 'antd'
import tw, { styled } from 'twin.macro'
import { Tooltip } from '../../../../components/Tooltip'
import { useTraderConfig } from '../../../../context/trader_risk_group'
import { PERPS_FEES } from '../perpsConstants'
import { useWallet } from '@solana/wallet-adapter-react'
import { useCrypto, useDarkMode } from '../../../../context'
import useWindowSize from '../../../../utils/useWindowSize'

const { TabPane } = Tabs

const TABS_WRAPPER = styled.div<{ $isLocked: boolean }>`
  ${tw`h-full w-full relative overflow-y-hidden`}
  filter: blur(${({ $wallet }) => ($wallet ? 0 : 3)}px) !important;
  border-right: ${({ theme }) => '1px solid ' + theme.tokenBorder};
  border-bottom: ${({ theme }) => '1px solid ' + theme.tokenBorder};
  border-left: ${({ theme }) => '1px solid ' + theme.tokenBorder};
  .ant-tabs-nav {
    ${tw`mb-0`}
  }
  .ant-tabs-nav-list {
    ${tw`w-full items-center h-[31px]`}
    background: ${({ theme }) => theme.bg20};
    .ant-tabs-tab-active {
      ${tw`!p-px !border-none !border-0`}
      background: linear-gradient(96deg, #f7931a 1%, #ac1cc7 99%);
      .ant-tabs-tab-btn {
        ${tw`text-[#3C3C3C] dark:text-[#EEEEEE]`}
      }
    }
    .ant-tabs-tab-btn {
      ${tw`text-tiny font-semibold h-full w-full flex justify-center items-center text-[#636363] dark:text-[#B5B5B5]`}
      background: ${({ theme }) => theme.bg20};
    }
    .ant-tabs-tab {
      ${tw`w-1/3 block text-center m-0 h-full flex justify-center items-center p-0`}
      border: 1px solid ${({ theme }) => theme.rowSeparator};
    }
    .ant-tabs-ink-bar {
      ${tw`hidden`}
    }
  }
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
    ${tw`w-4 h-4 ml-0 cursor-pointer`}
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
  margin-bottom: ${({ $height }) => ($height > 900 ? '18px' : '12px')};
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
`

const FEES = styled.div<{ $height: boolean }>`
  padding: ${({ $height }) => ($height > 900 ? '20px' : '8px 20px')};
  .tier-info {
    ${tw`text-center mb-2`}
    line-height: normal;
    margin-bottom: ${({ $height }) => ($height > 900 ? '14px' : '10px')};
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
    ${tw`text-[9px] font-medium mb-3 text-gray-2`}
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

  const getHealthData = () => {
    //DELETE: hardcoded percent
    const percent = 31
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
            The heath graph represents, how close you are to be liquidated.{' '}
          </Tooltip>
        </div>
        {getHealthData()}
      </ACCOUNT_ROW>
      <ACCOUNT_ROW $height={height}>
        <span className="key">{isSolAccount ? 'Balance' : 'Balances'}</span>
        {isSolAccount ? (
          <span className="value">{currentMarketBalance}</span>
        ) : (
          <div className="balances value">
            <div>${(Number(traderInfo.collateralAvailable) * Number(collateralInfo.price)).toFixed(2)}</div>
            <div>0.3344 BTC</div>
            <span className="value">1,888.55 USDC</span>
          </div>
        )}
      </ACCOUNT_ROW>
      <ACCOUNT_ROW $height={height}>
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
        <span className="value">{pnl}</span>
      </ACCOUNT_ROW>
      <ACCOUNT_ROW $height={height}>
        <span className="key">Collateral Available</span>
        <span className="value">{Number(traderInfo.collateralAvailable).toFixed(2)} $</span>
      </ACCOUNT_ROW>
      <ACCOUNT_ROW $height={height}>
        <span className="key">Margin Available</span>
        <span className="value">{Number(traderInfo.marginAvailable).toFixed(2)} $</span>
      </ACCOUNT_ROW>
      {isSolAccount && (
        <ACCOUNT_ROW $height={height}>
          <span className="key">{ask + ' Liquidation Price'}</span>
          <span className="value">100%</span>
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
  return (
    <>
      <TABS_WRAPPER $wallet={wallet}>
        <Tabs defaultActiveKey={'1'}>
          <TabPane tab="SOL Account" key="1">
            <Accounts isSolAccount={true} />
          </TabPane>
          <TabPane tab="All Accounts" key="2">
            <Accounts isSolAccount={false} />
          </TabPane>
          <TabPane tab="Fees" key="3">
            <Fees />
          </TabPane>
        </Tabs>
      </TABS_WRAPPER>
    </>
  )
}
