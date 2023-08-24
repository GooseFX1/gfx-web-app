import { FC, useMemo, useState, useEffect } from 'react'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { Button, SearchBar, ShowDepositedToggle } from '../../components'
import { useDarkMode, useSSLContext } from '../../context'
import { TableHeaderTitle } from '../../utils/GenericDegsin'
import { checkMobile } from '../../utils'
import useBreakPoint from '../../hooks/useBreakPoint'
import { CircularArrow } from '../../components/common/Arrow'
import { ExpandedView } from './ExpandedView'
import { SSLToken, poolType } from './constants'

const WRAPPER = styled.div`
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type='number'] {
    -moz-appearance: textfield;
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
      sm:mb-0 rounded-small cursor-pointer h-[60px] sm:h-[70px]`}

      &:after {
        content: ' ';
        display: block;
        visibility: hidden;
        clear: both;
      }
    }
    td {
      ${tw`h-[100%] flex items-center justify-center  text-[20px] font-semibold text-center
       dark:text-grey-5 text-black-4`}
    }
  }

  tbody td,
  thead th {
    width: 15%;
    float: left;
    text-align: center;

    @media (max-width: 500px) {
      ${tw`w-[33%]`}
    }
  }
`

export const FarmTable: FC = () => {
  const { mode } = useDarkMode()
  const breakpoint = useBreakPoint()
  const { operationPending, pool, setPool, sslData } = useSSLContext()
  const [searchTokens, setSearchTokens] = useState<string>()
  const [showDeposited, setShowDeposited] = useState<boolean>(false)
  const filteredTokens = useMemo(
    () =>
      searchTokens
        ? sslData.filter((token) => token?.token?.toLocaleLowerCase().includes(searchTokens))
        : [...sslData],
    [searchTokens, sslData]
  )
  return (
    <WRAPPER>
      <div tw="flex flex-row items-center mb-5 sm:items-stretch sm:pr-4 sm:mb-3.75">
        <img
          src={`/img/assets/${pool.name}_pools.svg`}
          alt="pool-icon"
          height={55}
          width={50}
          tw="mr-3.75 duration-500"
        />
        <div tw="flex flex-col">
          <div tw="text-average font-semibold dark:text-grey-5 text-black-4 capitalize sm:text-average sm:mb-1.5">
            {pool.index === 3 ? 'Stable' : pool.index === 1 ? 'Primary' : 'Hyper'} Pools
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
              pool.index === 3 ? tw`ml-0` : pool.index === 1 ? tw`ml-[95px]` : tw`ml-[190px]`
            ]}
            tw="h-[35px] bg-blue-1 w-[95px] absolute rounded-[50px]"
          ></div>
          <div
            css={[pool.index === 3 ? tw`!text-white` : tw`text-grey-1`]}
            tw="h-[35px] duration-500 flex items-center z-[100] justify-center font-semibold w-[95px]"
            onClick={() => (operationPending ? null : setPool(poolType.stable))}
          >
            Stable
          </div>
          <div
            css={[pool.index === 1 ? tw`!text-white` : tw`text-grey-1`]}
            tw="h-[35px] flex items-center justify-center z-[100] font-semibold w-[95px]"
            onClick={() => (operationPending ? null : setPool(poolType.primary))}
          >
            Primary
          </div>
          <div
            css={[pool.index === 2 ? tw`!text-white` : tw`text-grey-1`]}
            tw="h-[35px] duration-500 flex items-center z-[100] justify-center font-semibold w-[95px]"
            onClick={() => (operationPending ? null : setPool(poolType.hyper))}
          >
            Hyper
          </div>
        </div>
        {breakpoint.isDesktop && (
          <div tw="flex items-center w-full">
            <SearchBar
              width="425px"
              cssStyle={tw`h-8.75`}
              setSearchFilter={setSearchTokens}
              placeholder="Search by token symbol"
              bgColor={mode === 'dark' ? '#1f1f1f' : '#fff'}
            />
            <div tw="ml-auto flex items-center mr-2">
              <ShowDepositedToggle enabled={showDeposited} setEnable={setShowDeposited} />
              <div
                tw="h-8.75 leading-5 text-regular text-right dark:text-grey-2 text-grey-1
               font-semibold mt-[-4px] ml-2.5"
              >
                Show <br /> Deposited
              </div>
            </div>
          </div>
        )}
      </div>
      {breakpoint.isMobile && (
        <div tw="sm:mt-4">
          <SearchBar
            width={`95%`}
            cssStyle={tw`h-8.75`}
            setSearchFilter={setSearchTokens}
            placeholder="Search by token symbol"
            bgColor={mode === 'dark' ? '#1f1f1f' : '#fff'}
          />
        </div>
      )}
      <div>
        <table tw="mt-4">
          <FarmTableHeaders poolSize={filteredTokens && filteredTokens.length && filteredTokens.length} />
          <tbody>
            {filteredTokens && filteredTokens.length ? (
              filteredTokens.map((coin: SSLToken, index: number) => (
                <FarmTableCoin key={`${index}_${pool.name}`} coin={coin} showDeposited={showDeposited} />
              ))
            ) : (
              <tr>
                <div
                  tw="h-full flex flex-row justify-center items-center text-regular 
                  font-semibold dark:text-white text-black"
                >
                  No results found!
                </div>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </WRAPPER>
  )
}

const FarmTableHeaders: FC<{ poolSize: number }> = ({ poolSize }) => (
  <thead>
    <tr>
      <th tw="!text-left !justify-start pl-2 !flex"> {TableHeaderTitle('Asset', null, true)} </th>
      <th>{TableHeaderTitle('APY', null, true)} </th>
      {!checkMobile() && <th>{TableHeaderTitle('Liquidity', null, true)} </th>}
      {!checkMobile() && <th>{TableHeaderTitle('24H Volume', null, true)} </th>}
      {!checkMobile() && <th>{TableHeaderTitle('24H Fees', null, true)} </th>}
      {!checkMobile() && <th>{TableHeaderTitle('Balance', null, true)} </th>}
      <th tw="!text-right !justify-end !flex !w-[10%] sm:!w-[33%]">
        {TableHeaderTitle(`Pools: ${poolSize}`, null, false)}
      </th>
    </tr>
  </thead>
)

const FarmTableCoin: FC<{ coin: SSLToken; showDeposited: boolean }> = ({ coin, showDeposited }) => {
  const { pool, filteredLiquidityAccounts, isTxnSuccessfull } = useSSLContext()
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const tokenMintAddress = useMemo(() => coin?.mint?.toBase58(), [coin])
  const userDepositedAmount = useMemo(
    () =>
      filteredLiquidityAccounts[tokenMintAddress]?.amountDeposited?.toNumber() / Math.pow(10, coin?.mintDecimals),
    [filteredLiquidityAccounts, isTxnSuccessfull]
  )
  const showToggleFilteredTokens: boolean = useMemo(() => {
    if (!showDeposited) return true
    else if (showDeposited && userDepositedAmount) return true
    else if (showDeposited && !userDepositedAmount) return false
  }, [showDeposited, userDepositedAmount])

  useEffect(() => {
    setIsExpanded(false)
  }, [pool, showDeposited])

  return (
    showToggleFilteredTokens && (
      <>
        <tr
          css={[tw`duration-500`]}
          className={isExpanded && 'tableRowGradient'}
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          <td tw="!justify-start">
            <img tw="h-10 w-10 ml-4 sm:ml-2" src={`/img/crypto/${coin?.token}.svg`} />
            <div tw="ml-2.5">{coin?.token}</div>
          </td>
          <td>4.56 %</td>
          {!checkMobile() && <td>$550,111.22</td>}
          {!checkMobile() && <td>$80,596</td>}
          {!checkMobile() && <td>$30,596</td>}
          {!checkMobile() && (
            <td>{userDepositedAmount && !isNaN(userDepositedAmount) ? userDepositedAmount.toFixed(2) : '0.00'}</td>
          )}
          <td tw="!w-[10%] sm:!w-[33%]">
            <Button
              cssStyle={tw`h-[35px] text-white font-semibold text-regular bg-gradient-1`}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => e.stopPropagation()}
            >
              Stats
            </Button>
            <div tw="ml-2">
              <CircularArrow cssStyle={tw`h-5 w-5`} invert={isExpanded} />
            </div>
          </td>
        </tr>
        {<ExpandedView isExpanded={isExpanded} coin={coin} userDepositedAmount={userDepositedAmount} />}
      </>
    )
  )
}
