import { FC, useMemo, useState } from 'react'
import { useConnectionConfig, useGamma } from '../../context'
import { bigNumberFormatter, truncateBigNumber } from '../../utils'
import { POOL_TYPE } from './constants'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button, cn, Container, ContainerTitle, Tooltip, TooltipContent, TooltipTrigger } from 'gfx-component-lib'
import useBreakPoint from '@/hooks/useBreakPoint'
import { DepositWithdrawSlider } from '../FarmV4/DepositWithdrawSlider'
import RadioOptionGroup from '@/components/common/RadioOptionGroup'
import DocsBanner from './DocsBanner'
import { CreatePool } from './CreatePool'
import BigNumber from 'bignumber.js'
import { TokenRewardsDrawer } from '@/components/token-rewards'
import useStatsQuery from '@/queries/GAMMA/useStatsQuery'

export const FarmHeader: FC = () => {
  const {
    viewRange: range,
    computedViewRange,
    setViewRange: setRange,
    setIsPortfolio,
    isPortfolio,
    setCurrentPoolType,
    setCurrentSort
  } = useGamma()
  const statsQuery = useStatsQuery()
  const { wallet } = useWallet()
  const userPubKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter?.publicKey])
  const { isMobile } = useBreakPoint()
  const [isCreatePool, setIsCreatePool] = useState<boolean>(false)
  const [openRewardsDrawer, setOpenRewardsDrawer] = useState<boolean>(false)
  const { gammaBoostedRewardsIsActive } = useConnectionConfig()

  const totalEarnings = useMemo(() => {
    const number = 0.0
    return truncateBigNumber(number)
  }, [])

  const infoCards = useMemo(() => {
    const data = [
      {
        name: 'TVL',
        value: bigNumberFormatter(BigNumber.max(0, new BigNumber(statsQuery.data?.tvl))),
        tooltip: 'TVL represents the total USD value of all assets deposited in our pools'
      },
      {
        name: `${computedViewRange} Volume`,
        value:
          range === 0
            ? bigNumberFormatter(BigNumber.max(0, new BigNumber(statsQuery.data?.stats24h?.volume)))
            : range === 1
            ? bigNumberFormatter(BigNumber.max(0, new BigNumber(statsQuery.data?.stats7d?.volume)))
            : bigNumberFormatter(BigNumber.max(0, new BigNumber(statsQuery.data?.stats30d?.volume))),
        tooltip: ''
      },
      {
        name: `${computedViewRange} Fees`,
        value:
          range === 0
            ? bigNumberFormatter(BigNumber.max(0, new BigNumber(statsQuery.data?.stats24h?.fees)))
            : range === 1
            ? bigNumberFormatter(BigNumber.max(0, new BigNumber(statsQuery.data?.stats7d?.fees)))
            : bigNumberFormatter(BigNumber.max(0, new BigNumber(statsQuery.data?.stats30d?.fees))),
        tooltip: ''
      }
    ]
    // if (userPubKey) {
    //   data.unshift({
    //     name: 'Total Earned', value: totalEarnings.toString(),
    //     tooltip: ''
    //   })
    // }
    return data
  }, [userPubKey, range, totalEarnings, computedViewRange, statsQuery.data])

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
    <div className="mt-[15px]">
      <TokenRewardsDrawer isOpen={openRewardsDrawer} setOpen={setOpenRewardsDrawer} />
      <CreatePool isCreatePool={isCreatePool} setIsCreatePool={setIsCreatePool} />
      <DepositWithdrawSlider />

      <div className={'max-sm:px-2.5 px-5'}>
        <DocsBanner />
      </div>
      <div className="mb-3.75 max-sm:px-2.5 px-5 relative">
        {/* <div className="flex flex-row items-center mb-1.5">
          <Icon
            src={`img/assets/${isCardMode ? `pro_${mode}` : `lite_${mode}`}.svg`}
            size="sm"
            className="mr-1.5"
          ></Icon>
          <h4 className="text-tiny font-semibold dark:text-grey-8 text-black-4">{isCardMode ? 'PRO' : 'LITE'}</h4>
        </div> */}
        <div>
          <div className="flex flex-row items-center mb-1.5">
            <RadioOptionGroup
              defaultValue={'Pools'}
              value={isPortfolio ? 'Portfolio' : 'Pools'}
              className={`w-full min-md:w-max gap-1.25 max-sm:gap-0 max-sm:grid-cols-3 
                sm-lg:gap-0 sm-lg:grid-cols-3 min-md:mr-2 items-center`}
              optionClassName={`min-md:w-[85px]`}
              options={[
                {
                  value: 'Pools',
                  label: 'Pools',
                  onClick: () => {
                    setCurrentSort('1')
                    setCurrentPoolType(POOL_TYPE.primary)
                    setIsPortfolio.off()
                  }
                },
                {
                  value: 'Portfolio',
                  label: 'Portfolio',
                  onClick: () => {
                    setCurrentSort('5')
                    setCurrentPoolType(POOL_TYPE.all)
                    setIsPortfolio.on()
                  }
                }
              ]}
            />
          </div>

          <div className="mb-1.5 dark:text-grey-2 text-grey-1 text-regular font-semibold">
            {!isPortfolio
              ? 'Provide liquidity and earn fees'
              : 'All your deposits, rewards and advance metrics in one place.'}
          </div>
        </div>

        {!isMobile && (
          <div className="flex flex-row items-center absolute right-[20px] top-0 max-sm:right-[6px]">
            {(gammaBoostedRewardsIsActive === null || gammaBoostedRewardsIsActive === true) && (
              <Button
                className="cursor-pointer mr-2"
                colorScheme={'blue'}
                variant={'secondary'}
                //iconRight={<Icon src="/img/assets/arrowcircle-dark.svg" alt="?-icon" size="sm" />}
                onClick={() => setOpenRewardsDrawer(true)}
              >
                Token Rewards
              </Button>
            )}
            <Button
              className="cursor-pointer mr-2"
              colorScheme={'blue'}
              variant={'secondary'}
              //iconRight={<Icon src="/img/assets/arrowcircle-dark.svg" alt="?-icon" size="sm" />}
              onClick={() => setIsCreatePool(true)}
            >
              New Pool
            </Button>
            <img
              src="img/assets/question-icn.svg"
              alt="primary"
              height={35}
              width={35}
              onClick={() => window.open('https://www.goosefx.io/gamma#faqs')}
              className="cursor-pointer "
            />
          </div>
        )}
      </div>

      {!isPortfolio && (
        <div
          className={`flex flex-row relative items-center no-scrollbar gap-2.5 
          overflow-x-scroll pl-5 max-sm:pl-2.5 pr-0`}
        >
          <RadioOptionGroup
            optionSize={isMobile ? 'xl' : 'sm'}
            defaultValue={'24h'}
            orientation={'vertical'}
            className={'gap-0'}
            options={options}
          />
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
                    <TooltipTrigger
                      className={cn(
                        `text-grey-1 dark:text-grey-2 !cursor-pointer
                    text-tiny font-semibold no-underline`,
                        card.tooltip.trim() && `underline decoration-dotted mb-1 underline-offset-4`
                      )}
                      disabled={!card.tooltip.trim()}
                    >
                      {card?.name}:
                    </TooltipTrigger>
                    <TooltipContent>{card.tooltip}</TooltipContent>
                  </Tooltip>
                  &nbsp;
                </ContainerTitle>
                <h2>$ {card.value}</h2>
              </Container>
            ))}
            {/* {isCardMode && (
              <div className="flex flex-col justify-around">
                <div className="text-lg font-semibold font-poppins dark:text-grey-8 text-black-4">
                  More metrics?
                </div>
                <div
                  className="text-regular font-semibold dark:text-white text-blue-1 underline cursor-pointer"
                  onClick={() => {
                    setIsPortfolio.on()
                    setCurrentPoolType(POOL_TYPE?.all)
                  }}
                >
                  Go to Portfolio
                </div>
              </div>
            )} */}
          </div>
        </div>
      )}

      {isMobile &&
        !isPortfolio && (
          <div className="flex flex-row items-center justify-between mt-5 px-2">
            {(gammaBoostedRewardsIsActive === null || gammaBoostedRewardsIsActive === true) && (
              <Button
                className="cursor-pointer mr-2 w-full"
                colorScheme={'blue'}
                variant={'secondary'}
                //iconRight={<Icon src="/img/assets/arrowcircle-dark.svg" alt="?-icon" size="sm" />}
                onClick={() => setOpenRewardsDrawer(true)}
              >
                Token Rewards
              </Button>
            )}
            <Button
              className="cursor-pointer mr-2 w-full"
              colorScheme={'blue'}
              variant={'secondary'}
              //iconRight={<Icon src="/img/assets/arrowcircle-dark.svg" alt="?-icon" size="sm" />}
              onClick={() => setIsCreatePool(true)}
            >
              New Pool
            </Button>
            <img
              src="img/assets/question-icn.svg"
              alt="primary"
              height={35}
              width={35}
              onClick={() => window.open('https://www.goosefx.io/gamma#faqs')}
              className="cursor-pointer "
            />
          </div>
        )}
    </div>
  )
}
