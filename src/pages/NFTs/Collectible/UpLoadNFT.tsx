import React, { useState, useEffect, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useHistory } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import styled from 'styled-components'

import { MainText } from '../../../styles'
import BottomButtonUpload, { BottomButtonUploadType } from './BottomButtonUpload'
import InfoInput from './InfoInput'
import PreviewImage from './PreviewImage'
import { UploadCustom } from './UploadCustom'
import MintPaymentConfirmation from './MintPaymentConfirmation'
import UploadProgress from './UploadProgress'
import AddAttribute from './AddAttribute'
import RoyaltiesStep from './RoyaltiesStep'
import { useDarkMode, useNFTDetails, useConnectionConfig } from '../../../context'
import { mintNFT, MetadataCategory, ENDPOINTS } from '../../../web3'
import { notify } from '../../../utils'

//#region styles
const UPLOAD_CONTENT = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  padding: ${({ theme }) => theme.margins['5x']};

  margin: 0 auto;

  .upload-NFT-back-icon {
    transform: rotate(90deg);
    width: 30px;
    height: 30px;
    filter: ${({ theme }) => theme.filterBackIcon};
    cursor: pointer;
    margin-right: ${({ theme }) => theme.margins['5x']};
    margin-left: 0;
    margin-top: ${({ theme }) => theme.margins['1x']};
  }
`

const UPLOAD_FIELD_CONTAINER = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
`
const CONTAINER = styled.div`
  position: absolute;
  top: 0px;
  right: 0;
  bottom: 0;
  left: 0;
  background: #1e1e1e;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`
const UPLOAD_INFO_CONTAINER = styled.div`
  display: flex;
  flex: 1.4;
  flex-direction: column;
  justify-content: flex-start;
  margin-right: ${({ theme }) => theme.margins['6x']};
`

const PREVIEW_UPLOAD_CONTAINER = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const SECTION_TITLE = MainText(styled.span`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text7} !important;
  text-align: left;
`)

const INPUT_SECTION = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const SPACE = styled.div`
  width: ${({ theme }) => theme.margins['6x']};
`

const BUTTON_SECTION = styled.div`
  display: flex;
  justify-content: flex-end;
`

const FLAT_BUTTON = styled.button`
  height: 60px;
  width: 200px;
  padding: ${({ theme }) => `${theme.margins['2x']} ${theme.margins['6x']}`};
  text-align: center;
  color: ${({ theme }) => theme.white};
  background: transparent;
  margin-top: ${({ theme }) => theme.margins['5x']};
  margin-right: ${({ theme }) => theme.margins['2x']};
  border: none;
  ${({ theme }) => theme.roundedBorders};
  cursor: pointer;
`

const NEXT_BUTTON = styled.button`
  height: 60px;
  width: 245px;
  padding: ${({ theme }) => `${theme.margins['2x']} ${theme.margins['6x']}`};
  text-align: center;
  background-color: ${({ theme }) => theme.secondary5};
  margin-top: ${({ theme }) => theme.margins['5x']};
  border: none;
  ${({ theme }) => theme.roundedBorders};
  cursor: pointer;

  &:disabled {
    background-color: #7d7d7d;
  }
`

const BOTTOM_BUTTON_SECTION = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const STYLED_PROPERTY_BLOCK = styled.div`
  display: flex;
  align-items: flex-end;
  > div {
    &:first-child {
      width: 128px;
    }
  }
  .property-result {
    width: calc(100% - 145px);
    height: 60px;
    display: flex;
    align-items: center;
    padding: ${({ theme }) => `${theme.margins['1x']}`};
    border-radius: 10px;
    background-color: ${({ theme }) => theme.propertyBg};
  }
  .property-item {
    width: 100px;
    height: 40px;
    padding: 2px ${({ theme }) => `${theme.margins['1x']}`};
    border-radius: 10px;
    background-color: ${({ theme }) => theme.propertyItemBg};
    position: relative;
    margin-right: 10px;
    .type {
      font-family: Montserrat;
      font-size: 11px;
      font-weight: 500;
      color: ${({ theme }) => theme.typePropertyColor};
      text-align: left;
    }
    .name {
      font-family: Montserrat;
      font-size: 12px;
      font-weight: 600;
      color: #fff;
      text-align: left;
    }
    .close-btn {
      width: 18px;
      height: 18px;
      position: absolute;
      top: -6px;
      right: -6px;
      cursor: pointer;
      img {
        display: block;
        width: 100%;
        height: auto;
      }
      &.lite {
        background: #2a2a2a;
        padding: 5px;
        border-radius: 50%;
      }
    }
  }
`
//#endregion

export const UpLoadNFT = (): JSX.Element => {
  const { mode } = useDarkMode()
  const history = useHistory()
  const { nftMintingData, setNftMintingData } = useNFTDetails()
  const wallet = useWallet()
  const { connection } = useConnectionConfig()
  const [localFiles, setLocalFiles] = useState<any>()
  const [filesForUpload, setFilesForUpload] = useState<File[]>([])
  const [creatorModal, setCreatorModal] = useState(false)

  const [disabled, setDisabled] = useState(true)
  const [attributesModal, setAttributesModal] = useState(false)
  const [localAttributes, setLocalAttributes] = useState([])
  const [isConfirmingMintPrice, setIsConfirmingMintPrice] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const [nftCreateProgress, setNFTcreateProgress] = useState<number>(0)
  const [congrats, setCongrats] = useState<boolean>(false)

  useEffect(() => {
    if (nftMintingData === undefined) {
      setNftInitState()
    }

    return () => {
      setLocalFiles(undefined)
      setFilesForUpload(undefined)
      setCongrats(false)
      setLocalAttributes([])
      setNftInitState()
    }
  }, [])

  useEffect(() => {
    if (
      nftMintingData?.name &&
      nftMintingData?.description &&
      !isEmpty(filesForUpload) &&
      nftMintingData?.creators.length > 0
    ) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [nftMintingData, filesForUpload])

  useEffect(() => {
    setNftMintingData((prevData) => ({
      ...prevData,
      attributes: localAttributes.map((attr) => ({ trait_type: attr.trait_type, value: attr.value }))
    }))
  }, [setNftMintingData, localAttributes])

  const handleUploadNFT = () => {
    console.log('Confirm Price')
    setIsConfirmingMintPrice(true)
  }

  const handleConfirmMint = async () => {
    setIsMinting(true)
    setIsConfirmingMintPrice(false)
  }

  const mint = async () => {
    try {
      const res = await mintNFT(
        connection,
        wallet,
        ENDPOINTS[0].name,
        filesForUpload,
        nftMintingData,
        setNFTcreateProgress,
        nftMintingData.properties.maxSupply
      )
      //single or multiple (maxsupply)

      const _nft = await res
      if (_nft) {
        setCongrats(true)
        handleCompletedMint(_nft.metadataAccount, nftMintingData.name)
      }
    } catch (e: any) {
      notify({
        message: `${e.message}: ${e.name}`,
        type: 'error'
      })
    } finally {
      setNFTcreateProgress(0)
      setIsMinting(false)
    }
  }

  const handleCompletedMint = (metadataAccount: string, name: string) => {
    setCongrats(true)
    setTimeout(() => {
      history.push({
        pathname: '/NFTs/profile',
        state: { newlyMintedNFT: { name: name, metadataAccount: metadataAccount } }
      })
    }, 1500)
  }

  // title, desc
  const handleInputChange = useCallback(
    ({ e, id }) => {
      const { value } = e.target
      const temp = { ...nftMintingData }
      temp[id] = value
      setNftMintingData(temp)
    },
    [nftMintingData]
  )

  const handleAttributeListChange = (attributeList: any) => {
    setLocalAttributes(attributeList)
  }

  const handleRemoveAttribute = (id: string) =>
    setLocalAttributes((prevAttr) => prevAttr.filter((attr) => attr.id !== id))

  const handleSelectCategory = useCallback((selectedCategory) => {
    setNftMintingData((prevNFTData) => ({ ...prevNFTData, category: selectedCategory }))
  }, [])

  const handleSubmitCollection = useCallback(() => {
    setCreatorModal(false)
  }, [])

  const handleCancelCollection = () => {
    setCreatorModal(false)
  }

  const setNftInitState = () => {
    setNftMintingData({
      name: '',
      symbol: '',
      description: '',
      external_url: '',
      image: '',
      animation_url: undefined,
      attributes: undefined,
      sellerFeeBasisPoints: 0,
      creators: [],
      properties: {
        files: [],
        category: MetadataCategory.Image,
        maxSupply: 1
      }
    })
  }

  return nftMintingData === undefined ? (
    <div>...Loading</div>
  ) : (
    <>
      <UPLOAD_CONTENT>
        <img
          className="upload-NFT-back-icon"
          src={`${process.env.PUBLIC_URL}/img/assets/arrow.svg`}
          alt="back"
          onClick={() => history.push('/NFTs/create')}
        />
        <UPLOAD_FIELD_CONTAINER>
          <UPLOAD_INFO_CONTAINER>
            <SECTION_TITLE>1. Upload your file</SECTION_TITLE>

            <UploadCustom
              setFilesForUpload={setFilesForUpload}
              setPreviewImage={setLocalFiles}
              nftMintingData={nftMintingData}
              setNftMintingData={setNftMintingData}
            />

            <SECTION_TITLE>2. Item settings</SECTION_TITLE>
            <INPUT_SECTION>
              <InfoInput
                value={nftMintingData.name}
                title="Name"
                maxLength={20}
                placeholder="Name your item"
                onChange={(e) => handleInputChange({ e, id: 'name' })}
              />
              <SPACE />
              <InfoInput
                value={nftMintingData.description}
                title="Description"
                maxLength={120}
                placeholder="Describe your item"
                onChange={(e) => handleInputChange({ e, id: 'description' })}
              />
            </INPUT_SECTION>
            <BOTTOM_BUTTON_SECTION>
              <BottomButtonUpload
                flex={1}
                onClick={handleSelectCategory}
                type={BottomButtonUploadType.category}
                title="Category"
              />
              <BottomButtonUpload
                flex={1}
                buttonTitle={'Creator Info'}
                type={BottomButtonUploadType.plus}
                title={'Creator Info'}
                onClick={() => setCreatorModal(true)}
              />
            </BOTTOM_BUTTON_SECTION>
            <STYLED_PROPERTY_BLOCK>
              <BottomButtonUpload
                flex={2}
                buttonTitle={localAttributes.length > 0 ? 'Add more' : 'Add'}
                type={localAttributes.length > 0 ? BottomButtonUploadType.add_more : BottomButtonUploadType.plus}
                title="Attributes"
                onClick={() => setAttributesModal(true)}
              />
              {localAttributes.length > 0 && (
                <div className="property-result">
                  {localAttributes.map((item) => (
                    <div className="property-item" key={item.id}>
                      <div className="type">{item.trait_type}</div>
                      <div className="name">{item.value}</div>
                      <div className={`close-btn ${mode}`} onClick={() => handleRemoveAttribute(item.id)}>
                        <img
                          className="close-white-icon"
                          src={`${process.env.PUBLIC_URL}/img/assets/${
                            mode === 'dark' ? 'close-gray' : 'remove-property'
                          }.svg`}
                          alt=""
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </STYLED_PROPERTY_BLOCK>
          </UPLOAD_INFO_CONTAINER>
          <PREVIEW_UPLOAD_CONTAINER>
            <PreviewImage file={localFiles} />
            <BUTTON_SECTION>
              <NEXT_BUTTON onClick={handleUploadNFT} disabled={disabled}>
                <span>Next Steps</span>
              </NEXT_BUTTON>
            </BUTTON_SECTION>
          </PREVIEW_UPLOAD_CONTAINER>
        </UPLOAD_FIELD_CONTAINER>
      </UPLOAD_CONTENT>

      <RoyaltiesStep
        visible={creatorModal}
        setNftMintingData={setNftMintingData}
        nftMintingData={nftMintingData}
        handleSubmit={handleSubmitCollection}
        handleCancel={handleCancelCollection}
      />

      {attributesModal && (
        <AddAttribute
          visible={attributesModal}
          handleCancel={() => setAttributesModal(false)}
          handleOk={() => setAttributesModal(false)}
          attributeList={localAttributes}
          setAttributeList={handleAttributeListChange}
        />
      )}

      {isConfirmingMintPrice && (
        <MintPaymentConfirmation
          attributes={nftMintingData}
          files={filesForUpload}
          connection={connection}
          confirm={() => handleConfirmMint()}
          returnToDetails={setIsConfirmingMintPrice}
        />
      )}

      {isMinting && <UploadProgress mint={mint} step={nftCreateProgress} />}

      {congrats && (
        <CONTAINER>
          <SECTION_TITLE>Congrats! Your NFT has succcessfully minted 🎉</SECTION_TITLE>
        </CONTAINER>
      )}
    </>
  )
}
