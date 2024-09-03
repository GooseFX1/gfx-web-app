import { FC, ReactElement } from 'react'
import { ModeOfOperation } from './constants'
import RadioOptionGroup from '@/components/common/RadioOptionGroup'
import { useGamma } from '@/context'

const DepositWithdrawToggle: FC = (): ReactElement => {
  const { modeOfOperation, setModeOfOperation } = useGamma()
  return (
    <RadioOptionGroup
      defaultValue={'deposit'}
      value={modeOfOperation === ModeOfOperation?.DEPOSIT ? 'deposit' : 'withdraw'}
      className={`w-full mt-3 max-sm:mt-1 px-2.5`}
      optionClassName={`w-full text-h5`}
      options={[
        {
          value: 'deposit',
          label: 'Deposit',
          onClick: () => setModeOfOperation(ModeOfOperation?.DEPOSIT)
        },
        {
          value: 'withdraw',
          label: 'Withdraw',
          onClick: () => setModeOfOperation(ModeOfOperation?.WITHDRAW)
        }
      ]}
    />
  )
}
export default DepositWithdrawToggle
