import { FC, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import { IAppParams } from '../../../types/app_params.d'
import { Loader } from '../../../components'
import { NFTDetails } from '../NFTDetails'
import { useNFTDetails } from '../../../context'
// import { NFTDetailsGeneralData, detailTabData, tradingHistoryTabData, attributesTabContentData } from './mockData'
import { BidModal } from './BidModal'

const WRAPPED_LOADER = styled.div`
  position: relative;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const OpenBidNFT: FC = () => {
  const params = useParams<IAppParams>()
  const [visible, setVisible] = useState(false)
  const [err, setErr] = useState(false)
  const [loading, setLoading] = useState(true)
  const { fetchGeneral } = useNFTDetails()
  const [details, setDetails] = useState()

  useEffect(() => {
    fetchGeneral(params.nftId).then((res) => {
      if ((res.response && res.response.status !== 200) || res.isAxiosError) {
        setErr(true)
      }
      setDetails(res.data.data[0])
      setLoading(false)
    })
    return () => {}
  }, [])

  return loading ? (
    <WRAPPED_LOADER>
      <Loader />
    </WRAPPED_LOADER>
  ) : err ? (
    <h2>Something went wrong fetching NFT details</h2>
  ) : (
    <>
      <NFTDetails mode="open-bid-NFT" handleClickPrimaryButton={() => setVisible(true)} />
      <BidModal details={details} visible={visible} setVisible={setVisible} />
    </>
  )
}
