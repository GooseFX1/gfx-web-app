import { useCallback, useState } from 'react'

function UseMultiSelect<T, U>({
                                uniqueValueSelector
                              }: {
  uniqueValueSelector: (item: T) => U
}) {
  const [choices, setChoices] = useState<T[]>([])
  const set = new Set<U>()
  const addChoice = useCallback((choice: T) => {
    if (set.has(uniqueValueSelector(choice))) return
    setChoices([...choices, choice])
    set.add(uniqueValueSelector(choice))
  }, [choices])
  const clearAllChoices = useCallback(() => {
    setChoices([])
    set.clear()
  }, [])
  const removeChoice = useCallback((choice: T) => {
    if (!set.has(uniqueValueSelector(choice))) return
    setChoices(choices.filter(c => uniqueValueSelector(c) !== uniqueValueSelector(choice)))
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