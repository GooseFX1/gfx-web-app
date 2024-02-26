import { FC, useMemo, useState } from 'react'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { ChoosePool } from './ChoosePool'
import { useDarkMode, usePriceFeedFarm, useSSLContext } from '../../context'
//import { SkeletonCommon } from '../../components'
import { checkMobile, truncateBigNumber } from '../../utils'
import { SSLToken } from './constants'
import { getPriceObject } from '../../web3'
import { isEmpty } from 'lodash'
import { useWallet } from '@solana/wallet-adapter-react'
import { Tooltip } from 'antd'

const CARD_GRADIENT = styled.div<{ isMobile: boolean }>`
  ${tw`h-16.25 w-[130px] p-px mr-3.75 rounded-tiny`}
  background: linear-gradient(113deg, #f7931a 0%, #dc1fff 132%);
  flex-shrink: 0;
`

const INFO_CARD = styled.div`
  ${tw`dark:bg-black-1 bg-grey-5 rounded-tiny h-full w-full flex flex-col justify-center 
    sm:justify-evenly sm:px-1 px-[7px]`}
`

// const POOL_CARD = styled.div`
//   ${tw`h-[97px] w-[24%] dark:bg-black-1 bg-grey-5 rounded-small border border-solid dark:border-grey-2
//    border-grey-1 p-2.5 sm:w-[257px] sm:mr-3.75 flex-shrink-0`}
// `

const HEADER_WRAPPER = styled.div`
  ${tw`flex flex-row relative mb-5 items-center`}
  overflow-x: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`

// const POOL_CARD_WRAPPER = styled.div`
//   ${tw`flex flex-row justify-between mb-7 sm:my-3.5 sm:ml-[-10px] sm:pl-2.5`}
//   overflow-x: scroll;
//   ::-webkit-scrollbar {
//     display: none;
//   }
//   -ms-overflow-style: none;
//   scrollbar-width: none;

//   > span {
//     ${tw`w-full`}
//   }
// `

export const FarmHeader: FC = () => {
  const [range, setRange] = useState<number>(0)
  const {
    allPoolSslData,
    sslTableData,
    liquidityAmount,
    sslAllVolume,
    sslTotalFees,
    allPoolFilteredLiquidityAcc
  } = useSSLContext()
  const { prices } = usePriceFeedFarm()
  const { mode } = useDarkMode()
  const { wallet } = useWallet()
  const [poolSelectionModal, setPoolSelectionModal] = useState<boolean>(false)
  const userPubKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter?.publicKey])

  // const allPoolDataWithApy = allPoolSslData.map((data: SSLToken) => {
  //   const tokenName = data?.token === 'SOL' ? 'WSOL' : data?.token
  //   const apy = Number(sslTableData?.[tokenName]?.apy)
  //   const apyObj = { ...data, apy: apy }
  //   return apyObj
  // })

  const getTooltipText = (index: number) => {
    let tooltipText = ''
    if (index === 0)
      tooltipText = 'Total rewards earned by the user by providing liquidity in our SSL Pools, displayed in USD'
    else if (index === 1) tooltipText = 'TVL represents the total USD value of all assets locked in our SSL Pools'
    else if (index === 2)
      tooltipText = 'Volume generated between different time intervals. Volume is reset everyday at 10PM UTC'
    else if (index === 3)
      tooltipText =
        'Fees earned by the pools between different time intervals. Fees are reset everyday at 10PM UTC'
    return <span tw="dark:text-black-4 text-grey-5 font-medium text-tiny">{tooltipText}</span>
  }

  const TVL = useMemo(() => {
    if (allPoolSslData == null || liquidityAmount == null || isEmpty(prices)) return `$00.00`

    const totalLiquidity = allPoolSslData
      .map((token: SSLToken) => {
        const nativeLiquidity = liquidityAmount[token?.mint?.toBase58()]
        return prices?.[getPriceObject(token?.token)]?.current * nativeLiquidity
      })
      .reduce((acc, curValue) => acc + curValue, 0)

    return '$' + truncateBigNumber(totalLiquidity)
  }, [allPoolSslData, liquidityAmount, prices])

  const totalEarnings = useMemo(() => {
    if (!allPoolSslData || !allPoolFilteredLiquidityAcc) return `$00.00`

    const totalEarned = allPoolSslData
      .map((token: SSLToken) => {
        const totalEarnedInNative =
          allPoolFilteredLiquidityAcc?.[token?.mint?.toBase58()]?.totalEarned?.toNumber() /
          Math.pow(10, token?.mintDecimals)
        return totalEarnedInNative ? prices?.[getPriceObject(token?.token)]?.current * totalEarnedInNative : 0
      })
      .reduce((acc, curValue) => acc + curValue, 0)

    if (!totalEarned) return `$00.00`

    return '$' + truncateBigNumber(totalEarned)
  }, [allPoolFilteredLiquidityAcc, prices, allPoolSslData, userPubKey])

  const V24H = useMemo(() => {
    if (allPoolSslData == null) return `$00.00`

    const totalVolume = allPoolSslData
      .map((token: SSLToken) => {
        const key = token.token === 'SOL' ? 'WSOL' : token.token
        const volume = sslTableData?.[key]?.volume
        return volume / 1_000_000
      })
      .reduce((acc, curValue) => acc + curValue, 0)

    return '$' + truncateBigNumber(totalVolume)
  }, [allPoolSslData, sslTableData])

  const V7D = useMemo(() => {
    if (allPoolSslData == null) return `$00.00`

    const totalVolume = allPoolSslData
      .map((token: SSLToken) => {
        const key = token.token === 'SOL' ? 'WSOL' : token.token
        const volume = sslAllVolume?.[key]?.volume7D
        return volume / 1_000_000
      })
      .reduce((acc, curValue) => acc + curValue, 0)

    return '$' + truncateBigNumber(totalVolume)
  }, [allPoolSslData, sslAllVolume])

  const totalVolumeTraded = useMemo(() => {
    if (allPoolSslData == null) return `$00.00`

    const totalVolume = allPoolSslData
      .map((token: SSLToken) => {
        const key = token.token === 'SOL' ? 'WSOL' : token.token
        const volume = sslAllVolume?.[key]?.totalTokenVolume
        return volume / 1_000_000
      })
      .reduce((acc, curValue) => acc + curValue, 0)

    return '$' + truncateBigNumber(totalVolume)
  }, [allPoolSslData, sslAllVolume])

  const F24H = useMemo(() => {
    if (allPoolSslData == null) return `$00.00`

    const totalFees = allPoolSslData
      .map((token: SSLToken) => {
        const key = token.token === 'SOL' ? 'WSOL' : token.token
        const fee = sslTableData?.[key]?.fee
        const feeInNative = fee / 10 ** token.mintDecimals
        const fees = feeInNative * prices?.[getPriceObject(token?.token)]?.current
        return fees
      })
      .reduce((acc, curValue) => acc + curValue, 0)

    return '$' + truncateBigNumber(totalFees)
  }, [allPoolSslData, sslTableData])

  const F7D = useMemo(() => {
    if (allPoolSslData == null || !sslTotalFees) return `$00.00`

    const totalWeeklyFees = allPoolSslData
      .map((token: SSLToken) => {
        const key = token.token === 'SOL' ? 'WSOL' : token.token
        const fees = sslTotalFees?.[key]?.fees7D
        return fees / 1_000_00 // As fees is coming with 5 decimal places
      })
      .reduce((acc, curValue) => acc + curValue, 0)

    return '$' + truncateBigNumber(totalWeeklyFees)
  }, [allPoolSslData, sslTotalFees])

  const totalFees = useMemo(() => {
    if (allPoolSslData == null || !sslTotalFees) return `$00.00`

    const totalFees = allPoolSslData
      .map((token: SSLToken) => {
        const key = token.token === 'SOL' ? 'WSOL' : token.token
        const fees = sslTotalFees?.[key]?.totalTokenFees
        return fees / 1_000_00 // As fees is coming with 5 decimal places
      })
      .reduce((acc, curValue) => acc + curValue, 0)

    return '$' + truncateBigNumber(totalFees)
  }, [allPoolSslData, sslTotalFees])

  const infoCards = userPubKey
    ? [
        { name: 'My Earnings', value: totalEarnings },
        { name: 'TVL', value: TVL },
        {
          name: 'Volume',
          value: range === 0 ? V24H : range === 1 ? V7D : totalVolumeTraded
        },
        { name: 'Fees', value: range === 0 ? F24H : range === 1 ? F7D : totalFees }
      ]
    : [
        { name: 'TVL', value: TVL },
        {
          name: 'Volume',
          value: range === 0 ? V24H : range === 1 ? V7D : totalVolumeTraded
        },
        { name: 'Fees', value: range === 0 ? F24H : range === 1 ? F7D : totalFees }
      ]

  return (
    <>
      <HEADER_WRAPPER>
        {poolSelectionModal && (
          <ChoosePool poolSelectionModal={poolSelectionModal} setPoolSelectionModal={setPoolSelectionModal} />
        )}
        <div tw="flex flex-col cursor-pointer w-15 mr-2.5 sm:w-12.5 sm:h-15">
          <div
            css={[tw`duration-500`, range === 0 ? tw`mt-0` : range === 1 ? tw`mt-5` : tw`mt-10 sm:mt-[35px]`]}
            tw="h-5 bg-gradient-1 w-15 absolute rounded-[100px] sm:w-12.5 sm:h-[25px]"
          ></div>
          <h4
            css={[range === 0 ? tw`!text-white` : tw`text-grey-1`]}
            tw="h-5 duration-500 flex items-center z-[100] justify-center font-bold 
                            w-15 text-tiny sm:w-12.5 sm:h-[25px] sm:mb-2.5"
            onClick={() => setRange(0)}
          >
            24H
          </h4>
          {!checkMobile() && (
            <h4
              css={[range === 1 ? tw`!text-white` : tw`text-grey-1`]}
              tw="h-5 duration-500 flex items-center z-[100] justify-center 
                  font-bold w-15 text-tiny"
              onClick={() => setRange(1)}
            >
              7D
            </h4>
          )}
          <h4
            css={[range === 2 ? tw`!text-white` : tw`text-grey-1`]}
            tw="h-5 flex items-center justify-center z-[10] font-bold 
                            w-15 text-tiny sm:w-12.5 sm:h-[25px]"
            onClick={() => setRange(2)}
          >
            All
          </h4>
        </div>
        <div tw="flex flex-row">
          {infoCards?.map((card, index) => (
            <div key={card?.name}>
              <CARD_GRADIENT key={card?.name} isMobile={checkMobile()}>
                <INFO_CARD>
                  <div tw="flex flex-row">
                    <div tw="flex flex-row mr-auto justify-center items-center">
                      <h4 tw="text-tiny font-semibold text-grey-1 dark:text-grey-2">{card?.name}:</h4>
                      <Tooltip
                        color={mode === 'dark' ? '#F7F0FD' : '#1C1C1C'}
                        title={getTooltipText(userPubKey ? index : index + 1)}
                        placement="topRight"
                        overlayClassName={mode === 'dark' ? 'farm-tooltip dark' : 'farm-tooltip'}
                        overlayInnerStyle={{ borderRadius: '8px' }}
                      >
                        <img
                          src={`/img/assets/farm-tooltip-${mode}.svg`}
                          alt="deposit-cap"
                          tw="ml-[5px] max-w-none cursor-pointer"
                          height={16}
                          width={16}
                        />
                      </Tooltip>
                    </div>
                  </div>
                  <div tw="text-lg font-bold text-black-4 dark:text-grey-5 sm:text-average sm:leading-[18px]">
                    {card?.value}
                  </div>
                </INFO_CARD>
              </CARD_GRADIENT>
            </div>
          ))}
        </div>
        <button tw="cursor-pointer ml-auto" onClick={() => setPoolSelectionModal(true)}>
          <img
            src="/img/assets/question-icn.svg"
            alt="?-icon"
            tw="sm:h-[30px] sm:w-[30px] sm:max-w-[30px] sm:mr-2.5"
          />
        </button>
      </HEADER_WRAPPER>
      {/* <div tw="flex flex-row items-center justify-between">
        <div tw="flex flex-col">
          <h2 tw="dark:text-grey-5 text-lg font-semibold leading-3 text-black-4 mb-3.75 sm:mb-0 leading-[25px]">
            Top Single Asset Pools
          </h2>
        </div>
      </div>
      <POOL_CARD_WRAPPER>
        {allPoolDataWithApy?.length
          ? allPoolDataWithApy
              .sort((a, b) => b.apy - a.apy)
              ?.slice(0, 4)
              ?.map((card) => (
                <POOL_CARD key={card?.token}>
                  <div tw="flex flex-row justify-center items-center mb-3.5 sm:mb-2 sm:justify-between">
                    <img
                      src={`/img/crypto/${card.token}.svg`}
                      alt="pool-icon"
                      height={40}
                      width={40}
                      tw="mr-2.5"
                    />
                    <h2 tw="text-lg font-semibold text-black-4 dark:text-grey-5 mr-auto sm:text-average">
                      {card?.token}
                    </h2>
                    <div
                      tw="flex flex-row h-[30px] w-[110px] flex flex-row justify-center items-center
                      rounded-circle dark:bg-black-2 bg-grey-4 sm:w-[100px]"
                    >
                      <img
                        src={`/img/assets/${
                          card.assetType === 1 ? 'Primary' : card.assetType === 2 ? 'Hyper' : 'Stable'
                        }_pools_${mode}.svg`}
                        alt="pool-type"
                        tw="mr-1.25 h-[21px] w-[19px]"
                      />
                      <h4
                        tw="text-lg font-semibold text-black-4 dark:text-white 
                        text-regular font-semibold"
                      >
                        {card.assetType === 1 ? 'Primary' : card.assetType === 2 ? 'Hyper' : 'Stable'}
                      </h4>
                    </div>
                  </div>
                  <div tw="flex items-center leading-[22px] sm:mt-3.5">
                    <h4 tw="text-grey-1 text-regular font-semibold dark:text-grey-2">APY: </h4>
                    <h4 tw="text-black-4 text-regular font-semibold dark:text-grey-5 ml-1">
                      {card?.apy ? `${card.apy?.toFixed(2)}%` : '00.00%'}
                    </h4>
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
          </POOL_CARD_WRAPPER> */}
    </>
  )
}
