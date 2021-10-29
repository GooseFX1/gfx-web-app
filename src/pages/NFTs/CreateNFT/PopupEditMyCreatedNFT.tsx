import React, { useState } from 'react'
import styled from 'styled-components'
import { Modal, Form, Input, DatePicker, Upload } from 'antd'
import { DownOutlined, PlusOutlined } from '@ant-design/icons'
import moment from 'moment'
import { UploadChangeParam } from 'antd/lib/upload'
import { UploadFile } from 'antd/lib/upload/interface'

const POPUP_EDIT_MY_CREATED_NFT = styled(Modal)`
  background: #2a2a2a;
  border-radius: 20px;
  width: 620px !important;
  height: 700px;
  .ant-modal-header {
    border-radius: 20px;
    background: #2a2a2a;
    padding: 30px 45px 0 45px;
    border: none;
    .ant-modal-title {
      font-size: 25px;
      color: #fff;
      font-weight: 600;
    }
  }
  .ant-modal-content {
    border-radius: 0;
    box-shadow: none;
  }
  .ant-modal-body {
    padding: 30px 45px 15px;
  }
  .ant-modal-footer {
    border: none;
    .ant-btn:not(.ant-btn-primary) {
      font-size: 18px;
      font-weight: 600;
      border: none;
      margin-right: 15px;
    }
    .ant-btn-primary {
      width: 245px;
      height: 60px;
      font-size: 18px;
      font-weight: 600;
      color: #fff;
      border-radius: 60px;
      background: #7d7d7d;
      border: none;
    }
  }
  .ant-modal-close {
    top: 23px;
    right: 35px;
  }
  .ant-modal-close-x {
    width: auto;
    height: auto;
    font-size: 26px;
    line-height: 1;
    svg {
      color: #fff;
    }
  }
  .avatar-wrapper {
    background-color: #000;
    border-style: dashed;
    border-color: #848484;
    border-width: 2px;
    border-radius: 20px;
    padding: 25px;
    margin-bottom: 30px;
    .image-group {
      display: flex;
      align-items: center;
    }
    .avatar-image {
      width: 104px;
      height: 104px;
      border-radius: 5px;
    }
    .note {
      padding-left: 57px;
      font-size: 14px;
      color: #fff;
    }
    .image-wrap {
      position: relative;
      .icon-upload {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 30px;
        opacity: 0;
      }
      &:hover {
        .icon-upload {
          opacity: 1;
        }
      }
    }
    .ant-upload-list {
      border: none;
      border-radius: 6px;
      position: relative;
      width: 104px;
      height: 104px;
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
  }
`
const FORM_EDIT_CREATED_NFT = styled(Form)`
  .half-width {
    flex: 1;
    width: 50%;
    margin: 0 0.5rem;
  }
  .full-width {
    display: flex;
    margin: 0 -0.5rem 1rem;
    &.last-item {
      align-items: center;
    }
  }
  .ant-form-item {
    margin-bottom: 9px;
  }
  .hint {
    font-size: 9px;
  }
  .ant-form-item-label {
    padding-bottom: 0;
    label {
      font-size: 17px;
      font-weight: 600;
      color: #fff;
      line-height: 1;
    }
    .ant-form-item-optional {
      color: #8a8a8a;
      font-size: 12px;
    }
  }
  .ant-form-item-control-input {
    input {
      border: none;
      border-radius: 0;
      border-bottom: 2px solid #a8a8a8;
      color: #fff;
      font-size: 12px;
      text-align: left;
      &:focus {
        box-shadow: none;
      }
    }
    .ant-picker {
      width: 195px;
      height: 41px;
      border-radius: 41px;
      margin-top: 14px;
      background: #9625ae;
      border: none;
      input {
        border: none;
      }
      .ant-picker-suffix {
        color: #fff;
      }
    }
  }
  .label-section {
    display: flex;
    align-items: center;
    font-size: 17px;
    font-weight: 600;
    color: #fff;
    line-height: 1;
    margin-bottom: 5px;
    .heart-purple {
      width: 35px;
      height: 35px;
      margin-left: 5px;
      padding-top: 8px;
    }
  }
  .description {
    font-size: 10px;
    font-weight: 600;
    color: #828282;
  }
  .percent {
    display: flex;
    align-items: center;
    .item {
      height: 32px;
      border-radius: 2px;
      color: #bebebe;
      margin-right: 10px;
      font-size: 13px;
      font-weight: 600;
      text-align: center;
      line-height: 30px;
      &.active {
        width: 45px;
        color: #fff;
        background: #9625ae;
      }
    }
  }
  .btn-save {
    margin-top: 27px;
    width: 100%;
    font-size: 17px;
    font-weight: 600;
    line-height: 50px;
    height: 53px;
    border-radius: 53px;
    border: none;
    background: #9625ae;
  }
`

interface Props {
  visible: boolean
  handleOk: () => void
  handleCancel: () => void
}

export const PopupEditMyCreatedNFT = ({ visible, handleOk, handleCancel }: Props) => {
  const [form] = Form.useForm()
  const [avatar, setAvatar] = useState<any>()

  const handleAvatar = (file: UploadChangeParam<UploadFile<any>>) => {
    setAvatar(file.fileList[0])
  }

  return (
    <POPUP_EDIT_MY_CREATED_NFT
      title="Edit your NFT"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      cancelText="Cancel"
      okText="Save Changes"
    >
      <div className="avatar-wrapper">
        <div className="image-group">
          {/* <img
            className="avatar-image"
            src={`${process.env.PUBLIC_URL}/img/assets/my-created-NFT.png`}
            alt=""
          /> */}
          <Upload className="avatar-image" listType="picture-card" maxCount={1} onChange={handleAvatar}>
            <div className="image-wrap">
              {!avatar && (
                <img
                  className="img-current avatar-image"
                  src={`${process.env.PUBLIC_URL}/img/assets/my-created-NFT.png`}
                  alt=""
                />
              )}
              <div className="icon-upload">
                <PlusOutlined />
              </div>
            </div>
          </Upload>
          <div className="note">
            <div>PNG, GIF, MP4 or AVI</div>
            <div>Max 50mb</div>
          </div>
        </div>
      </div>
      <FORM_EDIT_CREATED_NFT
        form={form}
        layout="vertical"
        initialValues={{
          title: 'Ethernal #03',
          description: 'Etheranl is a collection of 1/1 beau...',
          royalties: '30'
        }}
      >
        <div className="full-width">
          <div className="half-width">
            <Form.Item label="Title" name="title">
              <Input />
            </Form.Item>
            <div className="hint">12 of 20 charcaters limit</div>
          </div>
          <div className="half-width">
            <Form.Item label="Description" name="description">
              <Input />
            </Form.Item>
            <div className="hint">67 of 70 charcaters limit</div>
          </div>
        </div>
        <div className="full-width">
          <div className="half-width">
            <Form.Item label="Expiration day" name="expiration">
              <DatePicker
                format="DD/MM/YYYY"
                defaultValue={moment('01/01/2015', 'DD/MM/YYYY')}
                suffixIcon={<DownOutlined />}
              />
            </Form.Item>
          </div>
          <div className="half-width">
            <Form.Item label="Royalties" name="royalties">
              <Input />
            </Form.Item>
            <div className="hint">
              <div>Suggested 10%, 20%, 30%</div>
              <div>Max. 60%</div>
            </div>
          </div>
        </div>
        <div className="full-width last-item">
          <div className="half-width">
            <div className="label-section">
              Donate for charity
              <img className="heart-purple" src={`${process.env.PUBLIC_URL}/img/assets/heart-purple.svg`} alt="" />
            </div>
            <div className="description">We will donate a percentage of the total price for people in need.</div>
          </div>
          <div className="half-width">
            <div className="percent">
              <div className="item active">0%</div>
              <div className="item">10%</div>
              <div className="item">20%</div>
              <div className="item">50%</div>
              <div className="item">100%</div>
            </div>
          </div>
        </div>
        {/* <button className="btn-save">Save changes</button> */}
      </FORM_EDIT_CREATED_NFT>
    </POPUP_EDIT_MY_CREATED_NFT>
  )
}
