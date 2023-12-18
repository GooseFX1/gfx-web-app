import React, { FC, useCallback } from 'react'
import useRewards from '../../context/rewardsContext'
import Modal from '../common/Modal'
import tw from 'twin.macro'
import 'styled-components/macro'
import Button from '../twComponents/Button'
import { numberFormatter } from '../../utils'
import CloseIcon from '../../assets/close-lite.svg?react'
import { useDarkMode } from '../../context'
interface UnstakeConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  setStakeLoading: (loading: boolean) => void
}

const UnstakeConfirmationModal: FC<UnstakeConfirmationModalProps> = ({
  isOpen,
  onClose,
  amount = 0.0,
  setStakeLoading
}) => {
  const { unstake, totalStaked } = useRewards()
  const handleStakeConfirmation = useCallback(() => {
    setStakeLoading(true)
    unstake(amount).finally(() => setStakeLoading(false))
    onClose()
  }, [amount])
  const { mode } = useDarkMode()
  return (
    <Modal isOpen={isOpen} onClose={onClose} zIndex={300}>
      <div css={[tw`sm:absolute bottom-0 left-0 sm:animate-slideInBottom`]}>
        <div
          css={[
            tw`min-md:p-3.75 p-2.5 flex flex-col w-screen min-md:max-w-[561px] h-[272px] min-sm:h-[288px]
           rounded-t-[10px] min-md:rounded-[10px] bg-white dark:bg-black-2 relative gap-2.5 min-md:gap-4.75
           font-semibold
           `
          ]}
        >
          <div css={[tw`flex justify-between items-start`]}>
            <h2
              css={[
                tw`mb-0 text-black-4 dark:text-grey-8 text-[18px] min-md:text-[20px]
             font-semibold text-center w-[321px] min-md:w-full mx-auto leading-none w-[60%]`
              ]}
            >
              Are you sure you want to unstake?
            </h2>
            <CloseIcon
              onClick={onClose}
              style={{
                stroke: mode == 'dark' ? '#b5b5b5' : '#3c3c3c',
                cursor: 'pointer'
              }}
              aria-label={'close-button'}
            />
            {/*<img*/}
            {/*  css={[tw` w-[18px] h-[18px] cursor-pointer`]}*/}
            {/*  onClick={onClose}*/}
            {/*  src={`${window.origin}/img/assets/close-lite.svg`}*/}
            {/*  alt="copy_address"*/}
            {/*/>*/}
          </div>
          <div css={[tw`flex flex-col gap-2.5 min-md:gap-1.25`]}>
            <p
              css={[
                tw`mb-0 text-grey-1 dark:text-grey-2 text-[13px] min-md:text-[15px] text-center w-full
          font-semibold min-md:w-[80%] mx-auto
          `
              ]}
            >
              Once the cooldown starts, the process cannot be un-done, and you will need to re-stake your GOFX
            </p>
            <div
              css={[
                tw`flex items-center justify-between text-[15px] font-semibold dark:text-grey-2 text-black-4
              font-semibold`
              ]}
            >
              <p css={[tw`mb-0`]}>Unstake Amount</p>
              <p css={[tw`mb-0 dark:text-grey-8`]}>{numberFormatter(amount, 2)} GOFX</p>
            </div>
          </div>

          <div css={[tw`flex flex-col`]}>
            <Button
              cssClasses={[
                tw`h-10 w-full rounded-[100px] bg-red-2 text-white text-[15px] leading-[22px] text-center
          font-semibold border-0`
              ]}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              cssClasses={[
                tw`bg-transparent hover:bg-transparent focus:bg-transparent focus:bg-transparent underline
          dark:text-grey-5 text-blue-1 text-[15px] h-10 leading-[22px] text-center font-semibold border-0
        `
              ]}
              onClick={handleStakeConfirmation}
              disabled={!(totalStaked >= amount)}
            >
              Yes, Continue With Cooldown
            </Button>
          </div>
          <p
            css={[
              tw`text-[13px] leading-[16px] text-center w-[50%] mx-auto min-md:w-full text-grey-1
            dark:text-grey-2 font-semibold`
            ]}
          >
            By selecting “Yes” you agree to&nbsp;
            <a
              href={'https://docs.goosefx.io/'}
              target={'_blank'}
              rel="noopener noreferrer"
              css={[tw`underline dark:text-white text-blue-1 font-semibold`]}
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
