import React, { FC, useCallback, useMemo, useState, useEffect, useRef } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import useBreakPoint from '../hooks/useBreakPoint'
// import {useWalletModal} from '../context'
import { Loader } from '../components'
import { WalletName } from '@solana/wallet-adapter-base'
import { truncateAddress } from '../utils'
import tw, { TwStyle } from 'twin.macro'
// import styled from 'styled-components'
import 'styled-components/macro'
import { logData } from '../api/analytics'
import { SolanaMobileWalletAdapterWalletName } from '@solana-mobile/wallet-adapter-mobile'
import useBlacklisted from '../utils/useBlacklisted'
import { Menu, Transition } from '@headlessui/react'
import 'styled-components/macro'
import { useDarkMode, useWalletModal } from '../context'
import useMoveOutside from '../hooks/useMoveOutside'
import { useLocation } from 'react-router-dom'

// const WALLET_ICON = styled.div`
//   ${tw`flex items-center justify-center bg-black mr-[12px] rounded-circle`}
// `
// const WRAPPED_LOADER = styled.div`
//   ${tw`w-10 relative my-0 mr-[-12px] ml-3`}
//   div {
//     ${tw`top-[-26px]`}
//   }
// `
//
// const WRAPPER = styled.button<{ $connected: boolean; $width: string }>`
//   ${tw`py-0 px-[16px] flex items-center justify-center border-none border-0 rounded-circle cursor-pointer`}
//   ${({$connected}) => $connected && `padding-left: 4px;`}
//   background-color: ${({theme}) => theme.secondary3};
//   transition: background-color ${({theme}) => theme.mainTransitionTime} ease-in-out;
//   width: ${({$width}) => ($width ? $width : 'fit-content')};
//
//   &:hover {
//     background-color: ${({theme}) => theme.secondary2};
//   }
//
//   ${({theme, $connected}) =>
//           $connected &&
//           `
//     background-image: linear-gradient(to right, ${theme.primary3}, ${theme.secondary6});
//
//     > span {
//       cursor: initial !important;
//     }
//   `}
//   span {
//     ${tw`text-xs font-bold text-white`}
//     line-height: normal;
//   }
// `
// const SVGModeAdjust = styled.img`
//   filter: ${({theme}) => theme.filterWhiteIcon};
// `

// const Overlay: FC<{ setArrowRotation: Dispatch<SetStateAction<boolean>> }> = ({setArrowRotation}) => {
//   const {disconnect, wallet} = useWallet()
//   const {setVisible: setWalletModalVisible} = useWalletModal()
//   const isGeoBlocked = useBlacklisted()
//   const base58 = useMemo(() => wallet?.adapter?.publicKey?.toBase58(), [wallet?.adapter?.publicKey])
//
//   if (isGeoBlocked) {
//     return (
//       <Menu
//         css={tw`
//           dark: bg-black-1 bg-grey-4 text-grey-1
//           dark: text-grey-1
//         `}
//       >
//         <MenuItem>Georestricted</MenuItem>
//       </Menu>
//     )
//   }
//   return (
//     <Menu>
//       {base58 && (
//         <MenuItem
//           onClick={async () => {
//             await navigator.clipboard.writeText(base58)
//           }}
//         >
//           <span>Copy Address</span>
//           <SVGModeAdjust src={`${window.origin}/img/assets/copy_address.svg`} alt="copy_address"/>
//         </MenuItem>
//       )}
//       {wallet && (
//         <MenuItem
//           onClick={() => {
//             setTimeout(() => setWalletModalVisible(true), 100)
//           }}
//         >
//           <span>Change Wallet</span>
//           <SVGModeAdjust src={`${window.origin}/img/assets/wallet.svg`} alt="change_wallet"/>
//         </MenuItem>
//       )}
//       {wallet && (
//         <MenuItem
//           onClick={(e) => {
//             e.preventDefault()
//             disconnect().then()
//             sessionStorage.removeItem('connectedGFXWallet')
//             setArrowRotation(false)
//           }}
//         >
//           <span>Disconnect</span>
//           <SVGModeAdjust src={`${window.origin}/img/assets/disconnect.svg`} alt="disconnect"/>
//         </MenuItem>
//       )}
//     </Menu>
//   )
// }
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
  const { connect, select, wallet, connected, publicKey, disconnect } = useWallet()
  const isGeoBlocked = useBlacklisted()
  const [isOpen, setIsOpen] = useState(false)
  const breakpoint = useBreakPoint()
  const { mode } = useDarkMode()
  const base58PublicKey = useMemo(() => publicKey?.toBase58(), [publicKey])
  const { setVisible: setWalletModalVisible } = useWalletModal()
  const selfRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  const canConnect = useMemo(
    () => !isGeoBlocked || (isGeoBlocked && !pathname.includes('trade')),
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
    if (wallet && wallet?.adapter?.name !== SolanaMobileWalletAdapterWalletName && !connected && canConnect) {
      connect()
        .then(() => {
          sessionStorage.setItem('connectedGFXWallet', wallet?.adapter?.name)
        })
        .catch((e) => {
          console.log({ e })
        })
    } else if (!canConnect) {
      sessionStorage.removeItem('connectedGFXWallet')
      disconnect().catch((err) => console.log('disconnect failed', err))
    }
  }, [wallet, connect, connected, canConnect])

  //using session storage so that a new open tab will not try to login to wallet
  //but a refresh will attept wallet login, localStorage stores it forever and will attempt login on new webpage
  useEffect(() => {
    const walletName = sessionStorage.getItem('connectedGFXWallet')
    if (!walletName) return
    if (!base58PublicKey && !connected && walletName) {
      select(walletName as WalletName<string>)
    }
  }, [base58PublicKey, connected])
  const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), [])
  const onClose = useCallback(() => setIsOpen(false), [])
  const handleDisconnect = useCallback(
    (e) => {
      e.preventDefault()
      sessionStorage.removeItem('connectedGFXWallet')
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
      <span css={tw`absolute top-[34px] right-0 h-4 z-10`} style={{ width: '-webkit-fill-available' }} />
      <Menu>
        <Menu.Button
          as={'button'}
          css={[
            tw`border-0 flex min-md:w-[140px] cursor-pointer relative bg-purple-1 text-white items-center
            justify-center text-tiny font-semibold h-[30px] w-[124px] px-[5px] rounded-circle gap-1.75
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
                tw`flex items-center justify-center border-2 border-black border-solid rounded-circle bg-black p-[2px]`
              ]}
            >
              <img
                css={[
                  breakpoint.isMobile || breakpoint.isTablet
                    ? tw`h-[16px] w-[16px] rounded-lg`
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
    // <WRAPPER
    //   $connected={!!base58}
    //   $width={width}
    //   onClick={onSpanClick}
    //   css={[breakpoint.isMobile || breakpoint.isTablet ? tw`h-[35px]` : tw`h-[30px]`]}
    // >
    //   {wallet && base58 && (
    //     <WALLET_ICON
    //       css={[breakpoint.isMobile || breakpoint.isTablet ? tw`h-[28px] w-[28px]` : tw`h-[24px] w-[24px]`]}
    //     >
    //       <img
    //         css={[breakpoint.isMobile || breakpoint.isTablet ? tw`h-[16px] w-[16px]` : tw`h-[14px] w-[14px]`]}
    //         src={wallet.adapter.icon}
    //         alt={`${wallet.adapter.name}_icon`}
    //       />
    //     </WALLET_ICON>
    //   )}
    //   <span>{content}</span>
    //   {wallet && base58 && (
    //     <ArrowDropdown
    //       arrowRotation={arrowRotation}
    //       offset={[9, 30]}
    //       overlay={<Overlay setArrowRotation={setArrowRotation} />}
    //       onVisibleChange={onArrowDropdownClick}
    //     />
    //   )}
    // </WRAPPER>
  )
}
