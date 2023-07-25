import React, { FC, ReactNode, useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { useRewardToggle, useDarkMode } from '../../context'
import tw from 'twin.macro'
import 'styled-components/macro'
import useBreakPoint from '../../hooks/useBreakPoint'
import EarnRewards, { RewardsRightPanel } from './Rewards'
import ReferAndEarn, { ReferFriendSegment, ReferRightPanel } from './Refer'

const FLEX_COL_CONTAINER = styled.div`
  ${tw`flex flex-col py-2.5 min-md:pt-5 px-7.5 min-md:px-[125px] h-[275px] min-md:h-full items-center rounded-t-bigger
  `}
`

const CLOSE_ICON = styled.button`
  ${tw`absolute top-[15px] right-[9px] w-[30px] h-[30px] bg-transparent border-0 border-none cursor-pointer
    flex items-center justify-center
  `}
`

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
      <div id={'title'} css={tw`min-md:h-[150px] flex flex-col w-full gap-3.75 min-md:gap-0 min-md:flex-row`}>
        {(breakpoint.isMobile || breakpoint.isTablet) && !isEarnSelected && <ReferFriendSegment />}
        {!breakpoint.isMobile && <div css={tw`flex`}>{icon}</div>}
        <div css={[tw`flex flex-col gap-3.75 h-full min-md:ml-5 min-md:justify-center`, !subtitle && tw`gap-0`]}>
          <p
            css={[
              tw`text-average leading-normal min-md:text-lg min-md:leading-5.5 text-center min-md:text-left
              min-md:text-lg
              dark:text-white text-black-4 mb-0  font-semibold leading-normal`,
              !subtitle && tw`text-left`
            ]}
          >
            {title}
          </p>
          <p
            css={tw`min-md:text-lg text-regular text-grey-1 dark:text-grey-2 mb-0 text-center
              leading-normal
            min-md:text-left`}
          >
            {subtitle}
          </p>
        </div>
      </div>
      <div css={[tw`h-full min-md:max-w-[580px]`]}>{children}</div>
    </>
  )
}

interface RewardSegmentProps {
  panelIndex: number
  children: React.ReactNode
}
export const EarnLeftSidePanel: FC<RewardSegmentProps> = ({ panelIndex, children }) => {
  const { mode } = useDarkMode()
  const breakpoint = useBreakPoint()
  // const { rive: rewardsRive, RiveComponent: RewardsComponent } = useRive({
  //   src: RIVE_ANIMATION.rewards.src,
  //   autoplay: true,
  //   stateMachines: Object.keys(RIVE_ANIMATION.rewards.stateMachines)
  // })
  // const { rive: referralRive, RiveComponent: ReferralComponent } = useRive({
  //   src: RIVE_ANIMATION.referrals.src,
  //   autoplay: true,
  //   stateMachines: Object.keys(RIVE_ANIMATION.referrals.stateMachines)
  // })
  // const animationColorRewards = useStateMachineInput(
  //   rewardsRive,
  //   RIVE_ANIMATION.rewards.stateMachines.Rewards.stateMachineName,
  //   RIVE_ANIMATION.rewards.stateMachines.Rewards.inputs.theme
  // )
  // const animationColorReferral = useStateMachineInput(
  //   referralRive,
  //   RIVE_ANIMATION.referrals.stateMachines.Referrals.stateMachineName,
  //   RIVE_ANIMATION.referrals.stateMachines.Referrals.inputs.theme
  // )
  // useEffect(() => {
  //   if (animationColorRewards) {
  //     animationColorRewards.value = mode === 'dark'
  //   }
  //   if (animationColorReferral) {
  //     animationColorReferral.value = mode === 'dark'
  //   }
  // }, [mode, animationColorRewards, animationColorReferral])
  const panels = useMemo(
    () => [
      {
        title: 'Earn USDC daily by staking your GOFX',
        subtitle: 'How much would you like to stake?',
        icon: <img src={`/img/assets/rewards-${mode}.svg`} />,
        children: <EarnRewards />
      },
      {
        title: 'Refer friends and earn 20% of their taker fees!',
        subtitle: '',
        icon: <img src={`/img/assets/referral-${mode}.svg`} />,
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
    <div
      css={[
        tw`flex flex-col px-[30px] min-md:px-[145px] py-3.75 min-md:pt-5 h-full items-center 
        font-semibold bg-white dark:bg-black-2 min-h-[461px] min-md:min-h-0`,
        panelIndex == 1 ? tw`min-md:pb-[41px]` : tw`min-md:pb-0`
      ]}
    >
      {!breakpoint.isMobile && children}
      <div css={tw`flex flex-col max-w-full gap-3.75 min-md:gap-0 h-full items-center`}>
        <RewardInfo isEarnSelected={panelIndex == 0} {...panel} />
      </div>
    </div>
  )
}

export const EarnRightSidePanel: FC<RewardSegmentProps> = ({ panelIndex, children }) => {
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
        return <ReferRightPanel />
        break
      case 0:
      default:
        return <RewardsRightPanel />
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
