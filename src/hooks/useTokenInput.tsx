import { ChangeEvent, useCallback, useState } from 'react'
import useMemoizedArrayReturn from '@/hooks/useMemoizedArrayReturn'

export type useTokenInputCommands = {
  clear: () => void
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onBlur: (e: ChangeEvent<HTMLInputElement>) => void
  set: (value: string) => void
}
type ReturnValue = [string, useTokenInputCommands]
const MantissaRegex = new RegExp(/\./g, 'g')

export function fixNumberString(
  input: string,
  cursorPosition?: number | null,
  inputType?: HTMLInputElement['type']
): string {
  // cleanup alphanumeric input e.g 13.411A -> 13.411
  let value = input.replace(/[^0-9.]/g, '')

  const mantissas = value.match(MantissaRegex)
  const mantissaCount = mantissas?.length ?? 0
  // clear input if it is empty
  if (value === '') {
    return ''
  }
  const useCursor = inputType !== 'number'
  // prepend 0 if value starts with . and its first input to prevent EXPLOSION
  if (value.startsWith('.') && mantissaCount <= 1 && useCursor && cursorPosition != null && cursorPosition > 0) {
    value = '0' + value
  }

  // remove trailing dot if we have digits after it
  if (value.endsWith('.') && mantissaCount > 1) {
    value = value.slice(0, -1)
  }

  // remove leading dot if it is the first character - only
  if (mantissaCount > 1 && value.startsWith('.')) {
    value = value.slice(1)
  }

  // 2 or more dots in a row - replace with one
  value = value.replace(/\.{2,}/g, '.')
  // prepare to fix bunch of edge cases e.g 0.33.3.3..3
  const values = value.split('.')

  // remove leading zeros more than 1
  let partA = values[0]
  partA = partA.replace(/^0+/, '')
  if (partA === '' && values[0].length > 0) {
    partA = '0'
  }

  // compress out duplicate dots
  value = `${partA}${values.length > 1 ? '.' : ''}${values.slice(1).join('')}`

  return value
}

function useTokenInput() {
  const [value, setValue] = useState('')
  const clear = useCallback(() => setValue(''), [])
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(fixNumberString(e.target.value, e.target.selectionStart, e.target.type))
  }, [])

  const onBlur = useCallback((e) => {
    let value = e.target.value
    const mantissas = value.match(new RegExp(/\./g, 'g'))
    const mantissaCount = mantissas?.length ?? 0
    // prepend 0 if value starts with . and its first input to prevent EXPLOSION
    if (value.startsWith('.') && mantissaCount <= 1) {
      value = '0' + value
    }
    // remove trailing dot if we have digits after it
    if (value.endsWith('.')) {
      value = value + '0'
    }
    console.log('blur',value)
    setValue(value)
  }, [])
  const set = useCallback((value: string) => setValue(value), [])
  return useMemoizedArrayReturn<ReturnValue>(value, { clear, onChange, onBlur, set })
}

export default useTokenInput
