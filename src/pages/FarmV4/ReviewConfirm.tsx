import { useGamma } from '@/context'
import { FC, ReactElement } from 'react'
import { Container, Icon } from 'gfx-component-lib'
import DepositWithdrawLabel from './DepositWithdrawLabel'

export const ReviewConfirm: FC = (): ReactElement => {
  const { selectedCard } = useGamma()
  return (
    <>
      <DepositWithdrawLabel text="2. Review and Confirm" />
      <Container colorScheme={'default'} className={'mx-2.5 my-3 p-2.5 w-auto rounded-[4px]'}>
        <div className="flex justify-between mb-2">
          <span
            className="!font-regular font-semibold dark:text-grey-2 
                        text-grey-1 underline decoration-dotted"
          >
            Deposit Ratio
          </span>
          <div className="!font-regular font-semibold dark:text-grey-8 text-black-4 flex flex-row">
            <Icon
              src={selectedCard?.mintA.logoURI ?? `/img/crypto/fallback.svg`}
              size="sm"
              className={`mr-1 border border-solid rounded-circle 
                dark:border-border-darkmode-secondary border-border-lightmode-secondary`
              }
            />
            <span>50% /&nbsp;</span>
            <Icon
              src={selectedCard?.mintB.logoURI ?? `/img/crypto/fallback.svg`}
              size="sm"
              className={`mr-1 border border-solid rounded-circle 
                dark:border-border-darkmode-secondary border-border-lightmode-secondary`
              }
            />
            <span>&nbsp;50%</span>
          </div>
        </div>
        <div className="flex justify-between mb-2">
          <span
            className="!font-regular font-semibold underline
                        dark:text-grey-2 text-grey-1 decoration-dotted"
          >
            Est. 24H Fees
          </span>
          <span className="!font-regular font-semibold dark:text-grey-8 text-black-4">{selectedCard?.volume}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span
            className="!font-regular font-semibold dark:text-grey-2 
                        text-grey-1 underline decoration-dotted"
          >
            Pool Fee Rate
          </span>
          <span className="!font-regular font-semibold dark:text-grey-8 text-black-4">{selectedCard?.fees}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span
            className="!font-regular font-semibold 
                        dark:text-grey-2 text-grey-1 underline decoration-dotted"
          >
            Total Deposit
          </span>
          <span className="!font-regular font-semibold dark:text-grey-8 text-black-4">{selectedCard?.fees}</span>
        </div>
      </Container>
    </>
  )
}
