import { FC, useMemo, useState } from 'react'
import { ChoosePool } from './ChoosePool'
import { usePriceFeedFarm, useSSLContext } from '../../context'
import { truncateBigNumber } from '../../utils'
import { SSLToken } from './constants'
import { getPriceObject } from '../../web3'
import { isEmpty } from 'lodash'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button, Container, ContainerTitle, IconTooltip } from 'gfx-component-lib'
import useBreakPoint from '@/hooks/useBreakPoint'
import RadioOptionGroup from '@/components/common/RadioOptionGroup'

const getTooltipText = (index: number) => {
  let tooltipText = ''
  if (index === 0)
    tooltipText = 'Total rewards earned by the user by providing liquidity in our SSL Pools, displayed in USD'
  else if (index === 1) tooltipText = 'TVL represents the total USD value of all assets locked in our SSL Pools'
  else if (index === 2)
    tooltipText = 'Volume generated between different time intervals. Volume is reset everyday at 10PM UTC'
  else if (index === 3)
    tooltipText = 'Fees earned by the pools between different time intervals. Fees are reset everyday at 10PM UTC'
  return <span tw="dark:text-black-4 text-grey-5 font-medium text-tiny">{tooltipText}</span>
}

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
  const { wallet } = useWallet()
  const [poolSelectionModal, setPoolSelectionModal] = useState<boolean>(false)
  const userPubKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter?.publicKey])
  const { isMobile } = useBreakPoint()

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
    <div
      className={`flex flex-row relative items-center no-scrollbar gap-2.5 overflow-x-scroll
      p-5 sm:pl-2.5 sm:pr-0 pb-3
      `}
    >
      {poolSelectionModal && (
        <ChoosePool poolSelectionModal={poolSelectionModal} setPoolSelectionModal={setPoolSelectionModal} />
      )}
      <RadioOptionGroup
        optionSize={isMobile ? 'lg' : 'sm'}
        defaultValue={'24h'}
        orientation={'vertical'}
        className={'gap-0'}
        options={[
          {
            value: '24h',
            label: '24H',
            onClick: () => setRange(0)
          },
          {
            value: '7D',
            label: '7D',
            onClick: () => setRange(1)
          },
          {
            value: 'all',
            label: 'All',
            onClick: () => setRange(2)
          }
        ]}
      />

      <div className="flex flex-row gap-2.5">
        {infoCards?.map((card, index) => (
          <Container key={card?.name} className={'w-[130px]'} colorScheme={'secondaryGradient'} size={'lg'}>
            <ContainerTitle>
              <h4 className="text-tiny font-semibold text-grey-1 dark:text-grey-2">{card?.name}:</h4>
              &nbsp;
              <IconTooltip tooltipType={'outline'}>{getTooltipText(userPubKey ? index : index + 1)}</IconTooltip>
            </ContainerTitle>
            <h2> {card.value}</h2>
          </Container>
        ))}
      </div>
      <Button className="cursor-pointer ml-2.5 p-0" variant={'ghost'} onClick={() => setPoolSelectionModal(true)}>
        <img
          src="/img/assets/question-icn.svg"
          alt="?-icon"
          className="sm:h-[30px] sm:w-[30px] sm:max-w-[30px] sm:mr-2.5"
        />
      </Button>
    </div>
  )
}
