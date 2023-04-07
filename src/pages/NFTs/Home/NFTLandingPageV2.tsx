/* eslint-disable @typescript-eslint/no-unused-vars */
import { Checkbox, Dropdown, Switch } from 'antd'
import React, { ReactElement, useMemo, useState, FC, useEffect } from 'react'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { SearchBar } from '../../../components'
import NFTAggWelcome, { NFTAggTerms } from '../../../components/NFTAggWelcome'
import {
  useConnectionConfig,
  useDarkMode,
  useNavCollapse,
  useNFTAggregator,
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
import { useConnection } from '@solana/wallet-adapter-react'
import { useHistory } from 'react-router-dom'
import { Image } from 'antd'
import { AH_PROGRAM_IDS } from '../../../web3/agg_program_ids'
import { ModalSlide } from '../../../components/ModalSlide'
import { MODAL_TYPES } from '../../../constants'
import { SVGToPrimary2 } from '../../../styles'
import { USER_CONFIG_CACHE } from '../../../types/app_params'
import { NFTBaseCollection } from '../../../types/nft_collections'
import ShowEyeLite from '../../../animations/showEyelite.json'
import ShowEyeDark from '../../../animations/showEyedark.json'
import Lottie from 'lottie-react'

const CURRENCY_SWITCH = styled.div<{ $currency }>`
  .ant-switch {
    ${tw`h-[26px] sm:h-[26px] sm:w-[50px] w-[50px] ml-auto mr-3`}
    background: linear-gradient(90.95deg, #F7931A 25.41%, #AC1CC7 99.19%) !important;
  }
  .ant-switch-handle {
    ${tw`h-[26px] w-[26px] left-[-2px]  top-[0px]`}
    ::before {
      ${tw`h-[26px] w-[26px] rounded-[40px] duration-500`}
      background-size: 26px;
      background: url(${({ $currency }) => `/img/crypto/${$currency}.svg`}) center;
    }
  }
  .ant-switch-checked {
    .ant-switch-handle {
      left: calc(100% - 25px);
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
  ${tw`dark:text-white text-blue-1 text-[15px] ml-2 flex w-[90px] right-[2%] 
    absolute font-semibold flex items-center duration-500 cursor-pointer mt-1`}
  .showHideClass {
    ${tw`mt-1 mr-2 h-[25px] w-[25px] duration-500  `}
  }
  .showAnimation {
    ${tw`ml-[-35px] h-[80px] w-[80px] duration-500 mr-[-18px] `}
    transform: scale(1.6);
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
  const existingUserCache: USER_CONFIG_CACHE = JSON.parse(window.localStorage.getItem('gfx-user-cache'))

  const { isCollapsed } = useNavCollapse()
  const [showBanner, setShowBanner] = useState<boolean>(false)
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(!existingUserCache.hasAggOnboarded)
  const [showTerms, setShowTerms] = useState<boolean>(false)
  // const [currency, setCurrency] = useState<'SOL' | 'USDC'>('SOL')
  const { currencyView } = useNFTAggregator()

  const handleHasOnboarded = (res: boolean) => {
    setHasOnboarded(false)

    window.localStorage.setItem(
      'gfx-user-cache',
      JSON.stringify({
        ...existingUserCache,
        hasAggOnboarded: true
      })
    )
  }

  return (
    <WRAPPER $navCollapsed={isCollapsed} $currency={currencyView}>
      {<NFTAggTerms setShowTerms={setShowTerms} showTerms={showTerms} setShowPopup={handleHasOnboarded} />}
      {hasOnboarded && <ModalSlide modalType={MODAL_TYPES.NFT_AGG_WELCOME} rewardToggle={handleHasOnboarded} />}
      <MyNFTBag />
      {!checkMobile() && (
        <BannerContainer showBanner={showBanner}>
          <StatsContainer showBanner={showBanner} setShowBanner={setShowBanner} />
          <NFTBanners showBanner={showBanner} />
        </BannerContainer>
      )}
      <FiltersContainer />

      <NFTCollectionsTable showBanner={showBanner} />
    </WRAPPER>
  )
}

const FiltersContainer = () => {
  const [poolIndex, setPoolIndex] = useState<number>(0)
  const [timelineIndex, setTimelineIndex] = useState<number>(0)
  const [timelineName, setTimelineName] = useState<string>('24h')
  const [poolFilter, setPoolFilter] = useState<string>('Popular')
  const [searchFilter, setSearchFilter] = useState<string>(undefined)
  const [searchPopup, setSearchPopup] = useState<boolean>(false)
  const [menuPopup, setMenuPopup] = useState<boolean>(false)
  const { connection } = useConnectionConfig()
  const history = useHistory()
  const { mode } = useDarkMode()

  const { sessionUser, setSessionUser, fetchSessionUser } = useNFTProfile()
  const goProfile = () => sessionUser && history.push(`/nfts/profile/${sessionUser.pubkey}`)

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
            {sessionUser && (
              <AVATAR_NFT
                fallback={`/img/assets/avatar${mode === 'dark' ? '' : '-lite'}.svg`}
                src={sessionUser.profile_pic_link}
                preview={false}
                onClick={goProfile}
              />
            )}
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

          {searchFilter && <SearchResultContainer searchFilter={searchFilter} />}
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
          {/* <CurrencySwitch /> */}
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

          {sessionUser && (
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
  const { mode } = useDarkMode()
  const eyeImg = `/img/assets/hideEye.svg`
  return (
    <EYE_CONTAINER onClick={() => setShowBanner((prev) => !prev)}>
      {!showBanner ? (
        <Lottie
          className="showAnimation"
          tw="scale-150"
          animationData={mode === 'dark' ? ShowEyeDark : ShowEyeLite}
        />
      ) : mode === 'dark' ? (
        <img className="showHideClass" src={eyeImg} alt="eye-image" />
      ) : (
        <SVGToPrimary2 className="showHideClass" src={eyeImg} alt="eye-image" />
      )}

      {/* {mode === 'dark' ? <img className='showHideClass' src={eyeImg} alt="eye-image" /> :
          <SVGToPrimary2 src={eyeImg} alt="eye-image" />} */}
      {showBanner ? 'Hide' : 'Show'}
    </EYE_CONTAINER>
  )
}

const CurrencySwitch = (): ReactElement => {
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
    if (!searchFilter || searchFilter.length < 3) return allCollections
    const searchFiltered = [...allCollections].filter((result: NFTBaseCollection) => {
      const collectionName = result.collection_name ? result.collection_name.toLowerCase() : ''
      if (collectionName.includes(searchFilter && searchFilter.toLowerCase())) return true
    })
    return searchFiltered
  }, [searchFilter])

  const history = useHistory()

  return (
    <SEARCH_RESULT_CONTAINER>
      {searchResultArr.map((data: NFTBaseCollection, index) => (
        <div
          className="searchResultRow"
          key={index}
          onClick={() => history.push(`/nfts/collection/${data.collection_name.replaceAll(' ', '_')}`)}
        >
          <img src={data.profile_pic_link} alt="" />
          <div className="searchText">{data.collection_name}</div>
        </div>
      ))}
    </SEARCH_RESULT_CONTAINER>
  )
}

const StatsContainer = ({ showBanner, setShowBanner }: any) => (
  <NFT_STATS_CONTAINER>
    <StatsButton title={'Total volume traded:'} data={'22M'} />
    <StatsButton title={'Total traded:'} data={'22M'} />
    <StatsButton title={'Total Volume:'} data={'5M'} />
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
  const { mode } = useDarkMode()

  useEffect(() => {
    setArrow(true)
    return () => setArrow(false)
  }, [])

  return (
    <DROPDOWN_CONTAINER tw="w-[173px] h-[211px] overflow-y-auto">
      {Object.keys(AH_PROGRAM_IDS)
        .filter((addr) => AH_PROGRAM_IDS[addr] !== 'Unknown')
        .map((addr) => (
          <div
            tw="flex p-2 items-center cursor-pointer hover:opacity-80"
            key={addr}
            onClick={() => console.log(AH_PROGRAM_IDS[addr])}
          >
            <div>
              <Image
                className="marketImg"
                fallback={`/img/assets/avatar${mode === 'dark' ? '' : '-lite'}.svg`}
                src={`/img/assets/Aggregator/${AH_PROGRAM_IDS[addr]}.svg`}
                preview={false}
              />
            </div>
            <div tw="ml-2">{AH_PROGRAM_IDS[addr]}</div>
            <div className="checkboxContainer">
              <input type="checkbox" onClick={() => console.log('s')} />
            </div>
          </div>
        ))}
    </DROPDOWN_CONTAINER>
  )
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
