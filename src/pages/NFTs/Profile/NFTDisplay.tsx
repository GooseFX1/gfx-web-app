/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef, FC } from 'react'
import axios from 'axios'
import { Row, Col } from 'antd'
import { checkMobile } from '../../../utils'
import { ParsedAccount } from '../../../web3'
import { Card } from '../Collection/Card'
import NoContent from './NoContent'
import { SearchBar, Loader, ArrowDropdown } from '../../../components'
import { useNavCollapse, useNFTProfile } from '../../../context'
import { StyledTabContent } from './TabContent.styled'
import { ISingleNFT } from '../../../types/nft_details.d'
import debounce from 'lodash.debounce'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { CenteredDiv } from '../../../styles'
import { GRID_CONTAINER, NFT_COLLECTIONS_GRID } from '../Collection/CollectionV2.styles'
import Loading from '../Home/Loading'
import NFTLoading from '../Home/NFTLoading'

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
  }
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
      setTimeout(() => {
        if (search.length > 0) {
          const filteredData = collectedItems.filter(({ nft_name }) =>
            nft_name.toLowerCase().includes(search.trim().toLowerCase())
          )
          setFilteredCollectedItems(filteredData)
        } else {
          setFilteredCollectedItems(collectedItems)
        }
      }, 400)
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
  const gridType = filteredCollectedItems?.length > 7 ? '1fr' : '210px'
  return (
    <NFT_COLLECTIONS_GRID gridType={gridType}>
      {filteredCollectedItems === undefined ? (
        <>
          <NFTLoading />
        </>
      ) : filteredCollectedItems.length === 0 ? (
        <NoContent type={props.type} />
      ) : (
        <div className="gridContainerProfile" tw="h-[75vh]">
          {filteredCollectedItems.map((nft: ISingleNFT, index: number) => (
            <Card singleNFT={nft} key={index} />
          ))}
        </div>
      )}
    </NFT_COLLECTIONS_GRID>
  )
}

export default React.memo(NFTDisplay)
