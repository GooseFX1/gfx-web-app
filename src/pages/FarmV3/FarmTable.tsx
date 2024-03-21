/* eslint-disable */
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import tw from 'twin.macro'
import 'styled-components/macro'
import { ShowDepositedToggle, SkeletonCommon } from '../../components'
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
  truncateBigNumber,
  truncateBigString,
  withdrawBigString
} from '../../utils'
import useBreakPoint from '../../hooks/useBreakPoint'
import { CircularArrow } from '../../components/common/Arrow'
import { ExpandedView, OracleIcon } from './ExpandedView'
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
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from 'gfx-component-lib'
import { Connect } from '@/layouts'
import useBoolean from '@/hooks/useBoolean'
import TokenInput from '@/components/common/TokenInput'
import RadioOptionGroup from '@/components/common/RadioOptionGroup'
import SearchBar from '@/components/common/SearchBar'
import useSolSub from '@/hooks/useSolSub'

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
    <div className={''}>
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
          <div className="flex items-center w-full">
            <SearchBar
              onChange={(e) => initiateGlobalSearch(e.target.value)}
              onClear={() => setSearchTokens('')}
              value={searchTokens}
            />
            <div className={'flex flex-row ml-auto gap-3.75'}>
              {isClaimable && pubKey && (
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
              {pubKey && (
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
              <ShowDepositedToggle enabled={showDeposited} setEnable={handleShowDepositedToggle} />
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
      <FarmFilter sort={sort} sortType={sortType} handleColumnSort={handleColumnSort} />

      <NewFarm tokens={filteredTokens} />
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
          className="h-[97px] sm:h-[81px] w-[168px]"
        />
      </div>
      <div className="flex items-center flex-col">
        <div className="text-[20px] font-semibold text-black-4 dark:text-grey-5 mt-3"> {str}</div>
        <div className="text-regular w-[214px] text-center mt-[15px] text-grey-1 dark:text-grey-2">{subText}</div>
        {requestPool && (
          <address
            className="w-[219px] h-8.75 cursor-pointer flex items-center justify-center mt-4 text-regular
            rounded-[30px] font-semibold bg-gradient-1"
          >
            <a href="https://discord.gg/cDEPXpY26q" className="font-semibold" target="_blank" rel="noreferrer">
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
      className={cn('grid grid-cols-7', isMobile && `grid-cols-3`, isTablet && `grid-cols-4`)}
      indicator={<></>}
      variant={'secondary'}
    >
      <div className={'flex flex-row items-center gap-2.5'}>
        <div className={'relative'}>
          <Icon src={icon} size={'lg'} />
          {canClaim && <span className={'absolute rounded-full bg-background-red w-3 h-3 top-0 right-0'} />}
        </div>
        <h4 className={'text-start text-text-lightmode-secondary dark:text-text-darkmode-secondary'}>{token}</h4>
        <IconTooltip tooltipType={'outline'}>{tooltip}</IconTooltip>
      </div>
      <h4 className={'text-center text-text-lightmode-secondary dark:text-text-darkmode-secondary'}>{apy}</h4>
      {!isMobile && (
        <>
          {!isTablet && (
            <>
              <h4 className={'text-center text-text-lightmode-secondary dark:text-text-darkmode-secondary'}>
                {liquidity}
              </h4>
              <h4 className={'text-center text-text-lightmode-secondary dark:text-text-darkmode-secondary'}>
                {volume}
              </h4>
              <h4 className={'text-center text-text-lightmode-secondary dark:text-text-darkmode-secondary'}>
                {fees}
              </h4>
            </>
          )}
          <h4 className={'text-center text-text-lightmode-secondary dark:text-text-darkmode-secondary'}>
            {balance}
          </h4>
        </>
      )}
      <Icon size={'sm'} className={'ml-auto'} src={'/img/mainnav/connect-chevron.svg'} />
    </AccordionTrigger>
  )
}
const FarmRowItem = ({
  title,
  onClick,
  className,
  invert
}: {
  title: string
  onClick: () => void
  className?: string
  invert?: boolean
}) => (
  <Button
    variant={'default'}
    onClick={onClick}
    className={cn(
      `justify-center p-0 break-words text-h4 text-text-lightmode-secondary
      dark:text-text-darkmode-secondary
    `,
      className
    )}
    iconRight={<CircularArrow className={`h-5 w-5`} invert={invert} />}
  >
    {title}
  </Button>
)
const FarmFilter = ({
  sort,
  sortType,
  handleColumnSort
}: {
  sort: string
  sortType: string
  handleColumnSort: (s: string) => void
}) => {
  const { isMobile, isTablet } = useBreakPoint()
  return (
    <div
      className={cn(
        `grid grid-cols-7 border-b-1 border-solid border-border-lightmode-secondary 
      dark:border-border-darkmode-tertiary h-10 mb-3.75 px-2 items-center`,
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
            onClick={() => handleColumnSort('balance')}
            invert={sort == 'DESC' && sortType == 'balance'}
          />
        </>
      )}
      <h4 className={'text-end self-center text-text-lightmode-secondary dark:text-text-darkmode-secondary'}>
        Pools: {4}
      </h4>
    </div>
  )
}
const FarmBalanceItem = ({
  title,
  value,
  titlePosition = 'text-end'
}: {
  title: string
  value: string
  titlePosition?: 'text-end' | 'text-start'
}) => (
  <div className={cn('flex flex-row min-md:flex-col min-md:w-max justify-between min-md:justify-normal')}>
    <h4 className={titlePosition}>{title}</h4>
    <p className={'text-b2 font-semibold text-text-lightmode-tertiary dark:text-text-darkmode-tertiary'}>
      {value}
    </p>
  </div>
)
const NewFarm = ({ tokens }: { tokens: SSLToken[] }) => {
  const { rewards, liquidityAmount, sslTableData } = useSSLContext()
  const { prices } = usePriceFeedFarm()
  const getApiSslData = (coin: SSLToken) => {
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
  }
  return (
    <div>
      {tokens.length == 0 ? (
        <NoResultsFound />
      ) : (
        <Accordion type={'single'} collapsible={true} variant={'secondary'} className={'lg:min-w-full gap-3.75'}>
          {tokens.map((coin) => {
            console.log(rewards, prices, coin)
            const claimable = rewards[coin?.mint?.toBase58()]?.toNumber() / Math.pow(10, coin?.mintDecimals)
            const liquidity =
              prices[getPriceObject(coin?.token)]?.current &&
              prices[getPriceObject(coin?.token)]?.current * liquidityAmount?.[coin?.mint?.toBase58()]
            const depositPercentage = (liquidity / coin?.cappedDeposit) * 100
            const apiSslData = getApiSslData(coin)
            return (
              <AccordionItem value={coin?.token} variant={'secondary'}>
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
                  liquidity={
                    liquidity ? '$' + truncateBigNumber(liquidity) : <SkeletonCommon height="75%" width="75%" />
                  }
                  volume={<>${truncateBigNumber(apiSslData?.volume)}</>}
                  fees={
                    truncateBigNumber(apiSslData?.fee * prices?.[getPriceObject(coin?.token)]?.current) ? (
                      <>${truncateBigNumber(apiSslData?.fee * prices?.[getPriceObject(coin?.token)]?.current)}</>
                    ) : (
                      `$0.00`
                    )
                  }
                  balance={
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
                        {truncateBigNumber(apiSslData?.fee)}&nbsp;{coin?.token}
                      </TooltipContent>
                    </Tooltip>
                  }
                />
                <NewFarmTokenContent coin={coin} />
              </AccordionItem>
            )
          })}
        </Accordion>
      )}
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
  const [userSolBalance, setUserSOLBalance] = useState<number>()
  const [depositAmount, setDepositAmount] = useState<string>()
  const [withdrawAmount, setWithdrawAmount] = useState<string>()
  const [modeOfOperation, setModeOfOperation] = useState<string>(ModeOfOperation.DEPOSIT)
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)
  const [userTokenBalance, setUserTokenBalance] = useState<number>()
  const [actionModal, setActionModal] = useState<boolean>(false)
  const [actionType, setActionType] = useState<string>(null)
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
  const [depositSelected, setDepositSelected] = useBoolean()
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

  const renderStatsAsZero = useCallback(
    (token: string | undefined) => (
      <div tw="text-right dark:text-grey-1 text-grey-2 font-semibold text-regular">
        <div>00.00 {token}</div>
      </div>
    ),
    []
  )
  const canClaim = claimableReward > 0
  return (
    <AccordionContent variant={'secondary'}>
      <div className={'grid grid-cols-1 min-md:grid-cols-3 md-lg:grid-cols-2'}>
        <div className={'flex flex-col gap-3.75'}>
          <RadioOptionGroup
            defaultValue={'deposit'}
            value={depositSelected ? 'deposit' : 'withdraw'}
            className={`w-full min-md:w-[190px]`}
            optionClassName={`w-full min-md:w-[85px]`}
            options={[
              { value: 'deposit', label: 'Deposit', onClick: setDepositSelected.on },
              { value: 'withdraw', label: 'Withdraw', onClick: setDepositSelected.off }
            ]}
          />

          <FarmBalanceItem titlePosition={'text-start'} title={'Wallet Balance:'} value={'0.0 SOL ($0.0 USD)'} />

          <div className={'flex-grow flex-col gap-2.5 hidden md-lg:flex'}>
            <FarmBalanceItem titlePosition={'text-start'} title={'Total Earned:'} value={'0.0 SOL ($0.0 USD)'} />
            <FarmBalanceItem
              titlePosition={'text-start'}
              title={'Pending Rewards:'}
              value={'0.0 SOL ($0.0 USD)'}
            />
          </div>
        </div>
        <div className={'flex flex-col gap-3.75 w-full min-lg:w-[400px]'}>
          <TokenInput
            handleHalf={() =>
              modeOfOperation === ModeOfOperation.DEPOSIT
                ? setDepositAmount(userTokenBalance ? '0.01' : '0')
                : setWithdrawAmount(userDepositedAmount ? '0.01' : '0')
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

          <div className={'flex flex-col min-lg:flex-row flex-grow gap-2.5 '}>
            {connected ? (
              <Button colorScheme={'blue'} className={'basis-1/2'} disabled={disableActionButton}>
                {actionButtonText}
              </Button>
            ) : (
              <Connect containerStyle={'inline-flex basis-1/2'} customButtonStyle={'h-[35px] w-full'} />
            )}
            <RoundedGradientWrapper
              className={cn('min-h-[35px] cursor-pointer basis-1/2', !canClaim && 'bg-white grayscale')}
              onClick={handleClaim}
              animated={canClaim}
            >
              <RoundedGradientInner
                className={`dark:bg-background-darkmode-primary bg-background-lightmode-primary rounded-circle flex
                sm:w-full items-center justify-center dark:text-white text-text-lightmode-primary
                font-bold`}
                borderWidth={'1.5'}
              >
                {canClaim ? 'Claim All' : 'No Claimable Rewards'}
              </RoundedGradientInner>
            </RoundedGradientWrapper>
          </div>
          <OracleIcon token={coin} />
        </div>
        {(!isMobile || !isTablet) && (
          <div className={'flex flex-grow flex-col gap-2.5 ml-auto md:hidden md-lg:hidden'}>
            <FarmBalanceItem title={'Total Earned:'} value={'0.0 SOL ($0.0 USD)'} />
            <FarmBalanceItem title={'Pending Rewards:'} value={'0.0 SOL ($0.0 USD)'} />
          </div>
        )}
      </div>
    </AccordionContent>
  )
}
