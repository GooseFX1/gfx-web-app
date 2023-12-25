import { FC, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { useCrypto, useDarkMode, useOrderBook } from '../../../../context'
import { Connect } from '../../../../layouts/Connect'
import { useWallet } from '@solana/wallet-adapter-react'
import { ModalHeader, SETTING_MODAL } from '../../../TradeV3/InfoBanner'
import { DepositWithdraw } from '../../../TradeV3/perps/DepositWithdraw'
import { useTraderConfig } from '../../../../context/trader_risk_group'
import { formatNumberInThousands, getPerpsPrice } from '../../../TradeV3/perps/utils'
import { httpClient } from '../../../../api'
import { GET_TRADER_DAY_VOLUME } from '../../../TradeV3/perps/perpsConstants'
const WRAPPER = styled.div`
  ${tw`flex flex-col w-full h-full px-1.5`}

  h1 {
    ${tw`flex flex-col w-full`}
    font-size: 18px;
    color: ${({ theme }) => theme.text2};
  }
  .health-container {
    ${tw`flex items-center mt-4`}
  }

  .health-icon {
    ${tw`flex items-center gap-x-2`}
    color: ${({ theme }) => theme.text2};
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

const ACCOUNTVALUESFLEX = styled.div`
  ${tw`flex flex-row flex-nowrap overflow-auto gap-x-4 w-full h-[53px]`}
  &::-webkit-scrollbar {
    display: none;
  }
  & {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`

const ACCOUNTVALUESCONTAINER = styled.div`
  ${tw`w-[190px] h-full rounded-[5px] p-[1px] flex-shrink-0`}
  background: linear-gradient(94deg, #f7931a 0%, #ac1cc7 100%);
`

const ACCOUNTVALUE = styled.div`
  ${tw`h-full w-full rounded-[5px] flex flex-col  text-tiny font-semibold`}
  color: ${({ theme }) => theme.text2};
  background: ${({ theme }) => theme.bg2};
  padding: 5px;
  p {
    margin: 0px;
    font-size: 13px;
  }
  p:last-child {
    font-size: 15px;
  }
`

const HISTORY = styled.div`
  ${tw`flex w-full h-full mt-4`}
  height: calc(100vh - 250px);

  .no-balances-found {
    display: flex;
    margin: auto;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid #3c3c3c;
    width: 100%;
    height: 100%;
  }

  .position {
    ${tw`flex flex-col w-full`}
    padding: 5px 10px 10px 10px;
    color: ${({ theme }) => theme.text2};
    border: 1px solid #3c3c3c;
    img {
      height: 18px;
      width: 18px;
      margin-right: 5px;
    }
  }

  .positions-container {
    ${tw`w-full`}
  }

  .no-balances-found > p {
    margin: 0;
    margin-top: 15px;
    margin-bottom: 15px;
    color: ${({ theme }) => theme.text28};
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

const MobileAccountOverview: FC = () => {
  const { mode } = useDarkMode()
  const [dayVolume, setDayVolume] = useState<number>(0)
  const [depositWithdrawModal, setDepositWithdrawModal] = useState<boolean>(false)

  const [tradeType, setTradeType] = useState<string>('deposit')
  const { traderInfo, portfolioValue } = useTraderConfig()
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
  }, [connected, traderInfo.traderRiskGroupKey])

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
            <p>${formatNumberInThousands(portfolioValue)}</p>
          </ACCOUNTVALUE>
        </ACCOUNTVALUESCONTAINER>
        <ACCOUNTVALUESCONTAINER>
          <ACCOUNTVALUE>
            <p>My 24h Trading Volume:</p>
            <p>${formatNumberInThousands(dayVolume)}</p>
          </ACCOUNTVALUE>
        </ACCOUNTVALUESCONTAINER>
        <ACCOUNTVALUESCONTAINER>
          <ACCOUNTVALUE>
            <p>My Total Trading Volume:</p>
            <p>${formatNumberInThousands(Number(userVolume))}</p>
          </ACCOUNTVALUE>
        </ACCOUNTVALUESCONTAINER>
      </ACCOUNTVALUESFLEX>
      <div className="health-container">
        <div className="health-icon">
          <span className="key">Health</span>
          <img src="/img/assets/heart-red.svg" alt="heart-icon" width="19" height="17" className="heart-icon" />
          {getHealthData()}
        </div>
      </div>
      <HISTORY>
        {traderInfo.averagePosition.side && Number(roundedSize) ? (
          <div className="positions-container">
            <div className="position">
              <div className="flex w-full">
                <span>Asset</span>
                <div className="flex flex-nowrap items-center ml-auto">
                  <img src={`${assetIcon}`} alt="SOL icon" />
                  <span>{selectedCrypto.pair}</span>
                </div>
              </div>
              <div className="flex w-full">
                <span>Balance</span>
                <span className="ml-auto">{roundedSize} SOL</span>
              </div>
              <div className="flex w-full">
                <span>USD Value</span>
                <span className="ml-auto">${formatNumberInThousands(Number(notionalSize))}</span>
              </div>
              <div className="flex w-full">
                <span>Liq Price</span>
                <span className="ml-auto">${Number(traderInfo.liquidationPrice).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-balances-found">
            <img src={`/img/assets/NoPositionsFound_${mode}.svg`} alt="no-balances-found" />
            <p>No Active Positions</p>
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
export default MobileAccountOverview
