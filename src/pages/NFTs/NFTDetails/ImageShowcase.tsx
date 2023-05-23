import { FC, useMemo } from 'react'
import { useNFTDetails } from '../../../context'
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'
import { checkMobile, formatSOLDisplay } from '../../../utils'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../constants'
import { useWallet } from '@solana/wallet-adapter-react'
import { Tag } from '../../../components/Tag'

//#region styles
const LEFT_SECTION = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: ${theme.text1};
    position: relative;
    margin-top: 15px;

    .close-icon-holder {
      ${tw`h-[30px] w-[30px] absolute flex items-center cursor-pointer rounded-[50%] z-10`}
      background: #131313;
      justify-content: center;
      top: 12px;
      right: 12px;
    }
    .bgGradient {
      ${tw`w-[390px] sm:w-[100%] absolute h-[100%] opacity-70  rounded-[20px]`}
      background: ${({ theme }) => theme.hoverGradient};
    }
    .acceptBidBtn {
      ${tw`w-[254px] h-11 absolute ml-[68px] sm:ml-[40%] cursor-pointer text-white
       bottom-[30px] rounded-[100px] font-semibold flex items-center justify-center text-[15px] `}
      background: linear-gradient(96.79deg, #F7931A 4.25%, #AC1CC7 97.61%);
    }

    .ls-image {
      border-radius: 20px;
      object-fit: cover;
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

export const ImageShowcase: FC<{
  setShowSingleNFT?: any
  setShowAcceptBidModal?: any
  isOwner?: boolean
}> = ({ setShowSingleNFT, isOwner, setShowAcceptBidModal, ...rest }) => {
  const { general, nftMetadata, bids } = useNFTDetails()
  const wallet = useWallet()
  const publicKey = wallet.publicKey
  const isBidder = useMemo(
    () => (publicKey ? bids.filter((bid) => bid.wallet_key === publicKey.toString()) : null),
    [bids]
  )
  const highestBid: number = useMemo(
    () =>
      bids.length > 0 ? Math.max(...bids.map((b) => parseFloat(b.buyer_price) / LAMPORTS_PER_SOL_NUMBER)) : -1,
    [bids]
  )

  return general && nftMetadata ? (
    <LEFT_SECTION {...rest}>
      <div
        className="close-icon-holder"
        onClick={() => {
          setShowSingleNFT(false)
        }}
      >
        <img src="/img/assets/close-white-icon.svg" alt="" height="12px" width="12px" />
      </div>
      {highestBid > 0 && isOwner && (
        <>
          <div className="bgGradient" />
          <div className="acceptBidBtn" onClick={() => setShowAcceptBidModal(true)}>
            Accept Highest Bid {highestBid} SOL
          </div>
        </>
      )}
      {isBidder && isBidder.length > 0 && (
        <>
          <div className="bgGradient" />
          <div tw="w-[254px] h-11 absolute left-[68px] bottom-[30px]">
            <Tag loading={false} cssStyle={tw`h-11 w-[252px] text-[15px] `}>
              <div>My Bid: {formatSOLDisplay(isBidder[0].buyer_price)} SOL </div>
            </Tag>
          </div>
        </>
      )}

      <div tw="w-[390px] h-[390px] sm:w-[100%] sm:h-[360px]">
        <img
          className="ls-image"
          height={'100%'}
          width={'100%'}
          src={general?.image_url || nftMetadata?.image}
          alt="the-nft"
        />
      </div>
    </LEFT_SECTION>
  ) : (
    <SkeletonCommon width="100%" height={checkMobile() ? '360px' : '500px'} borderRadius="10px" />
  )
}
