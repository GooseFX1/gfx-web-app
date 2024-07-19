import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import useBreakPoint from '../hooks/useBreakPoint'
import { truncateAddress } from '../utils'
import { useConnectionConfig, useDarkMode, useWalletModal } from '../context'
import { useLocation } from 'react-router-dom'
import {
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  ToastTitle
} from 'gfx-component-lib'
import { toast } from 'sonner'
import SuccessIcon from '@/assets/Success-icon.svg?react'
import useBoolean from '@/hooks/useBoolean'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { ALLOWED_WALLETS } from '@/pages/FarmV3/constants'
import { GeorestrictionModal } from './GeorestrictionModal'

interface MenuItemProps {
  containerStyle?: string
  customMenuListItemStyle?: string
  customMenuListItemsContainerStyle?: string
  customButtonStyle?: string
  customButtonWrapperStyle?: string
}

export const Connect: FC<MenuItemProps> = ({
                                             customButtonStyle,
                                             customMenuListItemsContainerStyle,
                                             customMenuListItemStyle
                                           }) => {
  const { wallet, connected, disconnect, connecting, disconnecting }
    = useWallet()
  const { base58PublicKey} = useWalletBalance()
  const isAttempting = connecting || disconnecting
  const { blacklisted } = useConnectionConfig()
  const [isOpen, setIsOpen] = useBoolean(false)
  const breakpoint = useBreakPoint()
  const { mode } = useDarkMode()
  const { setVisible: setWalletModalVisible, visible } = useWalletModal()

  const { pathname } = useLocation()
  const [geoBlocked, setGeoBlocked] = useState(false)

  const canConnect = (!blacklisted ||
    (blacklisted && pathname === '/farm/temp-withdraw') ||
    (blacklisted && ALLOWED_WALLETS.includes(base58PublicKey)))

  const { balance } = useWalletBalance()

  const { adapter } = wallet || {}
  const { name: adapterName, icon: adapterIcon } = adapter || {}

  useEffect(() => {
    if ((geoBlocked) && visible) setWalletModalVisible(false)
  }, [geoBlocked, base58PublicKey,visible])

  const connectLabel = useMemo(() => {
    if (!connected || isAttempting) {
      return 'Connect Wallet'
    }

    const leftRightSize = breakpoint.isMobile || breakpoint.isTablet ? 3 : 4
    return truncateAddress(base58PublicKey, leftRightSize)
  }, [base58PublicKey, connected, adapterName, wallet, breakpoint,isAttempting])

  // watches for a selected wallet returned from modal
  if (base58PublicKey && !canConnect && !geoBlocked) {
    disconnect().catch((err) => console.log('disconnect failed', err))
    setGeoBlocked(true)
  }

  const handleDisconnect = useCallback(
    (e) => {
      e.preventDefault()
      disconnect()
        .catch((err) => {
          console.warn('disconnect failed', err)
        })
        .finally(() => {
          setIsOpen.off()
        })
    },
    [disconnect]
  )
  const handleWalletChange = useCallback(() => {
    console.log('change')
    setWalletModalVisible(true)
    setIsOpen.off()
  }, [])
  const copyAddress = useCallback(() => {
    navigator.clipboard.writeText(base58PublicKey)

    toast(
      <div>
        <ToastTitle
          className={'items-center'}
          iconLeft={<SuccessIcon className={'stroke-background-green h-4 w-4'} />}
        >
          <h4 className={'text-h4 text-text-green'}>Success</h4>
        </ToastTitle>
        <p className={'text-text-lightmode-secondary dark:text-text-darkmode-secondary text-b3'}>
          Wallet address copied successfully!
        </p>
      </div>,
      {
        id: 'copyAddress'
      }
    )
    setIsOpen.off()
  }, [base58PublicKey])
  const handleConnect = useCallback(() => {
    setWalletModalVisible(true)
    setIsOpen.off()
  }, [])
  const openSolScan = useCallback(() => {
    window.open(`https://solscan.io/account/${base58PublicKey}`, '_blank')
  }, [base58PublicKey])
  // Note: not passing asChild to tooltiptrigger as styling goes missing believe its prop inheritance overwriting
  return (
    <
    >
      {geoBlocked && <GeorestrictionModal geoBlocked={geoBlocked} setGeoBlocked={setGeoBlocked} />}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen.set}>
        <DropdownMenuTrigger asChild className={'focus-visible:outline-none'}>
          <Button
            colorScheme={!connected ? 'purple' : 'primaryGradient'}
            size={'sm'}
            className={cn(
              `flex min-w-[120px] min-md:min-w-[143px] px-1 py-1.75 focus-visible:outline-none`,
              connected && !isAttempting ? 'justify-between' : 'justify-center',
              customButtonStyle
            )}
            onClick={() => (!connected||isAttempting) && handleConnect()}
            isLoading={isAttempting}
          >
            {connected && (
              <div
                className={`flex items-center justify-center border-4 dark:border-black-1 border-solid
                  border-grey-5 rounded-circle bg-grey-5 dark:bg-black-1 w-[24px] h-[24px] overflow-hidden`}
              >
                <img className={'w-auto rounded-lg'} src={adapterIcon} alt={`${adapterName}_icon`} />
              </div>
            )}
            {connectLabel}
            {connected && (
              <img
                style={{
                  transform: `rotate(${isOpen ? '0deg' : '180deg'})`,
                  transition: 'transform 0.2s ease-in-out'
                }}
                src={`/img/mainnav/connect-chevron-dark.svg`}
                alt={'connect-chevron'}
              />
            )}
          </Button>
        </DropdownMenuTrigger>
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
                <Icon size={'sm'} src={adapterIcon} />
              </div>
              <div>
                <h4
                  className={`
                  text-text-lightmode-primary dark:text-text-darkmode-primary font-semibold
                `}
                >
                  ~ {balance.SOL.tokenAmount.uiAmountString} SOL
                </h4>
                <p
                  className={`
                text-b3 cursor-pointer text-text-lightmode-tertiary dark:text-text-darkmode-tertiary font-semibold
    
                `}
                  onClick={copyAddress}
                >
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
              <p
                className={
                  'mb-0 w-full break-words group-hover:text-black-4 group-hover:dark:text-grey-2 font-bold'
                }
              >
                Copy Address
              </p>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={openSolScan}
              className={cn('group gap-2 cursor-pointer', customMenuListItemStyle)}
            >
              <Icon className={'h-6 w-6'} src={`/img/assets/solscan.png`} alt={'solscan'} />
              <p
                className={
                  'mb-0 w-full break-words group-hover:text-black-4 group-hover:dark:text-grey-2 font-bold'
                }
              >
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
              <p
                className={
                  'mb-0 w-full break-words group-hover:text-black-4 group-hover:dark:text-grey-2 font-bold'
                }
              >
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
              <p
                className={
                  'mb-0 w-full break-words group-hover:text-black-4 group-hover:dark:text-grey-2 font-bold'
                }
              >
                Disconnect
              </p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </>
  )
}
