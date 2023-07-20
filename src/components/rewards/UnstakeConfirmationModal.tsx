import React, { FC, useCallback, useMemo } from 'react'
import useRewards from '../../context/rewardsContext'
import { BN } from '@project-serum/anchor'
import Modal from '../common/Modal'
import tw from 'twin.macro'
import 'styled-components/macro'

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
      <div css={[tw`sm:absolute bottom-0 left-0`]}>
        <div
          css={tw`px-[33px] py-[20px] min-md:px-[54px] flex flex-col w-screen min-md:w-[628px] h-[338px] rounded-[22px]
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
              rel="noopener noreferrer"
              css={tw`underline dark:text-white text-blue-1`}
            >
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </Modal>
  )
}
export default UnstakeConfirmationModal
