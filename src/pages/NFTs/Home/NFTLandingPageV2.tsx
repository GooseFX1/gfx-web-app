/* eslint-disable @typescript-eslint/no-unused-vars */
import { Dropdown, Switch } from 'antd'
import React, { ReactElement, useMemo, useState, FC, useEffect } from 'react'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { SearchBar } from '../../../components'
import { NFTAggTerms } from '../../../components/NFTAggWelcome'
import {
  useConnectionConfig,
  useDarkMode,
  useNavCollapse,
  useNFTCollections,
  useNFTDetails,
  useNFTProfile
} from '../../../context'
import { checkMobile } from '../../../utils'
import { STYLED_BUTTON } from '../../Farm/FarmFilterHeader'
import MenuNFTPopup from './MenuNFTPopup'
import { NFT_STATS_CONTAINER, SEARCH_RESULT_CONTAINER, STATS_BTN } from './NFTAggregator.styles'
import NFTBanners from './NFTBanners'
import NFTCollectionsTable from './NFTCollectionsTable'
import SearchNFTMobile from './SearchNFTMobile'
import { Arrow } from '../../../components/common/Arrow'
import { DROPDOWN_CONTAINER } from '../Collection/CollectionV2.styles'
import MyNFTBag from '../MyNFTBag'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useHistory } from 'react-router-dom'
import { Image } from 'antd'

const CURRENCY_SWITCH = styled.div<{ $currency }>`
  .ant-switch {
    ${tw`h-[40px] sm:h-[35px] sm:w-[65px] w-[75px] ml-auto mr-3`}
    background: linear-gradient(90.95deg, #F7931A 25.41%, #AC1CC7 99.19%) !important;
  }
  .ant-switch-handle {
    ${tw`w-[40px] h-[40px] left-[2px] top-[1px]`}
    ::before {
      ${tw`w-[38px] h-[38px] sm:w-[32px] sm:h-[32px] rounded-[40px] duration-500`}
      background:url(${({ $currency }) => `/img/crypto/${$currency}.svg`}) no-repeat center;
    }
  }
  .ant-switch-checked {
    .ant-switch-handle {
      left: calc(100% - 35px);
    }
    background: linear-gradient(90.95deg, #f7931a 25.41%, #ac1cc7 99.19%) !important;
  }
`
const WRAPPER = styled.div<{ $navCollapsed; $currency }>`
  /* padding-top: ${({ $navCollapsed }) => ($navCollapsed ? '0px' : '80px')}; */
  transition: 0.5s ease;
  font-family: 'Montserrat';
  font-style: normal;
  .search-bar {
    transition: 0.5s ease;
    ${tw`sm:w-0`}
  }
  .flexContainer {
    ${tw`h-[40px] flex ml-[10px] mb-4`}
  }
  .iconImg {
    ${tw`h-[40px] w-[40px] rounded flex items-center justify-center rounded-full	mr-3 `}
    border: 1px solid #cacaca;
    background: ${({ theme }) => theme.bg0};
  }
`
const BannerContainer = styled.div<{ showBanner: boolean }>`
  ${({ showBanner }) => css`
    height: 'fit-content';
    ${tw`mt-[35px] duration-500`}
  `}
`

const EYE_CONTAINER = styled.div`
  ${tw`text-[15px] ml-2 flex w-[90px] right-[2%] absolute font-semibold  duration-500 cursor-pointer mt-1`}
  img {
    ${tw` mr-2 h-[25px] w-[25px] duration-500  `}
  }
`
const FILTERS_CONTAINER = styled.div`
  ${tw`flex mt-[15px] sm:mt-[20px]`}
  .profilePic {
    ${tw`w-11 mr-5 ml-2 h-11 rounded-full cursor-pointer`}
  }
  .dropdownBtn {
    ${tw`rounded-full flex justify-center border-none dark:bg-[#1f1f1f] justify-between p-1 pr-2 cursor-pointer
      bg-white items-center text-[#3c3c3c] mx-2 dark:text-[#fff] font-semibold text-[15px]`}
  }
  &.ant-dropdown {
    ${tw`dark:bg-[#3c3c3c] h-[50px] w-[100px] bg-[pink]
      bg-white items-center text-[#3c3c3c] mx-2 dark:text-[#fff] font-semibold text-[15px]`}
  }
  .dropdownContainer {
    ${tw`dark:bg-[#3c3c3c] h-[50px] w-[100px] bg-[pink]
      bg-white items-center text-[#3c3c3c] mx-2 dark:text-[#fff] font-semibold text-[15px]`}
  }
`

const AVATAR_NFT = styled(Image)`
  ${tw`h-11 w-11 rounded-full cursor-pointer mr-5`}
`
export const ButtonContainer = styled.div<{ $poolIndex: number }>`
  ${tw`relative z-0 mr-1`}
  .slider-animation-timeline {
    ${tw`absolute w-[60px] h-[44px] rounded-[36px]  z-[-1]`}
    left: ${({ $poolIndex }) => $poolIndex * 25}%;
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    transition: left 500ms ease-in-out;
  }
  .slider-animation {
    ${tw`absolute w-[85px] h-[44px] rounded-[36px]  z-[-1]`}
    left: ${({ $poolIndex }) => $poolIndex * 50}%;
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    transition: left 500ms ease-in-out;
  }
  .slider-animation-web {
    ${tw`absolute w-[40%] h-[44px] rounded-[36px] z-[-1]`}
    left: ${({ $poolIndex }) => $poolIndex * 50 + 4.5}%;
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    transition: left 500ms ease-in-out;
  }
  .selectedBackground {
    ${tw`text-white duration-500`}
    @media (max-width: 500px) {
      background: none;
    }
  }
`

const MOBILE_FILTERS_HEADER = styled.div`
  .flexContainer {
    ${tw`h-[40px] flex ml-[10px] mb-4`}
  }
  .iconImg {
    ${tw`h-[40px] w-[40px] rounded flex items-center justify-center rounded-full mr-3`}
    border: 1px solid #cacaca;
    background: ${({ theme }) => theme.bg0};
  }
`

const poolTypes = [{ name: 'Popular' }, { name: 'Trending' }]
const timelineVolume = [{ name: '24h' }, { name: '7d' }, { name: '30d' }, { name: 'All' }]

const NFTLandingPageV2 = (): ReactElement => {
  const { isCollapsed } = useNavCollapse()
  const [showBanner, setShowBanner] = useState<boolean>(true)
  const [showPopup, setShowPopup] = useState<boolean>(false)
  const [showTerms, setShowTerms] = useState<boolean>(false)
  const [currency, setCurrency] = useState<'SOL' | 'USDC'>('SOL')

  return (
    <WRAPPER $navCollapsed={isCollapsed} $currency={currency}>
      {/* {<NFTAggTerms setShowTerms={setShowTerms} showTerms={showTerms} setShowPopup={setShowPopup} />} */}
      <MyNFTBag />
      {!checkMobile() && (
        <BannerContainer showBanner={showBanner}>
          <StatsContainer showBanner={showBanner} setShowBanner={setShowBanner} />
          <NFTBanners showBanner={showBanner} />
        </BannerContainer>
      )}
      <FiltersContainer setCurrency={setCurrency} />

      <NFTCollectionsTable showBanner={showBanner} />
    </WRAPPER>
  )
}

const FiltersContainer = ({ setCurrency }: any) => {
  const [poolIndex, setPoolIndex] = useState<number>(0)
  const [timelineIndex, setTimelineIndex] = useState<number>(0)
  const [timelineName, setTimelineName] = useState<string>('24h')
  const [poolFilter, setPoolFilter] = useState<string>('Popular')
  const [searchFilter, setSearchFilter] = useState<string>(undefined)
  const [searchPopup, setSearchPopup] = useState<boolean>(false)
  const [menuPopup, setMenuPopup] = useState<boolean>(true)
  const { connected, publicKey } = useWallet()
  const { connection } = useConnectionConfig()
  const history = useHistory()
  const { mode } = useDarkMode()

  const { sessionUser, setSessionUser, fetchSessionUser } = useNFTProfile()
  const goProfile = () => history.push(`/NFTs/profile/${publicKey.toBase58()}`)

  useEffect(() => {
    if (connected && publicKey) {
      if (!sessionUser || sessionUser.pubkey !== publicKey.toBase58()) {
        fetchSessionUser('address', publicKey.toBase58(), connection).then((res) => {
          if (res && res.status === 200) {
            const userProfileStatus = localStorage.getItem(publicKey.toBase58())
            if (res.data.length === 0 && userProfileStatus === null) {
              localStorage.setItem(
                publicKey.toBase58(),
                JSON.stringify({ pubKey: publicKey.toBase58(), isNew: true })
              )
            } else {
              localStorage.setItem(
                publicKey.toBase58(),
                JSON.stringify({ pubKey: publicKey.toBase58(), isNew: false })
              )
            }
          } else {
            console.error(res)
          }
        })
      }
    } else {
      setSessionUser(undefined)
    }
    return null
  }, [publicKey, connected])

  const handleClick = (poolName, index) => {
    setPoolIndex(index)
    setPoolFilter(poolName)
  }

  const handleClickTimeline = (poolName, index) => {
    setTimelineIndex(index)
    setTimelineName(poolName)
  }
  if (checkMobile())
    return (
      <div>
        <SearchNFTMobile searchPopup={searchPopup} setSearchPopup={setSearchPopup} />
        <MenuNFTPopup menuPopup={menuPopup} setMenuPopup={setMenuPopup} />
        <FILTERS_CONTAINER>
          <div className="flexContainer">
            <div className="iconImg">
              <img
                style={{ height: '20px', width: '20px' }}
                onClick={() => setSearchPopup(true)}
                src={`/img/assets/search.svg`}
              />
            </div>
            <div className="iconImg" onClick={() => setMenuPopup(true)}>
              <img src={`/img/assets/Aggregator/menu.svg`} />
            </div>
            <div className="iconImg">
              <img src={`/img/assets/Aggregator/menu.svg`} />
            </div>
          </div>
          <ButtonContainer $poolIndex={poolIndex} style={{ marginLeft: 'auto' }}>
            <div className="slider-animation"></div>
            {poolTypes.map((pool, index) => (
              <STYLED_BUTTON
                key={pool.name}
                style={{ width: 85, marginRight: 10 }}
                onClick={() => handleClick(pool.name, index)}
                className={pool.name === poolFilter ? 'selectedBackground' : ''}
              >
                {pool.name}
              </STYLED_BUTTON>
            ))}
          </ButtonContainer>

          {/* {searchFilter && <SearchResultContainer searchFilter={searchFilter} />} */}
        </FILTERS_CONTAINER>
        <div className="flexContainer" style={{ marginBottom: 20 }}>
          <ButtonContainer $poolIndex={timelineIndex}>
            <div className="slider-animation-timeline"></div>
            {timelineVolume.map((timeline, index) => (
              <STYLED_BUTTON
                style={{ width: 60 }}
                key={timeline.name}
                onClick={() => handleClickTimeline(timeline.name, index)}
                className={timeline.name === timelineName ? 'selectedBackground' : ''}
              >
                {timeline.name}
              </STYLED_BUTTON>
            ))}
          </ButtonContainer>
          <CurrencySwitch />
        </div>
      </div>
    )
  else
    return (
      <FILTERS_CONTAINER>
        <SearchBar
          className="search-bar"
          setSearchFilter={setSearchFilter}
          placeholder="Search by collections or markets"
        />
        <ButtonContainer $poolIndex={poolIndex}>
          <div className="slider-animation-web"></div>
          {poolTypes.map((pool, index) => (
            <STYLED_BUTTON
              key={pool.name}
              onClick={() => handleClick(pool.name, index)}
              className={pool.name === poolFilter ? 'selectedBackground' : ''}
            >
              {pool.name}
            </STYLED_BUTTON>
          ))}
        </ButtonContainer>
        {searchFilter && <SearchResultContainer searchFilter={searchFilter} />}
        <div tw="flex items-center mr-6 ml-auto">
          <MarketDropdown />
          <TimeLineDropdown />
          <div>
            {' '}
            <img className="profilePic" src="/img/assets/refresh.svg" />{' '}
          </div>

          {publicKey && (
            <AVATAR_NFT
              fallback={`/img/assets/avatar${mode === 'dark' ? '' : '-lite'}.svg`}
              src={sessionUser ? sessionUser.profile_pic_link : ''}
              preview={false}
              onClick={goProfile}
            />
          )}
        </div>
      </FILTERS_CONTAINER>
    )
}

const ShowBannerEye = ({ showBanner, setShowBanner }: any) => {
  const eyeImg = `/img/assets/${showBanner ? `show` : `hide`}Eye.svg`
  return (
    <EYE_CONTAINER onClick={() => setShowBanner((prev) => !prev)}>
      <div>
        <img src={eyeImg} alt="" />
        {showBanner ? 'Show' : 'Hide'}
      </div>
    </EYE_CONTAINER>
  )
}
export const CurrencySwitch = (): ReactElement => {
  const [currency, setCurrency] = useState<'SOL' | 'USDC'>('SOL')

  const changeCurrency = () => {
    setCurrency((prev) => (prev === 'SOL' ? 'USDC' : 'SOL'))
  }
  return (
    <CURRENCY_SWITCH $currency={currency} style={{ marginLeft: 'auto' }}>
      <Switch onChange={changeCurrency} />
    </CURRENCY_SWITCH>
  )
}
const SearchResultContainer = ({ searchFilter }: any) => {
  const { allCollections } = useNFTCollections()
  const searchResultArr = useMemo(() => {
    if (!searchFilter) return allCollections
    const searchFiltered = allCollections.filter((result) => {
      const collectionName = result.collection_name.toLowerCase()
      if (collectionName.includes(searchFilter.toLowerCase())) return true
    })
    return searchFiltered
  }, [searchFilter])

  return (
    <SEARCH_RESULT_CONTAINER>
      {searchResultArr.map((data, index) => (
        <div className="searchResultRow" key={index}>
          <img src={data.profile_pic_link} alt="" />
          <div className="searchText">{data.collection_name}</div>
        </div>
      ))}
    </SEARCH_RESULT_CONTAINER>
  )
}

const StatsContainer = ({ showBanner, setShowBanner }: any) => (
  <NFT_STATS_CONTAINER>
    <StatsButton title={'Total volume traded:'} data={'2332'} />
    <StatsButton title={'Total traded:'} data={'2332'} />
    <StatsButton title={'Total Volume:'} data={'2010'} />
    <ShowBannerEye showBanner={showBanner} setShowBanner={setShowBanner} />
  </NFT_STATS_CONTAINER>
)
const StatsButton: FC<{ title: string; data: string | number }> = ({ title, data }) => (
  <STATS_BTN>
    <div className="innerCover">
      <div className="innerTitle">{title}</div>
      <div className="innerData">{data}</div>
    </div>
  </STATS_BTN>
)

const TimeLineDropdown = (): ReactElement => {
  const [arrow, setArrow] = useState<boolean>(false)
  return (
    <Dropdown
      align={{ offset: [0, 16] }}
      destroyPopupOnHide
      overlay={<TimelineDropdownContents setArrow={setArrow} />}
      placement="bottomRight"
      trigger={['click']}
    >
      <div className="dropdownBtn" tw="h-[44px] w-[104px] ">
        <div tw="ml-6">All</div>
        <Arrow height="9px" width="18px" invert={arrow} />
      </div>
    </Dropdown>
  )
}

const MarketDropdown = (): ReactElement => {
  const [arrow, setArrow] = useState<boolean>(false)
  return (
    <Dropdown
      align={{ offset: [0, 16] }}
      destroyPopupOnHide
      overlay={<MarketDropdownContents setArrow={setArrow} />}
      placement="bottomRight"
      trigger={['click']}
    >
      <div className="dropdownBtn" tw="h-[44px] w-[173px]">
        <img src="/img/assets/Aggregator/menu.svg" />
        <div>All</div>
        <Arrow height="9px" width="18px" invert={arrow} />
      </div>
    </Dropdown>
  )
}
const MarketDropdownContents = ({ setArrow }: any): ReactElement => {
  useEffect(() => {
    setArrow(true)
    return () => {
      setArrow(false)
    }
  }, [])

  return <DROPDOWN_CONTAINER tw="w-[173px] h-[211px]">List of markets</DROPDOWN_CONTAINER>
}

const TimelineDropdownContents = ({ setArrow }: any): ReactElement => {
  useEffect(() => {
    setArrow(true)
    return () => {
      setArrow(false)
    }
  }, [])

  return <DROPDOWN_CONTAINER tw="w-[173px] h-[211px]">List of time line</DROPDOWN_CONTAINER>
}

export default NFTLandingPageV2
