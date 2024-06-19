import { FC, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { useCrypto, useOrderBook } from '../../../context'
import { Connect } from '../../../layouts/Connect'
import { useWallet } from '@solana/wallet-adapter-react'
import { useTraderConfig } from '../../../context/trader_risk_group'
import { formatNumberInThousands, getPerpsPrice } from '../../TradeV3/perps/utils'
import { httpClient } from '../../../api'
import { GET_TRADER_DAY_VOLUME } from '../../TradeV3/perps/perpsConstants'
import { DepositWithdrawDialog } from '@/pages/TradeV3/perps/DepositWithdraw'
import { Button, Container, ContainerTitle, cn } from 'gfx-component-lib'
import { AccountsLabel, ContentLabel, InfoLabel, 
  InfoLabelNunito } from '@/pages/TradeV3/perps/components/PerpsGenericComp'
import { AccountRowHealth } from '@/pages/TradeV3/perps/components/CollateralPanel'
import useBreakPoint from '@/hooks/useBreakPoint'

const HISTORY = styled.div`
  ${tw`flex w-full dark:bg-black-2 h-[calc(100vh - 268px)] max-sm:h-[calc(100vh - 315px)] bg-white 
  border  border-grey-4 dark:border-black-4 border-b-0 border-r-0 border-l-0
  max-sm:border-t-0  rounded-[3px]
  rounded-b-[5px] max-sm:my-[15px]`}
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
  const { isMobile } = useBreakPoint()
  return (
    <div className="flex flex-col w-full p-[15px] max-sm:p-[10px] max-sm:py-0 ml-36 max-sm:ml-0 ">
      {depositWithdrawModal && (
        <DepositWithdrawDialog
          depositWithdrawModal={depositWithdrawModal}
          setDepositWithdrawModal={setDepositWithdrawModal}
        />
      )}
      {!isMobile && (
        <InfoLabel>
          <h3>Account Overview</h3>
        </InfoLabel>
      )}
      <div className="flex justify-between items-center max-sm:overflow-x-auto max-sm:mt-[15px] no-scrollbar">
        <div className="my-[15px] flex items-center max-sm:my-0">
          <Container
            variant="outline"
            colorScheme="primaryGradient"
            size="md"
            className="max-w-[158px] min-w-[140px] min-h-[55px] p-1.5 flex justify-between"
          >
            <ContainerTitle>
              <h5>My Portfolio Value:&nbsp;</h5>
              {/* <IconTooltip tooltipType={'outline'}>
              <p>The current price at which a good or service can be purchased or sold.</p>
            </IconTooltip> */}
            </ContainerTitle>
            <InfoLabel>
              <h2 className="leading-4">${formatNumberInThousands(Number(portfolioValue))}</h2>
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
              <h2 className="leading-4">${formatNumberInThousands(dayVolume)}</h2>
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
              <h2 className="leading-4">${formatNumberInThousands(Number(userVolume))}</h2>
            </InfoLabel>
          </Container>
        </div>
        {!isMobile && (
          <div className="w-[180px] ">
            <AccountRowHealth accountHealth={accountHealth} />
          </div>
        )}
      </div>
      {isMobile && (
        <div className="flex justify-between items-center max-sm:h-[27px] mt-[15px]">
          <InfoLabel>
            <h3>Account Overview</h3>
          </InfoLabel>
          <div className="w-[175px] ">
            <AccountRowHealth accountHealth={accountHealth} />
          </div>
        </div>
      )}

      {!isMobile && (
        <>
          <div
            className="grid grid-cols-4 gap-x-40 items-center rounded-t-[3px] px-2.5 bg-white
      dark:bg-black-2 w-full py-2 rounded-[3px]"
          >
            {columns.map((item, index) => (
              <ContentLabel className={index === columns.length - 1 ? 'text-right' : ''} key={index}>
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
                  <p className="text-[13px] text-right mr-2.5">
                    ${Number(traderInfo.liquidationPrice).toFixed(2)}{' '}
                  </p>{' '}
                </InfoLabel>
              </div>
            ) : (
              <NoPositionFound str='No Positions Found'
                connected={connected} setDepositWithdrawModal={setDepositWithdrawModal} />
            )}
          </HISTORY>
        </>
      )}
      {isMobile && (
        <>
          <HISTORY>
            {traderInfo.averagePosition.side && Number(roundedSize) ? (
              <div className="flex flex-col w-full p-2.5 rounded-[3px]">
                <div className="flex justify-between mt-[5px] ">
                  <ContentLabel className="text-[15px]"> Asset </ContentLabel>
                  <InfoLabelNunito className="text-[15px] flex items-center ">
                    <img src={`${assetIcon}`} className="h-5 w-5 mr-1" alt="SOL icon" />
                    SOL-PERP{' '}
                  </InfoLabelNunito>
                </div>
                <div className="flex justify-between mt-[5px] ">
                  <ContentLabel className="text-[15px]"> Balance </ContentLabel>
                  <InfoLabelNunito className="text-[15px]"> {roundedSize} SOL </InfoLabelNunito>
                </div>
                <div className="flex justify-between mt-[5px] ">
                  <ContentLabel className="text-[15px]"> USD Value </ContentLabel>
                  <InfoLabelNunito className="text-[15px]"> ${formatNumberInThousands(Number(notionalSize))}
                  </InfoLabelNunito>
                </div>
                <div className="flex justify-between mt-[5px] ">
                  <ContentLabel className="text-[15px]"> Liquidity Price </ContentLabel>
                  <InfoLabelNunito className="text-[15px]"> ${Number(traderInfo.liquidationPrice).toFixed(2)}
                  </InfoLabelNunito>
                </div>
                <BorderLine className={'mt-2.5'} />
              </div>
            ) : (
              <NoPositionFound
                str='No Positions Found'
                connected={connected} setDepositWithdrawModal={setDepositWithdrawModal} />
            )}

          </HISTORY>
        </>
      )}
    </div>
  )
}

export const NoPositionFound: FC<{ str: string, connected: boolean, setDepositWithdrawModal: (boolean) => void }> =
  ({ str, connected, setDepositWithdrawModal }) =>
    <div className="flex h-full items-center justify-center w-full flex-col">
      {/* <img src={`/img/assets/NoPositionsFound_${mode}.svg`} alt="no-balances-found" /> */}
      <AccountsLabel className="text-[18px]">{str}</AccountsLabel>
      <div className="mt-4">{!connected && <Connect />}</div>
      <div className="mt-0">
        {connected && (
          <Button
            colorScheme={'blue'}
            onClick={() => setDepositWithdrawModal(true)}
            className={`ml-auto font-bold
    text-white min-w-[122px]  py-1.875  min-md:px-1.5 box-border`}
            size={'lg'}
          >
            Deposit Now
          </Button>
        )}
      </div>
    </div>

export const BorderLine: FC<{ className?: string }> = ({ className }) => (
  <div className={cn(`h-[1px] dark:!bg-black-4 bg-grey-4 dark:text-black-2 text-white`, className)}>'</div>
)
export default AccountOverview
