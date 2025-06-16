import React, { useCallback, useState } from 'react'
import { useWallet } from '@/hooks/useWallet'
import useBoolean from '../../../../hooks/useBoolean'
import RewardsLeftPanelHeading from './RewardsHeading'
import RewardsInput from './RewardsInput'
import { Connect } from '../../../../layouts'
import { useConnectionConfig, useDarkMode, useRewardToggle } from '../../../../context'
import useRewards from '../../../../context/rewardsContext'
import RewardsUnstakeBottomBar from './UnstakeBottomBar'
import { numberFormatter } from '../../../../utils'
import UnstakeConfirmationModal from '../../UnstakeConfirmationModal'
import RewardsLeftLayout from '../../layout/RewardsLeftLayout'
// import TopLinks from '../TopLinks'
import { Button, cn, DialogCloseDefault, Icon, RadioGroup, RadioGroupItem } from 'gfx-component-lib'
import { useWalletBalance } from '@/context/walletBalanceContext'
import HowItWorksButton from '@/components/rewards/v2/HowItWorksButton'
import { NATIVE_MINT } from '@solana/spl-token-v2'
import { useNavigate } from 'react-router-dom'

const gofxMint = 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD'
export default function RewardsLeftSidePanel(): JSX.Element {
  const { rewardToggle } = useRewardToggle()
  const { balance } = useWalletBalance()
  const userHasGoFx = balance[gofxMint].logoURI != ''
  const { mode } = useDarkMode()
  const userGoFxBalance = balance[gofxMint].tokenAmount
  const [isStakeSelected, setIsStakeSelected] = useBoolean(true)
  const { connected, publicKey } = useWallet()
  const { connection } = useConnectionConfig()
  const { inputValue, setInputValue } = useRewards()
  const navigate = useNavigate()
  const { totalStaked, stakeMutation, unstakeableTickets, unstakeMutation } = useRewards()
  const [isUnstakeConfirmationModalOpen, setIsUnstakeConfirmationModalOpen] = useBoolean(false)
  const [proposedStakeAmount, setProposedStakeAmount] = useState<string>('')

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
  const handleMiniStake = () => {
    setIsStakeSelected.on()
    setProposedStakeAmount(userGoFxBalance.uiAmountString)
    setInputValue(userGoFxBalance.uiAmountString)
  }
  const disabledStakeButton =
    +proposedStakeAmount <= 0 ||
    isNaN(+proposedStakeAmount) ||
    (isStakeSelected && +proposedStakeAmount > userGoFxBalance.uiAmount) ||
    (!isStakeSelected && +proposedStakeAmount > totalStaked)
  const isStakeOrUnstaking = stakeMutation.isLoading || unstakeMutation.isLoading
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

        <div className={'flex flex-col lg:flex-row gap-4 w-full px-2 min-md:px-[11%] max-w-vw'}>
          <div
            className={`flex-col gap-4 flex p-2 border-1 border-solid rounded-[8px]
        border-border-lightmode-primary dark:border-border-darkmode-primary`}
          >
            <h3 className={`text-text-lightmode-primary dark:text-text-darkmode-primary`}>
              {userHasGoFx ? 'Want to earn more?' : 'Start earning'}
            </h3>
            {userHasGoFx ? (
              <p
                className={'text-b2 font-semibold text-text-lightmode-secondary dark:text-text-darkmode-secondary'}
              >
                You have{' '}
                <span className={'font-bold text-text-purple dark:text-text-darkmode-primary'}>
                  {numberFormatter(userGoFxBalance.uiAmount)} GOFX
                </span>{' '}
                available to stake.
              </p>
            ) : (
              <p
                className={'text-b2 font-semibold text-text-lightmode-secondary dark:text-text-darkmode-secondary'}
              >
                Buy $GOFX, stake it and start earning daily.
              </p>
            )}
            <div className={cn(`inline-flex w-full mt-auto gap-2.5`, connected && 'justify-between')}>
              {userHasGoFx && (
                <Button
                  className={'!w-[96px] !max-w-[96px] !min-w-[96px]'}
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
                onClick={() => {
                  navigate({
                    pathname: '/swap',
                    search: `?mintA=${NATIVE_MINT.toBase58()}&mintB=${gofxMint}`
                  }, { replace: true })
                  rewardToggle(false)
                }}
                className={`font-bold text-text-lightmode-primary dark:text-white min-w-[122px] box-border`}
              >
                <img src="/img/crypto/GOFX.svg" alt="gofx-tooken" className="h-[20px] w-[20px]" />
                Buy GOFX
              </Button>
            </div>
          </div>

          <div
            className={`flex-col gap-3 flex p-2 border-1 border-solid rounded-[8px]
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
                <Icon
                  src={`/img/assets/wallet-${mode}-${
                    userHasGoFx && userGoFxBalance.uiAmount > 0 ? 'enabled' : 'disabled'
                  }.svg`}
                />
                <span
                  className={cn(
                    `font-semibold text-b2 text-text-lightmode-tertiary
               dark:text-text-darkmode-tertiary`,
                    userHasGoFx &&
                      userGoFxBalance.uiAmount > 0 &&
                      'text-text-lightmode-primary dark:text-text-darkmode-primary'
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
                  containerStyle={`w-full h-[35px] rounded-[100px]`}
                  customButtonStyle={`w-full h-[35px] min-md:h-[35px]`}
                />
              ) : (
                <Button
                  className={'w-[153px]'}
                  colorScheme={'blue'}
                  onClick={handleStakeUnstake}
                  disabled={disabledStakeButton || isStakeOrUnstaking}
                  isLoading={isStakeOrUnstaking}
                >
                  {isStakeSelected ? `Stake` : `Unstake`}
                </Button>
              )}
              {connected && <RewardsUnstakeBottomBar />}
            </div>
          </div>
        </div>
        <p
          className={`text-b3 font-semibold text-text-lightmode-tertiary dark:text-text-darkmode-tertiary 
        px-2 min-md:px-[11%]`}
        >
          *Our rewards program shares revenue from protocol fees. While staked, your GOFX is locked for 7 days and
          can't be sold or transferred. To unstake your GOFX, wait for the cooldown period to complete.
        </p>
      </div>
    </RewardsLeftLayout>
  )
}
