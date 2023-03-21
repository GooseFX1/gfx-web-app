import React, { FC, useCallback, useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletName, WalletReadyState } from '@solana/wallet-adapter-base'
import { TermsOfService } from './TermsOfService'
import { USER_CONFIG_CACHE } from '../types/app_params'
import { useWalletModal } from '../context'
import { SpaceBetweenDiv } from '../styles'
import { PopupCustom } from '../pages/NFTs/Popup/PopupCustom'
import Slider from 'react-slick'

import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { checkMobile } from '../utils'

const NAME = styled.div`
  ${tw`text-[14px] sm:text-[12px]
   font-semibold text-center m-auto flex justify-center  mt-5 items-center `}
  @media(max-width:500px) {
    ${tw`mt-[15px] text-[12px]`}
  }
`
const DETECTED_NAME = styled.div`
  ${tw`text-[15px] font-semibold text-center m-auto flex justify-center mt-5 items-center`}
`

const WALLET_MODAL = styled.div`
  ${tw`mr-[15px] h-[135px] sm:h-[100px] rounded-[10px] cursor-pointer`}
  background-color:${({ theme }) => theme.timePanelBackground};
  width: 115px !important;
  @media (max-width: 500px) {
    width: 80px !important;
  }
  &:hover {
    background-color: ${({ theme }) => theme.secondary2};
    ${tw`text-white`}
  }
  img {
    ${tw`h-[35px] w-[35px] sm:w-[25px] rounded-full sm:h-[25px] m-auto mt-5 sm:mt-[18px]`}
  }
`
const WALLET_DETECTED = styled(SpaceBetweenDiv)`
  ${tw`mr-[15px] h-[170px] rounded-[10px] flex flex-col border-2 cursor-pointer bg-white dark:bg-black-1 `}
  background-color: ${({ theme }) => theme.timePanelBackground};
  width: 150px !important;
  border: 1px solid #636363;
  &:hover {
    border: 1px solid ${({ theme }) => theme.text30};
  }
  img {
    ${tw`h-[56px] w-[56px] m-auto mt-6 rounded-full`}
  }
`
const STYLED_POPUP = styled(PopupCustom)`
  color: ${({ theme }) => theme.text11};
  ${tw`dark:text-[pink] text-[10px]`}
  .ant-modal-body {
    ${tw`py-6 px-0 pr-1`}
  }
  &.ant-modal {
    ${tw`dark:text-[20px]   text-[10px]`}
    background-color: ${({ theme }) => theme.walletModalWallet};
  }
  .otherWallet {
    ${tw`text-[15px] pl-4  font-semibold mb-2 text-[#636363] dark:text-[#b5b5b5]`}
    color: ${({ theme }) => theme.text28};
    .slick-list {
      border: 1px solid !important;
    }
    .slick-track {
      border: 1px solid;
    }
  }
  .slick-prev,
  .slick-next {
    ${tw`w-[50px] h-[50px] mr-8`}
    z-index: 200;
    &.slick-disabled {
      opacity: 0;
    }
  }
  .slick-prev {
    transform: rotate(180deg);
    ${tw`mt-[-32px] ml-8`}
  }

  .ant-modal-close-x {
    height: 20px !important;
    width: 20px !important;
    ${tw`w-5 `}
  }
  .titleContainer {
    ${tw`flex items-center text-[25px] text-center sm:text-[20px] justify-center font-semibold leading-7`}
  }
  .detectedWallet {
    ${tw`mt-[36px] h-[230px] ml-4 `}
    .slick-track {
      ${tw`flex justify-center  h-[230px] sm:pl-[50px] `}
    }
  }

  .detected {
    ${tw`text-[15px] font-semibold ml-[-20px] mt-2 justify-center flex`}
    color: ${({ theme }) => theme.text29};
  }
  .suggestWallet {
    ${tw`font-semibold sm:absolute sm:ml-4 
     sm:text-[12px] text-[14px] mt-8 flex items-center text-[#636363] justify-center`}
    u {
      color: ${({ theme }) => theme.text30};
    }
  }
  .stepsContainer {
    ${tw`text-center absolute sm:ml-4 text-[#636363] font-semibold text-[15px]`}
    strong {
      color: ${({ theme }) => theme.text30};
    }
  }
  .textDetected {
    ${tw`ml-[38px] mt-[40px] text-[15px] font-semibold `}
    color: ${({ theme }) => theme.text31};
  }
  .termsConditions {
    ${tw`mt-4 text-center text-[#636363] font-medium text-[12px]`}
    u {
      ${tw`font-semibold`}
      color: ${({ theme }) => theme.text30};
    }
  }
`

const settings = {
  infinite: false,
  speed: 500,
  swipeToSlide: true,
  snapCenter: true,
  initialSlide: 0,
  slidesToScroll: 2,
  arrows: checkMobile() ? false : true,
  variableWidth: false,
  nextArrow: <img src={`/img/assets/home-slider-next.svg`} alt="banner-next" />,
  prevArrow: <img src={`/img/assets/home-slider-next.svg`} alt="banner-previous" />
}
export const WalletsModal: FC = () => {
  const { wallets, select } = useWallet()
  const { setVisible, visible } = useWalletModal()
  const [termsOfServiceVisible, setTermsOfServiceVisible] = useState<boolean>(false)
  const existingUserCache: USER_CONFIG_CACHE = JSON.parse(window.localStorage.getItem('gfx-user-cache'))

  useEffect(() => {
    if (visible && !termsOfServiceVisible && !existingUserCache.hasSignedTC) {
      setVisible(false)
      setTermsOfServiceVisible(true)
    }
  }, [visible])

  const handleCancel = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!event.defaultPrevented) setVisible(false)
    },
    [setVisible]
  )

  const handleWalletClick = useCallback(
    (event: React.MouseEvent<HTMLElement>, walletName: WalletName<string>) => {
      select(walletName)
      handleCancel(event)
    },
    [select, handleCancel]
  )

  const detectedWallets = wallets.filter(({ readyState }) => readyState === WalletReadyState.Installed)

  return !existingUserCache.hasSignedTC && termsOfServiceVisible ? (
    <TermsOfService setVisible={setTermsOfServiceVisible} visible={termsOfServiceVisible} />
  ) : (
    <STYLED_POPUP
      width={'500px'}
      height={'630px'}
      visible={visible}
      title={null}
      footer={null}
      onCancel={() => setVisible(false)}
    >
      {checkMobile() ? (
        <>
          <div className="stepsContainer">
            <strong>Step 1</strong> of 2
          </div>
          <div className="titleContainer" tw="mt-[15px]">
            Connect to {checkMobile() && <br />} a wallet
          </div>
        </>
      ) : (
        <>
          <div className="titleContainer">Connect to {checkMobile() && <br />} a wallet</div>
          <div className="termsConditions">
            By connecting a wallet, you agree to Goose Labs, Inc, <br />
            <u>Terms of Service</u> and acknowledge that you have read <br />
            and understand the <u>GooseFX protocol disclaimer.</u>
          </div>
        </>
      )}
      <div>
        <div className="detectedWallet">
          <Slider {...settings} slidesToShow={checkMobile() ? 2.1 : 3} slidesToScroll={1}>
            {detectedWallets.length ? (
              detectedWallets.map((wallet, index) => (
                <WALLET_DETECTED key={index} onClick={(event) => handleWalletClick(event, wallet.adapter.name)}>
                  <img src={wallet.adapter.icon} alt="icon" />
                  <DETECTED_NAME>
                    {wallet.adapter.name.replace('(Extension)', '')} <br /> Wallet
                  </DETECTED_NAME>
                  <div className="textDetected">Detected</div>
                </WALLET_DETECTED>
              ))
            ) : (
              <NAME tw="text-[25px] mt-14">No wallets detected</NAME>
            )}
          </Slider>
        </div>
      </div>

      <div className="otherWallet">Other wallet</div>
      <div tw="ml-4">
        <Slider {...settings} slidesToShow={checkMobile() ? 3.5 : 4}>
          {wallets
            .filter(
              ({ readyState }) =>
                readyState !== WalletReadyState.Unsupported && readyState !== WalletReadyState.Installed
            )
            .map((wallet, index) => (
              <WALLET_MODAL key={index} onClick={(event) => handleWalletClick(event, wallet.adapter.name)}>
                <img src={wallet.adapter.icon} alt="icon" />
                <NAME>
                  {wallet.adapter.name.replace('(Extension)', '')} <br /> Wallet
                </NAME>
              </WALLET_MODAL>
            ))}
        </Slider>
      </div>

      <div className="suggestWallet">
        <pre>
          Can’t find your wallet? {checkMobile() && <br />} <u>Suggest new wallet</u>
        </pre>
      </div>
    </STYLED_POPUP>
  )
}
