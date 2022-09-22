import { useState, useEffect, FC, useRef } from 'react'
import styled, { css } from 'styled-components'
import { Row, Col } from 'antd'
import { Card } from './Card'
import { useNFTCollections } from '../../../context'
import { ISingleNFT } from '../../../types/nft_details.d'
import { Loader } from '../../../components'
import debounce from 'lodash.debounce'

const WRAPPER = styled.div``

const OPEN_BIDS_TAB = styled.div`
  ${({ theme }) => css`
    overflow-y: hidden;
    padding: ${theme.margin(5.5)} ${theme.margin(4)};

    &::-webkit-scrollbar {
      display: none;
    }
  `}
`
const NO_CONTENT = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  color: ${({ theme }) => theme.text8};

  .no-data-image {
    max-width: 160px;
    margin-bottom: 20px;
  }
`

const WRAPPED_LOADER = styled.div`
  position: relative;
  height: 48px;
`

export const OpenBidsTabContent: FC<{ filter: any; setCollapse?: (x: any) => void }> = ({ filter, ...rest }) => {
  const { openBidWithinCollection } = useNFTCollections()
  const paginationNum = 12

  const [fileredLocalOpenBid, _setFilteredLocalOpenBid] = useState<Array<ISingleNFT>>(Array(21).fill(null))
  const [shortfilteredLocalOpenBid, _setShortFilteredLocalOpenBid] = useState<Array<ISingleNFT>>(
    Array(21).fill(null)
  )
  const [level, _setLevel] = useState<number>(0)
  const [loading, _setLoading] = useState<boolean>(false)

  // define a ref
  const activePointRef = useRef(fileredLocalOpenBid)
  const activePointLevel = useRef(level)
  const activePointshortFilter = useRef(shortfilteredLocalOpenBid)
  const activePointLoader = useRef(loading)

  // in place of original `setActivePoint`
  const setFilteredLocalOpenBid = (x) => {
    activePointRef.current = x // keep updated
    _setFilteredLocalOpenBid(x)
  }

  const setLevel = (x) => {
    activePointLevel.current = x // keep updated
    _setLevel(x)
  }

  const setShortFilteredLocalOpenBid = (x) => {
    activePointshortFilter.current = x // keep updated
    _setShortFilteredLocalOpenBid(x)
  }

  const setLoading = (x) => {
    activePointLoader.current = x // keep updated
    _setLoading(x)
  }

  useEffect(() => {
    if (openBidWithinCollection) {
      if (filter.length > 0) {
        const filteredData = openBidWithinCollection.open_bid.filter((i) =>
          i.nft_name.toLowerCase().includes(filter.trim().toLowerCase())
        )

        setFilteredLocalOpenBid(filteredData)
        setShortFilteredLocalOpenBid(filteredData.slice(0, paginationNum))
      } else {
        setFilteredLocalOpenBid(openBidWithinCollection.open_bid)
        setShortFilteredLocalOpenBid(openBidWithinCollection.open_bid.slice(0, paginationNum))
      }

      setLevel(0)
    }
  }, [filter, openBidWithinCollection])

  useEffect(() => {
    window.addEventListener('scroll', scrolling, true)

    return () => window.removeEventListener('scroll', scrolling, true)
  }, [])

  const scrolling = debounce(() => {
    handleScroll()
  }, 100)

  const handleScroll = () => {
    const border = document.getElementById('border')
    if (border !== null) {
      const mainHeight = window.innerHeight
      const totalscroll = mainHeight + border.scrollTop + 100

      if (Math.ceil(totalscroll) < border.scrollHeight || activePointLoader.current) {
        setLoading(false)
      } else {
        addToList()
      }
    }
  }

  const addToList = () => {
    const total = activePointRef.current
    const newLevel = activePointLevel.current + 1

    if (total?.length > newLevel * paginationNum) {
      setLoading(true)
      const nextData = total.slice(newLevel * paginationNum, (newLevel + 1) * paginationNum)
      setShortFilteredLocalOpenBid([...activePointshortFilter.current, ...nextData])
      setLevel(newLevel)
      setLoading(false)
    }
  }

  // TODO: lazy loader for the thousands of nfts
  return (
    <WRAPPER>
      {fileredLocalOpenBid.length > 0 ? (
        <OPEN_BIDS_TAB {...rest} className="card-list">
          <Row gutter={[32, 24]}>
            {shortfilteredLocalOpenBid.map((item: ISingleNFT | null, index: number) => (
              <Col sm={10} md={7} lg={6} xl={4} xxl={4} key={item ? item.uuid : index}>
                <Card singleNFT={item} />
              </Col>
            ))}
          </Row>
          {loading && (
            <WRAPPED_LOADER>
              <Loader />
            </WRAPPED_LOADER>
          )}
        </OPEN_BIDS_TAB>
      ) : (
        <NO_CONTENT>
          <div>
            <img className="no-data-image" src={`/img/assets/collected-no-data.png`} alt="" />
            <p>No Open Bid NFTs Listed</p>
          </div>
        </NO_CONTENT>
      )}
    </WRAPPER>
  )
}
