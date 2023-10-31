/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useMemo, FC } from 'react'
import { Form, Upload, UploadProps, Button } from 'antd'
import { STYLED_PROFILE_POPUP } from './PopupProfile.styled'
import { useNFTProfile, useDarkMode } from '../../../context'
import tw from 'twin.macro'
import { INFTProfile } from '../../../types/nft_profile'
import { completeNFTUserProfile, updateNFTUser } from '../../../api/NFTs'
import { CenteredDiv } from '../../../styles'
import styled from 'styled-components'
import 'styled-components/macro'
import { checkMobile } from '../../../utils'
import { CurrentUserProfilePic } from '../Home/NFTLandingPageV2'
import { USER_SOCIALS } from '../../../constants'
import { USER_CONFIG_CACHE } from '../../../types/app_params'
import { getPresignedUrl, uploadToPresignedUrl } from '../../../api/gfxImageService/s3presigned'

interface Props {
  visible: boolean
  setVisible: (value: boolean) => void
  handleCancel: () => void
}

const WRAP = styled.div``

export const PopupProfile: FC<Props> = ({ visible, setVisible, handleCancel }) => {
  const { sessionUser, setSessionUser } = useNFTProfile()
  const [form] = Form.useForm()
  const isCompletingProfile = useMemo(() => sessionUser?.uuid === null, [sessionUser])
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
  const userCache: USER_CONFIG_CACHE | null = JSON.parse(window.localStorage.getItem('gfx-user-cache'))

  useEffect(() => {
    form.setFieldsValue(sessionUser)
    if (sessionUser) {
      setUsername(sessionUser.nickname ?? '')
      setBio(sessionUser.bio ?? '')
      setTwitterLink(sessionUser.twitter_link === '' ? USER_SOCIALS.TWITTER : sessionUser?.twitter_link)
      setDiscordLink(sessionUser.discord_profile === null ? USER_SOCIALS.DISCORD : sessionUser?.discord_profile)
      setWebsiteLink(sessionUser.website_link ?? '')
      setTelegramLink(sessionUser.telegram_link === '' ? USER_SOCIALS.TELEGRAM : sessionUser?.telegram_link)
    }
    return () => form.setFieldsValue(undefined)
  }, [sessionUser])

  const onFinish = async (profileFormData: any) => {
    setIsLoading(true)
    try {
      const formattedProfile = profileFormData
      let imageLink = ''

      if (profileImage) {
        const presignedUrl = await getPresignedUrl(profileImage.name, 'gfx-nest-image-resources')
        imageLink = await uploadToPresignedUrl(presignedUrl, profileImage)
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
          twitter_link: twitterLink === USER_SOCIALS.TWITTER ? '' : twitterLink,
          telegram_link: telegramLink === USER_SOCIALS.TELEGRAM ? '' : telegramLink,
          is_verified: sessionUser.is_verified,
          user_likes: sessionUser.user_likes,
          website_link: websiteLink ? websiteLink : null,
          discord_profile: discordLink === USER_SOCIALS.DISCORD ? null : discordLink
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
    updateNFTUser(updatedProfile, userCache?.jwtToken).then((res) => {
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

  const newImageLink = useMemo(() => (profileImage ? URL.createObjectURL(profileImage) : null), [profileImage])
  return (
    <>
      <STYLED_PROFILE_POPUP
        height={checkMobile() ? '610px' : '630px'}
        width={checkMobile() ? '100%' : '500px'}
        title={null}
        centered={!checkMobile()}
        visible={visible ? true : false}
        onCancel={onCancel}
        footer={null}
      >
        <div className="title">
          Profile <OptionalText />
        </div>
        {checkMobile() && <Separator />}
        <div className="scrollContainer">
          <div tw="flex mt-5 sm:mt-2">
            <CenteredDiv>
              <CurrentUserProfilePic mediumSize={true} profileImg={newImageLink} />

              <Upload
                beforeUpload={beforeChange}
                onChange={handleUpload}
                maxCount={1}
                name=""
                className={'profile-pic-upload-zone'}
                onPreview={() => false}
                accept="image/png, image/jpeg, image/jpg"
              >
                <img
                  tw="mt-[15px] z-10 ml-[-30px] sm:mt-12 sm:ml-[-25px] sm:relative absolute cursor-pointer"
                  className="icon"
                  src={`/img/assets/Aggregator/editBtn.svg`}
                  alt="edit-image"
                />
              </Upload>
            </CenteredDiv>
            <div tw="ml-20 sm:ml-8 sm:w-[calc(100% - 100px)]">
              <div className="titleHeader">Username</div>
              <div>
                <InputContainer setVariableState={setUsername} stateVariable={username} maxLength={30} />
              </div>
              <UnderLine width={checkMobile() ? '100%' : 260} />
              <div tw="flex justify-between items-center">
                <PublicUsernameText />
                <div tw="flex">
                  <div className="publicURLText">{username ? username?.length : 0} </div>
                  <div className="publicURLWhiteText"> /30</div>
                </div>
              </div>
            </div>
          </div>
          {!checkMobile() && <div className="profilePicText">Profile Picture</div>}
          <div>
            <div className="titleHeader">Bio</div>
            <div>
              <InputContainer setVariableState={setBio} stateVariable={bio} maxLength={100} />
            </div>
            <UnderLine width={checkMobile() ? '100%' : 438} />
            <div tw="flex justify-between items-center">
              <div className="publicURLText">Share with the world who you are!</div>
              <div tw="flex">
                <div className="publicURLText">{bio ? bio.length : 0}</div>{' '}
                <div className="publicURLWhiteText"> /100</div>
              </div>
            </div>
          </div>
          <div className="titleHeaderBlue" tw="text-[20px] sm:text-[18px]">
            Socials
          </div>
          <div tw="flex sm:block">
            <div className="titleHeader">
              Twitter
              <div>
                <InputContainer setVariableState={setTwitterLink} stateVariable={twitterLink} maxLength={40} />
              </div>
              <UnderLine width={checkMobile() ? '100%' : 200} />
              <PublicURLText />
            </div>
            <div className="titleHeader" tw="ml-4 sm:ml-0">
              Discord
              <div>
                <InputContainer setVariableState={setDiscordLink} stateVariable={discordLink} />
              </div>
              <UnderLine width={checkMobile() ? '100%' : 200} />
              <PublicURLText />
            </div>
          </div>
          <div tw="flex sm:block">
            <div className="titleHeader">
              Telegram
              <div>
                <InputContainer setVariableState={setTelegramLink} stateVariable={telegramLink} />
              </div>
              <UnderLine width={checkMobile() ? '100%' : 200} />
              <PublicURLText />
            </div>
            <div className="titleHeader" tw="ml-4 sm:ml-0">
              Website
              <div>
                <InputContainer setVariableState={setWebsiteLink} stateVariable={websiteLink} />
              </div>
              <UnderLine width={checkMobile() ? '100%' : 200} />
              <PublicURLText />
            </div>
          </div>
        </div>

        <Separator />
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
}

const OptionalText = () => <span className="optional">(optional)</span>
const PublicURLText = () => <div className="publicURLText">Will be used as Public URL</div>
const PublicUsernameText = () => <div className="publicURLText">Will be Public username</div>
const UnderLine: FC<{ width: string | number; height?: number }> = ({ width, height }) => (
  <div className="underLine" style={{ width: width, height: height ?? 2 }} />
)

const Separator = () => <div className="separator"> </div>
const InputContainer: FC<{ setVariableState: any; stateVariable: any; maxLength?: number }> = ({
  setVariableState,
  stateVariable,
  maxLength = 40
}) => {
  const handleChange = (e) => {
    if (maxLength && e.target.value.length <= maxLength) setVariableState(e.target.value)
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
