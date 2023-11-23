import { useCallback, useState } from 'react'
import { LAMPORTS_PER_SOL_NUMBER } from '../constants'

export type ConditionalData<T> = 'not-supported' | 'loading' | T

export const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

export const getUnixTs = (): number => new Date().getTime() / 1000

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
  { prefix = '' }: { prefix?: string; restrictTo: string[] }
): { [x: string]: any } {
  const result: { [x: string]: any } = {}
  ;(function recurse(obj, current, keys) {
    ;(keys || Object.keys(obj)).forEach((key) => {
      const value = obj[key]
      const newKey = current ? current + '.' + key : key
      if (value && typeof value === 'object') {
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

export function useLocalStorageState(key: string, defaultState?: string): any[] {
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

export const checkMobile = (): boolean => {
  const isBrowser: boolean = ((): boolean => typeof window !== 'undefined')()
  return isBrowser ? window?.innerWidth < 500 : false
}

//eslint-disable-next-line
export function debounce(callback: any, wait: number): (x: any) => void {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => callback.apply(this, args), wait)
  }
}

export const formatSOLDisplay = (solValue: string | number, dontDivide?: boolean, decimals?: number): string => {
  if (!solValue) return '0'
  if (typeof solValue === 'string' && dontDivide) {
    return parseFloat(solValue).toFixed(decimals ? decimals : 2)
  }
  if (typeof solValue === 'string') {
    return (parseFloat(solValue) / LAMPORTS_PER_SOL_NUMBER).toFixed(decimals ? decimals : 2)
  } else if (solValue < 10000000) return solValue.toFixed(decimals ? decimals : 2)
  else return (solValue / LAMPORTS_PER_SOL_NUMBER).toFixed(decimals ? decimals : 2)
}
export const formatSOLNumber = (solValue: string | number): number => {
  if (typeof solValue === 'string') return parseFloat(solValue) / LAMPORTS_PER_SOL_NUMBER
  return solValue / LAMPORTS_PER_SOL_NUMBER
}

export const toTitleCase = (str: string): string =>
  str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')

export const createUUID = (): string =>
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

export const getLast = <T>(arr: T[]): T => {
  if (arr.length <= 0) {
    return undefined
  }

  return arr[arr.length - 1]
}

export const getDateInISOFormat = (): string => {
  const today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
  const yyyy = today.getFullYear()

  return yyyy + '-' + mm + '-' + dd
}
export const LOADING_ARR = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

export const truncateAddress = (address: string, leftRightSize?: number): string =>
  `${address.substr(0, leftRightSize ?? 4)}..${address.substr(-(leftRightSize ?? 3), leftRightSize ?? 4)}`

export const truncateAddressForSixChar = (address: string): string =>
  `${address.substr(0, 6)}..${address.substr(-4, 4)}`

export const parseUnixTimestamp = (unixTime: string): string => {
  const date = new Date(0)
  date.setUTCSeconds(Number(unixTime))
  return date.toLocaleString('en-US', { timeZone: 'UTC' })
}

export const clamp = (num: number, min: number, max: number): number => Math.min(Math.max(num, min), max)

export const truncateBigNumber = (bigNumber: number): string | number => {
  if (!bigNumber || bigNumber === null) return '00.00'

  try {
    if (bigNumber >= 1000000000) {
      const nArray = (bigNumber / 1000000000).toString().split('.')
      const beforeDecimal = nArray[0]
      let afterDecimal = nArray.length > 1 ? nArray[1] : null
      if (!afterDecimal || afterDecimal === '0') afterDecimal = null
      else if (afterDecimal.length > 2) afterDecimal = afterDecimal.slice(0, 2)
      return beforeDecimal + (afterDecimal ? '.' + afterDecimal : '') + 'B'
    }
    if (bigNumber >= 1000000) {
      const nArray = (bigNumber / 1000000).toString().split('.')
      const beforeDecimal = nArray[0]
      let afterDecimal = nArray.length > 1 ? nArray[1] : null
      if (!afterDecimal || afterDecimal === '0') afterDecimal = null
      else if (afterDecimal.length > 2) afterDecimal = afterDecimal.slice(0, 2)
      return beforeDecimal + (afterDecimal ? '.' + afterDecimal : '') + 'M'
    }
    if (bigNumber >= 1000) {
      const nArray = (bigNumber / 1000).toString().split('.')
      const beforeDecimal = nArray[0]
      let afterDecimal = nArray[1]
      if (!afterDecimal || afterDecimal === '0') afterDecimal = null
      else if (afterDecimal.length > 2) afterDecimal = afterDecimal.slice(0, 2)
      return beforeDecimal + (afterDecimal ? '.' + afterDecimal : '') + 'K'
    }
    return Number(bigNumber.toFixed(2))
  } catch (error) {
    console.log('BIG NUM ERROR', bigNumber)
  }
}

export const truncateBigString = (nativeString: string, mintDecimals: number): string => {
  // eslint-disable-next-line max-len
  if (!nativeString || nativeString === null || nativeString === '0' || typeof nativeString !== 'string')
    return '00.00'

  const nativeStringLen = nativeString.length
  let usdString =
    nativeString.substring(0, nativeStringLen - mintDecimals) +
    '.' +
    nativeString.substring(nativeStringLen - mintDecimals, nativeStringLen - mintDecimals + 2)
  const decimalIndex = usdString?.indexOf('.')
  if (decimalIndex === 0) usdString = '0' + usdString
  const beforeDecimal = usdString?.substring(0, decimalIndex)
  const length = beforeDecimal.length

  try {
    if (length > 9) {
      const resultStr =
        beforeDecimal.substring(0, length - 9) + '.' + beforeDecimal.substring(length - 9, length - 9 + 2)
      return resultStr + 'B'
    }
    if (length > 6) {
      const resultStr =
        beforeDecimal.substring(0, length - 6) + '.' + beforeDecimal.substring(length - 6, length - 6 + 2)
      return resultStr + 'M'
    }
    if (length > 3) {
      const resultStr =
        beforeDecimal.substring(0, length - 3) + '.' + beforeDecimal.substring(length - 3, length - 3 + 2)
      return resultStr + 'K'
    }
    return usdString
  } catch (error) {
    console.log('BIG STRING ERROR', usdString)
  }
}

export const convertToNativeValue = (value: string, decimals: number): string => {
  try {
    const decimalIndex = value.indexOf('.')
    if (decimalIndex !== -1) {
      const beforeDecimal = value?.substring(0, decimalIndex)
      const afterDecimal = value?.substring(decimalIndex + 1)
      const afterDecimalLen = afterDecimal.length
      let i = 0
      let res = ''
      let afterDecimalVal = ''

      if (afterDecimalLen < decimals) {
        while (i < decimals - afterDecimalLen) {
          res += '0'
          i++
        }
        afterDecimalVal = afterDecimal + res
      } else {
        afterDecimalVal = afterDecimal.substring(0, decimals)
      }
      const result = beforeDecimal + afterDecimalVal
      return result
    } else {
      let i = 0
      let res = ''
      while (i < decimals) {
        res += '0'
        i++
      }
      const result = value + res
      return result
    }
  } catch (e) {
    console.log('ERROR IN INPUT STRING', value)
  }
}
