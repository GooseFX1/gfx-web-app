import { ReactElement } from 'react'
import { TokenToggleNFT } from '../../../components'
import { useNFTAggregator } from '../../../context'
import { TableHeaderTitle } from '../../../utils/GenericDegsin'

export const NFTColumnsTitleWeb = (): ReactElement => {
  const { setCurrency } = useNFTAggregator()
  return (
    <tr>
      <>
        <th className="borderRow">{TableHeaderTitle('Collection Name', '', true)}</th>
        <th>{TableHeaderTitle('Floor Price', '', true)}</th>
        <th>
          {TableHeaderTitle(
            'GFX Appraisal',
            'The GFX Appraisal Value' + 'emphasizes executed sales data, not floor prices.',
            true
          )}
        </th>
        <th>{TableHeaderTitle('24h Change', '', true)}</th>
        <th>{TableHeaderTitle('Marketcap', '', true)}</th>
        <th>{TableHeaderTitle('24h Volume', '', true)}</th>
        <th className="borderRow2">
          <TokenToggleNFT toggleToken={setCurrency} />
        </th>
      </>
    </tr>
  )
}

export const NFTActivitySectionWeb = (): ReactElement => (
  <tr>
    <th>Item</th>
    <th>Type</th>
    <th>Price</th>
    <th>Market</th>
    <th>Buyer</th>
    <th>Seller</th>
    <th>Time</th>
  </tr>
)
