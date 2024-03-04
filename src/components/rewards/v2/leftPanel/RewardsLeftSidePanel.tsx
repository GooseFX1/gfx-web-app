import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import tw from 'twin.macro'
import useBoolean from '../../../../hooks/useBoolean'
import Button from '../../../twComponents/Button'
import RewardsLeftPanelHeading from './RewardsHeading'
import RewardsWalletBalanceAndBuyGofx from './BalanceAndBuy'
import AnimatedButtonGroup from '../../../twComponents/AnimatedButtonGroup'
import RewardsInput from './RewardsInput'
import { Connect } from '../../../../layouts'
import RewardsStakeBottomBar from './BottomBar'
import { useConnectionConfig } from '../../../../context'
import useRewards from '../../../../context/rewardsContext'
import RewardsUnstakeBottomBar from './UnstakeBottomBar'
import { numberFormatter } from '../../../../utils'
import UnstakeConfirmationModal from '../../UnstakeConfirmationModal'
import { Loader } from '../../../Loader'
import CombinedRewardsTopLinks from '../CombinedRewardsTopLinks'
import HowItWorksButton from '../HowItWorksButton'
import RewardsLeftLayout from '../../layout/RewardsLeftLayout'
import TopLinks from '../TopLinks'
import { useWalletBalance } from '@/context/walletBalanceContext'

export default function RewardsLeftSidePanel({ apy }: { apy: number }): JSX.Element {
  const { balance } = useWalletBalance()
  const userGoFxBalance = balance['GOFX'].tokenAmount

  const [isStakeSelected, setIsStakeSelected] = useBoolean(true)
  const { connected, publicKey } = useWallet()
  const { connection } = useConnectionConfig()
  const [approxRewardAmount, setApproxRewardAmount] = useState<number>(0)
  const [calculating, setCalculating] = useBoolean(false)
  const { totalStakedInUSD, gofxValue, totalStaked, stake } = useRewards()
  const [isUnstakeConfirmationModalOpen, setIsUnstakeConfirmationModalOpen] = useBoolean(false)
  const [isStakeLoading, setIsStakeLoading] = useBoolean(false)
  const [proposedStakeAmount, setProposedStakeAmount] = useState<number>(0)

  const adjustedStakeAmountInUSD = useMemo(() => proposedStakeAmount * gofxValue, [proposedStakeAmount, gofxValue])
  useEffect(() => {
    setCalculating.on()
    const val = ((Number(totalStakedInUSD) + adjustedStakeAmountInUSD) / 365) * (apy / 100)
    setApproxRewardAmount(val)
    const t = setTimeout(setCalculating.off, 1000)
    return () => clearTimeout(t)
  }, [totalStakedInUSD, apy, adjustedStakeAmountInUSD])

  const handleStakeUnstake = useCallback(async () => {
    if (!publicKey || !connection || !connected) {
      console.warn('WALLET NOT CONNECTED')
      return
    }

    if (!proposedStakeAmount || proposedStakeAmount <= 0) {
      console.warn('INPUT VALUE IS NOT VALID', proposedStakeAmount)
      return
    }

    setIsStakeLoading.on()
    if (isStakeSelected) {
      try {
        await stake(proposedStakeAmount)
        console.log(`Successful Stake: ${publicKey.toBase58()}
         - ${proposedStakeAmount}`)
      } catch (error) {
        console.error(error)
      } finally {
        //
      }
    } else {
      setIsUnstakeConfirmationModalOpen.on()
    }
    setIsStakeLoading.off()
  }, [stake, proposedStakeAmount, publicKey, isStakeSelected])
  const disabledStakeButton =
    proposedStakeAmount <= 0 ||
    (isStakeSelected && proposedStakeAmount > userGoFxBalance.uiAmount) ||
    (!isStakeSelected && proposedStakeAmount > totalStaked)

  return (
    <RewardsLeftLayout>
      <UnstakeConfirmationModal
        amount={proposedStakeAmount}
        isOpen={isUnstakeConfirmationModalOpen}
        onClose={setIsUnstakeConfirmationModalOpen.off}
        setStakeLoading={setIsStakeLoading.set}
      />
      <CombinedRewardsTopLinks>
        <TopLinks />
        <HowItWorksButton link={'https://docs.goosefx.io/tokenomics/stake-rewards-and-fee-share'} />
      </CombinedRewardsTopLinks>
      <div css={[tw`flex w-full flex-col max-w-[580px] items-center mb-0 gap-3 min-md:gap-2.5`]}>
        <RewardsLeftPanelHeading />
        <div css={[tw`flex w-full flex-col gap-3 min-md:gap-5 `]}>
          <div css={[tw`flex flex-1 w-full flex-row flex-wrap gap-3 min-md:gap-y-5`]}>
            <RewardsWalletBalanceAndBuyGofx userGoFxBalance={userGoFxBalance} />

            <AnimatedButtonGroup
              containerStyle={[
                tw`order-1 min-md:order-2 flex-1 flex flex-row gap-2 font-semibold
          text-tiny min-sm:flex-basis[calc(33% - 20px)]`
              ]}
              animatedButtonStyle={[tw`bg-blue-1 h-[40px]`]}
              buttonWrapperStyle={[
                tw`
                               w-full inline-flex flex-1
                               `
              ]}
              index={isStakeSelected ? 0 : 1}
            >
              <Button
                key={'stake'}
                cssClasses={[
                  tw`text-center w-full flex flex-1  min-md:min-w-[85px] h-[40px] py-2.75 px-3`,
                  isStakeSelected && tw` text-white `
                ]}
                onClick={setIsStakeSelected.on}
              >
                Stake
              </Button>
              <Button
                key={'unstake'}
                cssClasses={[
                  tw`text-center w-full flex flex-1   min-md:min-w-[85px] h-[40px] py-2.75 px-3`,
                  !isStakeSelected && tw`text-white`
                ]}
                onClick={setIsStakeSelected.off}
              >
                Unstake
              </Button>
            </AnimatedButtonGroup>
            <RewardsInput
              onInputChange={setProposedStakeAmount}
              userGoFxBalance={userGoFxBalance}
              isStakeSelected={isStakeSelected}
            />
          </div>
          {!connected ? (
            <Connect
              containerStyle={`w-full min-md:w-full h-[40px] rounded-[100px]`}
              customButtonStyle={`w-full min-md:w-full max-w-full h-[40px] min-md:h-[40px]`}
            />
          ) : (
            <Button
              cssClasses={[
                tw`h-10 bg-grey-5 dark:bg-black-1 text-grey-1`,
                !disabledStakeButton && tw`bg-blue-1 dark:bg-blue-1 text-white`
              ]}
              onClick={handleStakeUnstake}
              disabled={disabledStakeButton || isStakeLoading}
            >
              {isStakeLoading ? (
                <Loader zIndex={2} />
              ) : proposedStakeAmount > 0 ? (
                isStakeSelected ? (
                  `Stake ${numberFormatter(proposedStakeAmount)} GOFX`
                ) : (
                  `Unstake ${numberFormatter(proposedStakeAmount)} GOFX`
                )
              ) : (
                'Enter Amount'
              )}
            </Button>
          )}
        </div>
        <div css={[tw` w-full`]}>
          {isStakeSelected ? (
            <RewardsStakeBottomBar calculating={calculating || apy == 0} approxRewardAmount={approxRewardAmount} />
          ) : (
            <RewardsUnstakeBottomBar />
          )}
        </div>
      </div>
    </RewardsLeftLayout>
  )
}
