import { FC, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import { IAppParams } from '../../../types/app_params.d'
import { Loader } from '../../../components'
import { NFTDetails } from '../NFTDetails'
import { useNFTDetails, useConnectionConfig } from '../../../context'
// import { NFTDetailsGeneralData, detailTabData, tradingHistoryTabData, attributesTabContentData } from './mockData'
import { BidModal } from './BidModal'

const LOADING_CONTAINER = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`

const DETAILS_WRAPPER = styled.div`
  height: 100%;
`

const WRAPPED_LOADER = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const OpenBidNFT: FC = () => {
  const params = useParams<IAppParams>()
  const [err, setErr] = useState(false)
  const [loading, setLoading] = useState(true)
  const { general, fetchGeneral } = useNFTDetails()
  const { connection } = useConnectionConfig()

  useEffect(() => {
    if (general === undefined || `${general.non_fungible_id}` !== params.nftId) {
      fetchGeneral(params.nftId, connection).then((res) => {
        if ((res.response && res.response.status !== 200) || res.isAxiosError) {
          setErr(true)
        }

        setLoading(false)
      })
    } else {
      setLoading(false)
    }
    return () => {}
  }, [])

  return loading ? (
    <LOADING_CONTAINER>
      <WRAPPED_LOADER>
        <Loader />
      </WRAPPED_LOADER>
    </LOADING_CONTAINER>
  ) : err ? (
    <h2>Something went wrong fetching NFT details</h2>
  ) : (
    <DETAILS_WRAPPER>
      <NFTDetails mode="open-bid-NFT" />
    </DETAILS_WRAPPER>
  )
}
