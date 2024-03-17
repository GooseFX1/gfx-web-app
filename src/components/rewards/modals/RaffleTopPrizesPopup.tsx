import React, { FC, ReactElement, useEffect } from 'react'
import useBreakPoint from '../../../hooks/useBreakPoint'
import { getRafflePastPrizes } from '../../../api/rewards'
import { IPastPrizes, RaffleDetails } from '../../../types/raffle_details'
import Modal from '../../common/Modal'
import { numberFormatter } from '../../../utils'

const PastTopPrizesPopup: FC<{
  showPastPrize: boolean
  setShowPastPrize: () => void
}> = ({ showPastPrize, setShowPastPrize }): ReactElement => {
  const breakpoint = useBreakPoint()
  const [pastPrizes, setPastPrizes] = React.useState<IPastPrizes>()

  useEffect(() => {
    ;(async () => {
      const res = await getRafflePastPrizes()
      setPastPrizes(res)
    })()
  }, [])
  console.log(breakpoint)
  return (
    <Modal isOpen={showPastPrize} onClose={setShowPastPrize} zIndex={300}>
      <div
        className={`flex flex-col items-center justify-center w-screen min-md:w-[598px] h-[360px]
        absolute min-md:static bottom-0 left-0 sm:animate-slideInBottom
      `}
      >
        <div
          className={`rounded-t-[10px] w-full flex px-3.75
           justify-between items-center text-white text-lg font-semibold py-[10px] gap-[10px]
           border-solid border-b-[0.5px] border-grey-1 dark:bg-black-1 bg-white
           `}
        >
          <h2 className="h-8 font-semibold text-average mb-0">Past Top Prizes</h2>
          <img
            className={`w-4.5 h-4.5 cursor-pointer`}
            onClick={setShowPastPrize}
            src={'/img/assets/close-gray-icon.svg'}
          />
        </div>

        <div
          className={`flex flex-1 flex-col w-full h-[220px] overflow-y-auto dark:bg-black-1 bg-white px-3.75
         pb-3.75 min-md:pb-5 min-md:rounded-b-[10px] hideScrollbar`}
        >
          {pastPrizes?.raffleDetails?.map((raffle: RaffleDetails, index) => (
            <div key={index}>
              <p className="font-semibold text-tiny dark:text-grey-5 text-black-4 p-1 mt-1">{raffle.raffleId}</p>
              <div>
                {raffle.prizes.map((prize, index) => (
                  <div key={index} className="flex items-center gap-3.75">
                    <img src={`/img/crypto/${prize.currency}.svg`} className="h-[30px] w-[30px]" />
                    <div className=" h-[41px] ">
                      <p className="text-regular font-semibold">
                        {numberFormatter(prize.amount)}&nbsp;{prize.currency}
                      </p>
                      <p>{prize.date}</p>
                    </div>
                    <img
                      className={`w-10 h-10 min-md:w-7.5 min-md:h-7.5 ml-auto cursor-pointer`}
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
