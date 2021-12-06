import React, { useState } from 'react'
import { Form, Input, Upload, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { UploadChangeParam } from 'antd/lib/upload'
import { UploadFile } from 'antd/lib/upload/interface'
import { StyledPopupProfile, StyledFormProfile } from './PopupProfile.styled'

interface Props {
  visible: boolean
  setVisible: (value: boolean) => void
  handleOk: () => void
  handleCancel: () => void
}

export const PopupProfile = ({ visible, setVisible, handleOk, handleCancel }: Props) => {
  const [form] = Form.useForm()

  const initialValues = {
    creator_name: 'yeoohr',
    email: 'yeoohr@gmail.com',
    biography: 'Bio',
    instagram: 'instagram.com/yeoohr',
    twitter: 'twitter.com/02yeoohr',
    facebook: 'facebook.com/3456325089',
    youtube: 'youtube.com/ Enter your url'
  }

  const [avatar, setAvatar] = useState<any>()

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
    <>
      <StyledPopupProfile title="Edit profile" visible={visible} footer={null} maskClosable onCancel={onCancel}>
        <div className="avatar-wrapper">
          <div className="image-group">
            <Upload className="avatar-image" listType="picture-card" maxCount={1} onChange={handleAvatar}>
              <div className="image-wrap">
                {!avatar && (
                  <img
                    className="img-current avatar-image"
                    src={`${process.env.PUBLIC_URL}/img/assets/avatar-profile.png`}
                    alt=""
                  />
                )}
                <div className="icon-upload">
                  <PlusOutlined />
                </div>
              </div>
              <div className="text">Preview</div>
            </Upload>
            <div className="note">
              <div>Minimum size 400x 400</div>
              <div>(Gif's work too).</div>
            </div>
          </div>
        </div>
        <StyledFormProfile
          form={form}
          layout="vertical"
          requiredMark="optional"
          initialValues={initialValues}
          onFinish={onFinish}
        >
          <div className="full-width">
            <div className="half-width">
              <Form.Item
                name="creator_name"
                label="Creator name"
                rules={[{ required: true, message: 'Please input create name!' }]}
              >
                <Input />
              </Form.Item>
            </div>
            <div className="half-width">
              <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input email!' }]}>
                <Input />
              </Form.Item>
              <div className="hint">Will be used as public URL</div>
            </div>
          </div>
          <Form.Item name="biography" label="Biography">
            <Input />
          </Form.Item>
          <div className="section-label">Social media links</div>
          <div className="full-width">
            <div className="half-width">
              <Form.Item label="Instagram" name="instagram">
                <Input />
              </Form.Item>
              <div className="hint">Will be used as public URL</div>
            </div>
            <div className="half-width">
              <Form.Item label="Twitter" name="twitter">
                <Input />
              </Form.Item>
              <div className="hint">Will be used as public URL</div>
            </div>
          </div>
          <div className="full-width">
            <div className="half-width">
              <Form.Item label="Facebook" name="facebook">
                <Input />
              </Form.Item>
              <div className="hint">Will be used as public URL</div>
            </div>
            <div className="half-width">
              <Form.Item label="Youtube" name="youtube">
                <Input />
              </Form.Item>
              <div className="hint">Will be used as public URL</div>
            </div>
          </div>
          <Button className="btn-save" type="primary" htmlType="submit">
            Save changes
          </Button>
        </StyledFormProfile>
      </StyledPopupProfile>
    </>
  )
}
