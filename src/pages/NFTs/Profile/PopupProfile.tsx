import React, { useState, useEffect, useMemo } from 'react'
import { Form, Input, Button } from 'antd'
// import { PlusOutlined } from '@ant-design/icons'
// import { UploadChangeParam } from 'antd/lib/upload'
// import { UploadFile } from 'antd/lib/upload/interface'
import { StyledPopupProfile, StyledFormProfile } from './PopupProfile.styled'
import { useNFTProfile } from '../../../context'
import { SVGDynamicReverseMode } from '../../../styles'
import { INFTProfile } from '../../../types/nft_profile.d'
import { completeNFTUserProfile, updateNFTUser } from '../../../api/NFTs'
import { Loader } from '../../../components'

interface Props {
  visible: boolean
  setVisible: (value: boolean) => void
  handleCancel: () => void
}

export const PopupProfile = ({ visible, setVisible, handleCancel }: Props) => {
  const { sessionUser, setSessionUser } = useNFTProfile()
  const [form] = Form.useForm()
  // const [avatar, setAvatar] = useState<any>()
  const isCompletingProfile = useMemo(() => sessionUser.user_id === null, [sessionUser])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  // const handleAvatar = (file: UploadChangeParam<UploadFile<any>>) => {
  //   setAvatar(file.fileList[0])
  // }

  useEffect(() => {
    form.setFieldsValue(sessionUser)

    return () => form.setFieldsValue(undefined)
  }, [sessionUser])

  const onFinish = (profileFormData: any) => {
    setIsLoading(true)
    const formattedProfile = profileFormData
    if (sessionUser.user_id === null) {
      completeProfile(formattedProfile)
    } else {
      const updatedProfile = { ...formattedProfile, user_id: sessionUser.user_id }
      updateProfile(updatedProfile)
    }
  }

  const onCancel = () => {
    form.setFieldsValue(sessionUser)
    setIsLoading(false)
    handleCancel()
  }

  const completeProfile = (profileFormData: INFTProfile) => {
    if (sessionUser.pubkey.length === 0) {
      console.error('Error: Invalid Public Key')
      return
    }

    completeNFTUserProfile(sessionUser.pubkey).then((res) => {
      console.dir(res)
      if (res && res.status === 200 && res.data) {
        const profile = res.data[0]

        const forUpdate = {
          ...profileFormData,
          user_id: profile.user_id,
          pubkey: profile.pubkey,
          is_verified: profile.is_verified
        }

        updateProfile(forUpdate)
      } else {
        console.error('Error Completing Profile')
        setIsLoading(false)
      }
    })
  }

  const updateProfile = async (updatedProfile: INFTProfile) => {
    updateNFTUser(updatedProfile).then((res) => {
      if (res && res.status === 200 && res.data === true) {
        setIsLoading(false)
        setSessionUser(updatedProfile)
        setVisible(false)
      } else {
        setIsLoading(false)
        console.error(`Error Updating user ${sessionUser.nickname}`)
      }
    })
  }

  return (
    <>
      <StyledPopupProfile
        title={isCompletingProfile ? 'Complete profile' : 'Edit profile'}
        visible={visible}
        footer={null}
        maskClosable
        onCancel={onCancel}
        closeIcon={
          <div>
            <SVGDynamicReverseMode src={`/img/assets/close-white-icon.svg`} alt="close" />
          </div>
        }
      >
        {/* <div className="avatar-wrapper">
          <div className="image-group">
            <div>
              <Upload className="avatar-image" listType="picture-card" maxCount={1} onChange={handleAvatar}>
                <div className="image-wrap">
                  {!avatar && (
                    <img
                      className="img-current avatar-image"
                      src={`${
                        !sessionUser.profile_pic_link || sessionUser.profile_pic_link === ''
                          ? `/img/assets/avatar.svg}`
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
        </div> */}
        <StyledFormProfile
          form={form}
          layout="vertical"
          requiredMark="optional"
          initialValues={sessionUser}
          onFinish={onFinish}
        >
          <section>
            <div className="full-width">
              <div className="half-width">
                <Form.Item
                  name="nickname"
                  label="Name"
                  rules={[{ required: true, message: 'Please input create name!' }]}
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="half-width">
                <Form.Item label="Email" name="email">
                  <Input />
                </Form.Item>
                <div className="hint">Will be used for notifications</div>
              </div>
            </div>
            <Form.Item name="profile_pic_link" label="Profile Image">
              <Input />
              <div className="hint">Use a link from https://imgur.com etc.</div>
            </Form.Item>
            <Form.Item name="bio" label="Bio">
              <Input />
            </Form.Item>
          </section>
          <br />
          <section>
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
              {isLoading ? <Loader /> : 'Save changes'}
            </Button>
          </section>
        </StyledFormProfile>
      </StyledPopupProfile>
    </>
  )
}
