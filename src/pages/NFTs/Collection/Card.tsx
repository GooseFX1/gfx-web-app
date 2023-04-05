/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useMemo, FC, ReactElement } from 'react'
import axios from 'axios'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Row } from 'antd'
import { moneyFormatter } from '../../../utils'
import { ISingleNFT, INFTBid, INFTAsk, INFTGeneralData } from '../../../types/nft_details.d'
import { useNFTProfile, useNFTDetails, useConnectionConfig, useDarkMode, useNFTAggregator } from '../../../context'
import { fetchSingleNFT } from '../../../api/NFTs'
import { getParsedAccountByMint, StringPublicKey, ParsedAccount } from '../../../web3'
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'
import { BuySellNFTs } from '../Profile/BuySellNFTs'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { GradientText } from '../adminPage/components/UpcomingMints'
import { HoverOnNFT } from './SingleNFTCard'
import { SellNFTModal } from './SellNFTModal'

//#region styles
const CARD = styled.div`
  ${tw`dark:bg-black-1 bg-white rounded-[15px] cursor-pointer w-[190px] h-[275px]`}

  .card-image-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
    margin: 0 auto;
    padding: 10px;
    .ant-image-mask {
      display: none;
    }
    .card-image {
      object-fit: contain;
      width: 100%;
      ${tw`w-[170px] h-[170px]`}

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
      ${tw`text-[#3c3c3c] dark:text-[#eee]`}
      font-family: Montserrat;
      width: calc(100% - 48px);
      ${({ theme }) => theme.ellipse}
    }
    .card-favorite-heart-container {
      position: absolute;
      top: 5px;
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
`

const BID_BUTTON = styled.button<{ cardStatus: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 50px;
  color: ${({ theme }) => theme.white};
  font-family: Montserrat;
  ${({ cardStatus }) => css`
    height: 34px;
    background-color: ${cardStatus === 'unlisted' ? '#bb3535' : cardStatus === 'listed' ? `#bb3535` : '#3735bb'};
    cursor: pointer;
    font-size: 11px;
    font-weight: 600;
  `}
`

const LIGHT_TEXT = styled.span`
  ${tw`text-[14px]`}
  color: ${({ theme }) => theme.hintInputColor};
`

const COVER = styled.div`
  width: 190px;
  height: 270px;
  border: 1px solid;
  background: pink;
  z-index: 200;
`
//#endregion

type ICard = {
  singleNFT: ISingleNFT
  className?: string
  listingType?: string
  userId?: string
}

export const Card: FC<ICard> = (props) => {
  const { mode } = useDarkMode()
  const { connection } = useConnectionConfig()
  const { sessionUser, sessionUserParsedAccounts, likeDislike, userCurrency } = useNFTProfile()
  // const { prices } = usePriceFeed()
  const [localSingleNFT, setlocalSingleNFT] = useState(undefined)
  /** setters are only for populating context before location change to details page */
  const { setGeneral, setNftMetadata, setBids, setAsk, setTotalLikes } = useNFTDetails()
  const [localBids, setLocalBids] = useState<INFTBid[]>([])
  const [localAsk, setLocalAsk] = useState<INFTAsk>()
  const [localTotalLikes, setLocalTotalLikes] = useState<number>()
  const [isFavorited, setIsFavorited] = useState<boolean>(false)
  const [showSingleNFT, setShowSingleNFT] = useState<boolean>(false)
  const [isLoadingBeforeRelocate, setIsLoadingBeforeRelocate] = useState<boolean>(false)
  const [hover, setHover] = useState<boolean>(false)

  const displayPrice: string = useMemo(
    () =>
      localAsk !== null
        ? localAsk.buyer_price
        : localBids.length > 0
        ? localBids[localBids.length - 1].buyer_price
        : '123',
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

  const goToDetails = async (): Promise<void> => {
    setIsLoadingBeforeRelocate(true)
    await setNFTDetailsBeforeLocate()
    setShowSingleNFT(true)
  }

  const getButtonText = (isOwner: boolean, ask: INFTAsk | undefined): string => {
    if (isOwner) {
      return ask === null ? 'Sell' : 'Edit Ask'
    } else {
      return ask === null ? 'Bid' : 'Buy Now'
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
    //const val = currency === 'USD' ? value * priceFeed['SOL/USDC']?.current : value
    return `${moneyFormatter(parseFloat(displayPrice))}`
  }
  return (
    <>
      {showSingleNFT && <BuySellNFTs setShowSingleNFT={setShowSingleNFT} />}
      <div className="gridItem">
        <div
          className="gridItemContainer"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => (localSingleNFT !== undefined ? goToDetails() : null)}
        >
          {isLoadingBeforeRelocate && <LoadingDiv />}
          {hover && (
            <HoverOnNFT
              buttonType="sell"
              item={localSingleNFT}
              setNFTDetailsBeforeLocate={setNFTDetailsBeforeLocate}
            />
          )}
          <img
            className="nftImg"
            src={localSingleNFT ? localSingleNFT.image_url : `${window.origin}/img/assets/nft-preview-${mode}.svg`}
            alt="nft"
          />
        </div>

        <div className={'nftTextContainer'}>
          <div className="collectionId">
            {localSingleNFT?.uuid ? localSingleNFT.uuid : '#8989'}
            <img className="isVerified" src="/img/assets/Aggregator/verifiedNFT.svg" />
          </div>
          {localSingleNFT ? (
            <GradientText text={localSingleNFT.nft_name.substring(0, 13) + '...'} fontSize={15} fontWeight={600} />
          ) : (
            <SkeletonCommon width="130px" height="25px" />
          )}

          <div>
            {localSingleNFT ? (
              <div>
                {displayPrice === '0' ? (
                  <LIGHT_TEXT>No Bids</LIGHT_TEXT>
                ) : (
                  <div className="nftPrice">
                    {dynamicPriceValue(userCurrency, [], parseFloat(displayPrice) / LAMPORTS_PER_SOL)}
                    <img src={`/img/crypto/SOL.svg`} alt={'SOL'} />
                  </div>
                )}
              </div>
            ) : (
              <SkeletonCommon width="64px" height="24px" />
            )}
            <div className="apprisalPrice">
              {dynamicPriceValue(userCurrency, [], parseFloat(displayPrice) / LAMPORTS_PER_SOL)}
              <img src={`/img/assets/Aggregator/Tooltip.svg`} alt={'tooltip'} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export const LoadingDiv = (): ReactElement => <div className="loadingNFT" />
