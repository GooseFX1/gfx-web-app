import React, { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { FloatingActionButton, MainButton } from '../../../components'
import { Image } from 'antd'
import { MainText, FLOATING_ACTION_ICON } from '../../../styles'
import { notify } from '../../../utils'
import { useDarkMode, useNFTProfile } from '../../../context'
import apiClient from '../../../api'
import { NFT_API_BASE, NFT_API_ENDPOINTS } from '../../../api/NFTs'
import { deleteDraft } from '../actions'
import { PopupCustom } from '../Popup/PopupCustom'
import tw from 'twin.macro'

const UPLOAD_CONTENT = styled.div`
  ${tw`relative flex flex-col h-full`}
`

const DELETE_MODAL = styled(PopupCustom)`
  ${({ theme }) => `
    .ant-modal-body {
      padding: ${theme.margin(5)} ${theme.margin(7)};
      @media(max-width: 500px){
        padding: 0;
      }
    }
    .ant-modal-close {
      @media(max-width: 500px){
        top: 6px;
      }
      right: 35px;
      top: 35px;
      left: auto;
      img {
        filter: ${theme.filterCloseModalIcon};
      }
    }
`}
`
const CONFIRM_DELETE = styled.div`
  width: 100%;
  height: 344px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const TITLE = MainText(styled.div`
  ${tw`relative w-full flex justify-center items-center flex-1 `}

  h1 {
    ${tw` text-[20px]`}
    color: ${({ theme }) => theme.text7} !important;
    font-weight: 600;
  }
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

const DELETE_TEXT = styled(DESCRIPTION)`
  ${tw`w-full h-[300px] py-0 px-[50px] my-[24px] text-[22px] leading-[1.59]`}
  overflow: hidden;
`
const DELETED_TEXT = styled(DELETE_TEXT)`
  ${tw`text-[25px]`}
`
const DELETE_ADVICE_TEXT = styled(DELETE_TEXT)`
  ${tw`text-[20px] w-full my-0`}
  color: ${({ theme }) => theme.text6} !important;
`

const UPLOAD_FILED = styled.div`
  ${tw`relative flex flex-col items-center text-white mt-[32px] cursor-pointer w-[216px] h-[300px] rounded-[20px]`}
  background-color: ${({ theme }) => theme.uploadImageBackground};

  margin: ${({ theme }) => theme.margin(2)};
  padding: ${({ theme }) => theme.margin(2)};
`

const DRAFT_IMAGE = styled(Image)`
  max-width: 100%;
  height: 150px;
  margin-bottom: 0.5rem;
  border-radius: 20px;

  ${tw`w-auto h-[176px] rounded-[8px]`}

  width: 184px;
  height: 176px;
`

const CONFIRM_IMAGE = styled(DRAFT_IMAGE)`
  ${tw`h-[120px] w-[120px] `}
`

const UPLOAD_SECTION = styled.div`
  ${tw`flex-[5] rounded-t-[20px] p-[35px]`}
  background-color: ${({ theme }) => theme.bg9};

  .section-content {
    ${tw`flex flex-wrap `}
  }

  .full-drafts {
    position: relative;

    .close-drafts {
      position: absolute;
      top: 5px;
      right: 5px;
      visibility: hidden;
      z-index: 20;
    }

    &:hover .close-drafts {
      visibility: visible;
    }
  }
`

const IMAGE_COUNT_DESC = styled(DESCRIPTION)`
  margin-top: ${({ theme }) => theme.margin(0.5)};
  margin-bottom: 0;
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
  margin-bottom: 0;
  width: 100%;
  justify-content: center;
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  color: #fff !important;
`

const DELETE_DRAFT = styled.img`
  transform: rotate(90deg);
  ${tw`h-[12px]`}
`
const SAVE_BUTTON = styled(MainButton)`
  ${tw`h-[200px] w-[400px] text-center border-none cursor-pointer bg-transparent`}
  font-weight: 600;
  color: ${({ theme }) => theme.text1};
`

const DELETE_BUTTON = styled(SAVE_BUTTON)`
  ${tw`bg-red-400 h-[48px] w-[200px] py-[15px] px-[45px] rounded-[50px] mb-1 text-[15px] text-white`}
`

export const NftDrafts = (): JSX.Element => {
  const history = useHistory()
  const { connected, publicKey } = useWallet()
  const { mode } = useDarkMode()
  const { sessionUser } = useNFTProfile()
  const [drafts, setDrafts] = useState([])
  //eslint-disable-next-line
  const [draftIsLoading, setDraftIsLoading] = useState<boolean>(true)
  const [trigger, setTrigger] = useState<boolean>(false)
  const [chosenDraft, setChosenDraft] = useState(null)
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false)
  const [deletedNFT, setDeletedNFT] = useState(false)

  const handleClick = async (id: string) => {
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
      const res = await apiClient(NFT_API_BASE).get(`${NFT_API_ENDPOINTS.DRAFTS}?user_id=${sessionUser?.uuid}`)
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
    } else {
      setDraftIsLoading(false)
    }
  }, [sessionUser, trigger])

  const deleteAndRemoveDraft = async (draftId: string) => {
    await deleteDraft(draftId)
    setDeletedNFT(true)
    setTimeout(() => setTrigger(!trigger), 2400)
  }

  return (
    <>
      <UPLOAD_CONTENT>
        <TITLE>
          <div style={{ position: 'absolute', left: '32px' }}>
            <FloatingActionButton height={40} onClick={() => history.goBack()}>
              <FLOATING_ACTION_ICON src={`/img/assets/arrow.svg`} alt="back" />
            </FloatingActionButton>
          </div>
          <h1>
            Choose an NFT from your {drafts.length > 1 ? `${drafts.length} drafts` : `1 draft`} to complete the
            creation
          </h1>
        </TITLE>

        <UPLOAD_SECTION>
          <div className={'section-content'}>
            {drafts.map((draft, index) => (
              <div className="full-drafts" key={index}>
                <div className="close-drafts">
                  <FloatingActionButton
                    height={42}
                    background={`#b5b5b5`}
                    onClick={() => {
                      setChosenDraft(draft)
                      setConfirmDeleteModal(true)
                    }}
                  >
                    <DELETE_DRAFT src={`/img/assets/close-white-icon.svg`} alt="delete" />
                  </FloatingActionButton>
                </div>
                <UPLOAD_FILED onClick={() => handleClick(draft.uuid)}>
                  <DRAFT_IMAGE draggable={false} preview={false} src={draft.image} />
                  <IMAGE_COUNT_DESC_CONTAINER>
                    <IMAGE_COUNT_DESC>{draft.name}</IMAGE_COUNT_DESC>
                    <IMAGE_COUNT_DESC>Royalty: {draft.seller_fee_basis_points / 100}%</IMAGE_COUNT_DESC>
                  </IMAGE_COUNT_DESC_CONTAINER>
                </UPLOAD_FILED>
              </div>
            ))}
            <UPLOAD_FILED onClick={() => handleClick(null)}>
              <DRAFT_IMAGE draggable={false} preview={false} src={`/img/assets/nft-preview-${mode}.svg`} />
              <IMAGE_COUNT_DESC_NEW>Create New Item</IMAGE_COUNT_DESC_NEW>
            </UPLOAD_FILED>
          </div>
        </UPLOAD_SECTION>

        <DELETE_MODAL
          width="784px"
          height="416px"
          title={null}
          visible={confirmDeleteModal}
          onCancel={() => setConfirmDeleteModal(false)}
          footer={null}
          centered
        >
          {!deletedNFT ? (
            <CONFIRM_DELETE>
              <CONFIRM_IMAGE
                draggable={false}
                preview={false}
                src={chosenDraft?.image || '/img/assets/delete-draft.svg'}
              />
              <DELETE_TEXT>Are you sure you want to delete "{chosenDraft?.name}" from your drafts?</DELETE_TEXT>

              <DELETE_BUTTON onClick={() => deleteAndRemoveDraft(chosenDraft?.uuid)}>Delete draft</DELETE_BUTTON>
              <SAVE_BUTTON onClick={() => setConfirmDeleteModal(false)}>Cancel</SAVE_BUTTON>
            </CONFIRM_DELETE>
          ) : (
            <CONFIRM_DELETE>
              <CONFIRM_IMAGE draggable={false} preview={false} src={'/img/assets/success-wriggle.svg'} />
              <DELETED_TEXT>Draft successfully deleted</DELETED_TEXT>
              <DELETE_ADVICE_TEXT>You can create this item again in the future.</DELETE_ADVICE_TEXT>
            </CONFIRM_DELETE>
          )}
        </DELETE_MODAL>
      </UPLOAD_CONTENT>
    </>
  )
}
