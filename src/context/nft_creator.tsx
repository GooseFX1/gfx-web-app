import { useWallet } from '@solana/wallet-adapter-react'
import { createContext, ReactNode, useContext, useState, FC, useEffect } from 'react'
import { ICreatorData } from '../types/nft_launchpad'

interface ICreatorConfig {
  isAllowed: boolean
  currentStep: number
  previousStep: Function
  nextStep: Function
  saveDataForStep: Function
  creatorData: ICreatorData
}

const NFTCreatorContext = createContext<ICreatorConfig>(null)
export const NFTCreatorProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isAllowed, setIsAllowed] = useState<boolean>(false)
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [creatorData, setCreatorData] = useState<ICreatorData>([null, null, null, null, null, null])

  const wallet = useWallet()

  useEffect(() => {
    if (wallet.connected) {
      //make api call here
      setIsAllowed(true)
    } else setIsAllowed(false)
  }, [wallet.publicKey, wallet.connected])

  const saveDataForStep = (data) => {
    let obj = {
      ...creatorData
    }
    obj[currentStep] = data
    setCreatorData(obj)
  }

  const previousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1)
  }

  return (
    <NFTCreatorContext.Provider
      value={{
        isAllowed: isAllowed,
        currentStep: currentStep,
        saveDataForStep: saveDataForStep,
        creatorData: creatorData,
        previousStep: previousStep,
        nextStep: nextStep
      }}
    >
      {children}
    </NFTCreatorContext.Provider>
  )
}

export const useNFTCreator = () => {
  const context = useContext(NFTCreatorContext)

  if (!context) {
    throw new Error('Missing NFT Creator context')
  }
  const { isAllowed, currentStep, saveDataForStep, creatorData, previousStep, nextStep } = context
  return { isAllowed, currentStep, saveDataForStep, creatorData, previousStep, nextStep }
}
