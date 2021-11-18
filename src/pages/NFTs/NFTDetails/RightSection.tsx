import { Col, Row } from 'antd'
import { FC } from 'react'
import styled, { css } from 'styled-components'
import { moneyFormatter } from '../../../utils'
import { RightSectionTabs } from './RightSectionTabs'
import { useNFTDetails } from '../../../context'
import { NFTDEtailsProviderMode } from '../../../types/nft_details'

const RIGHT_SECTION = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: ${theme.text1};
    text-align: left;

    .rs-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: ${theme.margins['1x']};
    }

    .rs-type {
      font-size: 14px;
      font-weight: 600;
    }

    .rs-prices {
      margin-bottom: ${theme.margins['1x']};

      .rs-solana-logo {
        width: 43px;
        height: 43px;
      }

      .rs-price {
        font-size: 25px;
        font-weight: bold;
      }

      .rs-fiat {
        font-size: 14px;
        font-weight: 500;
      }

      .rs-percent {
        font-size: 11px;
        font-weight: 600;
        margin-left: ${theme.margins['0.5x']};
      }
    }

    .rs-name {
      font-size: 22px;
      font-weight: 600;
      margin-bottom: ${theme.margins['0.5x']};
    }

    .rs-intro {
      font-size: 12px;
      font-weight: 500;
      max-width: 254px;
      margin-bottom: ${theme.margins['1.5x']};
    }

    .rs-charity-text {
      font-size: 12px;
      font-weight: 600;
      max-width: 64px;
      margin-left: ${theme.margins['1.5x']};
    }
  `}
`

const GRID_INFO = styled(Row)`
  ${({ theme }) => css`
  width: 100%;
  max-width: 384px;
  margin-bottom: ${theme.margins['3x']};

  .gi-item {
    .gi-item-category-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: ${theme.margins['1x']};
    }

    .gi-item-thumbnail-wrapper {
      position: relative;

      .gi-item-check-icon {
        position: absolute;
        right: 4px;
        bottom: -3px;
        width: 15px;
        height: 15px;
      }
    }

    .gi-item-thumbnail {
      width: 30px;
      height: 30px;
      margin-right: ${theme.margins['1x']};
    }

    .gi-item-title {
      font-size: 14px;
      font-weight: 500;
    }
  `}
`

export const RightSection: FC<{ mode: NFTDEtailsProviderMode; handleClickPrimaryButton: () => void }> = ({
  mode,
  handleClickPrimaryButton,
  ...rest
}) => {
  const { general } = useNFTDetails()
  const { name, price, creator, collection, category, fiat, percent, intro, isForCharity } = general

  return (
    <RIGHT_SECTION {...rest}>
      <Row justify="space-between">
        <Col className="rs-title">Current Bid:</Col>
        {general?.type && <Col className="rs-type">{general.type}</Col>}
      </Row>
      <Row align="middle" gutter={8} className="rs-prices">
        <Col>
          <img className="rs-solana-logo" src={`${process.env.PUBLIC_URL}/img/assets/solana-logo.png`} alt="" />
        </Col>
        <Col className="rs-price">{`${moneyFormatter(price)} SOL`}</Col>
        <Col className="rs-fiat">{`(${fiat})`}</Col>
        <Col>
          <Row>
            <img src={`${process.env.PUBLIC_URL}/img/assets/increase-arrow.svg`} alt="" />
            <div className="rs-percent">{percent}</div>
          </Row>
        </Col>
      </Row>
      <Row justify="space-between" align="middle">
        <Col>
          <div className="rs-name">{name}</div>
          <div className="rs-intro">{intro}</div>
        </Col>
        {isForCharity && (
          <Row align="middle">
            <img src={`${process.env.PUBLIC_URL}/img/assets/heart-charity.svg`} alt="" />
            <div className="rs-charity-text">Auction for charity</div>
          </Row>
        )}
      </Row>
      <GRID_INFO justify="space-between">
        <Col className="gi-item">
          <div className="gi-item-category-title">Creator</div>
          <Row align="middle">
            <div className="gi-item-thumbnail-wrapper">
              <img className="gi-item-thumbnail" src={creator?.thumbnail} alt="" />
              <img className="gi-item-check-icon" src={`${process.env.PUBLIC_URL}/img/assets/check-icon.png`} alt="" />
            </div>
            <div className="gi-item-title">{creator?.title}</div>
          </Row>
        </Col>
        <Col className="gi-item">
          <div className="gi-item-category-title">Collection</div>
          <Row align="middle">
            <img className="gi-item-thumbnail" src={collection?.thumbnail} alt="" />
            <div className="gi-item-title">{collection?.title}</div>
          </Row>
        </Col>
        <Col className="gi-item">
          <div className="gi-item-category-title">Category</div>
          <Row align="middle">
            <img className="gi-item-thumbnail" src={category?.thumbnail} alt="" />
            <div className="gi-item-title">{category?.title}</div>
          </Row>
        </Col>
      </GRID_INFO>
      <RightSectionTabs mode={mode} handleClickPrimaryButton={handleClickPrimaryButton} />
    </RIGHT_SECTION>
  )
}
