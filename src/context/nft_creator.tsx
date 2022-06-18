import { useWallet } from '@solana/wallet-adapter-react'
import { createContext, ReactNode, useContext, useState, FC, useEffect } from 'react'

interface ICreatorConfig {
  isAllowed: boolean
  currentStep: number
  previousStep: Function
  nextStep: Function
  saveDataForStep: Function
  creatorData: ICreatorData
}

type legality = 'author' | 'permission' | 'no'
type currency = 'SOL' | 'USDC'
type vesting = false | [50, 25, 25] | [40, 40, 40]

interface ICreatorData {
  1: {
    legality: legality
    projectName: string
    collectionName: string
    collectionDescription: string
  }
  2: {
    numberOfItems: number
    currency: currency
    mintPrice: number
  }
  3: {
    vesting: vesting
    pickDate: Date
  }
  4: {
    preReveal: boolean
  }
  5: {
    discord: string
    website?: string
    twitter: string
    roadmap: [
      heading: {
        title: string
        year: string
      },
      subHeading: string
    ]
    team: [name: string, twitterUsername: string]
  }
}

const NFTCreatorContext = createContext<ICreatorConfig>(null)
export const NFTCreatorProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isAllowed, setIsAllowed] = useState<boolean>(false)
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [creatorData, setCreatorData] = useState<ICreatorData>(null)

  const wallet = useWallet()

  useEffect(() => {
    if (wallet.connected) {
      //make api call here
      setIsAllowed(true)
    } else setIsAllowed(false)
  }, [wallet.publicKey, wallet.connected])

  const saveDataForStep = () => {}

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
