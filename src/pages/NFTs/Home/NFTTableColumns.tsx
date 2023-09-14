import { ReactElement, useCallback } from 'react'
import { NFT_COL_FILTER_OPTIONS, NFT_VOLUME_OPTIONS, TIMELINE } from '../../../api/NFTs'
import { TokenToggleNFT } from '../../../components'
import { useNFTAggregator, useNFTAggregatorFilters, useNFTCollections } from '../../../context'
import { TableHeaderTitle } from '../../../utils/GenericDegsin'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { LOADING_ARR } from '../../../utils'

const TOKEN_DIV = styled.div`
  ${tw`sm:mr-2`}
`

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
      if (sortFilterRequest === TIMELINE.TWENTY_FOUR_H) setSortFilter(NFT_COL_FILTER_OPTIONS.DAILY_VOLUME)
      if (sortFilterRequest === TIMELINE.SEVEN_D) setSortFilter(NFT_COL_FILTER_OPTIONS.WEEKLY_VOLUME)
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
            'The appraisal engine uses machine learning and non-linear statistical models to generate' +
              'real-time fair market  value prices for individual NFTs.' +
              'These can help you determine what prices to buy or sell your NFTs.',
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
          <TOKEN_DIV>
            <TokenToggleNFT toggleToken={setCurrency} />
          </TOKEN_DIV>
        </th>
      </>
    </tr>
  )
}

export const NFTActivitySectionWeb = (): ReactElement => (
  <tr>
    <th className={'table-col-header'} tw="!w-[20%] !justify-start pl-5">
      Item
    </th>
    <th className={'table-col-header'} style={{ width: '10%' }}>
      Type
    </th>
    <th className={'table-col-header'} style={{ width: '13%' }}>
      Price
    </th>
    <th className={'table-col-header'} style={{ width: '13%', justifyContent: 'start' }}>
      Market
    </th>
    <th className={'table-col-header'} style={{ width: '13%' }}>
      Buyer
    </th>
    <th className={'table-col-header'} style={{ width: '13%' }}>
      Seller
    </th>
    <th className={'table-col-header'} style={{ width: '15%' }}>
      Time
    </th>
  </tr>
)
