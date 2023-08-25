import { FC, useState } from 'react'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { ChoosePool } from './ChoosePool'

const CARD_GRADIENT = styled.div`
  ${tw`h-[60px] w-[180px] p-px mr-3.75 rounded-tiny sm:w-[165px]`}
  background: linear-gradient(113deg, #f7931a 0%, #dc1fff 132%);
  flex-shrink: 0;
`

const INFO_CARD = styled.div`
  ${tw`dark:bg-black-1 bg-grey-5 rounded-tiny h-full w-full flex flex-col justify-center px-2.5 sm:py-[5px]`}
`

const POOL_CARD = styled.div`
  ${tw`h-[97px] w-[24%] dark:bg-black-1 bg-grey-5 rounded-small border-solid dark:border-grey-2
   border-grey-1 p-2.5
    sm:h-28 sm:w-[257px] sm:mr-3.75 flex-shrink-0`}
`

const HEADER_WRAPPER = styled.div`
  ${tw`flex flex-row justify-start relative mb-5`}
  overflow-x: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`

const POOL_CARD_WRAPPER = styled.div`
  ${tw`flex flex-row justify-between mb-5 sm:my-5`}
  overflow-x: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`

const infoCards = [
  { name: 'GooseFX TVL', value: '$1.57M' },
  { name: 'Total Volume Traded', value: '$127.58M' },
  { name: '24H Volume', value: '$12,875K' },
  { name: '7D Volume', value: '$12,875K' },
  { name: 'Total Fees', value: '$1.25K' }
]

const topPoolCards = [
  { name: 'BTC', value: '15.00%', type: 'Alpha' },
  { name: 'SOL', value: '8.00%', type: 'Alpha' },
  { name: 'USDC', value: '7.45%', type: 'Stable' },
  { name: 'XRP', value: '7.45%', type: 'Stable' }
]

export const FarmHeader: FC = () => {
  const [poolSelection, setPoolSelection] = useState<boolean>(false)
  return (
    <>
      <HEADER_WRAPPER>
        {poolSelection && <ChoosePool poolSelection={poolSelection} setPoolSelection={setPoolSelection} />}
        {infoCards?.map((card, index) => (
          <>
            <CARD_GRADIENT key={index}>
              <INFO_CARD key={index}>
                <div tw="text-tiny font-semibold text-grey-1 dark:text-grey-2">{card?.name}:</div>
                <div tw="text-regular font-semibold text-black-4 dark:text-grey-5 sm:text-regular">
                  {card?.value}
                </div>
              </INFO_CARD>
            </CARD_GRADIENT>
          </>
        ))}
        {/* {!checkMobile() && (
          <div
            tw="absolute right-0 border border-solid border-grey-1 w-[207px] h-10 rounded-[100px] cursor-pointer
                py-0.5 pl-1.5 pr-0.5 flex flex-row items-center justify-center bg-white dark:bg-black-2 sm:right-0"
          >
            <span
              tw="mr-[5px] font-semibold text-regular dark:text-grey-5 text-black-4"
              onClick={() => {
                setPoolSelection(true)
              }}
            >
              Can’t Choose A Pool
            </span>
            <img src="/img/assets/questionMark.svg" alt="question-icon" />
          </div>
        )} */}
      </HEADER_WRAPPER>
      <div tw="flex flex-row items-center justify-between">
        <div tw="flex flex-col">
          <div tw="dark:text-grey-2 text-regular leading-3 font-semibold text-grey-1 sm:mt-3 sm:text-tiny">
            Today
          </div>
          <div tw="dark:text-grey-5 text-lg font-semibold  text-black-4 mb-2.5">Top Pools</div>
        </div>
        {/* {checkMobile() && (
          <div
            tw="border border-solid border-grey-1 w-[180px] h-10 rounded-[100px] dark:bg-black-2
               flex flex-row items-center justify-center bg-white mr-2.5"
          >
            <span
              tw="font-semibold dark:text-grey-5 text-black-4 text-tiny mr-1"
              onClick={() => {
                setPoolSelection(true)
              }}
            >
              Can’t Choose A Pool
            </span>
            <img src="/img/assets/questionMark.svg" alt="question-icon" height={25} width={25} />
          </div>
        )} */}
      </div>
      <POOL_CARD_WRAPPER>
        {topPoolCards?.map((card, index) => (
          <POOL_CARD key={index}>
            <div tw="flex flex-row  justify-center items-center mb-3.5 sm:mb-2 sm:justify-between">
              <img src={`/img/crypto/${card.name}.svg`} alt="pool-icon" height={40} width={40} tw="mr-2.5" />
              <div tw="text-lg font-semibold text-black-4 dark:text-grey-5 mr-auto sm:text-average">
                {card?.name}
              </div>
              <div
                tw="flex flex-row h-[30px] w-[110px] flex flex-row justify-center items-center 
                  rounded-circle dark:bg-black-2 bg-grey-4 sm:w-[90px]"
              >
                <img
                  src={`/img/assets/${card.type}_pools.svg`}
                  alt="pool-type"
                  width={19}
                  height={21}
                  tw="mr-1.25"
                />
                <div
                  tw="text-lg font-semibold text-black-4 dark:text-white 
                        text-regular font-semibold sm:text-average"
                >
                  {card?.type}
                </div>
              </div>
            </div>
            <div tw="flex items-center">
              <div tw="text-grey-1 text-average font-semibold dark:text-grey-2">APY: </div>
              <div tw="text-black-4 text-average font-semibold dark:text-grey-5 ml-1">{card?.value}</div>
            </div>
          </POOL_CARD>
        ))}
      </POOL_CARD_WRAPPER>
    </>
  )
}
