import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import useRewards from '../../context/rewardsContext'
import Modal from '../common/Modal'
import tw from 'twin.macro'
import 'styled-components/macro'
import { UnstakeTicket } from 'goosefx-stake-rewards-sdk'
import moment from 'moment/moment'
import { Loader } from '../Loader'
import { numberFormatter } from '../../utils'

interface AllUnstakingTicketModalProps {
  isOpen: boolean
  onClose: () => void
}
const AllUnstakingTicketsModal: FC<AllUnstakingTicketModalProps> = ({ isOpen, onClose }) => {
  const { activeUnstakingTickets } = useRewards()
  return (
    <Modal isOpen={isOpen} onClose={onClose} zIndex={300}>
      <div
        css={tw`flex flex-col items-center justify-center w-screen min-md:w-[628px] h-[300px] min-md:h-[360px]
        absolute min-md:static bottom-0 left-0
      `}
      >
        <div
          css={tw`rounded-t-[22px] min-md:mt-[50%] min-md:mt-0 w-full h-[79px] flex flex-col justify-center items-center
      text-white text-lg font-semibold`}
          style={{ background: 'linear-gradient(67deg, #22A668 0%, #194A5E 100%)' }}
        >
          <div css={tw`flex w-full h-full justify-between px-[25px] mt-[20px] `}>
            <p css={tw`mb-0 text-[20px] leading-[24px] font-semibold`}>All Active Cooldowns</p>
            <img
              css={tw`w-[18px] h-[18px] cursor-pointer`}
              onClick={onClose}
              src={`${window.origin}/img/assets/cross-white.svg`}
              alt="copy_address"
            />
          </div>
          <div css={tw`flex w-full h-full justify-between px-[25px] mt-[15px] mb-[10px]`}>
            <p css={tw`mb-0 text-[18px] leading-[22px] font-semibold`}>Unstake Amount</p>
            <p css={tw`mb-0 text-[18px] leading-[22px] font-semibold`}>Days Remaining</p>
          </div>
        </div>
        <div
          css={tw`flex flex-col w-full h-[210px] min-md:h-full p-3.75 min-md:py-[20px]  min-md:px-[25px]
            min-md:mb-[20px] min-md:rounded-b-[22px] bg-white dark:bg-black-2 flex-auto overflow-y-scroll gap-2.5
            min-md:gap-5
      `}
        >
          {activeUnstakingTickets.length > 0 ? (
            activeUnstakingTickets
              .sort((a, b) => a.createdAt.toNumber() - b.createdAt.toNumber())
              .map((ticket) => <UnstakingTicketLineItem key={ticket.createdAt.toString()} ticket={ticket} />)
          ) : (
            <p
              css={[
                tw`
              font-semibold text-lg text-grey-1
            `
              ]}
            >
              No Tickets To Claim
            </p>
          )}
        </div>
      </div>
    </Modal>
  )
}
const UnstakingTicketLineItem = ({ ticket }: { ticket: UnstakeTicket }) => {
  const [oneDayLeft, setOneDayLeft] = useState(false)
  const [canClaim, setCanClaim] = useState(false)
  const { redeemUnstakingTickets, getUiAmount, userMetaData } = useRewards()
  const [isClaiming, setIsClaiming] = useState(false)
  const [claimButtonText, setClaimButtonText] = useState('Unstake GOFX')
  const setClaimText = useCallback(
    (interval: NodeJS.Timer) => {
      const unixTime = moment.unix(ticket.createdAt.toNumber()).add(7, 'days')
      const momentTime = moment.duration(unixTime.diff(moment()))
      const secondDuration = momentTime.asSeconds()
      setOneDayLeft(secondDuration < 86400)
      setCanClaim(secondDuration <= 0)

      if (secondDuration <= 0) {
        setClaimButtonText('Unstake GOFX')
        clearInterval(interval)
        return
      }

      setClaimButtonText(`${momentTime.days()}d: ${momentTime.hours()}h: ${momentTime.minutes()}min`)
    },
    [ticket.createdAt]
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setClaimText(interval)
    }, 60000)
    setClaimText(interval)
    return () => clearInterval(interval)
  }, [setClaimText])
  const unstakeGoFX = useCallback(() => {
    setIsClaiming(true)
    const index = userMetaData.unstakingTickets.findIndex((t) => t.createdAt.eq(ticket.createdAt))
    console.log(userMetaData.unstakingTickets, index)
    redeemUnstakingTickets([{ index, ticket }]).finally(() => setIsClaiming(false))
  }, [redeemUnstakingTickets, ticket, userMetaData])
  const uiUnstakeAmount = useMemo(() => getUiAmount(ticket.totalUnstaked), [ticket.totalUnstaked])
  if (ticket.createdAt.toNumber() === 0 || ticket.totalUnstaked.toString() === '0') {
    return null
  }
  return (
    <div css={tw`flex w-full justify-between items-center`}>
      <p css={tw`text-[18px] leading-[22px] mb-0 text-grey-1 dark:text-grey-2 font-semibold`}>
        {numberFormatter(uiUnstakeAmount, uiUnstakeAmount <= 0.1 && uiUnstakeAmount >= 0.0 ? 4 : 2)} GOFX
      </p>

      <button
        css={[
          tw`py-[9px] px-[32px] rounded-[28px] bg-grey-5 dark:bg-black-1 text-grey-1 text-[15px] leading-normal
      font-semibold h-[40px] w-[160px] min-md:w-[207px] border-0 cursor-not-allowed whitespace-nowrap
      relative flex items-center justify-center`,
          oneDayLeft && !canClaim && tw`text-red-2`,
          canClaim && tw` text-white cursor-pointer`,
          isClaiming && tw`cursor-not-allowed `
        ]}
        disabled={!canClaim}
        style={{
          background: canClaim ? 'linear-gradient(96.79deg, #F7931A 4.25%, #AC1CC7 97.61%)' : ''
        }}
        onClick={unstakeGoFX}
      >
        {isClaiming ? (
          <div css={[tw`absolute`]}>
            <Loader zIndex={2} />
          </div>
        ) : (
          claimButtonText
        )}
      </button>
    </div>
  )
}

export default AllUnstakingTicketsModal
