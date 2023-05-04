import React, { BaseSyntheticEvent, FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
//import {useHistory} from 'react-router-dom'
//import {Row} from 'antd'
import { useRewardToggle, useConnectionConfig, useDarkMode } from '../context'
//import {SpaceEvenlyDiv} from '../styles'
import { LAMPORTS_PER_SOL } from '../constants'
import { ADDRESSES as SDK_ADDRESS, CONTROLLER_LAYOUT } from 'goosefx-ssl-sdk'
import tw from 'twin.macro'
import 'styled-components/macro'
import useBreakPoint from '../hooks/useBreakPoint'
import { useAnimateButtonSlide } from '../pages/Farm/FarmFilterHeader'
import { Input } from 'antd'

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
  ${tw`flex flex-col sm:pt-0 pt-[45px] h-full items-center rounded-t-bigger`}
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
  icon: string
  children?: React.ReactNode
}

const RewardInfo: FC<RewardInfoProps> = ({ title, subtitle, icon, children }) => {
  const breakpoint = useBreakPoint()

  return (
    <>
      <div id={'title'} css={tw`flex flex-row gap-12 `}>
        {!breakpoint.isMobile && <img css={tw`self-start`} src={icon} alt="copy_address" />}
        <div css={tw`flex flex-col gap-2 h-full `}>
          <p css={tw`text-lg lg:text-3xl dark:text-white text-black-4 mb-0 `}>{title}</p>
          <p css={tw`text-lg text-grey-2 mb-0`}>{subtitle}</p>
        </div>
      </div>
      {children}
    </>
  )
}
const EarnRewards: FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<HTMLButtonElement[]>([])
  const handleSlide = useAnimateButtonSlide(sliderRef, buttonsRef)
  const amount = 0.0
  const userGoFxAmount = 0.0
  const stakedGoFX = 0.0
  const approxRewardAmount = 0.0

  const handleStake = () => {
    handleSlide(0)
  }
  const handleUnstake = () => {
    handleSlide(1)
  }
  return (
    <>
      <div css={tw`flex mt-6 flex-row w-full justify-between items-center flex-wrap `}>
        <p css={tw`text-lg mb-0 font-semibold text-grey-1 dark:text-grey-2 w-max`}>
          Wallet Balance:
          <span css={tw`text-[${amount > 0.0 ? '#B5B5B5' : '#636363'}]`}> {amount.toFixed(2)} GOFX</span>
        </p>
        <button
          css={tw`border-0 rounded-full w-max py-2 px-4`}
          style={{
            background: `linear-gradient(96.79deg, #F7931A 4.25%, #AC1CC7 97.61%)`
          }}
        >
          Swap GOFX now!
        </button>
      </div>

      <div css={tw`flex flex-row gap-4`}>
        <div css={tw`flex flex-row gap-4 relative`}>
          <div
            ref={sliderRef}
            css={tw` w-full bg-[#5855ff]  h-[44px]  rounded-[36px] z-[0] absolute transition-all`}
          />
          <button
            ref={(el) => {
              buttonsRef.current[0] = el
              handleSlide(0)
            }}
            data-index={0}
            css={tw`sm:m-auto min-w-max px-4 sm:w-1/3 cursor-pointer w-[94px] z-[0] text-center border-none 
                border-0 font-semibold text-base h-[44px] rounded-[36px] duration-700 bg-transparent`}
            onClick={handleStake}
          >
            Stake
          </button>
          <button
            data-index={1}
            ref={(el) => (buttonsRef.current[1] = el)}
            css={tw` sm:m-auto min-w-max px-4 sm:w-1/3 cursor-pointer w-[94px] z-[0] text-center border-none
                 border-0 font-semibold text-base h-[44px] rounded-[36px] duration-700 bg-transparent`}
            onClick={handleUnstake}
          >
            Unstake
          </button>
        </div>
        <Input maxLength={15} pattern="\d+(\.\d+)?" placeholder={'0'} className={'swap-input'} />
      </div>
      <button
        disabled={userGoFxAmount == 0.0}
        css={tw`w-full bg-grey-4 dark:bg-black-1 border-0
           rounded-full py-2 px-2 text-lg font-semibold text-grey-2`}
      >
        {userGoFxAmount > 0.0 ? 'Stake' : 'Insufficient GOFX'}
      </button>

      <div
        css={tw`mt-auto w-max px-4 flex flex-row font-semibold rounded-t-lg items-center  gap-4 min-h-[91px]`}
        style={{
          background: `linear-gradient(89.96deg, #36BB7C 0.04%, #194B5E 99.97%)`
        }}
      >
        <div css={tw` flex flex-col`}>
          <p css={tw`mb-0 text-base `}>{stakedGoFX > 0.0 ? 'Unstake amount' : 'Approx. Daily Rewards'}</p>
          <p css={tw`mb-0 text-base text-white`}>
            {stakedGoFX > 0.0 ? `${stakedGoFX.toFixed(2)} GOFX` : `${approxRewardAmount.toFixed(2)} USDC`} GOFX
          </p>
        </div>
        <span
          css={tw`h-3/4 rounded-lg`}
          style={{
            border: `1.5px solid rgba(248, 255, 253, 0.2)`
          }}
        />
        <div css={tw`flex flex-col `}>
          <p css={tw`mb-0`}>
            Cooldown period <img src={'/img/assets/info-icon.svg'} alt={'tooltip'} />
          </p>
          <p css={tw`mb-0`}>7 days</p>
        </div>
      </div>
    </>
  )
}
const ReferAndEarn: FC = () => {
  const copyRef = useRef<HTMLParagraphElement>(null)
  const referLink = 'app.goosefx.io/0x7r2ere1'
  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(referLink)
    if (!copyRef.current) {
      return
    }
    copyRef.current.innerText = 'Copied!'
    setTimeout(() => {
      if (!copyRef.current) {
        return
      }
      copyRef.current.innerText = 'Copy'
    }, 5000)
  }, [referLink, copyRef])
  const handleQuestions = useCallback(() => {
    console.log('DO SOMETHING HERE')
  }, [])
  return (
    <div css={tw`flex flex-col gap-4 font-semibold`}>
      <div
        onClick={copyToClipboard}
        css={tw`border-[1.5px] border-[#636363] border-dashed cursor-pointer  
  flex flex-row  justify-between px-4 py-2 items-center w-full rounded-[10px] mt-6 relative`}
      >
        <p css={tw`text-sm  dark:text-[#636363] text-black-4 mb-0 `}>{referLink}</p>
        <p css={tw`mb-0 transition-all right-2`} ref={copyRef}>
          Copy
        </p>
      </div>

      <p css={tw`mb-0 text-sm text-[#636363] font-semibold `}>
        Currently available just for perps,
        <span
          onClick={handleQuestions}
          css={tw`ml-1 underline text-sm text-[#EEE] cursor-pointer font-semibold 
      `}
        >
          Still have questions?
        </span>
      </p>
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
  const panels = useMemo(
    () => [
      {
        title: 'How much would you like to stake?',
        subtitle: 'Earn rewards by staking your GOFX and receiving USDC daily',
        icon: `/img/assets/rewards-program${mode == 'dark' ? '-dark' : ''}.svg`,
        children: <EarnRewards />
      },
      {
        title: 'Refer and get 20% of all the fees!',
        subtitle: 'Earn the 20% of taker fees form each of your referrals',
        icon: `/img/assets/rewards-refer${mode == 'dark' ? '-dark' : ''}.svg`,
        children: <ReferAndEarn />
      }
    ],
    [mode]
  )
  const panel = useMemo(() => {
    if (panelIndex < 0 || panelIndex > panels.length - 1) {
      return { title: '', subtitle: '', icon: '' }
    }
    return panels[panelIndex]
  }, [panels, panelIndex])
  return (
    <div css={tw`flex flex-col md:px-6 px-11 pt-3 h-full items-center font-semibold bg-grey-5 dark:bg-black-2`}>
      {!breakpoint.isMobile && children}
      <div css={tw`flex flex-col gap-4 pt-6 h-full items-center`}>
        <RewardInfo {...panel} />
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
  const onChangePanel = (el: BaseSyntheticEvent) => {
    const index = parseInt(el.currentTarget.dataset.index)
    setPanelIndex(index)
    handleSlide(index)
    // change panel data
  }
  return (
    <div css={tw`flex flex-row justify-center w-full items-center relative text-lg z-[0]`}>
      <div
        ref={sliderRef}
        css={tw` w-full bg-[#5855ff]  h-[44px]  rounded-[36px] z-[-1] absolute transition-all`}
      />
      <button
        css={tw`sm:m-auto min-w-max  cursor-pointer w-[120px] text-center border-none border-0 
  font-semibold text-base h-[44px] rounded-[36px] duration-700 bg-transparent`}
        ref={(el) => {
          buttonRefs.current[0] = el
          if (panelIndex == 0) {
            handleSlide(0)
          }
        }}
        data-index={0}
        onClick={onChangePanel}
      >
        Earn
      </button>
      <button
        css={tw`sm:m-auto min-w-max  cursor-pointer w-[120px] text-center border-none border-0 
  font-semibold text-base h-[44px] rounded-[36px] duration-700 bg-transparent`}
        ref={(el) => {
          buttonRefs.current[1] = el
          if (panelIndex == 1) {
            handleSlide(1)
          }
        }}
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
  const usdc = 1.0
  const gofx = 1554.0
  const claimReward = 0.0
  return (
    <div css={tw`flex flex-col gap-4 items-center h-full`}>
      <div tw={'flex flex-col items-center'}>
        <p tw={'text-[20px] font-semibold text-[#EEE] mb-0'}>Rewards</p>
        <p tw={'text-[40px] font-semibold text-[#FFF] mb-0'}>{apr}% APY</p>
      </div>
      <div css={tw`flex flex-col opacity-[${usdc > 0.0 ? '1' : '0.65'}] text-lg gap-4 mt-12`}>
        <span tw={'text-[80px] leading-[40px] text-[#EEE]'}>{usdc.toFixed(2)}</span>
        <p tw={'mb-0'}>USDC Total Earned</p>
      </div>
      <p
        css={tw`mb-0 mt-[15px] text-lg font-semibold opacity-[${gofx > 0.0 ? '1' : '0.6'}]
         leading-[22px] text-[#EEE]`}
      >
        Total Staked: {gofx} GOFX
      </p>
      <button
        css={tw`px-4 mt-[32px] max-w-[320px] items-center h-[50px]  bg-white text-[#3C3C3C] border-0
       font-semibold text-[18px] leading-[22px] opacity-[${claimReward > 0.0 ? '1' : '0.5'}] rounded-[50px]`}
        disabled={claimReward <= 0.0}
      >
        {claimReward > 0.0 ? `Claim ${claimReward.toFixed(2)} USDC` : 'No USDC Claimable'}
      </button>
      <p css={tw`mt-auto text-white text-[13px] font-semibold leading-[16px] text-center`}>
        During cooldown no rewards will be earned
      </p>
    </div>
  )
}
interface ReferFriendProps {
  address: string
}
const ReferFriend: FC<ReferFriendProps> = ({ address }) => {
  const shortAddress = useMemo(() => address.substring(2, 4), [address])
  const copyAddress = useCallback(() => navigator.clipboard.writeText(address), [address])
  return (
    <div
      onClick={copyAddress}
      css={tw`cursor-pointer flex w-16 h-16 p-4 bg-white
   rounded-full text-black-1 items-center justify-center`}
    >
      <span css={tw`text-lg font-semibold text-black-4`}>{shortAddress}</span>
    </div>
  )
}
const ReferAndEarnRedirect: FC = () => {
  console.log('BLAH BLAG')
  const totalFriends = 5
  const totalEarned = 22.22
  const tokenEarned = 'USDC'
  const totalInProgress = 0.0
  return (
    <div css={tw`flex flex-col h-full pt-4 w-full items-center`}>
      <div css={tw`flex flex-row justify-around items-center px-8`}>
        <p css={tw`mb-0 text-lg font-semibold`}>Total Referred</p>
        <p css={tw`mb-0 text-lg font-semibold`}>{totalFriends} Friends</p>
      </div>
      <div css={tw`flex flex-row justify-center gap-4 items-center mt-8 flex-wrap`}>
        <ReferFriend address={'0x1234567890'} />
        <ReferFriend address={'0x1234567890'} />
        <ReferFriend address={'0x1234567890'} />
        <ReferFriend address={'0x1234567890'} />
      </div>
      <div css={tw`flex flex-col justify-center items-center`}>
        <p css={tw`text-6xl mb-0 font-semibold`}>{totalEarned.toFixed(2)}</p>
        <p css={tw`text-sm mb-0 font-semibold`}>{tokenEarned} Total Earned</p>
        <p css={tw`mb-0 text-sm font-semibold`}>
          Bonus in progress: {totalInProgress.toFixed(2)} {tokenEarned}
        </p>
      </div>
      <button
        css={tw`max-w-[320px] rounded-[100px] bg-white py-3 px-8 text-black-4 font-semibold border-0  mt-11`}
      >
        {totalInProgress > 0.0 ? `Claim ${totalInProgress.toFixed(2)} ${tokenEarned}` : 'No USDC Claimable'}
      </button>
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
