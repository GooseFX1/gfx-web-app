/* eslint-disable */
import { useMemo, useState } from 'react'
import tw, { styled } from 'twin.macro'
import { useWallet } from '@solana/wallet-adapter-react'
import { DropdownPairs } from '../DropdownPairs'
import { useCrypto, useOrderBook, usePriceFeed } from '../../../context'
import { getPerpsPrice } from '../perps/utils'
import { Loader } from '../../../components'
import 'styled-components/macro'
import { Drawer } from 'antd'
import { UserProfile } from './UserProfile'
import { SkeletonCommon } from '../../NFTs/Skeleton/SkeletonCommon'

const HEADER = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px;

  .up24h {
    color: #50bb35;
  }
  .down24h {
    color: #f06565;
  }
  .change-icn {
    margin-right: 4px;
  }
  .ant-drawer-body {
    padding: 0;
  }
  .open-orders {
    position: absolute;
    top: -5px;
    right: -5px;
    font-weight: 600;
    font-size: 13px;
    color: #ffffff;
    height: 18px;
    width: 18px;
    background: linear-gradient(127.87deg, #f7931a 9.69%, #dc1fff 111.25%);
    text-align: center;
    border-radius: 50%;
  }
`

export const Header = () => {
  const { connected, wallet } = useWallet()
  const { selectedCrypto, isSpot } = useCrypto()
  const { perpsOpenOrders, orderBook } = useOrderBook()
  const { prices, tokenInfo } = usePriceFeed()
  const [userProfile, setUserProfile] = useState<boolean>(false)
  const marketData = useMemo(() => prices[selectedCrypto.pair], [prices, selectedCrypto.pair])
  const tokenInfos = useMemo(() => tokenInfo[selectedCrypto.pair], [tokenInfo[selectedCrypto.pair]])
  const changeValue = tokenInfos ? tokenInfos.change : ' '
  const publicKey = useMemo(() => wallet?.adapter.publicKey, [wallet, connected])
  const publicKeyUi = publicKey && publicKey.toString().slice(0, 2)
  const elem = document.getElementById('dex-mobi-home')
  let classNameChange = ''
  if (changeValue && changeValue.substring(0, 1) === '-') classNameChange = 'down24h'
  else if (changeValue && changeValue.substring(0, 1) === '+') classNameChange = 'up24h'

  const tokenPrice = useMemo(() => {
    if (isSpot) {
      return !marketData || !marketData.current ? null : marketData.current
    } else {
      const oPrice = getPerpsPrice(orderBook)
      return !oPrice ? null : oPrice
    }
  }, [isSpot, selectedCrypto, orderBook])

  return (
    <HEADER>
      {userProfile && (
        <Drawer
          title={null}
          placement="bottom"
          closable={false}
          key="bottom"
          open={true}
          getContainer={elem}
          height="520px"
          className="user-profile-drawer"
        >
          <UserProfile setUserProfile={setUserProfile} />
        </Drawer>
      )}
      {!tokenPrice ? (
        <div tw="w-full">
          <SkeletonCommon width="100%" height="50px" />
        </div>
      ) : (
        <>
          <div tw="flex flex-row">
            {connected && publicKey && (
              <div
                onClick={() => {
                  setUserProfile(true)
                }}
                tw="h-10 w-10 rounded-circle flex items-center justify-center border-[#cacaca] border border-solid text-grey-4 mr-2.5 font-semibold relative"
              >
                {publicKeyUi}{' '}
                {!isSpot && (
                  <span className="open-orders">{perpsOpenOrders.length > 0 ? perpsOpenOrders.length : 0}</span>
                )}
              </div>
            )}
            <DropdownPairs />
          </div>
          <div tw="flex flex-col">
            <span tw="text-lg text-grey-5 font-semibold">$ {tokenPrice}</span>
            <div tw="flex flex-row items-center">
              {classNameChange === 'up24h' ? (
                <img className="change-icn" src="/img/assets/24hourup.png" height="10" alt="up-icon" />
              ) : (
                <img className="change-icn" src="/img/assets/24hourdown.svg" height="10" alt="down-icon" />
              )}
              <span className={classNameChange} tw="text-tiny text-grey-5 font-semibold">
                {' (' + changeValue + '%)'}
              </span>
            </div>
          </div>
        </>
      )}
    </HEADER>
  )
}
