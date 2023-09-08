import React, { FC, useCallback, useMemo, useState, useEffect, useRef } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import useBreakPoint from '../hooks/useBreakPoint'
import { Loader } from '../components'
import { truncateAddress } from '../utils'
import tw, { TwStyle } from 'twin.macro'
import 'styled-components/macro'
import { logData } from '../api/analytics'
import { SolanaMobileWalletAdapterWalletName } from '@solana-mobile/wallet-adapter-mobile'
import useBlacklisted from '../utils/useBlacklisted'
import { Menu, Transition } from '@headlessui/react'
import 'styled-components/macro'
import { useDarkMode, useWalletModal } from '../context'
import useMoveOutside from '../hooks/useMoveOutside'
import { useLocation } from 'react-router-dom'

interface MenuItemProps {
  containerStyle?: TwStyle[]
  customMenuListItemStyle?: TwStyle[]
  customMenuListItemsContainerStyle?: TwStyle[]
  customButtonStyle?: TwStyle[]
}
export const Connect: FC<MenuItemProps> = ({
  containerStyle,
  customButtonStyle,
  customMenuListItemsContainerStyle,
  customMenuListItemStyle
}) => {
  const { wallet, connected, publicKey, disconnect } = useWallet()
  const isGeoBlocked = useBlacklisted()
  const [isOpen, setIsOpen] = useState(false)
  const breakpoint = useBreakPoint()
  const { mode } = useDarkMode()
  const base58PublicKey = useMemo(() => publicKey?.toBase58(), [publicKey])
  const { setVisible: setWalletModalVisible } = useWalletModal()
  const selfRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  const canConnect = useMemo(
    () => !isGeoBlocked || (isGeoBlocked && !pathname.includes('trade') && !pathname.includes('farm')),
    [isGeoBlocked, pathname]
  )

  const handleMoveOutside = useCallback(() => {
    if (isOpen) {
      onClose()
    }
  }, [isOpen])
  useMoveOutside(selfRef, handleMoveOutside)

  useEffect(() => {
    if (connected) logData('wallet_connected')
  }, [connected])

  const connectLabel = useMemo(() => {
    if (!canConnect) {
      return 'Georestricted'
    }
    if (!wallet || (!base58PublicKey && wallet?.adapter?.name === SolanaMobileWalletAdapterWalletName)) {
      return 'Connect Wallet'
    } else if (!base58PublicKey) {
      return (
        <div css={[tw`absolute`]}>
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

  const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), [])
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

  return (
    <div css={[tw`relative inline-block text-left z-20 `].concat(containerStyle ?? [])} ref={selfRef}>
      <span css={tw`absolute -bottom-4 right-0 h-4 z-10`} style={{ width: '-webkit-fill-available' }} />
      <Menu>
        <Menu.Button
          as={'button'}
          css={[
            tw`border-0 flex min-md:min-w-[143px] cursor-pointer relative bg-purple-1 text-white items-center
            justify-center text-tiny font-semibold h-[35px] min-md:h-[30px] min-w-[122px] rounded-circle gap-1.75
            max-w-[400px]  px-[5px] py-[3.5px] min-md:py-[4px]
            `,
            !canConnect
              ? tw`dark:bg-black-4 bg-grey-4 text-grey-1 dark:text-grey-2`
              : connected
              ? tw`bg-gradient-to-r from-blue-1 to-primary-gradient-2 justify-between`
              : tw``
          ].concat(customButtonStyle ?? [])}
          disabled={!canConnect}
          onClick={connected ? toggleOpen : handleConnect}
        >
          {connected && (
            <div
              css={[
                tw`flex items-center justify-center border-2 dark:border-black-1 border-solid
                 border-grey-5 rounded-circle bg-grey-5 dark:bg-black-1 p-[2px]`
              ]}
            >
              <img
                css={[
                  breakpoint.isMobile || breakpoint.isTablet
                    ? tw`h-[20px] w-[20px] rounded-lg`
                    : tw`h-[14px] w-[14px] rounded-lg`
                ]}
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
        </Menu.Button>
        <Transition
          show={isOpen}
          as={'div'}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
          beforeLeave={onClose}
        >
          <Menu.Items
            static
            style={{
              transform: 'translateY(5px)'
            }}
            css={[
              tw`w-full rounded-small border-1 border-solid border-grey-2 dark:border-grey-1
         bg-white dark:bg-black-1 text-grey-1 dark:text-grey-2 text-tiny font-semibold origin-top
         absolute gap-2 flex flex-col px-2 py-2 min-md:px-1.25
         `
            ].concat(customMenuListItemsContainerStyle ?? [])}
          >
            <Menu.Item
              as={'div'}
              css={[tw`flex justify-between cursor-pointer items-center`].concat(customMenuListItemStyle ?? [])}
              onClick={copyAddress}
              className={'group'}
            >
              <p css={[tw`mb-0 w-full break-words group-hover:text-black-4 group-hover:dark:text-grey-2`]}>
                Copy Address
              </p>
              <img
                css={[tw`block group-hover:hidden h-6 w-6 `]}
                src={`/img/mainnav/copy-${mode}.svg`}
                alt={'copy'}
              />
              <img
                css={[tw`hidden group-hover:block h-6 w-6`]}
                src={`/img/mainnav/copy-${mode}-active.svg`}
                alt={'copy'}
              />
            </Menu.Item>
            <Menu.Item
              as={'div'}
              className={'group'}
              css={[tw`flex justify-between cursor-pointer items-center `].concat(customMenuListItemStyle ?? [])}
              onClick={handleWalletChange}
            >
              <p css={[tw`mb-0 w-full break-words group-hover:text-black-4 group-hover:dark:text-grey-2`]}>
                Change Wallet
              </p>
              <img
                css={[tw`block group-hover:hidden h-6 w-6`]}
                src={`/img/mainnav/changeWallet-${mode}.svg`}
                alt={'change address'}
              />
              <img
                css={[tw`hidden group-hover:block h-6 w-6`]}
                src={`/img/mainnav/changeWallet-${mode}-active.svg`}
                alt={'change address'}
              />
            </Menu.Item>
            <Menu.Item
              as={'div'}
              className={'group'}
              css={[tw`flex justify-between cursor-pointer items-center`].concat(customMenuListItemStyle ?? [])}
              onClick={handleDisconnect}
            >
              <p css={[tw`mb-0 w-full break-words group-hover:text-black-4 group-hover:dark:text-grey-2`]}>
                Disconnect
              </p>
              <img
                css={[tw`block group-hover:hidden h-6 w-6`]}
                src={`/img/mainnav/disconnect-${mode}.svg`}
                alt={'disconnect'}
              />
              <img
                css={[tw`hidden group-hover:block h-6 w-6`]}
                src={`/img/mainnav/disconnect-${mode}-active.svg`}
                alt={'disconnect'}
              />
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
