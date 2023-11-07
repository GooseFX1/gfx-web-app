/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  ReactNode,
  FC,
  ReactElement,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useMemo,
  useRef
} from 'react'
import { Dropdown } from 'antd'
import { DROPDOWN_CONTAINER, GRID_CONTAINER, NFT_FILTERS_CONTAINER } from './Collection/CollectionV2.styles'
import { useDarkMode, useNFTAggregator, useNFTAggregatorFilters } from '../../context'
import tw from 'twin.macro'
import 'styled-components/macro'
import { checkMobile } from '../../utils'
import { SearchBar, TokenToggleNFT } from '../../components'
import { NFT_PROFILE_OPTIONS } from '../../api/NFTs'
import { Arrow } from '../../components/common/Arrow'
import { RefreshBtnWithAnimationNFT } from './Home/NFTLandingPageV2'
import { useWallet } from '@solana/wallet-adapter-react'
import { useAnimateButtonSlide } from '../../components/Farm/generic'
import { useParams } from 'react-router-dom'
import { IAppParams } from '../../types/app_params'

type TabPanesType = {
  name: string
  order: number
  component: ReactNode
}

type Props = {
  defaultActiveKey?: string
  tabPanes: Array<TabPanesType>
  isExplore?: boolean
}

export const NFTTab: FC<Props> = ({ tabPanes, defaultActiveKey = '1' }): ReactElement => {
  const [open, setOpen] = useState<boolean>(true)
  const [displayIndex, setDisplayIndex] = useState<number>(0)
  const { wallet } = useWallet()
  const pubKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])

  useEffect(() => {
    ;(async () => {
      await setDisplayIndex(0)
    })()
  }, [pubKey])

  return (
    <GRID_CONTAINER tw="h-[calc(90vh - 32px)] sm:h-[calc(90vh- 50px)]  w-[77vw] sm:w-[100vw] sm:mt-16 mt-[32px]">
      <FiltersContainer
        collections={tabPanes[0].name}
        favourited={tabPanes[1].name}
        displayIndex={displayIndex}
        setDisplayIndex={setDisplayIndex}
      />
      {tabPanes[displayIndex].component}
    </GRID_CONTAINER>
  )
}

const FiltersContainer = ({ collections, favourited, displayIndex, setDisplayIndex }: any): ReactElement => {
  const { setCurrency } = useNFTAggregator()
  const { setSearchInsideProfile, setProfileNFTOptions } = useNFTAggregatorFilters()
  const { mode } = useDarkMode()
  const { wallet } = useWallet()
  const sliderRef = useRef(null)
  const params = useParams<IAppParams>()

  const buttonRefs = useRef<HTMLDivElement[]>([])
  const { handleSlide, setButtonRef } = useAnimateButtonSlide(sliderRef, buttonRefs, displayIndex)
  const pubKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])

  useEffect(() => setProfileNFTOptions(NFT_PROFILE_OPTIONS.ALL), [displayIndex])

  return (
    <NFT_FILTERS_CONTAINER index={displayIndex} tw="rounded-l-none dark:bg-black-1 bg-grey-6">
      <div className="flitersFlexContainer" tw="sm:mt-4 sm:pl-1">
        <>
          <SearchBar
            setSearchFilter={setSearchInsideProfile}
            width={checkMobile() ? '100%' : '330px'}
            cssStyle={tw`sm:w-full w-[330px] h-8.75`}
            bgColor={mode === 'dark' ? '#1C1C1C' : '#fff'}
            placeholder={checkMobile() ? `Search by nft ` : `Search by nft name`}
          />

          {!checkMobile() && <ProfileNFTFiltersDropdown displayIndex={displayIndex} />}
          {checkMobile() && (
            <div tw="ml-2 items-center flex">
              <TokenToggleNFT toggleToken={setCurrency} />{' '}
              <ProfileNFTFiltersDropdown displayIndex={displayIndex} />
            </div>
          )}
        </>
      </div>

      <div className="filtersViewCategory" tw="mr-[10px] mt-5  sm:mt-0 sm:mr-0">
        <div
          ref={sliderRef}
          className="pinkGradient"
          tw="h-8.75 w-[150px] absolute z-[10] mt-[-6px] sm:mt-[0px] rounded-[30px]"
          style={{
            transition: 'all 0.5s'
          }}
        ></div>
        <div
          ref={setButtonRef}
          className={displayIndex === 0 ? 'selectedProfile' : 'flexItemProfile'}
          onClick={() => setDisplayIndex(0)}
          data-index={0}
        >
          {collections}
        </div>
        {pubKey && pubKey.toString() === params.userAddress && (
          <div
            ref={setButtonRef}
            className={displayIndex === 1 ? 'selectedProfile' : 'flexItemProfile'}
            onClick={() => setDisplayIndex(1)}
            data-index={1}
          >
            {favourited}
          </div>
        )}
        <div
          ref={setButtonRef}
          className={displayIndex === 2 ? 'selectedProfile' : 'flexItemProfile'}
          onClick={() => setDisplayIndex(pubKey ? 2 : 1)}
          data-index={pubKey ? 2 : 1}
        >
          Activity
        </div>
      </div>
      <div tw="mr-4">{!checkMobile() && <RefreshBtnWithAnimationNFT />}</div>
      <div tw="mr-2">{!checkMobile() && <TokenToggleNFT toggleToken={setCurrency} />}</div>
    </NFT_FILTERS_CONTAINER>
  )
}

const ProfileNFTFiltersDropdown: FC<{ displayIndex: number }> = ({ displayIndex }) => {
  const { profileNFTOptions } = useNFTAggregatorFilters()
  const [arrow, setArrow] = useState<boolean>(false)
  const { mode } = useDarkMode()
  return (
    <div>
      <Dropdown
        align={{ offset: [0, 16] }}
        destroyPopupOnHide
        overlay={<ProfileNFTOptionsList setArrow={setArrow} displayIndex={displayIndex} />}
        placement="bottomRight"
        trigger={checkMobile() ? ['click'] : ['hover']}
      >
        {checkMobile() ? (
          <img src={`/img/assets/Aggregator/threeDots${mode}.svg`} tw="h-8.75 w-5 mr-5 sm:mr-3" />
        ) : (
          <div tw="flex items-center h-8.75 ml-2">
            <div className="offerBtn">{profileNFTOptions.replace('_', ' ')}</div>
            <Arrow height="9px" width="18px" cssStyle={tw`ml-[-25px]`} invert={arrow} />
          </div>
        )}
      </Dropdown>
    </div>
  )
}
const ProfileNFTOptionsList: FC<{ setArrow: Dispatch<SetStateAction<boolean>>; displayIndex: number }> = ({
  setArrow,
  displayIndex
}) => {
  const { profileNFTOptions, setProfileNFTOptions } = useNFTAggregatorFilters()

  useEffect(() => {
    setArrow(true)
    return () => {
      setArrow(false)
    }
  }, [])

  const handleClick = (option: NFT_PROFILE_OPTIONS) => {
    setProfileNFTOptions(option)
  }
  return (
    <DROPDOWN_CONTAINER>
      <div className="option" onClick={() => handleClick(NFT_PROFILE_OPTIONS.ALL)}>
        All
        <input
          type={'radio'}
          onChange={() => handleClick(NFT_PROFILE_OPTIONS.ALL)}
          checked={profileNFTOptions === NFT_PROFILE_OPTIONS.ALL}
          name="sort"
          value="asc"
        />
      </div>
      {displayIndex === 1 ? (
        <>
          <div className="option" onClick={() => handleClick(NFT_PROFILE_OPTIONS.BID_PLACED)}>
            Placed
            <input
              checked={profileNFTOptions === NFT_PROFILE_OPTIONS.BID_PLACED}
              type={'radio'}
              name="sort"
              onChange={() => handleClick(NFT_PROFILE_OPTIONS.BID_PLACED)}
              value="desc"
            />
          </div>
          <div className="option" onClick={() => handleClick(NFT_PROFILE_OPTIONS.BID_RECEIVED)}>
            Received
            <input
              type={'radio'}
              onChange={() => handleClick(NFT_PROFILE_OPTIONS.BID_RECEIVED)}
              checked={profileNFTOptions === NFT_PROFILE_OPTIONS.BID_RECEIVED}
              name="sort"
              value="desc"
            />
          </div>
        </>
      ) : (
        <>
          <div className="option" onClick={() => handleClick(NFT_PROFILE_OPTIONS.OFFERS)}>
            Offer
            <input
              checked={profileNFTOptions === NFT_PROFILE_OPTIONS.OFFERS}
              type={'radio'}
              name="sort"
              value="desc"
            />
          </div>
          <div className="option" onClick={() => handleClick(NFT_PROFILE_OPTIONS.ON_SALE)}>
            {NFT_PROFILE_OPTIONS.ON_SALE}
            <input
              type={'radio'}
              checked={profileNFTOptions === NFT_PROFILE_OPTIONS.ON_SALE}
              name="sort"
              value="desc"
            />
          </div>
        </>
      )}
    </DROPDOWN_CONTAINER>
  )
}
