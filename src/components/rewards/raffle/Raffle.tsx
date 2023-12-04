import { useWallet } from '@solana/wallet-adapter-react'
import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import 'styled-components/macro'
import { getMyRecentWinnings } from '../../../api/rewards'
import styled from 'styled-components'
import RaffleForWalletNotConnected from './RaffleForWalletConnected'
import NoPrizesSoFar from './RaffleNoPrizesSoFar'
import MyRecentWinnings from './RaffleRecentWinnings'
import TopLinks from '../v2/TopLinks'
const Wrapper = styled.div`
  .hideScrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
    ::-webkit-scrollbar {
      display: none;
    }
  }
`

const Raffle = (): ReactElement => {
  const { wallet } = useWallet()
  const publicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])
  const [myRecentWinnings, setMyRecentWinnings] = useState()

  useEffect(() => {
    // make api call to get raffle info
    ;(async () => {
      const myRecentWinnings = await getMyRecentWinnings()
      setMyRecentWinnings(myRecentWinnings)
    })()
  }, [publicKey])

  const noPrizesSoFar = false
  if (!publicKey) return <RaffleForWalletNotConnected />

  return (
    <>
      <TopLinks />
      <Wrapper tw="w-full h-full">
        {noPrizesSoFar ? <NoPrizesSoFar /> : <MyRecentWinnings myRecentWinnings={myRecentWinnings} />}
      </Wrapper>
    </>
  )
}

export default Raffle
