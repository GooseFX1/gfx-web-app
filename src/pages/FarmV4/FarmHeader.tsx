import { FC, useMemo, useState } from 'react'
import { useDarkMode, useGamma, usePriceFeedFarm, useRewardToggle } from '../../context'
import { truncateBigNumber } from '../../utils'
import { poolType, SSLToken } from './constants'
import { getPriceObject } from '../../web3'
import { isEmpty } from 'lodash'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button, cn, Container, ContainerTitle, Icon, Tooltip, TooltipContent, TooltipTrigger } from 'gfx-component-lib'
import useBreakPoint from '@/hooks/useBreakPoint'
import { DepositWithdrawSlider } from '../FarmV4/DepositWithdrawSlider'
import RadioOptionGroup from '@/components/common/RadioOptionGroup'
import DocsBanner from './DocsBanner'
import { CreatePool } from './CreatePool'

export const FarmHeader: FC = () => {
  const [range, setRange] = useState<number>(0)
  const {
    allPoolSslData,
    sslTableData,
    liquidityAmount,
    sslAllVolume,
    sslTotalFees,
    allPoolFilteredLiquidityAcc,
    setPool
  } = useGamma()
  const { prices } = usePriceFeedFarm()
  const { wallet } = useWallet()
  const userPubKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter?.publicKey])
  const { isMobile } = useBreakPoint()
  const { isProMode, isPortfolio, setIsPortfolio } = useRewardToggle()
  const { mode } = useDarkMode()
  const [isCreatePool, setIsCreatePool] = useState<boolean>(false)

  const TVL = useMemo(() => {
    if (allPoolSslData == null || liquidityAmount == null || isEmpty(prices)) return `$0.00`

    const totalLiquidity = allPoolSslData
      .map((token: SSLToken) => {
        const nativeLiquidity = liquidityAmount[token?.mint?.toBase58()]
        return prices?.[getPriceObject(token?.token)]?.current * nativeLiquidity
      })
      .reduce((acc, curValue) => acc + curValue, 0)

    return '$' + truncateBigNumber(totalLiquidity)
  }, [allPoolSslData, liquidityAmount, prices])

  const totalEarnings = useMemo(() => {
    if (!allPoolSslData || !allPoolFilteredLiquidityAcc) return `$0.00`

    const totalEarned = allPoolSslData
      .map((token: SSLToken) => {
        const totalEarnedInNative =
          allPoolFilteredLiquidityAcc?.[token?.mint?.toBase58()]?.totalEarned?.toNumber() /
          Math.pow(10, token?.mintDecimals)
        return totalEarnedInNative ? prices?.[getPriceObject(token?.token)]?.current * totalEarnedInNative : 0
      })
      .reduce((acc, curValue) => acc + curValue, 0)

    if (!totalEarned) return `$0.00`

    return '$' + truncateBigNumber(totalEarned)
  }, [allPoolFilteredLiquidityAcc, prices, allPoolSslData, userPubKey])

  const V24H = useMemo(() => {
    if (allPoolSslData == null) return `$0.00`

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
    if (allPoolSslData == null) return `$0.00`

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
    if (allPoolSslData == null) return `$0.00`

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
    if (allPoolSslData == null) return `$0.00`

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
    if (allPoolSslData == null || !sslTotalFees) return `$0.00`

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
    if (allPoolSslData == null || !sslTotalFees) return `$0.00`

    const totalFees = allPoolSslData
      .map((token: SSLToken) => {
        const key = token.token === 'SOL' ? 'WSOL' : token.token
        const fees = sslTotalFees?.[key]?.totalTokenFees
        return fees / 1_000_00 // As fees is coming with 5 decimal places
      })
      .reduce((acc, curValue) => acc + curValue, 0)

    return '$' + truncateBigNumber(totalFees)
  }, [allPoolSslData, sslTotalFees])

  const infoCards = useMemo(() => {
    const data = [
      { name: 'TVL', value: TVL,
        tooltip: 'TVL represents the total USD value of all assets deposited in our pools' },
      {
        name: '24H Volume',
        value: range === 0 ? V24H : range === 1 ? V7D : totalVolumeTraded,
        tooltip: ''
      },
      {
        name: '24H Fees', value: range === 0 ? F24H : range === 1 ? F7D : totalFees,
        tooltip: ''
      }
    ]
    if (userPubKey) {
      data.unshift({ name: 'Total Earned', value: totalEarnings,
        tooltip: '' })
    }
    return data
  }, [userPubKey])
  const options = useMemo(
    () => [
      {
        value: '24h',
        label: '24H',
        onClick: () => setRange(0)
      },
      {
        value: '7D',
        label: '7D',
        onClick: () => setRange(1),
        className: 'hidden min-md:inline-block'
      },
      {
        value: '30D',
        label: '30D',
        onClick: () => setRange(2)
      }
    ],
    []
  )

  return (
    <div className="p-5 pt-3.75 max-sm:pl-2.5 max-sm:pr-0 pb-0">
      {isCreatePool && <CreatePool isCreatePool={isCreatePool} setIsCreatePool={setIsCreatePool} />}
      <DepositWithdrawSlider />
      <DocsBanner />
      <div className="relative mb-3.75">
        <div className="flex flex-row items-center mb-1.5">
          <Icon
            src={`img/assets/${isProMode ? `pro_${mode}` : `lite_${mode}`}.svg`}
            size="sm"
            className="mr-1.5">
          </Icon>
          <h4 className="text-tiny font-semibold dark:text-grey-8 text-black-4">{isProMode ? 'PRO' : 'LITE'}</h4>
        </div>
        {isProMode && (
          <div className="flex flex-row items-center mb-1.5">
            <h4
              className={cn(
                `cursor-pointer mr-2 text-average font-semibold dark:text-grey-1 text-grey-9 
                 ${!isPortfolio && `dark:!text-white !underline !text-blue-1`
                }`
              )}
              onClick={() => {
                setIsPortfolio.off()
                setPool(poolType?.primary)
              }}
            >
              Pools
            </h4>
            <h4
              className={cn(
                `cursor-pointer mr-2 text-average font-semibold dark:text-grey-1 text-grey-9 
                ${isPortfolio && `!underline !text-blue-1 dark:!text-white`
                }`
              )}
              onClick={() => {
                setIsPortfolio.on()
                setPool(poolType?.primary)
              }}
            >
              Portfolio
            </h4>
          </div>
        )}
        <div className="mb-1.5 dark:text-grey-2 text-grey-1 text-regular font-semibold">
          {!isPortfolio
            ? 'Provide liquidity and earn fees'
            : 'All your deposits, rewards and advance metrics in one place.'}
        </div>
        <Button
          className="cursor-pointer absolute right-0 top-0"
          colorScheme={'blue'}
          variant={'secondary'}
          iconRight={
            <Icon src="/img/assets/arrowcircle-dark.svg" alt="?-icon" className="max-sm:mr-2.5" size="sm" />
          }
          onClick={() => setIsCreatePool(true)}
        >
          Create Pool
        </Button>
      </div>
      {!isPortfolio && (
        <div className={`flex flex-row relative items-center no-scrollbar gap-2.5 overflow-x-scroll`}>
          {isProMode && (
            <RadioOptionGroup
              optionSize={isMobile ? 'xl' : 'sm'}
              defaultValue={'24h'}
              orientation={'vertical'}
              className={'gap-0'}
              options={options}
            />
          )}
          <div className="flex flex-row gap-2.5 self-stretch">
            {infoCards?.map((card) => (
              <Container
                key={card.name}
                className={'w-[130px] justify-center h-full'}
                colorScheme={'primaryGradient'}
                size={'lg'}
              >
                <ContainerTitle className={'z-[1]'}>
                  <Tooltip>
                    <TooltipTrigger className={cn(`text-grey-1 dark:text-grey-2 !cursor-pointer
                    text-tiny font-semibold`,
                    card.tooltip.trim() && `underline decoration-dotted mb-1 underline-offset-4`
                    )}
                                    disabled={!(card.tooltip.trim())}>
                        {card?.name}:
                    </TooltipTrigger>
                    <TooltipContent>
                      {card.tooltip}
                    </TooltipContent>
                  </Tooltip>
                  &nbsp;
                </ContainerTitle>
                <h2> {card.value}</h2>
              </Container>
            ))}
            {isProMode && (
              <div className="flex flex-col justify-around">
                <div className="text-lg font-semibold font-poppins dark:text-grey-8 text-black-4">
                  More metrics?
                </div>
                <div
                  className="text-regular font-semibold dark:text-white text-blue-1 underline cursor-pointer"
                  onClick={() => {
                    setIsPortfolio.on()
                    setPool(poolType?.primary)
                  }}
                >
                  Go to Portfolio
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
