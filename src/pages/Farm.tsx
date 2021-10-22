import React, { FC, useEffect } from 'react'
import styled from 'styled-components'
import { useConnectionConfig } from '../context'

const WRAPPER = styled.div`
  color: ${({ theme }) => theme.text1};
`

export const Farm: FC = () => {
  const { setRoute } = useConnectionConfig()

  useEffect(() => {
    setRoute('/farm')
  }, [setRoute])

  return <WRAPPER>Coming Soon</WRAPPER>
}
