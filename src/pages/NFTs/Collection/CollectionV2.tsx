import React, { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { useNavCollapse } from '../../../context'
import { IAppParams } from '../../../types/app_params'
import { COLLECTION_VIEW_WRAPPER, GRID_CONTAINER } from './CollectionV2.styles'

const CollectionV2 = (): ReactElement => {
  console.log('first')
  const params = useParams<IAppParams>()
  console.log(params)
  const { isCollapsed } = useNavCollapse()

  return (
    <COLLECTION_VIEW_WRAPPER navCollapsed={isCollapsed}>
      <div className="nftStatsContainer">stats</div>
      <NFTGridContainer />
    </COLLECTION_VIEW_WRAPPER>
  )
}

const NFTGridContainer = (): ReactElement => {
  console.log('object')
  const { isCollapsed } = useNavCollapse()
  return (
    <GRID_CONTAINER navCollapsed={isCollapsed}>
      <div className="filtersContainer"></div>
    </GRID_CONTAINER>
  )
}

export default CollectionV2
