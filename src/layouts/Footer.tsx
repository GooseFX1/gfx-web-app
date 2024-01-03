import { FC, useState, Dispatch, SetStateAction } from 'react'
import tw, { styled } from 'twin.macro'
import { useDarkMode } from '../context'
import { PopupCustom } from '../pages/NFTs/Popup/PopupCustom'
import { checkMobile } from '../utils'

const STYLED_POPUP = styled(PopupCustom)<{
  currentSlide: number
  userAnswer: any
  mode: string
}>`
  .ant-modal-content {
    ${tw`h-full dark:bg-black-2 bg-white rounded-bigger overflow-y-scroll`}
  }
  .ant-modal-close-x {
    > img {
      ${tw`sm:!h-4 sm:!w-4 absolute bottom-2 opacity-60`}
    }
  }
  .ant-modal-body {
    ${tw`p-5 sm:p-[15px]`}
  }
`

const WRAPPER = styled.div`
  ${tw`flex flex-row items-center h-9 border-t border-solid dark:border-black-4 border-[#E9DEF1] 
    py-3.5 px-5 fixed bottom-0 w-full bg-grey-5 dark:bg-black-1 z-[1000] sm:block sm:h-[100px]`}

  .tags {
    ${tw`font-bold text-12 underline dark:text-white text-blue-1 cursor-pointer`}
  }
`

const NEW = styled.div`
  ${tw`h-4.5 w-7.5 cursor-pointer rounded-tiny text-smallest 
    font-semibold dark:text-white text-black-4 text-center leading-[18px]`}
  background: linear-gradient(106deg, rgba(247, 147, 26, 0.30) 11.1%, rgba(195, 26, 227, 0.30) 89.17%);
`

export const Footer: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  return (
    <WRAPPER>
      {isModalOpen && <ReleaseNotes isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />}
      {checkMobile() && (
        <div tw="flex flex-row items-center justify-between mb-3.75">
          <div>
            <span className="tags" tw="mr-1.5" onClick={() => setIsModalOpen(true)}>
              Release Notes
            </span>
            <div
              tw="bg-gradient-to-r from-secondary-gradient-1 to-secondary-gradient-2 
                                w-8 h-5 cursor-pointer rounded-tiny p-px inline-block"
            >
              <div tw="dark:bg-black-1 bg-grey-5 rounded-tiny h-full w-full">
                <NEW>New</NEW>
              </div>
            </div>
          </div>
          <a className="tags" href="https://www.goosefx.io/risks-and-disclaimers" target="_blank" rel="noreferrer">
            Risk & Disclaimers
          </a>
          <a className="tags" href="https://www.goosefx.io/terms" target="_blank" rel="noreferrer">
            Terms of Service
          </a>
        </div>
      )}
      <span tw="text-smallest font-bold text-grey-1">
        Copyright 2023 GOOSEFX, All rights reserved. Please trade at your discretion and according to the laws and
        regulations of your location, security audits by{' '}
        <a href="https://osec.io/" target="_blank" rel="noreferrer" tw="!text-blue-1 dark:!text-white !font-bold">
          OtterSec.
        </a>
      </span>
      {!checkMobile() && (
        <div tw="flex flex-row items-center justify-between w-[30%] ml-auto">
          <div>
            <span className="tags" tw="mr-1.5" onClick={() => setIsModalOpen(true)}>
              Release Notes
            </span>
            <div
              tw="bg-gradient-to-r from-secondary-gradient-1 to-secondary-gradient-2 
                                w-8 h-5 cursor-pointer rounded-tiny p-px inline-block"
            >
              <div tw="dark:bg-black-1 bg-grey-5 rounded-tiny h-full w-full">
                <NEW>New</NEW>
              </div>
            </div>
          </div>
          <a className="tags" href="https://www.goosefx.io/risks-and-disclaimers" target="_blank" rel="noreferrer">
            Risk & Disclaimers
          </a>
          <a className="tags" href="https://www.goosefx.io/terms" target="_blank" rel="noreferrer">
            Terms of Service
          </a>
        </div>
      )}
    </WRAPPER>
  )
}

const All: FC = () => {
  console.log('All')
  return (
    <>
      <div></div>
      <Farm />
      <Trade />
      <Stake />
    </>
  )
}

const Farm: FC = () => {
  const { mode } = useDarkMode()
  return (
    <div tw="mb-7.5">
      <div tw="flex flex-row items-center mb-2.5">
        <div tw="font-semibold flex flex-row items-center">
          <span tw="font-semibold text-average dark:text-grey-8 text-black-4 mr-1.25">Farm V 2.1</span>
          <span tw="font-semibold text-tiny text-grey-1 dark:text-grey-2 mr-1.25">(22/12/2023)</span>
        </div>
        <div
          tw="bg-gradient-to-r from-secondary-gradient-1 to-secondary-gradient-2 
                    w-8 h-5 rounded-tiny p-px inline-block"
        >
          <div tw="dark:bg-black-1 bg-grey-5 rounded-tiny h-full w-full">
            <NEW>New</NEW>
          </div>
        </div>
      </div>
      <img src={`/img/assets/footer_1_${mode}.png`} alt="footer-icn" tw="mb-2.5" />
      <div tw="font-semibold text-regular dark:text-grey-2 text-grey-1">
        Now on Farming you will be able to see the metrics in different time stamps and understand how do we
        calculate each of them.
      </div>
    </div>
  )
}

const Trade: FC = () => {
  const { mode } = useDarkMode()
  return (
    <div tw="mb-7.5">
      <div tw="flex flex-row items-center mb-2.5">
        <div tw="font-semibold flex flex-row items-center">
          <span tw="font-semibold text-average dark:text-grey-8 text-black-4 mr-1.25">Dex V 2.1</span>
          <span tw="font-semibold text-tiny text-grey-1 dark:text-grey-2 mr-1.25">(27/12/2023)</span>
        </div>
        <div
          tw="bg-gradient-to-r from-secondary-gradient-1 to-secondary-gradient-2 
                w-8 h-5 rounded-tiny p-px inline-block"
        >
          <div tw="dark:bg-black-1 bg-grey-5 rounded-tiny h-full w-full">
            <NEW>New</NEW>
          </div>
        </div>
      </div>
      <img src={`/img/assets/footer_2_${mode}.png`} alt="footer-icn" tw="mb-2.5" />
      <div tw="font-semibold text-regular dark:text-grey-2 text-grey-1">
        Introducing Trader Profiles – Your hub for deposits, funding and trade history, all in one place!
      </div>
    </div>
  )
}

const Stake: FC = () => {
  const { mode } = useDarkMode()
  return (
    <div tw="mb-7.5">
      <div tw="flex flex-row items-center mb-2.5">
        <div tw="font-semibold flex flex-row items-center">
          <span tw="font-semibold text-average dark:text-grey-8 text-black-4 mr-1.25">Stake V 1.4</span>
          <span tw="font-semibold text-tiny text-grey-1 dark:text-grey-2 mr-1.25">(24/11/2023)</span>
        </div>
        <div
          tw="bg-gradient-to-r from-secondary-gradient-1 to-secondary-gradient-2 
                w-8 h-5 rounded-tiny p-px inline-block"
        >
          <div tw="dark:bg-black-1 bg-grey-5 rounded-tiny h-full w-full">
            <NEW>New</NEW>
          </div>
        </div>
      </div>
      <img src={`/img/assets/footer_3_${mode}.png`} alt="footer-icn" tw="mb-2.5" />
      <div tw="font-semibold text-regular dark:text-grey-2 text-grey-1">
        Introducing GooseFX Stake Rewards! Stake $GOFX & Claim $USDC!
      </div>
    </div>
  )
}

const ReleaseNotes: FC<{
  isModalOpen: boolean
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
}> = ({ isModalOpen, setIsModalOpen }): JSX.Element => {
  const [active, setActive] = useState<number>(0)
  return (
    <STYLED_POPUP
      height={checkMobile() ? '353px' : '340px'}
      width={checkMobile() ? '95%' : '586px'}
      title={null}
      centered={true}
      visible={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
    >
      <div tw="font-semibold dark:text-grey-8 text-black-4 mb-2.5 text-lg">Release Notes</div>
      <div
        tw="flex cursor-pointer relative sm:w-full border-b border-solid dark:border-black-4 
                border-grey-4 pb-2.5 mb-2.5"
      >
        <div
          css={[
            tw`duration-500`,
            active === 0
              ? tw`ml-0`
              : active === 1
              ? tw`ml-[85px] sm:ml-[24%]`
              : active === 2
              ? tw`ml-[170px] sm:ml-[48%]`
              : tw`ml-[255px] sm:ml-[72%]`
          ]}
          tw="h-[35px] w-[85px] sm:w-[24%] absolute rounded-[4px]
            bg-gradient-to-r from-secondary-gradient-1 to-secondary-gradient-3"
        ></div>
        <h4
          css={[active === 0 ? tw`!text-white` : tw`text-grey-1`]}
          tw="h-[35px] duration-500 flex items-center z-[100] sm:w-[24%] justify-center 
            font-semibold w-[85px] text-regular"
          onClick={() => setActive(0)}
        >
          All
        </h4>
        <h4
          css={[active === 1 ? tw`!text-white` : tw`text-grey-1`]}
          tw="h-[35px] duration-500 flex items-center z-[100] sm:w-[24%] justify-center 
            font-semibold w-[85px] text-regular"
          onClick={() => setActive(1)}
        >
          Farm
        </h4>
        <h4
          css={[active === 2 ? tw`!text-white` : tw`text-grey-1`]}
          tw="h-[35px] flex items-center justify-center z-[100] 
                    font-semibold w-[85px] sm:w-[24%] text-regular"
          onClick={() => setActive(2)}
        >
          Trade
        </h4>
        <h4
          css={[active === 3 ? tw`!text-white` : tw`text-grey-1`]}
          tw="h-[35px] duration-500 flex items-center z-[100] justify-center font-semibold 
            sm:w-[24%] w-[85px] text-regular"
          onClick={() => setActive(3)}
        >
          Stake
        </h4>
      </div>
      {active === 0 ? <All /> : active === 1 ? <Farm /> : active === 2 ? <Trade /> : <Stake />}
    </STYLED_POPUP>
  )
}
