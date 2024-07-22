/* eslint-disable @typescript-eslint/no-unused-vars */
import { ALL_PAIRS } from '../../FarmV3/constants'
import { FC, useEffect, useState } from 'react'
import tw, { styled } from 'twin.macro'
import { httpClient } from '../../../api'
import { truncateBigNumber } from '../../../utils/misc'
import { usePriceFeedFarm } from '../../../context'
import { getPriceObject } from '../../../web3/utils'
import { PropsWithKey } from '@/pages/TradeV3/mobile/PlaceOrderMobi'

const WRAPPER = styled.div`
    ${tw`p-10`}
    table {
      ${tw`max-sm:dark:bg-black-3 max-sm:bg-white mt-[10px] w-full overflow-x-hidden`}
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
      max-sm:h-[52px] rounded-[20px 20px 5px 5px] text-regular`}
  
      tr {
        ${tw`h-10 max-sm:h-full`}
        border-bottom: 1px solid ${({ theme }) => theme.tokenBorder};
  
        th {
          ${tw`h-full dark:text-grey-2 text-grey-1 text-center`}

          .sort{
            ${tw`text-regular dark:text-grey-5 text-black-4 font-bold`}
          }
  
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
        max-sm:mb-0 rounded-small cursor-pointer h-[60px] max-sm:h-[70px]`};
  
      td {
        ${tw`h-[100%] flex items-center justify-center text-[15px] font-semibold text-center
         dark:text-grey-8 text-black-4`}
        >span {
          ${tw`w-1/2`}
        }
      }
    }
`
const CoinGeckoPairs = (): any => {
  const [data, setData] = useState([])

  const getPairData = async () => {
    const url = ALL_PAIRS
    const res = await httpClient('api-services').get(`${url}`)
    if (res.status === 200) {
      return res.data
    } else {
      return []
    }
  }

  useEffect(() => {
    ;(async () => {
      const info = await getPairData()
      setData(info)
    })()
  }, [])

  return (
    <WRAPPER>
      <span tw="text-lg dark:text-grey-5 text-black-4 font-bold">All SSL Pairs</span>
      <table tw="mt-4">
        <thead>
          <tr>
            <th>
              <div className="sort">Name</div>
            </th>
            <th>
              <div className="sort">Liquidity</div>
            </th>
            <th>
              <div className="sort">24 Volume</div>
            </th>
            <th>
              <div className="sort">24 Fees</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.length ? (
            data.map((pair: any, index: number) => <PairData key={pair['pool_id']} pair={pair} index={index} />)
          ) : (
            <div> Loading ..... </div>
          )}
        </tbody>
      </table>
    </WRAPPER>
  )
}

const PairData: FC<PropsWithKey<{
  pair: any
  index: number
}>> = ({ pair }) => {
  const { prices, refreshTokenData } = usePriceFeedFarm()

  useEffect(() => {
    refreshTokenData()
  }, [])

  const getMintDecimals = (base: string) => {
    if (base === 'MSOL' || base === 'JITOSOL' || base === 'SOL') return 9
    else if (base === 'USDC' || base === 'USDT') return 6
    else if (base === 'BONK') return 5
    else return 0
  }

  const getTotalPairFees = (pair) => {
    const base = pair?.['base_currency'] === 'WSOL' ? 'SOL' : pair?.['base_currency']
    const target = pair?.['target_currency'] === 'WSOL' ? 'SOL' : pair?.['target_currency']
    const baseFees =
      prices[getPriceObject(base)]?.current &&
      prices[getPriceObject(base)]?.current * (pair?.['base_fees'] / 10 ** getMintDecimals(base))
    const targetFees =
      prices[getPriceObject(target)]?.current &&
      prices[getPriceObject(target)]?.current * (pair?.['target_fees'] / 10 ** getMintDecimals(target))
    const totalFees = baseFees + targetFees
    return '$' + truncateBigNumber(totalFees)
  }

  return (
    <tr>
      <td>
        <h4>
          {pair?.['base_currency'] && pair?.['base_currency']
            ? pair?.['base_currency'] + '-' + pair?.['target_currency']
            : '--'}
        </h4>
      </td>
      <td>
        <h4>
          {pair?.['liquidity_in_usd']
            ? '$' + truncateBigNumber(pair?.['liquidity_in_usd']) + ' (' + pair?.['base_currency'] + ')'
            : '--'}
        </h4>
      </td>
      <td>
        <h4>{pair?.['base_volume'] ? '$' + truncateBigNumber(pair?.['base_volume']) : '--'}</h4>
      </td>
      <td>
        <h4>{pair ? getTotalPairFees(pair) : '--'}</h4>
      </td>
    </tr>
  )
}

export default CoinGeckoPairs
