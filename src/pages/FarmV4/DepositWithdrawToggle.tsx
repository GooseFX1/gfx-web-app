import { FC, ReactElement, Dispatch, SetStateAction } from 'react'
import { ModeOfOperation } from './constants'
import RadioOptionGroup from '@/components/common/RadioOptionGroup'

const DepositWithdrawToggle: FC<{
  modeOfOperation: string
  setModeOfOperation: Dispatch<SetStateAction<string>>
  }> = ({ modeOfOperation, setModeOfOperation }): ReactElement => (
    <RadioOptionGroup
      defaultValue={'deposit'}
      value={modeOfOperation == ModeOfOperation.DEPOSIT ? 'deposit' : 'withdraw'}
      className={`w-full mt-3 max-sm:mt-1 px-2.5`}
      optionClassName={`w-full text-h5`}
      options={[
        {
          value: 'deposit',
          label: 'Deposit',
          onClick: () => setModeOfOperation(ModeOfOperation.DEPOSIT)
        },
        {
          value: 'withdraw',
          label: 'Withdraw',
          onClick: () => setModeOfOperation(ModeOfOperation.WITHDRAW)
        }
      ]}
    />
)

export default DepositWithdrawToggle
