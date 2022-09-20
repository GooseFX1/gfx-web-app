import { useWallet } from '@solana/wallet-adapter-react'
import { createContext, ReactNode, useContext, useState, FC, useEffect } from 'react'
import { ICreatorData } from '../types/nft_launchpad'
import { isAdminAllowed } from '../api/NFTLaunchpad/actions'

interface IAdminConfig {
  adminAllowed: boolean
  adminSelected: ICreatorData
  setAdminSelected: (a: ICreatorData | undefined) => void
  update: number
  setUpdate: Function //eslint-disable-line
}

const NFTAdminContext = createContext<IAdminConfig>(null)

export const NFTAdminProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [adminAllowed, setIsAllowed] = useState<boolean>(false)
  const [adminSelected, setAdminSelected] = useState<ICreatorData | undefined>()
  const [update, setUpdate] = useState<number>(0)

  const wallet = useWallet()

  useEffect(() => {
    if (wallet.connected) {
      ;(async () => {
        const response = await isAdminAllowed(wallet.publicKey.toBase58())
        setIsAllowed(response)
      })()
    } else setIsAllowed(false)
  }, [wallet.publicKey, wallet.connected])

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

export const useNFTAdmin = () => {
  const context = useContext(NFTAdminContext)

  if (!context) {
    throw new Error('Missing NFT Creator context')
  }
  const { adminAllowed, adminSelected, setAdminSelected, update, setUpdate } = context
  return { adminAllowed, adminSelected, setAdminSelected, update, setUpdate }
}
