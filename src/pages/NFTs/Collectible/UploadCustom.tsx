import React, { useState, useEffect } from 'react'
import { Upload, Typography } from 'antd'
import { UploadChangeParam } from 'antd/lib/upload'
import { UploadFile } from 'antd/lib/upload/interface'
import styled, { css } from 'styled-components'
import { ButtonWrapper } from '../NFTButton'
import { MetadataCategory, MetadataFile } from '../../../web3'
import { getLast } from '../../../utils'
import { IMetadataContext } from '../../../types/nft_details.d'

const { Text } = Typography

//#region styles
const ButtonUpload = styled(ButtonWrapper)`
  background-color: ${({ theme }) => theme.primary2};
  padding: ${({ theme }) => `${theme.margin(1)} ${theme.margin(4)} `};
  margin: 0 auto;
`
const STYLED_UPLOAD_CUSTOM = styled.div`
  ${({ theme }) => css`
    position: relative;
    ${theme.largeBorderRadius}
    border: solid 2px #848484;
    border-style: dashed;
    background-color: ${theme.avatarBackground};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 200px;
    margin: ${theme.margin(1)} 0px;

    .image-group {
      display: flex;
      align-items: center;
    }
    .avatar-image {
      width: 145px;
      height: 145px;
      border-radius: 50%;
    }
    .note {
      padding-left: ${theme.margin(2.5)};
      font-size: 14px;
      color: #fff;
      width: 300px;
      .title {
        font-size: 17px;
        color: ${({ theme }) => theme.text7};
      }
      .desc {
        font-size: 11px;
        color: ${({ theme }) => theme.text7};
        margin-top: ${({ theme }) => theme.margin(1)};
        margin-bottom: ${({ theme }) => theme.margin(2.5)};
      }
    }
    .image-wrap {
      position: relative;
      .icon-upload {
        position: absolute;
        width: 100%;
        height: 30px;
        top: 20px;
        right: 0;
        display: flex;
        justify-content: center;
        text-align: center;
        font-size: 30px;
        opacity: 0;
      }
      &:hover {
        .icon-upload {
          opacity: 1;
        }
      }
    }
    .ant-upload {
      flex-direction: column;
    }
    .ant-upload-list-picture-card-container {
      width: 145px;
      height: 145px;
    }
    .ant-upload-list-picture-card .ant-upload-list-item-info::before {
      left: 0;
      top: 0;
    }
    .ant-upload-list-item-actions > a {
      display: none;
    }
    .ant-upload-list {
      border: none;
      border-radius: 10px;
      position: relative;
      width: 145px;
      height: 145px;
    }
    .ant-upload-select {
      position: absolute;
      border: none;
      width: 100%;
      height: 100%;
      bottom: 0;
      right: 0;
      margin: 0;
      background-color: transparent;
    }
    .ant-upload-list-item {
      padding: 0 !important;
      border: none;
    }
  `}
`
const STYLED_UPLOAD_ERROR = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .image-broken {
    width: 83px;
    height: 83px;
  }
  .desc-failed {
    font-family: Montserrat;
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    margin-top: ${({ theme }) => theme.margin(3)};
  }
  .remove-icon {
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
  }
`
//#endregion

interface Props {
  setPreviewImage: (value: any) => void
  setFilesForUpload: (value: File[]) => void
  nftMintingData: IMetadataContext
  setNftMintingData: (data: IMetadataContext) => void
  setS3Link: (value: string) => void
  setDisabled: (value: boolean) => void
}

export const UploadCustom = ({ setPreviewImage, setFilesForUpload, nftMintingData, setNftMintingData }: Props) => {
  const [coverArtError, setCoverArtError] = useState<string>()
  const [mainFile] = useState<File | undefined>()
  const [customURL] = useState<string>('')
  const [localFile, setLocalFile] = useState<any>(null)
  const [upload, setUpload] = useState<any>(false)

  useEffect(() => {
    async function getData() {
      try {
        const url = await fetch(nftMintingData.image + '?do-not-cache')
        const blob = await url.blob()
        const name = nftMintingData.image.split('/')[nftMintingData.image.split('/').length - 1]
        const file = new File([blob], name, { type: blob.type })
        const mainFile = {
          error: null,
          name: name,
          originFileObj: file,
          percent: 0,
          size: file.size,
          thumbUrl: nftMintingData.image,
          type: blob.type
        }
        setLocalFile(mainFile)
      } catch (e) {
        console.log(e)
      }
    }

    if (nftMintingData?.image && !upload) {
      getData()
    }
  }, [nftMintingData?.image, upload])

  const handleFileChange = async (info: UploadChangeParam<UploadFile<any>>) => {
    const mainFile = info.fileList[0]

    if (mainFile) {
      mainFile.error = null
      delete mainFile.status
    }

    setUpload(true)
    setLocalFile(mainFile)
    setPreviewImage(mainFile)
  }

  const handleBeforeUpload = (file: File) => {
    setFile(file)
    return false
  }

  const setFile = async (file: File) => {
    if (!file) {
      return
    }

    const sizeKB = file.size / 1024

    if (sizeKB < 25) {
      setCoverArtError(
        `The file ${file.name} is too small. It is ${Math.round(10 * sizeKB) / 10}KB but should be at least 25KB.`
      )
      return
    }

    setCoverArtError(undefined)
    setFileForMint(file)
  }

  const setFileForMint = async (coverFile: File) => {
    setNftMintingData({
      ...nftMintingData,
      properties: {
        ...nftMintingData.properties,
        files: [coverFile, mainFile, customURL]
          .filter((f) => f)
          .map((f) => {
            const uri = typeof f === 'string' ? f : f?.name || ''
            const type =
              typeof f === 'string' || !f ? 'unknown' : f.type || getLast(f.name.split('.')) || 'unknown'

            return {
              uri,
              type
            } as MetadataFile
          })
      },
      image: coverFile?.name || customURL || '',
      animation_url:
        nftMintingData.properties?.category !== MetadataCategory.Image && customURL
          ? customURL
          : mainFile && mainFile.name
    })

    const url = await fetch(customURL).then((res) => res.blob())
    const files = [coverFile, mainFile, customURL ? new File([url], customURL) : ''].filter((f) => f) as File[]

    setFilesForUpload(files)
  }

  const onRemove = () => {
    setLocalFile(undefined)
    setPreviewImage(undefined)
    setCoverArtError(undefined)

    setNftMintingData({
      ...nftMintingData,
      properties: {
        ...nftMintingData.properties,
        files: []
      },
      image: '',
      animation_url: ''
    })
  }

  const acceptableFiles = (category: MetadataCategory) => {
    switch (category) {
      case MetadataCategory.Audio:
        return '.mp3,.flac,.wav'
      case MetadataCategory.Image:
        return '.png,.jpg,.gif'
      case MetadataCategory.Video:
        return '.mp4,.mov,.webm'
      case MetadataCategory.VR:
        return '.glb'
      case MetadataCategory.HTML:
        return '.html'
      default:
        return ''
    }
  }

  return (
    <STYLED_UPLOAD_CUSTOM>
      {coverArtError ? (
        <STYLED_UPLOAD_ERROR>
          <img className="image-broken" src={`/img/assets/image-broken.svg`} alt="" />
          <div className="desc-failed">Your file is broken or corrupted, please try again.</div>
          <img className="remove-icon" src={`/img/assets/remove-icon.svg`} alt="" onClick={onRemove} />
          {localFile && coverArtError && (
            <div>
              <Text type="danger">{coverArtError}</Text>
            </div>
          )}
        </STYLED_UPLOAD_ERROR>
      ) : (
        <div className="image-group" style={{ flexFlow: 'column' }}>
          <Upload
            className="avatar-image"
            listType="picture-card"
            maxCount={1}
            onChange={handleFileChange}
            accept={acceptableFiles(nftMintingData.properties?.category)}
            onPreview={() => false}
            beforeUpload={handleBeforeUpload}
            onRemove={onRemove}
            fileList={localFile ? [localFile] : []}
          >
            <div className="image-wrap"></div>
            {!localFile && (
              <div className="note">
                <div className="title">PNG, GIF, MP4 or AVI</div>
                <div className="desc">Max 20Mb</div>
                <ButtonUpload>
                  <span>Choose file</span>
                </ButtonUpload>
              </div>
            )}
          </Upload>
        </div>
      )}
    </STYLED_UPLOAD_CUSTOM>
  )
}
