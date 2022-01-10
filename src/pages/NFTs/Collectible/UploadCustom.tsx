import React, { useState } from 'react'
import { Upload } from 'antd'
import { UploadChangeParam } from 'antd/lib/upload'
import { UploadFile } from 'antd/lib/upload/interface'
import { ButtonWrapper } from '../NFTButton'
import styled, { css } from 'styled-components'

const ButtonUpload = styled(ButtonWrapper)`
  background-color: ${({ theme }) => theme.primary2};
  padding: ${({ theme }) => `${theme.margins['1x']} ${theme.margins['4x']} `};
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
    padding-top: ${({ theme }) => theme.margins['6x']};
    padding-bottom: ${({ theme }) => theme.margins['6x']};
    margin-top: ${({ theme }) => theme.margins['3x']};
    margin-bottom: ${({ theme }) => theme.margins['3x']};
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
      padding-left: ${theme.margins['2.5x']};
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
        margin-top: ${({ theme }) => theme.margins['1x']};
        margin-bottom: ${({ theme }) => theme.margins['2.5x']};
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
  .image-broken {
    width: 83px;
    height: 83px;
  }
  .desc-failed {
    font-family: Montserrat;
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    margin-top: ${({ theme }) => theme.margins['3x']};
  }
  .remove-icon {
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
  }
`

interface Props {
  setPreviewImage: (value: any) => void
  setStatus: (value: any) => void
  status: string
}

export const UploadCustom = ({ setPreviewImage, setStatus, status }: Props) => {
  const [uploadedfile, setFile] = useState<any>()

  const handleAvatar = async (file: UploadChangeParam<UploadFile<any>>) => {
    setFile(file.fileList[0])
    setPreviewImage(file.fileList[0])
  }

  const onRemove = () => setStatus('')

  return (
    <STYLED_UPLOAD_CUSTOM>
      {status === 'failed' ? (
        <STYLED_UPLOAD_ERROR>
          <img className="image-broken" src={`${process.env.PUBLIC_URL}/img/assets/image-broken.svg`} alt="" />
          <div className="desc-failed">Your file is broken or corrupted, pelase try again.</div>
          <img
            className="remove-icon"
            src={`${process.env.PUBLIC_URL}/img/assets/remove-icon.svg`}
            alt=""
            onClick={onRemove}
          />
        </STYLED_UPLOAD_ERROR>
      ) : (
        <div className="image-group">
          <Upload className="avatar-image" listType="picture-card" maxCount={1} onChange={handleAvatar}>
            <div className="image-wrap"></div>
            {!uploadedfile && (
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
