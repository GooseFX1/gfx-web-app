/* eslint-disable @typescript-eslint/no-unused-vars */
import { useWallet } from '@solana/wallet-adapter-react'
import { createContext, ReactNode, useContext, useState, FC, useEffect, SetStateAction, Dispatch } from 'react'
import { ICreatorData } from '../types/nft_launchpad'

interface INFTAggConfig {
  sortingAsc: boolean
  nftCollections: any[]
  setSortAsc: any
  setSelectedNFT: Dispatch<SetStateAction<number>>
  selectedNFT: number
  currentStep?: number
  previousStep?: () => void
  nextStep?: () => void
  saveDataForStep?: (d: any) => void
  creatorData?: ICreatorData
  submit?: () => Promise<boolean>
}

interface NFTAgg {
  sortingAsc: boolean
  nftCollections: any[]
  setSortAsc: any
  currentStep?: number
  setSelectedNFT: Dispatch<SetStateAction<any>>
  selectedNFT: any
  saveDataForStep?: (d: any) => void
  creatorData?: ICreatorData
  previousStep?: () => void
  nextStep?: () => void
  submit?: () => Promise<boolean>
}

const NFTAggContext = createContext<INFTAggConfig>(null)
export const NFTAggregatorProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [sortingAsc, setSortAsc] = useState<boolean>(true)
  const [nftCollections, setCollections] = useState<any[]>([])
  const [selectedNFT, setSelectedNFT] = useState<number | undefined>()

  useEffect(() => {
    const collections = []
    for (let i = 0; i < 45; i++) {
      collections.push({
        key: i,
        name: 'Some random collection',
        nft_url: 'https://ca.slack-edge.com/T021XPFKRQV-U02R0LLQ8KX-1cd23a0ef132-512',
        collectionId: i + 1000,
        collectionName: 'DeGods',
        nftPrice: i * 50,
        currency: i < 10 ? 'USDC' : 'SOL'
      })
    }
    setCollections(collections)
  }, [])

  useEffect(() => {
    const sortedData = [...nftCollections]
    sortedData.sort((a, b) => (sortingAsc ? a.nftPrice - b.nftPrice : b.nftPrice - a.nftPrice))
    sortedData.length && setCollections(sortedData)
  }, [sortingAsc])

  return (
    <NFTAggContext.Provider
      value={{
        sortingAsc: sortingAsc,
        setSortAsc: setSortAsc,
        nftCollections: nftCollections,
        selectedNFT: selectedNFT,
        setSelectedNFT: setSelectedNFT
      }}
    >
      {children}
    </NFTAggContext.Provider>
  )
}

export const useNFTAggregator = (): NFTAgg => {
  const context = useContext(NFTAggContext)

  if (!context) {
    throw new Error('Missing NFT Aggregator context')
  }
  const { sortingAsc, setSortAsc, nftCollections, selectedNFT, setSelectedNFT } = context
  return { sortingAsc, setSortAsc, nftCollections, selectedNFT, setSelectedNFT }
}
