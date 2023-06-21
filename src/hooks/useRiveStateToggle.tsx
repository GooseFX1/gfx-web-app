import { useCallback, useEffect } from 'react'
import { Rive, StateMachineInput, useStateMachineInput } from '@rive-app/react-canvas'
import { useLocation } from 'react-router-dom'
import { useDarkMode } from '../context'
interface useRiveStateToggleReturn {
  setStateInput: (value: boolean) => void
  stateInput: StateMachineInput | null
}
function useRiveStateToggle(
  rive: Rive,
  animation: string,
  stateMachine: string,
  path: string,
  input?: string
): useRiveStateToggleReturn {
  const { mode } = useDarkMode()
  const { pathname } = useLocation()
  const stateInput = useStateMachineInput(rive, stateMachine, input ? input : 'State')

  useEffect(() => {
    if (!stateInput) return
    stateInput.value = pathname.includes(path)
  }, [pathname, path, stateInput, mode])
  const setStateInput = useCallback(
    (value: boolean) => {
      if (!stateInput) return
      stateInput.value = value
    },
    [stateInput]
  )
  return { setStateInput, stateInput }
}

export default useRiveStateToggle
