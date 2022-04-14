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

export function removeFloatingPointError(n: number): number {
  const s = n.toString()

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
