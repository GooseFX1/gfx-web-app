import { useEffect, useState, FC } from 'react'
import styled from 'styled-components'

import { CollectionHeader } from './CollectionHeader'
import { CollectionTabs } from './CollectionTabs'
import { useNFTCollections } from '../../../context'
import { useParams } from 'react-router-dom'
import { IAppParams } from '../../../types/app_params.d'
import { Loader } from '../../../components'

const WRAPPED_LOADER = styled.div`
  position: relative;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Collection: FC = (): JSX.Element => {
  const params = useParams<IAppParams>()
  const { fetchSingleCollection } = useNFTCollections()
  const [err, setErr] = useState(false)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchSingleCollection(params.collectionId).then((res) => {
      if (res.response && res.response.status !== 200) {
        setErr(true)
      }
      setLoading(false)
    })

    return () => {}
  }, [])

  return loading ? (
    <WRAPPED_LOADER>
      <Loader />
    </WRAPPED_LOADER>
  ) : err ? (
    <h2>Something went wrong fetching the collection details</h2>
  ) : (
    <>
      <CollectionHeader setFilter={setSearch} filter={search} />
      <CollectionTabs filter={search} />
    </>
  )
}
