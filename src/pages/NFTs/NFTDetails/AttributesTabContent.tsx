/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, ReactElement } from 'react'
import styled, { css } from 'styled-components'
import { IAttributesTabItemData } from '../../../types/nft_details'
import tw from 'twin.macro'
import 'styled-components/macro'
import { useDarkMode, useNFTDetails, usePriceFeedFarm } from '../../../context'
import { truncateAddress } from '../../../utils'
import { PriceWithToken } from '../../../components/common/PriceWithToken'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../constants'

const ATTRIBUTES_TAB_CONTENT = styled.div`
  ${({ theme }) => css`
    display: grid;
    grid-template-columns: repeat(2, minmax(auto, 50%));
    grid-gap: ${theme.margin(1.5)};
    padding: ${theme.margin(2)} ${theme.margin(3)};
    height: 100%;
    color: #fff;
    overflow-y: auto;
  `}
`

const BORDER = styled.div`
  background: linear-gradient(96.79deg, #f7931a 100%, #ac1cc7 100%);
  border-radius: 10px;
  padding: 1px;
`
const ATTRIBUTES_ITEM = styled.div`
  ${tw`overflow-scroll sm:h-full`}
  height: 60px;
  background: linear-gradient(96.79deg, #f7931a 10%, #ac1cc7 97.61%);
  opacity: 0.5;
  padding: ${({ theme }) => theme.margin(1)};
  border-radius: 10px;
  overflow: hidden;
`
const trimString = (str: string) => (str.length > 20 ? str.substring(0, 20) + '...' : str)

export const AttributesTabContent: FC<{ data: IAttributesTabItemData[] }> = ({ data, ...rest }) => {
  const { mode } = useDarkMode()
  return data.length > 0 ? (
    <ATTRIBUTES_TAB_CONTENT {...rest}>
      {data.map((item, index) => (
        <PILL_SECONDARY $mode={`${mode}`} key={index}>
          <div className="layer">
            <div tw="text-[13px] font-medium dark:text-grey-2 text-grey-1">{item.trait_type} </div>
            <div tw="text-[13px] font-medium dark:text-grey-5 text-black-4">{trimString(item.value)}</div>
          </div>
        </PILL_SECONDARY>
      ))}
    </ATTRIBUTES_TAB_CONTENT>
  ) : (
    <div tw="flex justify-center">No Attributes</div>
  )
}

export const AsksAndBidsForNFT = (): ReactElement => {
  const { ask, bids } = useNFTDetails()
  if (!ask && !bids.length)
    return (
      <div className="generalItemValue">
        <div tw="flex items-center justify-center">Open Bids</div>
        No bids so far, be the first to bid for this amazing piece.
      </div>
    )
  const { prices } = usePriceFeedFarm()
  const solPrice = prices['SOL/USDC']?.current
  return (
    <div tw="flex-col">
      {bids.length > 0 &&
        bids.map((bid) => (
          <div tw="flex items-center justify-between mt-1 dark:text-grey-5 text-grey-1" key={bid.clock}>
            <div tw="ml-6">
              Bid by <span className="bidBy">{truncateAddress(bid.wallet_key)} </span>
              <div>{new Date(parseInt(bid.clock) * 1000).toString().substring(0, 16)}</div>
            </div>
            <div tw="mr-6">
              <PriceWithToken
                token="SOL"
                cssStyle={tw`h-[18px] w-[18px]`}
                price={parseFloat(bid.buyer_price) / LAMPORTS_PER_SOL_NUMBER}
              />
              <div>{((parseFloat(bid.buyer_price) / LAMPORTS_PER_SOL_NUMBER) * solPrice).toFixed(1)} USDC</div>
            </div>
          </div>
        ))}

      {ask && (
        <div tw="flex items-center justify-between px-[12px] py-2 dark:text-grey-5 text-grey-1">
          <div tw="flex ">
            {/* <a href={`https://solscan.io/tx/${ask.tx_sig}`} target="_blank" rel="noreferrer">
              <img tw="h-10 w-10 cursor-pointer" src={`/img/assets/solscanBlack.svg`} />
            </a> */}
            <div tw="ml-3">
              Ask by <span className="bidBy">{truncateAddress(ask.wallet_key)} </span>
              <div>{new Date(parseInt(ask.clock)).toString().substring(0, 16)}</div>
            </div>
          </div>
          <div tw="mr-2">
            <PriceWithToken
              token="SOL"
              cssStyle={tw`h-[18px] w-[18px]`}
              price={parseFloat(ask.buyer_price) / LAMPORTS_PER_SOL_NUMBER}
            />
            <div>{((parseFloat(ask.buyer_price) / LAMPORTS_PER_SOL_NUMBER) * solPrice).toFixed(1)} USDC</div>
          </div>
        </div>
      )}
    </div>
  )
}

const PILL_SECONDARY = styled.div<{ $mode: string }>`
  ${tw`rounded-[5px] h-[45px] p-[2px] text-[#fff] w-full`}
  background: ${({ $mode }) =>
    $mode === 'dark'
      ? 'linear-gradient(96deg, #f7931a 1%, #ac1cc7 99%)'
      : `linear-gradient(to bottom, rgba(116, 116, 116, 0.2), rgba(116, 116, 116, 0.2)), 
      linear-gradient(to right, #f7931a 1%, #e03cff 100%), linear-gradient(96deg, #f7931a 1%, #ac1cc7 99%)`};

  .layer {
    ${tw`h-full flex flex-col font-semibold text-[15px] items-start pl-2 w-full leading-[18px]
       dark:bg-[#1c1c1cb3] bg-[#ffffff57] rounded-[5px]`}
  }
`
