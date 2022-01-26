import React, { useState, useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import styled from 'styled-components'

import { useNFTDetails } from '../../../context'
import { MainText } from '../../../styles'
import BottomButtonUpload, { BottomButtonUploadType } from './BottomButtonUpload'
import InfoInput from './InfoInput'
import PreviewImage from './PreviewImage'
import { UploadCustom } from './UploadCustom'
import NewCollection from './NewCollection'
import { AddProperty } from './AddProperty'
import { useDarkMode } from '../../../context'

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
  flex-direction: row;
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

export const UpLoadNFT = () => {
  const { mode } = useDarkMode()
  const history = useHistory()
  const { uploadNFTData, setUploadNFTData } = useNFTDetails()
  const [previewImage, setPreviewImage] = useState<any>()
  const [status, setStatus] = useState('') // TODO case ('failed') when API is available
  const [disabled, setDisabled] = useState(true)
  const [collectionModal, setCollectionModal] = useState(false)
  const [propertyModal, setPropertyModal] = useState(false)

  useEffect(() => {
    if (uploadNFTData === undefined) {
      setUploadNFTData({
        title: '',
        image: '',
        description: '',
        number_of_copies: 1,
        category: '',
        properties: [],
        collection: {
          collection_name: '',
          description: '',
          image: '',
          symbol: '',
          short_url: ''
        }
      })
    }

    return () => {}
  }, [])

  useEffect(() => {
    if (uploadNFTData?.title && uploadNFTData?.collection && !isEmpty(previewImage)) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [uploadNFTData, previewImage])

  useEffect(() => {
    setUploadNFTData((prevNFTData) => ({ ...prevNFTData, image: previewImage }))
  }, [previewImage])

  const handleSubmitCollection = useCallback((collection: any) => {
    setUploadNFTData((prevNFTData) => ({ ...prevNFTData, collection: collection }))
    setCollectionModal(false)
  }, [])

  const handleCancelCollection = () => {
    setCollectionModal(false)
  }

  // title, desc
  const handleInputChange = useCallback(
    ({ e, id }) => {
      const { value } = e.target
      const temp = { ...uploadNFTData }
      temp[id] = value
      setUploadNFTData(temp)
    },
    [uploadNFTData]
  )

  const handlePropertyListChange = (propertyList: any) => {
    setUploadNFTData((prevNFTData) => ({ ...prevNFTData, properties: propertyList }))
  }

  const handleRemoveProperty = (id) => {
    const temp = JSON.parse(JSON.stringify(uploadNFTData.properties))
    const index = temp.findIndex((item) => item?.id === id)
    if (index !== -1) {
      temp.splice(index, 1)
      setUploadNFTData((prevNFTData) => ({ ...prevNFTData, properties: temp }))
    }
  }

  const handleUploadNFT = () => {
    console.log('CREATE NFT')
    console.log(uploadNFTData)
  }

  const handleSaveNFTAsDraft = () => {
    console.log('Save NFT As Draft ')
    console.log(uploadNFTData)
  }

  const handleSelectCategory = useCallback((selectedCategory) => {
    setUploadNFTData((prevNFTData) => ({ ...prevNFTData, category: selectedCategory }))
  }, [])

  return uploadNFTData === undefined ? (
    <div>...Loading</div>
  ) : (
    <>
      <UPLOAD_CONTENT>
        <img
          className="upload-NFT-back-icon"
          src={`${process.env.PUBLIC_URL}/img/assets/arrow.svg`}
          alt="back"
          onClick={() => history.push('/NFTs/create-a-collectible')}
        />
        <UPLOAD_FIELD_CONTAINER>
          <UPLOAD_INFO_CONTAINER>
            <SECTION_TITLE>1. Upload your file</SECTION_TITLE>
            <UploadCustom setPreviewImage={setPreviewImage} setStatus={setStatus} status={status} />
            <SECTION_TITLE>2. Item settings</SECTION_TITLE>
            <INPUT_SECTION>
              <InfoInput
                value={uploadNFTData.title}
                title="Title"
                maxLength={20}
                placeholder="Name your item"
                onChange={(e) => handleInputChange({ e, id: 'title' })}
              />
              <SPACE />
              <InfoInput
                value={uploadNFTData.description}
                title="Description"
                maxLength={120}
                placeholder="Describe your item"
                onChange={(e) => handleInputChange({ e, id: 'description' })}
              />
            </INPUT_SECTION>
            <BOTTOM_BUTTON_SECTION>
              <BottomButtonUpload flex={2.5} type={BottomButtonUploadType.text} title="Number of copies" />
              <BottomButtonUpload
                flex={2}
                onClick={handleSelectCategory}
                type={BottomButtonUploadType.category}
                title="Category"
              />
              <BottomButtonUpload
                flex={2}
                buttonTitle={
                  uploadNFTData.collection.collection_name.length > 0
                    ? uploadNFTData.collection.collection_name
                    : 'Collection'
                }
                type={BottomButtonUploadType.plus}
                title={'Collection'}
                onClick={() => setCollectionModal(true)}
              />
            </BOTTOM_BUTTON_SECTION>
            <STYLED_PROPERTY_BLOCK>
              <BottomButtonUpload
                flex={2}
                buttonTitle={uploadNFTData && uploadNFTData.properties.length > 0 ? 'Add more' : 'Add'}
                type={
                  uploadNFTData && uploadNFTData.properties.length > 0
                    ? BottomButtonUploadType.add_more
                    : BottomButtonUploadType.plus
                }
                title="Properties"
                onClick={() => setPropertyModal(true)}
              />
              {uploadNFTData && uploadNFTData.properties.length > 0 && (
                <div className="property-result">
                  {uploadNFTData.properties.map((item) => (
                    <div className="property-item" key={item?.id}>
                      <div className="type">{item?.type}</div>
                      <div className="name">{item?.name}</div>
                      <div className={`close-btn ${mode}`} onClick={() => handleRemoveProperty(item?.id)}>
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
            <PreviewImage
              file={previewImage}
              status={status}
              info={{ title: uploadNFTData.title, collectionName: uploadNFTData.collection.collection_name }}
            />
            <BUTTON_SECTION>
              <FLAT_BUTTON onClick={handleSaveNFTAsDraft}> Save as draft</FLAT_BUTTON>
              <NEXT_BUTTON onClick={handleUploadNFT} disabled={disabled || status === 'failed'}>
                <span>Create</span>
              </NEXT_BUTTON>
            </BUTTON_SECTION>
          </PREVIEW_UPLOAD_CONTAINER>
        </UPLOAD_FIELD_CONTAINER>
      </UPLOAD_CONTENT>
      <NewCollection
        visible={collectionModal}
        handleSubmit={handleSubmitCollection}
        handleCancel={handleCancelCollection}
      />
      {propertyModal && (
        <AddProperty
          visible={propertyModal}
          handleCancel={() => setPropertyModal(false)}
          handleOk={() => setPropertyModal(false)}
          propertyList={uploadNFTData.properties}
          setPropertyList={handlePropertyListChange}
        />
      )}
    </>
  )
}
