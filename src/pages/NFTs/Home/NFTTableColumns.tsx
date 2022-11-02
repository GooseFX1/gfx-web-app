import { Switch } from 'antd'
import { TableHeaderTitle } from '../../../utils/GenericDegsin'

export const NFTColumnsTitleWeb = () => (
  <tr>
    <>
      <th className="borderRow">{TableHeaderTitle('Collection Name', '', true)}</th>
      <th>{TableHeaderTitle('Floor Price', '', true)}</th>
      <th>{TableHeaderTitle('GFX Appraisal', '', true)}</th>
      <th>{TableHeaderTitle('24h Change', '', true)}</th>
      <th>{TableHeaderTitle('Marketcap', '', true)}</th>
      <th>{TableHeaderTitle('24h Volume', '', true)}</th>
      <th className="borderRow2">
        <Switch />
      </th>
    </>
  </tr>
)
