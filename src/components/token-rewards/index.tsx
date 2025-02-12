import { useState } from 'react'
import { BottomDrawer } from '../bottom-drawer'
import { DefaultStep } from './DefaultStep'
import { SelectPoolStep } from './SelectPoolStep'
import { Summary } from './Summary'

export const TokenRewardsDrawer = ({ isOpen, setOpen }: { isOpen: boolean; setOpen: (b: boolean) => void }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const steps = [
    <DefaultStep setCurrentStep={setCurrentStep} />,
    <SelectPoolStep setCurrentStep={setCurrentStep} summary={<Summary />} />
  ]

  return (
    <BottomDrawer isOpen={isOpen} setOpen={setOpen}>
      {steps[currentStep]}
    </BottomDrawer>
  )
}
