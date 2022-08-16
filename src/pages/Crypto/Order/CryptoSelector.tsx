import React, { Dispatch, FC, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import { Input } from 'antd'
import styled from 'styled-components'
import { ArrowDropdown } from '../../../components'
import { AVAILABLE_MARKETS, useCrypto } from '../../../context'
import { CenteredDiv, CenteredImg, SVGToWhite, TRADE_ORDER_WIDTH } from '../../../styles'

const MAGNIFYING_GLASS = styled(CenteredImg)`
  position: absolute;
  top: 16px;
  right: 16px;
  ${({ theme }) => theme.measurements(theme.margin(2))}
`

const MARKET = styled.div`
  display: flex;
  align-items: center;
  padding: 0 24%;
  &:hover {
    background-color: #1f1f1f;
    cursor: pointer;
  }
  > div {
    ${({ theme }) => theme.measurements(theme.margin(3))}
    margin-right: ${({ theme }) => theme.margin(2)};
  }
  > span {
    display: flex;
    align-items: center;
    padding: ${({ theme }) => theme.margin(1.5)} 0;
    font-size: 12px;
    font-weight: bold;
    &:not(:last-child) {
      margin-bottom: ${({ theme }) => theme.margin(1.5)};
    }
  }
`

const SELECTOR = styled(CenteredDiv)`
  position: relative;
  flex-direction: column;
  width: calc(${TRADE_ORDER_WIDTH} - 20px);
  padding: ${({ theme }) => theme.margin(1)};
  ${({ theme }) => theme.smallBorderRadius}
  background-color: #131313;
  input {
    text-align: left;
  }
`

const WRAPPER = styled.div`
  max-height: 290px;
  width: 100%;
  margin-top: ${({ theme }) => theme.margin(0.5)};
  overflow-y: scroll;
  overflow-x: hidden;
  ${({ theme }) => theme.customScrollBar('4px')}
`

const Overlay: FC<{
  setArrowRotation: Dispatch<SetStateAction<boolean>>
  setVisible: Dispatch<SetStateAction<boolean>>
}> = ({ setArrowRotation, setVisible }) => {
  const { getAskSymbolFromPair, setSelectedCrypto, pairs } = useCrypto()
  const [filterKeywords, setFilterKeywords] = useState('')
  const [filteredMarkets, setFilteredMarkets] = useState(pairs)
  const handleClick = useCallback(
    (pair: string) => {
      setArrowRotation(false)
      setVisible(false)
    },
    [setArrowRotation, setSelectedCrypto, setVisible]
  )

  const markets = useMemo(
    () =>
      filteredMarkets.map(({ name }, index) => (
        <MARKET key={index} onClick={() => handleClick(name)}>
          <CenteredImg>
            <img src={`/img/crypto/${getAskSymbolFromPair(name)}.svg`} alt="" />
          </CenteredImg>
          <span>{name}</span>
        </MARKET>
      )),
    [filteredMarkets, getAskSymbolFromPair, handleClick]
  )

  useEffect(() => {
    setFilteredMarkets(AVAILABLE_MARKETS.filter(({ name }) => new RegExp(filterKeywords, 'i').test(name)))
  }, [filterKeywords])

  return (
    <SELECTOR>
      <Input
        onChange={(x: any) => setFilterKeywords(x.target.value)}
        placeholder="Search market"
        value={filterKeywords}
      />
      <MAGNIFYING_GLASS>
        <SVGToWhite src={`/img/assets/magnifying_glass.svg`} alt="" />
      </MAGNIFYING_GLASS>
      <WRAPPER>{markets}</WRAPPER>
    </SELECTOR>
  )
}

export const CryptoSelector: FC = () => {
  const [arrowRotation, setArrowRotation] = useState(false)
  const [visible, setVisible] = useState(false)

  const handleClick = () => {
    setArrowRotation(!arrowRotation)
    setVisible(!visible)
  }

  return (
    <ArrowDropdown
      arrowRotation={arrowRotation}
      measurements="16px"
      offset={[27, 26]}
      onVisibleChange={handleClick}
      onClick={handleClick}
      overlay={<Overlay setArrowRotation={setArrowRotation} setVisible={setVisible} />}
      visible={visible}
    />
  )
}
