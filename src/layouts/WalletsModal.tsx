import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletName, WalletReadyState } from '@solana/wallet-adapter-base'
import { initializeWhenDetected } from '@solflare-wallet/metamask-wallet-standard'
import { TermsOfService } from './TermsOfService'
import { USER_CONFIG_CACHE } from '../types/app_params'
import { useWalletModal } from '../context'
import {
  cn,
  Button,
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogBody,
  DialogCloseDefault,
  DialogHeader
} from 'gfx-component-lib'

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
      if (walletName === 'WalletConnect') setVisible(false)
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
    <Dialog onOpenChange={setVisible} open={visible}>
      <DialogOverlay />
      <DialogContent className={'flex flex-col gap-0 max-h-[500px]'}>
        <DialogHeader
          className={`p-2.5 text-center items-start justify-start flex border-b-1 border-solid
        dark:border-border-darkmode-secondary border-border-lightmode-secondary`}
        >
          <h3 className={'text-h3 text-text-lightmode-primary dark:text-text-darkmode-primary'}>Select Wallet</h3>
          <DialogCloseDefault className={'top-0 ring-0 focus-visible:ring-offset-0 focus-visible:ring-0'} />
        </DialogHeader>
        <DialogBody className={'flex-col pt-5 px-2 overflow-scroll'}>
          {detectedWallets.map((wallet, index) => (
            <Button
              key={index}
              isLoading={connecting && wallet.adapter.name === selectedWallet}
              onClick={() => handleWalletClick(wallet.adapter.name)}
              className={cn(
                `flex items-center !h-[46px] !px-0 rounded-[100px] flex dark:bg-black-1 bg-white 
                  border-1 cursor-pointer mb-3.75 dark:border-grey-1 border-grey-2 w-full`,
                connecting && wallet.adapter.name === selectedWallet ? 'justify-center' : 'justify-between'
              )}
            >
              <div className="flex items-center">
                <img
                  src={wallet.adapter.icon}
                  alt="wallet-icon"
                  height={'30px'}
                  width={'30px'}
                  className="mr-2.5 ml-2 rounded-half"
                />
                <h6 className={'text-regular dark:text-grey-6 text-black-4'}>
                  {wallet.adapter.name.replace('(Extension)', '')}
                </h6>
              </div>
              <div className="text-green-1 pr-5">Detected</div>
            </Button>
          ))}

          {undetectedWallets
            .filter(
              ({ readyState }) =>
                readyState !== WalletReadyState.Unsupported && readyState !== WalletReadyState.Installed
            )
            .map((wallet, index) => (
              <Button
                key={index}
                isLoading={connecting && wallet.adapter.name === selectedWallet}
                onClick={() => handleWalletClick(wallet.adapter.name)}
                className={cn(
                  `flex items-center !h-[46px] !px-0 rounded-[100px] flex dark:bg-black-1 bg-white 
                  border-1 cursor-pointer mb-3.75 dark:border-grey-1 border-grey-2 w-full`,
                  connecting && wallet.adapter.name === selectedWallet ? 'justify-center' : 'justify-between'
                )}
              >
                <div className="flex items-center">
                  <img
                    src={wallet.adapter.icon}
                    alt="wallet-icon"
                    height={'30px'}
                    width={'30px'}
                    className="mr-2.5 ml-2 rounded-half !h-[30px]"
                  />
                  <h6 className={'text-regular dark:text-grey-6 text-black-4'}>
                    {wallet.adapter.name.replace('(Extension)', '')}
                  </h6>
                </div>
              </Button>
            ))}
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}
