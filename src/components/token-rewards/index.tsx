import { useState } from 'react'
import { BottomDrawer } from '../bottom-drawer'
import { DefaultStep } from './DefaultStep'
import { SelectPoolStep } from './SelectPoolStep'
import { Summary } from './Summary'
import { GAMMAPool } from '@/types/gamma'
import { SelectTokenStep } from './SelectTokenStep'
import { JupToken } from '@/pages/FarmV4/constants'

export const TokenRewardsDrawer = ({ isOpen, setOpen }: { isOpen: boolean; setOpen: (b: boolean) => void }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [pool, setPool] = useState<GAMMAPool | null>(null)
  const [selectedToken, setSelectedToken] = useState<JupToken | null>(null)
  const [amountToken, setAmountToken] = useState<string>('')

  const summary = <Summary selectedPool={pool} selectedToken={selectedToken} amountToken={amountToken} />

  const steps = [
    <DefaultStep setCurrentStep={setCurrentStep} key="default" />,
    <SelectPoolStep
      key="select-pool"
      setCurrentStep={setCurrentStep}
      summary={summary}
      pool={pool}
      setPool={setPool}
    />,
    <SelectTokenStep
      key="select-token"
      setCurrentStep={setCurrentStep}
      summary={summary}
      selectedToken={selectedToken}
      setSelectedToken={setSelectedToken}
      amountToken={amountToken}
      setAmountToken={setAmountToken}
    />
  ]

  return (
    <BottomDrawer isOpen={isOpen} setOpen={setOpen}>
      {steps[currentStep]}
    </BottomDrawer>
  )
}
