/* eslint-disable */
import { FC } from 'react'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'

const CARD_GRADIENT = styled.div`
  ${tw`h-[56px] w-[180px] p-0.5 mr-6 rounded-small`}
  background: linear-gradient(113deg, #f7931a 0%, #dc1fff 132%);
`

const INFO_CARD = styled.div`
  ${tw`dark:bg-black-1 bg-grey-5 rounded-small h-full w-full flex flex-col justify-center px-2.5`}
`

const POOL_CARD = styled.div`
  ${tw`h-32 w-[22%] dark:bg-black-1 bg-grey-5 rounded-[18px] border-solid dark:border-grey-2 border-grey-1 p-3.75`}
`
const infoCards = [
  { name: 'GooseFX TVL', value: '$1.57M' },
  { name: 'Total Volume Traded', value: '$127.58M' },
  { name: '24H Volume', value: '$12,875K' },
  { name: '7D Volume', value: '$12,875K' }
]

const topPoolCards = [
  { name: 'BTC', value: '15.00%', type: 'Hyper' },
  { name: 'SOL', value: '8.00%', type: 'Hyper' },
  { name: 'USDC', value: '7.45%', type: 'Stable' },
  { name: 'XRP', value: '7.45%', type: 'Stable' }
]

export const FarmHeader: FC<{}> = () => {
  return (
    <>
      <div tw="flex flex-row justify-start relative mb-5 sm:block sm:px-[15px] sm:mb-0">
        {infoCards?.map((card, index) => (
          <>
            <CARD_GRADIENT>
              <INFO_CARD key={index}>
                <div tw="text-tiny font-semibold text-grey-1 dark:text-grey-2">{card?.name}:</div>
                <div tw="text-lg font-semibold text-black-4 dark:text-grey-5">{card?.value}</div>
              </INFO_CARD>
            </CARD_GRADIENT>
            <div
              tw="absolute right-0 border border-solid border-grey-1 w-[220px] h-12 rounded-[100px] cursor-pointer
              py-0.5 pl-2.5 pr-0.5 flex flex-row items-center justify-center bg-white dark:bg-black-2 sm:right-0"
            >
              <span
                tw="mr-[5px] font-semibold text-regular dark:text-grey-5 text-black-4"
                onClick={() => {
                  //setHowToEarn(true)
                }}
              >
                Can’t Choose A Pool
              </span>
              <img src="/img/assets/questionMark.svg" alt="question-icon" />
            </div>
          </>
        ))}
      </div>
      <div tw="dark:text-grey-2 text-regular font-semibold text-grey-1">Today</div>
      <div tw="dark:text-grey-5 text-lg font-semibold text-black-4 mb-2.5">Top Pools</div>
      <div tw="flex flex-row justify-between mb-5 sm:block sm:px-[15px] sm:mb-0">
        {topPoolCards?.map((card, index) => (
          <>
            <POOL_CARD key={index}>
              <div tw="flex flex-row justify-center items-center mb-3.75">
                <img src={`/img/crypto/${card.name}.svg`} alt="pool-icon" height={40} width={40} tw="mr-2.5" />
                <div tw="text-lg font-semibold text-black-4 dark:text-grey-5 mr-auto">{card?.name}</div>
                <div tw="flex flex-row h-[30px] w-[100px] flex flex-row justify-center items-center rounded-circle dark:bg-black-2 bg-grey-4">
                  <img
                    src={`/img/assets/${card.type}_pools.svg`}
                    alt="pool-type"
                    width={19}
                    height={21}
                    tw="mr-1.25"
                  />
                  <div tw="text-lg font-semibold text-black-4 dark:text-white text-regular font-semibold">
                    {card?.type}
                  </div>
                </div>
              </div>
              <div tw="text-grey-1 text-regular font-semibold dark:text-grey-2">APY</div>
              <div tw="text-black-4 text-lg font-semibold dark:text-grey-5 mt-[-4px]">{card?.value}</div>
            </POOL_CARD>
          </>
        ))}
      </div>
    </>
  )
}
