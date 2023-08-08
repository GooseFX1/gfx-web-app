import * as anchor from '@project-serum/anchor'

import { LAMPORTS_PER_SOL } from '@solana/web3.js'

export const toDate = (value?: anchor.BN): Date => {
  if (!value) {
    return
  }

  return new Date(value.toNumber() * 1000)
}

const numberFormater = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

export const formatNumber = {
  format: (val?: number): string => {
    if (!val) {
      return '0.00'
    }

    return numberFormater.format(val)
  },
  asNumber: (val?: anchor.BN): number | undefined => {
    if (!val) {
      return undefined
    }

    return val.toNumber() / LAMPORTS_PER_SOL
  }
}
