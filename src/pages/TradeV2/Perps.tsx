import { FC } from 'react'
import { Tabs } from 'antd'
import { styled } from 'twin.macro'
import { Progress } from 'antd'
import { Tooltip } from '../../components/Tooltip'

const { TabPane } = Tabs

const TABS_WRAPPER = styled.div<{ $isLocked: boolean }>`
  height: 100%;
  width: 100%;
  background: ${({ theme }) => theme.bg9};
  border-radius: 10px;
  filter: blur(${({ $wallet }) => ($wallet ? 0 : 3)}px) !important;

  .ant-tabs-nav {
    margin-bottom: 0;
  }
  .ant-tabs-nav-list {
    width: 100%;
    justify-content: space-around;
    background: #1c1c1c;
    border-radius: 10px;
    height: 60px;

    .ant-tabs-tab-btn {
      color: #505050;
      font-size: 15px;
    }
    .ant-tabs-tab-active {
      .ant-tabs-tab-btn {
        color: white;
        font-size: 15px;
      }
    }
    .ant-tabs-ink-bar {
      display: none;
    }
  }
`

const WRAPPER = styled.div`
  padding: 15px;

  .coin-icon {
    margin-right: 10px;
  }

  .separator {
    border-bottom: 5px dashed #4a4a4a;
    margin-bottom: 15px;
  }
`

const HEALTH = styled.div`
  background: #242424;
  height: 55px;
  border-radius: 10px;
  padding-top: 5px;

  .header {
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      font-size: 13px;
      color: #b8b8b8;
    }

    img {
      height: 15px;
      width: 15px;
    }
  }

  .progress {
    display: flex;
    align-items: center;
    justify-content: space-evenly;

    .progress-bar {
      width: 80%;
    }
  }
`

const ACCOUNT_ROW = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;

  .key {
    color: #e7e7e7;
    font-size: 15px;
    font-weight: 600;
  }
`
const BALANCE_ROW = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;

  .key {
    color: #e7e7e7;
    font-size: 15px;
    font-weight: 600;
  }
  .value {
    color: #b5b5b5;
    font-size: 15px;
  }
`

const COL = styled.div`
  display: flex;
  flex-direction: column;

  .green {
    color: #50bb35;
    font-weight: 600;
  }

  .red {
    color: #f06565;
    font-weight: 600;
  }
`

const Account = () => {
  const percent = 82
  return (
    <WRAPPER>
      <ACCOUNT_ROW>
        <span className="key">Equity</span>
        <span className="key">$11,250</span>
      </ACCOUNT_ROW>
      <ACCOUNT_ROW>
        <span className="key">Leverage</span>
        <span className="key">20.00x</span>
      </ACCOUNT_ROW>
      <ACCOUNT_ROW>
        <span className="key">Collateral Available</span>
        <span className="key">0.20</span>
      </ACCOUNT_ROW>
      <ACCOUNT_ROW>
        <span className="key">BTC/USDC Margin Available</span>
        <span className="key">0.23</span>
      </ACCOUNT_ROW>
      <ACCOUNT_ROW>
        <span className="key">SOL/USDC Est. Liq. Price</span>
        <span className="key">0.23</span>
      </ACCOUNT_ROW>
      <HEALTH>
        <div className="header">
          <span>Health</span>
          <Tooltip>
            The account will be liquidated if Health ratio reaches 0% and will continue until Health is above 0.{' '}
          </Tooltip>
        </div>
        <div className="progress">
          <img src="/img/assets/heart-red.svg" alt="heart-icon" width="19" height="17" />
          <Progress
            className="progress-bar"
            percent={percent}
            type="line"
            strokeColor={
              percent > 80
                ? 'linear-gradient(96.79deg, rgba(80, 187, 53, 0) 4.25%, #50bb35 97.61%)'
                : percent < 80 && percent > 40
                ? 'linear-gradient(96.79deg, rgba(255, 236, 134, 0) 1%, #fce986 76%)'
                : 'linear-gradient(96.79deg, rgba(187, 70, 70, 0) -2%, #bb4646 76%)'
            }
          />
        </div>
      </HEALTH>
    </WRAPPER>
  )
}

const Balances = () => {
  const abc = 'haha'
  console.log(abc)
  return (
    <WRAPPER>
      <div className="separator">
        <img src="/img/crypto/BTC.svg" alt="btc" height="30" width="30" className="coin-icon" />
        <span>Bitcoin (BTC)</span>
        <BALANCE_ROW>
          <COL>
            <div className="key">Balance</div>
            <div className="key">0</div>
          </COL>
          <COL>
            <div className="key">Available Balance</div>
            <div className="key">0</div>
          </COL>
        </BALANCE_ROW>
        <BALANCE_ROW>
          <COL>
            <div className="key">Deposit / Borrow Rates</div>
            <div className="key">
              <span className="green">0.01%</span> / <span className="red">0.03%</span>
            </div>
          </COL>
        </BALANCE_ROW>
      </div>
      <div>
        <img src="/img/crypto/USDC.png" alt="btc" height="30" width="30" className="coin-icon" />
        <span>USD Coin (USDC)</span>
        <BALANCE_ROW>
          <COL>
            <div className="key">Balance</div>
            <div className="key">11,250</div>
          </COL>
          <COL>
            <div className="key">Available Balance</div>
            <div className="key">11,250</div>
          </COL>
        </BALANCE_ROW>
        <BALANCE_ROW>
          <COL>
            <div className="key">Deposit / Borrow Rates</div>
            <div className="key">
              <span className="green">0.15%</span> / <span className="red">1.32%</span>
            </div>
          </COL>
        </BALANCE_ROW>
      </div>
    </WRAPPER>
  )
}
const REWARD_WRAPPER = styled.div`
  padding: 30px;
  .reward-row {
    margin-bottom: 10px;
  }
  .rewards {
    font-size: 15px;
    font-weight: 600;
    color: white;
    margin-right: 8px;
  }
  img {
    height: 20px;
    width: 20px;
  }
  .claimed-gofx {
    font-size: 40px;
    font-weight: bold;
    margin-right: 8px;
    background: -webkit-linear-gradient(89deg, #ea7e00 5%, #f1c52a 111%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .claim-row {
    display: flex;
    align-items: center;
  }
  .claim {
    background: #3735bb;
    width: 80px;
    height: 30px;
    border-radius: 50px;
    border: none;
  }
  .unclaimed {
    margin-top: 10px;
    margin-bottom: 20px;
    color: white;
    font-size: 18px;
    font-weight: 600;
  }
  .earned-gofx {
    font-size: 40px;
    font-weight: bold;
    background: -webkit-linear-gradient(265deg, #9cc034 96%, #49821c 3%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .earned {
    color: white;
    font-size: 18px;
    font-weight: 600;
  }
`

const Rewards = () => {
  const haha = 'shashank'
  console.log(haha)
  return (
    <REWARD_WRAPPER>
      <div className="reward-row">
        <span className="rewards">Rewards</span>
        <img id="logo" src="/img/assets/rewards.svg" alt="Rewards" />
      </div>
      <div className="claim-row">
        <span className="claimed-gofx">10.55</span>
        <button className="claim">Claim</button>
      </div>
      <div className="unclaimed">Unclaimed GOFX</div>
      <div className="earned-gofx">200.457</div>
      <div className="earned">Earned GOFX</div>
    </REWARD_WRAPPER>
  )
}

const Perps: FC<{ wallet: any }> = ({ wallet }) => {
  const abc = 'Sjasjaml'
  console.log(abc)
  return (
    <TABS_WRAPPER $wallet={wallet}>
      <Tabs defaultActiveKey={'1'}>
        <TabPane tab="Account" key="1">
          <Account />
        </TabPane>
        <TabPane tab="Balances" key="2">
          <Balances />
        </TabPane>
        <TabPane tab="Reward" key="3">
          <Rewards />
        </TabPane>
      </Tabs>
    </TABS_WRAPPER>
  )
}

export default Perps
