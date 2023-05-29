/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, ReactElement, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { IAttributesTabItemData } from '../../../types/nft_details'
import tw from 'twin.macro'
import 'styled-components/macro'
import { useDarkMode, useNFTDetails, usePriceFeedFarm } from '../../../context'
import { truncateAddress, parseUnixTimestamp, formatSOLNumber } from '../../../utils'
import { PriceWithToken } from '../../../components/common/PriceWithToken'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../constants'
import { Tag } from '../../../components/Tag'
import { truncateBigNumber } from '../../TradeV3/perps/utils'

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

const TRIM_LEN = 16
const trimString = (str: string) => (str.length > TRIM_LEN ? str.substring(0, TRIM_LEN) + '...' : str)

export const AttributesTabContent: FC<{ data: IAttributesTabItemData[] }> = ({ data, ...rest }) => {
  const { mode } = useDarkMode()
  return data.length > 0 ? (
    <ATTRIBUTES_TAB_CONTENT {...rest}>
      {data.map((item, index) => (
        <PILL_SECONDARY $mode={`${mode}`} key={index}>
          <div className="layer">
            <div tw="text-[15px] mt-1 font-semibold dark:text-grey-2 text-grey-1">
              {trimString(item.trait_type)}
            </div>
            <div tw="text-[15px] font-semibold dark:text-grey-5 text-black-4 truncate">
              {trimString(item.value)}
            </div>
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
  const hostURL = useMemo(() => window.location.origin, [window.location.origin])
  const profileLink = hostURL + `/nfts/profile/`

  return (
    <div tw="flex-col">
      {bids.length > 0 &&
        bids.map((bid) => (
          <div tw="flex items-center justify-between mt-1 dark:text-grey-5 text-grey-1" key={bid.clock}>
            <div tw="ml-6">
              Bid by{' '}
              <a
                href={profileLink + `${bid.wallet_key}`}
                target="_blank"
                rel="noreferrer"
                tw="underline"
                className="bidBy"
              >
                {truncateAddress(bid.wallet_key)}{' '}
              </a>
              <div>{parseUnixTimestamp(bid.clock)}</div>
            </div>
            <div tw="mr-6">
              <PriceWithToken
                token="SOL"
                cssStyle={tw`h-[18px] w-[18px] ml-auto`}
                price={truncateBigNumber(formatSOLNumber(bid.buyer_price))}
              />
              <div>
                {truncateBigNumber((parseFloat(bid.buyer_price) / LAMPORTS_PER_SOL_NUMBER) * solPrice)} USDC
              </div>
            </div>
          </div>
        ))}

      {ask && (
        <div tw="flex items-center justify-between px-[12px] py-2 dark:text-grey-5 text-grey-1 font-medium text-[15px]">
          <div tw="flex ">
            {/* <a href={`https://solscan.io/tx/${ask.tx_sig}`} target="_blank" rel="noreferrer">
              <img tw="h-10 w-10 cursor-pointer" src={`/img/assets/solscanBlack.svg`} />
            </a> */}
            <div tw="ml-3 !font-medium">
              Listed by{' '}
              <a
                href={profileLink + `${ask.wallet_key}`}
                target="_blank"
                rel="noreferrer"
                tw="underline"
                className="bidBy"
              >
                {truncateAddress(ask.wallet_key)}{' '}
              </a>
              <div>{parseUnixTimestamp(ask.clock)}</div>
            </div>
          </div>
          <div tw="mr-2">
            <PriceWithToken
              token="SOL"
              cssStyle={tw`h-[18px] w-[18px] ml-auto`}
              price={truncateBigNumber(formatSOLNumber(ask.buyer_price))}
            />
            <div>{truncateBigNumber((parseFloat(ask.buyer_price) / LAMPORTS_PER_SOL_NUMBER) * solPrice)} USDC</div>
          </div>
        </div>
      )}
    </div>
  )
}

const PILL_SECONDARY = styled.div<{ $mode: string }>`
  ${tw`rounded-[5.5px] h-[48px] p-[1.5px] flex items-center justify-center text-[#fff] w-full`}
  background: ${({ $mode }) =>
    $mode === 'dark'
      ? 'linear-gradient(96.79deg, rgba(247, 147, 26, 0.92) 4.25%, rgba(172, 28, 199, 0.8) 97.61%)'
      : `linear-gradient(96.79deg, rgba(247, 147, 26, 0.93) 4.25%, rgba(172, 28, 199, 0.8) 97.61%);`};

  .layer {
    ${tw`h-full flex flex-col font-semibold text-[15px]  items-start pl-2  w-full leading-[18px]
       dark:bg-[#101010b3] bg-[#fef3f3c2] rounded-[4.5px]`}
  }
`
