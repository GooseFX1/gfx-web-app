import { useCallback, useState } from 'react'

export function abbreviateNumber(num: number, fixed: number): String {
  if (!num) {
    return '0'
  }

  fixed = !fixed || fixed < 0 ? 0 : fixed
  const b = num.toPrecision(2).split('e')
  const k = b.length === 1 ? 0 : Math.floor(Math.min(Number(b[1].slice(1)), 14) / 3)
  const c = Number(k < 1 ? num.toFixed(fixed) : (num / Math.pow(10, k * 3)).toFixed(1 + fixed))
  const d = c < 0 ? c : Math.abs(c)
  return d + ['', 'K', 'M', 'B', 'T'][k]
}

export function capitalizeFirstLetter(s: string): string {
  return `${s.charAt(0).toUpperCase()}${s.slice(1)}`
}

export function chunks<T>(array: T[], size: number): T[][] {
  return Array.apply<number, T[], T[][]>(0, new Array(Math.ceil(array.length / size))).map((_, index) =>
    array.slice(index * size, (index + 1) * size)
  )
}

export function ellipseNumber(x: number | string | undefined, length: number = 15): string {
  x = String(x)
  return x.length > length ? x.slice(0, length).concat('...') : x
}

export function flatten(
  obj: { [x: string]: any },
  { prefix = '', restrictTo }: { prefix?: string; restrictTo: string[] }
) {
  let restrict = restrictTo

  if (restrict) {
    restrict = restrict.filter((k) => obj.hasOwnProperty(k))
  }

  const result: { [x: string]: any } = {}
  ;(function recurse(obj, current, keys) {
    ;(keys || Object.keys(obj)).forEach((key) => {
      const value = obj[key]
      const newKey = current ? current + '.' + key : key
      if (value && typeof value === 'object') {
        // @ts-ignore
        recurse(value, newKey)
      } else {
        result[newKey] = value
      }
    })
  })(obj, prefix, restrict)

  return result
}

export function monetaryFormatValue(n: number): string {
  const formatter = Intl.NumberFormat('en-US')
  return formatter.format(n)
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export function useLocalStorageState(key: string, defaultState?: string) {
  const [state, setState] = useState(() => {
    const storedState = localStorage.getItem(key)
    return storedState ? JSON.parse(storedState) : defaultState
  })

  const setLocalStorageState = useCallback(
    (newState) => {
      if (state !== newState) {
        setState(newState)
        if (newState === null) {
          localStorage.removeItem(key)
        } else {
          localStorage.setItem(key, JSON.stringify(newState))
        }
      }
    },
    [state, key]
  )

  return [state, setLocalStorageState]
}
