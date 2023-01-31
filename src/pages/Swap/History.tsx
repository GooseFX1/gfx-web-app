import React, { FC, useEffect, useState } from 'react'
import { Image } from 'antd'
import { useSwap, useDarkMode } from '../../context'
import 'twin.macro'
import 'styled-components/macro'

export const History: FC<{ reload: boolean }> = ({ reload }) => {
  const { mode } = useDarkMode()
  const { getTransactionsHistory } = useSwap()
  const [txns, setTxns] = useState<any[] | null>(null)

  useEffect(() => {
    getHistoryAndUpdate()
  }, [reload])

  const getHistoryAndUpdate = async () => {
    const tx = await getTransactionsHistory()
    setTxns(tx)
  }

  const getTime = (isoTime: number) => {
    const now = Date.now()
    const time = new Date(isoTime)
    const difference = (now - time.getTime()) / 1000 //in seconds
    const days = difference / (24 * 3600)

    if (days > 1) {
      return `${Math.round(days)} days`
    } else {
      const hours = difference / 3600
      if (hours > 1) {
        return `${Math.round(hours)} hours`
      } else {
        return `${Math.round(difference / 60)} minutes`
      }
    }
  }

  return (
    <div tw="h-[650px] w-full p-4">
      {txns && txns.length === 0 && (
        <div tw="flex items-center justify-center flex-col h-full w-full">
          <img
            src={`/img/assets/history.svg`}
            alt="history"
            tw="h-[75px] w-[75px] mb-2"
            style={{
              filter:
                mode === 'dark'
                  ? 'sepia(70%) brightness(150%) invert(60%)'
                  : 'sepia(30%) brightness(100%) invert(20%)'
            }}
          />
          <p tw="dark:text-grey-1 text-grey-1 font-semibold">No swaps on this account</p>
        </div>
      )}
      {txns === null ? (
        <div tw="h-full w-full flex items-center justify-center font-bold text-lg">
          Loading Your Transactions...
        </div>
      ) : (
        txns.map((txn, k) => (
          <div
            key={k + 1}
            tw="flex flex-col items-start p-2 w-full mb-2 rounded-lg border-solid border border-grey-1"
          >
            <div tw="flex items-center justify-between w-full mb-2">
              <div tw="flex items-center text-lg">
                <Image
                  tw="h-[25px] w-[25px] rounded-circle"
                  draggable={false}
                  preview={false}
                  src={`/img/crypto/${txn.inSymbol}.svg`}
                  fallback={txn.logoUriA || '/img/crypto/Unknown.svg'}
                  alt="in-token"
                />
                <span tw="dark:text-grey-5 text-grey-1 ml-2">
                  {+txn.inAmountInDecimal.toFixed(3)} {txn.inSymbol} ≈{'  '}
                </span>
                <Image
                  tw="h-[25px] w-[25px] rounded-circle"
                  draggable={false}
                  preview={false}
                  src={`/img/crypto/${txn.outSymbol}.svg`}
                  fallback={txn.logoUriB || '/img/crypto/Unknown.svg'}
                  alt="out-token"
                  style={{ marginLeft: '8px' }}
                />
                <span tw="dark:text-grey-5 text-grey-1 ml-2">
                  {+txn.outAmountInDecimal.toFixed(3)} {txn.outSymbol}
                </span>
              </div>
              <button
                tw="dark:bg-grey-5 bg-grey-1 border-0 rounded-circle flex items-center justify-center px-0"
                onClick={() => {
                  window.open(`https://solscan.io/tx/${txn.signature}`, '_blank')
                }}
              >
                <span tw="ml-2 mr-1 text-tiny font-semibold">solscan</span>
                <Image
                  tw="h-[25px] w-[25px] rounded-circle"
                  draggable={false}
                  preview={false}
                  src={`/img/assets/solscan.png`}
                  alt="in-token"
                />
              </button>
            </div>
            <span tw="dark:text-black-4 text-grey-3 text-tiny font-semibold">{getTime(txn.timestamp)}</span>
          </div>
        ))
      )}
    </div>
  )
}
