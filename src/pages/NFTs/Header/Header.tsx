import React, { useState, useEffect, useCallback, MouseEventHandler } from 'react'
import styled from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '../../../context'
import { useHistory } from 'react-router-dom'
import { Image } from 'antd'
import { ButtonWrapper } from '../NFTButton'
import { SearchBar, Categories } from '../../../components'
import { SpaceBetweenDiv } from '../../../styles'
import { categories } from './mockData'
import { useLocalStorageState } from '../../../utils'
import PopupCompleteProfile from '../Profile/PopupCompleteProfile'
import { useNFTProfile } from '../../../context'

const HEADER_WRAPPER = styled(SpaceBetweenDiv)`
  padding: ${({ theme }) => theme.margins['3x']};
  margin-bottom: -${({ theme }) => theme.margins['1x']};
  ${({ theme }) => theme.largeBorderRadius}
  ${({ theme }) => theme.smallShadow}
  background-color: ${({ theme }) => theme.bg3};
  box-shadow: 0 1px 5px 6px rgb(0 0 0 / 29%);
  z-index: 5;

  > *:not(:nth-child(2)) {
    flex: 2;
  }

  > *:nth-child(2) {
    flex: 3;
  }
`

const AVATAR_WRAPPER = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`

const BUTTON_SELECTION = styled.div`
  display: flex;
  justify-content: flex-end;

  > button:last-child {
    margin-left: ${({ theme }) => theme.margins['3x']};
  }
`

const CREATE = styled(ButtonWrapper)`
  justify-content: center;
  height: 50px;
  width: 140px;
  background-color: ${({ theme }) => theme.darkButton};

  span {
    color: white;
  }
`

const AVATAR_NFT = styled(Image)`
  border-radius: 50%;
  width: 56px;
  height: 56px;
  cursor: pointer;
`
const CONNECT_BTN = styled.button`
  padding: 0 ${({ theme }) => theme.margins['2x']};
  ${({ theme }) => theme.flexCenter}
  height: ${({ theme }) => theme.margins['5x']};
  border: none;
  ${({ theme }) => theme.roundedBorders}
  ${({ theme }) => theme.smallShadow}
  background-color: ${({ theme }) => theme.secondary3};
  transition: background-color ${({ theme }) => theme.mainTransitionTime} ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.secondary2};
  }

  span {
    font-size: 12px;
    font-weight: bold;
    color: white;
    white-space: nowrap;
  }
`

export const Header = ({ setFilter, filter }) => {
  const history = useHistory()
  const { sessionUser, setSessionUser, fetchSessionUser } = useNFTProfile()
  const { connected, publicKey } = useWallet()
  const [isFirstTimeUser, setIsFirstTimeUser] = useLocalStorageState(`sessionUserInit`, 'true')
  const [visibleCompletePopup, setVisibleCompletePopup] = useState<boolean>(false)
  const { setVisible: setModalVisible } = useWalletModal()

  useEffect(() => {
    if (connected && publicKey) {
      if (!sessionUser || sessionUser.pubkey !== `${publicKey}`) {
        fetchSessionUser('address', `${publicKey}`).then((res) => {
          if (res && res.status === 200) {
            if (res.data.length === 0 && isFirstTimeUser === 'true') {
              setTimeout(() => setVisibleCompletePopup(true), 750)
            }
          } else {
            console.error(res)
          }
        })
      }
    } else {
      setSessionUser(undefined)
    }
    return () => {}
  }, [publicKey, connected])

  const handleDismissModal = useCallback(() => {
    setIsFirstTimeUser('false')
    setVisibleCompletePopup(false)
  }, [setIsFirstTimeUser, setVisibleCompletePopup])

  const onSkip = useCallback(() => handleDismissModal(), [handleDismissModal])
  const onContinue = useCallback(() => {
    handleDismissModal()
    history.push({ pathname: '/NFTs/profile', state: { isCreatingProfile: true } })
  }, [handleDismissModal])

  const onCreateCollectible = () => {
    history.push('/NFTs/create')
  }

  const goProfile = () => history.push(`/NFTs/profile`)

  const handleWalletModal: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (!event.defaultPrevented && !connected && !publicKey) {
        setModalVisible(true)
      }
    },
    [setModalVisible, publicKey, connected]
  )

  return (
    <HEADER_WRAPPER>
      <PopupCompleteProfile visible={visibleCompletePopup} handleOk={onContinue} handleCancel={onSkip} />
      <AVATAR_WRAPPER>
        {connected && publicKey && (
          <AVATAR_NFT
            fallback={`${window.origin}/img/assets/avatar.png`}
            src={sessionUser ? sessionUser.profile_pic_link : ''}
            preview={false}
            onClick={goProfile}
          />
        )}
      </AVATAR_WRAPPER>
      <SearchBar setFilter={setFilter} filter={filter} />
      <BUTTON_SELECTION>
        <Categories categories={categories} />
        {connected && publicKey ? (
          <CREATE onClick={onCreateCollectible}>
            <span>Create</span>
          </CREATE>
        ) : (
          <CONNECT_BTN onClick={handleWalletModal}>
            <span>Connect Wallet</span>
          </CONNECT_BTN>
        )}
      </BUTTON_SELECTION>
    </HEADER_WRAPPER>
  )
}
