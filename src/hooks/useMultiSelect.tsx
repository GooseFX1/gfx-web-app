import { useCallback, useState } from 'react'

function UseMultiSelect<T, U>({
                                uniqueValueSelector
                              }: {
  uniqueValueSelector: (item: T) => U
}) {
  const [choices, setChoices] = useState<T[]>([])
  const [set] = useState<Set<U>>(new Set())
  const addChoice = useCallback((choice: T) => {
    if (set.has(uniqueValueSelector(choice))) return
    setChoices(prev => [...prev, choice])
    set.add(uniqueValueSelector(choice))
  }, [choices])
  const clearAllChoices = useCallback(() => {
    setChoices([])
    set.clear()
  }, [choices])
  const removeChoice = useCallback((choice: T) => {
    if (!set.has(uniqueValueSelector(choice))) return
    setChoices(prev => prev.filter(c => uniqueValueSelector(c) !== uniqueValueSelector(choice)))
    set.delete(uniqueValueSelector(choice))
  }, [choices])
  const hasChoice = useCallback((choice: T) => set.has(uniqueValueSelector(choice)), [choices])
  return {
    choices,
    addChoice,
    clearAllChoices,
    removeChoice,
    hasChoice
  }
}

export default UseMultiSelect