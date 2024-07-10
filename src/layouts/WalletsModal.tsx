import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletName, WalletReadyState } from '@solana/wallet-adapter-base'
import { initializeWhenDetected } from '@solflare-wallet/metamask-wallet-standard'
import { TermsOfService } from './TermsOfService'
import { USER_CONFIG_CACHE } from '../types/app_params'
import { useWalletModal } from '../context'
import { PopupCustom } from '../components'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { Button } from 'gfx-component-lib'

const DETECTED_NAME = styled.div`
  ${tw`text-regular font-semibold dark:text-grey-6 text-black-4`}
`

const WALLET_DETECTED = styled(Button)`
  ${tw`flex items-center !h-[46px] !px-0 rounded-[100px] flex dark:bg-black-1 bg-white 
  border-1 cursor-pointer mb-3.75 dark:border-grey-1 border-grey-2 w-full`}
  img {
    ${tw`h-[30px] w-[30px] mr-2.5 ml-2 rounded-half !bg-black-1`}
  }

  &:hover {
    border: 1px solid ${({ theme }) => theme.text30};
  }
`
const STYLED_POPUP = styled(PopupCustom)`
  ${tw`dark:text-grey-5 text-grey-1 text-smallest`}
  & & {
    background: purple !important;
  }
  .ant-modal-body {
    ${tw`py-0 h-[calc(100% - 47px)] overflow-y-scroll`}
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
  .ant-modal-header {
    ${tw`bg-transparent text-center py-2`}
    .ant-modal-title {
      ${tw`text-lg !font-semibold dark:text-white text-blue-1`}
    }
  }
  .show-more {
    ${tw`text-average font-semibold underline text-center 
      cursor-pointer dark:text-white text-blue-1`}
  }
  .ant-modal-close {
    ${tw`top-[14px] right-[14px]`}
    .ant-modal-close-x {
      ${tw`!w-5 !h-5`}
    }
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

// metamask detection
initializeWhenDetected()

export const WalletsModal: FC = () => {
  const { wallets, select, publicKey, connecting } = useWallet()
  const { setVisible, visible } = useWalletModal()
  const existingUserCache: USER_CONFIG_CACHE = JSON.parse(window.localStorage.getItem('gfx-user-cache'))
  const [termsOfServiceVisible, setTermsOfServiceVisible] = useState<boolean>(false)
  const [selectedWallet, setSelectedWallet] = useState<string>('')
  const base58PublicKey = useMemo(() => publicKey?.toBase58(), [publicKey])

  useEffect(() => {
    if (visible && !termsOfServiceVisible && !existingUserCache.hasSignedTC) {
      setVisible(false)
      setTermsOfServiceVisible(true)
    }
  }, [visible])

  useEffect(() => {
    if (base58PublicKey || !visible) setSelectedWallet('')
  }, [base58PublicKey, visible])

  // const handleCancel = useCallback(
  //   (event: React.MouseEvent<HTMLElement>) => {
  //     if (!event.defaultPrevented) setVisible(false)
  //   },
  //   [setVisible]
  //)

  const handleWalletClick = useCallback(
    (walletName: WalletName<string>) => {
      select(walletName)
      // handleCancel(event)
      setSelectedWallet(walletName)
      if(walletName === 'WalletConnect') setVisible(false)
    },
    [select]
  )

  // filters detected wallets and de-duplicates
  const detectedWallets = useMemo(
    () =>
      wallets
        .filter(({ readyState }) => readyState === WalletReadyState.Installed)
        .filter(
          (value, index, self) => self.findIndex((item) => item.adapter.name === value.adapter.name) === index
        ),
    [wallets]
  )

  const undetectedWallets = useMemo(
    () => wallets.filter(({ readyState }) => readyState !== WalletReadyState.Installed),
    [wallets]
  )

  return !existingUserCache.hasSignedTC && termsOfServiceVisible ? (
    <TermsOfService setVisible={setTermsOfServiceVisible} visible={termsOfServiceVisible} />
  ) : (
    <STYLED_POPUP
      width={'354px'}
      height={'525px'}
      visible={visible}
      title={'Select a wallet'}
      footer={null}
      onCancel={() => setVisible(false)}
    >
      <div className="wallets-container">
        {detectedWallets.map((wallet, index) => (
          <WALLET_DETECTED
            key={index}
            isLoading={connecting && wallet.adapter.name === selectedWallet}
            onClick={() => handleWalletClick(wallet.adapter.name)}
            className={connecting && wallet.adapter.name === selectedWallet ? 'justify-center' : 'justify-between'}
          >
            <div tw="flex items-center">
              <img src={wallet.adapter.icon} alt="wallet-icon" height={'30px'} width={'30px'} />
              <DETECTED_NAME>{wallet.adapter.name.replace('(Extension)', '')}</DETECTED_NAME>
            </div>
            <div className="textDetected">Detected</div>
          </WALLET_DETECTED>
        ))}

        {undetectedWallets
          .filter(
            ({ readyState }) =>
              readyState !== WalletReadyState.Unsupported && readyState !== WalletReadyState.Installed
          )
          .map((wallet, index) => (
            <WALLET_DETECTED
              key={index}
              isLoading={connecting && wallet.adapter.name === selectedWallet}
              onClick={() => handleWalletClick(wallet.adapter.name)}
              className={
                connecting && wallet.adapter.name === selectedWallet ? 'justify-center' : 'justify-between'
              }
            >
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
      </div>
    </STYLED_POPUP>
  )
}
