import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Row, Col } from 'antd'
import { Pools } from './Pools'
import { Portfolio } from './Portfolio'
import { Positions } from './Positions'
import { ENDPOINTS, SynthsProvider, useConnectionConfig, useNavCollapse } from '../../context'
import { notify } from '../../utils'

const WRAPPER = styled.div<{ $navCollapsed: boolean }>`
  display: flex;
  flex: 1;
  position: relative;
  width: 100vw;
  height: calc(100vh - 81px);
  overflow-y: scroll;
  overflow-x: hidden;
  padding-top: calc(80px - ${({ $navCollapsed }) => ($navCollapsed ? '80px' : '0px')});

  .synth-container {
    margin: 0 auto;
  }

  .section-container {
    padding: ${({ theme }) => theme.margin(4)};
  }

  ${({ theme }) => theme.customScrollBar('6px')};
`

export const SynthsContent: FC = () => {
  const [poolsVisible, setPoolsVisible] = useState(true)
  const { isCollapsed } = useNavCollapse()

  return (
    <WRAPPER $navCollapsed={isCollapsed}>
      <Row className={'synth-container'}>
        <Col lg={24} xl={12} className={'section-container'}>
          <Pools poolsVisible={poolsVisible} />
          <Positions poolsVisible={poolsVisible} setPoolsVisible={setPoolsVisible} />
        </Col>
        <Col lg={24} xl={12} className={'section-container'}>
          <Portfolio />
        </Col>
      </Row>
    </WRAPPER>
  )
}

export const Synths: FC = () => {
  const { endpoint, setEndpoint } = useConnectionConfig()

  useEffect(() => {
    if (endpoint !== ENDPOINTS[1].endpoint) {
      notify({ message: 'Synths is in alpha. Switched to devnet' })
      setEndpoint(ENDPOINTS[1].endpoint)
    }
  }, [endpoint, setEndpoint])

  return (
    <SynthsProvider>
      <SynthsContent />
    </SynthsProvider>
  )
}
