import React, { useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import { GradientText } from '../NFTs/adminPage/components/UpcomingMints'
import { AnalyticsStats } from './components/AnalyticsStats'
import { FinancialsStats } from './components/FinancialsStats'

const WRAPPER = styled.div`
  ${tw`flex flex-col`}
  padding-left: 10%;
  .title {
    width: 80vw;
    padding: 10px 10px 10px 10px;
    border-bottom: 2px solid #2a2a2a;
  }
  .arrow {
    position: absolute;
    right: 12%;
  }

  h2 {
    position: relative;
  }
  h2:after {
    content: '';
    position: absolute;
    height: 2px;
    width: 100%;
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
  }
`

export const AnalyticsTable = () => (
  <WRAPPER>
    <AnalyticsSection />
    <FinancialSection />
  </WRAPPER>
)

const AnalyticsSection = () => {
  const arrowDownClicked = () => {
    setExpand((prev) => !prev)
  }
  const [expand, setExpand] = useState<boolean>(false)

  return (
    <div className="title" style={{ height: expand ? 'fit-content' : '80px' }}>
      <GradientText text={'Analytics'} fontSize={40} fontWeight={600} />
      <span>
        <img
          onClick={() => arrowDownClicked()}
          style={expand ? { transform: 'rotate(180deg)' } : {}}
          src="/img/assets/nft-admin/arrow-down.svg"
          alt="arrow-down"
          className="arrow"
        />
      </span>
      {expand && <h2 />}
      {expand && <AnalyticsStats />}
    </div>
  )
}

const FinancialSection = () => {
  const arrowDownClicked = () => {
    setExpand((prev) => !prev)
  }
  const [expand, setExpand] = useState<boolean>(false)
  return (
    <div className="title" style={{ height: expand ? 'fit-content' : '80px' }}>
      <GradientText text={'Financials'} fontSize={40} fontWeight={600} />
      <span>
        <img
          onClick={() => arrowDownClicked()}
          style={expand ? { transform: 'rotate(180deg)' } : {}}
          src="/img/assets/nft-admin/arrow-down.svg"
          alt="arrow-down"
          className="arrow"
        />
      </span>
      {expand && <h2 />}
      {expand && <FinancialsStats />}
    </div>
  )
}
