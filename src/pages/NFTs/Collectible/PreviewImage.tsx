import React, { useEffect } from 'react'
import { Upload } from 'antd'
import styled from 'styled-components'
import { MainText } from '../../../styles'
import { useNFTDetails } from '../../../context'

const PREVIEW_CONTAINER = styled.div`
  border-radius: 20px;
  background-color: ${({ theme }) => theme.avatarBackground};
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 90%;
  aspect-ratio: 1;
  align-self: flex-end;
  padding: ${({ theme }) => theme.margins['2.5x']} ${({ theme }) => theme.margins['5x']};

  .ant-upload-list-picture-card-container {
    width: 100%;
    height: auto;
  }
  .ant-upload-list-picture-card .ant-upload-list-item-info {
    &:before {
      display: none;
    }
  }
  .ant-upload-list-item-actions {
    display: none !important;
  }
  .ant-upload-list {
    border: none;
    border-radius: 10px;
    position: relative;
    width: 100%;
    height: auto;
    margin: ${({ theme }) => theme.margins['1x']} auto;
  }
  .ant-upload-list-item {
    padding: 0 !important;
    border: none;
  }
`

const IMAGE_CONTAINER = styled.image`
  width: 70%;
  aspect-ratio: 1;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.avatarInnerBackground};
  display: flex;
  align-items: center;
  justify-content: center;
  .image-broken {
    width: 140px;
    height: 140px;
  }
`

const PREVIEW_TEXT = MainText(styled.span`
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.text7} !important;
  margin-bottom: ${({ theme }) => theme.margins['1x']};
`)

const NAME_TEXT = MainText(styled.span`
  font-size: 22px;
  font-weight: 600;
  color: ${({ theme }) => theme.text7} !important;
`)

const DESCRIBE_TEXT = MainText(styled.span`
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.text8} !important;
  margin-bottom: ${({ theme }) => theme.margins['1x']};
`)

const BOTTOM_INFO = styled.div`
  display: flex;
  flex-direction: column;
`

interface Props {
  file: any
  status?: string
}

const PreviewImage = ({ file, status }: Props) => {
  const { nftMintingData } = useNFTDetails()

  useEffect(() => {
    // console.log(file)
  }, [file])

  return (
    <PREVIEW_CONTAINER>
      <PREVIEW_TEXT>Preview</PREVIEW_TEXT>
      {status === 'failed' ? (
        <IMAGE_CONTAINER>
          <img className="image-broken" src={`/img/assets/image-broken.svg`} alt="" />
        </IMAGE_CONTAINER>
      ) : file ? (
        <Upload
          beforeUpload={(e) => false}
          listType="picture-card"
          maxCount={1}
          fileList={[file]}
          onPreview={() => {}}
        />
      ) : (
        <IMAGE_CONTAINER />
      )}
      <BOTTOM_INFO>
        <NAME_TEXT>{nftMintingData?.name || 'Name your item'}</NAME_TEXT>
      </BOTTOM_INFO>
    </PREVIEW_CONTAINER>
  )
}

export default PreviewImage
