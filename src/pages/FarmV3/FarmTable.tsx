/* eslint-disable */
import { FC, useCallback, useMemo, useRef, useState } from 'react'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { ArrowClicker, ArrowClickerWhite, Button, SearchBar } from '../../components'
import { useAccounts, useDarkMode, usePriceFeed, usePriceFeedFarm } from '../../context'
import { ADDRESSES, getPriceObject } from '../../web3'
import { TableHeaderTitle } from '../../utils/GenericDegsin'
import { useAnimateButtonSlide } from '../Farm/FarmFilterHeader'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connect } from '../../layouts'
import { ModeOfOperation } from './constants'

const WRAPPER = styled.div<{ $poolIndex }>`
  .pinkGradient {
    background: linear-gradient(97deg, #f7931a 2%, #ac1cc7 99%);
  }
  .slider-animation-web {
    ${tw`absolute w-[40%] h-[44px] rounded-[36px] z-[-1]`}
    left: ${({ $poolIndex }) => $poolIndex * 50 + 4.5}%;
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    transition: left 500ms ease-in-out;
  }
  .inputContainer {
    ${tw`w-[400px] h-10`}
  }
  .selectedBackground {
    ${tw`bg-blue-1 !text-white`};
  }
  .tableRowGradient {
    ${tw`duration-500`};
    background: linear-gradient(111deg, rgba(247, 147, 26, 0.4) 0%, rgba(172, 28, 199, 0.4) 100%);
  }
  table {
    ${tw`sm:dark:bg-black-3 sm:bg-white mt-[10px] w-full `}
    border-radius: 20px 20px 0 0;
    overflow-x: hidden;

    @media (max-width: 500px) {
      width: 100vw;
      ${tw`sticky mt-[0px]`}
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
    ${tw`sm:dark:bg-black-5 sm:bg-black-4 text-base font-semibold  
    sm:h-[52px] rounded-[20px 20px 5px 5px]`}

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
    ${tw`dark:bg-black-1 bg-grey-5 sm:px-[15px]`}
    // if height need add here
    ${({ theme }) => theme.customScrollBar('1px')}
    overflow-x: hidden;

    @media (max-width: 500px) {
      height: calc(100vh - 160px);
    }

    tr {
      ${tw`dark:bg-black-2 bg-white mt-[15px] border-solid border-1 dark:border-black-2 border-white
      sm:mb-0 rounded-[15px] cursor-pointer h-[70px] sm:h-auto sm:rounded-[10px]`}

      /* &:hover {
        ${tw`border-grey-2 rounded-[13px] sm:rounded-[8px] `}
      } */

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
      text-align: center;
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

export const FarmTable: FC = () => {
  const { mode } = useDarkMode()
  const [poolIndex, setPoolIndex] = useState<0 | 1>(0)
  const poolTypes = ['stable', 'hyper']
  const [selectedPool, setSelectedPool] = useState<string>(poolTypes[0])
  const [searchTokens, setSearchTokens] = useState<string>()

  const arr = useMemo(() => Object.keys(ADDRESSES['mainnet-beta'][selectedPool]).map((coin) => coin), [poolTypes])

  const filteredTokens = useMemo(
    () => (searchTokens ? arr.filter((ar) => ar.toLocaleLowerCase().includes(searchTokens)) : [...arr]),
    [searchTokens, arr]
  )

  const buttons = poolTypes.map((pool, index) => (
    <Button
      cssStyle={tw`h-11 font-semibold  w-[100px] bg-black-1`}
      key={pool}
      onClick={() => handleClick(pool, index)}
      className={pool === selectedPool ? 'selectedBackground' : ''}
    >
      {pool}
    </Button>
  ))

  const handleClick = useCallback((pool, index) => {
    setPoolIndex(index)
    setSelectedPool(pool)
    // handleSlide(index)
  }, [])

  const capitalizeFirstLetter = (input: string): string => {
    return input.charAt(0).toUpperCase() + input.slice(1)
  }
  return (
    <WRAPPER>
      <div tw="flex flex-row items-end mb-5">
        <img
          src={`/img/assets/${selectedPool}_pools.svg`}
          alt="pool-icon"
          height={77}
          width={70}
          tw="mr-3 duration-500 "
        />
        <div tw="flex flex-col">
          <div tw="text-[25px] font-semibold dark:text-grey-5 text-black-4">
            {capitalizeFirstLetter(selectedPool)} Pools
          </div>

          <div tw="text-regular font-medium text-grey-1 dark:text-grey-2 mt-[-4px]">
            {poolIndex === 0 ? (
              <>
                If you're looking for stable returns with balanced risk, <br /> Stable pools are the way to go.
              </>
            ) : (
              <>
                If you're looking for high returns with a bit more risk,
                <br /> Hyper pools are the way to go.
              </>
            )}
          </div>
        </div>
      </div>
      <div tw="flex items-center">
        <div tw="flex cursor-pointer">
          <div
            css={[tw`duration-500`, poolIndex === 1 ? tw`ml-[100px] ` : tw`ml-0`]}
            tw="h-11 bg-blue-1 w-[100px] absolute rounded-[50px]"
          ></div>
          <div
            css={[poolIndex === 0 && tw`!text-white `]}
            tw="h-11 flex items-center justify-center z-10 font-semibold w-[100px]"
            onClick={() => handleClick(poolTypes[0], 0)}
          >
            Sable
          </div>
          <div
            css={[poolIndex === 1 && tw`!text-white `]}
            tw="h-11 flex items-center justify-center z-10 font-semibold w-[100px]"
            onClick={() => handleClick(poolTypes[1], 1)}
          >
            Hyper
          </div>
        </div>

        <SearchBar
          setSearchFilter={setSearchTokens}
          width={400}
          placeholder="Search by token symbol"
          bgColor={mode === 'dark' ? '#1f1f1f' : '#fff'}
          set
        />
      </div>
      <div>
        <table tw="mt-4">
          <FarmTableHeaders />
          <tbody>
            {filteredTokens.map((coin, index) => (
              <FarmTableCoin key={index} coin={coin} />
            ))}
          </tbody>
        </table>
      </div>
    </WRAPPER>
  )
}

const FarmTableHeaders = () => {
  return (
    <thead>
      <tr>
        <th tw="!text-left !justify-start pl-2 !flex"> {TableHeaderTitle('Asset', null, true)} </th>
        <th>{TableHeaderTitle('APY', null, true)} </th>
        <th>{TableHeaderTitle('Liquidity', null, true)} </th>
        <th>{TableHeaderTitle('24H Volume', null, true)} </th>
        <th>{TableHeaderTitle('24H Fees', null, true)}</th>
        <th>{TableHeaderTitle('Balance', null, true)}</th>
        <th tw="!text-right !justify-end !flex !w-[10%]">{TableHeaderTitle(`Pools: 3`, null, false)}</th>
      </tr>
    </thead>
  )
}

const FarmTableCoin: FC<{ coin: any }> = ({ coin }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  return (
    <>
      <tr className={isExpanded ? 'tableRowGradient' : ''} onClick={() => setIsExpanded((prev) => !prev)}>
        <td tw="!justify-start">
          <img tw="h-10 w-10 ml-4" src={`/img/crypto/${coin}.svg`} />
          <div tw="ml-2.5">{coin}</div>
        </td>
        <td>4.56 %</td>
        <td>$550,111.22</td>
        <td>$80,596</td>
        <td>$30,596</td>
        <td>0.0</td>
        <td tw="!w-[10%]">
          <Button className="pinkGradient" cssStyle={tw` font-semibold text-regular `}>
            Stats
          </Button>
          <ArrowClicker cssStyle={tw`h-5 w-5`} arrowRotation={isExpanded} />
        </td>
      </tr>
      <ExpandedView isExpanded={isExpanded} coin={coin} />
    </>
  )
}

const ExpandedView: FC<{ isExpanded: boolean; coin: string }> = ({ isExpanded, coin }) => {
  const { wallet } = useWallet()
  const { getUIAmount } = useAccounts()
  const { prices } = usePriceFeedFarm()
  const [poolIndex, setPoolIndex] = useState<number>(0)
  const [userInputVariable, setUserInputVariable] = useState<number>()
  const tokenAddress = ADDRESSES['mainnet-beta']?.sslPool[coin].address // change this later
  const pubKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])
  let userTokenBalance = useMemo(
    () => (pubKey && tokenAddress ? getUIAmount(tokenAddress.toString()) : 0),
    [tokenAddress, getUIAmount, pubKey]
  )
  const userTokenBalanceInDollars = useMemo(
    () => prices[getPriceObject(coin)]?.current * userTokenBalance,
    [prices, coin, prices[getPriceObject(coin)], userTokenBalance]
  )

  const [modeOfOperation, setModeOfOperation] = useState<string>(ModeOfOperation.DEPOSIT)
  const handleModeOfOperation = (pool: number) => {
    setPoolIndex(pool)
    if (pool) setModeOfOperation(ModeOfOperation.WITHDRAW)
    else setModeOfOperation(ModeOfOperation.DEPOSIT)
  }

  return (
    <div
      css={[
        tw`dark:bg-black-2 bg-white mx-10 rounded-[0 0 15px 15px] duration-300 flex justify-between `,
        isExpanded ? tw`h-[135px] visible text-regular p-5` : tw`h-0 invisible text-[0px] p-0`
      ]}
    >
      <div tw="flex flex-col">
        {isExpanded && (
          <>
            <div tw="flex font-semibold duration-500">
              <div
                css={[
                  tw`bg-blue-1 h-8 w-[100px] rounded-full`,
                  poolIndex === 1 ? tw`absolute ml-[100px] duration-500` : tw`absolute ml-0 duration-500`
                ]}
              ></div>
              <div
                css={[
                  tw`h-8 w-[100px] z-10 flex items-center justify-center cursor-pointer`,
                  poolIndex === 0 && tw`!text-white`
                ]}
                onClick={() => handleModeOfOperation(0)}
              >
                Deposit
              </div>
              <div
                css={[
                  tw`h-8 w-[100px] z-10 flex items-center justify-center cursor-pointer`,
                  poolIndex === 1 && tw`!text-white`
                ]}
                onClick={() => handleModeOfOperation(1)}
              >
                Withdraw
              </div>
            </div>
          </>
        )}
        <div tw="mt-5">
          <FarmStats
            isExpanded={isExpanded}
            keyStr="Wallet Balance"
            value={`${userTokenBalance.toFixed(2)} ${coin} ($ ${userTokenBalanceInDollars.toFixed(2)} USD)`}
          />
        </div>
      </div>

      <div>
        <div tw="flex">
          <div tw="absolute flex">
            {/* // handle cases for withdraw operation */}
            <div
              onClick={() => setUserInputVariable(parseFloat((userTokenBalance / 2).toFixed(2)))}
              tw="font-semibold text-grey-1 dark:text-grey-2 mt-2 ml-4 cursor-pointer"
            >
              Min
            </div>
            {/* // handle cases for withdraw mode of operation */}

            <div
              onClick={() => setUserInputVariable(parseFloat(userTokenBalance.toFixed(2)))}
              tw="font-semibold text-grey-1 dark:text-grey-2 mt-2 ml-2 cursor-pointer"
            >
              Max
            </div>
          </div>

          <input
            onChange={(e) => setUserInputVariable(parseFloat(e.target.value))}
            placeholder={isExpanded ? `0.00 ${coin}` : ``}
            value={userInputVariable ?? null}
            css={[
              tw`duration-500 rounded-[50px]  text-regular font-semibold outline-none dark:bg-black-1 bg-grey-5 border-none`,
              isExpanded ? tw`w-[400px] h-10 p-4 pl-[300px]` : tw`h-0 w-0 pl-0`
            ]}
            type="text"
          />
          {userInputVariable >= 0.000001 && (
            <div tw="font-semibold text-grey-1 dark:text-grey-2 absolute ml-[345px] mt-2">{coin}</div>
          )}
        </div>

        {isExpanded && (
          <div tw="mt-4">
            {wallet?.adapter?.publicKey ? (
              <div>
                <Button
                  cssStyle={tw`duration-500 w-[400px] h-10 bg-blue-1 text-regular !text-white font-semibold
                   rounded-[50px] flex items-center justify-center outline-none border-none`}
                >
                  {modeOfOperation}
                </Button>
              </div>
            ) : (
              <Connect width="400px" height="40px" />
            )}
          </div>
        )}
      </div>

      <div>
        <FarmStats isExpanded={isExpanded} keyStr="Total Earnings" value={`2.5 ${coin} ($12 USD)`} />
        <div tw="mt-2">
          <FarmStats isExpanded={isExpanded} keyStr="Daily Earnings" value={`2.5 ${coin} ($12 USD)`} />
        </div>
      </div>
    </div>
  )
}

const FarmStats: FC<{ keyStr: string; value: string; isExpanded: boolean }> = ({ keyStr, value, isExpanded }) => {
  return (
    <div
      css={[
        tw`font-semibold duration-500`,
        isExpanded ? tw`text-regular opacity-100` : tw`text-[0px] invisible opacity-0`
      ]}
    >
      <div tw="text-grey-1">{keyStr}</div>
      <div tw="text-grey-2">{value}</div>
    </div>
  )
}
