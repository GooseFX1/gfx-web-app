import React, { FC, useEffect, useMemo, useState } from 'react'
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { Loader, ShowDepositedToggle, SkeletonCommon } from '../../components'
import {
  APP_RPC,
  useAccounts,
  useConnectionConfig,
  useDarkMode,
  usePriceFeedFarm,
  useSSLContext
} from '../../context'
import {
  checkMobile,
  formatUserBalance,
  notify,
  numberFormatter,
  truncateBigNumber,
  truncateBigString,
  withdrawBigString
} from '../../utils'
import useBreakPoint from '../../hooks/useBreakPoint'
import { CircularArrow } from '../../components/common/Arrow'
import { OracleIcon } from './ExpandedView'
import {
  SSLToken,
  poolType,
  Pool,
  ModeOfOperation,
  insufficientSOLMsg,
  depositCapError,
  genericErrMsg,
  invalidInputErrMsg,
  invalidDepositErrMsg,
  sslSuccessfulMessage,
  sslErrorMessage
} from './constants'
import { useWallet } from '@solana/wallet-adapter-react'
import Lottie from 'lottie-react'
import NoResultFarmdark from '../../animations/NoResultFarmdark.json'
import NoResultFarmlite from '../../animations/NoResultFarmlite.json'
import { executeClaimRewards, executeDeposit, executeWithdraw, getPriceObject } from '../../web3'
import { StatsModal } from './StatsModal'
import { USER_CONFIG_CACHE } from '../../types/app_params'
import BN from 'bn.js'
import { AllClaimModal } from './AllClaimModal'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  cn,
  Icon,
  IconTooltip,
  RoundedGradientInner,
  RoundedGradientWrapper,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from 'gfx-component-lib'
import { Connect } from '@/layouts'
import TokenInput from '@/components/common/TokenInput'
import RadioOptionGroup from '@/components/common/RadioOptionGroup'
import SearchBar from '@/components/common/SearchBar'
import useSolSub from '@/hooks/useSolSub'
import { ActionModal } from '@/pages/FarmV3/ActionModal'

export const FarmTable: FC = () => {
  const { mode } = useDarkMode()
  const existingUserCache: USER_CONFIG_CACHE = JSON.parse(window.localStorage.getItem('gfx-user-cache'))

  const breakpoint = useBreakPoint()
  const { wallet } = useWallet()
  const {
    operationPending,
    pool,
    setPool,
    sslData,
    filteredLiquidityAccounts,
    sslTableData,
    liquidityAmount,
    setIsFirstPoolOpen,
    rewards,
    allPoolSslData
  } = useSSLContext()
  const [searchTokens, setSearchTokens] = useState<string>('')
  const [initialLoad, setInitialLoad] = useState<boolean>(true)
  const [showDeposited, setShowDeposited] = useState<boolean>(existingUserCache.farm.showDepositedFilter)
  const [sort, setSort] = useState<string>('ASC')
  const [sortType, setSortType] = useState<string>(null)
  const { prices } = usePriceFeedFarm()
  const [allClaimModal, setAllClaimModal] = useState<boolean>(false)

  const pubKey: PublicKey | null = useMemo(
    () => (wallet?.adapter?.publicKey ? wallet?.adapter?.publicKey : null),
    [wallet?.adapter?.publicKey]
  )

  const numberOfCoinsDeposited = useMemo(() => {
    const count = sslData.reduce((accumulator, data) => {
      const amountInNative = filteredLiquidityAccounts[data?.mint?.toBase58()]?.amountDeposited?.toString()
      const amountInUSD = truncateBigString(amountInNative, data?.mintDecimals)
      if (amountInUSD && amountInUSD !== '0.00') {
        return accumulator + 1
      }
      return accumulator
    }, 0)
    return count
  }, [pool, filteredLiquidityAccounts, sslData, pubKey])

  const farmTableRow = useMemo(
    () =>
      sslData.map((token: SSLToken) => {
        const tokenName = token?.token === 'SOL' ? 'WSOL' : token?.token
        const apy = Number(sslTableData?.[tokenName]?.apy)
        const volume = sslTableData?.[tokenName]?.volume / 1_000_000
        const nativeFees = sslTableData?.[tokenName]?.fee / 10 ** token?.mintDecimals
        const feesInUSD =
          prices[getPriceObject(token?.token)]?.current &&
          prices[getPriceObject(token?.token)]?.current * nativeFees
        const nativeLiquidity = liquidityAmount?.[token?.mint?.toBase58()]
        const liquidityInUSD =
          prices[getPriceObject(token?.token)]?.current &&
          prices[getPriceObject(token?.token)]?.current * nativeLiquidity
        const account = filteredLiquidityAccounts[token?.mint?.toBase58()]
        const amountDeposited = formatUserBalance(account?.amountDeposited?.toString(), token?.mintDecimals)
        const beforeDecimal = amountDeposited?.beforeDecimalBN
        const dataObj = {
          ...token,
          apy: apy,
          volume: volume,
          fee: feesInUSD,
          liquidity: liquidityInUSD,
          beforeDecimal: beforeDecimal
        }
        return dataObj
      }),
    [sslData, sslTableData, liquidityAmount, filteredLiquidityAccounts]
  )

  const filteredTokens = useMemo(
    () =>
      searchTokens
        ? farmTableRow.filter((token) =>
            token?.token?.toLocaleLowerCase().includes(searchTokens?.toLocaleLowerCase())
          )
        : [...farmTableRow],
    [searchTokens, farmTableRow, sort]
  )

  useEffect(() => {
    if (pubKey === null)
      setShowDeposited(() => {
        window.localStorage.setItem(
          'gfx-user-cache',
          JSON.stringify({
            ...existingUserCache,
            farm: { ...existingUserCache.farm, showDepositedFilter: false }
          })
        )
        return false
      })
  }, [pubKey])

  useEffect(() => {
    sslData?.length && setInitialLoad(false)
  }, [sslData])

  const poolSize = useMemo(
    () => (showDeposited ? numberOfCoinsDeposited : filteredTokens?.length),
    [showDeposited, numberOfCoinsDeposited, filteredTokens]
  )

  const sortUserBalances = (sortValue: string) => {
    farmTableRow.sort((a, b) => {
      let firstBN = a?.beforeDecimal
      let secondBN = b?.beforeDecimal
      if (!firstBN) firstBN = new BN(0)
      if (!secondBN) secondBN = new BN(0)
      if (sort === 'DESC') return firstBN.gt(secondBN) ? -1 : 1
      else return firstBN.lt(secondBN) ? -1 : 1
    })
    setSort((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))
    setSortType(sortValue)
  }

  const initiateGlobalSearch = (value: string) => {
    setIsFirstPoolOpen(false)
    setPool(poolType.all)
    setSearchTokens(value)
  }

  const handleColumnSort = (sortValue: string) => {
    if (sortValue === 'balance') {
      sortUserBalances(sortValue)
      return
    }
    farmTableRow.sort((a, b) => {
      if (sort === 'DESC') return a[sortValue] > b[sortValue] ? -1 : 1
      else return a[sortValue] > b[sortValue] ? 1 : -1
    })
    setSort((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))
    setSortType(sortValue)
  }

  const handleToggle = (pooltype: Pool) => {
    setPool(pooltype)
    setIsFirstPoolOpen(false)
  }

  const handleShowDepositedToggle = () => {
    setShowDeposited((prev) => {
      window.localStorage.setItem(
        'gfx-user-cache',
        JSON.stringify({
          ...existingUserCache,
          farm: { ...existingUserCache.farm, showDepositedFilter: !prev }
        })
      )
      return !prev
    })
    setIsFirstPoolOpen(false)
  }

  const isClaimable = useMemo(
    () =>
      allPoolSslData.reduce((accumulator, current) => {
        const tokenMintAddress = current?.mint?.toBase58()
        const reward = rewards[tokenMintAddress]?.toNumber() / Math.pow(10, current?.mintDecimals)
        if (reward) return accumulator + 1
        return accumulator
      }, 0),
    [allPoolSslData, rewards]
  )

  const claimableRewardArray = useMemo(
    () =>
      allPoolSslData.map((token) => {
        const tokenName = token?.token
        const tokenMintAddress = token?.mint?.toBase58()
        const reward = rewards[tokenMintAddress]?.toNumber() / Math.pow(10, token?.mintDecimals)
        return { tokenName, reward }
      }),
    [allPoolSslData, rewards]
  )
  return (
    <div className={'flex flex-col gap-3.75'}>
      {allClaimModal && (
        <AllClaimModal
          allClaimModal={allClaimModal}
          setAllClaimModal={setAllClaimModal}
          rewardsArray={claimableRewardArray}
        />
      )}
      <div className="flex flex-row justify-between items-center mb-3.75 sm:pr-4">
        <div className="flex flex-row items-center">
          <img
            src={`/img/assets/${pool.name}_pools_${mode}.svg`}
            alt="pool-icon"
            className="h-[55px] w-[50px] mr-3.75 duration-500 sm:h-[45] sm:w-[40px]"
          />
          <div className="flex flex-col">
            <h2
              className="text-average font-semibold dark:text-grey-5 text-black-4 capitalize
              sm:text-average sm:mb-0 sm:leading-[22px]"
            >
              {pool.name} Pools
            </h2>
            <p className="text-average font-medium text-grey-1 dark:text-grey-2 sm:text-tiny sm:leading-5">
              {pool.desc}
            </p>
          </div>
        </div>
        {checkMobile() && isClaimable && pubKey && (
          <RoundedGradientWrapper className={'cursor-pointer'} onClick={() => setAllClaimModal(true)} animated>
            <RoundedGradientInner
              className={`dark:bg-background-darkmode-primary bg-background-lightmode-primary
             rounded-circle flex sm:w-full items-center justify-center dark:text-white text-text-lightmode-primary 
              font-bold`}
            >
              Claim All
            </RoundedGradientInner>
          </RoundedGradientWrapper>
        )}
      </div>
      <div className="flex items-center gap-3.75">
        <RadioOptionGroup
          defaultValue={'all_pools'}
          className={'w-full min-md:w-max gap-1.25 '}
          optionClassName={`min-md:w-[85px]`}
          options={[
            {
              value: 'all_pools',
              label: 'All Pools',
              onClick: () => (operationPending ? null : handleToggle(poolType.all))
            },
            {
              value: 'Stable',
              label: 'Stable',
              onClick: () => (operationPending ? null : handleToggle(poolType.stable))
            },
            {
              value: 'Primary',
              label: 'Primary',
              onClick: () => (operationPending ? null : handleToggle(poolType.primary))
            },
            {
              value: 'Hyper',
              label: 'Hyper',
              onClick: () => (operationPending ? null : handleToggle(poolType.hyper))
            }
          ]}
        />

        {breakpoint.isDesktop && (
          <div className="flex items-center w-full gap-3.75">
            <SearchBar
              onChange={(e) => initiateGlobalSearch(e.target.value)}
              onClear={() => setSearchTokens('')}
              value={searchTokens}
            />
            <div className={'flex flex-row ml-auto gap-3.75'}>
              {isClaimable > 0 && pubKey != null && (
                <RoundedGradientWrapper
                  className={'h-[33px] w-[83px] cursor-pointer'}
                  onClick={() => setAllClaimModal(true)}
                  animated
                >
                  <RoundedGradientInner
                    className={`dark:bg-background-darkmode-primary bg-background-lightmode-primary rounded-circle flex
                sm:w-full items-center justify-center dark:text-white text-text-lightmode-primary 
                font-bold`}
                    borderWidth={'1.5'}
                  >
                    Claim All
                  </RoundedGradientInner>
                </RoundedGradientWrapper>
              )}
              {pubKey != null && (
                <div className={cn('flex items-center mr-2', isClaimable ? `ml-0` : `ml-auto`)}>
                  <ShowDepositedToggle enabled={showDeposited} setEnable={handleShowDepositedToggle} />
                  <div
                    className="h-8.75 leading-5 text-regular text-right dark:text-grey-2 text-grey-1
               font-semibold mt-[-4px] ml-3.75"
                  >
                    Show <br /> Deposited
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {breakpoint.isMobile && (
        <div className="flex flex-row mt-4">
          <SearchBar
            className={pubKey ? 'w-[55%]' : 'w-[95%]'}
            onChange={(e) => initiateGlobalSearch(e.target.value)}
            onClear={() => setSearchTokens('')}
            value={searchTokens}
          />
          {pubKey && (
            <div className="ml-auto flex items-center mr-2">
              <Switch variant={'default'} onClick={handleShowDepositedToggle} />
              <div
                className={`h-8.75 leading-5 text-regular sm:text-tiny sm:leading-[18px] text-right dark:text-grey-2 
                text-grey-1 font-semibold mt-[-4px] ml-2.5 sm:ml-2`}
              >
                Show <br /> Deposited
              </div>
            </div>
          )}
        </div>
      )}
      <FarmFilter poolSize={poolSize} sort={sort} sortType={sortType} handleColumnSort={handleColumnSort} />

      {initialLoad ? (
        <SkeletonCommon height="100px" style={{ marginTop: '15px' }} />
      ) : (
        <NewFarm
          tokens={filteredTokens}
          numberOfCoinsDeposited={numberOfCoinsDeposited}
          searchTokens={searchTokens}
          showDeposited={showDeposited}
        />
      )}
    </div>
  )
}

const NoResultsFound: FC<{ str?: string; subText?: string; requestPool?: boolean }> = ({
  str,
  subText,
  requestPool
}) => {
  const { mode } = useDarkMode()
  return (
    <div css={cn(` flex flex-col mt-[30px] sm:mt-0`, requestPool ? `h-[258px]` : `h-[208px]`)}>
      <div
        tw="!h-[97px] sm:h-[81px]  flex flex-row justify-center items-center text-regular font-semibold 
          dark:text-white text-black"
      >
        <Lottie
          animationData={mode === 'dark' ? NoResultFarmdark : NoResultFarmlite}
          className="h-[97px] sm:h-[81px] w-[168px] mx-auto"
        />
      </div>
      <div className="flex items-center flex-col">
        <div className="text-[20px] font-semibold text-black-4 dark:text-grey-5 mt-3"> {str}</div>
        <div className="text-regular w-[214px] text-center mt-[15px] text-grey-1 dark:text-grey-2">{subText}</div>
        {requestPool && (
          <address
            className="w-[219px] h-8.75 cursor-pointer flex items-center justify-center mt-4 text-regular
            rounded-[30px] font-semibold bg-gradient-1 text-white"
          >
            <a
              href="https://discord.gg/cDEPXpY26q"
              className="font-semibold text-white"
              target="_blank"
              rel="noreferrer"
            >
              Request Pool
            </a>
          </address>
        )}
      </div>
    </div>
  )
}

const FarmItemHead = ({
  icon,
  canClaim,
  token,
  tooltip,
  apy,
  liquidity,
  volume,
  fees,
  balance
}: {
  icon: string
  canClaim: boolean
  token: React.ReactNode
  tooltip: React.ReactNode
  apy: React.ReactNode
  liquidity: React.ReactNode
  volume: React.ReactNode
  fees: React.ReactNode
  balance: React.ReactNode
}) => {
  const { isMobile, isTablet } = useBreakPoint()
  return (
    <AccordionTrigger
      className={cn(`grid grid-cols-7 `, isMobile && `grid-cols-3`, isTablet && `grid-cols-4`)}
      indicator={<></>}
      variant={'secondary'}
    >
      <div className={'flex flex-row items-center gap-2.5'}>
        <div className={'relative'}>
          <Icon src={icon} size={'lg'} />
          {canClaim && <span className={'absolute rounded-full bg-background-red w-3 h-3 top-0 right-0'} />}
        </div>
        <h4 className={'text-start dark:text-text-darkmode-primary text-text-lightmode-primary'}>{token}</h4>
        <IconTooltip tooltipType={'outline'}>{tooltip}</IconTooltip>
      </div>
      <h4 className={'text-center dark:text-text-darkmode-primary text-text-lightmode-primary'}>{apy}</h4>
      {!isMobile && (
        <>
          {!isTablet && (
            <>
              <h4 className={'text-center dark:text-text-darkmode-primary text-text-lightmode-primary'}>
                {liquidity}
              </h4>
              <h4 className={'text-center dark:text-text-darkmode-primary text-text-lightmode-primary'}>
                {volume}
              </h4>
              <h4 className={'text-center dark:text-text-darkmode-primary text-text-lightmode-primary'}>{fees}</h4>
            </>
          )}
          <h4 className={'text-center dark:text-text-darkmode-primary text-text-lightmode-primary'}>{balance}</h4>
        </>
      )}
      <div className={'w-5  ml-auto'}>
        <CircularArrow className={`h-5 w-5`} />
      </div>
    </AccordionTrigger>
  )
}
const FarmRowItem = ({
  title,
  onClick,
  className,
  invert,
  tooltip
}: {
  title: string
  onClick: () => void
  className?: string
  invert?: boolean
  tooltip?: React.ReactNode
}) => {
  const Comp = (
    <Button
      variant={'default'}
      onClick={onClick}
      className={cn(
        `justify-center p-0 break-words text-h4 text-text-lightmode-secondary
      dark:text-text-darkmode-secondary
    `,
        className
      )}
      iconRight={<CircularArrow className={`min-h-5 min-w-5`} invert={invert} />}
    >
      {title}
    </Button>
  )
  return tooltip ? (
    <Tooltip>
      <TooltipTrigger>{Comp}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  ) : (
    Comp
  )
}
const FarmFilter = ({
  sort,
  sortType,
  handleColumnSort,
  poolSize
}: {
  sort: string
  sortType: string
  handleColumnSort: (s: string) => void
  poolSize: number
}) => {
  const { isMobile, isTablet } = useBreakPoint()
  return (
    <div
      className={cn(
        `grid grid-cols-7 border-b-1 border-solid border-border-lightmode-secondary 
      dark:border-border-darkmode-secondary h-10 px-2 items-center`,
        isMobile && `grid-cols-3`,
        isTablet && `grid-cols-4`
      )}
    >
      <FarmRowItem
        title={'Pool'}
        onClick={() => handleColumnSort('token')}
        className={'justify-start'}
        invert={sort == 'DESC' && sortType == 'token'}
      />
      <FarmRowItem
        title={'APY'}
        tooltip={'APY is calculated on a rolling 3 day basis based on TVL/Fees. See FAQ below for more info'}
        onClick={() => handleColumnSort('apy')}
        invert={sort == 'DESC' && sortType == 'apy'}
      />
      {!isMobile && (
        <>
          {!isTablet && (
            <>
              <FarmRowItem
                title={'Liquidity'}
                onClick={() => handleColumnSort('liquidity')}
                invert={sort == 'DESC' && sortType == 'liquidity'}
              />
              <FarmRowItem
                title={'24H Volume'}
                tooltip={'24H Volume is calculated since 10P.M UTC on a daily basis'}
                onClick={() => handleColumnSort('volume')}
                invert={sort == 'DESC' && sortType == 'volume'}
              />
              <FarmRowItem
                title={'24H Fees'}
                onClick={() => handleColumnSort('fee')}
                invert={sort == 'DESC' && sortType == 'fee'}
              />
            </>
          )}
          <FarmRowItem
            title={'My Balance'}
            tooltip={'Values are displayed in native token'}
            onClick={() => handleColumnSort('balance')}
            invert={sort == 'DESC' && sortType == 'balance'}
          />
        </>
      )}
      <h4 className={'text-end self-center text-text-lightmode-secondary dark:text-text-darkmode-secondary'}>
        Pools: {poolSize}
      </h4>
    </div>
  )
}
const FarmBalanceItem = ({
  title,
  value,
  titlePosition = 'text-start',
  asZero,
  includeUSD,
  token
}: {
  title: string
  value: React.ReactNode
  titlePosition?: 'text-end' | 'text-start'
  asZero?: boolean
  includeUSD?: boolean
  token?: string
}) => (
  <div className={cn('flex flex-row md-xl:flex-col md-xl:w-max justify-between md-xl:justify-normal')}>
    <h4 className={cn(`dark:text-grey-8 text-black-4 font-semibold text-regular`, titlePosition)}>{title}</h4>
    {asZero ? (
      <div className={'flex flex-col text-right dark:text-grey-1 text-grey-2 font-semibold text-regular'}>
        0.00 {token}
        {includeUSD && <span>($0.00 USD)</span>}
      </div>
    ) : (
      <div className={cn('text-b2 font-semibold dark:text-grey-8 text-black-4 text-end')}>{value}</div>
    )}
  </div>
)
const NewFarm = ({
  tokens,
  numberOfCoinsDeposited,
  searchTokens,
  showDeposited
}: {
  tokens: SSLToken[]
  numberOfCoinsDeposited: number
  searchTokens: string
  showDeposited: boolean
}) => {
  const [statsModal, setStatsModal] = useState<boolean>(false)

  return (
    <div className={''}>
      {numberOfCoinsDeposited === 0 && showDeposited && searchTokens?.length === 0 && (
        <NoResultsFound
          str="Oops, no pools deposited"
          subText="Don’t worry, explore our pools and start earning!"
        />
      )}
      {tokens?.length === 0 && searchTokens?.length > 0 && (
        <NoResultsFound
          requestPool={true}
          str="Oops, no pools found"
          subText="Don’t worry, there are more pools coming soon..."
        />
      )}
      <Accordion type={'single'} collapsible={true} variant={'secondary'} className={'lg:min-w-full gap-3.75'}>
        {tokens.map((coin) => (
          <AccordionItem value={coin?.token} variant={'secondary'} key={coin?.token}>
            {statsModal && <StatsModal token={coin} statsModal={statsModal} setStatsModal={setStatsModal} />}
            <NewFarmTokenContent coin={coin} />
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

const NewFarmTokenContent = ({ coin }: { coin: SSLToken }) => {
  const { wallet, connected } = useWallet()
  const wal = useWallet()
  const { connection } = useConnectionConfig()
  const slotConnection = new Connection(APP_RPC.endpoint, 'finalized')
  const { prices, SSLProgram } = usePriceFeedFarm()
  const {
    pool,
    operationPending,
    isTxnSuccessfull,
    setOperationPending,
    setIsTxnSuccessfull,
    filteredLiquidityAccounts,
    liquidityAmount,
    sslTableData,
    rewards,
    depositedBalanceConnection,
    connectionId
  } = useSSLContext()
  const userPublicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])
  const walletName = useMemo(() => wallet?.adapter?.name, [wallet?.adapter, wallet?.adapter?.name])
  const tokenMintAddress = useMemo(() => coin?.mint?.toBase58(), [coin])
  const [userSolBalance, setUserSOLBalance] = useState<number>(0)
  const [depositAmount, setDepositAmount] = useState<string>('')
  const [withdrawAmount, setWithdrawAmount] = useState<string>('')
  const [modeOfOperation, setModeOfOperation] = useState<string>(ModeOfOperation.DEPOSIT)
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)
  const [userTokenBalance, setUserTokenBalance] = useState<number>(0)
  const [actionModal, setActionModal] = useState<boolean>(false)
  const [actionType, setActionType] = useState<string>('')
  const [currentSlot, setCurrentSlot] = useState<number>(0)
  const [diffTimer, setDiffTimer] = useState<number>(0)
  const [earlyWithdrawFee, setEarlyWithdrawFee] = useState<number>(0)
  const { getUIAmount } = useAccounts()
  const { off } = useSolSub()
  const { isMobile, isTablet } = useBreakPoint()
  const userDepositedAmount: BN = useMemo(() => {
    const account = filteredLiquidityAccounts?.[tokenMintAddress]
    return account?.amountDeposited
  }, [filteredLiquidityAccounts, tokenMintAddress, isTxnSuccessfull])
  useEffect(() => {
    if (userPublicKey) {
      setUserTokenBalance(getUIAmount(tokenMintAddress))
      if (coin.token === 'SOL') setUserTokenBalance(userSolBalance)
    }
  }, [tokenMintAddress, userPublicKey, isTxnSuccessfull, userSolBalance, getUIAmount])

  useEffect(() => {
    ;(async () => {
      try {
        const slot = await slotConnection.getSlot()
        setCurrentSlot(slot)
      } catch (error) {
        console.error('Error getting current slot:', error)
        setCurrentSlot(0)
      }
    })()
  }, [connection, actionModal])

  const calculateEarlyWithdrawalPenalty = () => {
    const depositSlot = filteredLiquidityAccounts[tokenMintAddress]?.lastDepositAt
    const slotDiff = new BN(currentSlot).sub(depositSlot)?.toNumber()
    //const slotDiff = 117000;
    if (slotDiff < 216000) {
      const decayingFactor = ((216000 - slotDiff) / 216000) ** 2 * (2 / 100)
      const withdrawalFee = decayingFactor * +withdrawAmount
      const countdownUI = Math.floor((216000 - slotDiff) * 0.4)
      const countDownFiveMin = Math.ceil(countdownUI / 300) * 300
      setDiffTimer(countDownFiveMin)
      setEarlyWithdrawFee(withdrawalFee)
    } else {
      setEarlyWithdrawFee(0)
      setDiffTimer(0)
    }
  }

  useEffect(() => {
    ;(async () => {
      if (userPublicKey) {
        const solAmount = await connection.getBalance(userPublicKey)
        setUserSOLBalance(solAmount / LAMPORTS_PER_SOL)
      } else {
        setDepositAmount(null)
        setWithdrawAmount(null)
      }
    })()
  }, [userPublicKey, isTxnSuccessfull])

  const liquidity = useMemo(
    () =>
      prices[getPriceObject(coin?.token)]?.current &&
      prices[getPriceObject(coin?.token)]?.current * liquidityAmount?.[tokenMintAddress],
    [liquidityAmount, tokenMintAddress, isTxnSuccessfull, coin]
  )

  const apiSslData = useMemo(() => {
    try {
      if (sslTableData) {
        const key = coin.token === 'SOL' ? 'WSOL' : coin.token
        const decimal = coin.mintDecimals
        return {
          apy: sslTableData[key]?.apy,
          fee: sslTableData[key]?.fee / 10 ** decimal,
          volume: sslTableData[key]?.volume / 1_000_000
        }
      } else
        return {
          apy: 0,
          fee: 0,
          volume: 0
        }
    } catch (e) {
      console.log('error in ssl api data: ', e)
    }
  }, [coin, sslTableData])

  const formattedapiSslData = useMemo(
    () => ({
      apy: apiSslData?.apy,
      fee: apiSslData?.fee,
      volume: apiSslData?.volume
    }),
    [apiSslData]
  )

  const totalEarned = useMemo(
    () => filteredLiquidityAccounts[tokenMintAddress]?.totalEarned?.toNumber() / Math.pow(10, coin?.mintDecimals),
    [filteredLiquidityAccounts, tokenMintAddress, isTxnSuccessfull, coin]
  )

  const claimableReward = useMemo(
    () => rewards[tokenMintAddress]?.toNumber() / Math.pow(10, coin?.mintDecimals),
    [rewards, tokenMintAddress, isTxnSuccessfull, coin]
  )

  const totalEarnedInUSD = useMemo(
    () =>
      prices[getPriceObject(coin?.token)]?.current
        ? prices[getPriceObject(coin?.token)]?.current * totalEarned
        : 0,
    [totalEarned]
  )

  const claimableRewardInUSD = useMemo(
    () =>
      prices[getPriceObject(coin?.token)]?.current
        ? prices[getPriceObject(coin?.token)]?.current * claimableReward
        : 0,
    [claimableReward]
  )

  const userTokenBalanceInUSD = useMemo(
    () =>
      prices[getPriceObject(coin?.token)]?.current
        ? prices[getPriceObject(coin?.token)]?.current * userTokenBalance
        : 0,
    [prices, coin, prices[getPriceObject(coin?.token)], userTokenBalance]
  )
  const enoughSOLInWallet = (): boolean => {
    if (userSolBalance < 0.000001) {
      notify(insufficientSOLMsg())
      return false
    }
    return true
  }

  const openActionModal = (actionValue: string) => {
    if (actionValue === 'deposit' && window.location.pathname === '/farm/temp-withdraw') return
    // to check if the deposit value in USD + liquidity value in USD is not greater than caps
    const depositAmountInUSD =
      prices[getPriceObject(coin?.token)]?.current && prices[getPriceObject(coin?.token)]?.current * +depositAmount
    if (actionValue === 'deposit' && depositAmountInUSD + liquidity > coin?.cappedDeposit) {
      notify(depositCapError(coin, liquidity))
      return
    }
    if (actionValue === 'withdraw') calculateEarlyWithdrawalPenalty()
    setActionType(actionValue)
    setActionModal(true)
  }

  // Disable action button when deposit mode with zero user balance or no deposit amount,
  // or withdraw mode with zero user deposited amount or no withdraw amount
  const disableActionButton = useMemo(
    () =>
      !liquidity ||
      !coin?.cappedDeposit ||
      (modeOfOperation === ModeOfOperation.DEPOSIT && liquidity > coin?.cappedDeposit) ||
      (modeOfOperation === ModeOfOperation.DEPOSIT &&
        (userTokenBalance === 0 || !depositAmount || +depositAmount <= 0)) ||
      (modeOfOperation === ModeOfOperation.WITHDRAW &&
        (!userDepositedAmount || !withdrawAmount || +withdrawAmount <= 0)),
    [userTokenBalance, modeOfOperation, pool, coin, depositAmount, withdrawAmount, liquidity]
  )

  // Deposit mode and user has not token balance OR has not yet given input OR Withdraw has not deposited anything
  const actionButtonText = useMemo(() => {
    if (modeOfOperation === ModeOfOperation.DEPOSIT) {
      if (liquidity > coin?.cappedDeposit) return `Pool at Max Capacity`
      if (userTokenBalance === 0) return `Insufficient ${coin?.token}`
      if (!depositAmount || +depositAmount <= 0) return `Enter Amount`
      if (depositAmount) return modeOfOperation
    }
    if (modeOfOperation === ModeOfOperation.WITHDRAW) {
      if (userDepositedAmount) return modeOfOperation
      if (!userDepositedAmount) return `Insufficient ${coin?.token}`
      if (!withdrawAmount || +withdrawAmount <= 0) return `Enter Amount`
      if (withdrawAmount) return modeOfOperation
    }
  }, [modeOfOperation, pool, coin, userTokenBalance, depositAmount, withdrawAmount, liquidity])

  const checkConditionsForDepositWithdraw = (isDeposit: boolean) => {
    if (!enoughSOLInWallet()) return true
    if (isDeposit) {
      if (!userTokenBalance) {
        notify(genericErrMsg(`You have 0 ${coin.token} to deposit!`))
        setDepositAmount('0')
        return true
      } else if (!depositAmount || +depositAmount < 0.000001) {
        notify(invalidInputErrMsg(coin?.token))
        setDepositAmount('0')
        return true
      } else if (+depositAmount > userTokenBalance) {
        notify(invalidDepositErrMsg(userTokenBalance, coin?.token))
        setDepositAmount('0')
        return true
      }
      return false
    } else {
      if (!userDepositedAmount) {
        notify(genericErrMsg(`You have 0 ${coin.token} to withdraw!`))
        setWithdrawAmount('0')
        return true
      } else if (!withdrawAmount || +withdrawAmount < 0.000001) {
        notify(invalidInputErrMsg(coin?.token))
        setWithdrawAmount('0')
        return true
      } // else if (userDepositedAmount?.lte(new BN(withdrawAmount))) {
      //   notify(invalidWithdrawErrMsg(userDepositedAmount, coin?.token))
      //   return true
      // }
      return false
    }
  }

  const handleDeposit = (): void => {
    if (checkConditionsForDepositWithdraw(true)) return
    try {
      setIsButtonLoading(true)
      setOperationPending(true)
      depositedBalanceConnection(userPublicKey, coin)
      setIsTxnSuccessfull(false)
      const confirm = executeDeposit(SSLProgram, wal, connection, depositAmount, coin, userPublicKey)
      confirm.then((con) => {
        setOperationPending(false)
        setIsButtonLoading(false)
        const { confirm } = con
        if (confirm && confirm?.value && confirm.value.err === null) {
          notify(sslSuccessfulMessage('deposited', depositAmount, coin?.token, walletName))
          setTimeout(() => setDepositAmount('0'), 500)
          setActionModal(false)
          setIsTxnSuccessfull(true)
        } else {
          off(connectionId)
          notify(sslErrorMessage())
          setIsTxnSuccessfull(false)
          return
        }
      })
    } catch (error) {
      off(connectionId)
      setOperationPending(false)
      setIsButtonLoading(false)
      notify(genericErrMsg(error))
      setIsTxnSuccessfull(false)
    }
  }
  const handleWithdraw = (amount: number): void => {
    if (checkConditionsForDepositWithdraw(false)) return
    try {
      setIsButtonLoading(true)
      setOperationPending(true)
      depositedBalanceConnection(userPublicKey, coin)
      setIsTxnSuccessfull(false)
      executeWithdraw(SSLProgram, wal, connection, coin, withdrawAmount, userPublicKey).then((con) => {
        setIsButtonLoading(false)
        setOperationPending(false)
        const { confirm } = con
        if (confirm && confirm?.value && confirm.value.err === null) {
          notify(sslSuccessfulMessage('withdrawn', String(amount), coin?.token, walletName))
          setTimeout(() => setWithdrawAmount('0'), 500)
          setActionModal(false)
          setIsTxnSuccessfull(true)
        } else {
          off(connectionId)
          notify(sslErrorMessage())
          setIsTxnSuccessfull(false)
          return
        }
      })
    } catch (err) {
      off(connectionId)
      setIsButtonLoading(false)
      setOperationPending(false)
      notify(genericErrMsg(err))
      setIsTxnSuccessfull(false)
    }
  }
  const handleClaim = () => {
    try {
      setIsButtonLoading(true)
      setOperationPending(true)
      setIsTxnSuccessfull(false)
      executeClaimRewards(SSLProgram, wal, connection, coin, userPublicKey).then((con) => {
        setIsButtonLoading(false)
        setOperationPending(false)
        const { confirm } = con
        if (confirm && confirm?.value && confirm.value.err === null) {
          notify(sslSuccessfulMessage('claimed', claimableReward, coin?.token, walletName))
          setActionModal(false)
          setIsTxnSuccessfull(true)
        } else {
          notify(sslErrorMessage())
          setIsTxnSuccessfull(false)
          return
        }
      })
    } catch (err) {
      setIsButtonLoading(false)
      setOperationPending(false)
      notify(genericErrMsg(err))
      setIsTxnSuccessfull(false)
    }
  }
  const handleInputChange = (input: string) => {
    // handle if the user sends '' or undefined in input box
    if (input === '') {
      if (modeOfOperation === ModeOfOperation.DEPOSIT) setDepositAmount(null)
      else setWithdrawAmount(null)
      return
    }
    const inputValue = +input
    if (!isNaN(inputValue)) {
      if (modeOfOperation === ModeOfOperation.DEPOSIT) setDepositAmount(input)
      else setWithdrawAmount(input)
    }
  }

  const userDepositInUSD = useMemo(
    () => withdrawBigString(userDepositedAmount?.toString(), coin?.mintDecimals),
    [userDepositedAmount, coin?.mintDecimals]
  )

  const canClaim = claimableReward > 0
  const liquidityItem = (
    <FarmBalanceItem
      title={'Liquidity:'}
      asZero={liquidity === 0}
      value={liquidity ? '$' + truncateBigNumber(liquidity) : <SkeletonCommon height="100%" />}
    />
  )
  const volumeItem = (
    <FarmBalanceItem
      title={'24H Volume:'}
      asZero={formattedapiSslData?.volume === 0}
      value={'$' + truncateBigNumber(formattedapiSslData?.volume)}
    />
  )
  const feeItem = (
    <FarmBalanceItem
      title={'24H Fees:'}
      asZero={formattedapiSslData?.fee === 0}
      value={'$' + truncateBigNumber(formattedapiSslData?.fee * prices?.[getPriceObject(coin?.token)]?.current)}
    />
  )
  const balanceItem = (
    <FarmBalanceItem
      title={'My Balance:'}
      asZero={userDepositedAmount?.toNumber() == 0}
      value={truncateBigString(userDepositedAmount?.toString(), coin?.mintDecimals)}
    />
  )
  const walletBalance = (
    <FarmBalanceItem
      title={'Wallet Balance:'}
      asZero={userTokenBalance === 0}
      value={
        `$${truncateBigString(userTokenBalance?.toString(), coin?.mintDecimals)}  ${coin?.token}` +
        ` (${truncateBigNumber(userTokenBalanceInUSD)} USD)`
      }
    />
  )
  const totalEarnings = (
    <FarmBalanceItem
      title={'Total Earnings:'}
      asZero={totalEarned === 0}
      includeUSD
      titlePosition={isTablet ? 'text-start' : 'text-end'}
      value={
        <div className={`md-xl:items-end flex flex-col md-xl:flex-row gap-1`}>
          {truncateBigNumber(totalEarned)} {coin?.token}
          <div className={'text-end'}>(${truncateBigNumber(totalEarnedInUSD)} USD)</div>
        </div>
      }
    />
  )
  const pendingRewards = (
    <FarmBalanceItem
      title={'Pending Rewards:'}
      asZero={claimableReward === 0}
      includeUSD
      titlePosition={isTablet ? 'text-start' : 'text-end'}
      value={
        <div className={`md-xl:items-end flex flex-col md-xl:flex-row gap-1`}>
          {truncateBigNumber(claimableReward)} {coin?.token}
          <div className={'text-end'}>(${truncateBigNumber(claimableRewardInUSD)} USD)</div>
        </div>
      }
    />
  )
  const radioGroupItems = (
    <RadioOptionGroup
      defaultValue={'deposit'}
      value={modeOfOperation == ModeOfOperation.DEPOSIT ? 'deposit' : 'withdraw'}
      className={`w-full  md-xl:w-[190px]`}
      optionClassName={`w-full md-xl:w-[85px]`}
      options={[
        {
          value: 'deposit',
          label: 'Deposit',
          onClick: () => (operationPending ? null : setModeOfOperation(ModeOfOperation.DEPOSIT))
        },
        {
          value: 'withdraw',
          label: 'Withdraw',
          onClick: () => (operationPending ? null : setModeOfOperation(ModeOfOperation.WITHDRAW))
        }
      ]}
    />
  )
  const tokenInput = (
    <TokenInput
      handleHalf={() =>
        modeOfOperation === ModeOfOperation.DEPOSIT
          ? setDepositAmount(userTokenBalance ? numberFormatter(userTokenBalance / 2) : '0')
          : setWithdrawAmount(userDepositedAmount ? numberFormatter(userDepositedAmount?.toNumber() / 2) : '0')
      }
      handleMax={() =>
        modeOfOperation === ModeOfOperation.DEPOSIT
          ? setDepositAmount(userTokenBalance ? String(userTokenBalance) : '0')
          : setWithdrawAmount(userDepositedAmount ? userDepositInUSD : '0')
      }
      value={modeOfOperation === ModeOfOperation.DEPOSIT ? depositAmount ?? '' : withdrawAmount ?? ''}
      onChange={(e) => handleInputChange(e.target.value)}
      tokenSymbol={coin.token}
    />
  )
  const connectButtonClaimCombo = (
    <div className={'flex flex-col min-lg:flex-row  gap-2.5 '}>
      {connected ? (
        <Button
          colorScheme={'blue'}
          className={'basis-1/2'}
          disabled={disableActionButton}
          onClick={
            modeOfOperation === ModeOfOperation.WITHDRAW && userDepositedAmount
              ? () => {
                  openActionModal('withdraw')
                }
              : modeOfOperation === ModeOfOperation.DEPOSIT
              ? () => {
                  openActionModal('deposit')
                }
              : null
          }
          loading={actionModal ? false : isButtonLoading}
        >
          {actionButtonText}
        </Button>
      ) : (
        <Connect containerStyle={'inline-flex basis-1/2'} customButtonStyle={'h-[35px] w-full'} />
      )}
      <RoundedGradientWrapper
        className={cn('min-h-[35px] cursor-pointer basis-1/2', !canClaim && 'bg-white grayscale')}
        onClick={handleClaim}
        animated={canClaim && !isButtonLoading}
        isDisabled={isButtonLoading}
      >
        <RoundedGradientInner
          className={`rounded-circle flex
                items-center justify-center dark:text-white text-text-lightmode-primary
                font-bold`}
          borderWidth={'1.5'}
        >
          {isButtonLoading ? (
            <Loader />
          ) : canClaim ? (
            `Claim ${numberFormatter(claimableReward)} ${coin?.token}`
          ) : (
            'No Claimable Rewards'
          )}
        </RoundedGradientInner>
      </RoundedGradientWrapper>
    </div>
  )
  const oracleItem = <OracleIcon token={coin} />
  const claimable = rewards[coin?.mint?.toBase58()]?.toNumber() / Math.pow(10, coin?.mintDecimals)

  const depositPercentage = (liquidity / coin?.cappedDeposit) * 100
  return (
    <>
      <FarmItemHead
        icon={`/img/crypto/${coin?.token}.svg`}
        canClaim={claimable > 0}
        token={coin?.token}
        tooltip={
          <>
            Deposits are at {depositPercentage?.toFixed(2)}% capacity, the current cap is $
            {truncateBigNumber(coin?.cappedDeposit)}
          </>
        }
        apy={`${apiSslData?.apy ? Number(apiSslData?.apy)?.toFixed(2) : '0.00'}%`}
        liquidity={liquidity ? '$' + truncateBigNumber(liquidity) : <SkeletonCommon height="75%" width="75%" />}
        volume={<>${truncateBigNumber(apiSslData?.volume)}</>}
        fees={
          <Tooltip>
            <TooltipTrigger asChild>
              {truncateBigNumber(apiSslData?.fee * prices?.[getPriceObject(coin?.token)]?.current) ? (
                <h4 tw="flex justify-center items-center font-semibold">
                  ${truncateBigNumber(apiSslData?.fee * prices?.[getPriceObject(coin?.token)]?.current)}
                </h4>
              ) : (
                <h4 tw="flex justify-center items-center font-semibold">$0.00</h4>
              )}
            </TooltipTrigger>
            <TooltipContent className={`dark:text-black-4 text-grey-5 font-medium text-tiny`}>
              {truncateBigNumber(apiSslData?.fee * prices?.[getPriceObject(coin?.token)]?.current) ? (
                <>${truncateBigNumber(apiSslData?.fee * prices?.[getPriceObject(coin?.token)]?.current)}</>
              ) : (
                `$0.00`
              )}
            </TooltipContent>
          </Tooltip>
        }
        balance={<>{numberFormatter(parseFloat(userDepositInUSD))}</>}
      />
      <AccordionContent variant={'secondary'}>
        <div className={'grid grid-cols-1 md-xl:grid-cols-3 sm-lg:grid-cols-2 gap-3.75 '}>
          {actionModal && (
            <ActionModal
              actionModal={actionModal}
              setActionModal={setActionModal}
              handleWithdraw={handleWithdraw}
              handleDeposit={handleDeposit}
              handleClaim={handleClaim}
              isButtonLoading={isButtonLoading}
              withdrawAmount={withdrawAmount}
              depositAmount={depositAmount}
              claimAmount={claimableReward}
              actionType={actionType}
              token={coin}
              earlyWithdrawFee={earlyWithdrawFee}
              diffTimer={diffTimer}
              setDiffTimer={setDiffTimer}
            />
          )}
          {isMobile ? (
            <>
              {liquidityItem}
              {volumeItem}
              {feeItem}
              {balanceItem}
              {walletBalance}
              {totalEarnings}
              {pendingRewards}
              {radioGroupItems}
              {tokenInput}
              {connectButtonClaimCombo}
            </>
          ) : isTablet ? (
            <>
              <div className={'flex flex-col gap-3.75'}>
                {radioGroupItems}
                {tokenInput}
                {connectButtonClaimCombo}
              </div>
              <div className={'flex flex-col gap-3.75'}>
                {liquidityItem}
                {volumeItem}
                {feeItem}
                {balanceItem}
                {walletBalance}
                {totalEarnings}
                {pendingRewards}
              </div>
            </>
          ) : (
            <>
              <div className={'flex flex-col gap-3.75'}>
                {radioGroupItems}
                {walletBalance}
              </div>
              <div className={'flex flex-col gap-3.75'}>
                {tokenInput}
                {connectButtonClaimCombo}
              </div>
              <div className={'flex flex-col gap-3.75 items-end'}>
                {totalEarnings}
                {pendingRewards}
              </div>
            </>
          )}
          <div className={'col-span-1 md-xl:col-span-3 sm-lg:col-span-2'}>{oracleItem}</div>
        </div>
      </AccordionContent>
    </>
  )
}
