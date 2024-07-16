import { FC, ReactElement } from 'react'

const DepositWithdrawLabel: FC<{ text: string }> = ({ text }): ReactElement => (
  <div className="text-regular font-semibold font-poppins dark:text-grey-8 text-black-4 mb-2.5 mx-2.5">{text}</div>
)

export default DepositWithdrawLabel
