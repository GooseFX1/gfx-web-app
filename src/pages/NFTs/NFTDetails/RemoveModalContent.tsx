import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { MainButton } from '../../../components'
import { GFX_LINK } from '../../../styles'

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
  removeFunction: (a: any) => void
  pendingTxSig: string | undefined
  network: string | undefined
}

const RemoveModalContent = ({ title, caption, removeFunction, pendingTxSig, network }: IRemoveModalContent) => {
  const [isLoading, setIsLoading] = useState(false)

  useEffect(
    () => () => {
      setIsLoading(false)
    },
    []
  )

  useEffect(() => {
    console.log('removing')
    return null
  }, [pendingTxSig])

  const handleButtonClick = async (e: any) => {
    setIsLoading(true)
    try {
      await removeFunction(e)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CONTAINER>
      <TITLE>{title}</TITLE>
      <TEXT>{caption}</TEXT>

      <div style={{ height: '64px' }}>
        {pendingTxSig && (
          <>
            <span>
              <img
                style={{ height: '26px', marginRight: '6px' }}
                src={`/img/assets/solscan.png`}
                alt="solscan-icon"
              />
            </span>
            <GFX_LINK
              href={`http://solscan.io/tx/${pendingTxSig}?cluster=${network}`}
              target={'_blank'}
              rel="noreferrer"
            >
              View Transaction
            </GFX_LINK>
          </>
        )}
      </div>

      <MainButton height={'60px'} width="100%" status="action" onClick={handleButtonClick} loading={isLoading}>
        <BUTTON_TEXT>Remove</BUTTON_TEXT>
      </MainButton>
    </CONTAINER>
  )
}

export default RemoveModalContent
