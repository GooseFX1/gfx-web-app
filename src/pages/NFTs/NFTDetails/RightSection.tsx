/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useMemo, FC } from 'react'
import { useHistory } from 'react-router-dom'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Col, Row } from 'antd'
import styled, { css } from 'styled-components'
// import { moneyFormatter } from '../../../utils'
import { RightSectionTabs } from './RightSectionTabs'
import { useNFTDetails, useNFTProfile, usePriceFeedFarm } from '../../../context'
import { MintItemViewStatus } from '../../../types/nft_details'
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'
import { notify } from '../../../utils'
import { generateTinyURL } from '../../../api/tinyUrl'
import { Share } from '../Share'
import tw from 'twin.macro'
import 'styled-components/macro'
import { copyToClipboard, minimizeTheString } from '../../../web3/nfts/utils'
import { GenericTooltip } from '../../../utils/GenericDegsin'
import { GradientText } from '../../../components/GradientText'
import { NFTTabSections } from '../Collection/DetailViewNFTDrawer'

//#region styles
const RIGHT_SECTION = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    margin-top: 15px;

    .price-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 8px 0;
    }

    color: ${theme.text1};
    text-align: left;

    .rs-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: ${theme.margin(1)};
      color: ${theme.text7};
    }

    .rs-type {
      font-size: 14px;
      font-weight: 600;
    }

    .rs-prices {
      margin-bottom: ${theme.margin(1)};

      .rs-solana-logo {
        width: 36px;
        height: 36px;
      }

      .rs-price {
        font-size: 25px;
        font-weight: bold;
        color: ${theme.text4};
      }

      .rs-fiat {
        font-size: 14px;
        font-weight: 500;
        color: ${theme.text4};
      }

      .rs-percent {
        font-size: 11px;
        font-weight: 600;
        margin-left: ${theme.margin(0.5)};
        color: ${theme.text4};
      }
    }

    .name-icon-row {
      ${tw`sm:flex sm:flex-row sm:justify-between sm:items-center`}

      .ls-favorite-number {
        ${tw`sm:text-regular sm:ml-2`}
      }
    }

    .rs-name {
      ${tw`sm:mr-auto`}
      font-size: 22px;
      font-weight: 600;
      margin-bottom: ${theme.margin(0.5)};
      background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .rs-intro {
      font-size: 15px;
      font-weight: 500;
      margin-bottom: ${theme.margin(1.5)};
      color: ${theme.text4};
      overflow-y: scroll;
      overflow-x: hidden;
      ${({ theme }) => theme.customScrollBar('4px')};
    }

    .rs-charity-text {
      font-size: 12px;
      font-weight: 600;
      max-width: 64px;
      margin-left: ${theme.margin(1.5)};
      color: ${theme.text4};
    }
  `}
`
//#endregion

export const RightSection: FC<{
  status: MintItemViewStatus
}> = ({ status, ...rest }) => {
  const history = useHistory()
  const { sessionUser, likeDislike } = useNFTProfile()
  const { general, nftMetadata, curHighestBid, ask, totalLikes } = useNFTDetails()
  // const { prices } = usePriceFeedFarm()
  const [activeTab, setActiveTab] = useState('1')

  const [isFavorited, setIsFavorited] = useState<boolean>(false)
  const [likes, setLikes] = useState<number>(0)
  const [shareModal, setShareModal] = useState<boolean>(false)

  // const price: number | null = useMemo(() => {
  //   if (ask) {
  //     return parseFloat(ask.buyer_price) / LAMPORTS_PER_SOL
  //   } else {
  //     return curHighestBid ? parseFloat(curHighestBid.buyer_price) / LAMPORTS_PER_SOL : null
  //   }
  // }, [curHighestBid, ask])

  // const marketData = useMemo(() => prices['SOL/USDC'], [prices])

  // const fiatCalc: string = useMemo(
  //   () => `${marketData && bidPrice ? (marketData.current * bidPrice).toFixed(3) : ''}`,
  //   [marketData, bidPrice]
  // )

  useEffect(() => {
    if (general && sessionUser) {
      setIsFavorited(sessionUser.user_likes.includes(general.uuid))
    }
  }, [sessionUser, general])

  useEffect(() => {
    setLikes(totalLikes)
  }, [totalLikes])

  if (nftMetadata === null) {
    return <div>Error loading metadata</div>
  }

  const handleToggleLike = () => {
    if (sessionUser) {
      likeDislike(sessionUser.uuid, general.uuid).then(() => {
        setLikes((prev) => (isFavorited ? prev - 1 : prev + 1))
      })
    }
  }

  const isLoading = nftMetadata === null || general === null

  const onShare = async (social: string): Promise<void> => {
    if (social === 'copy link') {
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

  return (
    <RIGHT_SECTION {...rest}>
      {handleModal()}

      {isLoading ? (
        <>
          <SkeletonCommon width="100%" height="75px" borderRadius="10px" />
          <br />
        </>
      ) : (
        <div>
          <div tw="flex justify-between my-5">
            <div tw="cursor-pointer">
              <div>
                <GenericTooltip text={general?.nft_name}>
                  <div tw="text-lg dark:text-white text-black-4 font-semibold">
                    {general && minimizeTheString(general.nft_name, 20)}
                  </div>
                </GenericTooltip>
              </div>
              {general && (
                <GradientText
                  text={minimizeTheString(
                    general?.collection_name !== null ? general?.collection_name : 'No Collection Name',
                    18
                  )}
                  fontSize={20}
                  fontWeight={600}
                  onClick={(e) =>
                    general?.collection_name !== null
                      ? history.push(`/nfts/collection/${general?.collection_name}`)
                      : null
                  }
                />
              )}
            </div>

            <div className="ls-bottom-panel">
              <div className="img-holder">
                {/* {sessionUser && isFavorited ? (
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
                )} */}

                <span className={`ls-favorite-number ${isFavorited ? 'ls-favorite-number-highlight' : ''}`}>
                  {likes ? likes : null}
                </span>
                <a href={`https://solscan.io/token/${general.mint_address}`} target="_blank" rel="noreferrer">
                  <img
                    src="/img/assets/solscanBlack.svg"
                    alt="solscan-icon"
                    tw="ml-5 h-10 w-10"
                    className="solscan-icon"
                  />
                </a>
                <img
                  src="/img/assets/shareBlue.svg"
                  alt="share-icon"
                  tw="ml-5 h-10 w-10 cursor-pointer"
                  className="share-icon"
                  onClick={copyToClipboard}
                />
              </div>
            </div>
          </div>
          <div tw="my-5 text-regular">{nftMetadata.description}</div>
        </div>
      )}
      <NFTTabSections setActiveTab={setActiveTab} activeTab={activeTab} />
    </RIGHT_SECTION>
  )
}
