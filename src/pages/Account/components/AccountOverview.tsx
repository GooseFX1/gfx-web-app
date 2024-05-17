/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { useCrypto, useDarkMode, useOrderBook } from '../../../context'
import { Connect } from '../../../layouts/Connect'
import { useWallet } from '@solana/wallet-adapter-react'
import { useTraderConfig } from '../../../context/trader_risk_group'
import { formatNumberInThousands, getPerpsPrice } from '../../TradeV3/perps/utils'
import { httpClient } from '../../../api'
import { GET_TRADER_DAY_VOLUME } from '../../TradeV3/perps/perpsConstants'
import { DepositWithdrawDialog } from '@/pages/TradeV3/perps/DepositWithdraw'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Container, ContainerTitle, IconTooltip } from 'gfx-component-lib'
import { ContentLabel, InfoLabel } from '@/pages/TradeV3/perps/components/PerpsGenericComp'
import { AccountRowHealth } from '@/pages/TradeV3/perps/components/CollateralPanel'
const WRAPPER = styled.div`
  ${tw`flex flex-col w-full`}
  padding: 15px;
  h1 {
    font-size: 18px;
    color: ${({ theme }) => theme.text2};
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
    span {
      color: ${({ theme }) => theme.text2};
    }
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

const ACCOUNTHEADER = styled.div`
    /* ${tw`flex justify-between items-center flex-nowrap w-full`} */
    ${tw`grid grid-cols-4 gap-x-40 items-center w-full`}
    border: 1px solid #3C3C3C;
    color: ${({ theme }) => theme.text2};
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
  ${tw`flex w-full h-full dark:bg-black-2 bg-white`}
  border-top:1px solid #3C3C3C;
  color: ${({ theme }) => theme.text2};

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
    color: ${({ theme }) => theme.text2};
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

const columns = ['Asset', 'Balance', 'USD Value', 'Liq Price']
const AccountOverview: FC = () => {
  const { mode } = useDarkMode()
  const [dayVolume, setDayVolume] = useState<number>(0)

  const [depositWithdrawModal, setDepositWithdrawModal] = useState<boolean>(false)

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
    else if (percent > 20 && percent <= 80) barColour = 'bg-yellow-1'
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
    <div className="flex flex-col w-full p-[15px]">
      {depositWithdrawModal && (
        <DepositWithdrawDialog
          depositWithdrawModal={depositWithdrawModal}
          setDepositWithdrawModal={setDepositWithdrawModal}
        />
      )}
      <InfoLabel>
        <h3>Account Overview</h3>
      </InfoLabel>
      <div className="flex justify-between items-center">
        <div className="my-[15px] flex items-center">
          <Container
            variant="outline"
            colorScheme="primaryGradient"
            size="md"
            className="max-w-[158px] min-h-[55px] p-1.5 flex justify-between"
          >
            <ContainerTitle>
              <h5>My Portfolio Value:&nbsp;</h5>
              {/* <IconTooltip tooltipType={'outline'}>
              <p>The current price at which a good or service can be purchased or sold.</p>
            </IconTooltip> */}
            </ContainerTitle>
            <InfoLabel>
              <h3 className="leading-4">${formatNumberInThousands(Number(portfolioValue))}</h3>
            </InfoLabel>
          </Container>
          <Container
            variant="outline"
            colorScheme="primaryGradient"
            size="md"
            className="max-w-[185px] min-h-[55px] p-1.5 flex justify-between ml-4"
          >
            <ContainerTitle>
              <h5 className="whitespace-nowrap">My 24h Trading Volume:&nbsp;</h5>
              {/* <IconTooltip tooltipType={'outline'}>
              <p>The current price at which a good or service can be purchased or sold.</p>
            </IconTooltip> */}
            </ContainerTitle>
            <InfoLabel>
              <h3 className="leading-4">${formatNumberInThousands(dayVolume)}</h3>
            </InfoLabel>
          </Container>
          <Container
            variant="outline"
            colorScheme="primaryGradient"
            size="md"
            className="max-w-[205px] min-h-[55px] p-1.5 flex justify-between ml-4"
          >
            <ContainerTitle>
              <h5 className="whitespace-nowrap">My Total Trading Volume:&nbsp;</h5>
              {/* <IconTooltip tooltipType={'outline'}>
              <p>The current price at which a good or service can be purchased or sold.</p>
            </IconTooltip> */}
            </ContainerTitle>
            <InfoLabel>
              <h3 className="leading-4">${formatNumberInThousands(Number(userVolume))}</h3>
            </InfoLabel>
          </Container>
        </div>
        <div className="w-[180px]">
          <AccountRowHealth accountHealth={accountHealth} />
        </div>
      </div>

      <div
        className="grid grid-cols-4 gap-x-40 items-center rounded-t-[3px] px-2.5 bg-white
      dark:bg-black-2 w-full py-2"
      >
        {columns.map((item, index) => (
          <ContentLabel className="h-5" key={index}>
            {item}
          </ContentLabel>
        ))}
      </div>
      <HISTORY>
        {traderInfo.averagePosition.side && Number(roundedSize) ? (
          <div className="positions">
            <div className="pair-container">
              <img src={`${assetIcon}`} alt="SOL icon" />
              <InfoLabel>
                <p className="text-[13px]">{selectedCrypto.pair}</p>{' '}
              </InfoLabel>
            </div>
            <InfoLabel>
              <p className="text-[13px]">{roundedSize} SOL </p>
            </InfoLabel>
            <InfoLabel>
              <p className="text-[13px]">${formatNumberInThousands(Number(notionalSize))} </p>{' '}
            </InfoLabel>
            <InfoLabel>
              <p className="text-[13px]">${Number(traderInfo.liquidationPrice).toFixed(2)} </p>{' '}
            </InfoLabel>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full flex-col">
            {/* <img src={`/img/assets/NoPositionsFound_${mode}.svg`} alt="no-balances-found" /> */}
            <ContentLabel className="text-[18px]">No Positions Found</ContentLabel>
            <div className="mt-4">{!connected && <Connect />}</div>
            <div className="mt-4">
              {connected && (
                <button onClick={() => setDepositWithdrawModal(true)} className="deposit">
                  Deposit Now
                </button>
              )}
            </div>
          </div>
        )}
      </HISTORY>
    </div>
  )
}

export default AccountOverview
