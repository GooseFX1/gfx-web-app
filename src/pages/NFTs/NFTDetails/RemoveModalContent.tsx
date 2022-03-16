import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { MainButton } from '../../../components'

const CONTAINER = styled.div`
  text-align: center;
`

const BUTTON_TEXT = styled.div`
  font-weight: 700;
  font-size: 17px;
`
const TITLE = styled.h2`
  font-size: 30px;
  font-weight: 600;
  color: ${({ theme }) => theme.text2};
  margin-bottom: ${({ theme }) => theme.margin(3)};
`
const TEXT = styled.p`
  color: ${({ theme }) => theme.text2};
  margin-bottom: ${({ theme }) => theme.margin(5)};
`

type IRemoveModalContent = {
  title: string
  caption: string
  removeFunction: Function
}

const RemoveModalContent = ({ title, caption, removeFunction }: IRemoveModalContent) => {
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    return () => {
      setIsLoading(false)
    }
  }, [])

  const handleButtonClick = (e: any) => {
    setIsLoading(true)
    removeFunction(e)
  }

  return (
    <CONTAINER>
      <TITLE>{title}</TITLE>
      <TEXT>{caption}</TEXT>

      <MainButton height={'60px'} width="100%" status="action" onClick={handleButtonClick} loading={isLoading}>
        <BUTTON_TEXT>Remove</BUTTON_TEXT>
      </MainButton>
    </CONTAINER>
  )
}

export default RemoveModalContent
