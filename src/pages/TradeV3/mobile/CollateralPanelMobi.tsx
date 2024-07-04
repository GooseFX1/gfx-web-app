import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { useWallet } from '@solana/wallet-adapter-react'
import { FC, Dispatch, SetStateAction, useMemo, useState } from 'react'
import { truncateAddress } from '../../../utils'
import { ArrowDropdown, Tooltip } from '../../../components'
import { useCrypto, useDarkMode, useOrder } from '../../../context'
import { useTraderConfig } from '../../../context/trader_risk_group'
import { useMpgConfig } from '@/context/market_product_group'

const WRAPPER = styled.div`
  .deposit-wrapper {
    ${tw`w-[40%] h-[45px] rounded-[36px] flex items-center justify-center p-0.5 relative`}
    background: linear-gradient(113deg, #f7931a 0%, #dc1fff 132%);
    .white-background {
      ${tw`h-full w-full rounded-[36px] flex`}
      background: ${({ theme }) => theme.bg20};
    }
    .deposit-btn {
      ${tw`w-full h-full rounded-[36px] flex items-center justify-center text-regular
      font-semibold dark:text-white text-black-4`}
      background: linear-gradient(94deg, rgba(247, 147, 26, 0.4) 0%, rgba(172, 28, 199, 0.4) 100%);
    }
    .ant-dropdown-trigger {
      position: absolute;
      top: 15px;
      right: 15px;
    }
    .lite {
      .arrow-icon {
        filter: invert(28%) sepia(88%) saturate(1781%) hue-rotate(230deg) brightness(99%) contrast(105%);
      }
    }
  }
  .heart-icon {
    ${tw`ml-2`}
  }
  .tooltipIcon {
    ${tw`!w-[25px] !h-[25px] ml-0 cursor-pointer`}
  }
  .health-icon {
    ${tw`flex items-center`}
  }
  .bar-holder {
    ${tw`flex`}
  }
  .bars {
    ${tw`h-5 w-1.5 mr-2.5 inline-block rounded-average`}
  }
  .bars:last-child {
    ${tw`mr-4`}
  }
  .green {
    ${tw`bg-green-3`}
  }
  .red {
    ${tw`bg-red-1`}
  }
  .greenText {
    ${tw`!text-green-2`}
  }
  .redText {
    ${tw`!text-red-1`}
  }
  .yellow {
    ${tw`bg-[#F0B865]`}
  }
  .gray {
    background: ${({ theme }) => theme.bg24};
  }
  .current-tier {
    ${tw`font-semibold text-regular dark:text-white text-black-4`}
  }
  .current-tier-value {
    ${tw`text-regular font-semibold ml-1.5`}
    background: -webkit-linear-gradient(96.79deg, #f7931a, #dc1fff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .disclaimer {
    ${tw`font-medium text-tiny dark:text-grey-2 text-grey-1`}
  }
`

const SELECTOR = styled.div`
  ${tw`w-[40vw] h-20 rounded-tiny pt-2 pb-3 pl-2.5`}
  border: ${({ theme }) => '1px solid ' + theme.tokenBorder};
  background-color: ${({ theme }) => theme.bg20};
  > div {
    ${tw`flex items-center mb-4`}
    > span {
      ${tw`text-white text-regular font-semibold`}
      color: ${({ theme }) => theme.text4};
    }
    > input[type='radio'] {
      ${tw`appearance-none absolute right-3 h-5 w-5 rounded-small cursor-pointer`}
      background-color: ${({ theme }) => theme.bg22};
    }
    > input[type='radio']:checked:after {
      ${tw`rounded-small w-3 h-3 relative left-1 inline-block`}
      background: linear-gradient(92deg, #f7931a 0%, #ac1cc7 100%);
      content: '';
    }
  }
`

const ACCOUNT_ROW = styled.div`
  ${tw`flex flex-row justify-between items-start mb-3`}
  .key {
    ${tw`text-regular font-semibold text-grey-1`}
  }
  .value {
    ${tw`text-regular font-semibold text-black-4 dark:text-grey-5`}
  }
  .balances {
    ${tw`text-right`}
    > div {
      ${tw`text-right mb-[2px]`}
    }
  }
  .positive {
    ${tw`text-regular font-black text-green-2`}
  }
  .negative {
    ${tw`text-regular font-black text-red-1`}
  }
  .tooltip-row {
    ${tw`flex items-center`}
  }
`

const Overlay: FC<{
  setArrowRotation: Dispatch<SetStateAction<boolean>>
  setDropdownVisible: Dispatch<SetStateAction<boolean>>
  showCollateralPanelInfo: Dispatch<SetStateAction<string>>
  collateralPanelInfo: any
  dropdownOptions: any
}> = ({ setArrowRotation, setDropdownVisible, collateralPanelInfo, showCollateralPanelInfo, dropdownOptions }) => {
  const handleChange = () => {
    setArrowRotation(false)
    setDropdownVisible(false)
  }

  return (
    <SELECTOR>
      {dropdownOptions.map((item: string, index: number) => (
        <div key={index} onClick={() => showCollateralPanelInfo(item)}>
          <span>{item}</span>
          <input
            type="radio"
            name="market"
            value={item}
            checked={collateralPanelInfo === item}
            onChange={handleChange}
          />
        </div>
      ))}
    </SELECTOR>
  )
}

//eslint-disable-next-line
export const CollateralPanelMobi = ({ setUserProfile }) => {
  const dropdownOptions = ['SOL Account', 'Fees']
  const { connected, wallet } = useWallet()
  const publicKey = useMemo(() => wallet?.adapter.publicKey, [wallet, connected])
  const publicKeyUi = truncateAddress(publicKey.toString())
  const [arrowRotation, setArrowRotation] = useState(false)
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [collateralPanelInfo, showCollateralPanelInfo] = useState<string>(dropdownOptions[0])
  const { collateralInfo, traderInfo } = useTraderConfig()
  const { activeProduct } =   useMpgConfig()
  const { mode } = useDarkMode()
  const { order } = useOrder()
  const { getAskSymbolFromPair, selectedCrypto } = useCrypto()

  const handleDropdownClick = () => {
    setArrowRotation(!arrowRotation)
    setDropdownVisible(!dropdownVisible)
  }

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

  const ask = useMemo(() => getAskSymbolFromPair(selectedCrypto.pair), [getAskSymbolFromPair, selectedCrypto.pair])

  const maxQtyNum: number = useMemo(() => {
    const maxQty = Number(traderInfo.maxQuantity)
    if (Number.isNaN(maxQty)) return 0
    return maxQty
  }, [traderInfo.maxQuantity, order.size])

  const sliderValue = useMemo(() => {
    const initLeverage = Number(traderInfo.currentLeverage)
    const availLeverage = Number(traderInfo.availableLeverage)
    const qty = maxQtyNum
    //const availMargin = Number(traderInfo.marginAvailable)
    let percentage = 0
    percentage = (Number(order.size) / qty) * availLeverage
    //else if (order.total < availMargin) percentage = (Number(order.total) / Number(availMargin)) * availLeverage
    return Number((initLeverage + percentage).toFixed(2))
    //return Number(initLeverage.toFixed(2))
  }, [maxQtyNum, order.size])

  const currentMarketBalance: string = useMemo(() => {
    let balance = '0'
    traderInfo?.balances?.map((item) => {
      if (item.productKey.toBase58() === activeProduct.id) {
        balance = item.balance
      }
    })
    return balance + ' ' + ask
  }, [traderInfo, activeProduct])

  return (
    <WRAPPER>
      <div tw="flex flex-row justify-evenly items-center mt-2.5 mb-3.75">
        {connected && publicKey && (
          <div tw="dark:text-grey-2 text-black-4 font-semibold text-average ml-[-45px]">{publicKeyUi}</div>
        )}
        <div className="deposit-wrapper" onClick={handleDropdownClick}>
          <div className={`white-background ${mode}`}>
            <div className="deposit-btn">{collateralPanelInfo}</div>
            <ArrowDropdown
              arrowRotation={arrowRotation}
              offset={[70, 24]}
              onVisibleChange={null}
              placement="bottom"
              measurements="13px"
              overlay={
                <Overlay
                  setArrowRotation={setArrowRotation}
                  setDropdownVisible={setDropdownVisible}
                  collateralPanelInfo={collateralPanelInfo}
                  showCollateralPanelInfo={showCollateralPanelInfo}
                  dropdownOptions={dropdownOptions}
                />
              }
              open={dropdownVisible}
            />
          </div>
        </div>
        <img
          src={`/img/assets/close-gray-icon.svg`}
          alt="close-icon"
          tw="absolute top-5 right-5 z-10"
          height="18px"
          width="18px"
          onClick={() => setUserProfile(false)}
        />
      </div>
      {collateralPanelInfo !== 'Fees' ? (
        <div tw="m-3.75">
          <ACCOUNT_ROW>
            <div className="health-icon">
              <span className="key">Health</span>
              <img
                src="/img/assets/heart-red.svg"
                alt="heart-icon"
                width="22"
                height="20"
                className="heart-icon"
              />
              <Tooltip color={mode === 'dark' ? '#F7F0FD' : '#1C1C1C'}>
                The health bar shows how close you are to being liquidated.{' '}
              </Tooltip>
            </div>
            {getHealthData()}
          </ACCOUNT_ROW>
          <ACCOUNT_ROW>
            <div className="tooltip-row">
              <span className="key">{collateralPanelInfo === 'SOL Account' ? 'Balance' : 'Balances'}</span>
            </div>
            {collateralPanelInfo === 'SOL Account' ? (
              <span className="value">{currentMarketBalance}</span>
            ) : (
              <div className="balances value">
                <div>${(Number(traderInfo.collateralAvailable) * Number(collateralInfo.price)).toFixed(2)}</div>
                <div>0.3344 BTC</div>
                <span className="value">1,888.55 USDC</span>
              </div>
            )}
          </ACCOUNT_ROW>
          <ACCOUNT_ROW>
            <div className="health-icon">
              <span className="key">Leverage</span>
            </div>
            <span className="value">{sliderValue ? sliderValue : '-'}</span>
          </ACCOUNT_ROW>
        </div>
      ) : (
        <div tw="m-3.75">
          <div>
            <span className="current-tier">My current tier:</span>
            <span className="current-tier-value">0.04% Taker/ 0% Maker</span>
          </div>
          <div className="disclaimer">
            *Disclaimer: Perps fees for GooseFx are <br /> subject to change.
          </div>
        </div>
      )}
    </WRAPPER>
  )
}
