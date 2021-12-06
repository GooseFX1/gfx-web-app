import React from 'react'
import { Upload } from 'antd'
import styled, { css } from 'styled-components'
import { MainText } from '../../../styles'

interface Props {
  file: any
}

const PREVIEW_CONTAINER = styled.div`
  border-radius: 20px;
  background-color: #131313;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 90%;
  aspect-ratio: 1;
  align-self: flex-end;

  .ant-upload-list-picture-card-container {
    width: 350px;
    height: 350px;
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
    width: 350px;
    height: 350px;
    margin: 0 auto;
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
  background-color: #000;
`

const PREVIEW_TEXT = MainText(styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text1};
  margin-bottom: ${({ theme }) => theme.margins['1x']};
`)

const NAME_TEXT = MainText(styled.span`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.text1};
  margin-bottom: ${({ theme }) => theme.margins['1x']};
`)

const DESCRIBE_TEXT = MainText(styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.text1};
  margin-bottom: ${({ theme }) => theme.margins['1x']};
`)

const BOTTOM_INFO = styled.div`
  display: flex;
  flex-direction: column;
`

const PreviewImage = ({ file }: Props) => {
  return (
    <PREVIEW_CONTAINER>
      <PREVIEW_TEXT>Preview</PREVIEW_TEXT>
      {file ? (
        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          maxCount={1}
          fileList={[file]}
        />
      ) : (
        <IMAGE_CONTAINER />
      )}
      <BOTTOM_INFO>
        <NAME_TEXT>Name your item</NAME_TEXT>
        <DESCRIBE_TEXT>Describe your item</DESCRIBE_TEXT>
      </BOTTOM_INFO>
    </PREVIEW_CONTAINER>
  )
}

export default PreviewImage
