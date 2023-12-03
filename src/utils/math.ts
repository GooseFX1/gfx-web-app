export function decimalModulo(a: number, b: number | undefined): number {
  const power = a.toString().length - (a.toString().indexOf('.') + 1)
  return (a * 10 ** power) % ((b || 1) * 10 ** power)
}

export function floorValue(n: number, value: number | undefined): number {
  if (!value) {
    return n
  }

  return removeFloatingPointError(Math.floor(n / value) * value)
}

export function removeFloatingPointError(num: number): number {
  let n = num ///allow num to be updated inside block functions
  const s = num.toString()

  const dotPosition = s.indexOf('.')
  if (dotPosition === -1) {
    return n
  }

  const match = /(\d)\1{5,}/.exec(s.slice(dotPosition + 1))
  if (match) {
    const errorPosition = dotPosition + match.index + 1
    const errorDigit = Number(s[errorPosition])
    if (errorDigit < 5) {
      n = parseFloat(s.slice(0, errorPosition))
    } else {
      n = (parseFloat(s.slice(0, errorPosition)) * 10 ** match.index + 1) / 10 ** match.index
    }
  }

  return parseFloat(n.toFixed(3))
}

// Format 35.200 --> 35.2k
export const nFormatter = (n: number, digits = 1, withPlus = false): string => {
  if (n < 1e3) return n.toFixed(digits) + `${withPlus ? '+' : ''}`
  if (n >= 1e3 && n < 1e6) return `${+(n / 1e3).toFixed(digits)}K ${withPlus ? '+' : ''}`
  if (n >= 1e6 && n < 1e9) return `${+(n / 1e6).toFixed(digits)}M ${withPlus ? '+' : ''}`
  if (n >= 1e9 && n < 1e12) return `${+(n / 1e9).toFixed(digits)}B ${withPlus ? '+' : ''}`
  if (n >= 1e12) return `${+(n / 1e12).toFixed(digits)}T ${withPlus ? '+' : ''}`
}

//eslint-disable-next-line
export const isHasValue = (value: any): boolean => value !== null && typeof value !== 'undefined'

//eslint-disable-next-line
export const isNotEmpty = (value: any) => isHasValue(value) && (value + '').trim().length > 0

// Format money
export const moneyFormatter = (number: number, currency = ''): string => {
  if (!isNotEmpty(number)) return ''
  return number.toLocaleString() + currency
}
export const moneyFormatterWithComma = (number: number | any, currency = '', decimal = 3): string => {
  if (!isNotEmpty(number)) return ''
  return currency + ' ' + commafy(number, decimal)
}
export const percentFormatter = (number: number): string => {
  if (!isNotEmpty(number)) return '0'
  return number.toFixed(0) + '%'
}

export const commafy = (num: number, decimal: number): string => {
  if (!num) return '0'
  let str: any = num.toFixed(decimal)
  str = str.split('.')

  if (str[0].length >= 3) {
    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,')
  }
  if (str[1] && str[1].length >= 5) {
    str[1] = str[1].replace(/(\d{3})/g, '$1 ')
  }
  return str.join('.')
}
export const currencyUnits = ['', 'K', 'M', 'B', 'T', 'P', 'E', 'Z', 'Y']

export const numberFormatter = (num: number, digits = 2): string => {
  if (isNaN(num)) return '0.'.padEnd(digits, '0')
  const exponentNum = num.toExponential(digits)
  const splitNum = exponentNum.toLowerCase().split('e')
  const exponent = Number(splitNum[1])
  let numExponented = Number(splitNum[0])
  const unitIndex = Math.floor(exponent / 3)
  const unit = currencyUnits[unitIndex]

  let numCalc: number
  if (splitNum[1].startsWith('-')) {
    numCalc = numExponented * Math.pow(10, exponent)
  } else {
    numExponented = num / Math.pow(10, exponent)
    const differenceToNextUnit = exponent % 3
    numCalc = numExponented * Math.pow(10, differenceToNextUnit)
  }

  const splitOnDecimal = numCalc.toString().split('.')
  //accuracy fix
  if (splitOnDecimal.length === 1) return `${numCalc.toFixed(digits)}${unit ?? ''}`
  const decimal = splitOnDecimal[1].slice(0, digits)
  const accurateResult = splitOnDecimal[0] + (decimal ? '.' + decimal : ''.padStart(digits, '0'))
  return `${accurateResult}${unit ?? ''}`
}
export const getAccurateNumber = (num: number, digits = 2): number => {
  const splitOnDecimal = num.toString().split('.')
  //accuracy fix
  if (splitOnDecimal.length === 1) return num
  const decimal = splitOnDecimal[1].slice(0, digits)
  const accurateResult = splitOnDecimal[0] + (decimal ? '.' + decimal : ''.padStart(digits, '0'))
  return Number(accurateResult)
}
