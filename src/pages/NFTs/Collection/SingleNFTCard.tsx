/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, FC, useEffect } from 'react'
import { useConnectionConfig, useNFTAggregator, useNFTDetails } from '../../../context'
import { GradientText } from '../adminPage/components/UpcomingMints'
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'
import { HoverOnNFT } from './CollectionV2'
import { INFTAsk, INFTBid, INFTGeneralData } from '../../../types/nft_details'
import { fetchSingleNFT } from '../../../api/NFTs'
import { getParsedAccountByMint, StringPublicKey } from '../../../web3'
import axios from 'axios'
import { LoadingDiv } from './Card'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../constants'

export const SingleNFTCard: FC<{ item: any; index: number; addNftToBag: any; lastCardRef: any }> = ({
  item,
  index,
  addNftToBag,
  lastCardRef
}) => {
  const { setSelectedNFT } = useNFTAggregator()
  const [hover, setHover] = useState<boolean>(false)
  const nftId = item ? (item.nft_name.includes('#') ? item.nft_name.split('#')[1] : -1) : null
  const nftName = item ? item.nft_name.split('#')[0] : null
  const [localBids, setLocalBids] = useState<INFTBid[]>([])
  const [localAsk, setLocalAsk] = useState<INFTAsk>()
  const [localTotalLikes, setLocalTotalLikes] = useState<number>()
  const [localSingleNFT, setlocalSingleNFT] = useState(undefined)
  const [isLoadingBeforeRelocate, setIsLoadingBeforeRelocate] = useState<boolean>(false)
  const { setBids, setAsk, setTotalLikes, setNftMetadata, setGeneral } = useNFTDetails()
  const { connection } = useConnectionConfig()

  const setNFTDetailsBeforeLocate = async () => {
    await setBids(localBids)
    await setAsk(localAsk)
    await setTotalLikes(localTotalLikes)
    const res = await axios.get(localSingleNFT.metadata_url)
    const metaData = await res.data
    await setNftMetadata(metaData)
    const parsedAccounts = await getParsedAccountByMint({
      mintAddress: localSingleNFT.mint_address as StringPublicKey,
      connection: connection
    })

    const accountInfo = {
      token_account: parsedAccounts !== undefined ? parsedAccounts.pubkey : null,
      owner: parsedAccounts !== undefined ? parsedAccounts.owner : null
    }

    await setGeneral({ ...localSingleNFT, ...accountInfo })
    setIsLoadingBeforeRelocate(false)
    return true
  }

  const goToDetails = async (item): Promise<void> => {
    setIsLoadingBeforeRelocate(true)
    setHover(false)
    await setNFTDetailsBeforeLocate()
    setSelectedNFT(item)
  }

  useEffect(() => {
    if (item) {
      fetchSingleNFT(item.mint_address).then((res) => {
        if (res && res.status === 200) {
          res.data.data.length > 0 ? setlocalSingleNFT(res.data.data[0]) : setlocalSingleNFT(item)
          const nft: INFTGeneralData = res.data
          setLocalBids(nft.bids)
          setLocalAsk(nft.asks[0])
          setLocalTotalLikes(nft.total_likes)
        }
      })
    }

    return () => {
      setIsLoadingBeforeRelocate(false)
    }
  }, [item])

  return (
    <div className="gridItem" key={index} onClick={() => goToDetails(item)} ref={lastCardRef}>
      <div className="gridItemContainer" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        {hover && <HoverOnNFT item={item} addNftToBag={addNftToBag} />}
        {isLoadingBeforeRelocate && <LoadingDiv />}
        {item ? (
          <img className="nftImg" src={item.image_url} alt="nft" />
        ) : (
          <SkeletonCommon width="170px" height="170px" />
        )}
      </div>
      <div className="nftTextContainer">
        <div className="collectionId">
          {nftId !== -1 && (
            <div>
              {nftId ? '#' + nftId : <SkeletonCommon width="50px" height="20px" style={{ marginTop: 10 }} />}
            </div>
          )}
          {/* <img src="/img/assets/Aggregator/verifiedNFT.svg" /> */}
        </div>
        {item ? (
          <GradientText text={nftName} fontSize={15} fontWeight={600} />
        ) : (
          <SkeletonCommon width="100px" height="20px" style={{ marginTop: 10 }} />
        )}
        <div className="nftPrice">
          {localAsk ? parseFloat(localAsk.buyer_price) / LAMPORTS_PER_SOL_NUMBER : 'No Bids'}
          {item && <img src={`/img/crypto/SOL.svg`} alt={item?.currency} />}
        </div>
        <div className="apprisalPrice">
          {item && item.nftPrice}
          {item && <img src={`/img/assets/Aggregator/Tooltip.svg`} alt={item?.currency} />}
        </div>
      </div>
    </div>
  )
}