import { Button } from 'antd'
import { FC, useMemo } from 'react'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../../constants'
import { useNFTCollections } from '../../../../context/nft_collections'
import { useNFTDetails } from '../../../../context/nft_details'
import { checkMobile } from '../../../../utils'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { AppraisalValue } from '../../../../utils/GenericDegsin'

const REVIEW_MODAL = styled.div`
  ${tw``}
`
export const ReviewBidModal: FC<{
  curBid: number
  updateBidValue: any
  handleSetCurBid: any
  selectedBtn: number
  setReviewClicked: any
}> = ({ curBid, updateBidValue, handleSetCurBid, selectedBtn, setReviewClicked }) => {
  const { singleCollection } = useNFTCollections()
  const { general, ask, bids } = useNFTDetails()
  const buyerPrice = parseFloat(ask?.buyer_price ? ask?.buyer_price : '0') / LAMPORTS_PER_SOL_NUMBER
  const highestBid: number = useMemo(
    () =>
      bids.length > 0 ? Math.max(...bids.map((b) => parseFloat(b.buyer_price) / LAMPORTS_PER_SOL_NUMBER)) : 0,
    [bids]
  )

  return (
    <REVIEW_MODAL>
      {checkMobile() && <img className="nftImgBid" src={general.image_url} alt="" />}
      <div tw="flex flex-col sm:mt-[-135px] sm:items-start items-center">
        <div className="buyTitle">
          You are about to bid for:
          <br />
          <strong>{'#' + general?.nft_name.split('#')[1]} </strong> {checkMobile() ? <br /> : 'by'}
          <strong>{general?.collection_name}</strong>
        </div>
        <div className="verifiedText">
          {singleCollection && singleCollection[0]?.is_verified && (
            <div>
              {!checkMobile() && (
                <img className="verifiedImg" src={`/img/assets/Aggregator/verifiedNFT.svg`} alt="" />
              )}
              This is a verified {checkMobile() && <br />} Creator
              {checkMobile() && (
                <img className="verifiedImg" src={`/img/assets/Aggregator/verifiedNFT.svg`} alt="" />
              )}
            </div>
          )}
        </div>
      </div>
      <div className="vContainer" tw="flex">
        {!checkMobile() && <img className="nftImgBid" src={general?.image_url} alt="" />}
        <div tw="flex flex-col">
          <div className="currentBid">Current Bid</div>
          <div className="priceNumber" tw="ml-4 mt-2 flex items-center">
            {highestBid}
            <img src={`/img/crypto/SOL.svg`} />
          </div>
        </div>
      </div>

      <div tw="mt-[30px]">
        <AppraisalValue
          text={general?.gfx_appraisal_value ? `${general.gfx_appraisal_value} SOL` : null}
          label={general?.gfx_appraisal_value ? 'Appraisal Value' : 'Appraisal Not Supported'}
          width={360}
        />
      </div>
      <div className="vContainer">
        <div className="maxBid" tw="!mt-8 sm:mt-[20px]">
          Enter Maximum Bid
        </div>
      </div>
      <div className="vContainer">
        <input
          className="enterBid"
          placeholder="0.0"
          type="number"
          value={curBid >= 0 ? curBid : undefined}
          onChange={(e) => updateBidValue(e)}
        />
        <img src="/img/crypto/SOL.svg" tw="w-8 h-8 mt-3 ml-[-30px] sm:mt-0 " />
      </div>
      <div className="vContainer" tw="mt-[55px] sm:mt-[30px] flex items-center !justify-between">
        <div
          className={selectedBtn === 0 ? 'bidButtonSelected' : 'bidButton'}
          onClick={() => handleSetCurBid(buyerPrice + 10, 0)}
        >
          {buyerPrice + 10}
        </div>
        <div
          className={selectedBtn === 1 ? 'bidButtonSelected' : 'bidButton'}
          onClick={() => handleSetCurBid(buyerPrice + 20, 1)}
        >
          {buyerPrice + 20}
        </div>
        {!checkMobile() && (
          <div
            className={selectedBtn === 2 ? 'bidButtonSelected' : 'bidButton'}
            onClick={() => handleSetCurBid(buyerPrice + 30, 2)}
          >
            {buyerPrice + 30}
          </div>
        )}
      </div>

      <div className="buyBtnContainer" tw="!mt-10">
        <Button className="buyButton" disabled={curBid <= 0} onClick={() => setReviewClicked(true)}>
          Review Offer
        </Button>
      </div>
    </REVIEW_MODAL>
  )
}
