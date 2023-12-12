/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, ReactElement, useEffect, useMemo } from 'react'
import tw from 'twin.macro'
import Modal from '../../common/Modal'
import useBoolean from '../../../hooks/useBoolean'
import { IPrizeWinnings } from '../../../types/raffle_details'
import { numberFormatter } from '../../../utils'
import { GradientText } from '../../GradientText'
import { useRaffleContext } from '../../../context/raffle_context'

const RaffleRevealUserPrize: FC<{
  showRevealPrize: boolean
  setShowRevealPrize: () => void
  userPrize: number
}> = ({ showRevealPrize, setShowRevealPrize, userPrize }): ReactElement => {
  // const breakpoint = useBreakPoint()
  const [revealAnimation, setShowRevealAnimation] = useBoolean(true)

  useEffect(() => {
    setTimeout(() => {
      setShowRevealAnimation.off()
    }, 3000)
  }, [])
  return (
    <Modal isOpen={showRevealPrize} onClose={setShowRevealPrize} zIndex={300}>
      <div
        css={[
          tw`flex flex-col w-screen min-md:w-[598px] h-[263px] border
        absolute min-md:static bottom-0 left-0 sm:animate-slideInBottom dark:border-grey-5 rounded-[10px]
      `
        ]}
      >
        {revealAnimation ? <RevealAnimation /> : <RevealPrize userPrize={userPrize} />}
      </div>
    </Modal>
  )
}
const RevealAnimation = () => (
  <>
    <div
      css={[
        tw`rounded-t-[10px] w-full flex px-3.75 justify-between items-center 
            text-white text-lg font-semibold py-[10px] gap-[10px] w-full dark:bg-black-1 bg-white
           `
      ]}
    >
      <h2 tw="h-8 font-semibold text-average mb-0 text-center ml-auto mr-auto">Reveling Your Prize...</h2>
    </div>
    <div
      css={[
        tw`flex flex-1 flex-col items-center w-full h-[220px] overflow-y-auto dark:bg-black-1 bg-white px-3.75
         pb-3.75 min-md:pb-5 min-md:rounded-b-[10px] pt-6 `
      ]}
    >
      <img src="/img/assets/theEgg.svg" tw="h-[150px] w-[122px]" />
      <p tw="text-regular">Lucky stars align, may the raffle prize be thine!</p>
    </div>
  </>
)

const RevealPrize: FC<{ userPrize: number }> = ({ userPrize }) => {
  const { raffleDetails } = useRaffleContext()
  const prizeToken = useMemo(() => raffleDetails?.contestPrizes.fixedPrizes.tokenName, [raffleDetails])
  const prizeWon = useMemo(
    () => userPrize / Math.pow(10, raffleDetails?.contestPrizes?.fixedPrizes?.tokenDecimals),
    [raffleDetails]
  )

  return (
    <>
      <div
        css={[
          tw`rounded-[10px] w-full h-full flex-col flex px-3.75 justify-between items-center 
              text-white text-lg font-semibold py-[10px] gap-[10px] w-full dark:bg-black-1 bg-white `
        ]}
      >
        <h2 tw="h-8 font-semibold text-average mb-0 text-center ml-auto mr-auto">
          Spread The Joy, Share The Love!
        </h2>
        <div
          css={[
            tw`flex flex-1 flex-col items-center w-full h-[300px] overflow-y-auto dark:bg-black-1 bg-white px-3.75
           pb-3.75 min-md:pb-5 min-md:rounded-b-[10px] pt-6 `
          ]}
        >
          <div tw="flex flex-col justify-center items-center">
            <img src={`/img/crypto/${prizeToken}.svg`} tw="h-10 w-10" />
            <div tw="flex flex-col justify-center items-center">
              <p tw="text-regular text-center mt-2 font-semibold">You Won</p>
              <h6>
                <GradientText
                  text={userPrize ? numberFormatter(prizeWon, 2) + ' ' + prizeToken : '0.00'}
                  fontSize={15}
                  fontWeight={800}
                />
              </h6>
              <h6 tw="mt-4 text-regular">Share it with your friends!</h6>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RaffleRevealUserPrize
