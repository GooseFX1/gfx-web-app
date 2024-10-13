import { useGamma } from '@/context'
import { FC, ReactElement } from 'react'
import { Container } from 'gfx-component-lib'
import DepositWithdrawLabel from './DepositWithdrawLabel'
import { numberFormatter } from '@/utils'

export const ReviewConfirm: FC = (): ReactElement => {
  const { selectedCard } = useGamma()
  return (
    <>
      <DepositWithdrawLabel text="2. Review and Confirm" />
      <Container colorScheme={'default'} className={'mx-2.5 my-3 p-2.5 w-auto rounded-[4px]'}>
        <div className="flex justify-between mb-2">
          <span
            className="!font-regular font-semibold underline
                        dark:text-grey-2 text-grey-1 decoration-dotted"
          >
            Est. 24H Fees
          </span>
          <span className="!font-regular font-semibold dark:text-grey-8 text-black-4">
            {numberFormatter(selectedCard?.volume ?? 0.00)}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span
            className="!font-regular font-semibold dark:text-grey-2 
                        text-grey-1 underline decoration-dotted"
          >
            Pool Fee Rate
          </span>
          <span className="!font-regular font-semibold dark:text-grey-8 text-black-4">
            {numberFormatter(selectedCard?.fees ?? 0.00)}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span
            className="!font-regular font-semibold 
                        dark:text-grey-2 text-grey-1 underline decoration-dotted"
          >
            Total Deposit
          </span>
          <span className="!font-regular font-semibold dark:text-grey-8 text-black-4">
            {numberFormatter(selectedCard?.fees ?? 0.00)}
          </span>
        </div>
      </Container>
    </>
  )
}
