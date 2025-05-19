import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import useBoolean from '../../../../hooks/useBoolean'
import RewardsLeftPanelHeading from './RewardsHeading'
import RewardsInput from './RewardsInput'
import { Connect } from '../../../../layouts'
import { useConnectionConfig, useDarkMode } from '../../../../context'
import useRewards from '../../../../context/rewardsContext'
import RewardsUnstakeBottomBar from './UnstakeBottomBar'
import { numberFormatter } from '../../../../utils'
import UnstakeConfirmationModal from '../../UnstakeConfirmationModal'
import RewardsLeftLayout from '../../layout/RewardsLeftLayout'
// import TopLinks from '../TopLinks'
import { Button, cn, DialogCloseDefault, Icon, RadioGroup, RadioGroupItem } from 'gfx-component-lib'
import { useWalletBalance } from '@/context/walletBalanceContext'
import HowItWorksButton from '@/components/rewards/v2/HowItWorksButton'

export default function RewardsLeftSidePanel({ apy }: { apy: number }): JSX.Element {
  const { balance } = useWalletBalance()
  const userHasGoFx = balance['GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD'].logoURI != ''
  const {mode} = useDarkMode()
  const userGoFxBalance = balance['GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD'].tokenAmount
  const [isStakeSelected, setIsStakeSelected] = useBoolean(true)
  const { connected, publicKey } = useWallet()
  const { connection } = useConnectionConfig()
  const [approxRewardAmount, setApproxRewardAmount] = useState<number>(0)
  const [calculating, setCalculating] = useBoolean(false)
  console.log(approxRewardAmount,calculating)
  const [inputValue, setInputValue] = useState<string>()
  const { totalStakedInUSD, gofxValue, totalStaked, stakeMutation, unstakeableTickets, unstakeMutation } =
    useRewards()
  const [isUnstakeConfirmationModalOpen, setIsUnstakeConfirmationModalOpen] = useBoolean(false)
  const [proposedStakeAmount, setProposedStakeAmount] = useState<string>('')

  const adjustedStakeAmountInUSD = useMemo(() => {
    const value = parseFloat(proposedStakeAmount)
    if (isNaN(value)) {
      return 0.0
    }
    return value * gofxValue
  }, [proposedStakeAmount, gofxValue])
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

    if (!proposedStakeAmount || +proposedStakeAmount <= 0) {
      console.warn('INPUT VALUE IS NOT VALID', proposedStakeAmount)
      return
    }

    if (isStakeSelected) {
      try {
        await stakeMutation.mutate(+proposedStakeAmount)
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
  }, [stakeMutation, proposedStakeAmount, publicKey, isStakeSelected])
  const handleMiniStake = () =>{
    setIsStakeSelected.on()
    setProposedStakeAmount(userGoFxBalance.uiAmountString)
    setInputValue(userGoFxBalance.uiAmountString)
  }
  const disabledStakeButton =
    +proposedStakeAmount <= 0 ||
    isNaN(+proposedStakeAmount) ||
    (isStakeSelected && +proposedStakeAmount > userGoFxBalance.uiAmount) ||
    (!isStakeSelected && +proposedStakeAmount > totalStaked)
  const isStakeOrUnstaking = stakeMutation.isLoading || unstakeMutation.isLoading;
  return (
    <RewardsLeftLayout>
      <UnstakeConfirmationModal
        amount={+proposedStakeAmount}
        isOpen={isUnstakeConfirmationModalOpen}
        onClose={setIsUnstakeConfirmationModalOpen.off}
      />
      <div className={`flex w-full flex-col items-center mb-0 gap-4 min-md:gap-8 pb-2.5 min-md:pb-0`}>
        <div
          className={`inline-flex justify-between w-full border-b-1 border-solid min-md:border-none 
        border-b-border-lightmode-secondary dark:border-b-border-darkmode-secondary
         px-2 py-2.5 md:px-[11%] md:pt-7 md:pb-0`}
        >
          <RewardsLeftPanelHeading />
          <div className={'inline-flex gap-2'}>
            <HowItWorksButton />
            <DialogCloseDefault className={'min-md:hidden relative right-0 left-0 top-0 bottom-0'} />
          </div>
        </div>

        <div className={'inline-flex gap-4 w-full px-2 min-md:px-[11%] max-w-vw'}>
          <div
            className={`flex-col gap-4 hidden xl:flex p-4 border-1 border-solid rounded-[8px]
        border-border-lightmode-primary dark:border-border-darkmode-primary`}
          >
            <div className={'flex flex-col gap-2 w-[250px]'}>
              <h3 className={`text-text-lightmode-primary dark:text-text-darkmode-primary`}>
                {userHasGoFx ? 'Want to earn more?' : 'Start earning'}
              </h3>
              {userHasGoFx ? (
                <p
                  className={
                    'text-b2 font-semibold text-text-lightmode-secondary dark:text-text-darkmode-secondary'
                  }
                >
                  You have{' '}
                  <span className={'font-bold text-text-purple dark:text-text-darkmode-primary'}>
                    {numberFormatter(userGoFxBalance.uiAmount)} GOFX
                  </span>{' '}
                  available to stake.
                </p>
              ) : (
                <p
                  className={
                    'text-b2 font-semibold text-text-lightmode-secondary dark:text-text-darkmode-secondary'
                  }
                >
                  Buy $GOFX to begin staking
                </p>
              )}
            </div>
            <div className={'inline-flex justify-between w-full'}>
              {userHasGoFx && (
                <Button
                  className={'w-[96px]'}
                  colorScheme={'blue'}
                  size={'default'}
                  onClick={handleMiniStake}
                  disabled={isStakeOrUnstaking}
                  isLoading={isStakeOrUnstaking}
                >
                  Stake Now
                </Button>
              )}
              <Button
                colorScheme={'primaryGradient'}
                variant={'outline'}
                size={'default'}
                onClick={() =>
                  window.open('https://jup.ag/swap/USDC-GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD', '_blank')
                }
                className={`ml-auto font-bold
         text-white min-w-[122px] min-md:py-2.5 py-1.875 px-2.5 min-md:px-1.5 box-border !pl-0`}
              >
                <img src="/img/crypto/GOFX.svg" alt="gofx-tooken" className="h-[26px]" />
                Buy GOFX
              </Button>
            </div>
          </div>

          <div
            className={`flex-col gap-3 flex p-4 border-1 border-solid rounded-[8px]
        border-border-lightmode-primary dark:border-border-darkmode-primary w-full`}
          >
            <div className={'inline-flex w-full justify-between'}>
              <RadioGroup defaultValue={'stake'} className={'flex-shrink gap-1.25'}>
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
              <div className={'inline-flex items-center gap-1.25'}>
                <Icon src={`/img/assets/wallet-${mode}-${userHasGoFx ? 'enabled' : 'disabled'}.svg`} />
                <span
                  className={cn(
                    `font-semibold text-b2 text-text-lightmode-secondary
               dark:text-text-darkmode-secondary`,
                    userGoFxBalance && 'text-text-lightmode-primary dark:text-text-darkmode-primary'
                  )}
                >
                  {numberFormatter(userGoFxBalance.uiAmount)} GOFX
                </span>
              </div>
            </div>

            <RewardsInput
              onInputChange={setProposedStakeAmount}
              userGoFxBalance={userGoFxBalance}
              isStakeSelected={isStakeSelected}
              setInputValue={setInputValue}
              inputValue={inputValue}
            />

            <div className={'inline-flex w-full justify-between items-center gap-4'}>
              {!connected ? (
                <Connect
                  containerStyle={`w-full min-md:w-full h-[40px] rounded-[100px]`}
                  customButtonStyle={`w-full min-md:w-full max-w-full h-[40px] min-md:h-[40px]`}
                />
              ) : (
                <Button
                  className={'w-[153px]'}
                  colorScheme={'blue'}
                  onClick={handleStakeUnstake}
                  disabled={disabledStakeButton || isStakeOrUnstaking}
                  isLoading={isStakeOrUnstaking}
                >
                  {isStakeSelected
                      ? `Stake`
                      : `Unstake`
                  }
                </Button>
              )}
              {connected && <RewardsUnstakeBottomBar />}
            </div>
          </div>
        </div>
        <p className={`text-b3 font-semibold text-text-lightmode-tertiary dark:text-text-darkmode-tertiary 
        px-2 min-md:px-[11%]`}>
          *Our revenue-sharing program pays you from fees earned with GAMMA and SSL. While staked, your assets stay
          locked and can’t be sold or transferred. To claim your assets, just wait for the cooldown period to be
          completed.
        </p>
      </div>
    </RewardsLeftLayout>
  )
}
