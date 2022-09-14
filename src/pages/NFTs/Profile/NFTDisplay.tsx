import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Row, Col } from 'antd'
import { checkMobile } from '../../../utils'
import { ParsedAccount } from '../../../web3'
import { Card } from '../Collection/Card'
import NoContent from './NoContent'
import { SearchBar, Loader } from '../../../components'
import { useNFTProfile } from '../../../context'
import { StyledTabContent } from './TabContent.styled'
import { ISingleNFT } from '../../../types/nft_details.d'
import debounce from 'lodash.debounce'

interface INFTDisplay {
  type: 'collected' | 'created' | 'favorited'
  parsedAccounts?: ParsedAccount[]
  singleNFTs?: ISingleNFT[]
}

const NFTDisplay = (props: INFTDisplay): JSX.Element => {
  const { sessionUser, nonSessionProfile } = useNFTProfile()
  const [collectedItems, setCollectedItems] = useState<ISingleNFT[]>()
  const [filteredCollectedItems, setFilteredCollectedItems] = useState<ISingleNFT[]>()
  const [search, setSearch] = useState<string>('')
  const [loading, _setLoading] = useState<boolean>(false)

  const activePointRef = useRef(collectedItems)
  const activePointLoader = useRef(loading)

  // in place of original `setActivePoint`
  const setCollectedItemsPag = (x) => {
    activePointRef.current = x // keep updated
    setCollectedItems(x)
  }

  const setLoading = (x) => {
    activePointLoader.current = x // keep updated
    _setLoading(x)
  }

  useEffect(() => {
    if (props.singleNFTs) {
      setCollectedItemsPag(props.singleNFTs)
    } else if (!props.parsedAccounts || props.parsedAccounts.length === 0) {
      setCollectedItemsPag([])
    } else {
      fetchNFTData(props.parsedAccounts).then((singleNFTs) => {
        setCollectedItemsPag(singleNFTs)
      })
    }

    return () => setCollectedItemsPag(undefined)
  }, [props.singleNFTs, props.parsedAccounts])

  useEffect(() => {
    if (collectedItems) {
      if (search.length > 0) {
        const filteredData = collectedItems.filter(({ nft_name }) =>
          nft_name.toLowerCase().includes(search.trim().toLowerCase())
        )
        setFilteredCollectedItems(filteredData)
      } else {
        setFilteredCollectedItems(collectedItems)
      }
    }

    return () => setFilteredCollectedItems(undefined)
  }, [search, collectedItems])

  const fetchNFTData = async (parsedAccounts: ParsedAccount[]) => {
    const nfts = []
    for (let i = 0; i < parsedAccounts.length; i++) {
      try {
        const val = await axios.get(parsedAccounts[i].data.uri)
        nfts.push({
          non_fungible_id: null,
          nft_name: val.data.name,
          nft_description: val.data.description,
          mint_address: parsedAccounts[i].mint,
          metadata_url: parsedAccounts[i].data.uri,
          image_url: val.data.image,
          animation_url: '',
          collection_id: null,
          token_account: null,
          owner: nonSessionProfile === undefined ? sessionUser.pubkey : nonSessionProfile.pubkey
        })
      } catch (error) {
        console.error(error)
      }
    }
    return nfts
  }

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
      }
    }
  }

  return (
    <StyledTabContent>
      {!checkMobile() && (
        <div className="actions-group">
          <SearchBar className={'profile-search-bar'} filter={search} setFilter={setSearch} />
        </div>
      )}
      {filteredCollectedItems === undefined ? (
        <div className="profile-content-loading">
          <div>
            <Loader />
          </div>
        </div>
      ) : filteredCollectedItems && filteredCollectedItems.length > 0 ? (
        <div className="cards-list" id="border">
          <Row gutter={[24, 24]}>
            {filteredCollectedItems.map((nft: ISingleNFT) => (
              <Col sm={10} md={7} lg={6} xl={4} xxl={4} key={nft.mint_address} span={checkMobile() ? 12 : ''}>
                <Card singleNFT={nft} />
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <NoContent type={props.type} />
      )}
    </StyledTabContent>
  )
}

export default React.memo(NFTDisplay)
