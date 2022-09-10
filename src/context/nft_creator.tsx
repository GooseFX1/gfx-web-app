import { useWallet } from '@solana/wallet-adapter-react'
import { createContext, ReactNode, useContext, useState, FC, useEffect } from 'react'
import { ICreatorData } from '../types/nft_launchpad'
import { isCreatorAllowed, saveData } from '../api/NFTLaunchpad/actions'

interface ICreatorConfig {
  isAllowed: boolean
  currentStep: number
  previousStep: () => void
  nextStep: () => void
  saveDataForStep: (d: any) => void
  creatorData: ICreatorData
  submit: () => Promise<boolean>
}

const NFTCreatorContext = createContext<ICreatorConfig>(null)
export const NFTCreatorProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isAllowed, setIsAllowed] = useState<boolean>(false)
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [creatorData, setCreatorData] = useState<ICreatorData>([null, null, null, null, null, null])

  const wallet = useWallet()

  useEffect(() => {
    if (wallet.connected) {
      ;(async () => {
        const response = await isCreatorAllowed(wallet.publicKey.toBase58())
        console.log(response)
        setIsAllowed(response.allowed)
        setCreatorData(response.data)
      })()
    } else setIsAllowed(false)
  }, [wallet.publicKey, wallet.connected])

  const saveDataForStep = (data) => {
    const obj = {
      ...creatorData
    }
    obj[currentStep] = data
    setCreatorData(obj)
  }

  const submit = async () => {
    let data = creatorData
    const walletAddress = wallet.publicKey.toBase58()
    data = { ...data, ...{ walletAddress: walletAddress, adminApproved: null } }
    try {
      const response = await saveData(data)
      return response.data.status !== 'failed'
    } catch (e) {
      console.log(e)
      return false
    }
  }
  useEffect(() => {
    if (currentStep === 6) {
      submit()
    }
  }, [currentStep])

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
        nextStep: nextStep,
        submit: submit
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
  const { isAllowed, currentStep, saveDataForStep, creatorData, previousStep, nextStep, submit } = context
  return { isAllowed, currentStep, saveDataForStep, creatorData, previousStep, nextStep, submit }
}
