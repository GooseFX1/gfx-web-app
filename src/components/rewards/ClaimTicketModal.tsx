import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import useRewards from '../../context/rewardsContext'
import { UnstakeTicket } from 'goosefx-stake-rewards-sdk'
import moment from 'moment/moment'
import { numberFormatter } from '../../utils'
import {
  Button,
  cn,
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal, Icon
} from 'gfx-component-lib'
import useBreakPoint from '@/hooks/useBreakPoint'
import CloseLite from '@/assets/close-lite.svg?react'
import { PropsWithKey } from '@/types/helper'

interface AllUnstakingTicketModalProps {
  isOpen: boolean
  onClose: () => void
}

const AllUnstakingTicketsModal: FC<AllUnstakingTicketModalProps> = ({ isOpen, onClose }) => {
  const { activeUnstakingTickets } = useRewards()
  const { isMobile } = useBreakPoint()
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className={''} />
        <DialogContent
          className={cn(' min-md:w-[400px] h-[310px] pt-3 flex flex-col gap-0')}
          fullScreen={isMobile}
          placement={isMobile ? 'bottom' : 'default'}
        >
          <DialogHeader
            className={`space-y-0 flex flex-col w-full h-[58px] justify-between px-2.5 pb-1.25 border-b-1 border-solid
        border-border-lightmode-secondary dark:border-border-darkmode-secondary gap-1.5`}
          >
            <div className={'w-full flex flex-row justify-between items-center'}>
              <h3 className={`mb-0 text-h3 `}>All Active Cooldowns</h3>
              <CloseLite
                className={`w-[18px] h-[18px] cursor-pointer min-md:mr-[15px] 
              stroke-border-lightmode-primary dark:stroke-border-darkmode-primary
              `}
                onClick={onClose}
              />
            </div>
            <div className={`flex w-full justify-between `}>
              <p className={`mb-0 text-b3 font-semibold dark:text-text-darkmode-secondary 
              text-text-lightmode-secondary`}>
                GOFX Amount
              </p>
              <p className={`mb-0 text-b3 font-semibold dark:text-text-darkmode-secondary 
              text-text-lightmode-secondary`}>
                Days Remaining
              </p>
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
      </DialogPortal>
    </Dialog>
  )
}
const UnstakingTicketLineItem = ({ ticket }: PropsWithKey<{ ticket: UnstakeTicket }>) => {
  const [oneDayLeft, setOneDayLeft] = useState(false)
  const [canClaim, setCanClaim] = useState(false)
  const { redeemUnstakingTicketsMutation, getUiAmount, userMetaData } = useRewards()
  const [claimButtonText, setClaimButtonText] = useState('Unstake GOFX')
  const setClaimText = useCallback(
    (interval: NodeJS.Timeout) => {
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

      setClaimButtonText(`${momentTime.days()}D: ${momentTime.hours()}H: ${momentTime.minutes()}Min`)
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
    const index = userMetaData.unstakingTickets.findIndex((t) => t.createdAt.eq(ticket.createdAt))
    redeemUnstakingTicketsMutation.mutate([{ index, ticket }])
  }, [redeemUnstakingTicketsMutation, ticket, userMetaData])
  const uiUnstakeAmount = useMemo(() => getUiAmount(ticket.totalUnstaked), [ticket.totalUnstaked])
  if (ticket.createdAt.toNumber() === 0 || ticket.totalUnstaked.toString() === '0') {
    return null
  }

  return (
    <div className={`flex w-full justify-between items-center`}>
      <div className={'inline-flex gap-2 items-center'}>
        <Icon src={'/img/crypto/GOFX.svg'} className={'w-[25px] h-[25px] min-w-[25px] min-h-[25px]'}/>
        <p className={`text-b2 leading-normal mb-0 text-text-lightmode-primary dark:text-text-darkmode-primary 
      font-semibold`}>
          {numberFormatter(uiUnstakeAmount, uiUnstakeAmount <= 0.1 && uiUnstakeAmount >= 0.0 ? 4 : 2)}
        </p>
      </div>

      <Button
        className={cn(
          `h-10 w-[130px] border-0 whitespace-nowrap relative items-center justify-center`,
          oneDayLeft &&
            !canClaim &&
            `disabled:text-text-red disabled:dark:text-text-red opacity-100 dark:opacity-100`,
          canClaim && ` text-white`,
          redeemUnstakingTicketsMutation.isLoading && `cursor-not-allowed `
        )}
        disabled={!canClaim || redeemUnstakingTicketsMutation.isLoading}
        colorScheme={canClaim ? 'primaryGradient' : 'default'}
        onClick={unstakeGoFX}
        isLoading={redeemUnstakingTicketsMutation.isLoading}
      >
        {claimButtonText}
      </Button>
    </div>
  )
}

export default AllUnstakingTicketsModal
