import { FC } from 'react'
import { Tabs, Row, Col } from 'antd'
import tw, { styled } from 'twin.macro'
import { Tooltip } from '../../../../components/Tooltip'
import { useTraderConfig } from '../../../../context/trader_risk_group'
import { PERPS_FEES } from '../perpsConstants'
import { useWallet } from '@solana/wallet-adapter-react'
import { useDarkMode } from '../../../../context'

const { TabPane } = Tabs

const TABS_WRAPPER = styled.div<{ $isLocked: boolean }>`
  ${tw`h-full w-full relative`}
  filter: blur(${({ $wallet }) => ($wallet ? 0 : 3)}px) !important;
  border-right: ${({ theme }) => '1px solid ' + theme.tokenBorder};
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
        color: ${({ theme }) => theme.text11};
      }
    }
    .ant-tabs-tab-btn {
      ${tw`text-12 font-semibold h-full w-full flex justify-center items-center`}
      color: ${({ theme }) => theme.text17};
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

const WRAPPER = styled.div`
  ${tw`py-2 px-[15px]`}
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

const ACCOUNT_ROW = styled.div`
  ${tw`flex flex-row justify-between items-start mb-3`}
  line-height: normal;
  .key {
    ${tw`text-tiny font-semibold text-gray-2`}
  }
  .value {
    ${tw`text-tiny font-semibold`}
    color: ${({ theme }) => theme.text28};
  }
  .balances {
    ${tw`text-right`}
    > div {
      ${tw`text-right mb-[2px]`}
    }
  }
`

const FEES = styled.div`
  ${tw`py-2 px-5`}
  .tier-info {
    ${tw`text-center mb-2`}
    line-height: normal;
  }
  .spacing {
    ${tw`mb-1`}
  }
  .value {
    ${tw`text-12 font-semibold`}
    color: ${({ theme }) => theme.text29};
  }
  .tier {
    ${tw`text-12 font-semibold mb-[5px]`}
    color: ${({ theme }) => theme.text11};
    > span {
      ${tw`text-12 font-semibold`}
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
  const { collateralInfo } = useTraderConfig()
  const { mode } = useDarkMode()

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
    <WRAPPER>
      <ACCOUNT_ROW>
        <div className="health-icon">
          <span className="key">Health</span>
          <img src="/img/assets/heart-red.svg" alt="heart-icon" width="19" height="17" className="heart-icon" />
          <Tooltip color={mode === 'dark' ? '#EEEEEE' : '#1C1C1C'}>
            The heath graph represents, how close you are to be liquidated.{' '}
          </Tooltip>
        </div>
        {getHealthData()}
      </ACCOUNT_ROW>
      <ACCOUNT_ROW>
        <span className="key">{isSolAccount ? 'Balance' : 'Balances'}</span>
        {isSolAccount ? (
          <span className="value">
            ${(Number(collateralInfo.balance) * Number(collateralInfo.price)).toFixed(2)}
          </span>
        ) : (
          <div className="balances value">
            <div>${(Number(collateralInfo.balance) * Number(collateralInfo.price)).toFixed(2)}</div>
            <div>0.3344 BTC</div>
            <span className="value">1,888.55 USDC</span>
          </div>
        )}
      </ACCOUNT_ROW>
      <ACCOUNT_ROW>
        <span className="key">Unrealized P&L</span>
        <span className="value">-</span>
      </ACCOUNT_ROW>
      <ACCOUNT_ROW>
        <span className="key">Collateral Available</span>
        <span className="value">{Number(collateralInfo.balance).toFixed(2)}</span>
      </ACCOUNT_ROW>
      <ACCOUNT_ROW>
        <span className="key">SOL/USDC Margin Available</span>
        <span className="value">0.23</span>
      </ACCOUNT_ROW>
      {isSolAccount && (
        <ACCOUNT_ROW>
          <span className="key">SOL/USDC Est. Liq. Price</span>
          <span className="value">100%</span>
        </ACCOUNT_ROW>
      )}
    </WRAPPER>
  )
}

const Fees = () => {
  const feesInfo = PERPS_FEES
  const currentTier = feesInfo[1]
  return (
    <FEES>
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
