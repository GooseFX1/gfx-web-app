import { FC, useEffect, useMemo, useState } from 'react'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { SearchBar, ShowDepositedToggle } from '../../components'
import { useDarkMode, usePriceFeedFarm, useSSLContext } from '../../context'
import { TableHeaderTitle } from '../../utils/GenericDegsin'
import { checkMobile } from '../../utils'
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
      ${tw`h-[40px] sm:h-full`}
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

export const FarmTable: FC = () => {
  const { mode } = useDarkMode()
  const breakpoint = useBreakPoint()
  const { wallet } = useWallet()
  const { operationPending, pool, setPool, sslData, filteredLiquidityAccounts } = useSSLContext()
  const [searchTokens, setSearchTokens] = useState<string>('')
  const [initialLoad, setInitialLoad] = useState<boolean>(true)
  const [showDeposited, setShowDeposited] = useState<boolean>(false)

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

  const filteredTokens = useMemo(
    () =>
      searchTokens
        ? sslData.filter((token) => token?.token?.toLocaleLowerCase().includes(searchTokens))
        : [...sslData],
    [searchTokens, sslData]
  )

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
        <div tw="flex cursor-pointer relative">
          <div
            css={[
              tw`duration-500`,
              pool.index === 3
                ? tw`ml-0`
                : pool.index === 1
                ? tw`ml-[95px] sm:ml-[72px]`
                : tw`ml-[190px] sm:ml-[144px]`
            ]}
            tw="h-[35px] bg-blue-1 w-[95px] sm:w-[72px] absolute rounded-[50px]"
          ></div>
          <div
            css={[pool.index === 3 ? tw`!text-white` : tw`text-grey-1`]}
            tw="h-[35px] duration-500 flex items-center z-[100] sm:w-[72px] justify-center 
            font-semibold w-[95px] text-regular"
            onClick={() => (operationPending ? null : setPool(poolType.stable))}
          >
            Stable
          </div>
          <div
            css={[pool.index === 1 ? tw`!text-white` : tw`text-grey-1`]}
            tw="h-[35px] flex items-center justify-center z-[100] font-semibold w-[95px] sm:w-[72px] text-regular"
            onClick={() => (operationPending ? null : setPool(poolType.primary))}
          >
            Primary
          </div>
          <div
            css={[pool.index === 2 ? tw`!text-white` : tw`text-grey-1`]}
            tw="h-[35px] duration-500 flex items-center z-[100] justify-center font-semibold 
            sm:w-[72px] w-[95px] text-regular"
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
              setSearchFilter={setSearchTokens}
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

        {breakpoint.isMobile && wallet?.adapter?.publicKey && (
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
      {breakpoint.isMobile && (
        <div tw="sm:mt-4 ">
          <SearchBar
            className="searchBarContainer"
            cssStyle={tw`h-8.75 w-full`}
            setSearchFilter={setSearchTokens}
            placeholder="Search by token symbol"
            bgColor={mode === 'dark' ? '#1f1f1f' : '#fff'}
            filter={searchTokens}
            isFarm={true}
          />
        </div>
      )}

      <div>
        <table tw="mt-4">
          <FarmTableHeaders poolSize={showDeposited ? numberOfCoinsDeposited : filteredTokens?.length} />
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
            <a href="https://discord.com/invite/cDEPXpY26q" tw="font-semibold">
              Request Pool
            </a>
          </address>
        )}
      </div>
    </div>
  )
}

const FarmTableHeaders: FC<{ poolSize: number }> = ({ poolSize }) => (
  <thead>
    <tr>
      <th tw="!text-left !justify-start sm:pl-0 pl-2 !flex sm:!w-[30vw]">
        {TableHeaderTitle('Asset', null, false)}{' '}
      </th>
      <th tw="sm:!w-[31vw] ">{TableHeaderTitle('APY', null, false)} </th>
      {!checkMobile() && <th>{TableHeaderTitle('Liquidity', null, false)} </th>}
      {!checkMobile() && <th>{TableHeaderTitle('24H Volume', null, false)} </th>}
      {!checkMobile() && <th>{TableHeaderTitle('24H Fees', null, false)} </th>}
      {!checkMobile() && <th>{TableHeaderTitle('My Balance', null, false)} </th>}
      <th tw="!text-right !justify-end !flex sm:text-right !w-[10%] sm:!w-[31vw]">
        {TableHeaderTitle(`Pools: ${poolSize}`, null, false)}
      </th>
    </tr>
  </thead>
)

const FarmTokenContent: FC<{ coin: SSLToken; showDeposited: boolean }> = ({ coin, showDeposited }) => {
  const { filteredLiquidityAccounts, isTxnSuccessfull, liquidityAmount, sslTableData } = useSSLContext()
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const tokenMintAddress = useMemo(() => coin?.mint?.toBase58(), [coin])
  const { prices } = usePriceFeedFarm()
  const { mode } = useDarkMode()

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
          apy: sslTableData[key].apy,
          fee: sslTableData[key].fee / 10 ** decimal,
          volume: sslTableData[key].volume / 1_000_000
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
      apy: apiSslData.apy.toFixed(2),
      fee: apiSslData.fee.toFixed(2),
      volume: apiSslData.volume.toFixed(2)
    }),
    [apiSslData]
  )

  const showToggleFilteredTokens: boolean = useMemo(() => {
    if (!showDeposited) return true
    else if (showDeposited && +userDepositedAmount.toFixed(2) > 0) return true
    else if (showDeposited && !(+userDepositedAmount.toFixed(2) > 0)) return false
  }, [showDeposited, userDepositedAmount])

  return (
    showToggleFilteredTokens && (
      <>
        <tr
          css={[tw`duration-500`]}
          className={isExpanded && 'tableRowGradient'}
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          <td tw="!justify-start">
            {userDepositedAmount ? (
              <div tw="absolute rounded-[50%] mt-[-25px] ml-3.5 sm:ml-1.5 h-3 w-3 bg-gradient-1" />
            ) : (
              <></>
            )}
            <img tw="h-10 w-10 ml-4 sm:ml-2" src={`/img/crypto/${coin?.token}.svg`} />
            <div tw="ml-2.5">{coin?.token}</div>
            <div tw="z-[999]" onClick={(e) => e.stopPropagation()}>
              <Tooltip
                color={mode === 'dark' ? '#EEEEEE' : '#1C1C1C'}
                title={
                  <span tw="dark:text-black-4 text-grey-5 font-medium text-tiny">
                    Deposits are at {depositPercentage?.toFixed(2)}% capacity, the current cap is $5K.
                  </span>
                }
                placement="topRight"
                overlayClassName={mode === 'dark' ? 'farm-tooltip dark' : 'farm-tooltip'}
                overlayInnerStyle={{ borderRadius: '8px' }}
              >
                <img
                  src="/img/assets/farm_cap.svg"
                  alt="deposit-cap"
                  tw="ml-2.5 sm:ml-[5px] max-w-none"
                  height={20}
                  width={20}
                />
              </Tooltip>
            </div>
          </td>
          <td>{formattedapiSslData?.apy} %</td>
          {!checkMobile() && (
            <td>{liquidity ? '$' + liquidity.toFixed(2) : <SkeletonCommon height="75%" width="75%" />}</td>
          )}
          {!checkMobile() && <td>${formattedapiSslData?.volume}</td>}
          {!checkMobile() && <td>${formattedapiSslData?.fee}</td>}
          {!checkMobile() && <td>{userDepositedAmount ? userDepositedAmount.toFixed(2) : '0.00'}</td>}
          <td tw="!w-[10%] pr-3 sm:!w-[33%] sm:pr-1">
            <div tw="ml-auto sm:mr-2">
              <CircularArrow cssStyle={tw`h-5 w-5`} invert={isExpanded} />
            </div>
          </td>
        </tr>
        {<ExpandedView isExpanded={isExpanded} coin={coin} userDepositedAmount={userDepositedAmount} />}
      </>
    )
  )
}
