import {
  createContext,
  ReactNode,
  useContext,
  useState,
  FC,
  SetStateAction,
  Dispatch,
  useEffect,
  useMemo
} from 'react'
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IActiveOrdersAMM, IMEActiveOrdersAMM } from '../types/nft_collections'
import { useNFTCollections } from './nft_collections'
import { fetchAllActiveOrdersAMM, fetchMEActiveOrdersAMM } from '../api/NFTs'
import { LAMPORTS_PER_SOL_NUMBER } from '../constants'
import { getNFTMetadata } from '../web3/nfts/utils'
import { getMetadata } from '../web3'
import { useConnectionConfig } from './settings'

interface ICurrentHighest {
  price: number
  marketPlace: 'Tensor' | 'Magiceden' | ''
  pool?: string
}
interface INFTAMMConfig {
  activeOrders: IActiveOrdersAMM[]
  setActiveOrders: Dispatch<SetStateAction<IActiveOrdersAMM[]>>
  currentHighest: ICurrentHighest
  setCurrentHighest: Dispatch<SetStateAction<ICurrentHighest>>
  selectedNFT: any
  setSelectedNFT: Dispatch<SetStateAction<any>>
  instantSellClicked: boolean
  setInstantSell: Dispatch<SetStateAction<boolean>>
  collectionWideBid: boolean
  setCollectionWideBid: Dispatch<SetStateAction<boolean>>
  selectedBidFromOrders: IActiveOrdersAMM
  setSelectedBidFromOrders: Dispatch<SetStateAction<IActiveOrdersAMM>>
  refreshAPI: number
  setRefreshAPI: Dispatch<SetStateAction<number>>
  myBidsAMMChecked: boolean
  setMyBidsAMM: Dispatch<SetStateAction<boolean>>
  collectionRoyalty: number
}

const NFTAMMContext = createContext<INFTAMMConfig>(null)
export const NFTAMMProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [activeOrders, setActiveOrders] = useState<IActiveOrdersAMM[]>([])
  const [currentHighest, setCurrentHighest] = useState<ICurrentHighest>({ price: 0, marketPlace: '' })
  const [selectedNFT, setSelectedNFT] = useState<any>()
  const [instantSellClicked, setInstantSell] = useState<boolean>(false)
  const [collectionWideBid, setCollectionWideBid] = useState<boolean>(false)
  const [selectedBidFromOrders, setSelectedBidFromOrders] = useState<IActiveOrdersAMM>()
  const [refreshAPI, setRefreshAPI] = useState<number>(0)
  const [myBidsAMMChecked, setMyBidsAMM] = useState<boolean>(false)
  const { singleCollection, fixedPriceWithinCollection } = useNFTCollections()
  const [tensorHighest, setTensorHighest] = useState<IActiveOrdersAMM>()
  const [magicedenHighest, setMagicedenHighest] = useState<IMEActiveOrdersAMM>()
  const slug = useMemo(() => singleCollection && singleCollection[0].slug_tensor, [singleCollection])
  const [collectionRoyalty, setRoyalty] = useState<number>(0)
  const { connection } = useConnectionConfig()

  const refMintAddress = useMemo(() => {
    try {
      return fixedPriceWithinCollection?.nft_data[0]?.mint_address
    } catch (error) {
      return null
    }
  }, [fixedPriceWithinCollection, singleCollection])

  useEffect(() => {
    ;(async () => {
      if (refMintAddress) {
        const onChainData = await getNFTMetadata(await getMetadata(refMintAddress), connection)
        setRoyalty(onChainData.data.sellerFeeBasisPoints / (100 * 100)) // directly multiply
      }
    })()
  }, [refMintAddress, singleCollection])

  useEffect(() => {
    ;(async () => {
      if (refMintAddress) {
        const activeOrderME = await fetchMEActiveOrdersAMM(refMintAddress)
        const sortedOrders = activeOrderME.sort(
          (a, b) => parseFloat(b?.buyPriceTaker) - parseFloat(a?.buyPriceTaker)
        )
        setMagicedenHighest(sortedOrders[0])
      }
    })()
  }, [refMintAddress, singleCollection])

  useEffect(() => {
    if (tensorHighest && magicedenHighest) {
      // 0.015 is platform fee
      // what tensor does is it does not consider royalty while displaying sell price
      const tensorPrice =
        (parseFloat(tensorHighest.sellNowPrice) / LAMPORTS_PER_SOL_NUMBER) * (1 - collectionRoyalty - 0.015)

      const magicedenPrice = (magicedenHighest.buyPriceTaker / LAMPORTS_PER_SOL_NUMBER) * (1 - 0.015)

      const highest: ICurrentHighest =
        tensorPrice > magicedenPrice
          ? { price: tensorPrice, marketPlace: 'Tensor' }
          : { price: magicedenPrice, marketPlace: 'Magiceden', pool: magicedenHighest.poolKey }

      setCurrentHighest(highest)
    }
  }, [tensorHighest, magicedenHighest])

  useEffect(() => {
    ;(async () => {
      if (!slug) return

      try {
        const activeOrder = await fetchAllActiveOrdersAMM(slug)
        const sortedOrders = activeOrder.sort(
          (a, b) => parseFloat(b?.sellNowPrice ?? 0) - parseFloat(a?.sellNowPrice ?? 0)
        )
        setActiveOrders(sortedOrders)
        setTensorHighest(sortedOrders[0])
      } catch (error) {
        console.log(error)
      }
    })()
  }, [slug, refreshAPI])

  return (
    <NFTAMMContext.Provider
      value={{
        activeOrders: activeOrders,
        setActiveOrders: setActiveOrders,
        currentHighest: currentHighest,
        setCurrentHighest: setCurrentHighest,
        selectedNFT: selectedNFT,
        setSelectedNFT: setSelectedNFT,
        instantSellClicked: instantSellClicked,
        setInstantSell: setInstantSell,
        collectionWideBid: collectionWideBid,
        setCollectionWideBid: setCollectionWideBid,
        selectedBidFromOrders: selectedBidFromOrders,
        setSelectedBidFromOrders: setSelectedBidFromOrders,
        refreshAPI: refreshAPI,
        setRefreshAPI: setRefreshAPI,
        myBidsAMMChecked: myBidsAMMChecked,
        setMyBidsAMM: setMyBidsAMM,
        collectionRoyalty: collectionRoyalty
      }}
    >
      {children}
    </NFTAMMContext.Provider>
  )
}

export const useNFTAMMContext = (): INFTAMMConfig => {
  const context = useContext(NFTAMMContext)

  if (!context) {
    throw new Error('Missing NFT Aggregator context')
  }

  return context
}
