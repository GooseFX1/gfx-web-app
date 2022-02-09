import React, { useState, useEffect, useCallback, MouseEventHandler } from 'react'
import styled from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { useDarkMode, useWalletModal } from '../../../context'
import { useHistory } from 'react-router-dom'
import { Image } from 'antd'
import { ButtonWrapper } from '../NFTButton'
import { SearchBar, Categories, MainButton } from '../../../components'
import { SpaceBetweenDiv } from '../../../styles'
import { categories, coins } from './mockData'
import { useLocalStorageState } from '../../../utils'
import PopupCompleteProfile from '../Profile/PopupCompleteProfile'
import { useNFTProfile } from '../../../context'

const HEADER_WRAPPER = styled(SpaceBetweenDiv)`
  padding-top: ${({ theme }) => theme.margin(5.5)};
  padding-bottom: ${({ theme }) => theme.margin(3)};
  padding-left: ${({ theme }) => theme.margin(4)};
  padding-right: ${({ theme }) => theme.margin(4)};
  justify-content: space-between;
  z-index: 5;

  .search-bar {
    width: 100%;
    background: #2a2a2a;
    height: 45px;
    margin-left: ${({ theme }) => theme.margin(2.5)};

    > input {
      background: #2a2a2a;
      &::placeholder {
        color: rgba(114, 114, 114, 1);
      }
    }
  }

  .categories {
    width: auto;
    margin-left: ${({ theme }) => theme.margin(1.5)};

    span {
      font-weight: 700;
      font-size: 15px;
    }
  }
  .coins {
    height: 45px;
    width: 68px;
    margin-left: ${({ theme }) => theme.margin(2.5)};
    border-radius: 13px;
    background: #2a2a2a;
    padding: 0 ${({ theme }) => theme.margin(1)};
    span {
      font-weight: 500;
      font-size: 15px;
      text-transform: uppercase;
    }
  }
  .connect-wl-btn {
    margin-left: ${({ theme }) => theme.margin(2.5)};
  }
`

const AVATAR_WRAPPER = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-grow: 2;
`

const BUTTON_SELECTION = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;

  > button:last-child {
    margin-left: ${({ theme }) => theme.margin(3)};
  }
`

const CREATE = styled(ButtonWrapper)`
  justify-content: center;
  height: 45px;
  width: 132px;
  background-color: ${({ theme }) => theme.secondary5};
  margin-left: ${({ theme }) => theme.margin(1.5)};
  span {
    color: white;
  }
`
const SELL = styled(ButtonWrapper)`
  justify-content: center;
  height: 45px;
  width: 132px;
  background-color: #bb3535;
  margin-left: ${({ theme }) => theme.margin(2)};
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

export const Header = ({ setFilter, filter }) => {
  const history = useHistory()
  const { sessionUser, setSessionUser, fetchSessionUser } = useNFTProfile()
  const { connected, publicKey } = useWallet()
  const [isFirstTimeUser, setIsFirstTimeUser] = useLocalStorageState(`sessionUserInit`, 'true')
  const [visibleCompletePopup, setVisibleCompletePopup] = useState<boolean>(false)
  const { setVisible: setModalVisible } = useWalletModal()
  const { mode } = useDarkMode()

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
            fallback={`/img/assets/avatar${mode === 'dark' ? '' : '-lite'}.svg`}
            src={sessionUser ? sessionUser.profile_pic_link : ''}
            preview={false}
            onClick={goProfile}
          />
        )}
        {/* <SearchBar className="search-bar" setFilter={setFilter} filter={filter} /> */}
      </AVATAR_WRAPPER>
      <BUTTON_SELECTION>
        {connected && publicKey ? (
          <div style={{ display: 'flex' }}>
            <SELL onClick={() => console.log('got to selling')}>
              <span>Sell</span>
            </SELL>
            <CREATE onClick={onCreateCollectible}>
              <span>Create</span>
            </CREATE>
          </div>
        ) : (
          <MainButton
            className="connect-wl-btn"
            height={'45px'}
            status="action"
            width={'168px'}
            onClick={handleWalletModal}
          >
            <span>Connect Wallet</span>
          </MainButton>
        )}
        <Categories categories={categories} className="categories" />

        <Categories categories={coins} className="coins" />
      </BUTTON_SELECTION>
    </HEADER_WRAPPER>
  )
}
