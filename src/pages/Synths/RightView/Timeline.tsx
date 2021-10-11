import { FC, useState } from 'react'
import styled from 'styled-components'
import { Row } from 'antd'

const WRAPPER = styled.div`
  ${({ theme }) => theme.mediaWidth.fromLarge`
  height: 11vh;
  width: 100%;
`};
  ${({ theme }) => theme.mediaWidth.upToLarge`
height: 10vh;
width: 100%;
`};
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.appLayoutFooterBorder};
`

const BUTTON = styled.button`
  padding: 0px 16px 0px 16px;
  border: none;
  ${({ theme }) => theme.largeBorderRadius}
  background-color: ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.text4};
  cursor: pointer;

  &:not(:first-child) {
    margin-left: ${({ theme }) => theme.margins['2x']};
  }

  &:hover {
    background-color: ${({ theme }) => theme.grey4};
    color: ${({ theme }) => theme.white};
    ${({ theme }) => theme.smallShadow}
  }

  span {
    font-size: 10px;
    font-weight: 600;
  }
`

export const Timeline: FC = () => {
  const values = ['1D', '1W', '1M', '3M', '1Y', '5Y']

  return (
    <WRAPPER>
      <Row>
        <div>
          {values.map((item, index) => (
            <BUTTON key={index} onClick={() => {}}>
              <span>{item}</span>
            </BUTTON>
          ))}
        </div>
      </Row>
    </WRAPPER>
  )
}
