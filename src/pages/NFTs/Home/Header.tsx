import React, { useState, useEffect, useCallback, MouseEventHandler } from 'react'
import styled from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { useDarkMode, useWalletModal, useNavCollapse } from '../../../context'
import { useHistory } from 'react-router-dom'
import { Image, Menu, Dropdown } from 'antd'
import { ButtonWrapper } from '../NFTButton'
// import { SearchBar, Categories } from '../../../components'
import { SearchBar } from '../../../components'
import { SpaceBetweenDiv } from '../../../styles'
import DropdownButton from '../../../layouts/App/DropDownButton'
// import { categories, coins } from './data'
// import { useLocalStorageState } from '../../../utils'
import PopupCompleteProfile from '../Profile/PopupCompleteProfile'
import { useNFTProfile } from '../../../context'
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'

//#region styles
const HEADER_WRAPPER = styled(SpaceBetweenDiv)`
  padding-top: ${({ theme }) => theme.margin(5.5)};
  padding-bottom: ${({ theme }) => theme.margin(3)};
  padding-left: ${({ theme }) => theme.margin(4)};
  padding-right: ${({ theme }) => theme.margin(4)};
  justify-content: space-between;
  z-index: 5;

  .search-bar {
    width: 100%;
    max-width: 600px;
    background: ${({ theme }) => theme.bg1};
    height: 45px;
    margin-left: 0;
    border: 1px solid ${({ theme }) => theme.bg1};

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

const CTA_BTN = styled(ButtonWrapper)`
  justify-content: center;
  height: 45px;
  min-width: 132px;
  margin-left: ${({ theme }) => theme.margin(1.5)};
  padding: 0 24px;

  span {
    font-weight: 600;
    font-size: 17px;
    line-height: 21px;
    color: white;
  }
`

const CONNECT = styled(CTA_BTN)`
  margin-left: ${({ theme }) => theme.margin(2.5)};
  background-color: ${({ theme }) => theme.secondary3};
`

const CREATE = styled(CTA_BTN)`
  background-color: ${({ theme }) => theme.secondary5};
`
const SELL = styled(CTA_BTN)`
  background-color: #bb3535;
`

const AVATAR_NFT = styled(Image)`
  border-radius: 50%;
  width: 56px;
  height: 56px;
  cursor: pointer;
  margin-right: ${({ theme }) => theme.margin(1.5)};
`
//#endregion

export const Header = ({ setFilter, filter, filteredCollections, totalCollections, setTotalCollections }) => {
  const history = useHistory()
  const { sessionUser, userCurrency, setUserCurrency } = useNFTProfile()
  const { isCollapsed } = useNavCollapse()
  const { connected, publicKey, connect } = useWallet()
  const [visibleCompletePopup, setVisibleCompletePopup] = useState<boolean>(false)
  const { setVisible: setModalVisible } = useWalletModal()
  const { mode } = useDarkMode()
  const [isHeaderData, setIsHeaderData] = useState<boolean>(false)

  useEffect(() => {
    setTimeout(() => setIsHeaderData(true), 1000)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      const fetchUserProfileStatus = publicKey ? localStorage.getItem(publicKey.toBase58()) : undefined
      const firstTimeUser = fetchUserProfileStatus ? JSON.parse(localStorage.getItem(publicKey.toBase58())) : undefined

      if (firstTimeUser && publicKey) {
        if (firstTimeUser.pubKey === publicKey.toBase58() && firstTimeUser.isNew) {
          setVisibleCompletePopup(true)
        }
      }
    }, 750)

    return () => {}
  }, [sessionUser])

  useEffect(() => {
    if (!connected) {
      connect().catch(() => {})
    }
  }, [connected])

  const handleDismissModal = useCallback(() => {
    setVisibleCompletePopup(false)
    localStorage.setItem(publicKey.toBase58(), JSON.stringify({ pubKey: publicKey.toBase58(), isNew: false }))
  }, [publicKey])

  const onSkip = useCallback(() => handleDismissModal(), [handleDismissModal])
  const onContinue = useCallback(() => {
    handleDismissModal()
    history.push({ pathname: `/NFTs/profile/${publicKey.toBase58()}`, state: { isCreatingProfile: true } })
  }, [handleDismissModal])

  const goProfile = () => history.push(`/NFTs/profile/${publicKey.toBase58()}`)

  const handleWalletModal: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (!event.defaultPrevented && !connected && !publicKey) {
        setModalVisible(true)
      }
    },
    [setModalVisible, publicKey, connected]
  )

  // const handleFilterChange = (filter) => {
  //   let newFilteredCol
  //   if (filter.toLowerCase() == 'verified') {
  //     newFilteredCol = totalCollections.filter((i) => i.is_verified)
  //   } else if (filter.toLowerCase() == 'unverified') {
  //     newFilteredCol = totalCollections.filter((i) => !i.is_verified)
  //   } else if (filter.toLowerCase() == 'all') {
  //     newFilteredCol = totalCollections
  //   } else {
  //     newFilteredCol = totalCollections.filter((i) =>
  //       i.category_tags
  //         .split(' ')
  //         .map((i) => i.toLowerCase())
  //         .includes(filter.toLowerCase())
  //     )
  //   }
  //   setFilteredCollections(newFilteredCol)
  //   setTotalCollections(newFilteredCol)
  // }

  const genMenu = () => {
    return filter.length > 0 ? (
      <Menu className={`global-search-dropdown global-search-dropdown-${mode}`}>
        {filteredCollections.length > 0 ? (
          filteredCollections.map((i, k) => (
            <Menu.Item key={k}>
              <URL href={`/NFTs/collection/${i.collection_name.replaceAll(' ', '_')}`}>
                <DETAILS>
                  <TINYIMG
                    src={i.profile_pic_link.length > 0 ? i.profile_pic_link : `/img/assets/nft-preview-${mode}.svg`}
                  />
                  <p style={{ margin: '0px' }}>{i.collection_name}</p>
                </DETAILS>
                <RIGHTARROWICON src={'/img/assets/arrow.svg'} className="global-search-dropdown-icon" />
              </URL>
            </Menu.Item>
          ))
        ) : (
          <p className="empty">No Result Found!</p>
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
          <SkeletonCommon
            style={{ minWidth: '550px', maxWidth: '600px', marginLeft: '20px' }}
            height="46px"
            borderRadius="46px"
          />
        ) : (
          <Dropdown overlay={genMenu()} trigger={['click']}>
            <SearchBar className="search-bar" setSearchFilter={setFilter} filter={filter} />
          </Dropdown>
        )}
      </AVATAR_WRAPPER>
      <BUTTON_SELECTION>
        {!isHeaderData ? (
          <div style={{ display: 'flex' }}>
            <SkeletonCommon width="149px" height="45px" borderRadius="45px" />
            <SkeletonCommon width="132px" height="45px" borderRadius="45px" style={{ marginLeft: '20px' }} />
          </div>
        ) : (
          <div style={{ display: 'flex' }}>
            {isCollapsed && !connected && (
              <CONNECT onClick={handleWalletModal}>
                <span>Connect Wallet</span>
              </CONNECT>
            )}

            <DropdownButton
              title={userCurrency}
              options={[
                { displayName: 'SOL', value: 'SOL', icon: 'SOL' },
                { displayName: 'USD', value: 'USD', icon: 'USD' }
              ]}
              handleSelect={setUserCurrency}
              folder="crypto"
              style={{
                marginLeft: '1rem',
                width: '80px',
                height: '45px',
                borderRadius: '15px',
                justifyContent: 'space-between'
              }}
            />
          </div>
        )}
        {/* {!isHeaderData ? (
          <SkeletonCommon width="132px" height="45px" borderRadius="45px" style={{ marginLeft: '20px' }} />
        ) : (
          <Categories categories={categories} className="categories" onChange={(e) => handleFilterChange(e)} />
        )} */}
        {/* {!isHeaderData ? (
          <SkeletonCommon width="68px" height="45px" borderRadius="12px" style={{ marginLeft: '20px' }} />
        ) : (
          <Categories categories={coins} className="coins" />
        )} */}
      </BUTTON_SELECTION>
    </HEADER_WRAPPER>
  )
}
