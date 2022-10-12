import { PublicKey } from '@solana/web3.js'
import React, { useEffect, useState } from 'react'
import { getFarmTokenPrices } from '../../../api/SSL'
import { useConnectionConfig } from '../../../context'
import { TOKEN_PROGRAM_ID } from '../../../web3'
import { revenueCol, TOKEN_PAIRS } from '../constants'
import { Table } from 'antd'
import { moneyFormatterWithComma } from '../../../utils'

export interface IAccounts {
  [mint: string]: IAccount
}
export type IAccount = {
  amount: string
  decimals: number
  uiAmount: number
  uiAmountString: string
}

export const FinancialsStats = () => <SSLRevenue />

export const SSLRevenue = () => {
  const [revenueObj, setRevenueObj] = useState<any>()
  const [tokenPrices, setTokenprices] = useState<any>()
  const [dataSource, setDataSource] = useState<any>()
  const [dollarSum, setDollarSum] = useState<number>(0)
  //const [revenueUsingName, setRevenueUsingName] = useState<any>();
  const publicKey = new PublicKey('GFXSwpZBSU9LF1gHRpRv2u967ACKKncFnfy3VKyQqwhp')
  const { connection } = useConnectionConfig()
  useEffect(() => {
    ;(async () => {
      const [parsedAccounts] = await Promise.all([
        connection.getParsedTokenAccountsByOwner(publicKey, { programId: TOKEN_PROGRAM_ID })
        //connection.getBalance(publicKey)
      ])
      const accounts = parsedAccounts.value.reduce((acc: IAccounts, { account }) => {
        const { mint, tokenAmount } = account.data.parsed.info
        acc[mint] = tokenAmount
        return acc
      }, {})
      const { data } = await getFarmTokenPrices()
      setTokenprices(data)
      setRevenueObj(accounts)
    })()
  }, [])

  useEffect(() => {
    if (revenueObj && tokenPrices) getpairInfo(revenueObj)
  }, [revenueObj, tokenPrices])

  const getpairInfo = (revenueObj: any) => {
    const arr = []
    let sum = 0
    for (const mint in revenueObj) {
      if (!TOKEN_PAIRS[mint]) continue
      const mintPrice = tokenPrices[TOKEN_PAIRS[mint].pair]['current']
        ? tokenPrices[TOKEN_PAIRS[mint].pair]['current']
        : 0
      const mintRevenue = revenueObj && revenueObj[mint].uiAmount
      sum += mintRevenue * mintPrice
      arr.push({
        token: TOKEN_PAIRS[mint].name,
        price: '$ ' + mintPrice,
        native: mintRevenue,
        dollar: '$ ' + moneyFormatterWithComma(mintRevenue * mintPrice)
      })
      setDollarSum(sum)
    }
    setDataSource(arr)
  }

  return (
    <div>
      <h1>
        SSL Revenue
        <div>{moneyFormatterWithComma(dollarSum, '$')}</div>
      </h1>
      <Table columns={revenueCol} dataSource={dataSource} />
    </div>
  )
}
