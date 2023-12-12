import React, { FC, ReactElement } from 'react'
// import { PopupCustom } from '../../../pages/NFTs/Popup/PopupCustom'
// import useBreakPoint from '../../../hooks/useBreakPoint'
// import styled from 'styled-components'
import tw from 'twin.macro'
import Modal from '../../common/Modal'
import { numberFormatter } from '../../../utils'

// const STYLED_POPUP = styled(PopupCustom)`
//   .hideScrollbar {
//     scrollbar-width: none;
//     -ms-overflow-style: none;
//
//     ::-webkit-scrollbar {
//       display: none;
//     }
//   }
//
//   &.ant-modal {
//     ${tw`top-0 m-0 max-w-full rounded-[10px] border-solid dark:border-grey-5 border-1 p-0 `}
//     background: ${({ theme }) => theme.bg2};
//   }
//
//   .ant-modal-body {
//     ${tw`!p-2`};
//   }
//
//   .ant-modal-close {
//     opacity: 0;
//     visibility: hidden;
//   }
// `

const PastTopPrizesPopup: FC<{
  showPastPrize: boolean
  pastTopPrizes
  setShowPastPrize: () => void
}> = ({ pastTopPrizes, showPastPrize, setShowPastPrize }): ReactElement => {
  // const breakpoint = useBreakPoint()
  console.log(pastTopPrizes)

  return (
    <Modal isOpen={showPastPrize} onClose={setShowPastPrize} zIndex={300}>
      <div
        css={[
          tw`flex flex-col items-center justify-center w-screen min-md:w-[598px] h-[263px] border
        absolute min-md:static bottom-0 left-0 sm:animate-slideInBottom dark:border-grey-5 rounded-[10px]
      `
        ]}
      >
        <div
          css={[
            tw`rounded-t-[10px] w-full flex px-3.75
           justify-between items-center text-white text-lg font-semibold py-[10px] gap-[10px]
           border-solid border-b dark:border-grey-5 w-full border-grey-1 dark:bg-black-1 bg-white
           `
          ]}
        >
          <h2 tw="h-8 font-semibold text-average mb-0">Past Top Prizes (Dummy Data)</h2>
          <img
            css={[tw`w-4.5 h-4.5 cursor-pointer`]}
            onClick={setShowPastPrize}
            src={'/img/assets/close-gray-icon.svg'}
          />
        </div>

        <div
          css={[
            tw`flex flex-1 flex-col w-full h-[220px] overflow-y-auto dark:bg-black-1 bg-white px-3.75
         pb-3.75 min-md:pb-5 min-md:rounded-b-[10px]`
          ]}
          className="hideScrollbar"
        >
          {pastTopPrizes?.map((pastTopPrize, index) => (
            <div key={index}>
              <p tw="font-semibold text-tiny dark:text-grey-5 text-black-4 p-1 mt-1">
                Raffle #{pastTopPrize.contestId}
              </p>
              <div>
                {pastTopPrize.contestPrizes.prizeSplit.map((prize, index) => (
                  <div key={index} tw="flex h-[41px] items-center ">
                    <img src={`/img/crypto/${pastTopPrize.contestPrizes.tokenName}.svg`} tw="h-[30px] w-[30px]" />
                    <div tw="h-[30px] flex pl-2 mt-1 flex-col">
                      <p tw="text-regular font-semibold text-regular font-poppins leading-3">
                        {numberFormatter(Number(pastTopPrize.contestPrizes.totalFixedPrize) / prize, 0)}&nbsp;
                        {pastTopPrize.contestPrizes.tokenName}
                      </p>
                      <p tw="dark:text-grey-1 text-grey-2">{'date'}</p>
                    </div>
                    <img
                      css={[tw`w-10 h-10 min-md:w-7.5 min-md:h-7.5 ml-auto cursor-pointer`]}
                      src={'/img/assets/solscan.png'}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}

export default PastTopPrizesPopup
