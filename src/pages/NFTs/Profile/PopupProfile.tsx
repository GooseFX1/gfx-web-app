/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useMemo, FC } from 'react'
import { Form, Upload, UploadProps, Image, Button } from 'antd'
import { uploadFile } from 'react-s3'
import { STYLED_PROFILE_POPUP } from './PopupProfile.styled'
import { useNFTProfile, useDarkMode } from '../../../context'
import { INFTProfile } from '../../../types/nft_profile.d'
import { completeNFTUserProfile, updateNFTUser } from '../../../api/NFTs'
import { CenteredDiv } from '../../../styles'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { Loader } from '../../../components'
import { checkMobile } from '../../../utils'

const config = {
  bucketName: 'gfx-nest-image-resources',
  region: 'ap-south-1',
  accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_S3_SECRET_ACCESS_KEY
}
interface Props {
  visible: boolean
  setVisible: (value: boolean) => void
  handleCancel: () => void
}

const WRAP = styled.div``

export const PopupProfile: FC<Props> = ({ visible, setVisible, handleCancel }) => {
  const { sessionUser, setSessionUser } = useNFTProfile()
  const [form] = Form.useForm()
  const isCompletingProfile = useMemo(() => sessionUser.uuid === null, [sessionUser])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [profileImage, setProfileImage] = useState<File>()
  const { mode } = useDarkMode()
  const [username, setUsername] = useState<string>()
  const [bio, setBio] = useState<string | undefined>()
  //social links
  const [twitterLink, setTwitterLink] = useState<string>()
  const [discordLink, setDiscordLink] = useState<string>()
  const [telegramLink, setTelegramLink] = useState<string>()
  const [websiteLink, setWebsiteLink] = useState<string>()

  useEffect(() => {
    form.setFieldsValue(sessionUser)
    if (sessionUser) {
      setUsername(sessionUser.nickname ? sessionUser.nickname : '')
      setBio(sessionUser.bio ? sessionUser.nickname : '')
      setTwitterLink(sessionUser.twitter_link ? sessionUser.twitter_link : '')
      setDiscordLink(sessionUser.discord_profile ? sessionUser.discord_profile : '')
      setWebsiteLink(sessionUser.website_link ? sessionUser.website_link : '')
      setTelegramLink(sessionUser.telegram_link ? sessionUser.telegram_link : '')
    }

    return () => form.setFieldsValue(undefined)
  }, [sessionUser])

  const onFinish = async (profileFormData: any) => {
    setIsLoading(true)
    try {
      const formattedProfile = profileFormData
      let imageLink = ''

      if (profileImage) {
        imageLink = (await uploadFile(profileImage, config)).location
      }

      if (sessionUser.uuid === null) {
        await completeProfile(formattedProfile, imageLink)
      } else {
        const updatedProfile = {
          ...formattedProfile,
          user_id: sessionUser.user_id,
          uuid: sessionUser.uuid,
          nickname: username,
          profile_pic_link: imageLink !== '' ? imageLink : sessionUser.profile_pic_link,
          bio: bio,
          twitter_link: twitterLink,
          telegram_link: telegramLink,
          is_verified: sessionUser.is_verified,
          user_likes: sessionUser.user_likes,
          website_link: websiteLink ? websiteLink : null,
          discord_profile: discordLink ? discordLink : null
        }
        await updateProfile(updatedProfile)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const onCancel = () => {
    form.setFieldsValue(sessionUser)
    setIsLoading(false)
    handleCancel()
  }

  const completeProfile = async (profileFormData: INFTProfile, imageLink: string) => {
    if (sessionUser.pubkey.length === 0) {
      console.error('Error: Invalid Public Key')
      return
    }

    return completeNFTUserProfile(sessionUser.pubkey).then((res) => {
      if (res && res.status === 200 && res.data) {
        const profile = res.data[0]

        const forUpdate = {
          ...profileFormData,
          uuid: profile.uuid,
          user_id: profile.user_id,
          pubkey: profile.pubkey,
          is_verified: profile.is_verified,
          profile_pic_link: imageLink
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
        setSessionUser(updatedProfile)
        setVisible(false)
        setIsLoading(false)
      } else {
        setIsLoading(false)
        console.error(`Error Updating user ${sessionUser.nickname}`)
      }
    })
  }
  const checkIfDisabled = () => {
    if (username || bio || twitterLink || telegramLink || websiteLink || discordLink) return false
    return true
  }

  const beforeChange = (file: File) => {
    const extension = file.name.split('.')[1]
    const newFile = new File([file], `profile-image-${sessionUser.pubkey}.${extension}`, { type: file.type })
    setProfileImage(newFile)
    return false
  }

  const handleUpload: UploadProps['onChange'] = async (info) => {
    if (!profileImage) {
      const extension = info.fileList[0].url.split('.')[1]
      const url = await fetch(info.fileList[0].url).then((res) => res.blob())
      const file = new File([url], `profile-image-${sessionUser.pubkey}.${extension}`)
      setProfileImage(file)
    }
  }

  return (
    <>
      <STYLED_PROFILE_POPUP
        height={'630px'}
        width={'500px'}
        title={null}
        centered={true}
        visible={visible ? true : false}
        onCancel={onCancel}
        footer={null}
      >
        <div className="title">Profile</div>
        <div tw="flex mt-5">
          <CenteredDiv>
            <Image
              fallback={`/img/assets/avatar${mode === 'dark' ? '' : '-lite'}.svg`}
              src={profileImage ? URL?.createObjectURL(profileImage) : sessionUser.profile_pic_link}
              preview={false}
              className="profile-image-upload"
            />

            <Upload
              beforeUpload={beforeChange}
              onChange={handleUpload}
              maxCount={1}
              name=""
              className={'profile-pic-upload-zone'}
              onPreview={() => false}
              accept="image/png, image/jpeg, image/jpg, image/svg+xml, gif"
            >
              <img
                tw="mt-[15px] z-10 ml-[-30px] absolute cursor-pointer"
                className="icon"
                src={`/img/assets/Aggregator/editBtn.svg`}
                alt="edit-image"
              />
            </Upload>
          </CenteredDiv>
          <div tw="ml-20 sm:ml-14">
            <div className="titleHeader">
              Username <OptionalText />
            </div>
            <div>
              <InputContainer setVariableState={setUsername} stateVariable={username} />
            </div>
            <UnderLine width={checkMobile() ? 180 : 260} />
            <div tw="flex justify-between items-center">
              <PublicUsernameText />
              <div tw="flex">
                <div className="publicURLText">{username ? username?.length : 0} </div>
                <div className="publicURLWhiteText"> /30</div>
              </div>
            </div>
          </div>
        </div>
        <div className="profilePicText">Profile Picture</div>
        <div>
          <div className="titleHeader">
            Bio <OptionalText />
          </div>
          <div>
            <InputContainer setVariableState={setBio} stateVariable={bio} />
          </div>
          <UnderLine width={checkMobile() ? 340 : 438} />
          <div tw="flex justify-between items-center">
            <div className="publicURLText">Share with the world who you are!</div>
            <div tw="flex">
              <div className="publicURLText">{bio ? bio.length : 0}</div>{' '}
              <div className="publicURLWhiteText"> /100</div>
            </div>
          </div>
        </div>
        <div className="titleHeaderBlue" tw="text-[20px] sm:text-[18px]">
          Social Media Links
        </div>
        <div tw="flex">
          <div className="titleHeader">
            Twitter <OptionalText />
            <div>
              <InputContainer setVariableState={setTwitterLink} stateVariable={twitterLink} />
            </div>
            <UnderLine width={checkMobile() ? 160 : 200} />
            <PublicURLText />
          </div>
          <div className="titleHeader" tw="ml-3">
            Discord <OptionalText />
            <div>
              <InputContainer setVariableState={setDiscordLink} stateVariable={discordLink} />
            </div>
            <UnderLine width={checkMobile() ? 160 : 200} />
            <PublicURLText />
          </div>
        </div>
        <div tw="flex">
          <div className="titleHeader">
            Telegram <OptionalText />
            <div>
              <InputContainer setVariableState={setTelegramLink} stateVariable={telegramLink} />
            </div>
            <UnderLine width={checkMobile() ? 170 : 200} />
            <PublicURLText />
          </div>
          <div className="titleHeader" tw="ml-4">
            Website <OptionalText />
            <div>
              <InputContainer setVariableState={setWebsiteLink} stateVariable={websiteLink} />
            </div>
            <UnderLine width={checkMobile() ? 170 : 200} />
            <PublicURLText />
          </div>
        </div>
        <Button
          className="saveChanges"
          loading={isLoading}
          disabled={checkIfDisabled() || isLoading}
          onClick={onFinish}
        >
          Save Changes
        </Button>
      </STYLED_PROFILE_POPUP>
    </>
  )
  // return (
  //   <>
  //     <StyledPopupProfile
  //       title={isCompletingProfile ? 'Complete profile' : 'Edit profile'}
  //       visible={visible}
  //       footer={null}
  //       maskClosable
  //       onCancel={onCancel}
  //       closeIcon={
  //         <div>
  //           <SVGDynamicReverseMode src={`/img/assets/close-white-icon.svg`} alt="close" />
  //         </div>
  //       }
  //     >
  //       <StyledFormProfile
  //         form={form}
  //         layout="vertical"
  //         requiredMark="optional"
  //         initialValues={sessionUser}
  //         onFinish={onFinish}
  //       >
  //         <section>
  //           <CenteredDiv>
  //             <Image
  //               fallback={`/img/assets/avatar${mode === 'dark' ? '' : '-lite'}.svg`}
  //               src={profileImage ? URL?.createObjectURL(profileImage) : sessionUser.profile_pic_link}
  //               preview={false}
  //               className="profile-image-upload"
  //             />
  //           </CenteredDiv>

  //           <CenteredDiv style={{ margin: '32px 0' }}>
  //             <Upload
  //               beforeUpload={beforeChange}
  //               onChange={handleUpload}
  //               maxCount={1}
  //               className={'profile-pic-upload-zone'}
  //               onPreview={() => false}
  //               accept="image/png, image/jpeg, image/jpg, image/svg+xml, gif"
  //             >
  //               Update Profile Picture
  //             </Upload>
  //           </CenteredDiv>

  //           <div className="full-width">
  //             <div className="half-width">
  // <Form.Item
  //   name="nickname"
  //   label="Name"
  //   rules={[{ required: true, message: 'Please input create name!' }]}
  // >
  //   <Input />
  // </Form.Item>
  //             </div>
  //             <div className="half-width">
  // <Form.Item label="Email" name="email">
  //   <Input />
  // </Form.Item>
  //               <div className="hint">Will be used for notifications</div>
  //             </div>
  //           </div>
  //           <Form.Item name="bio" label="Bio">
  //             <Input />
  //           </Form.Item>
  //         </section>
  //         <br />
  //         <section>
  //           <div className="section-label">Social media links</div>
  //           <div className="full-width">
  //             <div className="half-width">
  //               <Form.Item label="Instagram" name="instagram_link">
  //                 <Input />
  //               </Form.Item>
  //               <div className="hint">Will be used as public URL</div>
  //             </div>
  //             <div className="half-width">
  //               <Form.Item label="Twitter" name="twitter_link">
  //                 <Input />
  //               </Form.Item>
  //               <div className="hint">Will be used as public URL</div>
  //             </div>
  //           </div>
  //           <div className="full-width">
  //             <div className="half-width">
  //               <Form.Item label="Telegram" name="telegram_link">
  //                 <Input />
  //               </Form.Item>
  //               <div className="hint">Will be used as public URL</div>
  //             </div>
  //             <div className="half-width">
  //               <Form.Item label="Youtube" name="youtube_link">
  //                 <Input />
  //               </Form.Item>
  //               <div className="hint">Will be used as public URL</div>
  //             </div>
  //           </div>
  //           <Button className="btn-save" type="primary" htmlType="submit" disabled={isLoading}>
  //             {isLoading ? <Loader /> : 'Save changes'}
  //           </Button>
  //         </section>
  //       </StyledFormProfile>
  //     </StyledPopupProfile>
  //   </>
  // )
}

const OptionalText = () => <span className="optional">(optional)</span>
const PublicURLText = () => <div className="publicURLText">Will be used as Public URL</div>
const PublicUsernameText = () => <div className="publicURLText">Will be Public username</div>
const UnderLine: FC<{ width: number }> = ({ width }) => (
  <div className="underLine" style={{ width: width, height: 2 }} />
)
const InputContainer: FC<{ setVariableState: any; stateVariable: any; maxLength?: number }> = ({
  setVariableState,
  stateVariable,
  maxLength
}) => {
  const handleChange = (e) => {
    if (maxLength && e.target.value.length < maxLength) setVariableState(e.target.value)
    if (!maxLength) setVariableState(e.target.value)
  }
  return (
    <div>
      <input
        type="text"
        value={stateVariable ? stateVariable : ''}
        className="inputContainer"
        onChange={(e) => handleChange(e)}
      />
    </div>
  )
}
