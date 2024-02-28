import React, { FC, useCallback, useMemo, useState, useEffect, useRef } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import useBreakPoint from '../hooks/useBreakPoint'
import { Loader } from '../components'
import { truncateAddress } from '../utils'
import { SolanaMobileWalletAdapterWalletName } from '@solana-mobile/wallet-adapter-mobile'
import { useConnectionConfig } from '../context'
import { useDarkMode, useWalletModal } from '../context'
import useMoveOutside from '../hooks/useMoveOutside'
import { useLocation } from 'react-router-dom'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  cn,
  Icon
} from 'gfx-component-lib'
import useWalletBalance from '@/hooks/useWalletBalance'

interface MenuItemProps {
  containerStyle?: string
  customMenuListItemStyle?: string
  customMenuListItemsContainerStyle?: string
  customButtonStyle?: string
}

export const Connect: FC<MenuItemProps> = ({
  containerStyle,
  customButtonStyle,
  customMenuListItemsContainerStyle,
  customMenuListItemStyle
}) => {
  const { wallet, connected, publicKey, disconnect } = useWallet()
  const { blacklisted } = useConnectionConfig()
  const [isOpen, setIsOpen] = useState(false)
  const breakpoint = useBreakPoint()
  const { mode } = useDarkMode()
  const { balance } = useWalletBalance()
  const base58PublicKey = useMemo(() => publicKey?.toBase58(), [publicKey])
  const { setVisible: setWalletModalVisible } = useWalletModal()
  const selfRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  const canConnect = useMemo(
    () => !blacklisted || (blacklisted && pathname === '/farm/temp-withdraw'),
    [blacklisted, pathname]
  )

  const handleMoveOutside = useCallback(() => {
    if (isOpen) {
      onClose()
    }
  }, [isOpen])
  useMoveOutside(selfRef, handleMoveOutside)

  // useEffect(() => {
  //   if (connected) logData('wallet_connected')
  // }, [connected])

  const connectLabel = useMemo(() => {
    if (!canConnect) {
      return 'Georestricted'
    }
    if (!wallet || (!base58PublicKey && wallet?.adapter?.name === SolanaMobileWalletAdapterWalletName)) {
      return 'Connect Wallet'
    } else if (!base58PublicKey) {
      return (
        <div className={'absolute'}>
          <Loader zIndex={1} />
        </div>
      )
    }
    const leftRightSize = breakpoint.isMobile || breakpoint.isTablet ? 3 : 4
    return truncateAddress(base58PublicKey, leftRightSize)
  }, [base58PublicKey, canConnect, wallet?.adapter?.name, breakpoint])

  // watches for a selected wallet returned from modal
  useEffect(() => {
    if (!canConnect) {
      disconnect().catch((err) => console.log('disconnect failed', err))
    }
  }, [disconnect, canConnect])

  const onClose = useCallback(() => setIsOpen(false), [])
  const handleDisconnect = useCallback(
    (e) => {
      e.preventDefault()
      disconnect()
        .catch((err) => {
          console.warn('disconnect failed', err)
        })
        .finally(() => {
          onClose()
        })
    },
    [disconnect]
  )
  const handleWalletChange = useCallback(() => {
    setWalletModalVisible(true)
    onClose()
  }, [setWalletModalVisible])
  const copyAddress = useCallback(() => {
    navigator.clipboard.writeText(base58PublicKey)
    onClose()
  }, [base58PublicKey])
  const handleConnect = useCallback(() => {
    setWalletModalVisible(true)
  }, [])
  // Note: not passing asChild to tooltiptrigger as styling goes missing believe its prop inheritance overwriting
  return (
    <div className={cn(`relative inline-block text-left z-20 `, containerStyle)} ref={selfRef}>
      <span className={'absolute -bottom-4 right-0 h-4 z-10 w-full'} style={{ width: '-webkit-fill-available' }} />
      <DropdownMenu>
        <Tooltip>
          <DropdownMenuTrigger asChild>
            <TooltipTrigger className={cn(customButtonStyle)}>
              <Button
                colorScheme={!connected ? 'purple' : 'primaryGradient'}
                size={breakpoint.isMobile || breakpoint.isTablet ? 'default' : 'sm'}
                disabled={!canConnect}
                className={cn(`min-w-[129px] min-md:min-w-[143px] px-2.5 py-1.75`, customButtonStyle)}
                onClick={() => !connected && handleConnect()}
              >
                {connected && (
                  <div
                    className={`flex items-center justify-center border-2 dark:border-black-1 border-solid
                  border-grey-5 rounded-circle bg-grey-5 dark:bg-black-1 p-[2px]`}
                  >
                    <img
                      className={cn(
                        'h-[14px] w-[14px] rounded-lg',
                        breakpoint.isMobile || breakpoint.isTablet ? 'h-[20px] w-[20px]' : ''
                      )}
                      src={wallet?.adapter?.icon}
                      alt={`${wallet?.adapter?.name}_icon`}
                    />
                  </div>
                )}
                {connectLabel}
                {connected && (
                  <img
                    style={{
                      transform: `rotate(${isOpen ? '0deg' : '180deg'})`,
                      transition: 'transform 0.2s ease-in-out'
                    }}
                    src={`/img/mainnav/connect-chevron.svg`}
                    alt={'connect-chevron'}
                  />
                )}
              </Button>
            </TooltipTrigger>
          </DropdownMenuTrigger>
          <TooltipContent hidden={canConnect}>
            We are sorry, {pathname.includes('trade') ? 'Trade' : 'Farm'} is currently unavailable in your location
          </TooltipContent>
        </Tooltip>
        {connected && (
          <DropdownMenuContent className={cn('mt-3.75', customMenuListItemsContainerStyle)} portal={false}>
            <div
              className={cn(`flex flex-row gap-2 items-center border-b border-solid pb-2 mb-2
              border-border-darkmode-primary
            `)}
            >
              <div
                className={`flex items-center justify-center border-2 dark:border-black-1 border-solid
                  border-grey-5 rounded-circle bg-grey-5 dark:bg-black-1 p-[2px]`}
              >
                <Icon size={'sm'} src={wallet?.adapter?.icon} />
              </div>
              <div>
                <h4>~ {balance.sol.uiAmountString} SOL</h4>
                <p className={'text-b3 cursor-pointer'} onClick={copyAddress}>
                  {base58PublicKey && truncateAddress(base58PublicKey, 5)}
                </p>
              </div>
            </div>

            <DropdownMenuItem
              onClick={copyAddress}
              className={cn('group gap-2 cursor-pointer', customMenuListItemStyle)}
            >
              <img
                className={'block group-hover:hidden h-6 w-6 '}
                src={`/img/mainnav/copy-${mode}.svg`}
                alt={'copy'}
              />
              <img
                className={'hidden group-hover:block h-6 w-6'}
                src={`/img/mainnav/copy-${mode}-active.svg`}
                alt={'copy'}
              />
              <p className={'mb-0 w-full break-words group-hover:text-black-4 group-hover:dark:text-grey-2'}>
                Copy Address
              </p>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={copyAddress}
              className={cn('group gap-2 cursor-pointer', customMenuListItemStyle)}
            >
              <Icon className={'h-6 w-6'} src={`/img/assets/solscan.png`} alt={'solscan'} />
              <p className={'mb-0 w-full break-words group-hover:text-black-4 group-hover:dark:text-grey-2'}>
                View Solscan
              </p>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleWalletChange}
              className={cn('group gap-2 cursor-pointer', customMenuListItemStyle)}
            >
              <img
                className={'block group-hover:hidden h-6 w-6'}
                src={`/img/mainnav/changeWallet-${mode}.svg`}
                alt={'change address'}
              />
              <img
                className={'hidden group-hover:block h-6 w-6'}
                src={`/img/mainnav/changeWallet-${mode}-active.svg`}
                alt={'change address'}
              />
              <p className={'mb-0 w-full break-words group-hover:text-black-4 group-hover:dark:text-grey-2'}>
                Change Wallet
              </p>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDisconnect}
              className={cn('group gap-2 cursor-pointer', customMenuListItemStyle)}
            >
              <img
                className={'block group-hover:hidden h-6 w-6'}
                src={`/img/mainnav/disconnect-${mode}.svg`}
                alt={'disconnect'}
              />
              <img
                className={'hidden group-hover:block h-6 w-6'}
                src={`/img/mainnav/disconnect-${mode}-active.svg`}
                alt={'disconnect'}
              />
              <p className={'mb-0 w-full break-words group-hover:text-black-4 group-hover:dark:text-grey-2'}>
                Disconnect
              </p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  )
}
