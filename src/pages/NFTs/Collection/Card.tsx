import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Row } from 'antd'
import styled, { css } from 'styled-components'
import { moneyFormatter } from '../../../utils'
import { ISingleNFT, INFTBid, INFTAsk, INFTGeneralData } from '../../../types/nft_details.d'
import { useNFTProfile, useNFTDetails, useConnectionConfig, useDarkMode, usePriceFeed } from '../../../context'
import { fetchSingleNFT } from '../../../api/NFTs'
import { getParsedAccountByMint, StringPublicKey, ParsedAccount } from '../../../web3'
import { Loader } from '../../../components'
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'

//#region styles
const CARD = styled.div`
  width: 100%;
  cursor: pointer;
  background-color: ${({ theme }) => theme.cardBg};
  ${({ theme }) => theme.largeBorderRadius}

  .card-image-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
    margin: 0 auto;
    padding: ${({ theme }) => theme.margin(2)};

    .ant-image-mask {
      display: none;
    }
    .card-image {
      object-fit: contain;
      width: 100%;
      max-height: 300px;
      ${({ theme }) => theme.largeBorderRadius}
    }
    .card-remaining {
      position: absolute;
      right: 10px;
      bottom: 7px;
      padding: ${({ theme }) => `${theme.margin(0.5)} ${theme.margin(1)}`};
      background-color: #000;
      font-size: 9px;
    }
  }
  .card-info {
    padding: 0 ${({ theme }) => theme.margin(2)} ${({ theme }) => theme.margin(2)};
  }
  .card-details {
    position: relative;
    height: 30px;

    margin-bottom: ${({ theme }) => theme.margin(0.5)};
    text-align: left;
    .card-name {
      font-size: 16px;
      font-weight: 600;
      color: ${({ theme }) => theme.white};
      font-family: Montserrat;
      width: calc(100% - 48px);
      ${({ theme }) => theme.ellipse}
    }
    .card-favorite-heart-container {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
    }
    .card-favorite-heart {
      margin-right: ${({ theme }) => theme.margin(0.5)};
    }
    .card-featured-heart {
      width: 30px;
      height: 30px;
      transform: translateY(4px);
    }
    .card-favorite-heart--disabled {
      cursor: not-allowed;
    }
    .card-favorite-number {
      color: ${({ theme }) => theme.hintInputColor};
      font-size: 13px;
      font-weight: 600;
    }
  }
  .card-price {
  }
`

const BID_BUTTON = styled.button<{ cardStatus: string }>`
  min-width: 76px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 50px;
  color: ${({ theme }) => theme.white};
  font-family: Montserrat;
  ${({ cardStatus, theme }) => css`
    height: 34px;
    background-color: ${cardStatus === 'unlisted' ? '#bb3535' : cardStatus === 'listed' ? `#bb3535` : '#3735bb'};
    cursor: pointer;
    font-size: 11px;
    font-weight: 600;
    padding: ${theme.margin(1)} ${theme.margin(2)};
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  `}
`

const LIGHT_TEXT = styled.span`
  color: ${({ theme }) => theme.hintInputColor};
`

const COVER = styled.div<{ $mode: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 16px;
  bottom: 16px;
  left: 16px;
  right: 16px;
  background-color: ${({ $mode }) => ($mode ? 'rgb(0 0 0 / 66%)' : 'rgb(202 202 202 / 71%)')};
  z-index: 10;
  cursor: default;
  ${({ theme }) => theme.largeBorderRadius}

  div {
    top: 40%;
  }
`
//#endregion

type ICard = {
  singleNFT: ISingleNFT
  className?: string
  listingType?: string
  userId?: string
}

export const Card = (props: ICard) => {
  const history = useHistory()
  const { mode } = useDarkMode()
  const { connection } = useConnectionConfig()
  const { sessionUser, sessionUserParsedAccounts, likeDislike, userCurrency } = useNFTProfile()
  const { prices } = usePriceFeed()
  const [localSingleNFT, setlocalSingleNFT] = useState(undefined)
  /** setters are only for populating context before location change to details page */
  const { setGeneral, setNftMetadata, setBids, setAsk, setTotalLikes } = useNFTDetails()
  const [localBids, setLocalBids] = useState<INFTBid[]>([])
  const [localAsk, setLocalAsk] = useState<INFTAsk>()
  const [localTotalLikes, setLocalTotalLikes] = useState<number>()
  const [isFavorited, setIsFavorited] = useState<boolean>(false)
  const [isLoadingBeforeRelocate, setIsLoadingBeforeRelocate] = useState<boolean>(false)

  const displayPrice: string = useMemo(
    () =>
      localAsk !== undefined
        ? localAsk.buyer_price
        : localBids.length > 0
        ? localBids[localBids.length - 1].buyer_price
        : '0',
    [localAsk, localBids, sessionUser]
  )

  const isOwner: boolean = useMemo(() => {
    if (props.userId) return true
    const findAccount: undefined | ParsedAccount =
      props.singleNFT && sessionUserParsedAccounts !== undefined
        ? sessionUserParsedAccounts.find((acct) => acct.mint === props.singleNFT.mint_address)
        : undefined
    return findAccount === undefined ? false : true
  }, [sessionUserParsedAccounts])

  useEffect(() => {
    if (props.singleNFT) {
      fetchSingleNFT(props.singleNFT.mint_address).then((res) => {
        if (res && res.status === 200) {
          res.data.data.length > 0 ? setlocalSingleNFT(res.data.data[0]) : setlocalSingleNFT(props.singleNFT)
          const nft: INFTGeneralData = res.data
          setLocalBids(nft.bids)
          setLocalAsk(nft.asks[0])
          setLocalTotalLikes(nft.total_likes)
        }
      })
    }

    return () => {
      setIsLoadingBeforeRelocate(false)
    }
  }, [props.singleNFT])

  useEffect(() => {
    if (props.singleNFT && sessionUser && sessionUser.user_likes) {
      setIsFavorited(sessionUser.user_likes.includes(props.singleNFT.uuid))
    }
  }, [sessionUser])

  const handleToggleLike = async () => {
    if (sessionUser && sessionUser.uuid) {
      const res = await likeDislike(sessionUser.uuid, localSingleNFT.uuid)
      setLocalTotalLikes((prev) => (isFavorited ? prev - 1 : prev + 1))
      setIsFavorited(res.data.action === 'liked')
    }
  }

  const goToDetails = async (address: string): Promise<void> => {
    setIsLoadingBeforeRelocate(true)
    await setNFTDetailsBeforeLocate()
    history.push(`/NFTs/details/${address}`)
  }

  const getButtonText = (isOwner: boolean, ask: INFTAsk | undefined): string => {
    if (isOwner) {
      return ask === undefined ? 'Sell' : 'Edit Ask'
    } else {
      return ask === undefined ? 'Bid' : 'Buy Now'
    }
  }

  const setNFTDetailsBeforeLocate = async () => {
    await setBids(localBids)
    await setAsk(localAsk)
    await setTotalLikes(localTotalLikes)
    const res = await axios.get(localSingleNFT.metadata_url)
    const metaData = await res.data
    await setNftMetadata(metaData)
    const parsedAccounts = await getParsedAccountByMint({
      mintAddress: localSingleNFT.mint_address as StringPublicKey,
      connection: connection
    })

    const accountInfo = {
      token_account: parsedAccounts !== undefined ? parsedAccounts.pubkey : null,
      owner: parsedAccounts !== undefined ? parsedAccounts.owner : null
    }

    await setGeneral({ ...localSingleNFT, ...accountInfo })
    setIsLoadingBeforeRelocate(false)
    return true
  }

  const dynamicPriceValue = (currency: string, priceFeed: any, value: number) => {
    const val = currency === 'USD' ? value * priceFeed['SOL/USDC']?.current : value

    return `${moneyFormatter(val)} ${currency}`
  }

  return (
    <CARD {...props} className="card">
      <div
        className="card-image-wrapper"
        onClick={() => (localSingleNFT !== undefined ? goToDetails(localSingleNFT.mint_address) : null)}
      >
        {isLoadingBeforeRelocate && (
          <COVER $mode={mode === 'dark'}>
            <Loader />
          </COVER>
        )}

        <img
          className="card-image"
          src={localSingleNFT ? localSingleNFT.image_url : `${window.origin}/img/assets/nft-preview-${mode}.svg`}
          alt="nft"
        />
      </div>
      <div className={'card-info'}>
        <div className="card-details">
          {localSingleNFT ? (
            <div className="card-name">{localSingleNFT.nft_name}</div>
          ) : (
            <SkeletonCommon width="130px" height="25px" />
          )}

          {localSingleNFT && localSingleNFT.uuid !== null && (
            <span className="card-favorite-heart-container">
              {sessionUser && isFavorited ? (
                <img
                  className="card-favorite-heart"
                  src={`/img/assets/heart-red.svg`}
                  alt="heart-selected"
                  onClick={handleToggleLike}
                />
              ) : (
                <img
                  className={`card-favorite-heart ${!sessionUser ? 'card-favorite-heart--disabled' : ''}`}
                  src={`/img/assets/heart-empty.svg`}
                  alt="heart-empty"
                  onClick={handleToggleLike}
                />
              )}
              <span
                className={`card-favorite-number ${isFavorited ? 'card-favorite-number-highlight' : ''} ${
                  !sessionUser ? 'card-favorite-heart--disabled' : ''
                }`}
              >
                {localTotalLikes}
              </span>
            </span>
          )}
        </div>
        <Row justify="space-between" align="middle">
          {localSingleNFT ? (
            <div className="card-price">
              {displayPrice === '0' ? (
                <LIGHT_TEXT>No Bids</LIGHT_TEXT>
              ) : (
                dynamicPriceValue(userCurrency, prices, parseFloat(displayPrice) / LAMPORTS_PER_SOL)
              )}
            </div>
          ) : (
            <SkeletonCommon width="64px" height="24px" />
          )}

          {sessionUser &&
            (localSingleNFT ? (
              isOwner ? (
                <BID_BUTTON
                  cardStatus={localAsk ? 'listed' : 'unlisted'}
                  onClick={() => goToDetails(localSingleNFT.mint_address)}
                >
                  {getButtonText(isOwner, localAsk)}
                </BID_BUTTON>
              ) : (
                <BID_BUTTON cardStatus={'bid'} onClick={() => goToDetails(localSingleNFT.mint_address)}>
                  {getButtonText(isOwner, localAsk)}
                </BID_BUTTON>
              )
            ) : (
              <SkeletonCommon width="76px" height="32px" borderRadius="50px" />
            ))}
        </Row>
      </div>
    </CARD>
  )
}
