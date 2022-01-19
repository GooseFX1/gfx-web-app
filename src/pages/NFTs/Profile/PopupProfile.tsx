import React, { useState, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { Form, Input, Upload, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { UploadChangeParam } from 'antd/lib/upload'
import { UploadFile } from 'antd/lib/upload/interface'
import { StyledPopupProfile, StyledFormProfile } from './PopupProfile.styled'
import { useNFTProfile } from '../../../context'
import { completeNFTUserProfile, updateNFTUser } from '../../../api/NFTs'
import { ILocationState } from '../../../types/app_params.d'
import { INFTProfile } from '../../../types/nft_profile.d'

interface Props {
  visible: boolean
  setVisible: (value: boolean) => void
  handleCancel: () => void
}

export const PopupProfile = ({ visible, setVisible, handleCancel }: Props) => {
  const { sessionUser } = useNFTProfile()
  const history = useHistory<ILocationState>()
  const [form] = Form.useForm()
  const [avatar, setAvatar] = useState<any>()
  const isCompletingProfile = useMemo(() => sessionUser.user_id === null, [sessionUser])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleAvatar = (file: UploadChangeParam<UploadFile<any>>) => {
    setAvatar(file.fileList[0])
  }

  const onFinish = (values: any) => {
    validateUserFields(values)

    setIsLoading(true)
    completeNFTUserProfile(sessionUser.pubkey).then((res) => {
      if (res.response && res.response.status === 200 && res.response.data === true) {
        updateNFTUser({ ...values }).then((res) => {
          if (res === true) {
            history.push(`NFTs/profile/${sessionUser.nickname}`)
          } else {
            console.error(`Error fetching user ${sessionUser.pubkey}`)
          }
        })
      } else {
        console.error('Error Completing Profile')
        setIsLoading(false)
      }
    })
  }

  const onCancel = () => {
    form.setFieldsValue(sessionUser)
    handleCancel()
  }

  const validateUserFields = (profiledata: INFTProfile): INFTProfile => {
    return profiledata
  }

  return (
    <>
      <StyledPopupProfile
        title={isCompletingProfile ? 'Complete profile' : 'Edit profile'}
        visible={visible}
        footer={null}
        maskClosable
        onCancel={onCancel}
      >
        <div className="avatar-wrapper">
          <div className="image-group">
            <div>
              <Upload className="avatar-image" listType="picture-card" maxCount={1} onChange={handleAvatar}>
                <div className="image-wrap">
                  {!avatar && (
                    <img
                      className="img-current avatar-image"
                      src={`${
                        !sessionUser.profile_pic_link || sessionUser.profile_pic_link === ''
                          ? `${process.env.PUBLIC_URL}/img/assets/avatar.png}`
                          : sessionUser.profile_pic_link
                      }`}
                      alt="profile"
                    />
                  )}
                  <div className="icon-upload">
                    <PlusOutlined />
                  </div>
                </div>
              </Upload>
              <div className="text">Preview</div>
            </div>
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
          initialValues={sessionUser}
          onFinish={onFinish}
        >
          <div className="full-width">
            <div className="half-width">
              <Form.Item
                name="nickname"
                label="Creator Name"
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
          <Form.Item name="bio" label="Bio">
            <Input />
          </Form.Item>
          <div className="section-label">Social media links</div>
          <div className="full-width">
            <div className="half-width">
              <Form.Item label="Instagram" name="instagram_link">
                <Input />
              </Form.Item>
              <div className="hint">Will be used as public URL</div>
            </div>
            <div className="half-width">
              <Form.Item label="Twitter" name="twitter_link">
                <Input />
              </Form.Item>
              <div className="hint">Will be used as public URL</div>
            </div>
          </div>
          <div className="full-width">
            <div className="half-width">
              <Form.Item label="Facebook" name="facebook_link">
                <Input />
              </Form.Item>
              <div className="hint">Will be used as public URL</div>
            </div>
            <div className="half-width">
              <Form.Item label="Youtube" name="youtube_link">
                <Input />
              </Form.Item>
              <div className="hint">Will be used as public URL</div>
            </div>
          </div>
          <Button className="btn-save" type="primary" htmlType="submit">
            {isLoading ? '...Saving' : 'Save changes'}
          </Button>
        </StyledFormProfile>
      </StyledPopupProfile>
    </>
  )
}
