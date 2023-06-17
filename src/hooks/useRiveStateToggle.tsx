import { useCallback, useEffect } from 'react'
import { Rive, StateMachineInput, useStateMachineInput } from '@rive-app/react-canvas'
import { useLocation } from 'react-router-dom'
import { RIVE_ANIMATION } from '../constants'
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
  const { pathname } = useLocation()
  const stateInput = useStateMachineInput(
    rive,
    stateMachine,
    input ?? RIVE_ANIMATION[animation].stateMachines[stateMachine].inputs.state
  )
  useEffect(() => {
    if (!stateInput) return
    stateInput.value = pathname.includes(path)
  }, [pathname, path, stateInput])
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
