import { ReactElement, useCallback } from 'react'
import { NFT_COL_FILTER_OPTIONS, NFT_VOLUME_OPTIONS } from '../../../api/NFTs'
import { TokenToggleNFT } from '../../../components'
import { useNFTAggregator, useNFTAggregatorFilters, useNFTCollections } from '../../../context'
import { TableHeaderTitle } from '../../../utils/GenericDegsin'
import 'styled-components/macro'
import { LOADING_ARR } from '../../../utils'

export const NFTColumnsTitleWeb = (): ReactElement => {
  const { setCurrency } = useNFTAggregator()
  const { setAllCollections } = useNFTCollections()
  const { sortFilter, setSortFilter, setSortType, setPageNumber, sortType, timelineDisplay } =
    useNFTAggregatorFilters()

  const handleSortChangeForVolume = useCallback(
    (sortFilterRequest: string) => {
      if (NFT_VOLUME_OPTIONS[sortFilterRequest] === sortFilter) {
        setPageNumber(0)
        setAllCollections(LOADING_ARR)
        setSortType((prev) => (prev === 'DESC' ? 'ASC' : 'DESC'))
        return
      }
      if (sortFilterRequest === '24h') setSortFilter(NFT_COL_FILTER_OPTIONS.DAILY_VOLUME)
      if (sortFilterRequest === '7d') setSortFilter(NFT_COL_FILTER_OPTIONS.WEEKLY_VOLUME)
      setSortType('DESC')
    },
    [timelineDisplay, sortFilter, sortType]
  )

  const handleSortFilterChange = useCallback(
    (sortFilterRequest) => {
      setPageNumber(0)
      setAllCollections(LOADING_ARR)
      if (!sortFilter) {
        setSortType('DESC')
        setSortFilter(sortFilterRequest)
      }
      if (sortFilter === sortFilterRequest) {
        setSortType((prev) => (prev === 'DESC' ? 'ASC' : 'DESC'))
      } else {
        setSortType('DESC')
        setSortFilter(sortFilterRequest)
      }
    },
    [sortFilter, sortType, timelineDisplay]
  )

  const checkIfVolumeSelected = useCallback(() => {
    if (sortFilter === NFT_COL_FILTER_OPTIONS.DAILY_VOLUME || sortFilter === NFT_COL_FILTER_OPTIONS.WEEKLY_VOLUME)
      return true
    return false
  }, [sortFilter, timelineDisplay, sortType])

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
        <th onClick={() => handleSortFilterChange(NFT_COL_FILTER_OPTIONS.FLOOR_PRICE)}>
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
        <th>{TableHeaderTitle('24H Change', '24 hours change based on Volume.', false)}</th>
        <th onClick={() => handleSortChangeForVolume(timelineDisplay)}>
          {TableHeaderTitle(
            `${timelineDisplay} Volume`,
            '',
            true,
            checkIfVolumeSelected() && sortType === 'DESC',
            checkIfVolumeSelected()
          )}
        </th>
        <th onClick={() => handleSortFilterChange(NFT_COL_FILTER_OPTIONS.MARKET_CAP)}>
          {TableHeaderTitle(
            'Marketcap',
            '',
            true,
            (sortFilter === NFT_COL_FILTER_OPTIONS.MARKET_CAP || !sortFilter) && sortType === 'DESC',
            sortFilter === NFT_COL_FILTER_OPTIONS.MARKET_CAP || !sortFilter
          )}
        </th>

        <th className="borderRow2">
          <div>
            <TokenToggleNFT toggleToken={setCurrency} />
          </div>
        </th>
      </>
    </tr>
  )
}

export const NFTActivitySectionWeb = (): ReactElement => (
  <tr>
    <th className={'table-col-header'} style={{ width: '26%' }}>
      Item
    </th>
    <th className={'table-col-header'} style={{ width: '10%' }}>
      Type
    </th>
    <th className={'table-col-header'} style={{ width: '13%' }}>
      Price
    </th>
    <th className={'table-col-header'} style={{ width: '13%' }}>
      Market
    </th>
    <th className={'table-col-header'} style={{ width: '13%' }}>
      Buyer
    </th>
    <th className={'table-col-header'} style={{ width: '13%' }}>
      Seller
    </th>
    <th className={'table-col-header'} style={{ width: '10%' }}>
      Time
    </th>
  </tr>
)
