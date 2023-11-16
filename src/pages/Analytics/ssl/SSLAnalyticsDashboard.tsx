/* eslint-disable @typescript-eslint/no-empty-function */
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
import { Connection, PublicKey } from '@solana/web3.js'
import SSLAnalyticsTableWrapper from './SSLAnalyticsTableWrapper'
import { Tabs } from 'antd'
import type { TabsProps } from 'antd'
import SSLHistoricCharts from './SSLHistoricCharts'
import SSLPairWrapper from './SSLPairWrapper'

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

const PAGE_WRAPPER = styled.div`
  height: 100%;
  width: 100%;
  padding: 50px;
`

const SSLAnalyticsDashboard: FC = () => {
  const { wallet, connected } = useWallet()
  const [adminAllowed, setAdminAllowed] = useState<boolean>(false)
  const [rawData, setRawData] = useState([])
  const [liquidityHistoric, setLiquidityHistoric] = useState([])
  const [loadingHistoric, setLoadingHistoric] = useState(false)
  //needed in tab 1
  const [activeTab, setActiveTab] = useState(0)
  const [liveBalances, setLiveBalances] = useState([])
  const [loadingLive, setLoadingLive] = useState(false)
  //tab 1 data end

  const handleTabChange = (key: string) => {
    setActiveTab(Number(key))
  }
  const getAnalyticsData = async (token) => {
    const url = GET_SSL_ANALYTICS + token
    const res = await httpClient('api-services').get(`${url}`)
    if (res.status === 200) {
      return res.data.data
    } else {
      return []
    }
  }

  const processData = async () => {
    setLiquidityHistoric(rawData)
  }

  const getLiveData = async () => {
    const aggregatedData = []
    const connection = new Connection('https://rpc-proxy.goosefx.workers.dev', {
      commitment: 'processed',
      httpAgent: false,
      disableRetryOnRateLimit: true
    })
    setLoadingLive(true)
    for (let i = 0; i < rawData.length; i++) {
      const poolData = rawData[i][0]
      const primarytokenAccount = poolData.tokenAccount
      const res = await connection.getParsedAccountInfo(new PublicKey(primarytokenAccount))
      const amount = (res.value.data as any).parsed.info.tokenAmount.uiAmountString
      const secondaryBalances = []
      for (let j = 0; j < poolData.secondaryBalances.length; j++) {
        const secondaryToken = poolData.secondaryBalances[j]
        const resp = await connection.getParsedAccountInfo(new PublicKey(secondaryToken.tokenAccount))
        const amount = (resp.value.data as any).parsed.info.tokenAmount.uiAmountString
        secondaryBalances.push({
          mintName: secondaryToken.mintName,
          mint: secondaryToken.mint,
          price: secondaryToken.price,
          amount
        })
      }
      aggregatedData.push({
        mintName: rawData[i][0].mintName,
        mint: rawData[i][0].mint,
        price: rawData[i][0].price,
        amount,
        secondaryBalances
      })
    }
    setLiveBalances(aggregatedData)
    setLoadingLive(false)
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
        setRawData(infos)
      }
    })()
  }, [isAdminAllowed])

  useEffect(() => {
    if (rawData.length) {
      if (activeTab === 0) {
        processData()
      } else if (activeTab === 1) {
        getLiveData()
      }
    }
  }, [activeTab, rawData])

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
    <PAGE_WRAPPER>
      <Tabs
        onChange={handleTabChange}
        items={[
          {
            key: '0',
            label: 'Historical Pool data',
            children: <SSLHistoricCharts chartData={liquidityHistoric} loading={loadingHistoric} />,
            active: activeTab === 0
          },
          {
            key: '1',
            label: 'Live Pool data',
            children: (
              <SSLAnalyticsTableWrapper
                refreshData={getLiveData}
                liveBalances={liveBalances}
                loading={loadingLive}
              />
            ),
            active: activeTab === 1
          },
          {
            key: '2',
            label: 'Pair Status',
            children: <SSLPairWrapper />,
            active: activeTab === 2
          }
        ]}
      ></Tabs>
    </PAGE_WRAPPER>
  )
}

export default SSLAnalyticsDashboard
