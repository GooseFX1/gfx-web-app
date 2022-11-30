import { FC, useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { useNFTDetails, useNFTProfile } from '../../../context'
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'
import { Share } from '../Share'
import { ReactComponent as FixedPriceIcon } from '../../../assets/fixed-price.svg'
import { ReactComponent as OpenBidIcon } from '../../../assets/open-bid.svg'
import { generateTinyURL } from '../../../api/tinyUrl'
import { checkMobile, notify } from '../../../utils'

//#region styles
const LEFT_SECTION = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: ${theme.text1};
    position: relative;

    .close-icon-holder {
      height: 30px;
      width: 30px;
      border-radius: 50%;
      background: #131313;
      position: absolute;
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      top: 12px;
      left: 12px;
      cursor: pointer;
    }

    .ls-image {
      border-radius: 20px;
      box-shadow: 3px 3px 14px 0px rgb(0 0 0 / 43%);
    }

    .ls-bottom-panel {
      margin-top: ${theme.margin(2.5)};
      display: flex;
      justify-content: center;
      align-items: center;

      .img-holder {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .ls-end-text {
        font-size: 12px;
        font-weight: 600;
        color: ${theme.text7};
      }

      .ls-favorite {
        margin-bottom: ${theme.margin(2)};
      }

      .ls-favorite-heart {
        width: 21px;
        height: 21px;
        margin-right: ${theme.margin(0.5)};
        cursor: pointer;
      }

      .ls-favorite-number {
        font-size: 18px;
        font-weight: 600;
        color: #4b4b4b;
        margin-right: 12px;
      }

      .ls-favorite-number-highlight {
        color: ${theme.text1};
        margin-right: 12px;
      }

      .ls-action-button {
        color: ${theme.text1};
        margin-right: auto;
      }

      .solscan-icon {
        margin-right: 12px;
        height: 40px;
        width: 40px;
        cursor: pointer;
      }

      .share-icon {
        width: 40px;
        height: 40px;
        cursor: pointer;
      }
    }
  `}
`

//#endregion

export const ImageShowcase: FC<{ setShowSingleNFT?: any }> = ({ setShowSingleNFT, ...rest }) => {
  const { general, nftMetadata, totalLikes, ask } = useNFTDetails()
  const [isFavorited, setIsFavorited] = useState(false)
  const { sessionUser, likeDislike } = useNFTProfile()
  const [shareModal, setShareModal] = useState(false)
  const [likes, setLikes] = useState(0)

  useEffect(() => {
    if (general && sessionUser) {
      setIsFavorited(sessionUser.user_likes.includes(general.uuid))
    }
  }, [sessionUser, general])

  useEffect(() => {
    setLikes(totalLikes)
  }, [totalLikes])

  const handleToggleLike = () => {
    if (sessionUser) {
      likeDislike(sessionUser.uuid, general.uuid).then(() => {
        setLikes((prev) => (isFavorited ? prev - 1 : prev + 1))
      })
    }
  }

  const onShare = async (social: string): Promise<void> => {
    if (social === 'copy link') {
      copyToClipboard()
      return
    }

    const res = await generateTinyURL(
      `https://${process.env.NODE_ENV !== 'production' ? 'app.staging.goosefx.io' : window.location.host}${
        window.location.pathname
      }`,
      ['gfx', 'nest-exchange', social]
    )

    if (res.status !== 200) {
      notify({ type: 'error', message: 'Error creating sharing url' })
      return
    }

    const tinyURL = res.data.data.tiny_url

    switch (social) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=Check%20out%20this%20item%20on%20Nest%20NFT%
          20Exchange&url=${tinyURL}&via=GooseFX1&original_referer=${window.location.host}${window.location.pathname}`
        )
        break
      case 'telegram':
        window.open(
          `https://t.me/share/url?url=${tinyURL}&text=Check%20out%20this%20item%20on%20Nest%20NFT%20Exchange`
        )
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${tinyURL}`)
        break
      default:
        break
    }
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(window.location.href)
  }

  const handleModal = () => {
    if (shareModal) {
      return (
        <Share
          visible={shareModal}
          handleCancel={() => setShareModal(false)}
          socials={['twitter', 'telegram', 'facebook', 'copy link']}
          handleShare={onShare}
        />
      )
    } else {
      return false
    }
  }

  return general && nftMetadata ? (
    <LEFT_SECTION {...rest}>
      {handleModal()}
      <div
        className="close-icon-holder"
        onClick={() => {
          setShowSingleNFT(false)
        }}
      >
        <img src="/img/assets/close-white-icon.svg" alt="" height="12px" width="12px" />
      </div>
      <img className="ls-image" height={'100%'} src={general?.image_url || nftMetadata?.image} alt="the-nft" />
      <div className="ls-bottom-panel">
        {ask ? <FixedPriceIcon className="ls-action-button" /> : <OpenBidIcon className="ls-action-button" />}
        {general.uuid && (
          <div className="img-holder">
            {sessionUser && isFavorited ? (
              <img
                className="ls-favorite-heart"
                src={`/img/assets/heart-red.svg`}
                alt="heart-red"
                onClick={handleToggleLike}
              />
            ) : (
              <img
                className="ls-favorite-heart"
                src={`/img/assets/heart-empty.svg`}
                alt="heart-empty"
                onClick={handleToggleLike}
              />
            )}
            <span className={`ls-favorite-number ${isFavorited ? 'ls-favorite-number-highlight' : ''}`}>
              {likes}
            </span>
            <a href={`https://solscan.io/token/${general.mint_address}`} target="_blank" rel="noreferrer">
              <img src="/img/assets/solScanBlack.svg" alt="solscan-icon" className="solscan-icon" />
            </a>
            <img
              src="/img/assets/shareBlue.svg"
              alt="share-icon"
              className="share-icon"
              onClick={() => {
                setShareModal(true)
              }}
            />
          </div>
        )}
      </div>
    </LEFT_SECTION>
  ) : (
    <SkeletonCommon width="100%" height={checkMobile() ? '360px' : '500px'} borderRadius="10px" />
  )
}
