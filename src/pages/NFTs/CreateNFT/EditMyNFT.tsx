import React, { useState } from 'react'
import { Form, Input, DatePicker, Upload } from 'antd'
import { DownOutlined, PlusOutlined } from '@ant-design/icons'
import moment from 'moment'
import { UploadChangeParam } from 'antd/lib/upload'
import { UploadFile } from 'antd/lib/upload/interface'
import { StyledEditMyNFT, StyledFormEditCreatedNFT } from './EditMyNFT.styled'

interface Props {
  visible: boolean
  handleOk: () => void
  handleCancel: () => void
  type: string
}

export const EditMyNFT = ({ visible, handleOk, handleCancel, type }: Props) => {
  const [form] = Form.useForm()
  const [avatar, setAvatar] = useState<any>()

  const handleAvatar = (file: UploadChangeParam<UploadFile<any>>) => {
    setAvatar(file.fileList[0])
  }

  return (
    <StyledEditMyNFT
      title={type === 'own' ? null : 'Edit your NFT'}
      visible={visible}
      onOk={handleOk}
      centered
      onCancel={handleCancel}
      cancelText="Cancel"
      okText="Save Changes"
      style={{ height: type === 'own' ? '340px' : '700px' }}
    >
      {type !== 'own' && (
        <div className="avatar-wrapper">
          <div className="image-group">
            <Upload className="avatar-image" listType="picture-card" maxCount={1} onChange={handleAvatar}>
              <div className="image-wrap">
                {!avatar && <img className="img-current avatar-image" src="https://placeimg.com/104/104" alt="" />}
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
      )}
      <StyledFormEditCreatedNFT
        form={form}
        layout="vertical"
        initialValues={{
          title: 'Ethernal #03',
          description: 'Etheranl is a collection of 1/1 beau...',
          royalties: '30'
        }}
      >
        {type !== 'own' && (
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
        )}
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
      </StyledFormEditCreatedNFT>
    </StyledEditMyNFT>
  )
}
