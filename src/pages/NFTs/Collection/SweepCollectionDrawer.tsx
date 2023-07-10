/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Drawer, Dropdown } from 'antd'
import React, { ReactElement, FC, useState, useEffect } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { checkMobile } from '../../../utils'
import { useDarkMode } from '../../../context'

export const DROPDOWN_CONTAINER = styled.div`
  ${tw`rounded-md p-1 -mt-1 sm:w-[158px] text-[15px] font-semibold`}
  background-color: ${({ theme }) => theme.bg20};
  color: ${({ theme }) => theme.text1};
  border: 1px solid ${({ theme }) => theme.tokenBorder};
  .option {
    ${tw`flex items-center justify-center cursor-pointer`}
  }
`
const SWEEP_WRAPPER = styled.div`
  .closeIconHolder {
    ${tw`absolute top-6 left-6 flex cursor-pointer sm:right-4 sm:left-auto sm:top-4 `}
  }
  .headerContainer {
    ${tw`mt-8 sm:mt-0 flex flex-col w-[100%] items-center`}
  }
  .topTenTitle {
    ${tw`text-[20px] sm:text-[15px] font-semibold mt-5 text-center`}
    color: ${({ theme }) => theme.text20};
    strong {
      ${tw`text-white`}
    }
  }
  .sweepText {
    ${tw`absolute sm:relative sm:bottom-0 sm:mt-2 bottom-[110px] font-semibold   text-[12px]`}
    color: ${({ theme }) => theme.text20};
    strong {
      ${tw`text-white`}
    }
  }
  .sweepBtnContainer {
    ${tw`flex items-center absolute sm:relative sm:mt-2 sm:bottom-0 bottom-[25px] sm:w-[100%] w-[90%] justify-between`}
  }
  .estPrice {
    color: ${({ theme }) => theme.text20};
  }
  .sweepBtn {
    ${tw`w-[227px] sm:w-[187px] h-[53px] flex items-center border-none justify-center text-[18px] 
    font-semibold rounded-[60px] bg-[#5855ff]`}
    :disabled {
      background: ${({ theme }) => theme.bg22};
      ${tw`text-[#636363] font-semibold text-[18px]`}
    }
    :hover,
    :focus {
      /* ${tw`text-white`} */
    }
  }
  .sweeperSlick {
    ${tw`h-[280px] w-[100%] mt-[50px] sm:mt-[10px]`}
    border: 1px solid;
  }
  .floorContainer {
    ${tw` items-center mt-10 sm:mt-2 justify-between flex`}
    input {
      ${tw`rounded-[70px] w-[158px] h-[52px]`}
    }
  }
  .noOfNFTSweep {
    ${tw`flex  items-center sm:mt-4 mt-10 justify-between w-[100%]`}
  }
  .numberSelector {
    ${tw`rounded-[70px] justify-center w-[158px] h-[52px] text-[18px]
     cursor-pointer font-semibold flex text-center items-center`}
    background: linear-gradient(97deg, #f7931a 2%, #ac1cc7 99%);
  }
  .arrowDown {
    ${tw`sm:w-[17px] absolute right-8 cursor-pointer sm:h-[7px] w-[17px] h-[7px] ml-[10px] duration-500`}
  }
  .invert {
    transform: rotate(180deg);
    transition: transform 500ms ease-out;
  }

  .inputContainer {
    ${tw`w-[100%] text-[20px] sm:text-[16px] sm:py-2 font-semibold`}
    color: ${({ theme }) => theme.text11};
  }
`

const SweepCollectionDrawer: FC<{
  sweepCollection: boolean
  setSweepCollection: any
}> = ({ sweepCollection, setSweepCollection }): ReactElement => {
  const elem = document.getElementById('nft-aggerator-container') //TODO-PROFILE: Stop background scroll

  return (
    <Drawer
      title={null}
      placement={checkMobile() ? 'bottom' : 'right'}
      closable={false}
      height={checkMobile() ? '90%' : 'auto'}
      onClose={() => setSweepCollection(false)}
      getContainer={elem}
      visible={sweepCollection ? true : false}
      width={checkMobile() ? '100%' : '560px'}
    >
      <CollectionSweeperV2 setSweepCollection={setSweepCollection} />
    </Drawer>
  )
}
const CollectionSweeperV2: FC<{
  setSweepCollection: any
}> = ({ setSweepCollection }): ReactElement => {
  console.log('object')
  return (
    <SWEEP_WRAPPER>
      <CloseBtn clickHandler={setSweepCollection} />
      <CollectionSweepLogo />
    </SWEEP_WRAPPER>
  )
}
const CloseBtn: FC<{ clickHandler: any }> = ({ clickHandler }: any): ReactElement => (
  <div className="closeIconHolder" onClick={() => clickHandler(false)}>
    <img src="/img/assets/close-white-icon.svg" alt="" height="20px" width="20px" />
  </div>
)

const CollectionSweepLogo = (): ReactElement => {
  const { mode } = useDarkMode()
  const sweeperImg = `/img/assets/Aggregator/sweeperTitle${mode === 'dark' ? 'dark' : 'lite'}.png`
  return (
    <div className="headerContainer">
      <div>
        <img tw="w-[271px] h-[46px] sm:h-[33px] w-[180px]" src={sweeperImg} alt="sweep title" />
      </div>
      <div className="topTenTitle">
        The top <strong>10</strong> cheapest NFT's of <strong>DeGods</strong>:
      </div>

      <SweeperSlick />
      <InputContainer />
      <TermsText />

      <SweepBtnContainer />
    </div>
  )
}

const SweepBtnContainer = (): ReactElement => (
  <div className="sweepBtnContainer">
    <div tw="flex flex-col">
      <div className="estPrice">Est. total price:</div>
      <div tw="flex gap-2 text-[20px] font-semibold">
        938.8 SOL <img tw="w-[25px] h-[25px]" src="/img/crypto/SOL.svg" alt="SOL" />
      </div>
    </div>

    <Button className="sweepBtn" disabled={false}>
      Sweep
    </Button>
  </div>
)

export const TermsText = (): ReactElement => (
  <div className="sweepText">
    By clicking ¨Sweep now¨, you agree to the <strong> GooseFx Terms of Service.</strong>
  </div>
)

const SweeperSlick = () => <div className="sweeperSlick"></div>
const InputContainer = () => {
  const [noOfNFT, setNoOfNFT] = useState<number>(0)
  const [openDropdown, setOpenDropdown] = useState<boolean>(false)

  return (
    <div className="inputContainer">
      <div tw="flex flex-col ">
        <div className="floorContainer">
          <div>Max floor price</div>
          <div>
            <input type="number" />
          </div>
        </div>
        <div className="noOfNFTSweep">
          <div>
            How many NFT's <br /> to Sweep ?
          </div>

          <Dropdown
            align={{ offset: [0, 16] }}
            destroyPopupOnHide
            overlay={<Overlay setNoOfNFT={setNoOfNFT} setOpenDropdown={setOpenDropdown} />}
            placement="bottomRight"
            trigger={['click']}
          >
            <div className="numberSelector" onClick={() => setOpenDropdown(true)}>
              {noOfNFT ? noOfNFT : 'Choose'}
              <img
                className={'arrowDown' + (openDropdown ? ' invert' : '')}
                src={`/img/assets/arrow-down.svg`}
                alt=""
              />
            </div>
          </Dropdown>
        </div>
      </div>
    </div>
  )
}
const Overlay: FC<{ setNoOfNFT: any; setOpenDropdown: any }> = ({ setNoOfNFT, setOpenDropdown }): ReactElement => {
  const arr = [1, 2, 3, 4, 5]
  useEffect(() => {
    setOpenDropdown(true)
    return () => {
      setOpenDropdown(false)
    }
  }, [])

  return (
    <DROPDOWN_CONTAINER>
      {arr.map((ar, index) => (
        <div
          className="option"
          key={index}
          onClick={() => {
            setNoOfNFT(ar)
            setOpenDropdown(false)
          }}
        >
          {ar}
        </div>
      ))}
    </DROPDOWN_CONTAINER>
  )
}
export default SweepCollectionDrawer
