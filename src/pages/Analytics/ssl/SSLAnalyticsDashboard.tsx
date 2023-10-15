/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useEffect, useMemo, useState } from 'react'
import { isAdminAllowed } from '../../../api/NFTLaunchpad'
import { useWallet } from '@solana/wallet-adapter-react'
import styled from 'styled-components'
import tw from 'twin.macro'
import { GradientText } from '../../../components'
import { httpClient } from '../../../api'
import { GET_SSL_ANALYTICS } from '../../TradeV3/perps/perpsConstants'
import { MINTS } from './utils'

const WRAPPER = styled.div`
  ${tw`flex justify-center mt-4 items-center flex-col h-screen`}
  .first-line {
    ${tw`mt-8 font-semibold text-3xl	`}
    color: ${({ theme }) => theme.text7};
  }
  .gfxLogo {
    ${tw`w-28 h-28`}
  }
  .second-line {
    ${tw`text-lg mt-6 font-medium	w-96 text-center`}
    color: ${({ theme }) => theme.text4};
  }
`

const SSLAnalyticsDashboard: FC = () => {
  const { wallet, connected } = useWallet()
  const [adminAllowed, setAdminAllowed] = useState<boolean>(false)
  const [rawData, setRawData] = useState({ data: [] })
  const [processedData, setProcessedData] = useState(null)

  const getAnalyticsData = async (token) => {
    const url = GET_SSL_ANALYTICS + token
    const res = await httpClient('api-services').get(`${url}`)
    if (res.status === 200) {
      return res.data
    } else {
      return { data: [] }
    }
  }
  useEffect(() => {
    ;(async () => {
      if (isAdminAllowed) {
        const tokens = MINTS
        const infos = []
        for (let i = 0; i < tokens.length; i++) {
          const token = tokens[i].name
          const info = await getAnalyticsData(token)
          infos.push(info)
        }
        setRawData({ data: infos })
      }
    })()
  }, [isAdminAllowed])

  useEffect(() => {
    ;(async () => {
      if (!wallet?.adapter?.connected) {
        setAdminAllowed(false)
      }
      if (wallet?.adapter?.publicKey) {
        const data = await isAdminAllowed(wallet?.adapter?.publicKey.toString())
        setAdminAllowed(data.allowed)
      }
    })()
  }, [wallet?.adapter?.connected, wallet?.adapter?.publicKey])

  return !adminAllowed ? (
    <WRAPPER>
      <img className="gfxLogo" src="/img/crypto/GOFX.svg" alt="Launchpad Logo" />
      <div className="first-line">Ups, wallet not supported!</div>
      <div className="second-line">
        Please contact <GradientText text={'contact@goosefx.io'} fontSize={18} fontWeight={500} /> or try again.
      </div>
    </WRAPPER>
  ) : (
    <div>Length is: {rawData.data ? rawData.data.length : 0}</div>
  )
}

export default SSLAnalyticsDashboard
