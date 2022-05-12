import React, { FC } from 'react'
import { useParams } from 'react-router-dom'
import { IProjectParams } from '../../../../types/nft_launchpad'

export const SingleCollection: FC = () => {
  const params = useParams<IProjectParams>()
  return <div>{params.collectionId}</div>
}
