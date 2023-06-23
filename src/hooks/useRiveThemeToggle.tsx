import { useEffect } from 'react'
import { Rive, StateMachineInput, useStateMachineInput } from '@rive-app/react-canvas'
import { useDarkMode } from '../context'
interface useRiveThemeToggleReturn {
  themeInput: StateMachineInput | null
}
function useRiveThemeToggle(rive: Rive, animation: string, stateMachine: string): useRiveThemeToggleReturn {
  const { mode } = useDarkMode()
  const themeInput = useStateMachineInput(rive, stateMachine, 'Theme', mode === 'dark')

  useEffect(() => {
    if (!themeInput) return
    themeInput.value = mode === 'dark'
  }, [mode, themeInput, rive])

  return { themeInput }
}

export default useRiveThemeToggle
