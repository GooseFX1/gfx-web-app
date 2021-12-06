import React from 'react'
import { Row, Col } from 'antd'
import styled from 'styled-components'

export const STYLED_GROUP_BUTTON = styled.div`
  margin-top: ${({ theme }) => theme.margins['5x']};
  display: flex;
  justify-content: center;

  .default-btn {
    font-size: 18px;
    font-weight: 600;
    border: none;
    margin-right: ${({ theme }) => theme.margins['2x']};
    color: #ffffff;
    background: transparent;
    cursor: pointer;
  }

  .gray-btn {
    width: 245px;
    height: 60px;
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    border-radius: 60px;
    background: #7d7d7d;
    border: none;
    cursor: pointer;
  }
`

type Props = {
  text1: string
  text2: string
}

export const GroupButton = ({ text1, text2 }: Props) => {
  return (
    <STYLED_GROUP_BUTTON>
      <button className="default-btn">{text1}</button>
      <button className="gray-btn">{text2}</button>
    </STYLED_GROUP_BUTTON>
  )
}
