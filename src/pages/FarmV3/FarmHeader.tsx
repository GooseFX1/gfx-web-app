import { FC, useState } from 'react'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { ChoosePool } from './ChoosePool'
import { useDarkMode, useSSLContext } from '../../context'
import { SkeletonCommon } from '../NFTs/Skeleton/SkeletonCommon'
import { checkMobile } from '../../utils'
import { SSLToken } from './constants'
import useBlacklisted from '../../utils/useBlacklisted'

// const CARD_GRADIENT = styled.div`
//   ${tw`h-[56px] sm:h-11 w-[180px] p-px mr-3.75 rounded-tiny sm:w-[165px]`}
//   background: linear-gradient(113deg, #f7931a 0%, #dc1fff 132%);
//   flex-shrink: 0;
// `

// const INFO_CARD = styled.div`
//   ${tw`dark:bg-black-1 bg-grey-5 rounded-tiny h-full w-full flex flex-col justify-center py-[7px] sm:px-1 px-2.5 `}
// `

const POOL_CARD = styled.div`
  ${tw`h-[97px] w-[24%] dark:bg-black-1 bg-grey-5 rounded-small border border-solid dark:border-grey-2
   border-grey-1 p-2.5 sm:w-[257px] sm:mr-3.75 flex-shrink-0`}
`

const HEADER_WRAPPER = styled.div`
  ${tw`flex flex-row justify-start relative`}
  overflow-x: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`

const POOL_CARD_WRAPPER = styled.div`
  ${tw`flex flex-row justify-between mb-5 sm:my-3.5 sm:ml-[-10px] sm:pl-2.5`}
  overflow-x: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  > span {
    ${tw`w-full`}
  }
`

// const infoCards = [
//   { name: 'GooseFX TVL', value: '$1.57M' },
//   { name: 'Total Volume Traded', value: '$127.58M' },
//   { name: '24H Volume', value: '$12,875K' },
//   { name: '7D Volume', value: '$12,875K' },
//   { name: 'Total Fees', value: '$1.25K' }
// ]

export const FarmHeader: FC = () => {
  const isGeoBlocked = useBlacklisted()
  const { mode } = useDarkMode()
  const [poolSelection, setPoolSelection] = useState<boolean>(false)
  const { allPoolSslData, sslTableData } = useSSLContext()

  const allPoolDataWithApy = allPoolSslData.map((data: SSLToken) => {
    const apy = Number(sslTableData?.[data?.token]?.apy)
    const apyObj = { ...data, apy: apy }
    return apyObj
  })

  return (
    <>
      <HEADER_WRAPPER>
        {poolSelection && <ChoosePool poolSelection={poolSelection} setPoolSelection={setPoolSelection} />}
        {
          <div
            tw="absolute right-0 border border-solid border-grey-1 w-[207px] h-10 rounded-[100px] cursor-pointer
                py-0.5 pl-1.5 pr-0.5 flex flex-row items-center justify-center bg-white dark:bg-black-2 sm:right-0"
          >
            <span
              tw="mr-1.25 font-semibold text-regular dark:text-grey-5 text-black-4"
              onClick={() => {
                setPoolSelection(true)
              }}
            >
              Can’t Choose A Pool
            </span>
            <img src="/img/assets/questionMark.svg" alt="question-icon" />
          </div>
        }
      </HEADER_WRAPPER>
      {isGeoBlocked && (
        <div tw="flex w-full justify-center items-center mb-2">
          <img src={`/img/assets/georestricted_${mode}.svg`} alt="geoblocked-icon" />
          <div tw="ml-2 text-tiny font-semibold dark:text-grey-5 text-grey-1">
            GooseFX Farm is unavailable <br /> in your location.
          </div>
        </div>
      )}
      <div tw="flex flex-row items-center justify-between">
        <div tw="flex flex-col">
          <div tw="dark:text-grey-5 text-lg font-semibold leading-3 text-black-4 mb-3.75 sm:mb-0 leading-[25px]">
            Top Pools
          </div>
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
        {allPoolDataWithApy?.length
          ? allPoolDataWithApy
              .sort((a, b) => b.apy - a.apy)
              ?.slice(0, 4)
              ?.map((card) => (
                <POOL_CARD key={card?.token}>
                  <div tw="flex flex-row  justify-center items-center mb-3.5 sm:mb-2 sm:justify-between">
                    <img
                      src={`/img/crypto/${card.token}.svg`}
                      alt="pool-icon"
                      height={40}
                      width={40}
                      tw="mr-2.5"
                    />
                    <div tw="text-lg font-semibold text-black-4 dark:text-grey-5 mr-auto sm:text-average">
                      {card?.token}
                    </div>
                    <div
                      tw="flex flex-row h-[30px] w-[110px] flex flex-row justify-center items-center 
                      rounded-circle dark:bg-black-2 bg-grey-4 sm:w-[100px]"
                    >
                      <img
                        src={`/img/assets/${
                          card.assetType === 1 ? 'Primary' : card.assetType === 2 ? 'Hyper' : 'Stable'
                        }_pools.svg`}
                        alt="pool-type"
                        tw="mr-1.25 h-[21px] w-[19px]"
                      />
                      <div
                        tw="text-lg font-semibold text-black-4 dark:text-white 
                        text-regular font-semibold"
                      >
                        {card.assetType === 1 ? 'Primary' : card.assetType === 2 ? 'Hyper' : 'Stable'}
                      </div>
                    </div>
                  </div>
                  <div tw="flex items-center leading-[22px] sm:mt-3.5">
                    <div tw="text-grey-1 text-regular font-semibold dark:text-grey-2">APY: </div>
                    <div tw="text-black-4 text-regular font-semibold dark:text-grey-5 ml-1">
                      {card?.apy ? `${card.apy?.toFixed(2)}%` : '00.00%'}
                    </div>
                  </div>
                </POOL_CARD>
              ))
          : [0, 1, 2, 3].map((item) => (
              <SkeletonCommon
                height="97px"
                width={!checkMobile() ? '95%' : '257px'}
                key={item}
                style={checkMobile() && { marginRight: '15px' }}
              />
            ))}
      </POOL_CARD_WRAPPER>
    </>
  )
}
