import Decimal from 'decimal.js'
import BigNumber from 'bignumber.js'
import BN from 'bn.js'
import { HTMLAttributes, useMemo } from 'react'

const SupportedConversions = ['comma', 'currency', 'none'] as const
type SupportedConversionsType = (typeof SupportedConversions)[number]
type SupportedValuesType = string | number | Decimal | BigNumber | BN

type ParagraphType = {
  as?: 'p'
} & HTMLAttributes<HTMLParagraphElement>
type HeadingType = {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
} & HTMLAttributes<HTMLHeadingElement>
type SpanType = {
  as?: 'span'
} & HTMLAttributes<HTMLSpanElement>
type TextProps = ParagraphType | HeadingType | SpanType

type TextNumberProps = {
  value: SupportedValuesType | undefined | null
  type?: SupportedConversionsType
  decimals?: number
  className?: string
  useDecimalForPrecision?: boolean
  roundType?: Decimal.Rounding
} & TextProps

function TextNumber({
  value,
  className,
  children,
  type = 'none',
  decimals = 2,
  as = 'p',
  useDecimalForPrecision = false,
  roundType = Decimal.ROUND_DOWN,
  ...props
}: TextNumberProps) {
  const convertedValue = useMemo(
    () => computeValue(value, type, decimals, useDecimalForPrecision, roundType),
    [value, type, decimals, useDecimalForPrecision, roundType]
  )
  const Comp = as
  return (
    <Comp className={className} {...props}>
      {convertedValue}
      {children}
    </Comp>
  )
}

export default TextNumber

function computeValue(
  value: SupportedValuesType,
  type: SupportedConversionsType,
  decimals: number,
  useDecimalForPrecision: boolean,
  roundType: Decimal.Rounding
) {
  const bigNumber: Decimal = new Decimal(getStringValue(value))
  const fixedValue = bigNumber.toFixed(decimals)
  switch (type) {
    case 'comma':
      return commafyString(fixedValue)
    case 'currency':
      return formatLargeString(bigNumber, decimals, useDecimalForPrecision, roundType)
    case 'none':
      return fixedValue
  }
}

const numberRegex = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/i

function getStringValue(value: SupportedValuesType) {
  if (typeof value === 'string') {
    return !numberRegex.test(value) ? '0.00' : value
  }
  switch (true) {
    case value instanceof Decimal:
      return value.toString()
    case value instanceof BigNumber:
      return value.toString()
    case value instanceof BN:
      return value.toString()
    case typeof value === 'number':
      return value.toString()
    default:
      return '0.00'
  }
}

function commafyString(num: string): string {
  const str = num.split('.')

  if (str[0].length >= 3) {
    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,')
  }
  if (str[1] && str[1].length >= 5) {
    str[1] = str[1].replace(/(\d{3})/g, '$1 ')
  }
  return str.join('.')
}

function formatLargeString(
  value: string | Decimal,
  decimals: number,
  useDecimalForPrecision: boolean,
  roundType: Decimal.Rounding
): string {
  // Handle empty string input
  if (value === '') return ''

  let num
  try {
    num = new Decimal(value)
  } catch (error) {
    // If conversion fails, return the original value.
    return value?.toString() ?? '0.0'
  }

  // Suffixes array: numbers below 1000 have no suffix.
  const suffixes = ['', 'K', 'M', 'B', 'T', 'P', 'E', 'Z', 'Y']
  let index = 0
  let result = new Decimal(num) // Copy of the number to work with

  const thousand = new Decimal(1000)
  // Divide by 1000 until the result is less than 1000 or we run out of suffixes.
  while (result.gte(thousand) && index < suffixes.length - 1) {
    result = result.dividedBy(thousand)
    index++
  }

  // Choose formatting: one decimal if the result is an integer, two decimals otherwise.
  const formatted = result.isInteger()
    ? result.toFixed(1)
    : result.toFixed(useDecimalForPrecision ? decimals : 2, roundType)
  return formatted.replace(/\.?0+$/, '') + suffixes[index]
}
