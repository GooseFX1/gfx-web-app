import { useEffect, useState, FC } from 'react'
import { CollectionHeader } from './CollectionHeader'
import { CollectionTabs } from './CollectionTabs'
import styled from 'styled-components'
import { useNFTCollections, useNavCollapse } from '../../../context'
import { useParams } from 'react-router-dom'
import { IAppParams } from '../../../types/app_params'
import { NFT_MENU } from '../Home/NFTHome'
import { ModalSlide } from '../../../components/ModalSlide'
import { MODAL_TYPES } from '../../../constants'
import { GenericNotFound } from '../../InvalidUrl'

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
    setCollectionOwners,
    nftMenuPopup,
    setNFTMenuPopup
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
    if (!singleCollection || `${singleCollection.collection_id}` !== params.collectionName) {
      fetchSingleCollection(params.collectionName.replaceAll('_', ' ')).then((res) => {
        if (res?.status === 200) {
          setErr(false)
        } else {
          setErr(true)
        }
      })
    }

    return () => {}
  }, [fetchSingleCollection, params.collectionName]) //had to remove singleCollection useState trigger as it leads to infinite loop as setSingleCollection is called in fecthSingleCollection

  return err ? (
    <GenericNotFound />
  ) : (
    <COLLECTION_CONTAINER collapsed={isCollapsed}>
      {nftMenuPopup && <ModalSlide modalType={MODAL_TYPES.NFT_MENU} rewardToggle={setNFTMenuPopup} />}
      {/* <NFT_MENU onClick={() => setNFTMenuPopup((prev) => !prev)} /> */}
      <CollectionHeader collapse={collapse} setCollapse={setCollapse} setFilter={setFilter} filter={filter} />
      <CollectionTabs collapse={collapse} setCollapse={setCollapse} setFilter={setFilter} filter={filter} />
    </COLLECTION_CONTAINER>
  )
}
