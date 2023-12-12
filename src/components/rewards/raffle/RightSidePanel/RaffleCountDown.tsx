/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import tw from 'twin.macro'
import Button from '../../../twComponents/Button'
import useBoolean from '../../../../hooks/useBoolean'
import { Loader } from '../../../Loader'
import { claimPrize } from './claimPrize'
import { useWallet } from '@solana/wallet-adapter-react'
import { notify } from '../../../../utils'
import { successClaimMessage } from '../../../../pages/FarmV3/constants'
import { genericErrMsg } from '../../../Farm/generic'
import { useRaffleContext } from '../../../../context/raffle_context'
import { Connect } from '../../../../layouts'
import * as anchor from '@coral-xyz/anchor'
import { getAddressMapping } from '../../../../web3'

const Countdown: FC<{
  endTimeStamp: number
  showRevealModal
  prizeClaimable
  program: anchor.Program
}> = ({ endTimeStamp, showRevealModal, prizeClaimable, program }) => {
  const [isLoading, setIsLoading] = useBoolean(false)
  const raffleEnded = useMemo(() => endTimeStamp < Date.now() / 1000, [endTimeStamp])
  const [buttonDisabled, setButtonDisabled] = useBoolean(true)
  const { wallet } = useWallet()
  const publicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])
  const [timeLeft, setTimeLeft] = useState('')
  const { fetchUpdatedUserStats, raffleDetails } = useRaffleContext()
  const prizeToken = useMemo(() => raffleDetails?.contestPrizes?.fixedPrizes?.tokenName, [raffleDetails])

  const callPrizeClaimable = useCallback(() => {
    setTimeout(() => {
      fetchUpdatedUserStats()
    }, 3000)
  }, [])
  // TODO: Create a util function
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const targetDate = new Date(endTimeStamp * 1000).getTime() // Fix: Convert targetDate to number using getTime()
      const difference = targetDate - now

      if (difference <= 0) {
        clearInterval(interval)
        setTimeLeft('Started')
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        setTimeLeft(`${days > 0 ? days + `D:` : ``} ${hours > 0 ? hours + 'H:' : ``} ${minutes} Min`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [endTimeStamp])

  const fakeLoad = async () => {
    setIsLoading.on()
    setTimeout(setIsLoading.off, 2000)
    showRevealModal.on()

    try {
      const mintAddrPubKey = getAddressMapping(prizeToken)
      const claim = await claimPrize(program, publicKey, mintAddrPubKey.address)
      if (claim === true) {
        notify(successClaimMessage(prizeToken))
        callPrizeClaimable()
      } else {
        notify(genericErrMsg(claim.toString()))
        showRevealModal.off()
      }
    } catch (e) {
      console.log(e)
    }
  }

  const buttonText = useMemo(() => {
    if (endTimeStamp > Date.now() / 1000) return timeLeft
    if (!raffleDetails?.contestClaimPrizeEnabled) {
      setButtonDisabled.on()
      return 'We are Selecting Prizes'
    }
    if (prizeClaimable === null) return 'Better Luck Next Time'
    if (prizeClaimable === 0) {
      setButtonDisabled.on()
      return 'Claimed'
    }
    if (prizeClaimable > 0 && raffleEnded) {
      setButtonDisabled.off()
      return 'Reveal the Prize'
    }
    return 'Enter Raffle'
  }, [endTimeStamp, raffleEnded, timeLeft, prizeClaimable, raffleDetails])

  useEffect(() => {
    if (prizeClaimable > 0) {
      setButtonDisabled.off()
    } else {
      setButtonDisabled.on()
    }
  }, [prizeClaimable, raffleEnded])
  if (!publicKey && raffleEnded) return <Connect customButtonStyle={[tw`sm:w-[80vw] w-[320px] h-10`]} />

  return (
    <Button
      cssClasses={[
        tw`bg-white flex justify-center w-[320px] h-10 text-blue-1 font-semibold text-average`,
        buttonDisabled && tw`opacity-50`
      ]}
      disabled={isLoading || buttonDisabled}
      onClick={fakeLoad}
    >
      {isLoading ? <Loader zIndex={2} color={'#5855FF'} /> : buttonText}
    </Button>
  )
}

export default Countdown
