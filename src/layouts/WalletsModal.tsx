import React, { FC, useCallback, useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletName, WalletReadyState } from '@solana/wallet-adapter-base'
import { TermsOfService } from './TermsOfService'
import { USER_CONFIG_CACHE } from '../types/app_params'
import { useWalletModal } from '../context'
import { SpaceBetweenDiv } from '../styles'
import { PopupCustom } from '../pages/NFTs/Popup/PopupCustom'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'

const NAME = styled.div`
  ${tw`text-[14px] font-semibold text-center m-auto flex justify-center mt-5 items-center sm:mt-3.75 sm:text-[12px]`}
`
const DETECTED_NAME = styled.div`
  ${tw`text-regular font-semibold`}
`

const WALLET_DETECTED = styled(SpaceBetweenDiv)`
  ${tw`h-[46px] rounded-[100px] flex border-2 cursor-pointer mb-3.75`}
  background-color: ${({ theme }) => theme.timePanelBackground};
  border: 1px solid #636363;
  &:hover {
    border: 1px solid ${({ theme }) => theme.text30};
  }
`
const STYLED_POPUP = styled(PopupCustom)`
  ${tw`dark:text-grey-5 text-grey-1 text-smallest`}
  .ant-modal-body {
    ${tw`py-6 px-0 pr-1`}
  }
  &.ant-modal {
    ${tw`text-smallest dark:bg-black-2 bg-grey-5`}
  }
  .ant-modal-content {
    ${tw`h-full overflow-y-scroll`}
    ::-webkit-scrollbar {
      display: none;
    }
  }
  .show-more {
    ${tw`text-average pl-4 font-semibold underline mt-3.75 text-center 
      cursor-pointer dark:text-white text-blue-1 pb-3.75`}
  }
  .ant-modal-close-x {
    ${tw`!w-5 !h-5 `}
  }
  .titleContainer {
    ${tw`flex items-center text-lg text-center justify-center font-semibold leading-7 dark:text-grey-5 text-black-4`}
  }
  .wallets-container {
    ${tw`mt-[22px]`}
  }
  .wallets-holder {
    ${tw`my-0 mx-3.75`}
  }
  .wallet-border {
    border-bottom: 1px solid ${({ theme }) => theme.tokenBorder};
  }
  .detected {
    ${tw`text-regular font-semibold ml-[-20px] mt-2 justify-center flex dark:text-grey-2 text-purple-1`}
  }
  .textDetected {
    ${tw`mr-3.75 text-tiny font-semibold text-green-3`}
  }
`

export const WalletsModal: FC = () => {
  const { wallets, select } = useWallet()
  const { setVisible, visible } = useWalletModal()
  const [termsOfServiceVisible, setTermsOfServiceVisible] = useState<boolean>(false)
  const [isShowMore, setIsShowMore] = useState<boolean>(false)
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
      width={'354px'}
      height={'396px'}
      visible={visible}
      title={null}
      footer={null}
      onCancel={() => setVisible(false)}
    >
      <div>
        <div className="titleContainer">Choose a wallet</div>
        <div className="wallets-container">
          <div className="wallets-holder wallet-border">
            {detectedWallets.length ? (
              detectedWallets.map((wallet, index) => (
                <WALLET_DETECTED key={index} onClick={(event) => handleWalletClick(event, wallet.adapter.name)}>
                  <div tw="flex items-center">
                    <img
                      src={wallet.adapter.icon}
                      alt="wallet-icon"
                      height={'30px'}
                      width={'30px'}
                      tw="mr-2.5 ml-2 rounded-half"
                    />
                    <DETECTED_NAME>{wallet.adapter.name.replace('(Extension)', '')}</DETECTED_NAME>
                  </div>
                  <div className="textDetected">Detected</div>
                </WALLET_DETECTED>
              ))
            ) : (
              <NAME tw="text-lg mt-14">No wallets detected</NAME>
            )}
          </div>
        </div>
      </div>
      {!isShowMore && (
        <div
          className="show-more"
          onClick={() => {
            setIsShowMore(true)
          }}
        >
          Show more
        </div>
      )}
      {isShowMore && (
        <div className="wallets-container">
          <div className="wallets-holder">
            {wallets
              .filter(
                ({ readyState }) =>
                  readyState !== WalletReadyState.Unsupported && readyState !== WalletReadyState.Installed
              )
              .map((wallet, index) => (
                <WALLET_DETECTED key={index} onClick={(event) => handleWalletClick(event, wallet.adapter.name)}>
                  <div tw="flex items-center">
                    <img
                      src={wallet.adapter.icon}
                      alt="wallet-icon"
                      height={'30px'}
                      width={'30px'}
                      tw="mr-2.5 ml-2 rounded-half"
                    />
                    <DETECTED_NAME>{wallet.adapter.name.replace('(Extension)', '')}</DETECTED_NAME>
                  </div>
                </WALLET_DETECTED>
              ))}
            <div
              className="show-more"
              onClick={() => {
                setIsShowMore(false)
              }}
            >
              Show less
            </div>
          </div>
        </div>
      )}
    </STYLED_POPUP>
  )
}
