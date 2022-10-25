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

export const isHasValue = (value: any) => value !== null && typeof value !== 'undefined'

export const isNotEmpty = (value: any) => isHasValue(value) && (value + '').trim().length > 0

// Format money
export const moneyFormatter = (number: number, currency = '') => {
  if (!isNotEmpty(number)) return ''
  return number.toLocaleString() + currency
}
export const moneyFormatterWithComma = (number: number, currency = '') => {
  if (!isNotEmpty(number)) return ''
  return currency + ' ' + commafy(number)
}
export const percentFormatter = (number: number) => {
  if (!isNotEmpty(number)) return 0
  return number.toFixed(0) + '%'
}
function commafy(num) {
  let str: any = parseFloat(num).toFixed(3)
  str = str.toString().split('.')
  if (str[0].length >= 5) {
    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,')
  }
  if (str[1] && str[1].length >= 5) {
    str[1] = str[1].replace(/(\d{3})/g, '$1 ')
  }
  return str.join('.')
}
