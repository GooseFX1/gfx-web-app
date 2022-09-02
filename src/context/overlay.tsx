import React, { FC, ReactNode, createContext, useState, Dispatch, SetStateAction } from 'react'
import styled, { css } from 'styled-components'

interface IOverlay {
  isOverlay: boolean
  doOverlay: Dispatch<SetStateAction<boolean>>
}
const { Provider, Consumer: OverlayConsumer } = createContext<IOverlay | null>(null)

const Styled = styled.div<{ isOverlay: boolean }>`
  ${({ isOverlay }) => css`
    color: ${({ theme }) => theme.text1};
    display: flex;
    flex: 1;
    position: relative;
    justify-content: center;
    min-height: 0px;
    min-width: 0px;
    &:before {
      display: ${isOverlay ? 'block' : 'none'};
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      z-index: 3;
    }
  `}
`

const OverlayProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isOverlay, setIsOverlay] = useState(false)

  const doOverlay = (val) => {
    setIsOverlay(val)
  }

  return (
    <Provider value={{ isOverlay, doOverlay }}>
      <Styled isOverlay={isOverlay}>{children}</Styled>
    </Provider>
  )
}

export { OverlayProvider, OverlayConsumer }
