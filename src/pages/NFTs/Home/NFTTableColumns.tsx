import { ReactElement } from 'react'
import { NFT_COL_FILTER_OPTIONS, NFT_VOLUME_OPTIONS } from '../../../api/NFTs'
import { TokenToggleNFT } from '../../../components'
import { useNFTAggregator, useNFTAggregatorFilters, useNFTCollections } from '../../../context'
import { TableHeaderTitle } from '../../../utils/GenericDegsin'
import 'styled-components/macro'

export const NFTColumnsTitleWeb = (): ReactElement => {
  const { setCurrency } = useNFTAggregator()
  const { setAllCollections } = useNFTCollections()
  const { sortFilter, setSortFilter, setSortType, setPageNumber, sortType, timelineDisplay } =
    useNFTAggregatorFilters()

  const handleSortChangeForVolume = (sortFilterRequest: string) => {
    if (NFT_VOLUME_OPTIONS[sortFilterRequest] === sortFilter) {
      setPageNumber(0)
      setAllCollections([])
      setSortType((prev) => (prev === 'DESC' ? 'ASC' : 'DESC'))
      return
    }
    if (sortFilterRequest === '24h') setSortFilter(NFT_COL_FILTER_OPTIONS.DAILY_VOLUME)
    if (sortFilterRequest === '7d') setSortFilter(NFT_COL_FILTER_OPTIONS.WEEKLY_VOLUME)
    if (sortFilterRequest === '30d') setSortFilter(NFT_COL_FILTER_OPTIONS.MONTHLY_VOLUME)
    if (sortFilterRequest === 'All') setSortFilter(NFT_COL_FILTER_OPTIONS.TOTAL_VOLUME)
  }
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
  const checkIfVolumeSelected = () => {
    if (
      sortFilter === NFT_COL_FILTER_OPTIONS.DAILY_VOLUME ||
      sortFilter === NFT_COL_FILTER_OPTIONS.WEEKLY_VOLUME ||
      sortFilter === NFT_COL_FILTER_OPTIONS.MONTHLY_VOLUME ||
      sortFilter === NFT_COL_FILTER_OPTIONS.TOTAL_VOLUME
    )
      return true
    return false
  }
  return (
    <tr>
      <>
        <th className="borderRow" onClick={() => handleSortFilterChange(NFT_COL_FILTER_OPTIONS.COLLECTION_NAME)}>
          {TableHeaderTitle(
            'Collection Name',
            '',
            true,
            (sortFilter === NFT_COL_FILTER_OPTIONS.COLLECTION_NAME || !sortFilter) && sortType === 'DESC',
            sortFilter === NFT_COL_FILTER_OPTIONS.COLLECTION_NAME || !sortFilter
          )}
        </th>
        <th
          style={{ cursor: 'pointer' }}
          onClick={() => handleSortFilterChange(NFT_COL_FILTER_OPTIONS.FLOOR_PRICE)}
        >
          {TableHeaderTitle(
            'Floor Price',
            '',
            true,
            sortFilter === NFT_COL_FILTER_OPTIONS.FLOOR_PRICE && sortType === 'DESC',
            sortFilter === NFT_COL_FILTER_OPTIONS.FLOOR_PRICE
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
        <th onClick={() => handleSortChangeForVolume(timelineDisplay)}>
          {TableHeaderTitle(
            `${timelineDisplay} Volume`,
            '',
            true,
            checkIfVolumeSelected() && sortType === 'DESC',
            checkIfVolumeSelected()
          )}
        </th>
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
