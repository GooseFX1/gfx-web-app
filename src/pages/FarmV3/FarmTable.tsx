import { FC, useEffect, useMemo, useState } from 'react'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { SearchBar, ShowDepositedToggle } from '../../components'
import { useDarkMode, usePriceFeedFarm, useSSLContext } from '../../context'
import { TableHeaderTitle } from '../../utils/GenericDegsin'
import { checkMobile, truncateBigNumber } from '../../utils'
import useBreakPoint from '../../hooks/useBreakPoint'
import { CircularArrow } from '../../components/common/Arrow'
import { ExpandedView } from './ExpandedView'
import { SSLToken, poolType } from './constants'
import { useWallet } from '@solana/wallet-adapter-react'
import Lottie from 'lottie-react'
import NoResultFarmdark from '../../animations/NoResultFarmdark.json'
import NoResultFarmlite from '../../animations/NoResultFarmlite.json'
import { getPriceObject } from '../../web3/utils'
import { SkeletonCommon } from '../NFTs/Skeleton/SkeletonCommon'
import { Tooltip } from 'antd'
import { StatsModal } from './StatsModal'

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
  tr,
  td,
  th {
    display: block;
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
      ${tw`dark:bg-black-2 bg-white  mt-[15px] dark:border-black-2 border-white
      sm:mb-0 rounded-small cursor-pointer h-[60px] sm:h-[70px]`};

      &:after {
        content: '';
        display: block;
        visibility: hidden;
        clear: both;
      }
    }
    td {
      ${tw`h-[100%] flex items-center justify-center  text-[15px] font-semibold text-center
       dark:text-grey-5 text-black-4`}
      >span {
        ${tw`w-1/2 h-1/2`}
      }
    }
  }

  tbody td,
  thead th {
    width: 15%;
    float: left;
    text-align: center;

    @media (max-width: 500px) {
      ${tw`w-[32%]`}
    }
  }

  address {
    > a {
      ${tw`text-white`}
    }
  }
`

// const STATS = styled.div`
//   ${tw`h-[30px] w-[90px] rounded-circle flex items-center justify-center text-white`};
//   background: linear-gradient(94deg, #f7931a 0%, #ac1cc7 100%);
//`

export const FarmTable: FC = () => {
  const { mode } = useDarkMode()
  const breakpoint = useBreakPoint()
  const { wallet } = useWallet()
  const { operationPending, pool, setPool, sslData, filteredLiquidityAccounts, sslTableData, liquidityAmount } =
    useSSLContext()
  const [searchTokens, setSearchTokens] = useState<string>('')
  const [initialLoad, setInitialLoad] = useState<boolean>(true)
  const [showDeposited, setShowDeposited] = useState<boolean>(false)
  const [sort, setSort] = useState<string>('ASC')
  const [sortType, setSortType] = useState<string>(null)
  const { prices } = usePriceFeedFarm()

  useEffect(() => {
    sslData?.length && setInitialLoad(false)
  }, [sslData])

  const numberOfCoinsDeposited = useMemo(() => {
    const count = sslData.reduce((accumulator, data) => {
      const amountInNative = filteredLiquidityAccounts[data?.mint?.toBase58()]?.amountDeposited?.toNumber()
      const amount = amountInNative / Math.pow(10, data?.mintDecimals)
      if (+amount?.toFixed(2) > 0) {
        return accumulator + 1
      }
      return accumulator
    }, 0)
    return count
  }, [pool, filteredLiquidityAccounts, sslData, wallet?.adapter?.publicKey])

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
        const amountDeposited = account ? account?.amountDeposited?.toNumber() / 10 ** token?.mintDecimals : 0
        const dataObj = {
          ...token,
          apy: apy,
          volume: volume,
          fee: feesInUSD,
          liquidity: liquidityInUSD,
          balance: amountDeposited
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

  const initiateGlobalSearch = (value: string) => {
    setPool(poolType.all)
    setSearchTokens(value)
  }

  const poolSize = useMemo(
    () => (showDeposited ? numberOfCoinsDeposited : filteredTokens?.length),
    [showDeposited, numberOfCoinsDeposited, filteredTokens]
  )

  const handleColumnSort = (sortValue: string) => {
    farmTableRow.sort((a, b) => {
      if (sort === 'DESC') return a[sortValue] > b[sortValue] ? -1 : 1
      else return a[sortValue] > b[sortValue] ? 1 : -1
    })
    setSort((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))
    setSortType(sortValue)
  }

  return (
    <WRAPPER>
      <div tw="flex flex-row items-center mb-3.75 sm:pr-4">
        <img
          src={`/img/assets/${pool.name}_pools.svg`}
          alt="pool-icon"
          tw="h-[55px] w-[50px] mr-3.75 duration-500 sm:h-[45] sm:w-[40px]"
        />
        <div tw="flex flex-col">
          <div
            tw="text-average font-semibold dark:text-grey-5 text-black-4 capitalize 
            sm:text-average sm:mb-0 sm:leading-[22px]"
          >
            {pool.name} Pools
          </div>
          <div tw="text-regular font-medium text-grey-1 dark:text-grey-2 mt-[-4px] sm:text-tiny sm:leading-5">
            {pool.desc}
          </div>
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
            tw="h-[35px] bg-blue-1 w-[95px] sm:w-[24%] absolute rounded-[100px]"
          ></div>
          <div
            css={[pool.index === 4 ? tw`!text-white` : tw`text-grey-1`]}
            tw="h-[35px] duration-500 flex items-center z-[100] sm:w-[24%] justify-center 
            font-semibold w-[95px] text-regular"
            onClick={() => (operationPending ? null : setPool(poolType.all))}
          >
            All Pools
          </div>
          <div
            css={[pool.index === 3 ? tw`!text-white` : tw`text-grey-1`]}
            tw="h-[35px] duration-500 flex items-center z-[100] sm:w-[24%] justify-center 
            font-semibold w-[95px] text-regular"
            onClick={() => (operationPending ? null : setPool(poolType.stable))}
          >
            Stable
          </div>
          <div
            css={[pool.index === 1 ? tw`!text-white` : tw`text-grey-1`]}
            tw="h-[35px] flex items-center justify-center z-[100] font-semibold w-[95px] sm:w-[24%] text-regular"
            onClick={() => (operationPending ? null : setPool(poolType.primary))}
          >
            Primary
          </div>
          <div
            css={[pool.index === 2 ? tw`!text-white` : tw`text-grey-1`]}
            tw="h-[35px] duration-500 flex items-center z-[100] justify-center font-semibold 
            sm:w-[24%] w-[95px] text-regular"
            onClick={() => (operationPending ? null : setPool(poolType.hyper))}
          >
            Hyper
          </div>
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
              isFarm={true}
            />
            {wallet?.adapter?.publicKey && (
              <div tw="ml-auto flex items-center mr-2">
                <ShowDepositedToggle enabled={showDeposited} setEnable={setShowDeposited} />
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
            width={wallet?.adapter?.publicKey ? '55%' : '95%'}
            className="searchBarContainer"
            cssStyle={tw`h-8.75`}
            setSearchFilter={initiateGlobalSearch}
            placeholder="Search by token"
            bgColor={mode === 'dark' ? '#1f1f1f' : '#fff'}
            //filter={searchTokens}
            isFarm={true}
          />
          {wallet?.adapter?.publicKey && (
            <div tw="ml-auto flex items-center mr-2">
              <ShowDepositedToggle enabled={showDeposited} setEnable={setShowDeposited} />
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
              <th
                tw="!text-left !justify-start sm:pl-0 pl-2 !flex sm:!w-[30vw]"
                onClick={() => handleColumnSort('token')}
              >
                {TableHeaderTitle('Pool', null, true, sort === 'DESC' && sortType === 'token')}{' '}
              </th>
              <th
                tw="!flex !flex-row !justify-center !items-center sm:!w-[31vw]"
                onClick={() => handleColumnSort('apy')}
              >
                <Tooltip
                  color={mode === 'dark' ? '#EEEEEE' : '#1C1C1C'}
                  title={
                    <span tw="dark:text-black-4 text-grey-5 font-medium text-tiny">
                      APY is calculated based on 7D fees
                    </span>
                  }
                  placement="topLeft"
                  overlayClassName={mode === 'dark' ? 'farm-tooltip dark' : 'farm-tooltip'}
                  overlayInnerStyle={{ borderRadius: '8px' }}
                >
                  {TableHeaderTitle('APY', null, true, sort === 'DESC' && sortType === 'apy')}{' '}
                </Tooltip>
              </th>
              {!checkMobile() && (
                <th onClick={() => handleColumnSort('liquidity')}>
                  {TableHeaderTitle('Liquidity', null, true, sort === 'DESC' && sortType === 'liquidity')}{' '}
                </th>
              )}
              {!checkMobile() && (
                <th onClick={() => handleColumnSort('volume')}>
                  {TableHeaderTitle('24H Volume', null, true, sort === 'DESC' && sortType === 'volume')}{' '}
                </th>
              )}
              {!checkMobile() && (
                <th onClick={() => handleColumnSort('fee')}>
                  {TableHeaderTitle('24H Fees', null, true, sort === 'DESC' && sortType === 'fee')}{' '}
                </th>
              )}
              {!checkMobile() && (
                <th onClick={() => handleColumnSort('balance')}>
                  {TableHeaderTitle('My Balance', null, true, sort === 'DESC' && sortType === 'balance')}{' '}
                </th>
              )}
              <th tw="!text-right !justify-end !flex sm:text-right !w-[10%] sm:!w-[31vw]">
                {TableHeaderTitle(`Pools: ${poolSize}`, null, false)}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTokens?.length
              ? filteredTokens.map((coin: SSLToken) => (
                  <FarmTokenContent key={coin?.token} coin={coin} showDeposited={showDeposited} />
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

const FarmTokenContent: FC<{ coin: SSLToken; showDeposited: boolean }> = ({ coin, showDeposited }) => {
  const { filteredLiquidityAccounts, isTxnSuccessfull, liquidityAmount, sslTableData } = useSSLContext()
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const tokenMintAddress = useMemo(() => coin?.mint?.toBase58(), [coin])
  const { prices } = usePriceFeedFarm()
  const { mode } = useDarkMode()
  const [statsModal, setStatsModal] = useState<boolean>(false)

  const calculateUserDepositedAmount = (
    filteredLiquidityAccounts: any,
    tokenMintAddress: string,
    coin: SSLToken
  ) => {
    const account = filteredLiquidityAccounts[tokenMintAddress] || {} // Get account or use an empty object
    const amountDeposited = account.amountDeposited?.toNumber() || 0 // Get deposited amount or use 0
    const mintDecimals = coin?.mintDecimals || 0
    return amountDeposited / Math.pow(10, mintDecimals) // Calculate and return user deposited amount
  }

  const userDepositedAmount: number = useMemo(
    // Calculate user deposited amount
    () => calculateUserDepositedAmount(filteredLiquidityAccounts, tokenMintAddress, coin),
    [filteredLiquidityAccounts, tokenMintAddress, isTxnSuccessfull, coin]
  )
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
    else if (showDeposited && +userDepositedAmount.toFixed(2) > 0) return true
    else if (showDeposited && !(+userDepositedAmount.toFixed(2) > 0)) return false
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
          <td tw="!justify-start relative">
            {userDepositedAmount ? (
              <div tw="absolute rounded-[50%] mt-[-25px] ml-3.5 sm:ml-1.5 h-3 w-3 bg-gradient-1" />
            ) : (
              <></>
            )}
            <img tw="h-10 w-10 ml-4 sm:ml-2" src={`/img/crypto/${coin?.token}.svg`} />
            <div tw="ml-2.5">{coin?.token}</div>
            <div tw="z-[990]" onClick={(e) => e.stopPropagation()}>
              <Tooltip
                color={mode === 'dark' ? '#EEEEEE' : '#1C1C1C'}
                title={
                  <span tw="dark:text-black-4 text-grey-5 font-medium text-tiny">
                    Deposits are at {depositPercentage?.toFixed(2)}% capacity, the current cap is $
                    {truncateBigNumber(coin?.cappedDeposit)}.
                  </span>
                }
                placement="topRight"
                overlayClassName={mode === 'dark' ? 'farm-tooltip dark' : 'farm-tooltip'}
                overlayInnerStyle={{ borderRadius: '8px' }}
              >
                <img
                  src="/img/assets/farm_cap.svg"
                  alt="deposit-cap"
                  tw="ml-2.5 sm:ml-1.25 max-w-none"
                  height={20}
                  width={20}
                />
              </Tooltip>
            </div>
          </td>
          <td>{Number(formattedapiSslData?.apy)?.toFixed(2)}%</td>
          {!checkMobile() && (
            <td>{liquidity ? '$' + truncateBigNumber(liquidity) : <SkeletonCommon height="75%" width="75%" />}</td>
          )}
          {!checkMobile() && <td>${truncateBigNumber(formattedapiSslData?.volume)}</td>}
          {!checkMobile() && (
            <td>
              <Tooltip
                color={mode === 'dark' ? '#EEEEEE' : '#1C1C1C'}
                title={
                  <span tw="dark:text-black-4 text-grey-5 font-medium text-tiny">
                    {truncateBigNumber(formattedapiSslData?.fee)} {coin?.token}
                  </span>
                }
                placement="topRight"
                overlayClassName={mode === 'dark' ? 'farm-tooltip dark' : 'farm-tooltip'}
                overlayInnerStyle={{ borderRadius: '8px' }}
              >
                ${truncateBigNumber(formattedapiSslData?.fee * prices?.[getPriceObject(coin?.token)]?.current)}
              </Tooltip>
            </td>
          )}
          {!checkMobile() && <td>{userDepositedAmount ? truncateBigNumber(userDepositedAmount) : '0.00'}</td>}
          <td tw="!w-[10%] pr-3 sm:!w-[33%] sm:pr-1">
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
