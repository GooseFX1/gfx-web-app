import { FC } from 'react'
import styled, { css } from 'styled-components'
import { useNFTDetails } from '../../../context'
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'

const LEFT_SECTION = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: ${theme.text1};

    .ls-image {
      border-radius: 20px;
      box-shadow: 3px 3px 14px 0px rgb(0 0 0 / 43%);
    }

    .ls-bottom-panel {
      margin-top: ${theme.margin(2.5)};

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
      }

      .ls-favorite-number-highlight {
        color: ${theme.text1};
      }

      .ls-action-button {
        color: ${theme.text1};
      }
    }
  `}
`

export const NestQuestLeftSection: FC = ({ ...rest }) => {
  const { general, nftMetadata, totalLikes, ask } = useNFTDetails()

  return general && nftMetadata ? (
    <LEFT_SECTION {...rest}>
      <img className="ls-image" src={'https://gfxnestquest.s3.ap-south-1.amazonaws.com/Egg.png'} alt="NestQuest Egg" />
    </LEFT_SECTION>
  ) : (
    <SkeletonCommon width="100%" height="500px" borderRadius="10px" />
  )
}
