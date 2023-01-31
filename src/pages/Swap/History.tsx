import React, { FC, useEffect, useState } from 'react'
import { Image } from 'antd'
import { useSwap } from '../../context'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'

const BODY = styled.div`
  ${tw`h-[650px] w-full p-4 `}
  overflow: auto;
`

const MainContainer = styled.div`
  ${tw`flex flex-col items-start p-2 w-full mb-2 rounded-lg`}
  border: ${({ theme }) => `2px solid ${theme.bg18}`};
`

const ICON = styled(Image)`
  ${tw`h-[25px] w-[25px] rounded-circle`}
`

export const History: FC<{ reload: boolean }> = ({ reload }) => {
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
    <BODY>
      {txns === null ? (
        <div tw="h-full w-full flex items-center justify-center font-bold text-lg">
          Loading Your Transactions...
        </div>
      ) : (
        txns.map((txn, k) => (
          <MainContainer key={k + 1}>
            <div tw="flex items-center justify-between w-full">
              <div tw="flex items-center text-lg my-1">
                <ICON
                  draggable={false}
                  preview={false}
                  src={`/img/crypto/${txn.inSymbol}.svg`}
                  fallback={txn.logoUriA || '/img/crypto/Unknown.svg'}
                  alt="in-token"
                />
                <span tw="dark:text-grey-5 text-grey-1">
                  {+txn.inAmountInDecimal.toFixed(3)} {txn.inSymbol} ≈{'  '}
                </span>
                <ICON
                  draggable={false}
                  preview={false}
                  src={`/img/crypto/${txn.outSymbol}.svg`}
                  fallback={txn.logoUriB || '/img/crypto/Unknown.svg'}
                  alt="out-token"
                  style={{ marginLeft: '8px' }}
                />
                <span tw="dark:text-grey-5 text-grey-1">
                  {+txn.outAmountInDecimal.toFixed(3)} {txn.outSymbol}
                </span>
              </div>
              <button
                tw="dark:bg-black-2 bg-grey-1 border-0 rounded-circle flex items-center justify-center p-0"
                onClick={() => {
                  window.open(`https://solscan.io/tx/${txn.signature}`, '_blank')
                }}
              >
                <span tw="ml-2 mr-1">Solscan</span>
                <ICON draggable={false} preview={false} src={`/img/assets/solscan.png`} alt="in-token" />
              </button>
            </div>
            <span tw="dark:text-black-4 text-grey-3">{getTime(txn.timestamp)}</span>
          </MainContainer>
        ))
      )}
    </BODY>
  )
}
