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
import { IActiveOrdersAMM } from '../types/nft_collections'
import { useNFTCollections } from './nft_collections'
import { fetchAllActiveOrdersAMM } from '../api/NFTs'
import { LAMPORTS_PER_SOL_NUMBER } from '../constants'

interface INFTAMMConfig {
  activeOrders: IActiveOrdersAMM[]
  setActiveOrders: Dispatch<SetStateAction<IActiveOrdersAMM[]>>
  currentHighest: number
  setCurrentHighest: Dispatch<SetStateAction<number>>
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
}

const NFTAMMContext = createContext<INFTAMMConfig>(null)
export const NFTAMMProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [activeOrders, setActiveOrders] = useState<IActiveOrdersAMM[]>([])
  const [currentHighest, setCurrentHighest] = useState<number>(0)
  const [selectedNFT, setSelectedNFT] = useState<any>()
  const [instantSellClicked, setInstantSell] = useState<boolean>(false)
  const [collectionWideBid, setCollectionWideBid] = useState<boolean>(false)
  const [selectedBidFromOrders, setSelectedBidFromOrders] = useState<IActiveOrdersAMM>()
  const [refreshAPI, setRefreshAPI] = useState<number>(0)
  const { singleCollection } = useNFTCollections()
  const slug = useMemo(() => singleCollection && singleCollection[0].slug_tensor, [singleCollection])

  useEffect(() => {
    ;(async () => {
      if (!slug) return
      try {
        const activeOrder = await fetchAllActiveOrdersAMM(slug)
        const sortedOrders = activeOrder.sort((a, b) => parseFloat(b?.sellNowPrice) - parseFloat(a?.sellNowPrice))
        setActiveOrders(sortedOrders)
        setCurrentHighest(parseFloat(sortedOrders[0].sellNowPrice) / LAMPORTS_PER_SOL_NUMBER)
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
        setRefreshAPI: setRefreshAPI
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
