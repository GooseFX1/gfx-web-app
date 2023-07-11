/* eslint-disable */
import { FC, useCallback, useMemo, useRef, useState } from 'react'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { ArrowClicker, ArrowClickerWhite, Button, SearchBar } from '../../components'
import { useDarkMode } from '../../context'
import { ADDRESSES } from '../../web3'
import { TableHeaderTitle } from '../../utils/GenericDegsin'
import { useAnimateButtonSlide } from '../Farm/FarmFilterHeader'

const WRAPPER = styled.div`
  .pinkGradient {
    background: linear-gradient(97deg, #f7931a 2%, #ac1cc7 99%);
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
  const arr = useMemo(() => Object.keys(ADDRESSES['mainnet-beta'].stable).map((coin) => coin), [])
  const buttonRefs = useRef<HTMLButtonElement[]>([])
  const sliderRef = useRef<HTMLDivElement>(null)

  const handleSlide = useAnimateButtonSlide(sliderRef, buttonRefs)
  const poolTypes = ['Stable', 'Hyper']

  const [poolIndex, setPoolIndex] = useState<0 | 1>(0)
  const [selectedPool, setSelectedPool] = useState<string>(poolTypes[0])

  const buttons = poolTypes.map((pool, index) => (
    <Button
      ref={(el) => {
        buttonRefs.current[index] = el
        if (index == poolIndex) {
          handleSlide(poolIndex)
        }
      }}
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
    handleSlide(index)
  }, [])
  return (
    <WRAPPER>
      <div tw="flex flex-row items-end mb-5">
        <img src="/img/assets/Stable_pools.svg" alt="pool-icon" height={67} width={60} tw="mr-5" />
        <div tw="flex flex-col">
          <div tw="text-[25px] font-semibold dark:text-grey-5 text-black-4">Stable Pools</div>
          <div tw="text-regular font-medium text-grey-1 dark:text-grey-2 mt-[-4px]">
            If you're looking for stable returns with balanced risk, <br /> Stable pools are the way to go.
          </div>
        </div>
      </div>
      <div tw="flex items-center">
        {buttons}
        <SearchBar
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
            {[...arr].map((coin, index) => (
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
  return (
    <div
      css={[
        tw`dark:bg-black-2 bg-white mx-10 rounded-[0 0 15px 15px] duration-500 `,
        isExpanded ? tw`h-[135px] visible  text-regular p-5` : tw`h-0 invisible text-[0px] p-0`
      ]}
    >
      <div tw="flex flex-col">
        {isExpanded && (
          <>
            <div tw="flex">
              <Button cssStyle={tw`h-8 font-semibold  w-[100px] bg-black-1`}>Deposit</Button>
              <Button cssStyle={tw`h-8 font-semibold  w-[100px] bg-black-1`}>Withdraw</Button>
            </div>
          </>
        )}
        <FarmStats isExpanded={isExpanded} keyStr="Wallet Balance" value={`2.5 ${coin} ($12 USD)`} />
      </div>

      <div></div>

      <div></div>
    </div>
  )
}

const FarmStats: FC<{ keyStr: string; value: string; isExpanded: boolean }> = ({ keyStr, value, isExpanded }) => {
  return (
    <div css={[tw`font-semibold duration-500`, isExpanded ? tw`text-regular ` : tw`text-[0px]`]}>
      <div tw="text-grey-1">{keyStr}</div>
      <div tw="text-grey-2">{value}</div>
    </div>
  )
}
