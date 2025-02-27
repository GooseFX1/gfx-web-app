import useBreakPoint from '@/hooks/useBreakPoint'

export const StepCounter = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => (
  <div className="flex flex-row gap-1">
    <span
      className="text-[15px] font-bold 
    text-text-lightmode-secondary dark:text-text-darkmode-secondary"
    >{`Step ${currentStep}`}</span>
    <span
      className="text-[15px] 
    text-text-lightmode-tertiary dark:text-text-darkmode-secondary"
    >{`of ${totalSteps}`}</span>
  </div>
)

export const totalSteps = () => {
  const { isMobile } = useBreakPoint()

  return isMobile ? 4 : 3
}
