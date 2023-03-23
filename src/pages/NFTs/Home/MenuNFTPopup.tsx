import { Checkbox, Switch } from 'antd'
import React, { FC, ReactElement } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import { PopupCustom } from '../Popup/PopupCustom'

const STYLED_POPUP = styled(PopupCustom)`
  &.ant-modal {
    ${tw`max-w-full bottom-[-10px] mt-auto absolute`}
  }
  .wrapper {
    ${tw`flex flex-col text-[15px] w-[75%] ml-[12%]  font-semibold`}
  }
  .marketRow {
    ${tw`flex h-[45px] items-center gap-4 mt-2`}
    img {
      ${tw`h-[45px] w-[45px]`}
    }
  }
  .checkbox {
    margin-left: auto;
  }
`

const markets = ['OpenSea', 'Metaplex', 'MagicEden']

const MenuNFTPopup: FC<{ menuPopup: boolean; setMenuPopup: any }> = ({
  menuPopup,
  setMenuPopup
}): ReactElement => {
  console.log('first')
  return (
    <STYLED_POPUP
      height={'40vh'}
      width={'100vw'}
      title={null}
      visible={menuPopup ? true : false}
      onCancel={() => setMenuPopup(false)}
      footer={null}
    >
      <div className="wrapper">
        <div className="marketRow">
          <img src="/img/assets/Aggregator/menu.svg" />
          <div>All</div>
          <div className="checkbox">
            <Switch />
          </div>
        </div>
        {markets.map((market, index) => (
          <div className="marketRow" key={index}>
            <img src="/img/assets/Aggregator/menu.svg" />
            <div>{market}</div>
            <div className="checkbox">
              <Checkbox />
            </div>
          </div>
        ))}
      </div>
    </STYLED_POPUP>
  )
}

export const FiltersNFTPopupMobile: FC<{ filtersPopup: boolean; setFiltersPopup: any }> = ({
  filtersPopup,
  setFiltersPopup
}): ReactElement => {
  console.log('first')
  return (
    <STYLED_POPUP
      height={'40vh'}
      width={'100vw'}
      title={null}
      visible={filtersPopup ? true : false}
      onCancel={() => setFiltersPopup(false)}
      footer={null}
    >
      <div className="wrapper">
        <div className="marketRow">
          <img src="/img/assets/Aggregator/menu.svg" />
          <div>All</div>
          <div className="checkbox">
            <Switch />
          </div>
        </div>
        {markets.map((market, index) => (
          <div className="marketRow" key={index}>
            <img src="/img/assets/Aggregator/menu.svg" />
            <div>{market}</div>
            <div className="checkbox">
              <Checkbox />
            </div>
          </div>
        ))}
      </div>
    </STYLED_POPUP>
  )
}

export default MenuNFTPopup
