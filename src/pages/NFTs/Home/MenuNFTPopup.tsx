/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-undef */
import { Checkbox, Switch } from 'antd'
import React, { FC, ReactElement } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import { useDarkMode } from '../../../context'
import { AH_PROGRAM_IDS, AH_NAME } from '../../../web3'
import { PopupCustom } from '../Popup/PopupCustom'

const STYLED_POPUP = styled(PopupCustom)`
  &.ant-modal {
    ${tw`max-w-full bottom-[-10px] mt-auto absolute `}
  }
  .wrapper {
    ${tw`flex flex-col text-[15px] w-[75%] pr-2 ml-[12%] h-[40vh] font-semibold overflow-y-auto`}
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
  const { mode } = useDarkMode()
  return (
    <STYLED_POPUP
      height={'45vh'}
      width={'100vw'}
      title={null}
      visible={menuPopup ? true : false}
      onCancel={() => setMenuPopup(false)}
      footer={null}
    >
      <div className="wrapper">
        {/* <div className="marketRow">
          <img src="/img/assets/Aggregator/menu.svg" />
          <div>All</div>
          <div className="checkbox">
            <Switch />
          </div>
        </div> */}
        {Object.keys(AH_PROGRAM_IDS)
          .filter((addr) => AH_NAME(addr) !== 'Unknown')
          .map((addr, index) => (
            <div className="marketRow" key={index}>
              <div>
                <img
                  className="marketImg"
                  // fallback={`/img/assets/avatar${mode === 'dark' ? '' : '-lite'}.svg`}
                  src={`/img/assets/Aggregator/${AH_NAME(addr)}.svg`}
                />
              </div>
              <div>{AH_NAME(addr)}</div>
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
