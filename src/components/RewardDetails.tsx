import React, { BaseSyntheticEvent, FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
//import {useHistory} from 'react-router-dom'
//import {Row} from 'antd'
import { useRewardToggle, useConnectionConfig, useDarkMode } from '../context'
//import {SpaceEvenlyDiv} from '../styles'
import { LAMPORTS_PER_SOL, RIVE_ANIMATION } from '../constants'
import { ADDRESSES as SDK_ADDRESS, CONTROLLER_LAYOUT } from 'goosefx-ssl-sdk'
import tw from 'twin.macro'
import 'styled-components/macro'
import useBreakPoint from '../hooks/useBreakPoint'
import { useAnimateButtonSlide } from '../pages/Farm/FarmFilterHeader'
import { Input, InputRef } from 'antd'
import { Tooltip } from './Tooltip'
import useRewards from '../hooks/useRewards'
import { useWallet } from '@solana/wallet-adapter-react'
import { ADDRESSES } from '../web3'
import { Connection, PublicKey, TokenAmount } from '@solana/web3.js'
import { clamp, nFormatter } from '../utils'
import { useHistory } from 'react-router-dom'
import Modal from './common/Modal'
import { UnstakeTicket } from 'goosefx-stake-rewards-sdk'
import moment from 'moment'
import { useRive, useStateMachineInput } from '@rive-app/react-canvas'
import { BN } from '@project-serum/anchor'
import { Loader } from './Loader'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { ADDRESSES as rewardAddresses } from 'goosefx-stake-rewards-sdk'
// const REWARD_INFO_TEXT = styled.div`
//   ${tw`py-8 px-10`}
//   color: ${({theme}) => theme.text1} !important;
// `
//
// const TEXT_20 = styled.div`
//   ${tw`text-xl font-bold xl:text-tiny`}
//   line-height: inherit;
//   color: ${({theme}) => theme.text1} !important;
// `
// const TEXT_50 = styled.span`
//   ${tw`text-[50px] font-bold xl:text-[40px]`}
// `
//
// const TEXT_60 = styled.span`
//   ${tw`text-6xl font-bold xl:text-[40px]`}
//   font-family: Montserrat;
//   line-height: normal;
//   -webkit-background-clip: text;
//   background-clip: text;
//   -webkit-text-fill-color: transparent;
// `

// const PURPLE60 = styled(TEXT_60)`
//   background-image: linear-gradient(56deg, #716fff 20%, #e95aff 55%);
// `
//
// const TEXT_25 = styled.span`
//   ${tw`text-[25px] font-semibold xl:text-[20px]`}
// `
//
// const TEXT_22 = styled.div`
//   ${tw`text-average mt-[3vh] font-medium xl:text-regular`}
// `
//
// const TEXT_15 = styled.div`
//   ${tw`text-tiny xl:text-[12px]`}
//   color: ${({theme}) => theme.text16};
// `

// const GREEN60 = styled(TEXT_60)`
//   background-image: linear-gradient(264deg, #9cc034 56%, #49821c 99%);
// `

// const REWARD_DETAILS_CONTAINER = styled.div`
//   ${tw`mt-[1%]`}
// `

// const LINE = styled.div`
//   ${tw`w-full h-[2px] mt-4 rotate-0`}
//   background-color: ${({theme}) => theme.text1};
// `
//
// const REWARD_ICON = styled.img`
//   ${tw`h-[38px] w-[38px] ml-3`}
//   filter: ${({theme}) => theme.substractImg};
// `

const FLEX_COL_CONTAINER = styled.div`
  ${tw`flex flex-col sm:pt-0  h-full items-center rounded-t-bigger`}
`

// const STAKE_BTN = styled.button`
//   ${tw`block w-[263px] h-[60px] rounded-[45px] bg-white border-none
//   border-0 text-regular font-bold cursor-pointer text-[#7d289d]`}
// `
//
// const BUY_GOFX = styled.button`
//   ${tw`block w-[263px] h-[60px] rounded-[45px] text-center border-none
//   border-0 text-[17px] font-bold cursor-pointer bg-transparent`}
// `

// const STAKE_TEXT = styled.div`
//   ${tw`text-[28px] font-semibold text-center xl:text-[22px]`}
// `
// const APR_TEXT = styled.div`
//   ${tw`text-[58px] text-center font-bold xl:text-[50px]`}
// `

const CLOSE_ICON = styled.button`
  ${tw`absolute top-[15px] right-[15px] w-[30px] h-[30px] bg-transparent border-0 border-none cursor-pointer`}
`

// const BOLD_TEXT = styled.span`
//   ${tw`font-extrabold`}
// `

interface RewardInfoProps {
  title: string
  subtitle: string
  icon: ReactNode
  children?: React.ReactNode
  isEarnSelected?: boolean
}

const RewardInfo: FC<RewardInfoProps> = ({ title, subtitle, icon, children, isEarnSelected }) => {
  const breakpoint = useBreakPoint()

  return (
    <>
      <div id={'title'} css={tw`flex flex-col min-md:flex-row`}>
        {!breakpoint.isMobile && <div css={tw``}>{icon}</div>}
        {breakpoint.isMobile && !isEarnSelected && <ReferFriendSegment />}
        <div css={tw`flex flex-col gap-2 h-full `}>
          <p
            css={tw`text-[18px] text-center min-md:text-left leading-[22px] min-md:text-3xl dark:text-white
            text-black-4 mb-0 `}
          >
            {title}
          </p>
          <p
            css={tw`min-md:text-lg text-grey-2 mb-0 text-center
            min-md:text-left`}
          >
            {subtitle}
          </p>
        </div>
      </div>
      {children}
    </>
  )
}
interface UnstakeConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
}
const UnstakeConfirmationModal: FC<UnstakeConfirmationModalProps> = ({ isOpen, onClose, amount = 0.0 }) => {
  const { unstake, rewards } = useRewards()
  const handleStakeConfirmation = useCallback(() => {
    unstake(amount)
    onClose()
  }, [amount])
  const canUnstake = useMemo(
    () => rewards.user.staking.userMetadata.totalStaked.gte(new BN(amount)),
    [amount, rewards.user.staking.userMetadata]
  )
  return (
    <Modal isOpen={isOpen} onClose={onClose} zIndex={300}>
      <div
        css={tw`px-[33px] py-[20px] min-md:px-[54px] flex flex-col w-screen min-md:w-[628px] h-[338px] rounded-t-[22px]
      bg-white dark:bg-black-2 relative`}
      >
        <p
          css={tw`mb-0 text-black-4 dark:text-grey-2 text-[18px] leading-[22px] font-semibold text-center w-full`}
        >
          Are you sure you want to unstake {amount} GOFX?
        </p>
        <img
          css={tw`absolute top-[20px] right-[20px] w-[18px] h-[18px] cursor-pointer`}
          onClick={onClose}
          src={`${window.origin}/img/assets/close-lite.svg`}
          alt="copy_address"
        />
        <p css={tw`mb-0 text-grey-1 dark:text-grey-5 mt-[20px] text-[15px] leading-[18px] text-center w-full`}>
          Once the cooldown starts, the process cannot be undone, and you will need to re-stake your GOFX
        </p>
        <button
          css={tw`h-[56px] w-full rounded-[100px] bg-red-2 text-white text-[18px] leading-[22px] text-center
          font-semibold border-0 mt-5`}
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          css={tw`bg-transparent hover:bg-transparent focus:bg-transparent focus:bg-transparent underline
          dark:text-grey-5 text-blue-1 text-[18px] leading-[22px] text-center font-semibold mt-[17px] border-0
        `}
          onClick={handleStakeConfirmation}
          disabled={!canUnstake}
        >
          Yes, Continue With Cooldown
        </button>
        <p
          css={tw`mt-[28.5px] mb-[20px] text-[13px] leading-[16px] text-center w-full text-grey-1 dark:text-grey-2`}
        >
          By selecting “Yes” you agree to{' '}
          <a
            href={'https://docs.goosefx.io/'}
            target={'_blank'}
            rel="noreferrer"
            css={tw`underline dark:text-white text-blue-1`}
          >
            Terms of Service
          </a>
        </p>
      </div>
    </Modal>
  )
}
const EarnRewards: FC = () => {
  const breakpoints = useBreakPoint()
  const inputRef = useRef<InputRef>(null)
  const { wallet, connected, publicKey } = useWallet()
  const { connection, network } = useConnectionConfig()
  const { stake, rewards, getUiAmount } = useRewards()
  const history = useHistory()
  const [isStakeSelected, setIsStakeSelected] = useState(true)
  const [isLoading, setLoading] = useState(false)
  const [userGoFxBalance, setUserGoFxBalance] = useState<TokenAmount>(() => ({
    amount: '0.0',
    decimals: 0,
    uiAmount: 0.0,
    uiAmountString: '0.0'
  }))
  const [inputValue, setInputValue] = useState(0.0)
  const [isUnstakeConfirmationModalOpen, setIsUnstakeConfirmationModalOpen] = useState(false)
  const { rewardToggle } = useRewardToggle()
  const getUserGoFXBalance = useCallback(async () => {
    if (!wallet || !connection || !connected) {
      return
    }
    //const gofxMint = ADDRESSES[network]?.mints?.GOFX_MINT?.address
    //TODO: change back
    const currentNetwork =
      network == WalletAdapterNetwork.Mainnet || network == WalletAdapterNetwork.Testnet ? 'MAINNET' : 'DEVNET'
    const gofx = rewardAddresses[currentNetwork].GOFX_MINT
    const account = await connection.getTokenAccountsByOwner(publicKey, { mint: gofx })
    if (account.value[0]) {
      const balance = await connection.getTokenAccountBalance(account.value[0].pubkey, 'confirmed')
      setUserGoFxBalance(() => balance.value)
    }
  }, [publicKey, connection, network])

  useEffect(() => {
    if (!wallet || !connection || !connected) {
      return
    }
    getUserGoFXBalance()
    // poll user balance
    const interval = setInterval(async () => {
      await getUserGoFXBalance()
    }, 10000)
    return () => clearInterval(interval)
  }, [wallet, getUserGoFXBalance])

  const handleHalf = useCallback(async () => {
    const half = userGoFxBalance.uiAmount / 2

    setInputValue(parseFloat(half.toFixed(2)))
    if (inputRef.current) {
      inputRef.current.input.value = half.toFixed(2)
    }
  }, [userGoFxBalance, inputRef])
  const handleMax = useCallback(async () => {
    setInputValue(parseFloat(userGoFxBalance.uiAmount.toFixed(2)))
    if (inputRef.current) {
      inputRef.current.input.value = userGoFxBalance.uiAmount.toFixed(2)
    }
  }, [userGoFxBalance, inputRef])
  const focusInput = useCallback(() => {
    inputRef.current?.focus()
  }, [inputRef])

  const handleStakeUnstake = useCallback(async () => {
    if (!wallet || !connection || !connected || !inputRef.current) {
      return
    }
    console.log(network)
    const amount = parseFloat(inputRef.current?.input.value) * 10 ** ADDRESSES[network].mints.GOFX.decimals
    if (!amount || isNaN(amount)) {
      return
    }
    setLoading(true)

    if (isStakeSelected) {
      await stake(amount)
    } else {
      setIsUnstakeConfirmationModalOpen(true)
    }
    setLoading(false)
  }, [stake, inputRef, network, isStakeSelected])
  const handleInputChange = useCallback((e) => {
    const value = parseFloat(e.target.value)
    setInputValue(isNaN(value) ? 0.0 : value)
  }, [])
  const handleGoToSwap = useCallback(() => {
    history.push({
      pathname: '/swap',
      search: '?from=SOL&to=GOFX', // query string
      state: {
        // location state
        update: true
      }
    })
    rewardToggle(false)
  }, [history, rewardToggle])
  const handleUnstakeConfirmationModalClose = useCallback(() => {
    setIsUnstakeConfirmationModalOpen(false)
  }, [])
  const totalStaked = useMemo(
    () => getUiAmount(rewards.user.staking.userMetadata.totalStaked),
    [rewards.user.staking.userMetadata.totalStaked]
  )
  const canStakeOrUnstake = useMemo(() => {
    if (inputValue == 0) return false
    if (isStakeSelected) {
      return inputValue <= userGoFxBalance.uiAmount
    } else {
      return inputValue <= totalStaked
    }
  }, [inputValue, userGoFxBalance.uiAmount, totalStaked])
  // twin.macro crashing on obj.property nested access
  return (
    <div css={tw`flex flex-col overflow-y-scroll min-md:overflow-auto items-center h-full`}>
      <UnstakeConfirmationModal
        amount={inputValue}
        isOpen={isUnstakeConfirmationModalOpen}
        onClose={handleUnstakeConfirmationModalClose}
      />
      <div css={tw`flex mt-6 flex-row w-full justify-between items-center flex-wrap `}>
        {breakpoints.isMobile && (
          <StakeUnstakeToggle
            setIsStakeSelected={setIsStakeSelected}
            isStakeSelected={isStakeSelected}
            inputRef={inputRef}
            userGoFxBalance={userGoFxBalance}
            setInputValue={setInputValue}
          />
        )}
        <div tw={'flex flex-col min-md:flex-row gap-1 mt-[20px] min-md:mt-0'}>
          <p
            css={tw`text-[15px] leading-[18px] min-md:text-lg mb-0 font-semibold text-grey-1 dark:text-grey-2 w-max`}
          >
            Wallet Balance:
          </p>
          <p
            css={[
              tw`text-[15px] leading-[18px] min-md:text-lg mb-0 font-semibold text-grey-1 dark:text-grey-1`,
              userGoFxBalance.uiAmount > 0 ? tw`text-black-4 dark:text-grey-2` : tw``
            ]}
          >
            {nFormatter(userGoFxBalance.uiAmount)} GOFX
          </p>
        </div>
        <button
          css={tw`mt-auto min-md:mt-0 border-0 rounded-full w-max py-2 px-4 font-semibold`}
          style={{
            background: `linear-gradient(96.79deg, #F7931A 4.25%, #AC1CC7 97.61%)`
          }}
          onClick={handleGoToSwap}
        >
          Swap GOFX now!
        </button>
      </div>

      <div css={tw`flex flex-row w-full gap-4 mt-[15px] min-md:mt-[30px]`}>
        {!breakpoints.isMobile && (
          <StakeUnstakeToggle
            setIsStakeSelected={setIsStakeSelected}
            isStakeSelected={isStakeSelected}
            inputRef={inputRef}
            userGoFxBalance={userGoFxBalance}
            setInputValue={setInputValue}
          />
        )}
        <div
          onClick={focusInput}
          css={tw`
        relative rounded-[100px] h-[50px] w-full min-md:w-[381px] bg-grey-5 dark:bg-black-1
          dark:border-black-1 items-center flex justify-center
        `}
        >
          <div
            css={tw`text-lg absolute top-[20%] bottom-[15px] left-[15px] z-[1] flex flex-row gap-[15px]
            `}
          >
            <p
              onClick={handleHalf}
              css={[
                tw`mb-0 text-grey-1 cursor-not-allowed dark:text-grey-1`,
                userGoFxBalance.uiAmount > 0.0 ? tw`cursor-pointer text-primary-gradient-1 dark:text-grey-5` : tw``
              ]}
            >
              Half
            </p>
            <p
              onClick={handleMax}
              css={[
                tw`mb-0 text-grey-1 cursor-not-allowed dark:text-grey-1`,
                userGoFxBalance.uiAmount > 0.0 ? tw`cursor-pointer text-primary-gradient-1 dark:text-grey-5` : tw``
              ]}
            >
              Max
            </p>
          </div>

          <Input
            css={tw`text-lg h-[50px] min-md:w-[381px] w-full rounded-[100px] bg-grey-5 text-black-4
            placeholder-grey-1 border-transparent active:border-grey-1 hover:border-grey-1  focus:border-grey-1
            dark:bg-black-1 dark:text-grey-5 focus:dark:border-grey-2 active:dark:border-grey-2
            hover:dark:border-grey-2 pr-[80px]
            `}
            ref={inputRef}
            maxLength={12}
            pattern="\d+(\.\d+)?"
            placeholder={'0'}
            onChange={handleInputChange}
            type={'number'}
          />
          <p
            css={tw`mb-0 text-lg absolute top-[20%] bottom-[15px] right-[15px] z-[1] text-black-4
            dark:text-grey-5 font-semibold
            `}
          >
            GOFX
          </p>
        </div>
      </div>

      <button
        onClick={handleStakeUnstake}
        css={[
          tw`w-full mt-[15px] bg-grey-4 dark:bg-black-1 border-0 relative
           rounded-full py-[14px] px-2 text-[18px] leading-[22px] font-semibold text-grey-2
           h-[50px]
           `,
          canStakeOrUnstake ? tw`bg-blue-1 text-white dark:bg-blue-1 dark:text-white cursor-pointer` : tw``,
          isLoading ? tw`cursor-not-allowed flex justify-center items-center ` : tw``
        ]}
        disabled={!canStakeOrUnstake}
      >
        {isLoading ? (
          <Loader />
        ) : userGoFxBalance.uiAmount > 0.0 ? (
          `${isStakeSelected ? 'Stake' : 'Unstake'} ${inputValue > 0.0 ? `${nFormatter(inputValue)} GOFX` : ''} `
        ) : (
          'Insufficient GOFX'
        )}
      </button>

      {isStakeSelected ? <StakeBottomBar /> : <UnstakeBottomBar />}
    </div>
  )
}
interface StakeUnstakeToggleProps {
  isStakeSelected: boolean
  setIsStakeSelected: (isStakeSelected: boolean) => void
  inputRef: React.MutableRefObject<InputRef>
  setInputValue: (value: number) => void
  userGoFxBalance: TokenAmount
}
const StakeUnstakeToggle = ({
  isStakeSelected,
  setIsStakeSelected,
  inputRef,
  setInputValue,
  userGoFxBalance
}: StakeUnstakeToggleProps) => {
  const sliderRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<HTMLButtonElement[]>([])
  const handleSlide = useAnimateButtonSlide(sliderRef, buttonsRef, isStakeSelected ? 0 : 1)
  const { rewards, getUiAmount } = useRewards()
  const setSliderRef = useCallback(
    (el: HTMLButtonElement) => {
      const index = parseInt(el?.dataset?.index)
      if (isNaN(index)) {
        return
      }
      buttonsRef.current[index] = el
      handleSlide(isStakeSelected ? 0 : 1)
    },
    [isStakeSelected]
  )
  const handleStakeUnstakeToggle = useCallback(
    async (el: BaseSyntheticEvent) => {
      const index = parseInt(el.target.dataset.index)
      handleSlide(index)
      setIsStakeSelected(index === 0)
      const amount = parseFloat(inputRef.current?.input.value)

      if (!amount) {
        return
      }

      setInputValue(
        isStakeSelected
          ? clamp(amount, 0, userGoFxBalance.uiAmount)
          : clamp(amount, 0, getUiAmount(rewards.user.staking.userMetadata.totalStaked))
      )
    },
    [inputRef, rewards, userGoFxBalance]
  )
  return (
    <div
      css={tw`w-full min-md:w-max flex flex-row gap-4 relative justify-center items-center min-md:justify-start`}
    >
      <div ref={sliderRef} css={tw`w-full bg-blue-1 h-[44px] rounded-[36px] z-[0] absolute transition-all`} />
      <button
        ref={setSliderRef}
        data-index={0}
        css={[
          tw`min-w-max px-4 sm:w-1/3 cursor-pointer w-[94px] z-[0] text-center border-none
                border-0 font-semibold text-base h-[44px] rounded-[36px] duration-700 bg-transparent`,
          isStakeSelected ? tw`text-white` : tw`text-grey-1`
        ]}
        onClick={handleStakeUnstakeToggle}
      >
        Stake
      </button>
      <button
        data-index={1}
        ref={setSliderRef}
        css={[
          tw` min-w-max px-4 sm:w-1/3 cursor-pointer w-[94px] z-[0] text-center border-none
                 border-0 font-semibold text-base h-[44px] rounded-[36px] duration-700 bg-transparent`,
          !isStakeSelected ? tw`text-white` : tw`text-grey-1`
        ]}
        onClick={handleStakeUnstakeToggle}
      >
        Unstake
      </button>
    </div>
  )
}
interface AllUnstakingTicketModalProps {
  isOpen: boolean
  onClose: () => void
}
const AllUnstakingTicketsModal: FC<AllUnstakingTicketModalProps> = ({ isOpen, onClose }) => {
  const { rewards } = useRewards()
  return (
    <Modal isOpen={isOpen} onClose={onClose} zIndex={300}>
      <div css={tw`flex flex-col items-center justify-center w-screen min-md:w-[628px] h-screen min-md:h-auto`}>
        <div
          css={tw`rounded-t-[22px] mt-[50%] min-md:mt-0 w-full h-[79px] flex flex-col justify-center items-center
      text-white text-lg font-semibold`}
          style={{ background: 'linear-gradient(181.08deg, #22A668 0%, #194A5E 100%)' }}
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
          css={tw`flex flex-col w-full h-full  py-[20px]  px-[25px] mb-[20px] rounded-b-[22px]
        bg-white dark:bg-black-2 flex-auto
      `}
        >
          {rewards.user.staking.userMetadata.unstakingTickets
            .sort((a, b) => a.createdAt.toNumber() - b.createdAt.toNumber())
            .map((ticket) => (
              <UnstakingTicketLineItem key={ticket.createdAt.toString()} ticket={ticket} />
            ))}
        </div>
      </div>
    </Modal>
  )
}
const UnstakingTicketLineItem = ({ ticket }: { ticket: UnstakeTicket }) => {
  const countDownRef = useRef<HTMLButtonElement>(null)
  const [oneDayLeft, setOneDayLeft] = useState(false)
  const [canClaim, setCanClaim] = useState(false)
  const { redeemUnstakingTickets, getUiAmount, rewards } = useRewards()
  const setRef = useCallback(
    (interval: NodeJS.Timer) => {
      const unixTime = moment.unix(ticket.createdAt.toNumber()).add(7, 'days')
      const momentTime = moment.duration(unixTime.diff(moment()))
      const secondDuration = momentTime.asSeconds()
      setOneDayLeft(secondDuration < 86400)
      setCanClaim(secondDuration <= 0)
      if (countDownRef.current === null) {
        return
      }
      if (secondDuration <= 0) {
        countDownRef.current.innerText = 'Unstake GOFX'
        clearInterval(interval)
        return
      }

      countDownRef.current.innerText = `${momentTime.days()}d ${momentTime.hours()}h ${momentTime.minutes()}min`
    },
    [ticket.createdAt, countDownRef.current]
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setRef(interval)
    }, 60000)
    setRef(interval)
    return () => clearInterval(interval)
  }, [setRef])
  const unstakeGoFX = useCallback(() => {
    const index = rewards.user.staking.unstakeableTickets.findIndex((t) => t.ticket.createdAt.eq(ticket.createdAt))
    redeemUnstakingTickets([{ index, ticket }])
  }, [redeemUnstakingTickets, ticket, rewards])
  const uiUnstakeAmount = useMemo(() => getUiAmount(ticket.totalUnstaked).toString(), [ticket.totalUnstaked])
  if (ticket.createdAt.toNumber() === 0) {
    return null
  }
  return (
    <div css={tw`flex w-full h-[34px] justify-between px-[15px] min-md:px-[25px] mt-[15px] mb-[10px]`}>
      <p css={tw`text-[18px] leading-[22px] mb-0 text-grey-1 dark:text-grey-2 font-semibold`}>
        {uiUnstakeAmount} GOFX
      </p>

      <button
        ref={countDownRef}
        css={[
          tw`py-[9px] px-[32px] rounded-[28px] bg-grey-5 dark:bg-black-1 text-grey-1 text-[15px] leading-[18px]
      font-semibold h-[34px] w-[207px] border-0 cursor-not-allowed`,
          oneDayLeft && !canClaim ? tw`text-red-2` : tw``,
          canClaim ? tw` text-white cursor-pointer` : tw``
        ]}
        disabled={!canClaim}
        style={{
          background: canClaim ? 'linear-gradient(96.79deg, #F7931A 4.25%, #AC1CC7 97.61%)' : ''
        }}
        onClick={unstakeGoFX}
      />
    </div>
  )
}
const UnstakeBottomBar: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { rewards } = useRewards()
  const showUnstakingModal = useCallback(() => {
    if (rewards.user.staking.unstakeableTickets.length == 0) return
    setIsModalOpen(true)
  }, [rewards.user.staking.unstakeableTickets])
  const hideUnstakingModal = useCallback(() => setIsModalOpen(false), [])
  return (
    <>
      <AllUnstakingTicketsModal isOpen={isModalOpen} onClose={hideUnstakingModal} />
      <button
        css={[
          tw`mb-[25px] text-[18px] leading-[22px] text-primary-gradient-1 underline dark:text-grey-5 mt-auto
  cursor-pointer bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent
  font-semibold border-0
  `,
          rewards.user.staking.unstakeableTickets.length == 0 ? 'text-grey-1' : tw``
        ]}
        disabled={rewards.user.staking.unstakeableTickets.length == 0}
        onClick={showUnstakingModal}
      >
        {rewards.user.staking.unstakeableTickets.length == 0 ? 'No Active Cooldowns' : 'See All Active Cooldowns'}
      </button>
    </>
  )
}
const StakeBottomBar: FC = () => {
  const breakpoints = useBreakPoint()
  const { mode } = useDarkMode()
  const approxRewardAmount = 0.0
  return breakpoints.isMobile ? (
    <div css={tw`mt-auto w-full flex flex-col mb-[25px] mt-[15px]`}>
      <div css={tw`flex flex-row justify-between`}>
        <p css={tw`mb-0 text-[15px] leading-[18px]`}>Approx. Daily Rewards</p>
        <p
          css={[
            tw`mb-0 text-[15px] leading-[18px] text-grey-1`,
            approxRewardAmount > 0.0 ? tw`text-black-4 dark:text-grey-5` : tw``
          ]}
        >
          {approxRewardAmount.toFixed(2)} USDC
        </p>
      </div>
      <div css={tw`flex flex-row justify-between`}>
        <div css={tw`flex gap-2`}>
          <p css={tw`mb-0 text-[15px] leading-[18px]`}>Cooldown Period</p>
          <Tooltip
            color={mode === 'dark' ? '#EEEEEE' : '#1C1C1C'}
            title={'You must wait 7 days after unstaking to reclaim your GOFX.'}
          >
            <img css={tw`h-[20px] w-[20px]`} src={'/img/assets/info-icon.svg'} alt={'tooltip'} />
          </Tooltip>
        </div>
        <p css={[tw`mb-0 text-[15px] leading-[18px] text-black-4 dark:text-grey-5`]}>7 days</p>
      </div>
    </div>
  ) : (
    <div
      css={tw`mt-auto w-max px-4 flex flex-row font-semibold rounded-t-lg items-center  gap-4 min-h-[91px]`}
      style={{
        background: `linear-gradient(89.96deg, #36BB7C 0.04%, #194B5E 99.97%)`
      }}
    >
      <div css={tw` flex flex-col`}>
        <p css={tw`mb-0 text-[13px] leading-[16px] `}>Approx. Daily Rewards</p>
        <p css={tw`mb-0 text-[15px] leading-[18px] text-white`}>${approxRewardAmount.toFixed(2)} USDC</p>
      </div>
      <span
        css={tw`h-3/4 rounded-lg`}
        style={{
          border: `1.5px solid rgba(248, 255, 253, 0.2)`
        }}
      />
      <div css={tw`flex flex-col `}>
        <div css={tw`flex gap-2`}>
          <p css={tw`mb-0 text-[13px] leading-[16px]`}>Cooldown period</p>
          <Tooltip
            color={mode === 'dark' ? '#EEEEEE' : '#1C1C1C'}
            title={'You must wait 7 days after unstaking to reclaim your GOFX.'}
          >
            <img css={tw`h-[20px] w-[20px]`} src={'/img/assets/info-icon.svg'} alt={'tooltip'} />
          </Tooltip>
        </div>
        <p css={tw`mb-0`}>7 days</p>
      </div>
    </div>
  )
}
const BuddyLinkReferral: FC = () => {
  const [isReferralNameTaken, setIsReferralNameTaken] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const copyTimeoutRef = useRef<NodeJS.Timeout>(null)
  const referLink = '' // from buddy link
  const onSave = useCallback(() => {
    //TODO: connect buddly link - get result from buddy link

    setIsReferralNameTaken(true)
    setTimeout(() => setIsReferralNameTaken(false), 2000)
  }, [])
  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(referLink)
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
    setIsCopied(true)
    copyTimeoutRef.current = setTimeout(() => {
      setIsCopied(false)
    }, 5000)
  }, [referLink])
  const handleChange = useCallback((e: BaseSyntheticEvent) => {
    setInputValue(e.target.value)
  }, [])
  console.log(isReferralNameTaken)
  return (
    <div
      onClick={copyToClipboard}
      css={[
        tw`border-[1.5px] dark:border-grey-1 border-grey-2  border-dashed cursor-pointer
  flex flex-row  justify-between p-[5px] pl-[15px] items-center w-full rounded-[100px] mt-6 relative`,
        isReferralNameTaken ? tw`border-red-2 dark:border-red-2` : tw``
      ]}
    >
      <p
        css={[
          tw`text-sm mb-0 text-[13px] leading-[16px] min-md:text-[18px] min-md:leading-[22px] text-black-1
       dark:text-grey-5`
        ]}
      >
        app.goosefx.io/
      </p>
      <Input
        css={[
          tw`dark:text-grey-5 text-black-4 text-[13px] leading-[16px] min-md:text-[18px] min-md:leading-[22px] p-0
      text-left w-max border-none pl-[1px] active:shadow-none focus:shadow-none active:border-none focus:border-none
      font-semibold
      `,
          isReferralNameTaken ? tw`text-red-2 dark:text-red-2` : tw``
        ]}
        type={'text'}
        placeholder={'choose your link'}
        onChange={handleChange}
        value={inputValue}
        disabled={Boolean(referLink)}
      />
      <button
        css={[
          tw`border-0 bg-grey-4 dark:bg-black-1 rounded-[72px] h-[40px] w-[94px] text-grey-2 font-semibold`,
          inputValue || referLink
            ? tw`bg-blue-1 dark:bg-blue-1 text-white dark:text-white`
            : isCopied
            ? tw`text-grey-2 dark:text-grey-2 bg-grey-4 dark:bg-black-1`
            : tw``
        ]}
        onClick={referLink ? copyToClipboard : onSave}
        disabled={!(inputValue || referLink)}
      >
        {referLink ? `${isCopied ? 'Copied' : 'Copy'}` : 'Save'}
      </button>
    </div>
  )
}
const ReferAndEarn: FC = () => {
  const handleQuestions = useCallback(() => {
    console.log('DO SOMETHING HERE')
  }, [])
  return (
    <div css={tw`flex flex-col gap-4 font-semibold mb-[25px]`}>
      <BuddyLinkReferral />
      <div css={tw`flex flex-col min-md:flex-row gap-0 min-md:gap-1`}>
        <p css={tw`mb-0 text-sm text-grey-1 font-semibold `}>Still have questions?</p>
        <p css={tw`mb-0 text-sm text-grey-1 font-semibold`}>
          Goto our
          <span
            onClick={handleQuestions}
            css={tw`ml-1 underline text-sm text-blue-1 dark:text-grey-5 cursor-pointer font-semibold
      `}
          >
            referral program documentation
          </span>
        </p>
      </div>
    </div>
  )
}

interface RewardSegmentProps {
  panelIndex: number
  children: React.ReactNode
}
export const RewardInfoComponent: FC<RewardSegmentProps> = ({ panelIndex, children }) => {
  const { mode } = useDarkMode()
  const breakpoint = useBreakPoint()
  const { rive: rewardsRive, RiveComponent: RewardsComponent } = useRive({
    src: RIVE_ANIMATION.rewards.src,
    autoplay: true,
    stateMachines: Object.keys(RIVE_ANIMATION.rewards.stateMachines)
  })
  const { rive: referralRive, RiveComponent: ReferralComponent } = useRive({
    src: RIVE_ANIMATION.referrals.src,
    autoplay: true,
    stateMachines: Object.keys(RIVE_ANIMATION.referrals.stateMachines)
  })
  const animationColorRewards = useStateMachineInput(
    rewardsRive,
    RIVE_ANIMATION.rewards.stateMachines.Rewards.stateMachineName,
    RIVE_ANIMATION.rewards.stateMachines.Rewards.inputs.theme
  )
  const animationColorReferral = useStateMachineInput(
    referralRive,
    RIVE_ANIMATION.referrals.stateMachines.Referrals.stateMachineName,
    RIVE_ANIMATION.referrals.stateMachines.Referrals.inputs.theme
  )
  useEffect(() => {
    if (animationColorRewards) {
      animationColorRewards.value = mode === 'dark'
    }
    if (animationColorReferral) {
      animationColorReferral.value = mode === 'dark'
    }
  }, [mode, animationColorRewards, animationColorReferral])
  const panels = useMemo(
    () => [
      {
        title: 'Earn USDC daily by staking your GOFX',
        subtitle: 'How much would you like to stake?',
        icon: (
          <RewardsComponent
            style={{
              width: '90px',
              height: '97px'
            }}
          />
        ),
        children: <EarnRewards />
      },
      {
        title: 'Refer and get 20% of all the fees!',
        subtitle: 'Earn the 20% of taker fees form each of your referrals',
        icon: (
          <ReferralComponent
            style={{
              width: '90px',
              height: '97px'
            }}
          />
        ),
        children: <ReferAndEarn />
      }
    ],
    [ReferralComponent, RewardsComponent]
  )
  const panel = useMemo(() => {
    if (panelIndex < 0 || panelIndex > panels.length - 1) {
      return { title: '', subtitle: '', icon: '' }
    }
    return panels[panelIndex]
  }, [panels, panelIndex])
  return (
    <div
      css={tw`flex flex-col px-[30px] min-md:px-[93px] pt-3 h-full items-center font-semibold bg-white dark:bg-black-2`}
    >
      {!breakpoint.isMobile && children}
      <div css={tw`flex flex-col max-w-full min-md:pt-6 h-full items-center`}>
        <RewardInfo isEarnSelected={panelIndex == 0} {...panel} />
      </div>
    </div>
  )
}
interface PanelSelectorProps {
  panelIndex: number
  setPanelIndex: (value: number) => void
}
export const PanelSelector: FC<PanelSelectorProps> = ({ panelIndex, setPanelIndex }) => {
  const sliderRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<HTMLButtonElement[]>([])
  const handleSlide = useAnimateButtonSlide(sliderRef, buttonRefs, panelIndex)
  const onChangePanel = useCallback((el: BaseSyntheticEvent) => {
    const index = parseInt(el.currentTarget.dataset.index)
    setPanelIndex(index)
    handleSlide(index)
    // change panel data
  }, [])
  const setRef = useCallback(
    (el: HTMLButtonElement) => {
      const index = parseInt(el?.dataset?.index)
      if (isNaN(index)) return
      buttonRefs.current[index] = el
      if (panelIndex == index) {
        handleSlide(index)
      }
    },
    [panelIndex]
  )
  return (
    <div css={tw`flex flex-row justify-center w-full items-center relative text-lg z-[0] mt-[10px] min-md:mt-0`}>
      <div
        ref={sliderRef}
        css={tw`bg-white w-full min-md:bg-blue-1 h-[44px]  rounded-[36px] z-[-1] absolute transition-all`}
      />
      <button
        css={[
          tw` min-w-max  cursor-pointer w-[120px] text-center border-none border-0
  font-semibold text-base h-[44px] rounded-[36px] duration-700 bg-transparent`,
          panelIndex == 0 ? tw`text-blue-1 min-md:text-white` : tw`text-grey-2 min-md:text-grey-1`
        ]}
        ref={setRef}
        data-index={0}
        onClick={onChangePanel}
      >
        Earn
      </button>
      <button
        css={[
          tw` min-w-max  cursor-pointer w-[120px] text-center border-none border-0
  font-semibold text-base h-[44px] rounded-[36px] duration-700 bg-transparent`,
          panelIndex == 1 ? tw`text-blue-1 min-md:text-white` : tw`text-grey-2 min-md:text-grey-1`
        ]}
        ref={setRef}
        data-index={1}
        onClick={onChangePanel}
      >
        Refer
      </button>
    </div>
  )
}

const EarnRewardsRedirect: FC = () => {
  const [apr, setApr] = useState(0)
  const { connection } = useConnectionConfig()
  const { rewards, getClaimableFees, getUiAmount, claimFees } = useRewards()
  const breakpoints = useBreakPoint()
  const fetchGOFXData = async () => {
    try {
      const { data: controllerData } = await connection.getAccountInfo(SDK_ADDRESS.MAINNET.GFX_CONTROLLER)
      const { stakingBalance, dailyReward } = await CONTROLLER_LAYOUT.decode(controllerData)
      const liqidity = Number(stakingBalance / LAMPORTS_PER_SOL)
      const DR = Number(dailyReward / LAMPORTS_PER_SOL)
      const APR: number = (1 / liqidity) * DR * 365 * 100
      return APR
    } catch (err) {
      return err
    }
  }
  useEffect(() => {
    fetchGOFXData()
      .then((apr) => setApr(apr.toFixed(2)))
      .catch((err) => console.error(err))
  }, [])
  const { usdcClaimable, gofxStaked, totalEarned } = useMemo(
    () => ({
      usdcClaimable: getClaimableFees(),
      gofxStaked: getUiAmount(rewards.user.staking.userMetadata.totalStaked),
      totalEarned: getUiAmount(rewards.user.staking.userMetadata.totalEarned)
    }),
    [rewards, getClaimableFees]
  )
  return (
    <div css={tw`flex pt-[18px] min-md:pt-[45px] flex-col items-center h-full`}>
      <div tw={'flex flex-row min-md:flex-col items-center'}>
        <p tw={'text-[20px] font-semibold text-grey-5 mb-0'}>Rewards</p>
        <p tw={'ml-1 text-[20px] min-md:ml-0 min-md:text-[40px] font-semibold text-white mb-0'}>{apr}% APY</p>
      </div>
      <div
        css={[
          tw`flex flex-col opacity-[0.65] text-center text-[15px] min-md:text-lg gap-4 mt-[16px] min-md:mt-[61px]`,
          totalEarned > 0 ? tw`opacity-100` : tw``
        ]}
      >
        <span tw={'text-[55px] min-md:text-[80px] leading-[40px] text-grey-5'}>{totalEarned.toFixed(2)}</span>
        <p tw={'mb-0 text-[15px] leading-[18px] min-md:text-lg font-semibold'}>USDC Total Earned</p>
      </div>
      <p
        css={[
          tw`mb-0 mt-[15px] text-lg font-semibold opacity-[0.6]
         leading-[22px] text-grey-5`,
          gofxStaked > 0.0 ? tw`opacity-100` : tw``
        ]}
      >
        Total Staked: {nFormatter(gofxStaked)} GOFX
      </p>
      <button
        css={[
          tw`px-4 mt-[15px] min-md:mt-[32px] max-w-[320px] items-center h-[50px]  bg-white text-black-4 border-0
       font-semibold text-[18px] leading-[22px] opacity-[0.5] rounded-[50px] mb-[15px] min-md:mb-0`,
          !usdcClaimable.isZero() ? tw`opacity-100` : tw``
        ]}
        disabled={usdcClaimable.isZero()}
        onClick={claimFees}
      >
        {!usdcClaimable.isZero() ? `Claim ${usdcClaimable.toString(10)} USDC` : 'No USDC Claimable'}
      </button>
      {!breakpoints.isMobile && (
        <p css={tw`mt-auto mb-[15px] text-white text-[13px] font-semibold leading-[16px] text-center`}>
          During cooldown no rewards will be earned
        </p>
      )}
    </div>
  )
}

const ReferAndEarnRedirect: FC = () => {
  const breakpoints = useBreakPoint()
  const totalEarned = 22.22
  const tokenEarned = 'USDC'
  const totalInProgress = 0.0
  return (
    <div css={tw`flex flex-col h-full pt-[26px] w-full items-center`}>
      {!breakpoints.isMobile && <ReferFriendSegment />}
      <div css={tw`flex flex-col justify-center items-center mt-[52px] min-md:mt-[96px]`}>
        <p css={tw`text-6xl mb-0 font-semibold`}>{totalEarned.toFixed(2)}</p>
        <p css={tw`text-lg mb-0 font-semibold`}>{tokenEarned} Total Earned</p>
        <p css={tw`mb-0 text-sm font-semibold`}>
          Bonus in progress: {totalInProgress.toFixed(2)} {tokenEarned}
        </p>
      </div>
      <button
        css={[
          tw`h-[50px] opacity-50 w-[320px] rounded-[100px] bg-white py-3 px-8 text-black-4 font-semibold border-0
        mb-[43px] min-md:mb-0 mt-11`,
          totalInProgress > 0.0 ? tw`opacity-100` : tw``
        ]}
        disabled={totalInProgress <= 0.0}
      >
        {totalInProgress > 0.0 ? `Claim ${totalInProgress.toFixed(2)} ${tokenEarned}` : 'No USDC Claimable'}
      </button>
    </div>
  )
}
const ReferFriendSegment = () => {
  const totalFriends = 5
  return (
    <div css={tw`flex flex-col items-center justify-center w-full`}>
      <p css={tw`mb-0 text-lg font-semibold font-semibold `}>Total Referred: {totalFriends} Friends</p>

      <a
        href={''}
        target={'_blank'}
        css={[
          tw`mb-[30px] min-md:mb-0 text-[20px] leading-[30px] underline font-semibold min-md:dark:text-grey-5
        min-md:text-grey-5 dark:text-grey-1 text-grey-2 mt-[30px] min-md:mt-0 cursor-not-allowed`,
          totalFriends > 0 ? tw`text-white dark:text-white hover:text-white cursor-pointer` : tw``
        ]}
      >
        {totalFriends > 0 ? 'See All Referrals' : 'No Referrals'}
      </a>
    </div>
  )
}
export const RewardRedirectComponent: FC<RewardSegmentProps> = ({ panelIndex, children }) => {
  //const history = useHistory()
  const { rewardToggle } = useRewardToggle()
  const breakpoint = useBreakPoint()
  // const handleStakeClick = () => {
  //   rewardToggle(false)
  //   history.push('/farm')
  // }
  //
  // const handleBuyGOFXClick = () => {
  //   rewardToggle(false)
  //   history.push('/swap')
  // }

  const closeRewardModal = () => {
    rewardToggle(false)
  }
  const handleCloseModal = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeRewardModal()
    }
  }, [])
  useEffect(() => {
    window.addEventListener('keyup', handleCloseModal)
    return () => {
      window.removeEventListener('keyup', handleCloseModal)
    }
  }, [])

  //TODO: opacity toggle
  const panel = useMemo(() => {
    switch (panelIndex) {
      case 1:
        return <ReferAndEarnRedirect />
        break
      case 0:
      default:
        return <EarnRewardsRedirect />
    }
  }, [panelIndex])
  return (
    <FLEX_COL_CONTAINER>
      {breakpoint.isMobile && children}
      <CLOSE_ICON onClick={closeRewardModal}>
        <img src={`${window.origin}/img/assets/close-button.svg`} alt="copy_address" />
      </CLOSE_ICON>
      {panel}
    </FLEX_COL_CONTAINER>
  )
}
