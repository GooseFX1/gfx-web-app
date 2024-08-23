import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletName, WalletReadyState } from '@solana/wallet-adapter-base'
import { initializeWhenDetected } from '@solflare-wallet/metamask-wallet-standard'
import { TermsOfService } from './TermsOfService'
import { useConnectionConfig, useWalletModal } from '../context'
import useBreakPoint from '../hooks/useBreakPoint'
import {
  Button,
  cn,
  Dialog,
  DialogBody,
  DialogCloseDefault,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle
} from 'gfx-component-lib'
import useBoolean from '@/hooks/useBoolean'

// metamask detection
initializeWhenDetected()

export const WalletsModal: FC = () => {
  const { wallets, select, connecting, publicKey } = useWallet()

  const { setVisible, visible } = useWalletModal()
  const {userCache} = useConnectionConfig()

  const [termsOfServiceVisible, setTermsOfServiceVisible] = useState<boolean>(false)
  const [selectedWallet, setSelectedWallet] = useState<string>('')
  const base58PublicKey = useMemo(() => publicKey?.toBase58(), [publicKey])
  const breakpoint = useBreakPoint()
  const isMobile = breakpoint.isMobile || breakpoint.isTablet
  const [hasRequestedConnect, setHasRequestedConnect] = useBoolean(false)

  useEffect(() => {
    if (visible && !termsOfServiceVisible && !userCache.hasSignedTC) {
      setVisible(false)
      setTermsOfServiceVisible(true)
      setHasRequestedConnect.on()
    } else if (!termsOfServiceVisible && hasRequestedConnect && userCache.hasSignedTC) {
      setVisible(true)
      setHasRequestedConnect.off()
    }
  }, [visible, termsOfServiceVisible, userCache])

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
      setVisible(false)
      // if (walletName === 'WalletConnect') setVisible(false)
    },
    [select]
  )

  // organizes and de-duplicates wallets
  const renderWallets = useMemo(() => {
    const detectedWallets = wallets
      .filter(({ readyState }) => readyState === WalletReadyState.Installed)
      .filter((value, index, self) => self.findIndex((item) => item.adapter.name === value.adapter.name) === index)
      .map((w) => ({ ...w, detected: true }))

    const undetectedWallets = wallets
      .filter(
        ({ readyState }) =>
          readyState !== WalletReadyState.Unsupported && readyState !== WalletReadyState.Installed
      )
      .map((w) => ({ ...w, detected: false }))

    return [...detectedWallets, ...undetectedWallets]
  }, [wallets])

  return !userCache.hasSignedTC && termsOfServiceVisible ? (
    <TermsOfService setVisible={setTermsOfServiceVisible} visible={termsOfServiceVisible} />
  ) : (
    <Dialog onOpenChange={setVisible} open={visible}>
      <DialogOverlay />
      <DialogContent
        className={`flex flex-col gap-0 max-h-[500px] border-1 border-solid z-[1000] overflow-hidden
        dark:border-border-darkmode-secondary border-border-lightmode-secondary max-sm:rounded-b-none`}
        placement={isMobile ? 'bottom' : 'default'}
      >
        <DialogHeader
          className={`p-2.5 text-center items-start justify-start flex border-b-1 border-solid
        dark:border-border-darkmode-secondary border-border-lightmode-secondary`}
        >
          <DialogTitle>Choose a wallet</DialogTitle>
          <DialogCloseDefault className={'top-0 ring-0 focus-visible:ring-offset-0 focus-visible:ring-0'} />
        </DialogHeader>
        <DialogBody className={'flex-col flex-[1 0] p-2 overflow-auto pb-0'}>
          <div className={'flex flex-col gap-3.75 flex-[1 0]'}>
            {renderWallets.map((wallet, index) => (
              <Button
                key={index}
                isLoading={connecting && wallet.adapter.name === selectedWallet}
                onClick={() => handleWalletClick(wallet.adapter.name)}
                variant={'outline'}
                colorScheme={'secondaryGradient'}
                size={'lg'}
                className={cn(
                  `w-full items-center !h-[46px] !px-0  flex 
                before:to-border-lightmode-secondary before:from-border-lightmode-secondary 
                dark:before:to-border-darkmode-secondary dark:before:from-border-darkmode-secondary 
                hover:before:to-brand-secondaryGradient-secondary hover:before:from-brand-secondaryGradient-primary
                dark:hover:before:to-brand-secondaryGradient-secondary
                dark:hover:before:from-brand-secondaryGradient-primary
                rounded-[4px] before:rounded-[4px] last:mb-2
                `,
                  connecting && wallet.adapter.name === selectedWallet ? 'justify-center' : 'justify-between'
                )}
              >
                <div className="flex items-center">
                  <img
                    src={wallet.adapter.icon}
                    alt="wallet-icon"
                    height={'25px'}
                    width={'25px'}
                    className="mr-2.5 ml-2 rounded-half !h-[25px] bg-black-1"
                  />
                  <p className={'text-regular dark:text-grey-6 text-black-4 font-nunito font-bold'}>
                    {wallet.adapter.name.replace('(Extension)', '')}
                  </p>
                </div>
                {wallet.detected && <span className="text-green-4 pr-5 font-poppins text-tiny">Detected</span>}
              </Button>
            ))}
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}
