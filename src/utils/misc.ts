import { useCallback, useState } from 'react'

export const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

export const getUnixTs = () => new Date().getTime() / 1000

export function abbreviateNumber(num: number, fixedNum: number): string {
  if (!num) {
    return '0'
  }

  const fixed = !fixedNum || fixedNum < 0 ? 0 : fixedNum
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
  return Array.apply(0, new Array(Math.ceil(array.length / size))).map((_, index) =>
    array.slice(index * size, (index + 1) * size)
  )
}

export function ellipseNumber(num: number | string | undefined, length = 15): string {
  const x = String(num)
  return x.length > length ? x.slice(0, length).concat('...') : x
}

export function flatten(
  obj: { [x: string]: any },
  { prefix = ''}: { prefix?: string; restrictTo: string[] }
) {

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
  })(obj, prefix)

  return result
}

export function monetaryFormatValue(n: number): string {
  return isNaN(n) ? '0' : Intl.NumberFormat('en-US').format(n)
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export function useLocalStorageState(key: string, defaultState?: string) {
  const [state, setState] = useState(() => {
    const storedState = localStorage.getItem(key)
    if (storedState === 'undefined') {
      return defaultState
    }
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

type UseStorageReturnValue = {
  getItem: (key: string) => string
  setItem: (key: string, value: string) => boolean
  removeItem: (key: string) => void
}

export const useLocalStorage = (): UseStorageReturnValue => {
  const isBrowser: boolean = ((): boolean => typeof window !== 'undefined')()

  const getItem = (key: string): string => (isBrowser ? window.localStorage[key] : '')

  const setItem = (key: string, value: string): boolean => {
    if (isBrowser) {
      window.localStorage.setItem(key, value)
      return true
    }

    return false
  }

  const removeItem = (key: string): void => {
    window.localStorage.removeItem(key)
  }

  return {
    getItem,
    setItem,
    removeItem
  }
}

export const checkMobile = () => {
  const isBrowser: boolean = ((): boolean => typeof window !== 'undefined')()
  return isBrowser ? window?.innerWidth < 500 : false
}

export function debounce(callback: any, wait: number) {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => callback.apply(this, args), wait)
  }
}

export const createUUID = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })

export const validateUUID = (uuid: string): boolean => {
  const validUUIDRegexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi
  return validUUIDRegexExp.test(uuid)
}

export const getLast = <T>(arr: T[]) => {
  if (arr.length <= 0) {
    return undefined
  }

  return arr[arr.length - 1]
}

export const getDateInISOFormat = () => {
  const today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
  const yyyy = today.getFullYear()

  return yyyy + '-' + mm + '-' + dd
}

export const truncateAddress = (address: string): string => `${address.substr(0, 4)}..${address.substr(-4, 4)}`
