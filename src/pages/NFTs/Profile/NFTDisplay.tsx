import React, { useState, useEffect, useRef, FC } from 'react'
import axios from 'axios'
import { Row, Col } from 'antd'
import { checkMobile } from '../../../utils'
import { ParsedAccount } from '../../../web3'
import { Card } from '../Collection/Card'
import NoContent from './NoContent'
import { SearchBar, Loader, ArrowDropdown } from '../../../components'
import { useNFTProfile } from '../../../context'
import { StyledTabContent } from './TabContent.styled'
import { ISingleNFT } from '../../../types/nft_details.d'
import debounce from 'lodash.debounce'
import styled from 'styled-components'
import tw from 'twin.macro'
import { CenteredDiv } from '../../../styles'

const WRAPPER = styled.div`
  background-color: ${({ theme }) => theme.primary3};
  position: absolute;
  left: 367px;
  height: 40px;
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  width: 115px;
  border-radius: 59px;
  display: flex;
  justify-content: center;

  .ant-row {
    display: flex;
    justify-content: space-around;
    width: 100%;
  }
`

const REFRESH = styled.div`
  width: 40px;
  height: 40px;
  position: absolute;
  right: 110px;
  cursor: pointer;
`
const Toggle = styled(CenteredDiv)<{ $mode: boolean }>`
  ${tw`h-[25px] w-[50px] rounded-[40px] cursor-pointer`}
  border-radius: 30px;
  background-image: linear-gradient(to right, #f7931a 25%, #ac1cc7 100%);
  position: absolute;
  right: 20px;
  top: 30px;

  > div {
    ${tw`h-[30px] w-[30px]`}
    ${({ theme }) => theme.roundedBorders}
    box-shadow: 0 3.5px 3.5px 0 rgba(0, 0, 0, 0.25);
    background-image: url('/img/assets/solana-logo.png');
    background-position: center; 
    background-size: 100%;
    background-repeat: no-repeat;
    transform: translateX(${({ $mode }) => ($mode ? '-12px' : '12px')});
`

const DROPDOWN_WRAPPER = styled.div`
  padding: 12px;
  width: 115px;
  height: 98px;
  border-radius: 5px;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  background-color: ${({ theme }) => theme.bg23};

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  input[type='radio'] {
    width: 15px;
    height: 15px;
    appearance: none;
    border-radius: 50%;
    outline: none;
    background: ${({ theme }) => theme.bg24};
    accent-color: yellow;
    cursor: pointer;
  }

  input[type='radio']:checked {
    background-image: linear-gradient(111deg, #f7931a 11%, #ac1cc7 94%);
    border: 3px solid #1c1c1c;
  }
`

interface Props {
  nftFilterArr: string[]
  setNftFilter: (index: number) => void
}

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
  const [isSol, setIsSol] = useState<boolean>(true)
  const nftFilterArr = ['All', 'Offers', 'On Sell']
  const [nftFilter, setNftFilter] = useState<number>(0)

  const activePointRef = useRef(collectedItems)
  const activePointLoader = useRef(loading)

  // in place of original `setActivePoint`
  const setCollectedItemsPag = (x) => {
    activePointRef.current = x // keep updated
    setCollectedItems(x)
  }

  const toggleSol = () => {
    setIsSol((prev) => !prev)
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

  const Menu: FC<Props> = ({ nftFilterArr, setNftFilter }): JSX.Element => (
    <>
      <DROPDOWN_WRAPPER>
        {nftFilterArr.map((item, index) => (
          <div key={index}>
            <span>{item}</span>
            <input
              type="radio"
              value={item}
              name="nft_filter"
              checked={index === nftFilter}
              onChange={() => {
                setNftFilter(index)
              }}
            />
          </div>
        ))}
      </DROPDOWN_WRAPPER>
    </>
  )

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
        <>
          <div className="actions-group">
            <SearchBar className={'profile-search-bar'} filter={search} setFilter={setSearch} />
          </div>
          <WRAPPER>
            <ArrowDropdown
              measurements="16px"
              offset={[4, 8]}
              placement="bottom"
              overlay={<Menu nftFilterArr={nftFilterArr} setNftFilter={setNftFilter} />}
              onVisibleChange={() => {
                console.log('haha')
                //TODO
              }}
            >
              <div className="active">{nftFilterArr[nftFilter]}</div>
            </ArrowDropdown>
          </WRAPPER>
          <REFRESH>
            <img src="/img/assets/refreshButton.png" alt="refresh" />
          </REFRESH>
          <Toggle $mode={isSol} onClick={toggleSol}>
            <div />
          </Toggle>
        </>
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
