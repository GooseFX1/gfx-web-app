import React, { FC, useMemo } from 'react'
import styled from 'styled-components'
import { Tooltip } from '../../../components'
import { useSynths } from '../../../context'
import { monetaryFormatValue } from '../../../utils'

const TITLE = styled.div`
  display: flex;
  align-items: center;

  > span {
    margin-right: ${({ theme }) => theme.margins['2x']};
    font-weight: bold;
    color: ${({ theme }) => theme.text1};
  }
`

const WRAPPER = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  justify-content: flex-start;
  padding: ${({ theme }) => theme.margins['4x']} ${({ theme }) => theme.margins['3x']};

  > span {
    text-align: left;

    &:nth-child(2) {
      margin: ${({ theme }) => theme.margins['1.5x']} 0 ${({ theme }) => theme.margins['0.5x']};
      font-weight: bold;
      color: ${({ theme }) => theme.text1};
    }

    &:last-child {
      font-size: 12px;
      color: ${({ theme }) => theme.text4};
    }
  }
`

export const Header: FC = () => {
  const { userAccount } = useSynths()

  const formattedValue = useMemo(() => monetaryFormatValue(userAccount.shareRate), [userAccount.shareRate])

  return (
    <WRAPPER>
      <TITLE>
        <span>Portfolio Overview</span>
        <Tooltip>The current gUSD denominated value of your portfolio.</Tooltip>
      </TITLE>
      <span>{formattedValue} gUSD</span>
      {/* <span>30/12/16</span> */}
    </WRAPPER>
  )
}
