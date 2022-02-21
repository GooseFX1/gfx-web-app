import React, { useState, useEffect, useCallback, MouseEventHandler } from 'react'
import styled from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { useDarkMode, useWalletModal } from '../../../context'
import { useHistory } from 'react-router-dom'
import { Image, Menu, Dropdown } from 'antd'
import { ButtonWrapper } from '../NFTButton'
import { SearchBar, Categories, MainButton } from '../../../components'
import { SpaceBetweenDiv } from '../../../styles'
import { categories, coins } from './mockData'
import { useLocalStorageState } from '../../../utils'
import PopupCompleteProfile from '../Profile/PopupCompleteProfile'
import { useNFTProfile } from '../../../context'
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'

const HEADER_WRAPPER = styled(SpaceBetweenDiv)`
  padding-top: ${({ theme }) => theme.margin(5.5)};
  padding-bottom: ${({ theme }) => theme.margin(3)};
  padding-left: ${({ theme }) => theme.margin(4)};
  padding-right: ${({ theme }) => theme.margin(4)};
  justify-content: space-between;
  z-index: 5;

  .search-bar {
    width: 100%;
    background: ${({ theme }) => theme.bg1};
    height: 45px;
    margin-left: ${({ theme }) => theme.margin(2.5)};
    border: 1px solid ${({ theme }) => theme.bg5};

    > input {
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

const TINYIMG = styled.img`
  height: 24px;
  width: 24px;
  border-radius: 25%;
  margin-left: 12px;
  margin-right: 24px;
`

const DETAILS = styled.div`
  display: flex;
  align-items: center;
`

const URL = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const RIGHTARROWICON = styled.img`
  transform: rotate(-90deg);
  width: 16px;
  height: 16px;
  color: white;
  filter: ${({ theme }) => theme.filterBackIcon};
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

const MENU_ITEM = styled(Menu.Item)`
  color: ${({ theme }) => theme.text1};
`

export const Header = ({ setFilter, filter, filteredCollections }) => {
  const history = useHistory()
  const { sessionUser } = useNFTProfile()
  const { connected, publicKey } = useWallet()
  const [visibleCompletePopup, setVisibleCompletePopup] = useState<boolean>(false)
  const { setVisible: setModalVisible } = useWalletModal()
  const { mode } = useDarkMode()
  const [isHeaderData, setIsHeaderData] = useState<boolean>(false)

  useEffect(() => {
    setTimeout(() => {
      setIsHeaderData(true)
    }, 3000)
  }, [])

  useEffect(() => {
    if (connected && publicKey) {
      const fetchUserProfileStatus = localStorage.getItem(publicKey.toBase58())
      const firstTimeUser = fetchUserProfileStatus ? JSON.parse(localStorage.getItem(publicKey.toBase58())) : undefined

      if (firstTimeUser && firstTimeUser.pubKey === publicKey.toBase58() && firstTimeUser.isNew === true) {
        setTimeout(() => setVisibleCompletePopup(true), 750)
      }
    }
    return () => {}
  }, [sessionUser])

  const handleDismissModal = useCallback(() => setVisibleCompletePopup(false), [setVisibleCompletePopup])

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

  const genMenu = () => {
    return filter.length > 0 ? (
      <Menu className={`global-search-dropdown global-search-dropdown-${mode}`}>
        {filteredCollections.length > 0 ? (
          filteredCollections.map((i, k) => (
            <Menu.Item key={k}>
              <URL href={'/NFTs/collection/' + i.collection_id}>
                <DETAILS>
                  <TINYIMG src={i.profile_pic_link.length > 0 ? i.profile_pic_link : `/img/assets/nft-preview.svg`} />
                  <p style={{ margin: '0px' }}>{i.collection_name}</p>
                </DETAILS>
                <RIGHTARROWICON src={'/img/assets/arrow.svg'} className="global-search-dropdown-icon" />
              </URL>
            </Menu.Item>
          ))
        ) : (
          <MENU_ITEM key="0">No Result Found!</MENU_ITEM>
        )}
      </Menu>
    ) : (
      <Menu className={`global-search-dropdown global-search-dropdown-${mode}`}>
        <p className="empty">Start typing to search</p>
      </Menu>
    )
  }

  return (
    <HEADER_WRAPPER>
      <PopupCompleteProfile visible={visibleCompletePopup} handleOk={onContinue} handleCancel={onSkip} />
      <AVATAR_WRAPPER>
        {!isHeaderData ? (
          <SkeletonCommon width="50px" height="50px" borderRadius="50%" />
        ) : (
          connected &&
          publicKey && (
            <AVATAR_NFT
              fallback={`/img/assets/avatar${mode === 'dark' ? '' : '-lite'}.svg`}
              src={sessionUser ? sessionUser.profile_pic_link : ''}
              preview={false}
              onClick={goProfile}
            />
          )
        )}
        {!isHeaderData ? (
          <SkeletonCommon style={{ minWidth: '600px', marginLeft: '20px' }} height="46px" borderRadius="46px" />
        ) : (
          <Dropdown overlay={genMenu()} trigger={['click']}>
            <SearchBar className="search-bar" setFilter={setFilter} filter={filter} />
          </Dropdown>
        )}
      </AVATAR_WRAPPER>
      <BUTTON_SELECTION>
        {!isHeaderData ? (
          <div style={{ display: 'flex' }}>
            <SkeletonCommon width="149px" height="45px" borderRadius="45px" />
            <SkeletonCommon width="132px" height="45px" borderRadius="45px" style={{ marginLeft: '20px' }} />
          </div>
        ) : connected && publicKey ? (
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
        {!isHeaderData ? (
          <SkeletonCommon width="132px" height="45px" borderRadius="45px" style={{ marginLeft: '20px' }} />
        ) : (
          <Categories categories={categories} className="categories" />
        )}
        {!isHeaderData ? (
          <SkeletonCommon width="68px" height="45px" borderRadius="12px" style={{ marginLeft: '20px' }} />
        ) : (
          <Categories categories={coins} className="coins" />
        )}
      </BUTTON_SELECTION>
    </HEADER_WRAPPER>
  )
}
