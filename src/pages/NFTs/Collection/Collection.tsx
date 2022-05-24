import { useEffect, useState, FC } from 'react'
import { CollectionHeader } from './CollectionHeader'
import { CollectionTabs } from './CollectionTabs'
import styled from 'styled-components'
import { useNFTCollections, useNavCollapse } from '../../../context'
import { useParams } from 'react-router-dom'
import { IAppParams } from '../../../types/app_params'

const COLLECTION_CONTAINER = styled.div<{ collapsed: boolean }>`
  height: calc(100vh - ${({ collapsed }) => (collapsed ? '0px' : '88px')});
`

export const Collection: FC = (): JSX.Element => {
  const params = useParams<IAppParams>()
  const { isCollapsed } = useNavCollapse()
  const {
    singleCollection,
    fetchSingleCollection,
    setSingleCollection,
    setFixedPriceWithinCollection,
    setOpenBidWithinCollection,
    collectionOwners,
    setCollectionOwners
  } = useNFTCollections()
  const [err, setErr] = useState(false)
  const [filter, setFilter] = useState('')
  const [collapse, setCollapse] = useState(true)

  useEffect(() => {
    return () => {
      setSingleCollection(undefined)
      setFixedPriceWithinCollection(undefined)
      setOpenBidWithinCollection(undefined)
      setCollectionOwners(undefined)
    }
  }, [])

  useEffect(() => {
    if (!singleCollection || `${singleCollection.collection_id}` !== params.collectionId) {
      fetchSingleCollection(params.collectionId).then((res) => {
        if (res.response && res.response.status !== 200) {
          setErr(true)
        }
      })
    }

    return () => {}
  }, [fetchSingleCollection, params.collectionId, singleCollection])

  return err ? (
    <h2>Something went wrong fetching the collection details</h2>
  ) : (
    <COLLECTION_CONTAINER collapsed={isCollapsed}>
      <CollectionHeader collapse={collapse} setCollapse={setCollapse} setFilter={setFilter} filter={filter} />
      <CollectionTabs collapse={collapse} setCollapse={setCollapse} setFilter={setFilter} filter={filter} />
    </COLLECTION_CONTAINER>
  )
}
