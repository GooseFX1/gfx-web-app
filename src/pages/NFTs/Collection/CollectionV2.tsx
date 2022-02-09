import { FC } from 'react'
import { CollectionHeaderV2 } from './CollectionHeaderV2'
import { CollectionTabV2 } from './CollectionTabV2'

export const CollectionV2: FC = (): JSX.Element => {
  return (
    <>
      <CollectionHeaderV2 />
      <CollectionTabV2 />
    </>
  )
}
