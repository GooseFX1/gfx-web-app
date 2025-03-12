import { useEffect, useState } from 'react'
import { DefaultStep } from './DefaultStep'
import { SelectPoolStep } from './SelectPoolStep'
import { Summary } from './Summary'
import { GAMMAPool } from '@/types/gamma'
import { SelectTokenStep } from './SelectTokenStep'
import { JupToken } from '@/pages/FarmV4/constants'
import { AddTimeframeStep } from './AddTimeframeStep'
import dayjs from 'dayjs'
import { SummaryWrapper } from './SummaryWrapper'
import { BottomDrawer } from '../bottom-drawer'
import useBreakPoint from '@/hooks/useBreakPoint'

export const TokenRewardsDrawer = ({ isOpen, setOpen }: { isOpen: boolean; setOpen: (b: boolean) => void }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [pool, setPool] = useState<GAMMAPool | null>(null)
  const [selectedToken, setSelectedToken] = useState<JupToken | null>(null)
  const [amountToken, setAmountToken] = useState<string>('')
  const [startDate, setStartDate] = useState<dayjs.Dayjs>(dayjs())
  const [endDate, setEndDate] = useState<dayjs.Dayjs>(dayjs().add(7,'day'))
  const { isMobile } = useBreakPoint()

  useEffect(() => {
    if (currentStep === 4 && !isMobile) {
      setCurrentStep(3)
    }
  }, [isMobile])
  useEffect(() => {
    if (!startDate || !endDate) return
    const diff = startDate.diff(endDate, 'days')
    if (diff >= 0) {
      setEndDate(startDate.add(7, 'day'))
    }
  }, [startDate, endDate])
  const summary = (currentStep: number) => (
    <Summary
      key="summary"
      selectedPool={pool}
      selectedToken={selectedToken}
      amountToken={amountToken}
      startDate={startDate}
      endDate={endDate}
      activeStep={currentStep}
    />
  )

  const steps = [
    <DefaultStep currentStep={currentStep} setCurrentStep={setCurrentStep} key="default" />,
    <SelectPoolStep
      key="select-pool"
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      summary={summary(1)}
      pool={pool}
      setPool={setPool}
    />,
    <SelectTokenStep
      key="select-token"
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      summary={summary(2)}
      selectedToken={selectedToken}
      setSelectedToken={setSelectedToken}
      amountToken={amountToken}
      setAmountToken={setAmountToken}
    />,
    <AddTimeframeStep
      key="add-timeframe"
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      summary={summary(3)}
      selectedToken={selectedToken}
      startDate={startDate}
      endDate={endDate}
      setStartDate={setStartDate}
      setEndDate={setEndDate}
    />,
    <SummaryWrapper key="summary-wrapper">
      <Summary
        key="summary"
        selectedPool={pool}
        selectedToken={selectedToken}
        amountToken={amountToken}
        startDate={startDate}
        endDate={endDate}
        hideTitle={true}
        activeStep={4}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />
    </SummaryWrapper>
  ]

  return (
    <BottomDrawer isOpen={isOpen} setOpen={setOpen} contentClassName="h-[508px]">
      {steps[currentStep]}
    </BottomDrawer>
  )
}
