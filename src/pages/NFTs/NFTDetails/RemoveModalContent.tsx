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
    console.log(pendingTxSig)
    return null
  }, [pendingTxSig])

  const handleButtonClick = (e: any) => {
    setIsLoading(true)
    removeFunction(e)
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
                src={`https://www.gitbook.com/cdn-cgi/image/height=40,fit=contain,dpr=2,
                format=auto/https%3A%2F%2F2775063016-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%
                2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F-M2WGem6IdHOZpBD3zJX%252Flogo%
                252Fw9pblAvM5UayZbYEg4Cj%252FBlack.png%3Falt%3Dmedia%26token%3D9a925146-c226-4f09-b39b-f61642681016`}
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
