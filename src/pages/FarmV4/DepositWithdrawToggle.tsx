import { FC, ReactElement, Dispatch, SetStateAction } from 'react'
import { ModeOfOperation } from './constants'
import RadioOptionGroup from '@/components/common/RadioOptionGroup'
import { useGamma } from '@/context'

const DepositWithdrawToggle: FC<{
  setUserSourceDepositAmount: Dispatch<SetStateAction<string>>
  setUserSourceWithdrawAmount: Dispatch<SetStateAction<string>>
  setUserTargetDepositAmount: Dispatch<SetStateAction<string>>
  setUserTargetWithdrawAmount: Dispatch<SetStateAction<string>>
}> = ({
  setUserSourceDepositAmount,
  setUserSourceWithdrawAmount,
  setUserTargetDepositAmount,
  setUserTargetWithdrawAmount
}): ReactElement => {
  const { modeOfOperation, setModeOfOperation } = useGamma()
  return (
    <RadioOptionGroup
      defaultValue={ModeOfOperation.DEPOSIT}
      value={modeOfOperation === ModeOfOperation.DEPOSIT ? ModeOfOperation.DEPOSIT : ModeOfOperation.WITHDRAW}
      className={`w-full mt-3 max-sm:mt-1 px-2.5`}
      optionClassName={`w-full text-h5`}
      options={[
        {
          value: ModeOfOperation.DEPOSIT,
          label:  ModeOfOperation.DEPOSIT,
          onClick: () => {
            setModeOfOperation(ModeOfOperation?.DEPOSIT)
            setUserTargetWithdrawAmount('')
            setUserSourceWithdrawAmount('')
          }
        },
        {
          value: ModeOfOperation.WITHDRAW,
          label:  ModeOfOperation.WITHDRAW,
          onClick: () => {
            setModeOfOperation(ModeOfOperation?.WITHDRAW)
            setUserSourceDepositAmount('')
            setUserTargetDepositAmount('')
          }
        }
      ]}
    />
  )
}
export default DepositWithdrawToggle
