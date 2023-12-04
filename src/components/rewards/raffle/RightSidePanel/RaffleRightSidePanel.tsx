/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import PrizeItem from './RafflePrizeItem'
import Countdown from './RaffleCountDown'
import { Button } from '../../../Button'
import { getRaffleDetails } from '../../../../api/rewards'
import { RaffleContest } from '../../../../types/raffle_details'
import PastTopPrizesPopup from '../../modals/RaffleTopPrizesPopup'
import useBoolean from '../../../../hooks/useBoolean'

const RaffleRightPanel = (): ReactElement => {
  const [raffleDetails, setRaffleDetails] = useState<RaffleContest>()
  const [showPastPrize, setShowPastPrize] = useBoolean(false)

  useEffect(() => {
    ;(async () => {
      const raffle: RaffleContest = await getRaffleDetails()
      setRaffleDetails(raffle)
    })()
  }, [])

  const prizeToken = useMemo(() => raffleDetails?.contestPrizes.fixedPrizes.tokenName, [raffleDetails])

  const getPriceUtil = useCallback(
    (denominator: number) => {
      const totalFixedPrice = raffleDetails?.contestPrizes.fixedPrizes.totalFixedPrize
      const price = Number(totalFixedPrice) * (denominator / 100)
      return Math.floor(price) || 0 // Ensure the return is a number, not NaN
    },
    [raffleDetails]
  )

  const getFixedPrizes = useCallback(() => {
    if (!raffleDetails) return { firstPrize: 0, secondPrize: 0, thirdPrize: 0 }
    const priceSplit = raffleDetails?.contestPrizes.fixedPrizes.prizeSplit
    const firstPrize = getPriceUtil(priceSplit[0])
    const secondPrize = getPriceUtil(priceSplit[1])
    const thirdPrize = getPriceUtil(priceSplit[2])
    return { firstPrize, secondPrize, thirdPrize }
  }, [raffleDetails, getPriceUtil])

  const { firstPrize, secondPrize, thirdPrize } = getFixedPrizes()
  const buttonText = useMemo(() => {
    if (!raffleDetails) return 'Enter Raffle'
    const raffleStartTime = raffleDetails?.contestStartTimestamp
    if (raffleStartTime > Date.now() / 1000) return 'Raffle Starts in ${}'
    // const raffleEndTime = raffleDetails?.contestEndTimestamp;
    // if (raffleEndTime < Date.now()) return 'Raffle Ended'

    return 'Enter Raffle'
  }, [raffleDetails])

  const showModals = useMemo(() => {
    if (showPastPrize)
      return <PastTopPrizesPopup showPastPrize={showPastPrize} setShowPastPrize={setShowPastPrize.off} />
  }, [showPastPrize])

  return (
    <div tw="flex flex-col flex-1  gap-2.5 min-md:gap-7.5">
      {showModals}
      <p tw="text-average font-semibold flex items-center justify-center">{raffleDetails?.contestName}</p>
      <div css={[tw`flex flex-col gap-2.5 min-md:gap-7.5`]}>
        <div tw="flex flex-1 flex-wrap  items-center w-full justify-around ">
          <PrizeItem position={'first'} prizeAmount={firstPrize} tokenImage={`/img/crypto/${prizeToken}.svg`} />
          <PrizeItem position={'second'} prizeAmount={secondPrize} tokenImage={`/img/crypto/${prizeToken}.svg`} />
          <PrizeItem position={'third'} prizeAmount={thirdPrize} tokenImage={`/img/crypto/${prizeToken}.svg`} />
        </div>

        <p tw="hidden min-md:flex text-white font-semibold text-average text-center justify-center">
          And 20,000 GOFX Distributed to <br /> winners from #4 to #20!
        </p>

        <p tw="text-white font-semibold text-average flex justify-center">Next Raffle Starts In:</p>

        <Countdown timestamp={raffleDetails?.contestStartTimestamp} />
        <Button
          onClick={setShowPastPrize.on}
          cssStyle={tw`underline text-white font-semibold text-regular  flex
        justify-center cursor-pointer`}
        >
          See Past Top Prices
        </Button>
      </div>
    </div>
  )
}

export default RaffleRightPanel
