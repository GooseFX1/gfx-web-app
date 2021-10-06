import React, { Dispatch, FC, SetStateAction, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { ArrowDropdown } from '../../../components'
import { AVAILABLE_MARKETS, useCrypto } from '../../../context'
import { CenteredImg, SVGToWhite, TRADE_ORDER_WIDTH } from '../../../styles'

const ARROW = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margins['2x'])};
  margin-left: ${({ theme }) => theme.margins['2x']};
  cursor: pointer;
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
    ${({ theme }) => theme.measurements(theme.margins['3x'])}
    margin-right: ${({ theme }) => theme.margins['2x']};
  }

  > span {
    display: flex;
    align-items: center;
    padding: ${({ theme }) => theme.margins['1.5x']} 0;
    font-size: 12px;
    font-weight: bold;

    &:not(:last-child) {
      margin-bottom: ${({ theme }) => theme.margins['1.5x']};
    }
  }
`

const SELECTOR = styled.div`
  ${({ theme }) => theme.flexCenter}
  flex-direction: column;
  width: ${TRADE_ORDER_WIDTH};
  padding: ${({ theme }) => theme.margins['1.5x']} 0;
  ${({ theme }) => theme.smallBorderRadius}
  background-color: #131313;
`

const WRAPPER = styled.div`
  max-height: 300px;
  width: 100%;
  overflow: scroll;
`

const Overlay: FC<{
  setArrowRotation: Dispatch<SetStateAction<boolean>>
  setVisible: Dispatch<SetStateAction<boolean>>
}> = ({ setArrowRotation, setVisible }) => {
  const { getAskSymbolFromPair, setSelectedCrypto } = useCrypto()

  const handleClick = useCallback(
    (pair: string) => {
      setArrowRotation(false)
      setSelectedCrypto({ decimals: 3, market: 'crypto', pair })
      setVisible(false)
    },
    [setArrowRotation, setSelectedCrypto, setVisible]
  )

  const markets = useMemo(
    () =>
      AVAILABLE_MARKETS.map(({ name }, index) => (
        <MARKET key={index} onClick={() => handleClick(name)}>
          <CenteredImg>
            <img src={`${process.env.PUBLIC_URL}/img/tokens/${getAskSymbolFromPair(name)}.svg`} alt="" />
          </CenteredImg>
          <span>{name}</span>
        </MARKET>
      )),
    [getAskSymbolFromPair, handleClick]
  )

  return (
    <SELECTOR>
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
      offset={[26, 26]}
      onVisibleChange={handleClick}
      onClick={handleClick}
      overlay={<Overlay setArrowRotation={setArrowRotation} setVisible={setVisible} />}
      visible={visible}
    >
      <ARROW>
        <SVGToWhite src={`${process.env.PUBLIC_URL}/img/assets/arrow.svg`} alt="" />
      </ARROW>
    </ArrowDropdown>
  )
}
