import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { Farm } from './Farm'
import { NFTs } from './NFTs'
import { Swap } from './Swap'
import { Trade } from './Trade'
import { AppLayout } from '../layouts'
import { CenteredDiv } from '../styles'
import { addAnalytics } from '../utils'

const Wrapper = styled(CenteredDiv)`
  height: 100%;
  background-color: ${({ theme }) => theme.bg2};
`

export function DApp(): JSX.Element {
  const location = useLocation()
  const activeTab = location.hash.slice(1)

  useEffect(() => {
    addAnalytics()
  }, [])

  const tabList = [
    { key: 'farm', render: () => <Farm /> },
    { key: 'NFTs', render: () => <NFTs /> },
    { key: 'swap', render: () => <Swap /> },
    { key: 'trade', render: () => <Trade /> }
  ]

  return (
    <AppLayout>
      <Wrapper>{tabList.find((t) => t.key === activeTab)?.render()}</Wrapper>
    </AppLayout>
  )
}
