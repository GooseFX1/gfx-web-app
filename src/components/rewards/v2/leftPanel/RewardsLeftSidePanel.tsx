import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import useBoolean from '../../../../hooks/useBoolean'
import RewardsLeftPanelHeading from './RewardsHeading'
import RewardsWalletBalanceAndBuyGofx from './BalanceAndBuy'
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
import { Button, RadioGroup, RadioGroupItem } from 'gfx-component-lib'
import { useWalletBalance } from '@/context/walletBalanceContext'

export default function RewardsLeftSidePanel({ apy }: { apy: number }): JSX.Element {
  const { balance } = useWalletBalance()
  const userGoFxBalance = balance['GOFX'].tokenAmount
  console.log(balance)
  const [isStakeSelected, setIsStakeSelected] = useBoolean(true)
  const { connected, publicKey } = useWallet()
  const { connection } = useConnectionConfig()
  const [approxRewardAmount, setApproxRewardAmount] = useState<number>(0)
  const [calculating, setCalculating] = useBoolean(false)
  const { totalStakedInUSD, gofxValue, totalStaked, stake, unstakeableTickets } = useRewards()
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
      <div className={`flex w-full flex-col max-w-[580px] items-center mb-0`}>
        <RewardsLeftPanelHeading />

        <div className={`flex flex-1 w-full flex-row flex-wrap mt-3 min-md:mt-2.5 gap-3 min-md:gap-7.5`}>
          <RewardsWalletBalanceAndBuyGofx userGoFxBalance={userGoFxBalance} />

          <RadioGroup defaultValue={'stake'} className={'flex-grow flex-shrink gap-1.25'}>
            <RadioGroupItem value={'stake'} variant={'primary'} size={'xl'} onClick={setIsStakeSelected.on}>
              Stake
            </RadioGroupItem>
            <RadioGroupItem
              value={'unstake'}
              variant={'primary'}
              size={'xl'}
              onClick={setIsStakeSelected.off}
              className={'flex flex-row gap-1 items-center justify-center'}
            >
              Unstake
              {unstakeableTickets.length > 0 && <span className={`rounded-full w-2 h-2 bg-background-red`} />}
            </RadioGroupItem>
          </RadioGroup>
          <RewardsInput
            onInputChange={setProposedStakeAmount}
            userGoFxBalance={userGoFxBalance}
            isStakeSelected={isStakeSelected}
          />
        </div>
        <div className={'mt-3 min-md:mt-3.75 w-full'}>
          {!connected ? (
            <Connect
              containerStyle={`w-full min-md:w-full h-[40px] rounded-[100px]`}
              customButtonStyle={`w-full min-md:w-full max-w-full h-[40px] min-md:h-[40px]`}
            />
          ) : (
            <Button
              className={'w-full'}
              colorScheme={'blue'}
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
        <div className={`mt-3 min-md:mt-7.5 w-full`}>
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
