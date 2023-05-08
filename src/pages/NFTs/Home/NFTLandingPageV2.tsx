/* eslint-disable @typescript-eslint/no-unused-vars */
import { Checkbox, Dropdown, Switch } from 'antd'
import React, { ReactElement, useMemo, useState, FC, useEffect, useCallback } from 'react'
import styled, { css } from 'styled-components'
import 'styled-components/macro'
import { Pill, SearchBar, TokenToggleNFT } from '../../../components'
import { NFTAggWelcome } from '../../../components/NFTAggWelcome'
import {
  useConnectionConfig,
  useDarkMode,
  useNavCollapse,
  useNFTAggregator,
  useNFTAggregatorFilters,
  useNFTCollections,
  useNFTDetails,
  useNFTProfile
} from '../../../context'
import { checkMobile, LOADING_ARR } from '../../../utils'
import { LastRefreshedAnimation, RefreshIcon, STYLED_BUTTON } from '../../Farm/FarmFilterHeader'
import MenuNFTPopup from './MenuNFTPopup'
import { SEARCH_RESULT_CONTAINER, STATS_BTN } from './NFTAggregator.styles'
import NFTBanners from './NFTBanners'
import NFTCollectionsTable from './NFTCollectionsTable'
import SearchNFTMobile from './SearchNFTMobile'
import { Arrow } from '../../../components/common/Arrow'
import { DROPDOWN_CONTAINER } from '../Collection/CollectionV2.styles'
import { useHistory } from 'react-router-dom'
import { Image } from 'antd'
import { AH_PROGRAM_IDS, AH_NAME } from '../../../web3/agg_program_ids'
import { ModalSlide } from '../../../components/ModalSlide'
import { MODAL_TYPES } from '../../../constants'
import { SVGToPrimary2 } from '../../../styles'
import { USER_CONFIG_CACHE } from '../../../types/app_params'
import ShowEyeLite from '../../../animations/showEyelite.json'
import ShowEyeDark from '../../../animations/showEyedark.json'
import Lottie from 'lottie-react'
import { fetchGlobalSearchNFT, NFT_COL_FILTER_OPTIONS } from '../../../api/NFTs'
import tw from 'twin.macro'
import 'styled-components/macro'
import { minimizeTheString } from '../../../web3/nfts/utils'
import { useWallet } from '@solana/wallet-adapter-react'

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
    ${tw`sm:w-0 !w-[100%]`}
  }
  .comingSoon {
    ${tw`text-grey-2`}
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
    ${tw`mt-[15px] duration-500`}
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
  ${tw`relative z-0 mr-1 ml-2`}
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

const poolTypes = [{ name: 'Popular' }, { name: 'Trending' }]
const timelineVolume = [{ name: '24h' }, { name: '7d' }, { name: '30d' }, { name: 'All' }]

const NFTLandingPageV2 = (): ReactElement => {
  const existingUserCache: USER_CONFIG_CACHE = JSON.parse(window.localStorage.getItem('gfx-user-cache'))
  const [firstLoad, setFirstPageLoad] = useState<boolean>(true)
  const { isCollapsed } = useNavCollapse()
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
    <WRAPPER $navCollapsed={isCollapsed} $currency={currencyView}>
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
  const history = useHistory()
  const { setCurrency } = useNFTAggregator()
  const { wallet } = useWallet()
  const pubKey = wallet?.adapter ? wallet?.adapter?.publicKey?.toString() : null
  const { mode } = useDarkMode()
  const { setTimelineDisplay, setSortFilter, setSortType, sortType, timelineDisplay } = useNFTAggregatorFilters()

  const { sessionUser } = useNFTProfile()
  const goProfile = () => sessionUser && history.push(`/nfts/profile/${pubKey}`)

  useEffect(() => {
    if (timelineDisplay === '7d' && sortType === 'DESC') {
      setPoolIndex(1)
      setPoolFilter('Trending')
    }
    if (timelineDisplay === '24h' && sortType === 'DESC') {
      setPoolIndex(0)
      setPoolFilter('Popular')
    }
  }, [sortType, timelineDisplay])

  const handleClick = (poolName, index) => {
    setPoolIndex(index)
    setPoolFilter(poolName)
    if (poolName === 'Trending') {
      setSortFilter(NFT_COL_FILTER_OPTIONS.WEEKLY_VOLUME)
      setSortType('DESC')
      setTimelineDisplay('7d')
    }
    if (poolName === 'Popular') {
      setSortFilter(NFT_COL_FILTER_OPTIONS.DAILY_VOLUME)
      setSortType('DESC')
      setTimelineDisplay('24h')
    }
  }

  const handleClickTimeline = (poolName, index) => {
    setTimelineIndex(index)
    setTimelineName(poolName)
    setTimelineDisplay(poolName)
  }

  useEffect(() => {
    console.log(sessionUser ? 'LANDING - Session user - ' + sessionUser.pubkey : ' LANDING NO SESSION USER')
  }, [sessionUser])

  if (checkMobile())
    return (
      <div>
        <SearchNFTMobile searchPopup={searchPopup} setSearchPopup={setSearchPopup} />
        {/* <MenuNFTPopup menuPopup={menuPopup} setMenuPopup={setMenuPopup} /> */}
        <FILTERS_CONTAINER>
          <div className="flexContainer">
            <div className="iconImg">
              <img
                style={{ height: '20px', width: '20px' }}
                onClick={() => setSearchPopup(true)}
                src={`/img/assets/search_${mode}.svg`}
              />
            </div>
            {/* <div className="iconImg" onClick={() => setMenuPopup(true)}>
              <img src={`/img/assets/Aggregator/menu.svg`} />
            </div> */}
            {sessionUser && <CurrentUserProfilePic goProfile={goProfile} />}
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
          {/* mobile */}
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
          <div tw="ml-auto sm:mt-0 mt-2.5 mr-2.5">
            <TokenToggleNFT toggleToken={setCurrency} />
          </div>
        </div>
      </div>
    )
  else
    return (
      <FILTERS_CONTAINER>
        <SearchBar
          className="search-bar"
          width={'398px'}
          bgColor={mode === 'dark' ? '#1f1f1f' : '#fff'}
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
        {/* Web */}
        {searchFilter && <SearchResultContainer searchFilter={searchFilter} />}
        <div tw="flex items-center mr-6 ml-auto">
          {/* <MarketDropdown /> */}
          <TimeLineDropdown />
          <div>
            <RefreshBtnWithAnimationNFT />
          </div>

          {sessionUser && <CurrentUserProfilePic goProfile={goProfile} />}
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
      <img
        src={'/img/assets/refresh.svg'}
        tw="relative z-10 ml-5 mr-5 h-11 w-11"
        className={refreshClass}
        alt="refresh"
      />
    </RefreshIcon>
  )
}
export const CurrentUserProfilePic: FC<{ goProfile: any }> = ({ goProfile }) => {
  const { sessionUser } = useNFTProfile()
  const { wallet } = useWallet()
  const pubKey = useMemo(() => wallet?.adapter?.publicKey.toString(), [wallet?.adapter?.publicKey])
  let userPic = sessionUser?.profile_pic_link
  if (userPic === 'https://i.pinimg.com/564x/ee/23/b8/ee23b8469c14f3e819e4e0ce5cd60c2c.jpg') userPic = null

  const getFirstAndLast = useMemo(() => pubKey[0] + pubKey[pubKey.length - 1], [sessionUser])
  return (
    <div>
      {userPic ? (
        <AVATAR_NFT src={userPic} preview={false} onClick={goProfile} />
      ) : (
        <div className="borderAvatar">
          <div className="no-dp-avatar-sm" onClick={goProfile}>
            {getFirstAndLast}
          </div>
        </div>
      )}
    </div>
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

const SearchResultContainer = ({ searchFilter }: any) => {
  const { allCollections } = useNFTCollections()
  const history = useHistory()
  const { mode } = useDarkMode()
  const [searchResultArr, setSearchResult] = useState<any>([...allCollections])

  const globalSearchCall = () => {
    fetchGlobalSearchNFT(searchFilter)
      .then((res) => {
        setSearchResult(res.collections)
      })
      .catch((err) => console.log(err))
  }
  useEffect(() => {
    if (searchFilter && searchFilter.length > 1) {
      globalSearchCall()
    }
  }, [searchFilter])
  return (
    <SEARCH_RESULT_CONTAINER>
      {searchResultArr &&
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
    </SEARCH_RESULT_CONTAINER>
  )
}

const StatsContainer = ({ showBanner, setShowBanner }: any) => (
  <div tw="h-[36px] my-[20px] ml-[20px] flex items-center justify-between">
    <div tw="flex justify-between items-center w-[60vw] xl:w-[80vw]">
      <Pill loading={false} label={'Collection'} value={'9155'} />
      <Pill loading={false} label={'Market Cap:'} value={'12.33M'} />
      <Pill loading={false} label={'24h Volume:'} value={'22M'} />
      <Pill loading={false} label={'Total volume traded:'} value={'127.82M'} />
    </div>
    <ShowBannerEye showBanner={showBanner} setShowBanner={setShowBanner} />
  </div>
)

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
      <div className="dropdownBtn" tw="h-[44px] w-[104px] ">
        <div tw="ml-[22px]">{timelineDisplay}</div>
        <Arrow height="9px" width="18px" cssStyle={tw`mr-1`} invert={arrow} />
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

  const renderDropdownItems = useCallback(
    (addr) => (
      <div
        tw="flex p-2 items-center cursor-pointer hover:opacity-80"
        key={addr}
        onClick={() => console.log(AH_NAME(addr))}
      >
        <div>
          <Image
            className="marketImg"
            fallback={`/img/assets/avatar${mode === 'dark' ? '' : '-lite'}.svg`}
            src={`/img/assets/Aggregator/${AH_NAME(addr)}.svg`}
            preview={false}
          />
        </div>
        <div tw="ml-2">{AH_NAME(addr)}</div>
        <div className="checkboxContainer">
          <input type="checkbox" onClick={() => console.log('s')} />
        </div>
      </div>
    ),
    []
  )

  return (
    <DROPDOWN_CONTAINER tw="w-[173px] h-[211px] overflow-y-auto">
      {Object.keys(AH_PROGRAM_IDS)
        .filter((addr) => AH_NAME(addr) !== 'Unknown')
        .map(renderDropdownItems)}
    </DROPDOWN_CONTAINER>
  )
}

const TimelineDropdownContents = ({ setArrow }: any): ReactElement => {
  const { setTimelineDisplay, timelineDisplay } = useNFTAggregatorFilters()
  useEffect(() => {
    setArrow(true)
    return () => {
      setArrow(false)
    }
  }, [])

  return (
    <DROPDOWN_CONTAINER tw="w-[104px] h-[155px]">
      <div className="option" onClick={() => setTimelineDisplay('24h')}>
        24h <input type={'radio'} name="sort" checked={timelineDisplay === '24h'} value="asc" />
      </div>
      <div className="option" onClick={() => setTimelineDisplay('7d')}>
        7d <input type={'radio'} name="sort" checked={timelineDisplay === '7d'} value="desc" />
      </div>
      <div className="option" onClick={() => setTimelineDisplay('30d')}>
        30d <input type={'radio'} name="sort" checked={timelineDisplay === '30d'} value="desc" />
      </div>
      <div className="option" onClick={() => setTimelineDisplay('All')}>
        All <input type={'radio'} name="sort" checked={timelineDisplay === 'All'} value="desc" />
      </div>
    </DROPDOWN_CONTAINER>
  )
}

export default NFTLandingPageV2
