/* eslint-disable */
import { FC, useMemo, Dispatch, SetStateAction, useState, useEffect } from 'react'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { ArrowClicker, Button, SearchBar, ShowDepositedToggle } from '../../components'
import { useAccounts, useConnectionConfig, useDarkMode, useFarmContext, usePriceFeedFarm } from '../../context'
import {
  ADDRESSES,
  executeDeposit,
  executeWithdraw,
  firstLetterCapital,
  getPriceObject,
  getPoolRegistryAccountKeys,
  getLiquidityAccountKey,
  SSLToken
} from '../../web3'
import { TableHeaderTitle } from '../../utils/GenericDegsin'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connect } from '../../layouts'
import {
  ModeOfOperation,
  insufficientSOLMsg,
  invalidDepositErrMsg,
  invalidWithdrawErrMsg,
  genericErrMsg,
  sslSuccessfulMessage,
  sslErrorMessage
} from './constants'
import { checkMobile, notify } from '../../utils'
import useBreakPoint from '../../hooks/useBreakPoint'
import { CircularArrow } from '../../components/common/Arrow'
import { ExpandedView } from './ExpandedView'

const WRAPPER = styled.div<{ $poolIndex }>`
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
    ${tw`sm:dark:bg-black-3 sm:bg-white mt-[10px] w-full overflow-x-hidden `}
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
          ${tw`h-full `}
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
       dark:text-grey-5 text-black-4 `}
    }
  }

  tbody td,
  thead th {
    width: 15%;
    float: left;
    text-align: center;

    @media (max-width: 500px) {
      ${tw`w-[33%] `}
    }
  }
`

export const FarmTable: FC<{ poolIndex: number; setPoolIndex: Dispatch<SetStateAction<number>> }> = ({
  poolIndex,
  setPoolIndex
}) => {
  const { mode } = useDarkMode()
  const poolTypes = ['stable', 'hyper']
  const [selectedPool, setSelectedPool] = useState<string>(poolTypes[0])
  const [searchTokens, setSearchTokens] = useState<string>()
  const breakpoint = useBreakPoint()
  const sslPoolArr = useMemo(
    () => ADDRESSES['mainnet-beta'][selectedPool].map((coin: SSLToken) => coin),
    [poolTypes]
  )
  const [showDeposited, setShowDeposited] = useState<boolean>(false)
  const filteredTokens = useMemo(
    () =>
      searchTokens
        ? sslPoolArr.filter((token: SSLToken) => token?.name?.toLocaleLowerCase().includes(searchTokens))
        : [...sslPoolArr],
    [searchTokens, sslPoolArr]
  )
  const handlePoolSelection = (pool, index) => {
    setPoolIndex(index)
    setSelectedPool(pool)
  }
  return (
    <WRAPPER>
      <div tw="flex flex-row items-end mb-5 sm:items-stretch sm:pr-4 sm:mb-3.75">
        <img
          src={`/img/assets/${firstLetterCapital(selectedPool)}_pools.svg`}
          alt="pool-icon"
          height={77}
          width={70}
          tw="mr-3.75 duration-500"
        />
        <div tw="flex flex-col">
          <div tw="text-[25px] font-semibold dark:text-grey-5 text-black-4 capitalize sm:text-average sm:mb-1.5">
            {selectedPool === 'stable' ? 'Stable' : 'Alpha'} Pools
          </div>

          <div tw="text-regular font-medium text-grey-1 dark:text-grey-2 mt-[-4px] sm:text-tiny sm:leading-5">
            {poolIndex === 0 ? (
              <>
                If you're looking for stable returns with balanced risk,
                {!checkMobile() && <br />} Stable pools are the way to go.
              </>
            ) : (
              <>
                If you're looking for high returns with a bit more risk,
                {!checkMobile() && <br />} Hyper pools are the way to go.
              </>
            )}
          </div>
        </div>
      </div>
      <div tw="flex items-center">
        <div tw="flex cursor-pointer relative">
          <div
            css={[tw`duration-500`, poolIndex === 1 ? tw`ml-[95px] ` : tw`ml-0`]}
            tw="h-[35px] bg-blue-1 w-[95px] absolute rounded-[50px]"
          ></div>
          <div
            css={[poolIndex === 0 ? tw`!text-white ` : tw`text-grey-1`]}
            tw="h-[35px] duration-500 flex items-center z-[100] justify-center font-semibold w-[95px]  "
            onClick={() => handlePoolSelection(poolTypes[0], 0)}
          >
            Stable
          </div>
          <div
            css={[poolIndex === 1 ? tw`!text-white ` : tw`text-grey-1`]}
            tw="h-[35px] flex items-center justify-center z-[100] font-semibold w-[95px] "
            onClick={() => handlePoolSelection(poolTypes[1], 1)}
          >
            Alpha
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
              <div tw="h-8.75 leading-5 text-regular text-right dark:text-grey-2 text-grey-1 font-semibold mt-[-4px] ml-2.5">
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
              filteredTokens.map((coin: SSLToken, index) => (
                <FarmTableCoin key={index} coin={coin} selectedPool={selectedPool} />
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

const FarmTableCoin: FC<{ coin: SSLToken; selectedPool: string }> = ({ coin, selectedPool }) => {
  const { SSLProgram } = usePriceFeedFarm() //sslchange ssl program
  const { wallet } = useWallet()
  const userPublicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  useEffect(() => {
    setIsExpanded(false)
  }, [selectedPool])

  const [userdepositedAmount, setUserDepositedAmount] = useState<number>(0)

  useEffect(() => {
    ;(async () => {
      if (SSLProgram) {
        const liquidityAccountKey = await getLiquidityAccountKey(userPublicKey, coin?.address)
        if (coin?.address.toString() === 'So11111111111111111111111111111111111111112') {
          //sslchange: remove this hardcoded
          const liquidityAccount = await SSLProgram?.account?.liquidityAccount?.fetch(liquidityAccountKey)
          const userDeposited = liquidityAccount?.amountDeposited?.toNumber()
          //sslchange: remove logs
          console.log('liquidityAccount', liquidityAccount.totalEarned.toNumber(), userDeposited)
          setUserDepositedAmount(userDeposited / Math.pow(10, coin?.decimals))
        }
      }
    })()
  }, [SSLProgram, userPublicKey])
  return (
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
        {!checkMobile() && <td>{userdepositedAmount ? userdepositedAmount.toFixed(2) : '0.0'}</td>}
        <td tw="!w-[10%] sm:!w-[33%]">
          <Button cssStyle={tw`h-[35px] text-white font-semibold text-regular bg-gradient-1`}>Stats</Button>
          <div tw="ml-2">
            <CircularArrow cssStyle={tw`h-5 w-5`} invert={isExpanded} />
          </div>
        </td>
      </tr>
      {<ExpandedView isExpanded={isExpanded} coin={coin} />}
    </>
  )
}
