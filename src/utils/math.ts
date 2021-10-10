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

  return n
}
