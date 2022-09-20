import React, { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import tw from 'twin.macro'
import { MainButton, FloatingActionButton } from '../../../components'
import { Image } from 'antd'
import { MainText, FLOATING_ACTION_ICON } from '../../../styles'
import { notify } from '../../../utils'
import apiClient from '../../../api'
import { useDarkMode, useNFTProfile } from '../../../context'
import { NFT_API_BASE, NFT_API_ENDPOINTS } from '../../../api/NFTs'
import { Connect } from '../../../layouts/App/Connect'

const UPLOAD_CONTENT = styled.div`
  position: relative;
  padding-top: 50px;
`

const TITLE = MainText(styled.div`
  font-size: 30px;
  color: ${({ theme }) => theme.text7} !important;
  text-align: center;
  font-weight: 600;
`)

const DESCRIPTION = MainText(styled.div`
  font-size: 15px;
  color: ${({ theme }) => theme.text8} !important;
  text-align: center;
  font-weight: 600;
  line-height: 18px;
  margin-top: ${({ theme }) => theme.margin(4)};
  margin-bottom: ${({ theme }) => theme.margin(4)};
`)

const UPLOAD_FILED = styled.div`
  position: relative;
  width: 250px;
  height: 250px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.bg18};
  cursor: pointer;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
`

const UPLOAD_FIELD_CONTAINER = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`

const UPLOAD_FILED_CONTAINER_LEFT = styled(UPLOAD_FIELD_CONTAINER)`
  margin-right: ${({ theme }) => theme.margin(6)};
`
const UPLOAD_FILED_CONTAINER_RIGHT = styled(UPLOAD_FIELD_CONTAINER)`
  margin-left: ${({ theme }) => theme.margin(6)};
`

const UPLOAD_SECTION = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`
const COVER = styled(UPLOAD_SECTION)<{ $mode: boolean }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  color: ${({ theme }) => theme.text1};
  font-size: 22px;
  font-weight: 600;
  background-color: ${({ $mode }) => ($mode ? 'rgb(0 0 0 / 66%)' : 'rgb(202 202 202 / 71%)')};
  border-radius: 20px;
  z-index: 10;
  cursor: default;
`

const IMAGE_COUNT_DESC = styled(DESCRIPTION)`
  margin-top: ${({ theme }) => theme.margin(2.5)};
  margin-bottom: 0;
  color: #fff !important;
`

const UPLOAD_TEXT = MainText(styled.div`
  ${tw`text-[20px] mt-[32px] text-center`}
  color: ${({ theme }) => theme.text8} !important;
  font-weight: 600;
`)

const DRAFT_CHECK = styled.div`
  font-family: Montserrat;

  ${tw`flex flex-col items-center mt-[32px]`}

  p {
    ${tw`text-[20px]`}
    font-weight: 600;
    color: ${({ theme }) => theme.text8};
  }

  span {
    font-size: 25px;
    background-image: linear-gradient(95deg, #f7931a 1%, #ac1cc7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-background-clip: text;
    -moz-text-fill-color: transparent;
  }
`

const Button = styled(MainButton)`
  ${tw`flex flex-row justify-center items-center mt-[32px] px-[32px] text-white h-[60px] w-[274px] text-[18px]`}
  background: linear-gradient(95deg, #f7931a 1%, #ac1cc7 100%);

  font-weight: 600;

  &:disabled {
    background: linear-gradient(96.79deg, #5855ff 4.25%, #dc1fff 97.61%);
  }
`

const ConnectWrapper = styled.div`
  ${tw`flex flex-row justify-center mt-[56px]`}

  button {
    ${tw`h-[60px] w-[264px]`}
    span {
      ${tw`text-[18px]`}
    }
  }
`

export const Collectible = (): JSX.Element => {
  const history = useHistory()
  const { connected, publicKey } = useWallet()
  const { mode } = useDarkMode()
  const { sessionUser } = useNFTProfile()
  const [draftNum, setDraftsNum] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionUser) {
      checkForDrafts(sessionUser.uuid)
    } else {
      setLoading(false)
    }
  }, [sessionUser])

  const handleSelectSingleCollectable = async () => {
    if (connected && publicKey) {
      history.push('/NFTs/create-single')
    } else {
      notify({
        message: 'A wallet must be connected to mint an NFT',
        type: 'error'
      })
    }
  }

  const checkForDrafts = async (userUUID: string) => {
    try {
      const res = await apiClient(NFT_API_BASE).get(`${NFT_API_ENDPOINTS.DRAFTS}?user_id=${userUUID}`)
      const result = await res.data
      setDraftsNum(result.length)
    } catch (err) {
      console.error('ERROR Fetching Drafts', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <UPLOAD_CONTENT>
        <div style={{ position: 'absolute', top: '32px', left: '32px' }}>
          <FloatingActionButton height={40} onClick={() => history.goBack()}>
            <FLOATING_ACTION_ICON src={`/img/assets/arrow.svg`} alt="back" />
          </FloatingActionButton>
        </div>

        <TITLE>Create a collectible</TITLE>
        <DESCRIPTION>
          Choose “Single” if you want your collectible to be one of a kind or “Multiple”
          <br />
          if you want to sell one collectible multiple times
        </DESCRIPTION>
        <br />
        <br />
        <br />
        <UPLOAD_SECTION>
          <UPLOAD_FILED_CONTAINER_LEFT>
            <UPLOAD_FILED onClick={handleSelectSingleCollectable}>
              <Image draggable={false} preview={false} src={`/img/assets/single-upload.png`} />
              <IMAGE_COUNT_DESC>1/1</IMAGE_COUNT_DESC>
            </UPLOAD_FILED>
            <UPLOAD_TEXT>Single</UPLOAD_TEXT>
          </UPLOAD_FILED_CONTAINER_LEFT>
          <UPLOAD_FILED_CONTAINER_RIGHT>
            <UPLOAD_FILED>
              <COVER $mode={mode === 'dark'}>Coming soon...</COVER>
              <Image draggable={false} preview={false} src={`/img/assets/multiple-upload.png`} />
              <IMAGE_COUNT_DESC>1/100</IMAGE_COUNT_DESC>
            </UPLOAD_FILED>
            <UPLOAD_TEXT>Multiple</UPLOAD_TEXT>
          </UPLOAD_FILED_CONTAINER_RIGHT>
        </UPLOAD_SECTION>
        <br />

        {sessionUser === undefined ? (
          <ConnectWrapper>
            <Connect />
          </ConnectWrapper>
        ) : (
          <DRAFT_CHECK>
            {draftNum > 0 && (
              <p>
                It seems you currently have <span>{draftNum}</span> NFTs in drafts.
              </p>
            )}
            <Button
              status="action"
              height="60px"
              width="274px"
              loading={loading}
              disabled={draftNum <= 0}
              onClick={() => history.push('/NFTs/drafts')}
            >
              {draftNum > 0 ? 'See my drafts' : 'No draft found!'}
            </Button>
          </DRAFT_CHECK>
        )}
      </UPLOAD_CONTENT>
    </>
  )
}
