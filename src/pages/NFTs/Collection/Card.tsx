import React, { useState, useEffect, useMemo, useCallback } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Row } from 'antd'
import styled, { css } from 'styled-components'
import { moneyFormatter } from '../../../utils'
import { ISingleNFT, INFTBid, INFTAsk, INFTGeneralData } from '../../../types/nft_details.d'
import { useNFTProfile, useNFTDetails, useConnectionConfig } from '../../../context'
import { fetchSingleNFT } from '../../../api/NFTs'
import { getParsedAccountByMint, StringPublicKey, ParsedAccount } from '../../../web3'

//#region styles
const CARD = styled.div<{ status: string }>`
  padding-bottom: ${({ theme }) => theme.margin(1.5)};
  border-radius: 15px;
  cursor: pointer;
  width: 226px;
  .card-image-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    width: fit-content;
    min-width: 190px;
    margin: 0 auto;
    .ant-image-mask {
      display: none;
    }
    .card-image {
      object-fit: contain;
      border-radius: 15px;
      width: 100%;
      height: 190px;
    }
    .card-remaining {
      position: absolute;
      right: 10px;
      bottom: 7px;
      padding: ${({ theme }) => `${theme.margin(0.5)} ${theme.margin(1)}`};
      background-color: #000;
      border-radius: 15px;
      font-size: 9px;
    }
  }
  .card-info {
    position: relative;
    height: 30px;
    margin-top: ${({ theme }) => theme.margin(2)};
    margin-bottom: ${({ theme }) => theme.margin(0.5)};
    text-align: left;
    .card-name {
      font-size: 16px;
      font-weight: 600;
      color: ${({ theme }) => theme.text2};
      font-family: Montserrat;
      width: calc(100% - 48px);
      ${({ theme }) => theme.ellipse}
    }
    .card-favorite-heart-container {
      position: absolute;
      top: 0;
      right: 0;
    }
    .card-featured-heart {
      width: 30px;
      height: 30px;
      transform: translateY(4px);
    }
    .card-favorite-number {
      color: #4b4b4b;
      font-size: 13px;
      font-weight: 600;
    }
  }
  .card-price {
    color: ${({ theme }) => theme.text2} !important;
  }
  ${({ status, theme }) => {
    return css`
      padding: ${theme.margin(2.5)};
      opacity: ${status === 'unlisted' ? 0.6 : 1};
      background-color: ${({ theme }) => theme.bg3};
      .card-remaining {
        display: none;
      }
      .card-info .card-favorite-number-highlight {
        color: ${({ theme }) => theme.text1};
      }
      .card-info .card-favorite-number {
        color: ${({ theme }) => theme.text10};
        margin-left: ${({ theme }) => theme.margin(0.3)};
      }
      .card-info .card-favorite-heart {
        filter: ${({ theme }) => theme.filterHeartIcon};
      }
      .card-favorite {
        display: ${status === 'unlisted' ? 'none' : 'inline-block'};
      }
    `
  }}
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
  ${({ cardStatus, theme }) => {
    return css`
      height: 34px;
      background-color: ${cardStatus === 'unlisted' ? '#50BB35' : cardStatus === 'listed' ? `#bb3535` : '#3735bb'};
      cursor: pointer;
      font-size: 11px;
      font-weight: 600;
      padding: ${theme.margin(1)} ${theme.margin(2)};
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    `
  }}
`

const LIGHT_TEXT = styled.span`
  color: ${({ theme }) => theme.text9};
`

//#endregion

type Props = {
  singleNFT: ISingleNFT
  className?: string
  listingType?: string
}

export const Card = ({ singleNFT, listingType, className, ...rest }: Props) => {
  const history = useHistory()
  const { connection } = useConnectionConfig()
  const { sessionUser, parsedAccounts, likeDislike } = useNFTProfile()
  /** setters are only for populating context before location change to details page */
  const { setGeneral, setNftMetadata, setBids, setAsk, setTotalLikes } = useNFTDetails()
  const [localBids, setLocalBids] = useState<INFTBid[]>([])
  const [localAsk, setLocalAsk] = useState<INFTAsk>()
  const [localTotalLikes, setLocalTotalLikes] = useState<number>()
  const localNFT = {
    ...singleNFT,
    status: 'auctioning',
    remaining: '02d:20h:10min'
  }
  const [isFavorited, setIsFavorited] = useState(false)

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
    const findAccount: undefined | ParsedAccount =
      singleNFT && parsedAccounts !== undefined
        ? parsedAccounts.find((acct) => acct.mint === singleNFT.mint_address)
        : undefined
    return findAccount === undefined ? false : true
  }, [parsedAccounts])

  useEffect(() => {
    if (singleNFT) {
      fetchSingleNFT(singleNFT.non_fungible_id).then((res) => {
        if (res && res.status === 200) {
          const nft: INFTGeneralData = res.data
          setLocalBids(nft.bids)
          setLocalAsk(nft.asks[0])
          setLocalTotalLikes(nft.total_likes)
        }
      })
    }

    return () => {}
  }, [])

  useEffect(() => {
    if (singleNFT && sessionUser) {
      setIsFavorited(sessionUser.user_likes.includes(singleNFT.non_fungible_id))
    }
  }, [sessionUser])

  const handleToggleLike = (e: any) => {
    likeDislike(sessionUser.user_id, singleNFT.non_fungible_id)
    setLocalTotalLikes((prev) => (isFavorited ? prev - 1 : prev + 1))
    setIsFavorited((prev) => !prev)
  }

  const goToDetails = async (id: number): Promise<void> => {
    await setNFTDetailsBeforeLocate()
    history.push(`/NFTs/open-bid/${id}`)
  }

  const getButtonText = (isOwner: boolean, ask: INFTAsk | undefined): string => {
    if (isOwner) {
      return ask === undefined ? 'Set Ask' : 'Remove Ask'
    } else {
      return ask === undefined ? 'Bid' : 'Buy Now'
    }
  }

  const setNFTDetailsBeforeLocate = async () => {
    await setBids(localBids)
    await setAsk(localAsk)
    await setTotalLikes(localTotalLikes)
    const res = await axios.get(singleNFT.metadata_url)
    const metaData = await res.data
    await setNftMetadata(metaData)
    const parsedAccounts = await getParsedAccountByMint({
      mintAddress: singleNFT.mint_address as StringPublicKey,
      connection: connection
    })

    const accountInfo =
      parsedAccounts !== undefined
        ? { token_account: parsedAccounts.pubkey, owner: parsedAccounts.account?.data?.parsed?.info.owner }
        : { token_account: null, owner: null }

    await setGeneral({ ...singleNFT, ...accountInfo })
    return true
  }

  return (
    <CARD status={localNFT.status} {...rest} className="card">
      <div className="card-image-wrapper" onClick={(e) => goToDetails(singleNFT.non_fungible_id)}>
        <img
          className="card-image"
          src={localNFT.image_url ? localNFT.image_url : `${window.origin}/img/assets/nft-preview.svg`}
          alt="nft"
        />
        <div className="card-remaining">{localNFT.remaining}</div>
      </div>
      <div className="card-info">
        <div className="card-name">{localNFT.nft_name}</div>

        <span className="card-favorite-heart-container">
          {sessionUser && sessionUser.user_id && isFavorited ? (
            <img
              className="card-favorite-heart"
              src={`/img/assets/heart-red.svg`}
              alt="heart-selected"
              onClick={handleToggleLike}
            />
          ) : (
            <img
              className="card-favorite-heart"
              src={`/img/assets/heart-empty.svg`}
              alt="heart-empty"
              onClick={handleToggleLike}
            />
          )}
          <span className={`card-favorite-number ${isFavorited ? 'card-favorite-number-highlight' : ''}`}>
            {localTotalLikes}
          </span>
        </span>
      </div>
      <Row justify="space-between" align="middle">
        <div className="card-price">
          {displayPrice === '0' ? (
            <LIGHT_TEXT>No Bids</LIGHT_TEXT>
          ) : (
            `${moneyFormatter(parseFloat(displayPrice) / LAMPORTS_PER_SOL)} SOL`
          )}
        </div>
        {sessionUser &&
          (isOwner ? (
            <BID_BUTTON
              cardStatus={localAsk ? 'listed' : 'unlisted'}
              onClick={(e) => goToDetails(singleNFT.non_fungible_id)}
            >
              {getButtonText(isOwner, localAsk)}
            </BID_BUTTON>
          ) : (
            <BID_BUTTON cardStatus={'bid'} onClick={(e) => goToDetails(singleNFT.non_fungible_id)}>
              {getButtonText(isOwner, localAsk)}
            </BID_BUTTON>
          ))}
      </Row>
    </CARD>
  )
}
