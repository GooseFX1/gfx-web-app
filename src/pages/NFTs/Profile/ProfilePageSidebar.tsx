import { FC, memo, ReactElement, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useDarkMode, useNFTProfile } from '../../../context'
import { checkMobile, truncateAddress } from '../../../utils'
import { IAppParams } from '../../../types/app_params'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'

const PROFILE = styled.div`
${tw`w-[23vw] bg-grey-6 dark:bg-black-1`}
  border-top-right-radius: 20px;
  border: 1px solid ${({ theme }) => theme.tokenBorder};
  ${({ theme }) => theme.customScrollBar(0)}
  height: 88vh;
  .profileContent {
    ${tw`overflow-y-auto overflow-x-hidden mt-[-20px]`}
    ${({ theme }) => theme.customScrollBar('0px')}
    height: 640px;
  }

  .profile-pic {
    ${tw`flex relative h-[100px]`}
    .avatar-profile-wrap {
      position: relative;
      width: 116px;
      bottom: 50px;
      left: 28px;
      .avatar-profile {
        ${tw`dark:border-black-1 border-white h-[116px] rounded-[50%]`}
        width: 116px;
        border: 8px solid;
      }
    
      .icon {
        ${tw`h-10 w-10 absolute bottom-[-14px] right-[-2px] cursor-pointer`}
      }
    }

    .no-socials-msg {
      position: absolute;
      right: 20px;
      top: 20px;
      color: ${({ theme }) => theme.text20};
      font-size: 18px;
      font-weight: 600;
    }

    .social-list {
      margin-left: auto;
      display: flex;
      justify-content: center;
      align-items: center;
      .social-item {
        display: inline-block;
        width: 35px;
        margin: 0 5px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .social-item-yt {
        height: 35px;
        width: 35px;
        background-color: #0d0d0d;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          height: 25px;
          width: 25px;
        }
      }
      .social-icon {
        ${tw`w-[35px] h-[30px]`}
      }
      .twitterHeight {
        height: 17px;
      }
      .height{
        height: 30px;
      }
    }
  }

  .bio {
    color: ${({ theme }) => theme.text20};
    margin: 20px 25px 35px;
    ${tw`text-[15px] font-semibold`}
  }

  .graphic-img{
    width: 23vw;
    height: auto;
    scale: 1;
    ${tw`object-cover`}
  }

  .portfolio{
    margin: 20px auto;
    width: 90%;
    color: ${({ theme }) => theme.text30};
    font-size: 20px;
    font-weight: 600;

    >span{
        color: ${({ theme }) => theme.text31};
        font-size: 20px;
        font-weight: 600;
    }

    .track-portfolio{
        ${tw`text-[15px] font-semibold mb-8 mt-[11px] dark:text-grey-5 text-grey-1`}
    }
  }
}
`

type Props = {
  isSessionUser: boolean
}

const ProfilePageSidebar: FC<Props> = ({ isSessionUser }: Props): JSX.Element => {
  const { sessionUser, nonSessionProfile } = useNFTProfile()
  const currentUserProfile = useMemo(() => {
    if (nonSessionProfile !== undefined && !isSessionUser) {
      return nonSessionProfile
    } else if (sessionUser !== null && isSessionUser) {
      return sessionUser
    } else {
      return undefined
    }
  }, [isSessionUser, sessionUser, nonSessionProfile])

  const params = useParams<IAppParams>()

  let profilePic = currentUserProfile?.profile_pic_link
  if (profilePic === 'https://gfx-nest-image-resources.s3.amazonaws.com/avatar.png') profilePic = null

  return (
    <PROFILE>
      <div className="profile-pic">
        {!checkMobile() && (
          <div className="avatar-profile-wrap">
            {currentUserProfile && profilePic ? (
              <img
                className="avatar-profile"
                src={currentUserProfile.profile_pic_link}
                alt="user-image"
                height="116px"
                width="116px"
              />
            ) : (
              <WalletProfilePicture />
            )}
          </div>
        )}
      </div>
      <div className="profileContent">
        {params && params.userAddress && (
          <div tw="flex flex-wrap justify-between items-center pl-6 pr-3 pt-6">
            <div>
              <span tw="font-semibold text-[30px] dark:text-white text-black-4">
                {currentUserProfile?.nickname ?? truncateAddress(params.userAddress)}
              </span>
            </div>
            <div tw="flex">
              <a
                tw="ml-auto mr-3"
                href={`https://solscan.io/account/${params.userAddress}`}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="/img/assets/solscanBlack.svg"
                  alt="solscan-icon"
                  tw="h-[40px] w-[40px] rounded cursor-pointer"
                />
              </a>
            </div>
          </div>
        )}

        {currentUserProfile && currentUserProfile?.bio ? (
          <div className="bio">{currentUserProfile.bio}</div>
        ) : (
          <div className="bio">
            {sessionUser ? (
              <>
                Add your bio and share with <br /> the world who you are!
              </>
            ) : (
              <>No Bio</>
            )}
          </div>
        )}
      </div>
    </PROFILE>
  )
}

export default memo(ProfilePageSidebar)
export const WalletProfilePicture = (): ReactElement => {
  const { mode } = useDarkMode()

  return (
    <div className="no-dp-avatar">
      <img tw="h-full" src={`/img/assets/Aggregator/avatar-${mode}.svg`} alt="profile picture" />
    </div>
  )
}
