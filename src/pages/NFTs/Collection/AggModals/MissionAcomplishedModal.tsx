import React, { FC, ReactElement, useEffect } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { useNFTAggregator, useNFTDetails } from '../../../../context'

import { useWallet } from '@solana/wallet-adapter-react'
import { useHistory } from 'react-router-dom'
import { formatSOLDisplay } from '../../../../utils'
import Lottie from 'lottie-react'
import confettiAnimation from '../../../../animations/confettiAnimation.json'
import { useNFTAMMContext } from '../../../../context/nft_amm'
import { Button } from '../../../../components/Button'
import { NFTCardView } from '../CollectionSweeper'

const MISSION_WRAPPER = styled.div`
  ${tw`flex flex-col items-center mt-4 h-[620px] sm:h-[520px]`}
  .proudOwner {
    ${tw`mt-2 text-[16px] font-semibold`}
    color: ${({ theme }) => theme.text28};
  }
  .confettiAnimation {
    top: 0px;
    z-index: 3;
    pointer-events: none;
    ${tw`h-[115%] absolute w-[100%] top-0`}
  }
  .missionAccomplished {
    color: ${({ theme }) => theme.text7};
    ${tw`text-[35px] font-semibold sm:text-[22px] sm:flex-col`}
  }
  .nftImage {
    ${tw`w-[254px] sm:w-[154px] sm:h-[154px] flex items-center justify-center 
    h-[254px] mt-[62px] sm:mt-14 rounded-[15px]`};
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    img {
      ${tw`w-[250px] h-[250px] sm:w-[150px] sm:h-[150px]  rounded-[15px]`};
    }
  }
  .shareWithFriends {
    color: ${({ theme }) => theme.text28};
    ${tw`text-[20px] font-semibold mt-[61px]`}
  }
  .nftDetails {
    ${tw`text-[25px] sm:text-[18px] text-center	 font-medium mt-4`}
    strong {
      color: ${({ theme }) => theme.text30};
      ${tw`font-semibold sm:text-[18px] ml-1.5 mr-1.5`}
    }
  }
  .ant-btn {
    ${tw`border-none h-[56px] w-[520px] text-[15px] sm:h-[45px] sm:w-[334px] text-white rounded-[50px]
     mt-[100px] bg-blue-1  font-semibold`}
    &.hover {
      ${tw`text-white`}
    }
  }
`
const MissionAccomplishedModal: FC<{ price: string; displayStr?: string; subTextStr?: string }> = ({
  price,
  displayStr,
  subTextStr
}): ReactElement => {
  const { selectedNFT } = useNFTAMMContext()
  const { general } = useNFTDetails()
  const nftName = selectedNFT?.nft_name.split('#')[0] ?? general?.nft_name.split('#')[0]
  const { publicKey } = useWallet()
  const { setBuyNow } = useNFTAggregator()
  const history = useHistory()
  useEffect(() => {
    setTimeout(() => {
      setBuyNow(false)
    }, 10000)
  }, [])

  return (
    <MISSION_WRAPPER>
      <Lottie animationData={confettiAnimation} className="confettiAnimation" />
      <div className="missionAccomplished">Mission accomplished!</div>

      <div className="proudOwner">{displayStr ?? `You are a proud owner of:`}</div>
      <div className="proudOwner">
        <span>{displayStr ? selectedNFT?.nft_name : general?.nft_name}</span>
        <span tw="ml-1">by</span>
        <span tw="ml-1">{general?.collection_name ?? nftName}</span>
      </div>

      {displayStr ? (
        <NFTCardView nft={selectedNFT} hidePrice={true} />
      ) : (
        <div className="nftImage">
          <img src={general?.image_url ?? selectedNFT?.image_url} />
        </div>
      )}
      <div tw="mt-4 flex items-center font-semibold">
        <div className="proudOwner" tw="!text-[25px] sm:!text-lg">
          {subTextStr ?? `You Received`}
        </div>
      </div>
      <div tw="mt-4 flex items-center font-semibold">
        <div className="proudOwner" tw="!text-[25px] sm:!text-lg">
          Price:
        </div>

        <div className={'proudOwner'} tw="flex items-center !text-[25px] sm:!text-lg ml-2">
          <div>{formatSOLDisplay(price)}</div>{' '}
          <img tw="h-[25px] w-[25px] sm:h-5 sm:w-5 ml-2" src={`/img/crypto/SOL.svg`} />
        </div>
      </div>

      {/* <div className="shareWithFriends">Share it with your friends!</div> */}
      <div className="shareMediaIcons"></div>

      <Button cssStyle={tw`bg-blue-1 w-[calc(100% - 48px)] absolute h-10 bottom-6 font-semibold sm:bottom-4`}>
        <a tw="text-white font-semibold" onClick={() => history.push(`/nfts/profile/${publicKey?.toString()}`)}>
          Go to my collection
        </a>
      </Button>
    </MISSION_WRAPPER>
  )
}

export default MissionAccomplishedModal
