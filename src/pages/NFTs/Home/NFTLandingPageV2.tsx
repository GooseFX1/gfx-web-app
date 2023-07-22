/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactElement, useMemo, useState, FC, useEffect, useCallback, useRef } from 'react'
import styled, { css } from 'styled-components'
import { Pill, SearchBar, TokenToggleNFT } from '../../../components'
import { NFTAggWelcome } from '../../../components/NFTAggWelcome'
import {
  useDarkMode,
  useNFTAggregator,
  useNFTAggregatorFilters,
  useNFTCollections,
  useNFTDetails,
  useNFTProfile
} from '../../../context'
import { checkMobile, commafy, LOADING_ARR } from '../../../utils'
import { truncateBigNumber } from '../../TradeV3/perps/utils'
import {
  LastRefreshedAnimation,
  RefreshIcon,
  STYLED_BUTTON,
  useAnimateButtonSlide
} from '../../Farm/FarmFilterHeader'
import { SEARCH_RESULT_CONTAINER } from './NFTAggregator.styles'
import NFTBanners from './NFTBanners'
import NFTCollectionsTable from './NFTCollectionsTable'
import SearchNFTMobile from './SearchNFTMobile'
import { Arrow, CircularArrow } from '../../../components/common/Arrow'
import { RotatingLoader } from '../../../components/RotatingLoader'
import { DROPDOWN_CONTAINER } from '../Collection/CollectionV2.styles'
import { useHistory } from 'react-router-dom'
import { Image, Dropdown } from 'antd'
import { AH_PROGRAM_IDS, AH_NAME } from '../../../web3'
import { SVGToPrimary2 } from '../../../styles'
import { USER_CONFIG_CACHE } from '../../../types/app_params'
import ShowEyeLite from '../../../animations/showEyelite.json'
import ShowEyeDark from '../../../animations/showEyedark.json'
import Lottie from 'lottie-react'
import {
  fetchGlobalSearchNFT,
  fetchNestAggStats,
  StatsResponse,
  NFT_COL_FILTER_OPTIONS,
  TIMELINE
} from '../../../api/NFTs'
import tw from 'twin.macro'
import 'styled-components/macro'
import { minimizeTheString } from '../../../web3/nfts/utils'
import { useWallet } from '@solana/wallet-adapter-react'
import debounce from 'lodash.debounce'

const NFT_AGG_WRAP = styled.div<{ $currency }>`
  height: 100%;
  transition: 0.5s ease;
  font-family: 'Montserrat';
  font-style: normal;
  ${({ theme }) => theme.customScrollBar(0)}
  .addBorder {
    border: 1px solid #b5b5b5 !important;
  }
  .lastRefreshed {
    ${tw`flex flex-col h-[0px] justify-end items-center w-full sm:text-sm`}
    color: ${({ theme }) => theme.tabNameColor};
    animation: openAnimation 3s ease-in-out;
  }

  .no-dp-avatar-sm {
    ${tw` h-11 w-11 rounded-full cursor-pointer 
    text-grey-1  bg-white text-[14px] font-semibold justify-center
          dark:bg-black-4 dark:text-grey-4 flex items-center p-0.5 `}
    border: 1.5px solid #B5B5B5 !important;
  }

  @keyframes openAnimation {
    0% {
      height: 0px;
    }
    30% {
      height: 64px;
    }
    50% {
      height: 64px;
    }
    100% {
      height: 0px;
    }
  }
  .search-bar {
    transition: 0.5s ease;
    ${tw`sm:w-0 !w-[100%] !w-[425px]`}
  }
  .comingSoon {
    ${tw`text-grey-2`}
  }
  .flexContainer {
    ${tw`h-8.75 flex ml-[10px] sm:ml-[15px]`}
  }
  .iconImg {
    ${tw`h-8.75 w-8.75 rounded flex items-center justify-center rounded-full	mr-3 `}
    border: 1px solid #cacaca;
    background: ${({ theme }) => theme.bg0};
  }
`
const BannerContainer = styled.div<{ showBanner: boolean }>`
  ${({ showBanner }) => css`
    height: 'fit-content';
    ${tw`duration-500`}
  `}
  .lastRefreshed {
    ${tw`flex flex-col h-[0px] mt-[-10px] justify-end items-center w-full sm:text-sm`}
    color: ${({ theme }) => theme.tabNameColor};
    animation: openAnimation 3s ease-in-out;
  }

  @keyframes openAnimation {
    0% {
      height: 0px;
    }
    30% {
      height: 64px;
    }
    50% {
      height: 64px;
    }
    100% {
      height: 0px;
    }
  }
`

const EYE_CONTAINER = styled.div`
  ${tw`dark:text-white text-blue-1 text-[15px] ml-2 flex w-[90px] right-[2%] 
    absolute font-semibold flex items-center duration-500 cursor-pointer mt-1`}
  .showHideClass {
    ${tw`mt-1 mr-2 h-[25px] w-[25px] duration-500  `}
  }
  .showAnimation {
    ${tw`ml-[-30px] h-[60px] w-[60px] duration-500 mr-[-8px] `}
    transform: scale(2);
  }
`
const FILTERS_CONTAINER = styled.div`
  ${tw`flex mt-[15px]`}
  .profilePic {
    ${tw`w-11 mr-5 ml-2 h-11 rounded-full cursor-pointer`}
  }
  .dropdownBtn {
    ${tw`rounded-full flex justify-center border-none dark:bg-black-2 justify-between p-1 pr-2 cursor-pointer
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
const PROFILE_PIC_WRAPPER = styled.div`
  .customProfileImg {
    border: 1px solid ${({ theme }) => theme.text33};
  }

  .avatarNFTMedium {
    ${tw`h-[100px] w-[100px] rounded-full cursor-pointer mr-5`}
  }
  .userPopupProfilePic {
    ${tw`h-[100px] w-[100px] rounded-full cursor-pointer sm:h-[70px] sm:w-[70px]`}
  }
`

export const ButtonContainer = styled.div<{ $poolIndex: number }>`
  ${tw`relative z-0 mr-1 ml-2 sm:ml-0`}
  .slider-animation-timeline {
    ${tw`absolute w-[81px] sm:w-[75px] h-8.75 rounded-[36px]  z-[-1]`}
    left: ${({ $poolIndex }) => $poolIndex * 50}%;
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    transition: left 500ms ease-in-out;
  }
  .slider-animation {
    ${tw`absolute w-[81px] sm:w-[75px] h-8.75 rounded-[36px]  z-[-1]`}
    /* left: ${({ $poolIndex }) => $poolIndex * 50}%; */
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    transition: left 500ms ease-in-out;
  }
  .slider-animation-web {
    ${tw`absolute w-[45%] h-8.75 rounded-[36px] z-[-1]`}
    left: ${({ $poolIndex }) => $poolIndex * 50 + 4.5}%;
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    transition: left 500ms ease-in-out;
  }
  .selectedBackground {
    ${tw`text-white font-semibold duration-500`}
    @media (max-width: 500px) {
      background: none;
    }
  }
`

const poolTypes = [{ name: 'Popular' }, { name: 'Trending' }]
const timelineVolume = [
  { name: TIMELINE.TWENTY_FOUR_H, title: 'Popular' },
  { name: TIMELINE.SEVEN_D, title: 'Trending' }
]
const SORT_FILTER_OPTIONS = {
  0: NFT_COL_FILTER_OPTIONS.DAILY_VOLUME,
  1: NFT_COL_FILTER_OPTIONS.WEEKLY_VOLUME
}

const FiltersContainer = () => {
  const [poolIndex, setPoolIndex] = useState<number>(0)
  const [timelineIndex, setTimelineIndex] = useState<number>(0)
  const [timelineName, setTimelineName] = useState<string>(TIMELINE.TWENTY_FOUR_H)
  const [poolFilter, setPoolFilter] = useState<string>('Popular')
  const [searchFilter, setSearchFilter] = useState<string>(undefined)
  const [searchPopup, setSearchPopup] = useState<boolean>(false)
  const { setCurrency } = useNFTAggregator()
  const { setPageNumber, pageNumber } = useNFTAggregatorFilters()
  const { wallet } = useWallet()
  const { mode } = useDarkMode()
  const { setTimelineDisplay, setSortFilter, setSortType, sortType, timelineDisplay } = useNFTAggregatorFilters()
  const { setAllCollections } = useNFTCollections()
  const { sessionUser } = useNFTProfile()
  const buttonRefs = useRef<HTMLButtonElement[]>([])
  const sliderRef = useRef<HTMLDivElement>(null)
  const { handleSlide } = useAnimateButtonSlide(sliderRef, buttonRefs)

  useEffect(() => {
    if (timelineDisplay === TIMELINE.SEVEN_D && sortType === 'DESC') {
      setPoolIndex(1)
      setPoolFilter('Trending')
    }
    if (timelineDisplay === TIMELINE.TWENTY_FOUR_H && sortType === 'DESC') {
      setPoolIndex(0)
      setPoolFilter('Popular')
    }
  }, [sortType, timelineDisplay])

  const handleClick = (poolName, index) => {
    setAllCollections(LOADING_ARR)
    setPoolIndex(index)
    setPoolFilter(poolName)
    handleSlide(index)
    if (pageNumber > 0) setPageNumber(0)

    if (poolName === 'Trending') {
      setSortFilter(NFT_COL_FILTER_OPTIONS.WEEKLY_VOLUME)
      setSortType('DESC')
      setTimelineDisplay(TIMELINE.SEVEN_D)
    }
    if (poolName === 'Popular') {
      setSortFilter(NFT_COL_FILTER_OPTIONS.DAILY_VOLUME)
      setSortType('DESC')
      setTimelineDisplay(TIMELINE.TWENTY_FOUR_H)
    }
  }

  const handleClickTimeline = useCallback(
    (poolName, index) => {
      if (pageNumber > 0) setPageNumber(0)
      setSortFilter(SORT_FILTER_OPTIONS[index])
      setTimelineIndex(index)
      setTimelineName(poolName)
      setTimelineDisplay(poolName)
    },
    [setPageNumber, setSortFilter, setTimelineIndex, setTimelineName, setTimelineDisplay, pageNumber]
  )

  useEffect(() => {
    console.log(sessionUser ? 'LANDING - Session user - ' + sessionUser.pubkey : ' LANDING NO SESSION USER')
  }, [sessionUser])

  const searchModal = useMemo(() => {
    if (searchPopup) return <SearchNFTMobile searchPopup={searchPopup} setSearchPopup={setSearchPopup} />
  }, [searchPopup])

  const openSearchModal = useMemo(() => {
    if (searchFilter) return <SearchResultContainer searchFilter={searchFilter} />
  }, [searchFilter])

  if (checkMobile())
    return (
      <div>
        {searchModal}
        <FILTERS_CONTAINER>
          <div className="flexContainer">
            <div className="iconImg">
              <img
                tw="h-8.75 w-8.75"
                onClick={() => setSearchPopup(true)}
                src={`/img/assets/Aggregator/search-${mode}.svg`}
              />
            </div>
          </div>

          {openSearchModal}
          <div className="flexContainer" tw="!ml-0">
            <ButtonContainer $poolIndex={timelineIndex}>
              <div className="slider-animation-timeline"></div>
              {timelineVolume.map((timeline, index) => (
                <STYLED_BUTTON
                  style={{ width: 81 }}
                  key={timeline.name}
                  onClick={() => handleClickTimeline(timeline.name, index)}
                  className={timeline.name === timelineName ? 'selectedBackground' : ''}
                >
                  {timeline.title}
                </STYLED_BUTTON>
              ))}
            </ButtonContainer>
          </div>
          <div tw="ml-auto">
            <div tw="sm:mt-0 sm:mr-[15px] mt-2.5 mr-2.5 flex">
              <TokenToggleNFT toggleToken={setCurrency} />
              {sessionUser && wallet?.adapter?.publicKey && <CurrentUserProfilePic />}
            </div>
          </div>
          {/* mobile */}
        </FILTERS_CONTAINER>
      </div>
    )
  else
    return (
      <FILTERS_CONTAINER>
        <SearchBar
          className="search-bar"
          filter={searchFilter}
          cssStyle={tw`text-black-4 !font-semibold dark:text-grey-5 h-8.75`}
          bgColor={mode === 'dark' ? '#1c1c1c' : '#fff'}
          setSearchFilter={setSearchFilter}
          placeholder="Search by collections"
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
        {/* Web */}
        {searchFilter && <SearchResultContainer searchFilter={searchFilter} />}
        <div tw="flex items-center mr-6 ml-auto">
          {/* <MarketDropdown /> */}
          <TimeLineDropdown />
          <div tw="ml-4">
            <RefreshBtnWithAnimationNFT />
          </div>

          {sessionUser && wallet?.adapter?.publicKey && (
            <div tw="ml-4">
              <CurrentUserProfilePic />
            </div>
          )}
        </div>
      </FILTERS_CONTAINER>
    )
}
export const RefreshBtnWithAnimationNFT: FC = () => {
  const { setAllCollections } = useNFTCollections()
  const { refreshClass, setRefreshClass, setRefreshClicked } = useNFTAggregator()
  const { setPageNumber } = useNFTAggregatorFilters()
  const refreshFeed = () => {
    setPageNumber(0)
    setAllCollections(LOADING_ARR)
    setRefreshClass('rotateRefreshBtn')
    setRefreshClicked((prev) => prev + 1)
    setTimeout(() => {
      setRefreshClass('')
    }, 1000)
  }
  return (
    <RefreshIcon onClick={() => refreshFeed()}>
      <img src={'/img/assets/refresh.svg'} tw="relative z-10 h-8.75 w-8.75" className={refreshClass} />
    </RefreshIcon>
  )
}
const PROFILE_PIC = styled.div`
  ${tw`rounded-full cursor-pointer text-grey-1 text-[14px] font-semibold justify-center flex items-center p-0.5`}
  background: ${({ theme }) => theme.profilePicBg};
  color: ${({ theme }) => theme.text10};
  border: 1px solid #b5b5b5 !important;
`

// TODO: Mini mise the code using tailwind
export const CurrentUserProfilePic: FC<{ mediumSize?: boolean; profileImg?: string }> = ({
  mediumSize,
  profileImg
}): ReactElement => {
  const { sessionUser } = useNFTProfile()
  const { mode } = useDarkMode()
  const { wallet } = useWallet()
  const history = useHistory()
  const pubKey = useMemo(
    () => wallet?.adapter?.publicKey && wallet?.adapter?.publicKey?.toString(),
    [wallet?.adapter?.publicKey]
  )
  let userPic = sessionUser?.profile_pic_link

  if (userPic === 'https://gfx-nest-image-resources.s3.amazonaws.com/avatar.png') userPic = null
  if (profileImg) userPic = profileImg

  const getFirstAndLast = useMemo(() => (pubKey ? pubKey[0] + pubKey[pubKey.length - 1] : null), [sessionUser])
  const goProfile = () => history.push(`/nfts/profile/${pubKey}`)
  if (!wallet?.adapter?.publicKey) return null

  return (
    <PROFILE_PIC_WRAPPER onClick={goProfile}>
      {userPic ? (
        <img
          src={userPic}
          tw="h-[44px] w-[44px] sm:h-8.75 sm:w-8.75 rounded-full cursor-pointer mr-5 sm:mr-0"
          className={mediumSize ? 'userPopupProfilePic' : 'customProfileImg'}
          onClick={goProfile}
        />
      ) : (
        <img
          className={mediumSize ? 'userPopupProfilePic' : ''}
          tw="h-[44px] w-[44px] sm:h-[41px] sm:w-[41px] rounded-full cursor-pointer mr-5 sm:mr-0"
          src={`/img/assets/Aggregator/avatar-${mode}.svg`}
          alt="profile picture"
        />
      )}
    </PROFILE_PIC_WRAPPER>
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
      {showBanner ? 'Hide' : 'Show'}
    </EYE_CONTAINER>
  )
}

const SearchResultContainer = ({ searchFilter }: any) => {
  const history = useHistory()
  const { mode } = useDarkMode()
  const [searchResultArr, setSearchResult] = useState<null | any[]>(null)

  const debouncer = useCallback(
    debounce((searchQuery) => {
      globalSearchCall(searchQuery)
    }, 500),
    []
  )

  const handleSearch = useCallback((searchQuery) => debouncer(searchQuery), [debouncer])

  const globalSearchCall = (searchQuery) => {
    fetchGlobalSearchNFT(searchQuery)
      .then((res) => {
        setSearchResult(res.collections)
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    if (searchFilter && searchFilter.length > 0) {
      handleSearch(searchFilter)
    }
  }, [searchFilter])
  return (
    <SEARCH_RESULT_CONTAINER>
      {searchResultArr !== null &&
        searchResultArr.length > 0 &&
        searchResultArr.map(
          (data: any, index) =>
            data?.collection && (
              <div
                className="searchResultRow"
                key={index}
                onClick={() =>
                  history.push(
                    `/nfts/collection/${encodeURIComponent(data?.collection?.collection_name).replaceAll(
                      '%20',
                      '_'
                    )}`
                  )
                }
              >
                <img className="searchImg" src={data?.collection?.profile_pic_link} alt="" />
                <div className="searchText" tw="flex flex-col leading-[19px]">
                  <div>
                    {minimizeTheString(data?.collection?.collection_name, 25)}
                    {data?.collection?.is_verified && (
                      <img tw="!w-[15px] !h-[15px] ml-1" src="/img/assets/Aggregator/verifiedNFT.svg" />
                    )}
                  </div>
                  <div tw="text-[#636363] text-[15px] font-semibold">
                    24h volume: {data?.collection?.daily_volume && data?.collection?.daily_volume.toFixed(2)} SOL
                  </div>
                </div>
                <div tw="text-[#b5b5b5] text-[13px] font-semibold ml-auto items-center mr-[10px] flex">
                  <div>{data?.listed_count} Listed</div>
                  <div>
                    <img tw="w-4 h-4 ml-1" src={`/img/assets/Aggregator/arrow-right-${mode}.svg`} alt="arrow" />{' '}
                  </div>
                </div>
              </div>
            )
        )}
      {searchResultArr !== null && searchResultArr.length === 0 && (
        <div tw="flex justify-center">
          <div tw="dark:text-white text-grey-1 font-semibold h-full">No Results</div>
        </div>
      )}
      {searchResultArr === null && (
        <div tw="flex justify-center">
          <RotatingLoader textSize={25} iconSize={25} iconColor={'#5855FF'} />
        </div>
      )}
    </SEARCH_RESULT_CONTAINER>
  )
}

const StatsContainer = ({ showBanner, setShowBanner }: any) => {
  const [aggStats, setAggStats] = useState<StatsResponse | null>(null)

  useEffect(() => {
    fetchNestAggStats()
      .then((stats) => setAggStats(stats))
      .catch((err) => console.error(err))

    return () => setAggStats(null)
  }, [])

  return (
    <div tw="h-[38px] my-[20px] ml-[20px] flex items-center justify-between">
      <div tw="flex justify-between items-center w-[630px]">
        <Pill
          loading={aggStats === null}
          label={'Collections:'}
          value={aggStats !== null ? commafy(aggStats.total_collections, 0) : '0'}
        />
        <Pill
          loading={aggStats === null}
          label={'Market Cap:'}
          value={`${truncateBigNumber(aggStats?.total_marketcap)}`}
        />
        <Pill
          loading={aggStats === null}
          label={'24H Volume:'}
          value={`${truncateBigNumber(aggStats?.total_daily_volume)}`}
        />
      </div>
      <ShowBannerEye showBanner={showBanner} setShowBanner={setShowBanner} />
    </div>
  )
}

const TimeLineDropdown = (): ReactElement => {
  const [arrow, setArrow] = useState<boolean>(false)
  const { timelineDisplay } = useNFTAggregatorFilters()
  return (
    <Dropdown
      align={{ offset: [0, 16] }}
      destroyPopupOnHide
      overlay={<TimelineDropdownContents setArrow={setArrow} />}
      placement="bottomRight"
      trigger={[checkMobile() ? 'click' : 'hover']}
    >
      <div className={`dropdownBtn ${arrow ? `addBorder` : ``}`} tw="h-8.75 w-[104px]">
        <div tw="ml-[18px]">{timelineDisplay}</div>
        <CircularArrow cssStyle={tw`mr-1 h-5 w-5`} invert={arrow} />
      </div>
    </Dropdown>
  )
}

const TimelineDropdownContents = ({ setArrow }: any): ReactElement => {
  const { setTimelineDisplay, timelineDisplay, setPageNumber, setSortFilter } = useNFTAggregatorFilters()
  useEffect(() => {
    setArrow(true)
    return () => {
      setArrow(false)
    }
  }, [])

  const handleClick = useCallback((timeLine, index) => {
    setPageNumber(0)
    setTimelineDisplay(timeLine)
    setSortFilter(SORT_FILTER_OPTIONS[index])
  }, [])

  return (
    <DROPDOWN_CONTAINER tw="w-[104px] h-20">
      <div className="option" onClick={() => handleClick(TIMELINE.TWENTY_FOUR_H, 0)}>
        {TIMELINE.TWENTY_FOUR_H}{' '}
        <input type={'radio'} name="sort" checked={timelineDisplay === TIMELINE.TWENTY_FOUR_H} value={0} />
      </div>
      <div className="option" onClick={() => handleClick(TIMELINE.SEVEN_D, 1)}>
        {TIMELINE.SEVEN_D}{' '}
        <input type={'radio'} name="sort" checked={timelineDisplay === TIMELINE.SEVEN_D} value={1} />
      </div>
    </DROPDOWN_CONTAINER>
  )
}

const NFTLandingPageV2 = (): ReactElement => {
  const existingUserCache: USER_CONFIG_CACHE = JSON.parse(window.localStorage.getItem('gfx-user-cache'))
  const [firstLoad, setFirstPageLoad] = useState<boolean>(true)
  const [showBanner, setShowBanner] = useState<boolean>(false)
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(!existingUserCache.hasAggOnboarded)
  const [showTerms, setShowTerms] = useState<boolean>(true)
  const { setGeneral } = useNFTDetails()
  const { currencyView, lastRefreshedClass, refreshClass, setLastRefreshedClass } = useNFTAggregator()

  useEffect(() => {
    setFirstPageLoad(false)
    setGeneral(null)
  }, [])

  useEffect(() => {
    if (refreshClass === '' && !firstLoad) {
      setLastRefreshedClass('lastRefreshed')
    }
  }, [refreshClass])

  useEffect(() => {
    if (lastRefreshedClass !== ' ' && !firstLoad) {
      setTimeout(() => setLastRefreshedClass(' '), 3000)
    }
  }, [lastRefreshedClass])

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

  const handleWelcomeModal = useCallback(() => {
    if (hasOnboarded)
      return <NFTAggWelcome setShowTerms={setShowTerms} showTerms={showTerms} setShowPopup={handleHasOnboarded} />
  }, [hasOnboarded])

  return (
    <NFT_AGG_WRAP $currency={currencyView}>
      {handleWelcomeModal()}
      {!checkMobile() && (
        <>
          <BannerContainer showBanner={showBanner}>
            {
              <div tw="flex justify-center">
                <LastRefreshedAnimation lastRefreshedClass={lastRefreshedClass} />
              </div>
            }
            <StatsContainer showBanner={showBanner} setShowBanner={setShowBanner} />
            <NFTBanners showBanner={showBanner} />
          </BannerContainer>
        </>
      )}
      <FiltersContainer />
      <NFTCollectionsTable showBanner={showBanner} />
    </NFT_AGG_WRAP>
  )
}
export default NFTLandingPageV2
