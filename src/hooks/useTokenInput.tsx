import { ChangeEvent, useCallback, useState } from 'react'
import useMemoizedArrayReturn from '@/hooks/useMemoizedArrayReturn'

export type useTokenInputCommands = {
  clear: () => void
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onBlur: (e: ChangeEvent<HTMLInputElement>) => void
  set: (value: string) => void
}
type ReturnValue = [string, useTokenInputCommands]
function fixNumberString(input) {
  // Split the input on dots.
  const parts = input.split('.');
  let integerPart = parts[0];
  const fractionalParts = parts.slice(1);

  // Remove leading zeros from the integer part.
  // If the integer part is empty or becomes empty after removal, default to "0".
  if (integerPart === '') {
    integerPart = '0';
  } else {
    integerPart = integerPart.replace(/^0+/, '');
    if (integerPart === '') {
      integerPart = '0';
    }
  }

  // If the input starts with a dot, we want the integer part to be "0".
  // Also, if the first fractional part is a "0", remove it.
  if (parts[0] === '' && fractionalParts[0] === '0') {
    fractionalParts.shift();
  }

  // Join the remaining fractional parts to remove extra dots.
  let fractional = fractionalParts.join('');
  if (fractional === '') {
    fractional = '0';
  }

  return integerPart + '.' + fractional;
}
function useTokenInput() {
  const [value, setValue] = useState('')
  const clear = useCallback(() => setValue(''), [])
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    value = value.replace(/[^0-9.]/g, '');

    const cursorPosition: number | null = e.target.selectionStart
    const mantissas = value.match(new RegExp(/\./g, "g"));
    const mantissaCount = mantissas?.length ?? 0
    if (value === '') {
      setValue('')
      return
    }
    // prepend 0 if value starts with . and its first input to prevent EXPLOSION
    if (value.startsWith('.') && mantissaCount <= 1 && cursorPosition != null && cursorPosition > 0) {
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
    value = value.replace(/\.{2,}/g, '.');
    // prepare to fix bunch of edge cases e.g 0.33.3.3..3
    const values = value.split('.')

    // remove leading zeros more than 1
    let partA = values[0];
    partA = partA.replace(/^0+/, '');
    if (partA === '') {
      partA = '0';
    }

    // compress out duplicate dots
    value = partA + '.' + values.slice(1).join('')

    console.log({value, newProposedFix: fixNumberString(e.target.value)})
    setValue(value)
  }, [])

  const onBlur = useCallback((e) => {
    let value = e.target.value
    const mantissas = value.match(new RegExp(/\./g, "g"));
    const mantissaCount = mantissas?.length ?? 0
    // prepend 0 if value starts with . and its first input to prevent EXPLOSION
    if (value.startsWith('.') && mantissaCount <= 1) {
      value = '0' + value
    }
    // remove trailing dot if we have digits after it
    if (value.endsWith('.')) {
      value = value + '0'
    }

    setValue(value)
  }, [])
  const set = useCallback((value: string) => setValue(value), [])
  return useMemoizedArrayReturn<ReturnValue>(value, { clear, onChange, onBlur, set })
}

export default useTokenInput
