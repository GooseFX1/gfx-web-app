import { ReactElement } from 'react'
import { NFT_COL_FILTER_OPTIONS } from '../../../api/NFTs'
import { TokenToggleNFT } from '../../../components'
import { useNFTAggregator, useNFTAggregatorFilters, useNFTCollections } from '../../../context'
import { TableHeaderTitle } from '../../../utils/GenericDegsin'
import 'styled-components/macro'

export const NFTColumnsTitleWeb = (): ReactElement => {
  const { setCurrency } = useNFTAggregator()
  const { setAllCollections } = useNFTCollections()
  const { sortFilter, setSortFilter, setSortType, setPageNumber, sortType } = useNFTAggregatorFilters()
  const handleSortFilterChange = (sortFilterRequest) => {
    setPageNumber(0)
    setAllCollections([])
    if (!sortFilter) {
      setSortType('DESC')
      setSortFilter(sortFilterRequest)
    }
    if (sortFilter === sortFilterRequest) {
      setSortType((prev) => (prev === 'DESC' ? 'ASC' : 'DESC'))
    } else {
      setSortType('ASC')
      setSortFilter(sortFilterRequest)
    }
  }
  return (
    <tr>
      <>
        <th className="borderRow" onClick={() => handleSortFilterChange(NFT_COL_FILTER_OPTIONS.COLLECTION_NAME)}>
          {TableHeaderTitle(
            'Collection Name',
            '',
            sortFilter === NFT_COL_FILTER_OPTIONS.COLLECTION_NAME || !sortFilter,
            sortType === 'DESC'
          )}
        </th>
        <th
          style={{ cursor: 'pointer' }}
          onClick={() => handleSortFilterChange(NFT_COL_FILTER_OPTIONS.FLOOR_PRICE)}
        >
          {TableHeaderTitle(
            'Floor Price',
            '',
            sortFilter === NFT_COL_FILTER_OPTIONS.FLOOR_PRICE,
            sortType === 'DESC'
          )}
        </th>
        <th>
          {TableHeaderTitle(
            'GFX Appraisal',
            'The GFX Appraisal Value emphasizes executed sales data, not floor prices.',
            false
          )}
        </th>
        <th>{TableHeaderTitle('24h Change', '24 hours change based on the GFX Appraisal Value.', false)}</th>
        <th>{TableHeaderTitle('Marketcap', '', false)}</th>
        <th>{TableHeaderTitle('24h Volume', '', false)}</th>
        <th className="borderRow2" tw="mt-2">
          <div style={{ marginTop: 17 }}>
            <TokenToggleNFT toggleToken={setCurrency} />
          </div>
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
