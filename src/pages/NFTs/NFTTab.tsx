/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactNode, FC, ReactElement, useState } from 'react'
import { Dropdown, Tabs } from 'antd'
import { NFTGridContainer } from './Collection/CollectionV2'
import {
  DROPDOWN_CONTAINER,
  GRID_CONTAINER,
  NFT_COLLECTIONS_GRID,
  NFT_FILTERS_CONTAINER
} from './Collection/CollectionV2.styles'
import { useDarkMode, useNavCollapse } from '../../context'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { checkMobile } from '../../utils'
import { SearchBar, TokenToggle } from '../../components'
import { CurrencySwitch } from './Home/NFTLandingPageV2'
import NFTDisplay from './Profile/NFTDisplay'

const NFT_TAB = styled.div``

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
  const { isCollapsed } = useNavCollapse()
  const [open, setOpen] = useState<boolean>(true)
  const [displayIndex, setDisplayIndex] = useState<number>(0)

  return (
    <GRID_CONTAINER tw="w-[77vw] sm:w-[100vw] mt-10" navCollapsed={isCollapsed}>
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
  const { mode } = useDarkMode()

  return (
    <NFT_FILTERS_CONTAINER index={displayIndex} tw="rounded-l-none">
      <div className="flitersFlexContainer">
        {/* {!checkMobile() && <OffersDropdown />} 
        {checkMobile() && <CurrencySwitch />}  */}
      </div>

      <div className="flitersViewCategory" tw="mr-[10px] sm:mr-0">
        <div
          className={displayIndex === 0 ? 'selectedProfile' : 'flexItemProfile'}
          onClick={() => setDisplayIndex(0)}
        >
          {collections}
          <div className="activeItemProfile" />
        </div>
        <div
          className={displayIndex === 1 ? 'selectedProfile' : 'flexItemProfile'}
          onClick={() => setDisplayIndex(1)}
        >
          {favourited}
        </div>
        <div
          className={displayIndex === 2 ? 'selectedProfile' : 'flexItemProfile'}
          onClick={() => setDisplayIndex(2)}
        >
          Activity
        </div>
      </div>
      {!checkMobile() && <TokenToggle tokenA="" tokenB="" toggleToken={() => console.log('f')} icons={true} />}
    </NFT_FILTERS_CONTAINER>
  )
}

const OffersDropdown = () => {
  console.log('')
  return (
    <div>
      <Dropdown
        align={{ offset: [0, 16] }}
        destroyPopupOnHide
        overlay={<OverlayOptions />}
        placement="bottomRight"
        trigger={checkMobile() ? ['click'] : ['hover']}
      >
        {checkMobile() ? (
          <div>
            <img className="shareBtn" src="/img/assets/Aggregator/shareBtn.svg" />
          </div>
        ) : (
          <div className="offerBtn">All</div>
        )}
      </Dropdown>
    </div>
  )
}
const OverlayOptions = () => (
  <DROPDOWN_CONTAINER>
    <div className="option">
      All <input type={'radio'} name="sort" value="asc" />
    </div>
    <div className="option">
      Offer <input type={'radio'} name="sort" value="desc" />
    </div>
    <div className="option">
      On Sell <input type={'radio'} name="sort" value="desc" />
    </div>
    {checkMobile() && <div className="option">Share</div>}
  </DROPDOWN_CONTAINER>
)
