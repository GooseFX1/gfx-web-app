import { useWallet } from '@solana/wallet-adapter-react'
import { createContext, ReactNode, useContext, useState, FC, useEffect, Dispatch, SetStateAction } from 'react'
import { ICreatorData } from '../types/nft_launchpad'
import { isAdminAllowed } from '../api/NFTLaunchpad/actions'

interface IAdminConfig {
  adminAllowed: boolean
  adminSelected: ICreatorData
  setAdminSelected: (a: ICreatorData | undefined) => void
  update: number
  setUpdate: Dispatch<SetStateAction<number>>
}

interface NFTAdmin {
  adminAllowed: boolean
  adminSelected: ICreatorData
  setAdminSelected: (a: ICreatorData) => void
  update: number
  setUpdate: Dispatch<SetStateAction<number>>
}

const NFTAdminContext = createContext<IAdminConfig>(null)

export const NFTAdminProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { wallet, connected } = useWallet()
  const [adminAllowed, setIsAllowed] = useState<boolean>(false)
  const [adminSelected, setAdminSelected] = useState<ICreatorData | undefined>()
  const [update, setUpdate] = useState<number>(0)

  useEffect(() => {
    if (wallet && connected) {
      ;(async () => {
        const response = await isAdminAllowed(wallet.adapter?.publicKey.toBase58())
        setIsAllowed(response)
      })()
    } else {
      setIsAllowed(false)
    }
  }, [wallet?.adapter?.publicKey, connected])

  return (
    <NFTAdminContext.Provider
      value={{
        adminAllowed: adminAllowed,
        adminSelected: adminSelected,
        setAdminSelected: setAdminSelected,
        update: update,
        setUpdate: setUpdate
      }}
    >
      {children}
    </NFTAdminContext.Provider>
  )
}

export const useNFTAdmin = (): NFTAdmin => {
  const context = useContext(NFTAdminContext)

  if (!context) {
    throw new Error('Missing NFT Creator context')
  }
  return context
}
