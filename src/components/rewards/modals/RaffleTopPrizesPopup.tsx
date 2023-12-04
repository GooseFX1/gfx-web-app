import React, { Dispatch, FC, ReactElement, SetStateAction, useEffect } from 'react'
import { PopupCustom } from '../../../pages/NFTs/Popup/PopupCustom'
import useBreakPoint from '../../../hooks/useBreakPoint'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { getRafflePastPrizes } from '../../../api/rewards'
import { IPastPrizes, RaffleDetails } from '../../../types/raffle_details'

const STYLED_POPUP = styled(PopupCustom)`
  .hideScrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;

    ::-webkit-scrollbar {
      display: none;
    }
  }

  &.ant-modal {
    ${tw`top-0 m-0 max-w-full rounded-[10px] border-solid dark:border-grey-5 border-1 p-0 `}
    background: ${({ theme }) => theme.bg2};
  }

  .ant-modal-body {
    ${tw`!p-2`};
  }

  .ant-modal-close {
    opacity: 0;
    visibility: hidden;
  }
`

const PastTopPrizesPopup: FC<{
  showPastPrize: boolean
  setShowPastPrize: Dispatch<SetStateAction<boolean>>
}> = ({ showPastPrize, setShowPastPrize }): ReactElement => {
  const breakpoint = useBreakPoint()
  const [pastPrizes, setPastPrizes] = React.useState<IPastPrizes>()

  useEffect(() => {
    ;(async () => {
      const res = await getRafflePastPrizes()
      setPastPrizes(res)
    })()
  }, [])

  return (
    <STYLED_POPUP
      height={breakpoint.isMobile ? '553px' : '263px'}
      width={breakpoint.isMobile ? '354px' : '484px'}
      title={null}
      $hideClose={true}
      centered={true}
      visible={showPastPrize ? true : false}
      onCancel={() => setShowPastPrize(false)}
      footer={null}
    >
      <div tw="h-8 font-semibold text-average">Past Top Prizes</div>
      <div tw="border-solid border-[0.5px] w-[calc(100% + 16px)] ml-[-8px]"></div>
      <div tw="h-[220px] overflow-y-auto" className="hideScrollbar">
        {pastPrizes?.raffleDetails?.map((raffle: RaffleDetails, index) => (
          <div key={index}>
            <div tw="font-semibold text-tiny dark:text-grey-5 text-black-4 p-1 mt-1">{raffle.raffleId}</div>
            <div>
              {raffle.prizes.map((prize, index) => (
                <div key={index} tw="flex items-center ml-1">
                  <img src={`/img/crypto/${prize.currency}.svg`} tw="h-[30px] w-[30px]" />
                  <div tw=" h-[41px]  ml-2">
                    <div tw="text-regular font-semibold">{prize.amount}</div>
                    <div>{prize.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </STYLED_POPUP>
  )
}

export default PastTopPrizesPopup
