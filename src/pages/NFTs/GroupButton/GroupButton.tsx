import React from 'react'
import styled from 'styled-components'

export const STYLED_GROUP_BUTTON = styled.div`
  margin-top: ${({ theme }) => theme.margins['5x']};
  display: flex;
  justify-content: space-around;
  width: 90%;
  margin-right: 0;
  margin-left: auto;

  .default-btn {
    font-size: 18px;
    font-weight: 600;
    border: none;
    margin-right: ${({ theme }) => theme.margins['2x']};
    color: #ffffff;
    background: transparent;
    cursor: pointer;
    width: 50%;
  }

  .gray-btn {
    min-width: 245px;
    height: 60px;
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    border-radius: 60px;
    background: #7d7d7d;
    border: none;
    cursor: pointer;
    width: 50%;
    &:hover {
      opacity: 0.8;
    }
    background-color: ${({ theme }) => theme.secondary2};
    &:disabled {
      background-color: #7d7d7d;
    }
  }
`

type Props = {
  text1: string
  text2: string
  onClick1?: () => void
  onClick2?: () => void
  disabled?: boolean
}

export const GroupButton = ({ text1, text2, onClick1, onClick2, disabled }: Props) => {
  return (
    <STYLED_GROUP_BUTTON>
      <button className="default-btn" onClick={onClick1}>
        {text1}
      </button>
      <button className="gray-btn" onClick={onClick2} disabled={disabled}>
        {text2}
      </button>
    </STYLED_GROUP_BUTTON>
  )
}
