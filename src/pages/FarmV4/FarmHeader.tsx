import React, { FC, Fragment, useMemo, useState } from 'react'
import { useConnectionConfig, useDarkMode, useGamma } from '../../context'
import { bigNumberFormatter, truncateBigNumber } from '../../utils'
import { useWallet } from '@solana/wallet-adapter-react'
import {
  Button,
  cn,
  Container,
  ContainerTitle,
  DropdownMenuTrigger,
  DropdownMenu,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  Icon
} from 'gfx-component-lib'
import useBreakPoint from '@/hooks/useBreakPoint'
import { DepositWithdrawSlider } from '../FarmV4/DepositWithdrawSlider'
import RadioOptionGroup from '@/components/common/RadioOptionGroup'
import DocsBanner from './DocsBanner'
import { CreatePool } from './CreatePool'
import BigNumber from 'bignumber.js'
import { TokenRewardsDrawer } from '@/components/token-rewards'
import useStatsQuery from '@/queries/GAMMA/useStatsQuery'
import RewardsPrograms from '@/components/marketingCollabs/RewardsPrograms'

export const FarmHeader: FC = () => {
  const {
    viewRange: range,
    computedViewRange,
    setViewRange: setRange,
    setIsPortfolio,
    isPortfolio,
    setShowDeposited,
    setShowCreatedPools
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
        value: "0",
        label: '24H',
        onClick: () => setRange(0)
      },
      {
        value: "1",
        label: '7D',
        onClick: () => setRange(1),
        className: 'hidden min-md:inline-block'
      },
      {
        value: "2",
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
                    if (isPortfolio) {
                      setShowDeposited(false)
                      setShowCreatedPools(false)
                    }
                    setIsPortfolio.off()
                  }
                },
                {
                  value: 'Portfolio',
                  label: 'Portfolio',
                  onClick: () => {
                    setShowDeposited(false)
                    setShowCreatedPools(false)
                    setRange(0)
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
        <CreateDropdownMenu
          gammaBoostedRewardsIsActive={gammaBoostedRewardsIsActive}
          setOpenRewardsDrawer={setOpenRewardsDrawer}
          setIsCreatePool={setIsCreatePool}
        />
      </div>

      {!isPortfolio && (
        <div
          className={`flex flex-row relative items-center no-scrollbar gap-2.5 
          overflow-x-scroll pl-5 max-sm:pl-2.5 pr-0`}
        >
          <RadioOptionGroup
            optionSize={isMobile ? 'xl' : 'sm'}
            defaultValue={'0'}
            orientation={'vertical'}
            className={'gap-0'}
            options={options}
            value={range.toString()}
          />
          <div className="flex flex-row gap-2.5 self-stretch">
            {infoCards?.map((card, index) =>
              card.name === '24H Fees' ? (
                <Fragment key={`empty-${index}`}></Fragment>
              ) : (
                <Container
                  key={`${card.name}-${index}`}
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
              )
            )}
          </div>
        </div>
      )}
      {!isPortfolio && <RewardsPrograms />}
    </div>
  )
}

const CreateDropdownMenu = ({
  gammaBoostedRewardsIsActive,
  setOpenRewardsDrawer,
  setIsCreatePool
}: {
  gammaBoostedRewardsIsActive: boolean
  setOpenRewardsDrawer: (open: boolean) => void
  setIsCreatePool: (open: boolean) => void
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const { mode } = useDarkMode()

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          className="pr-2 cursor-pointer absolute right-5 max-sm:right-[8px] top-0"
          colorScheme={'blue'}
          variant={'secondary'}
        >
          Create
          <Icon
            className={`${isOpen ? '' : 'rotate-180'}`}
            src="/img/assets/dropdown-chevron-white.svg"
            alt="dropdown-icon"
            size="sm"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[258px]">
        <DropdownMenuItem
          onClick={() => {
            setIsCreatePool(true)
          }}
        >
          <div className={`rounded-sm transition-colors text-left cursor-pointer flex flex-row gap-2`}>
            <Icon
              src={`/img/assets/create-pool-${mode}.svg`}
              alt="Rewards"
              className="w-[20px] h-[20px] max-w-[20px] max-h-[20px]"
            />
            <div className="flex flex-col gap-1">
              <h3
                className="text-base font-semibold font-sans 
                        text-text-lightmode-primary dark:text-text-darkmode-primary"
              >
                Create a Pool
              </h3>
              <p
                className="text-sm text-text-lightmode-secondary 
                dark:text-text-darkmode-secondary whitespace-normal"
              >
                Easily create a new liquidity pool by depositing tokens. Pair assets, and earn trading fees from
                every transaction.
              </p>
            </div>
          </div>
        </DropdownMenuItem>
        {gammaBoostedRewardsIsActive && (
          <DropdownMenuItem
            onClick={() => {
              setOpenRewardsDrawer(true)
            }}
          >
            <div className={`rounded-sm transition-colors text-left cursor-pointer flex flex-row gap-2`}>
              <Icon
                src={`/img/assets/token-rewards-${mode}.svg`}
                alt="Rewards"
                className="w-[20px] h-[20px] max-w-[20px] max-h-[20px]"
              />
              <div className="flex flex-col gap-1">
                <h3
                  className="text-base font-semibold font-sans 
                        text-text-lightmode-primary dark:text-text-darkmode-primary"
                >
                  Add Token Rewards
                </h3>
                <p
                  className="text-sm text-text-lightmode-secondary 
                dark:text-text-darkmode-secondary whitespace-normal"
                >
                  Add additional token emissions as rewards to LPs in any pool. These boosted rewards accrue extra
                  yield for LPs.
                </p>
              </div>
            </div>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
