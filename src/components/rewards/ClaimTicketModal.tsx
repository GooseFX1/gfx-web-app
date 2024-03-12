import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import useRewards from '../../context/rewardsContext'
import { UnstakeTicket } from 'goosefx-stake-rewards-sdk'
import moment from 'moment/moment'
import { Loader } from '../Loader'
import { numberFormatter } from '../../utils'
import { Button, cn, Dialog, DialogBody, DialogContent, DialogHeader, DialogOverlay } from 'gfx-component-lib'
import useBreakPoint from '@/hooks/useBreakPoint'
import CloseLite from '@/assets/close-lite.svg?react'
interface AllUnstakingTicketModalProps {
  isOpen: boolean
  onClose: () => void
}
const AllUnstakingTicketsModal: FC<AllUnstakingTicketModalProps> = ({ isOpen, onClose }) => {
  const { activeUnstakingTickets } = useRewards()
  const { isMobile } = useBreakPoint()
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className={'z-[961]'} />
      <DialogContent
        className={cn('z-[962] min-md:w-[400px] h-[310px] pt-3')}
        fullScreen={isMobile}
        placement={isMobile ? 'bottom' : 'default'}
      >
        <DialogHeader
          className={`flex flex-col w-full h-[58px] justify-between px-2.5 pb-1.25 border-b-1 border-solid
        border-border-lightmode-secondary dark:border-border-darkmode-secondary`}
        >
          <div className={'w-full flex flex-row justify-between items-center'}>
            <p className={`mb-0 text-[20px] leading-[24px] font-semibold`}>All Active Cooldowns</p>
            <CloseLite
              className={`w-[18px] h-[18px] cursor-pointer min-md:mr-[15px] 
              stroke-border-lightmode-primary dark:stroke-border-darkmode-primary
              `}
              onClick={onClose}
            />
          </div>
          <div className={`flex w-full justify-between `}>
            <p className={`mb-0 text-[18px] leading-[22px] font-semibold`}>Unstake Amount</p>
            <p className={`mb-0 text-[18px] leading-[22px] font-semibold`}>Days Remaining</p>
          </div>
        </DialogHeader>
        <DialogBody
          className={`flex flex-col w-full h-[210px] min-md:h-full 
            min-md:mb-[20px] min-md:rounded-b-[10px] bg-white dark:bg-black-2 flex-auto overflow-y-scroll gap-2.5
            min-md:gap-5 p-2.5
      `}
        >
          {activeUnstakingTickets.length > 0 ? (
            activeUnstakingTickets
              .sort((a, b) => a.createdAt.toNumber() - b.createdAt.toNumber())
              .map((ticket) => <UnstakingTicketLineItem key={ticket.createdAt.toString()} ticket={ticket} />)
          ) : (
            <p
              className={`
              font-semibold text-lg text-grey-1 text-center
            `}
            >
              No Tickets To Claim
            </p>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
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
    <div className={`flex w-full justify-between items-center`}>
      <p className={`text-[18px] leading-[22px] mb-0 text-grey-1 dark:text-grey-2 font-semibold`}>
        {numberFormatter(uiUnstakeAmount, uiUnstakeAmount <= 0.1 && uiUnstakeAmount >= 0.0 ? 4 : 2)} GOFX
      </p>

      <Button
        className={cn(
          `py-[9px] px-[32px] rounded-[28px] bg-grey-5 dark:bg-black-1 text-grey-1 leading-normal
      font-bold h-10 w-[160px] min-md:w-[207px] border-0 cursor-not-allowed whitespace-nowrap text-regular
      relative flex items-center justify-center`,
          oneDayLeft && !canClaim && `text-red-2`,
          canClaim && ` text-white cursor-pointer`,
          isClaiming && `cursor-not-allowed `
        )}
        disabled={!canClaim}
        colorScheme={canClaim ? 'primaryGradient' : 'default'}
        onClick={unstakeGoFX}
      >
        {isClaiming ? (
          <div className={`absolute`}>
            <Loader zIndex={2} />
          </div>
        ) : (
          claimButtonText
        )}
      </Button>
    </div>
  )
}

export default AllUnstakingTicketsModal
