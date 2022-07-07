import React, { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { FloatingActionButton, MainButton } from '../../../components'
import { Image } from 'antd'
import { MainText } from '../../../styles'
import { notify } from '../../../utils'
import { useDarkMode, useNFTProfile } from '../../../context'
import apiClient from '../../../api'
import { NFT_API_BASE, NFT_API_ENDPOINTS } from '../../../api/NFTs'

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
  background-color: ${({ theme }) => theme.uploadImageBackground};
  cursor: pointer;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: ${({ theme }) => theme.margin(2)};
  padding: ${({ theme }) => theme.margin(2)};

  &:hover {
    opacity: 0.75;
    .close-drafts {
      visibility: visible;
      opacity: 1;
    }
  }
`

const DRAFT_IMAGE = styled(Image)`
  max-width: 100%;
  height: 150px;
  margin-bottom: 0.5rem;
  border-radius: 20px;
`

const UPLOAD_SECTION = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  margin-top: 2rem;
  padding: 0px 3.5rem 0px 3.5rem;

  .full-drafts {
    position: relative;
    .close-drafts {
      position: absolute;
      top: 5px;
      right: 5px;
      visibility: hidden;
    }

    &:hover .close-drafts {
      visibility: visible;
    }
  }
`

const IMAGE_COUNT_DESC = styled(DESCRIPTION)`
  margin-top: ${({ theme }) => theme.margin(0.5)};
  margin-bottom: ${({ theme }) => 0};
  color: #fff !important;
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 600;
`

const IMAGE_COUNT_DESC_NEW = styled(IMAGE_COUNT_DESC)`
  margin-top: ${({ theme }) => theme.margin(3)};
`
const IMAGE_COUNT_DESC_CONTAINER = styled.div`
  margin-top: ${({ theme }) => theme.margin(0.5)};
  margin-bottom: ${({ theme }) => 0};
  width: 100%;
  justify-content: center;
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  color: #fff !important;
`

const FLOATING_ACTION_ICON = styled.img`
  width: 16px;
  filter: ${({ theme }) => theme.filterBackIcon};
`
const SAVE_BUTTON = styled(MainButton)`
  height: 200px;
  width: 400px;
  text-align: center;
  border: none;
  cursor: pointer;
  background-color: transparent;
`

const LINE = styled.div`
  width: 100%;
  background-color: #fff;
  height: 1px;
  margin: 38.5px 0 49.5px 1px;
`

export const NftDrafts = (): JSX.Element => {
  const history = useHistory()
  const { connected, publicKey } = useWallet()
  const { mode } = useDarkMode()
  const { sessionUser } = useNFTProfile()
  const [drafts, setDrafts] = useState([])
  const [draftIsLoading, setDraftIsLoading] = useState<boolean>(false)
  const [trigger, setTrigger] = useState<boolean>(false)

  const handleClick = async (id) => {
    if (connected && publicKey) {
      if (id) {
        history.push(`/NFTs/create-single/${id}`)
      } else {
        history.push(`/NFTs/create`)
      }
    } else {
      notify({
        message: 'A wallet must be connected to mint an NFT',
        type: 'error'
      })
    }
  }

  const pullDrafts = async () => {
    try {
      setDraftIsLoading(true)
      const res = await apiClient(NFT_API_BASE).get(`${NFT_API_ENDPOINTS.DRAFTS}?user_id=${sessionUser?.user_id}`)
      const result = await res.data
      if (result.length > 0) {
        setDrafts(result)
      } else {
        notify({
          message: 'No previous draft found, redirecting to create page'
        })
        history.push('/NFTs/create')
      }

      setDraftIsLoading(false)
    } catch (err) {
      console.log(err)
      notify(
        {
          message: 'An error occurred while pulling draft',
          type: 'error'
        },
        err
      )
      setDraftIsLoading(false)
      history.push('/NFTs/create')
    }
  }

  useEffect(() => {
    if (sessionUser) {
      pullDrafts()
    }
  }, [sessionUser, trigger])

  const deleteDraft = async (draft_id: string) => {
    try {
      const res = await apiClient(NFT_API_BASE).delete(`${NFT_API_ENDPOINTS.DRAFTS}`, {
        data: { draft_id }
      })

      const result = await res.data
      notify({ type: 'success', message: 'Draft deleted', icon: 'success' })
      setTrigger(!trigger)
    } catch (err) {
      console.log(err)
      notify({ type: 'error', message: 'Draft failed to delete', icon: 'error' }, err)
    }
  }

  return (
    <>
      <UPLOAD_CONTENT>
        <div style={{ position: 'absolute', top: '32px', left: '32px' }}>
          <FloatingActionButton height={50} onClick={() => history.goBack()}>
            <FLOATING_ACTION_ICON src={`/img/assets/arrow.svg`} alt="back" />
          </FloatingActionButton>
        </div>
        <TITLE>Choose an NFT from your drafts to complete the creation</TITLE>
        <LINE />

        <UPLOAD_SECTION>
          {drafts.map((draft) => (
            <div className="full-drafts">
              <div className="close-drafts">
                <FloatingActionButton height={10} onClick={() => deleteDraft(draft.draft_id)}>
                  <FLOATING_ACTION_ICON src={`/img/assets/close-icon.svg`} alt="delete" />
                </FloatingActionButton>
              </div>
              <UPLOAD_FILED onClick={() => handleClick(draft.draft_id)}>
                <DRAFT_IMAGE draggable={false} preview={false} src={draft.image} />
                <IMAGE_COUNT_DESC_CONTAINER>
                  <IMAGE_COUNT_DESC>#{draft.draft_id}</IMAGE_COUNT_DESC>
                  <IMAGE_COUNT_DESC>{draft.name}</IMAGE_COUNT_DESC>
                  <IMAGE_COUNT_DESC>Royalty: {draft.seller_fee_basis_points}</IMAGE_COUNT_DESC>
                </IMAGE_COUNT_DESC_CONTAINER>
              </UPLOAD_FILED>
            </div>
          ))}
          <UPLOAD_FILED onClick={() => handleClick(null)}>
            <Image
              draggable={false}
              preview={false}
              src={`/img/assets/nft-preview${mode !== 'dark' ? '-light' : ''}.svg`}
            />
            <IMAGE_COUNT_DESC_NEW>New Collection</IMAGE_COUNT_DESC_NEW>
          </UPLOAD_FILED>

          <SAVE_BUTTON loading={draftIsLoading} />
        </UPLOAD_SECTION>
      </UPLOAD_CONTENT>
    </>
  )
}
