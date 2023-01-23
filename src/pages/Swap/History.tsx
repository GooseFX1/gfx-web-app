import React, { FC, useEffect, useState } from 'react'
import { Image } from 'antd'
import styled from 'styled-components'
import tw from 'twin.macro'
import { useSwap } from '../../context'
//import { CenteredDiv } from '../../styles'

const BODY = styled.div`
  ${tw`h-[650px] w-full p-4`}
  overflow: auto;
  font-family: Montserrat;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
`

const BUTTON = styled.button`
  ${tw`p-4 h-[35px] text-center border-0 rounded flex items-center justify-center`}
  background-color: ${({ theme }) => theme.bg22};
  transition: background-color 200ms ease-in-out;

  &:active {
    background-image: linear-gradient(96deg, #f7931a 1%, #ac1cc7 99%);
  }

  span {
    font-size: 14px;
  }
`

const MainContainer = styled.div`
  ${tw`flex flex-col items-start p-2 w-full mb-2 rounded-md`}
  border: ${({ theme }) => `2px solid ${theme.bg18}`};

  &:hover,
  &:active {
    background-color: ${({ theme }) => theme.bg18};
  }
`

const MainFlexContainer = styled.div`
  ${tw`flex items-center justify-between w-full p-2`}
`

const MainFlex = styled.div`
  ${tw`flex items-center text-lg my-1`}
  color: ${({ theme }) => theme.text12};

  .token-name {
    ${tw`font-semibold`}
  }
`

const DAYS = styled.span`
  color: ${({ theme }) => theme.text12};
`

const ICON = styled(Image)`
  overflow: hidden;
  ${tw`h-5 w-5 mr-2 rounded-circle`}
`

const LOADING = styled.div`
  ${tw`h-full w-full flex items-center justify-center font-bold text-lg`}
`

export const History: FC<{ reload: boolean }> = ({ reload }) => {
  const { getTransactionsHistory } = useSwap()
  const [txns, setTxns] = useState([])

  useEffect(() => {
    console.log('dobby')
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
      return `${Math.round(days)} day(s)`
    } else {
      const hours = difference / 3600
      if (hours > 1) {
        return `${Math.round(hours)} hour(s)`
      } else {
        return `${Math.round(difference / 60)} minute(s)`
      }
    }
  }

  return (
    <BODY>
      {txns.length == 0 && <LOADING>Loading Your Transactions...</LOADING>}
      {txns.map((txn, k) => (
        <MainContainer key={k + 1}>
          <MainFlexContainer>
            <MainFlex>
              <ICON
                draggable={false}
                preview={false}
                src={`/img/crypto/${txn.inSymbol}.svg`}
                fallback={txn.logoUriA || '/img/crypto/Unknown.svg'}
                alt="in-token"
              />
              <span className={'token-name'}>
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
              <span className={'token-name'}>
                {+txn.outAmountInDecimal.toFixed(3)} {txn.outSymbol}
              </span>
            </MainFlex>

            <DAYS>{getTime(txn.timestamp)}</DAYS>
          </MainFlexContainer>
          <BUTTON
            onClick={() => {
              window.open(`https://solscan.io/tx/${txn.signature}`, '_blank')
            }}
          >
            <span>Solscan</span>
          </BUTTON>
        </MainContainer>
      ))}
    </BODY>
  )
}
