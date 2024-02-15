import { FC, useEffect, useMemo, useState } from 'react'
import { PublicKey } from '@solana/web3.js'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { SearchBar, ShowDepositedToggle, SkeletonCommon } from '../../components'
import { useDarkMode, usePriceFeedFarm, useSSLContext } from '../../context'
import { TableHeaderTitle } from '../../utils/GenericDegsin'
import { checkMobile, formatUserBalance, truncateBigNumber, truncateBigString } from '../../utils'
import useBreakPoint from '../../hooks/useBreakPoint'
import { CircularArrow } from '../../components/common/Arrow'
import { ExpandedView } from './ExpandedView'
import { SSLToken, poolType, Pool } from './constants'
import { useWallet } from '@solana/wallet-adapter-react'
import Lottie from 'lottie-react'
import NoResultFarmdark from '../../animations/NoResultFarmdark.json'
import NoResultFarmlite from '../../animations/NoResultFarmlite.json'
import { getPriceObject } from '../../web3/utils'
import { Tooltip } from 'antd'
import { StatsModal } from './StatsModal'
import { USER_CONFIG_CACHE } from '../../types/app_params'
import BN from 'bn.js'

const WRAPPER = styled.div`
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }

  .searchBarContainer {
    ${tw`sm:w-[95vw]`}
  }
  .tableRowGradient {
    background: linear-gradient(111deg, rgba(247, 147, 26, 0.4) 0%, rgba(172, 28, 199, 0.4) 100%);
  }
  table {
    ${tw`sm:dark:bg-black-3 sm:bg-white mt-[10px] w-full overflow-x-hidden`}
    border-radius: 20px 20px 0 0;

    @media (max-width: 500px) {
      ${tw`sticky mt-[0px] w-[calc(100vw - 30px)]`}
    }
  }

  thead,
  tbody,
  td,
  th {
    display: block;
  }

  tr {
    display: flex;
    > * {
      flex: 1;
    }

    @media (max-width: 500px) {
      > :nth-child(1) {
        flex: 2;
      }
    }
  }

  thead {
    ${tw`text-base font-semibold bg-grey-5 dark:bg-black-1 
    sm:h-[52px] rounded-[20px 20px 5px 5px] text-regular`}

    tr {
      ${tw`h-10 sm:h-full`}
      border-bottom: 1px solid ${({ theme }) => theme.tokenBorder};

      th {
        ${tw`h-full dark:text-grey-2 text-grey-1 text-center`}

        & > div {
          ${tw`h-full`}
        }
      }
    }
  }

  tbody {
    ${tw`dark:bg-black-1 bg-grey-5 overflow-hidden`}
    tr {
      ${tw`dark:bg-black-2 bg-white mt-[15px] dark:border-black-2 border-white
      sm:mb-0 rounded-small cursor-pointer h-[60px] sm:h-[70px]`};

      &:after {
        content: '';
        display: block;
        visibility: hidden;
        clear: both;
      }
    }

    td {
      ${tw`h-[100%] flex items-center justify-center text-[15px] font-semibold text-center
       dark:text-grey-8 text-black-4`}
      >span {
        ${tw`w-1/2`}
      }
    }
  }

  address {
    > a {
      ${tw`text-white`}
    }
  }

  .sort {
    ${tw`flex flex-row items-center justify-center`}
  }
`

// const STATS = styled.div`
//   ${tw`h-[30px] w-[90px] rounded-circle flex items-center justify-center text-white`};
//   background: linear-gradient(94deg, #f7931a 0%, #ac1cc7 100%);
//`

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
    setIsFirstPoolOpen
  } = useSSLContext()
  const [searchTokens, setSearchTokens] = useState<string>('')
  const [initialLoad, setInitialLoad] = useState<boolean>(true)
  const [showDeposited, setShowDeposited] = useState<boolean>(existingUserCache.farm.showDepositedFilter)
  const [sort, setSort] = useState<string>('ASC')
  const [sortType, setSortType] = useState<string>(null)
  const { prices } = usePriceFeedFarm()

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

  return (
    <WRAPPER>
      <div tw="flex flex-row items-center mb-3.75 sm:pr-4">
        <img
          src={`/img/assets/${pool.name}_pools_${mode}.svg`}
          alt="pool-icon"
          tw="h-[55px] w-[50px] mr-3.75 duration-500 sm:h-[45] sm:w-[40px]"
        />
        <div tw="flex flex-col">
          <h2
            tw="text-average font-semibold dark:text-grey-5 text-black-4 capitalize 
            sm:text-average sm:mb-0 sm:leading-[22px]"
          >
            {pool.name} Pools
          </h2>
          <p tw="text-average font-medium text-grey-1 dark:text-grey-2 sm:text-tiny sm:leading-5">{pool.desc}</p>
        </div>
      </div>
      <div tw="flex items-center">
        <div tw="flex cursor-pointer relative sm:w-full">
          <div
            css={[
              tw`duration-500`,
              pool.index === 4
                ? tw`ml-0`
                : pool.index === 3
                ? tw`ml-[95px] sm:ml-[24%]`
                : pool.index === 1
                ? tw`ml-[190px] sm:ml-[48%]`
                : tw`ml-[285px] sm:ml-[72%]`
            ]}
            tw="h-[35px] bg-gradient-1 w-[95px] sm:w-[24%] absolute rounded-[100px]"
          ></div>
          <h4
            css={[pool.index === 4 ? tw`!text-white` : tw`text-grey-1`]}
            tw="h-[35px] duration-500 flex items-center z-[100] sm:w-[24%] justify-center 
            font-semibold w-[95px] text-regular"
            onClick={() => (operationPending ? null : handleToggle(poolType.all))}
          >
            All Pools
          </h4>
          <h4
            css={[pool.index === 3 ? tw`!text-white` : tw`text-grey-1`]}
            tw="h-[35px] duration-500 flex items-center z-[100] sm:w-[24%] justify-center 
            font-semibold w-[95px] text-regular"
            onClick={() => (operationPending ? null : handleToggle(poolType.stable))}
          >
            Stable
          </h4>
          <h4
            css={[pool.index === 1 ? tw`!text-white` : tw`text-grey-1`]}
            tw="h-[35px] flex items-center justify-center z-[100] font-semibold w-[95px] sm:w-[24%] text-regular"
            onClick={() => (operationPending ? null : handleToggle(poolType.primary))}
          >
            Primary
          </h4>
          <h4
            css={[pool.index === 2 ? tw`!text-white` : tw`text-grey-1`]}
            tw="h-[35px] duration-500 flex items-center z-[100] justify-center font-semibold 
            sm:w-[24%] w-[95px] text-regular"
            onClick={() => (operationPending ? null : handleToggle(poolType.hyper))}
          >
            Hyper
          </h4>
        </div>
        {breakpoint.isDesktop && (
          <div tw="flex items-center w-full">
            <SearchBar
              width="400px"
              filter={searchTokens}
              cssStyle={tw`h-8.75`}
              setSearchFilter={initiateGlobalSearch}
              placeholder="Search by token symbol"
              bgColor={mode === 'dark' ? '#1f1f1f' : '#fff'}
            />
            {pubKey && (
              <div tw="ml-auto flex items-center mr-2">
                <ShowDepositedToggle enabled={showDeposited} setEnable={handleShowDepositedToggle} />
                <div
                  tw="h-8.75 leading-5 text-regular text-right dark:text-grey-2 text-grey-1
               font-semibold mt-[-4px] ml-2.5"
                >
                  Show <br /> Deposited
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {breakpoint.isMobile && (
        <div tw="flex flex-row mt-4">
          <SearchBar
            filter={searchTokens}
            width={pubKey ? '55%' : '95%'}
            className="searchBarContainer"
            cssStyle={tw`h-8.75`}
            setSearchFilter={initiateGlobalSearch}
            placeholder="Search by token"
            bgColor={mode === 'dark' ? '#1f1f1f' : '#fff'}
            //filter={searchTokens}
          />
          {pubKey && (
            <div tw="ml-auto flex items-center mr-2">
              <ShowDepositedToggle enabled={showDeposited} setEnable={handleShowDepositedToggle} />
              <div
                tw="h-8.75 leading-5 text-regular sm:text-tiny sm:leading-[18px] text-right dark:text-grey-2 text-grey-1
                          font-semibold mt-[-4px] ml-2.5 sm:ml-2"
              >
                Show <br /> Deposited
              </div>
            </div>
          )}
        </div>
      )}
      <div>
        <table tw="mt-4">
          <thead>
            <tr>
              <th tw="!text-left !justify-start sm:pl-0 pl-2 !flex sm:!w-[41%]">
                <div className="sort" onClick={() => handleColumnSort('token')}>
                  {TableHeaderTitle('Pool', null, true, sort === 'DESC' && sortType === 'token')}{' '}
                </div>
              </th>
              <th tw="!flex !flex-row !justify-center !items-center sm:!w-[31vw]">
                <Tooltip
                  color={mode === 'dark' ? '#F7F0FD' : '#1C1C1C'}
                  title={
                    <span tw="dark:text-black-4 text-grey-5 font-medium text-tiny">
                      APY is calculated on a rolling 3 day basis based on TVL/Fees. See FAQ below for more info
                    </span>
                  }
                  placement="topLeft"
                  overlayClassName={mode === 'dark' ? 'farm-tooltip dark' : 'farm-tooltip'}
                  overlayInnerStyle={{ borderRadius: '8px' }}
                >
                  <div className="sort" onClick={() => handleColumnSort('apy')}>
                    {TableHeaderTitle('APY', null, true, sort === 'DESC' && sortType === 'apy')}{' '}
                  </div>
                </Tooltip>
              </th>
              {!checkMobile() && (
                <th tw="!flex !justify-center">
                  <div className="sort" onClick={() => handleColumnSort('liquidity')}>
                    {TableHeaderTitle('Liquidity', null, true, sort === 'DESC' && sortType === 'liquidity')}{' '}
                  </div>
                </th>
              )}
              {!checkMobile() && (
                <th tw="!flex !justify-center">
                  <Tooltip
                    color={mode === 'dark' ? '#F7F0FD' : '#1C1C1C'}
                    title={
                      <span tw="dark:text-black-4 text-grey-5 font-medium text-tiny">
                        24H Volume is calculated since 10P.M UTC on a daily basis
                      </span>
                    }
                    placement="topLeft"
                    overlayClassName={mode === 'dark' ? 'farm-tooltip dark' : 'farm-tooltip'}
                    overlayInnerStyle={{ borderRadius: '8px' }}
                  >
                    <div className="sort" onClick={() => handleColumnSort('volume')}>
                      {TableHeaderTitle('24H Volume', null, true, sort === 'DESC' && sortType === 'volume')}{' '}
                    </div>
                  </Tooltip>
                </th>
              )}
              {!checkMobile() && (
                <th tw="!flex !justify-center">
                  <div className="sort" onClick={() => handleColumnSort('fee')}>
                    {TableHeaderTitle('24H Fees', null, true, sort === 'DESC' && sortType === 'fee')}{' '}
                  </div>
                </th>
              )}
              {!checkMobile() && (
                <th tw="!flex !justify-center">
                  <Tooltip
                    color={mode === 'dark' ? '#F7F0FD' : '#1C1C1C'}
                    title={
                      <span tw="dark:text-black-4 text-grey-5 font-medium text-tiny">
                        Values are displayed in native token
                      </span>
                    }
                    placement="topLeft"
                    overlayClassName={mode === 'dark' ? 'farm-tooltip dark' : 'farm-tooltip'}
                    overlayInnerStyle={{ borderRadius: '8px' }}
                  >
                    <div className="sort" onClick={() => handleColumnSort('volume')}>
                      {TableHeaderTitle('My Balance', null, true, sort === 'DESC' && sortType === 'balance')}{' '}
                    </div>
                  </Tooltip>
                </th>
              )}
              <th tw="!text-right !justify-end !flex sm:text-right !w-[10%] sm:!w-[25%] font-semibold">
                <h4 tw="items-center flex">{`Pools: ${poolSize}`}</h4>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTokens?.length
              ? filteredTokens.map((coin: SSLToken, index: number) => (
                  <FarmTokenContent key={coin?.token} coin={coin} showDeposited={showDeposited} index={index} />
                ))
              : initialLoad && <SkeletonCommon height="100px" style={{ marginTop: '15px' }} />}
            {numberOfCoinsDeposited === 0 && showDeposited && searchTokens?.length === 0 && (
              <NoResultsFound
                str="Oops, no pools deposited"
                subText="Don’t worry, explore our pools and start earning!"
              />
            )}
            {filteredTokens?.length === 0 && searchTokens?.length > 0 && (
              <NoResultsFound
                requestPool={true}
                str="Oops, no pools found"
                subText="Don’t worry, there are more pools coming soon..."
              />
            )}
          </tbody>
        </table>
      </div>
    </WRAPPER>
  )
}

const NoResultsFound: FC<{ str?: string; subText?: string; requestPool?: boolean }> = ({
  str,
  subText,
  requestPool
}) => {
  const { mode } = useDarkMode()
  return (
    <div css={[requestPool ? tw`h-[258px]` : tw`h-[208px]`]} tw=" flex flex-col mt-[30px] sm:mt-0">
      <div
        tw="!h-[97px] sm:h-[81px]  flex flex-row justify-center items-center text-regular font-semibold 
          dark:text-white text-black"
      >
        <Lottie
          animationData={mode === 'dark' ? NoResultFarmdark : NoResultFarmlite}
          tw="h-[97px] sm:h-[81px] w-[168px]"
        />
      </div>
      <div tw="flex items-center flex-col">
        <div tw="text-[20px] font-semibold text-black-4 dark:text-grey-5 mt-3"> {str}</div>
        <div tw="text-regular w-[214px] text-center mt-[15px] text-grey-1 dark:text-grey-2">{subText}</div>
        {requestPool && (
          <address
            tw="w-[219px] h-8.75 cursor-pointer flex items-center justify-center mt-4 text-regular 
            rounded-[30px] font-semibold bg-gradient-1"
          >
            <a href="https://discord.gg/cDEPXpY26q" tw="font-semibold" target="_blank" rel="noreferrer">
              Request Pool
            </a>
          </address>
        )}
      </div>
    </div>
  )
}

const FarmTokenContent: FC<{
  coin: SSLToken
  showDeposited: boolean
  index: number
}> = ({ coin, showDeposited, index }) => {
  const { filteredLiquidityAccounts, isTxnSuccessfull, liquidityAmount, sslTableData, isFirstPoolOpen } =
    useSSLContext()
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const tokenMintAddress = useMemo(() => coin?.mint?.toBase58(), [coin])
  const { prices } = usePriceFeedFarm()
  const { mode } = useDarkMode()
  const [statsModal, setStatsModal] = useState<boolean>(false)

  const userDepositedAmount: BN = useMemo(() => {
    const account = filteredLiquidityAccounts?.[tokenMintAddress]
    return account?.amountDeposited
  }, [filteredLiquidityAccounts, tokenMintAddress, isTxnSuccessfull])

  const userDepositedAmountUI: string = useMemo(
    () => truncateBigString(userDepositedAmount?.toString(), coin?.mintDecimals),
    [userDepositedAmount, coin]
  )

  useEffect(() => {
    if (index === 0 && isFirstPoolOpen) setIsExpanded(true)
    else if (index === 0 && !isFirstPoolOpen) setIsExpanded(false)
  }, [index, isFirstPoolOpen])

  const liquidity = useMemo(
    () =>
      prices[getPriceObject(coin?.token)]?.current &&
      prices[getPriceObject(coin?.token)]?.current * liquidityAmount?.[tokenMintAddress],
    [liquidityAmount, tokenMintAddress, isTxnSuccessfull, coin]
  )

  const depositPercentage = useMemo(() => (liquidity / coin?.cappedDeposit) * 100, [liquidity, coin])

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

  const showToggleFilteredTokens: boolean = useMemo(() => {
    if (!showDeposited) return true
    else if (showDeposited && userDepositedAmountUI !== '0.00') return true
    else if (showDeposited && userDepositedAmountUI === '0.00') return false
  }, [showDeposited, userDepositedAmount])

  // const openStatsModal = (e) => {
  //   e.stopPropagation()
  //   setStatsModal(true)
  // }

  return (
    showToggleFilteredTokens && (
      <>
        {statsModal && <StatsModal token={coin} statsModal={statsModal} setStatsModal={setStatsModal} />}
        <tr
          css={[tw`duration-500`]}
          className={isExpanded && 'tableRowGradient'}
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          <td tw="!justify-start relative sm:!w-[41%]">
            {userDepositedAmountUI !== '0.00' && (
              <div tw="absolute rounded-[50%] mt-[-25px] ml-3.5 sm:ml-1.5 h-3 w-3 bg-gradient-1" />
            )}
            <img tw="h-10 w-10 ml-4 sm:ml-2" src={`/img/crypto/${coin?.token}.svg`} alt={`${coin?.token} logo`} />
            <h4 tw="ml-2.5">{coin?.token}</h4>
            {depositPercentage ? (
              <div tw="z-[990]" onClick={(e) => e.stopPropagation()}>
                <Tooltip
                  color={mode === 'dark' ? '#F7F0FD' : '#1C1C1C'}
                  title={
                    <span tw="dark:text-black-4 text-grey-5 font-medium text-tiny">
                      Deposits are at {depositPercentage?.toFixed(2)}% capacity, the current cap is $
                      {truncateBigNumber(coin?.cappedDeposit)}
                    </span>
                  }
                  placement="topRight"
                  overlayClassName={mode === 'dark' ? 'farm-tooltip dark' : 'farm-tooltip'}
                  overlayInnerStyle={{ borderRadius: '8px' }}
                >
                  <img
                    src={
                      +depositPercentage?.toFixed(2) >= 100
                        ? '/img/assets/farm_cap_red.svg'
                        : '/img/assets/farm_cap_green.svg'
                    }
                    alt="deposit-cap"
                    tw="ml-2.5 sm:ml-1.25 max-w-none"
                    height={20}
                    width={20}
                  />
                </Tooltip>
              </div>
            ) : (
              <></>
            )}
          </td>
          <td>
            <h4>{formattedapiSslData?.apy ? Number(formattedapiSslData?.apy)?.toFixed(2) : '00.00'}%</h4>
          </td>
          {!checkMobile() && (
            <td>
              <h4>
                {liquidity ? '$' + truncateBigNumber(liquidity) : <SkeletonCommon height="75%" width="75%" />}
              </h4>
            </td>
          )}
          {!checkMobile() && (
            <td>
              <h4>${truncateBigNumber(formattedapiSslData?.volume)}</h4>
            </td>
          )}
          {!checkMobile() && (
            <td>
              <Tooltip
                color={mode === 'dark' ? '#F7F0FD' : '#1C1C1C'}
                title={
                  <span tw="dark:text-black-4 text-grey-5 font-medium text-tiny">
                    {truncateBigNumber(formattedapiSslData?.fee)} {coin?.token}
                  </span>
                }
                placement="topRight"
                overlayClassName={mode === 'dark' ? 'farm-tooltip dark' : 'farm-tooltip'}
                overlayInnerStyle={{ borderRadius: '8px' }}
              >
                {truncateBigNumber(formattedapiSslData?.fee * prices?.[getPriceObject(coin?.token)]?.current) ? (
                  <h4 tw="flex justify-center items-center font-semibold">
                    ${truncateBigNumber(formattedapiSslData?.fee * prices?.[getPriceObject(coin?.token)]?.current)}
                  </h4>
                ) : (
                  <h4 tw="flex justify-center items-center font-semibold">$00.00</h4>
                )}
              </Tooltip>
            </td>
          )}
          {!checkMobile() && (
            <td>
              <h4>{userDepositedAmountUI ? userDepositedAmountUI : '0.00'}</h4>
            </td>
          )}
          <td tw="!w-[10%] pr-3 sm:!w-[25%] sm:pr-0">
            {/* {!checkMobile() && (
              <STATS onClick={(e: React.MouseEvent<HTMLButtonElement>) => openStatsModal(e)}>Stats</STATS>
            )} */}
            <div tw="ml-auto sm:mr-2">
              <CircularArrow cssStyle={tw`h-5 w-5`} invert={isExpanded} />
            </div>
          </td>
        </tr>
        <ExpandedView isExpanded={isExpanded} coin={coin} userDepositedAmount={userDepositedAmount} />
      </>
    )
  )
}
