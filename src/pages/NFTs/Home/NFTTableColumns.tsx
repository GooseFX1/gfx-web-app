import { ReactElement } from 'react'
import { TokenToggleNFT } from '../../../components'
import { TableHeaderTitle } from '../../../utils/GenericDegsin'

export const NFTColumnsTitleWeb = (): ReactElement => (
  <tr>
    <>
      <th className="borderRow">{TableHeaderTitle('Collection Name', '', true)}</th>
      <th>{TableHeaderTitle('Floor Price', '', true)}</th>
      <th>{TableHeaderTitle('GFX Appraisal', '', true)}</th>
      <th>{TableHeaderTitle('24h Change', '', true)}</th>
      <th>{TableHeaderTitle('Marketcap', '', true)}</th>
      <th>{TableHeaderTitle('24h Volume', '', true)}</th>
      <th className="borderRow2">
        <TokenToggleNFT tokenA="SOL" tokenB="USDC" toggleToken={() => console.log('changed')} />
      </th>
    </>
  </tr>
)

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
