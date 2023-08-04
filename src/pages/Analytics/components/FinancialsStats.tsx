/* eslint-disable @typescript-eslint/no-unused-vars */

import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { useState, FC, useEffect } from 'react'
import { useConnectionConfig } from '../../../context'
import { revenueCol } from '../constants'
import { Table } from 'antd'
import { moneyFormatterWithComma } from '../../../utils'
import { ANALYTICS_ENDPOINTS, getSOLPrice, getTokenDetails } from '../../../api/analytics'
import RevenueGraph from './RevenueGraph'

export interface IAccounts {
  [mint: string]: IAccount
}
export type IAccount = {
  amount: string
  decimals: number
  uiAmount: number
  uiAmountString: string
}

export const FinancialsStats: FC = () => <SSLRevenue />

export const SSLRevenue: FC = () => {
  const [dataSource, setDataSource] = useState<any>()
  const { connection } = useConnectionConfig()
  const [totalSol, setTotalSol] = useState<number>(0)
  const [totalTokenValue, setTotalTokenValue] = useState<number>(0)
  const getSOLBalance = async () => {
    let sol = await connection.getBalance(new PublicKey(ANALYTICS_ENDPOINTS.GFX_WALLET))
    sol = sol / LAMPORTS_PER_SOL
    const solPrice = await getSOLPrice()
    setTotalSol(sol * solPrice)
    return {
      token_name: 'Solana',
      token_symbol: 'SOL',
      amount: '$ ' + sol.toFixed(2),
      price: '$ ' + solPrice,
      value: '$ ' + (sol * solPrice).toFixed(2)
    }
  }

  useEffect(() => {
    ;(async () => {
      const { data } = await getTokenDetails()
      const arr = []
      arr.push(await getSOLBalance())
      data.data.token.map((ar) =>
        arr.push({
          token_name: ar.token_name,
          token_symbol: ar.token_symbol,
          amount: `$ ` + ar.amount.toFixed(2),
          price: `$ ` + ar.price.toFixed(2),
          value: `$ ` + ar.value.toFixed(2)
        })
      )
      setTotalTokenValue(data.totalTokenValue)
      setDataSource(arr)
    })()
  }, [])

  return (
    <div>
      <h1>
        SSL Revenue
        <a
          href="https://solscan.io/assets/GFXSwpZBSU9LF1gHRpRv2u967ACKKncFnfy3VKyQqwhp"
          target="_blank"
          rel="noreferrer"
        >
          <img
            style={{ height: 35, width: 35, marginLeft: 10 }}
            src={`/img/assets/solscan.png`}
            alt="solscan-icon"
          />
        </a>
        <div>{moneyFormatterWithComma(totalSol + totalTokenValue, '$')}</div>
        <h6>The Graph data is taken from Solscan</h6>
      </h1>
      <RevenueGraph today={totalSol + totalTokenValue} />
      <Table columns={revenueCol} dataSource={dataSource} />
    </div>
  )
}
