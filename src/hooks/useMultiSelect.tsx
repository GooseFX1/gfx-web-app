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
    setChoices([...choices, choice])
    set.add(uniqueValueSelector(choice))
    console.log('add choice', choice, choices, set.has(uniqueValueSelector(choice)),set, uniqueValueSelector(choice))
  }, [choices])
  const clearAllChoices = useCallback(() => {
    setChoices([])
    set.clear()
  }, [])
  const removeChoice = useCallback((choice: T) => {
    console.log('remove',set, set.has(uniqueValueSelector(choice)), uniqueValueSelector(choice))
    if (!set.has(uniqueValueSelector(choice))) return
    setChoices(choices.filter(c => uniqueValueSelector(c) !== uniqueValueSelector(choice)))
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