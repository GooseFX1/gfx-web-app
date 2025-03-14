import { GAMMASortConfig } from '@/pages/FarmV4/constants'

export function getSortKey(sortConfig: GAMMASortConfig, isPortfolio: boolean, viewRange: number) {
  const computedViewRange = viewRange == 0 ? '24H' : viewRange == 1 ? '7D' : '30D'

  const key = `${sortConfig.key.toLowerCase()}`
  if ((sortConfig.id == '9' || sortConfig.id == '10') && !isPortfolio) {
    return ''
  }
  if (sortConfig.id !== '1' && sortConfig.id !== '2' && sortConfig.id !== '9' && sortConfig.id !== '10') {
    return `${key}${computedViewRange.toLowerCase()}`
  }
  return key
}