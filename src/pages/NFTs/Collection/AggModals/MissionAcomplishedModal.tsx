import React, { FC, ReactElement, useEffect } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { useNFTAggregator, useNFTDetails } from '../../../../context'
import { Button } from 'antd'
import { useWallet } from '@solana/wallet-adapter-react'
import { useHistory } from 'react-router-dom'
import { formatSOLDisplay } from '../../../../utils'
import Lottie from 'lottie-react'
import confettiAnimation from '../../../../animations/confettiAnimation.json'

const MISSION_WRAPPER = styled.div`
  ${tw`flex flex-col items-center mt-4`}
  .proudOwner {
    ${tw`mt-2 text-[16px] font-semibold`}
    color: ${({ theme }) => theme.text28};
  }
  .confettiAnimation {
    position: absolute;
    top: 0px;
    z-index: 3;
    pointer-events: none;
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
const MissionAccomplishedModal: FC<{ price: string }> = ({ price }): ReactElement => {
  const { general } = useNFTDetails()
  const nftName = general?.nft_name.split('#')[0]
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

      <div className="proudOwner">You are a proud owner of:</div>
      <div className="nftDetails">
        <strong>{general?.nft_name}</strong>
        by
        <strong>{general?.collection_name ? general?.collection_name : nftName}</strong>
      </div>

      <div className="nftImage">
        <img src={general?.image_url} />
      </div>
      <div tw="mt-4 flex items-center">
        <div className="priceText">Price:</div>

        <div className={'priceValue'} tw="flex items-center text-[25px] ml-2">
          <div>{formatSOLDisplay(price)}</div> <img tw="h-[25px] w-[25px] ml-2" src={`/img/crypto/SOL.svg`} />
        </div>
      </div>

      {/* <div className="shareWithFriends">Share it with your friends!</div> */}
      <div className="shareMediaIcons"></div>

      <Button tw="absolute sm:h-[45px] bottom-6 sm:bottom-4">
        <a onClick={() => history.push(`/nfts/profile/${publicKey?.toString()}`)}>Go to my collection</a>
      </Button>
    </MISSION_WRAPPER>
  )
}

export default MissionAccomplishedModal
