import { FC } from 'react'
import { useNFTDetails } from '../../../context'
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'
import { checkMobile } from '../../../utils'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'

//#region styles
const LEFT_SECTION = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: ${theme.text1};
    position: relative;
    margin-top: 30px;

    .close-icon-holder {
      ${tw`h-[30px] w-[30px] absolute flex items-center cursor-pointer rounded-[50%]`}
      background: #131313;
      justify-content: center;
      top: 12px;
      right: 12px;
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
  const { general, nftMetadata } = useNFTDetails()

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

      <img className="ls-image" height={'100%'} src={general?.image_url || nftMetadata?.image} alt="the-nft" />
    </LEFT_SECTION>
  ) : (
    <SkeletonCommon width="100%" height={checkMobile() ? '360px' : '500px'} borderRadius="10px" />
  )
}
