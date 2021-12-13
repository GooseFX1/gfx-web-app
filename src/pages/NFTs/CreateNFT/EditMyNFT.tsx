import React, { useState } from 'react'
import { Form, Input, InputNumber, DatePicker, Upload, Button } from 'antd'
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

  const initialValues = {
    title: 'Ethernal #03',
    description: 'Etheranl is a collection of 1/1 beau...',
    royalties: '30',
    expiration: moment('01/01/2015', 'DD/MM/YYYY')
  }

  const handleAvatar = (file: UploadChangeParam<UploadFile<any>>) => {
    setAvatar(file.fileList[0])
  }

  const onFinish = (values: any) => {
    handleOk()
  }

  const onCancel = () => {
    form.setFieldsValue(initialValues)
    handleCancel()
  }

  return (
    <StyledEditMyNFT
      title={type === 'own' ? null : 'Edit your NFT'}
      visible={visible}
      centered
      footer={null}
      maskClosable
      onCancel={onCancel}
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
      <StyledFormEditCreatedNFT form={form} layout="vertical" initialValues={initialValues} onFinish={onFinish}>
        {type !== 'own' && (
          <div className="full-width">
            <div className="half-width">
              <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please input title!' }]}>
                <Input maxLength={20} />
              </Form.Item>
              <div className="hint">12 of 20 charcaters limit</div>
            </div>
            <div className="half-width">
              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Please input description!' }]}
              >
                <Input maxLength={70} />
              </Form.Item>
              <div className="hint">67 of 70 charcaters limit</div>
            </div>
          </div>
        )}
        <div className="full-width">
          <div className="half-width">
            <Form.Item
              label="Expiration day"
              name="expiration"
              rules={[{ required: true, message: 'Please input expiration day!' }]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                defaultValue={moment('01/01/2015', 'DD/MM/YYYY')}
                suffixIcon={<DownOutlined />}
              />
            </Form.Item>
          </div>
          <div className="half-width">
            <Form.Item
              label="Royalties"
              name="royalties"
              rules={[{ required: true, message: 'Please input royalties!' }]}
            >
              <InputNumber max={60} />
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
        <div className="actions">
          <Button type="default" className="cancel-btn" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" className="save-changes-btn">
            Save Changes
          </Button>
        </div>
      </StyledFormEditCreatedNFT>
    </StyledEditMyNFT>
  )
}
