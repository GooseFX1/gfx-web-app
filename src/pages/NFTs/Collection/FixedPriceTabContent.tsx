import { useState, useEffect, FC, useRef } from 'react'
import styled, { css } from 'styled-components'
import { Row, Col } from 'antd'
import { Card } from './Card'
import { useNFTCollections } from '../../../context'
import { ISingleNFT } from '../../../types/nft_details.d'
import { Loader } from '../../../components'
import debounce from 'lodash.debounce'

const WRAPPER = styled.div`
  height: 100%;
`

const FIXED_PRICE_TAB = styled.div`
  ${({ theme }) => css`
    overflow-y: auto;
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

export const FixedPriceTabContent: FC<{ filter: any; setCollapse?: (x: any) => void }> = ({ filter, ...rest }) => {
  const { fixedPriceWithinCollection } = useNFTCollections()

  const [fileredLocalFixedPrice, _setFilteredLocalFixedPrice] = useState<Array<ISingleNFT>>(Array(21).fill(null))
  const [shortfileredLocalFixedPrice, _setShortFilteredLocalFixedPrice] = useState<Array<ISingleNFT>>(
    Array(21).fill(null)
  )
  const [level, _setLevel] = useState<number>(0)
  const [loading, _setLoading] = useState<boolean>(false)

  // define a ref
  const activePointRef = useRef(fileredLocalFixedPrice)
  const activePointLevel = useRef(level)
  const activePointshortFilter = useRef(shortfileredLocalFixedPrice)
  const activePointLoader = useRef(loading)

  // in place of original `setActivePoint`
  const setFilteredLocalFixedPrice = (x) => {
    activePointRef.current = x // keep updated
    _setFilteredLocalFixedPrice(x)
  }

  const setLevel = (x) => {
    activePointLevel.current = x // keep updated
    _setLevel(x)
  }

  const setShortFilteredLocalFixedPrice = (x) => {
    activePointshortFilter.current = x // keep updated
    _setShortFilteredLocalFixedPrice(x)
  }

  const setLoading = (x) => {
    activePointLoader.current = x // keep updated
    _setLoading(x)
  }

  useEffect(() => {
    if (fixedPriceWithinCollection) {
      if (filter.length > 0) {
        const filteredData = fixedPriceWithinCollection.nft_data.filter((i) =>
          i.nft_name.toLowerCase().includes(filter.trim().toLowerCase())
        )

        setFilteredLocalFixedPrice(filteredData)
        setShortFilteredLocalFixedPrice(filteredData.slice(0, 25))
      } else {
        setFilteredLocalFixedPrice(fixedPriceWithinCollection.nft_data)
        setShortFilteredLocalFixedPrice(fixedPriceWithinCollection.nft_data.slice(0, 25))
      }

      setLevel(0)
    }
  }, [filter, fixedPriceWithinCollection])

  useEffect(() => {
    window.addEventListener(
      'scroll',
      debounce(() => {
        handleScroll()
      }, 100),
      true
    )

    return () =>
      window.removeEventListener(
        'scroll',
        debounce(() => {
          handleScroll()
        }, 100),
        true
      )
  }, [])

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

    if (total?.length > newLevel * 25) {
      setLoading(true)
      const nextData = total.slice(newLevel * 25, (newLevel + 1) * 25)
      setShortFilteredLocalFixedPrice([...activePointshortFilter.current, ...nextData])
      setLevel(newLevel)
      setLoading(false)

      // force scroll up to avoid over push
    }
  }

  // TODO: lazy loader for the thousands of nfts
  return (
    <WRAPPER>
      {fileredLocalFixedPrice.length > 0 ? (
        <FIXED_PRICE_TAB {...rest} className="card-list">
          <Row gutter={[32, 24]}>
            {shortfileredLocalFixedPrice.map((item: ISingleNFT | null, index: number) => (
              <Col sm={10} md={8} lg={6} xl={4} xxl={4} key={item ? item.uuid : index}>
                <Card singleNFT={item} />
              </Col>
            ))}
          </Row>
          {loading && (
            <WRAPPED_LOADER>
              <Loader />
            </WRAPPED_LOADER>
          )}
        </FIXED_PRICE_TAB>
      ) : (
        <NO_CONTENT>
          <div>
            <img className="no-data-image" src={`/img/assets/collected-no-data.png`} alt="" />
            <p>No Fixed Price NFTs Listed</p>
          </div>
        </NO_CONTENT>
      )}
    </WRAPPER>
  )
}
