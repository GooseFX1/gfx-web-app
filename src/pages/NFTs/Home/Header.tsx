import React, { useState, useEffect, useCallback, MouseEventHandler } from 'react'
import styled from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { useDarkMode, useWalletModal, useNavCollapse } from '../../../context'
import { useHistory } from 'react-router-dom'
import { Image, Menu, Dropdown } from 'antd'
import { ButtonWrapper } from '../NFTButton'
import { SearchBar, TokenToggle } from '../../../components'
import { SpaceBetweenDiv } from '../../../styles'
import PopupCompleteProfile from '../Profile/PopupCompleteProfile'
import { useNFTProfile } from '../../../context'
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'
import { checkMobile } from '../../../utils'
import tw from 'twin.macro'

//#region styles
const HEADER_WRAPPER = styled(SpaceBetweenDiv)`
  ${tw`sm:px-0`}
  padding-top: ${({ theme }) => theme.margin(5.5)};
  padding-bottom: ${({ theme }) => theme.margin(3)};
  padding-left: ${({ theme }) => theme.margin(4)};
  padding-right: ${({ theme }) => theme.margin(4)};
  justify-content: space-between;
  z-index: 5;

  .search-bar {
    ${tw`sm:w-3/4 sm:m-0`}
    @media(max-width: 500px) {
      background: ${({ theme }) => theme.bg9} !important;
    }
    width: 100%;
    max-width: 600px;
    background: ${({ theme }) => theme.bg1};
    height: 45px;
    margin-left: 0;
    border: 1px solid ${({ theme }) => theme.bg1};

    > input {
      @media (max-width: 500px) {
        background: ${({ theme }) => theme.bg9} !important;
      }
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
  ${tw`sm:ml-0`}
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
  ${tw`sm:justify-evenly`}
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

const AVATAR_NFT = styled(Image)`
  border-radius: 50%;
  width: 56px;
  height: 56px;
  cursor: pointer;
  margin-right: ${({ theme }) => theme.margin(1.5)};
`
//#endregion
//eslint-disable-next-line
export const Header = ({
  setFilter,
  filter,
  filteredCollections
}: {
  setFilter: (s: string) => void
  filter: string
  filteredCollections: any[]
}) => {
  const history = useHistory()
  const { sessionUser, setUserCurrency } = useNFTProfile()
  const { isCollapsed } = useNavCollapse()
  const { connected, publicKey, connect } = useWallet()
  const [visibleCompletePopup, setVisibleCompletePopup] = useState<boolean>(false)
  const { setVisible: setModalVisible } = useWalletModal()
  const { mode } = useDarkMode()
  const [isHeaderData, setIsHeaderData] = useState<boolean>(false)

  useEffect(() => {
    setTimeout(() => setIsHeaderData(true), 1000)
    console.log()
  }, [])

  useEffect(() => {
    setTimeout(() => {
      const fetchUserProfileStatus = publicKey ? localStorage.getItem(publicKey.toBase58()) : undefined
      const firstTimeUser = fetchUserProfileStatus
        ? JSON.parse(localStorage.getItem(publicKey.toBase58()))
        : undefined

      if (firstTimeUser && publicKey) {
        if (firstTimeUser.pubKey === publicKey.toBase58() && firstTimeUser.isNew) {
          setVisibleCompletePopup(true)
        }
      }
    }, 750)

    return null
  }, [sessionUser])

  useEffect(() => {
    // TODO: resolve error that keeps being thrown
    if (!connected) {
      connect().catch((e: Error) => {
        console.log(e)
      })
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

  const genMenu = () =>
    filter.length > 0 ? (
      <Menu className={`global-search-dropdown global-search-dropdown-${mode}`}>
        {filteredCollections.length > 0 ? (
          filteredCollections.map((i, k) => (
            <Menu.Item key={k}>
              <URL href={`/NFTs/collection/${i.collection_name.replaceAll(' ', '_')}`}>
                <DETAILS>
                  <TINYIMG
                    src={
                      i.profile_pic_link.length > 0 ? i.profile_pic_link : `/img/assets/nft-preview-${mode}.svg`
                    }
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

  return (
    <HEADER_WRAPPER>
      <PopupCompleteProfile visible={visibleCompletePopup} handleOk={onContinue} handleCancel={onSkip} />
      <AVATAR_WRAPPER>
        {!isHeaderData && !checkMobile() ? (
          <SkeletonCommon width="50px" height="50px" borderRadius="50%" />
        ) : (
          connected &&
          publicKey &&
          !checkMobile() && (
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
            style={{
              minWidth: !checkMobile() ? '550px' : '330px',
              marginLeft: !checkMobile() ? '20px' : '0',
              marginRight: !checkMobile() ? '10px' : '0'
            }}
            height="46px"
            borderRadius="46px"
            width={!checkMobile() ? '350px' : '100%'}
          />
        ) : (
          <Dropdown overlay={genMenu()} trigger={['click']} overlayClassName="nft-home-antd-dropdown">
            <SearchBar className="search-bar" setSearchFilter={setFilter} filter={filter} />
          </Dropdown>
        )}
        {!isHeaderData && checkMobile() ? (
          <SkeletonCommon width="50px" height="50px" borderRadius="50%" />
        ) : (
          connected &&
          publicKey &&
          checkMobile() && (
            <AVATAR_NFT
              fallback={`/img/assets/avatar${mode === 'dark' ? '' : '-lite'}.svg`}
              src={sessionUser ? sessionUser.profile_pic_link : ''}
              preview={false}
              onClick={goProfile}
            />
          )
        )}
      </AVATAR_WRAPPER>
      {!checkMobile() ? (
        <BUTTON_SELECTION>
          {!isHeaderData ? (
            <div style={{ display: 'flex' }}>
              <SkeletonCommon width="149px" height="45px" borderRadius="15px" />
            </div>
          ) : (
            <div style={{ display: 'flex' }}>
              {isCollapsed && !connected && (
                <CONNECT onClick={handleWalletModal}>
                  <span>Connect Wallet</span>
                </CONNECT>
              )}

              <TokenToggle toggleToken={setUserCurrency} tokenA={'SOL'} tokenB={'USD'} />
            </div>
          )}
        </BUTTON_SELECTION>
      ) : (
        <></>
      )}
    </HEADER_WRAPPER>
  )
}
