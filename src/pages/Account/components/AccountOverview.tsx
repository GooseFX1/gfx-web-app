import { FC, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { useCrypto, useDarkMode, useOrderBook } from '../../../context'
import { Connect } from '../../../layouts/Connect'
import { useWallet } from '@solana/wallet-adapter-react'
import { ModalHeader, SETTING_MODAL } from '../../TradeV3/InfoBanner'
import { DepositWithdraw } from '../../TradeV3/perps/DepositWithdraw'
import { useTraderConfig } from '../../../context/trader_risk_group'
import { getPerpsPrice } from '../../TradeV3/perps/utils'
import { httpClient } from '../../../api'
import { GET_TRADER_DAY_VOLUME } from '../../TradeV3/perps/perpsConstants'
const WRAPPER = styled.div`
  ${tw`flex flex-col w-full`}
  margin: 15px;
  h1 {
    font-size: 18px;
  }
`

const ACCOUNTVALUESFLEX = styled.div`
  ${tw`flex flex-row flex-wrap gap-x-4`}
  .health-container {
    ${tw`flex items-center`}
    margin-left: auto;
  }

  .health-icon {
    ${tw`flex items-center gap-x-2`}
  }

  .bar-holder {
    ${tw`flex gap-x-2`}
  }
  .bars {
    ${tw`h-5 w-1.5 mr-2.5 inline-block rounded-average`}
  }
  .bars:last-child {
    ${tw`mr-2`}
  }
  .green {
    ${tw`bg-green-2`}
  }
  .red {
    ${tw`bg-red-1`}
  }
`

const ACCOUNTVALUESCONTAINER = styled.div`
  ${tw`w-[190px] rounded-[5px] p-[1px]`}
  background: linear-gradient(94deg, #f7931a 0%, #ac1cc7 100%);
`

const ACCOUNTVALUE = styled.div`
  ${tw`h-full w-full rounded-[5px] flex flex-col  text-tiny font-semibold`}
  color: ${({ theme }) => theme.text28};
  background: #131313;
  padding: 5px;
  p {
    margin: 0px;
    font-size: 13px;
  }
  p:last-child {
    color: #636363;
    font-size: 15px;
  }
`

const ACCOUNTHEADER = styled.div`
    /* ${tw`flex justify-between items-center flex-nowrap w-full`} */
    ${tw`grid grid-cols-4 gap-x-40 items-center w-full`}
    border: 1px solid #3C3C3C;
    border-bottom: none;
    margin-top: 10px;
    span {
        padding-top:10px;
        padding-bottom:10px;
    }
    span:first-child {
      ${tw`pl-3`}
    }
    span:last-child {
      ${tw`pr-16`}
    }
  }
`

const HISTORY = styled.div`
  ${tw`flex w-full h-full`}
  border:1px solid #3C3C3C;

  .no-balances-found {
    max-width: 155px;
    display: flex;
    margin: auto;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .positions {
    ${tw`grid grid-cols-4 gap-x-40 items-center w-full`}
    height: 30px;
    .pair-container {
      ${tw`pl-3`}
    }
    span:last-child {
      ${tw`pr-16`}
    }
    div:first-child {
      ${tw`flex gap-x-1 items-center`}
    }

    img {
      height: 24px;
      width: 24px;
    }
  }

  .no-balances-found > p {
    margin: 0;
    margin-top: 15px;
    margin-bottom: 15px;
    color: #636363;
    font-size: 15px;
    font-weight: 600;
  }

  .deposit {
    background: linear-gradient(97deg, #f7931a 4.25%, #ac1cc7 97.61%);
    border-radius: 70px;
    padding: 3px 18px;
    font-size: 15px;
    font-weight: 600;
  }
`

const columns = ['Asset', 'Balance', 'USD Value', 'Liq.Price']
const AccountOverview: FC = () => {
  const { mode } = useDarkMode()
  const [dayVolume, setDayVolume] = useState<number>(0)

  const [depositWithdrawModal, setDepositWithdrawModal] = useState<boolean>(false)

  const [tradeType, setTradeType] = useState<string>('deposit')
  const { traderInfo } = useTraderConfig()
  const { orderBook } = useOrderBook()
  const { connected } = useWallet()

  const { selectedCrypto, isDevnet, getAskSymbolFromPair } = useCrypto()
  const perpsPrice = useMemo(() => getPerpsPrice(orderBook), [orderBook])
  const notionalSize = useMemo(
    () => (Number(traderInfo.averagePosition.quantity) * perpsPrice).toFixed(3),
    [perpsPrice, traderInfo.averagePosition.quantity, connected]
  )

  const symbol = useMemo(
    () => getAskSymbolFromPair(selectedCrypto.pair),
    [getAskSymbolFromPair, selectedCrypto.pair]
  )
  const assetIcon = useMemo(() => `/img/crypto/${symbol}.svg`, [symbol, selectedCrypto.type])

  const userVolume = useMemo(() => {
    const vol = traderInfo.traderVolume
    if (Number.isNaN(vol)) return '0.00'
    const rounded = (+vol).toFixed(2)
    return rounded
  }, [traderInfo.traderVolume])

  const roundedSize = useMemo(() => {
    const size = Number(traderInfo.averagePosition.quantity)
    if (size) {
      return size.toFixed(3)
    } else return 0
  }, [traderInfo.averagePosition, traderInfo.averagePosition.quantity, connected])

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

  const fetchDayVolume = async () => {
    const res = await httpClient('api-services').get(`${GET_TRADER_DAY_VOLUME}`, {
      params: {
        API_KEY: 'zxMTJr3MHk7GbFUCmcFyFV4WjiDAufDp',
        devnet: isDevnet,
        taker: traderInfo.traderRiskGroupKey.toString()
      }
    })
    setDayVolume(res.data.volume)
  }

  useEffect(() => {
    if (traderInfo.traderRiskGroupKey !== null) {
      fetchDayVolume()
    }
  }, [connected, traderInfo])
  return (
    <WRAPPER>
      {depositWithdrawModal && (
        <SETTING_MODAL
          visible={true}
          centered={true}
          footer={null}
          title={<ModalHeader setTradeType={setTradeType} tradeType={tradeType} />}
          closeIcon={
            <img
              src={`/img/assets/close-${mode === 'lite' ? 'gray' : 'white'}-icon.svg`}
              height="20px"
              width="20px"
              onClick={() => setDepositWithdrawModal(false)}
            />
          }
        >
          <DepositWithdraw tradeType={tradeType} setDepositWithdrawModal={setDepositWithdrawModal} />
        </SETTING_MODAL>
      )}
      <h1>Account Overview</h1>
      <ACCOUNTVALUESFLEX>
        <ACCOUNTVALUESCONTAINER>
          <ACCOUNTVALUE>
            <p>My Portfolio Value:</p>
            <p>${(Number(notionalSize) + Number(traderInfo.collateralAvailable)).toFixed(2)}</p>
          </ACCOUNTVALUE>
        </ACCOUNTVALUESCONTAINER>
        <ACCOUNTVALUESCONTAINER>
          <ACCOUNTVALUE>
            <p>My 24h Trading Volume:</p>
            <p>${dayVolume.toFixed(2)}</p>
          </ACCOUNTVALUE>
        </ACCOUNTVALUESCONTAINER>
        <ACCOUNTVALUESCONTAINER>
          <ACCOUNTVALUE>
            <p>My Total Trading Volume:</p>
            <p>${userVolume}</p>
          </ACCOUNTVALUE>
        </ACCOUNTVALUESCONTAINER>
        <div className="health-container">
          <div className="health-icon">
            <span className="key">Health</span>
            <img src="/img/assets/heart-red.svg" alt="heart-icon" width="19" height="17" className="heart-icon" />
            {getHealthData()}
          </div>
        </div>
      </ACCOUNTVALUESFLEX>
      <ACCOUNTHEADER>
        {columns.map((item, index) => (
          <span key={index}>{item}</span>
        ))}
      </ACCOUNTHEADER>
      <HISTORY>
        {traderInfo.averagePosition.side && Number(roundedSize) ? (
          <div className="positions">
            <div className="pair-container">
              <img src={`${assetIcon}`} alt="SOL icon" />
              <span>{selectedCrypto.pair}</span>
            </div>
            <span>{roundedSize} SOL</span>
            <span>${Number(notionalSize).toFixed(2)}</span>
            <span>
              {Number(traderInfo.liquidationPrice) == 0 ? 'None' : Number(traderInfo.liquidationPrice).toFixed(2)}
            </span>
          </div>
        ) : (
          <div className="no-balances-found">
            <img src={`/img/assets/NoPositionsFound_${mode}.svg`} alt="no-balances-found" />
            <p>No Balances Found</p>
            {!connected && <Connect />}
            {connected && (
              <button onClick={() => setDepositWithdrawModal(true)} className="deposit">
                Deposit Now
              </button>
            )}
          </div>
        )}
      </HISTORY>
    </WRAPPER>
  )
}

export default AccountOverview
