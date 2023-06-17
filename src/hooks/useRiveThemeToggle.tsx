import { useEffect } from 'react'
import { Rive, useStateMachineInput } from '@rive-app/react-canvas'
import { RIVE_ANIMATION } from '../constants'
import { useDarkMode } from '../context'

function useRiveThemeToggle(rive: Rive, animation: string, stateMachine: string): void {
  const themeInput = useStateMachineInput(
    rive,
    RIVE_ANIMATION[animation].stateMachines[stateMachine].stateMachineName,
    RIVE_ANIMATION[animation].stateMachines[stateMachine].inputs.theme
  )
  const { mode } = useDarkMode()
  useEffect(() => {
    if (!themeInput) return
    themeInput.value = mode === 'dark'
  }, [mode, themeInput])
}

export default useRiveThemeToggle
