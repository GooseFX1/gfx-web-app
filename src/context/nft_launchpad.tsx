import React, { FC, useState, ReactNode, createContext, useContext, useMemo, useEffect } from 'react'
import { fetchAllNFTLaunchpadData } from '../api/NFTLaunchpad'
import { useParams } from 'react-router-dom'
import { IProjectParams } from '../types/nft_launchpad'
import { fetchSelectedNFTLPData } from '../api/NFTLaunchpad/actions'
import { useWallet } from '@solana/wallet-adapter-react'
import * as anchor from '@project-serum/anchor'
import { useConnectionConfig } from './settings'
import { PublicKey } from '@solana/web3.js'
import { getAtaForMint, toDate } from '../pages/NFTs/launchpad/candyMachine/utils'
import { getCollectionPDA, getWhitelistInfo } from '../pages/NFTs/launchpad/candyMachine/candyMachine'
import { nonceStatus } from '../types/nft_launchpad'
import { MAGIC_HAT_PROGRAM_V2_ID } from '../pages/NFTs/launchpad/customSC/config'
import idl_m from '../pages/NFTs/launchpad/customSC/magic_hat.json'

interface INFTProjectConfig {
  collectionId: number
  collectionName: string
  coverUrl: string
  items: number
  price: 100
  startsOn: string
  status: string
  ended?: boolean | string
  currency: string
  whitelist: string
}
interface INFTLaunchpadConfig {
  upcomoingNFTProjects: INFTProjectConfig[]
  endedNFTProjects: INFTProjectConfig[]
  liveNFTProjects: INFTProjectConfig[]
  dataFetched: boolean
}

interface NFTLPSelected {
  selectedProject: any
  candyMachineState: any
  candyMachine: any
  cndyValues: any
}

const NFTLaunchpadContext = createContext<INFTLaunchpadConfig | null>(null)
export const NFTLaunchpadProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [upcomoingNFTProjects, setUpcomingNFTProjects] = useState([])
  const [endedNFTProjects, setEndedNFTProjects] = useState([])
  const [liveNFTProjects, setLiveNFTProjects] = useState([])
  const [dataFetched, setDataFetched] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const launchpadData: INFTProjectConfig[] = (await fetchAllNFTLaunchpadData()).data.data
        const upcomingProject = [],
          endedProject = [],
          liveProject = []
        for (let i = 0; i < launchpadData.length; i++) {
          if (
            (parseFloat(launchpadData[i].whitelist) && parseFloat(launchpadData[i].whitelist) > Date.now()) ||
            (!parseFloat(launchpadData[i].whitelist) && parseFloat(launchpadData[i].startsOn) > Date.now())
          )
            upcomingProject.push(launchpadData[i])
          if (parseFloat(launchpadData[i].startsOn) < Date.now() && launchpadData[i].ended)
            endedProject.push(launchpadData[i])
          else liveProject.push(launchpadData[i])
        }

        setEndedNFTProjects(endedProject)
        setUpcomingNFTProjects(upcomingProject)
        setLiveNFTProjects(liveProject)
        setDataFetched(true)
      } catch (err) {
        console.log(err)
      }
    })()
  }, [])

  return (
    <NFTLaunchpadContext.Provider
      value={{
        upcomoingNFTProjects: upcomoingNFTProjects,
        endedNFTProjects: endedNFTProjects,
        liveNFTProjects: liveNFTProjects,
        dataFetched: dataFetched
      }}
    >
      {children}
    </NFTLaunchpadContext.Provider>
  )
}
export const useNFTLaunchpad = (): INFTLaunchpadConfig => {
  const context = useContext(NFTLaunchpadContext)

  if (!context) {
    throw new Error('Missing NFT Launchpad  Selected context')
  }
  const { upcomoingNFTProjects, liveNFTProjects, endedNFTProjects, dataFetched } = context
  return { upcomoingNFTProjects, liveNFTProjects, endedNFTProjects, dataFetched }
}

// Selected Context
interface Tiers {
  name: string
  time: string
  number: string
  limit: string
  contractTier: string
  price: string | null
}

interface ISelectedProject {
  candyMachine: string
  collectionId: number
  collectionName: string
  coverUrl: string
  currency: string
  items: number
  itemsMinted: any
  price: number
  roadmap: any
  startsOn: string
  ended: boolean
  team: any
  urlName: any
  nonceStatus: nonceStatus
  whitelist: string
  tiers: Tiers[] | null
}

interface CandyMachineState {
  authority: anchor.web3.PublicKey
  itemsAvailable: number
  itemsRedeemed: number
  itemsRemaining: number
  treasury: anchor.web3.PublicKey
  tokenMint: null | anchor.web3.PublicKey
  isSoldOut: boolean
  isActive: boolean
  isPresale: boolean
  isWhitelistOnly: boolean
  goLiveDate: anchor.BN
  price: anchor.BN
  gatekeeper: null | {
    expireOnUse: boolean
    gatekeeperNetwork: anchor.web3.PublicKey
  }
  endSettings: null | {
    number: anchor.BN
    endSettingType: any
  }
  whitelistMintSettings: null | {
    mode: any
    mint: anchor.web3.PublicKey
    presale: boolean
    discountPrice: null | anchor.BN
  }
  hiddenSettings: null | {
    name: string
    uri: string
    hash: Uint8Array
  }
  retainAuthority: boolean
}

interface CandyMachineAccount {
  id: anchor.web3.PublicKey
  program: anchor.Program
  state: CandyMachineState
}
const getCandyMachineState = async (
  anchorWallet: anchor.Wallet,
  candyMachineId: anchor.web3.PublicKey,
  connection: anchor.web3.Connection
): Promise<CandyMachineAccount> => {
  const provider = new anchor.Provider(connection, anchorWallet, {
    preflightCommitment: 'processed'
  })

  const idl: any = idl_m
  const program = new anchor.Program(idl, MAGIC_HAT_PROGRAM_V2_ID, provider)

  const state: any = await program.account.magicHat.fetch(candyMachineId)
  const itemsAvailable = state.data.itemsAvailable.toNumber()
  const itemsRedeemed = state.itemsRedeemed.toNumber()
  const itemsRemaining = itemsAvailable - itemsRedeemed

  return {
    id: candyMachineId,
    program,
    state: {
      authority: state.authority,
      itemsAvailable,
      itemsRedeemed,
      itemsRemaining,
      isSoldOut: itemsRemaining === 0,
      isActive: false,
      isPresale: false,
      isWhitelistOnly: false,
      goLiveDate: state.data.goLiveDate,
      treasury: state.wallet,
      tokenMint: state.tokenMint,
      gatekeeper: state.data.gatekeeper,
      endSettings: state.data.endSettings,
      whitelistMintSettings: state.data.whitelistMintSettings,
      hiddenSettings: state.data.hiddenSettings,
      price: state.data.price,
      retainAuthority: state.data.retainAuthority
    }
  }
}

const NFTLPSelectedContext = createContext(null)
export const NFTLPSelectedProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedProject, setSelectedProject] = useState<ISelectedProject>(null)
  const [candyMachineState, setCandyMachineState] = useState<CandyMachineState>(null)
  const [candyMachine, setCandyMachine] = useState<CandyMachineAccount>(null)
  const [cmValues, setCmValues] = useState(null)
  const params = useParams<IProjectParams>()
  const { wallet, connected, signAllTransactions, signTransaction } = useWallet()
  const { connection } = useConnectionConfig()

  const anchorWallet = useMemo(() => {
    if (!wallet || !wallet?.adapter?.publicKey || signAllTransactions || signTransaction) {
      return
    }

    return {
      publicKey: wallet?.adapter?.publicKey,
      signAllTransactions,
      signTransaction
    } as anchor.Wallet
  }, [wallet])

  const refreshCandyMachineState = async (candyMachine) => {
    if (!anchorWallet || (!candyMachine && (!selectedProject || !selectedProject.candyMachine))) {
      setCandyMachine(null)
      setCandyMachineState(null)
      return
    }
    try {
      const id = candyMachine ? candyMachine : selectedProject.candyMachine
      const candyM = await getCandyMachineState(anchorWallet, new PublicKey(id), connection)
      console.log('candy Machine is: ', candyM)
      setCandyMachine(candyM)
      setCandyMachineState(candyM?.state)
      const cndyState = {}
      if (candyM) {
        try {
          const cndy = candyM
          let active = cndy?.state.goLiveDate?.toNumber() < new Date().getTime() / 1000
          let presale = false
          let isWLUser = false
          let userPrice = cndy.state.price

          // whitelist mint?
          if (cndy?.state.whitelistMintSettings) {
            // is it a presale mint?
            if (
              cndy.state.whitelistMintSettings.presale &&
              (!cndy.state.goLiveDate || cndy.state.goLiveDate.toNumber() > new Date().getTime() / 1000)
            ) {
              presale = true
            }
            // is there a discount?
            if (cndy.state.whitelistMintSettings.discountPrice) {
              cndyState['discountPrice'] = cndy.state.whitelistMintSettings.discountPrice
              userPrice = cndy.state.whitelistMintSettings.discountPrice
            } else {
              cndyState['discountPrice'] = null
              if (!cndy.state.whitelistMintSettings.presale) {
                cndy.state.isWhitelistOnly = true
              }
            }
            // retrieves the whitelist token
            const mint = new anchor.web3.PublicKey(cndy.state.whitelistMintSettings.mint)
            const token = (await getAtaForMint(mint, anchorWallet.publicKey))[0]
            try {
              const balance = await connection.getTokenAccountBalance(token)
              isWLUser = parseInt(balance.value.amount) > 0
              // only whitelist the user if the balance > 0
              cndyState['isWhiteListUser'] = isWLUser

              //  if (cndy.state.isWhitelistOnly) {
              //    active = isWLUser && (presale || active)
              //  }
            } catch (e) {
              cndyState['isWhiteListUser'] = false
              // no whitelist user, no mint
              //  if (cndy.state.isWhitelistOnly) {
              //    active = false
              //  }
              //console.log('There was a problem fetching whitelist token balance')
            }
          }
          userPrice = isWLUser ? userPrice : cndy.state.price

          if (cndy?.state.tokenMint) {
            // retrieves the SPL token
            const mint = new anchor.web3.PublicKey(cndy.state.tokenMint)
            const token = (await getAtaForMint(mint, anchorWallet.publicKey))[0]
            try {
              const balance = await connection.getTokenAccountBalance(token)

              const valid = new anchor.BN(balance.value.amount).gte(userPrice)

              // only allow user to mint if token balance >  the user if the balance > 0
              cndyState['validBalance'] = valid
              active = active && valid
            } catch (e) {
              cndyState['validBalance'] = false
              active = false
              // no whitelist user, no mint
              console.log(e)
            }
          } else {
            const balance = new anchor.BN(await connection.getBalance(anchorWallet.publicKey))
            const valid = balance.gte(userPrice)
            cndyState['validBalance'] = valid
            active = active && valid
          }
          // datetime to stop the mint?
          if (cndy?.state.endSettings?.endSettingType.date) {
            cndyState['endDate'] = toDate(cndy.state.endSettings.number)

            if (cndy.state.endSettings.number.toNumber() < new Date().getTime() / 1000) {
              active = false
            }
          } else {
            cndyState['endDate'] = null
          }
          // amount to stop the mint?
          if (cndy?.state.endSettings?.endSettingType.amount) {
            const limit = Math.min(cndy.state.endSettings.number.toNumber(), cndy.state.itemsAvailable)
            if (cndy.state.itemsRedeemed < limit) {
              cndyState['itemsRemaining'] = limit - cndy.state.itemsRedeemed
            } else {
              cndyState['itemsRemaining'] = 0
              cndy.state.isSoldOut = true
            }
          } else {
            cndyState['itemsRemaining'] = cndy.state.itemsRemaining
          }
          cndyState['itemsRedeemed'] = cndy.state.itemsRedeemed
          cndyState['itemsAvailable'] = cndy.state.itemsAvailable
          if (cndy.state.isSoldOut) {
            active = false
          }

          const [collectionPDA] = await getCollectionPDA(new PublicKey(id))
          const collectionPDAAccount = await connection.getAccountInfo(collectionPDA)

          cndyState['isActive'] = cndy.state.isActive = active
          cndyState['isPreSale'] = cndy.state.isPresale = presale

          const txnEstimate =
            892 +
            (!!collectionPDAAccount && cndy.state.retainAuthority ? 182 : 0) +
            (cndy.state.tokenMint ? 66 : 0) +
            (cndy.state.whitelistMintSettings ? 34 : 0) +
            (cndy.state.whitelistMintSettings?.mode?.burnEveryTime ? 34 : 0) +
            (cndy.state.gatekeeper ? 33 : 0) +
            (cndy.state.gatekeeper?.expireOnUse ? 66 : 0)
          cndyState['needTxnSplit'] = txnEstimate > 1230

          //
          let publicMint = true

          let tiers = selectedProject?.tiers,
            activeTierInfo = null,
            activeTierIndex = undefined
          for (let i = 0; i < tiers.length; i++) {
            const item = tiers[i]
            if (new Date().getTime() > parseFloat(item.time)) {
              activeTierInfo = { ...item, status: 'live' }
              activeTierIndex = i
              publicMint = false
            }
            if (new Date().getTime() > parseFloat(selectedProject?.startsOn)) {
              activeTierInfo = null
              publicMint = true
              activeTierIndex = null
              break
            }
          }
          if (activeTierIndex || activeTierIndex === 0) {
            tiers = tiers.map((item, index) => {
              if (index < activeTierIndex) return { ...item, status: 'ended' }
              else if (index === activeTierIndex) return { ...item, status: 'live' }
              else return { ...item, status: 'upcoming' }
            })
          } else if (activeTierIndex === undefined) {
            tiers = tiers.map((item) => ({ ...item, status: 'upcoming' }))
          } else {
            tiers = tiers.map((item) => ({ ...item, status: 'ended' }))
          }
          cndyState['publicMint'] = publicMint
          cndyState['activeTierInfo'] = activeTierInfo

          cndyState['tiers'] = tiers

          const whitelistInfo = await getWhitelistInfo(candyM.program, wallet?.adapter?.publicKey)
          cndyState['whitelistInfo'] = whitelistInfo
          cndyState['isWhiteListUser'] = false

          let walletTier = null
          //eslint-disable-next-line
          for (let i in whitelistInfo?.whitelistType) {
            walletTier = i
          }
          if (
            whitelistInfo &&
            whitelistInfo.numberOfWhitelistSpotsPerUser.toString() > 0 &&
            activeTierInfo &&
            walletTier === activeTierInfo.contractTier
          ) {
            cndyState['isWhiteListUser'] = true
          }
          //
          setCmValues(cndyState)
        } catch (e) {
          console.log(e)
        }
      }
    } catch (e) {
      console.log(e)
      setCandyMachine(null)
      setCandyMachineState(null)
    }
  }

  useEffect(() => {
    ;(async () => {
      const data = await fetchSelectedNFTLPData(params.urlName)
      refreshCandyMachineState(data.data.candyMachine)
      setSelectedProject(data.data)
      //}, 100000)
    })()
  }, [])

  useEffect(() => {
    if (selectedProject && selectedProject.candyMachine) {
      refreshCandyMachineState(null)
    }
  }, [connected, selectedProject])

  useEffect(() => {
    ;(function loop() {
      setTimeout(() => {
        if (selectedProject && selectedProject.candyMachine && connected) {
          refreshCandyMachineState(null)
        }
        loop()
      }, 20000)
    })()
  }, [selectedProject, connected, wallet?.adapter?.publicKey])

  return (
    <NFTLPSelectedContext.Provider
      value={{
        selectedProject: selectedProject,
        candyMachineState: candyMachineState,
        candyMachine: candyMachine,
        cndyValues: cmValues
      }}
    >
      {children}
    </NFTLPSelectedContext.Provider>
  )
}
export const useNFTLPSelected = (): NFTLPSelected => {
  const context = useContext(NFTLPSelectedContext)

  if (!context) {
    throw new Error('Missing NFT Launchpad context')
  }
  const { selectedProject, candyMachineState, candyMachine, cndyValues } = context
  return { selectedProject, candyMachineState, candyMachine, cndyValues }
}

interface IUSDCToggle {
  isUSDC: boolean
  setIsUSDC: any
}

const USDCToggleContext = createContext<IUSDCToggle | null>(null)

export const USDCToggleProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isUSDC, setIsUSDCToggle] = useState<boolean>(false)

  const setIsUSDC = (value) => {
    setIsUSDCToggle(value)
  }

  return (
    <USDCToggleContext.Provider
      value={{
        isUSDC,
        setIsUSDC
      }}
    >
      {children}
    </USDCToggleContext.Provider>
  )
}

export const useUSDCToggle = (): IUSDCToggle => {
  const context = useContext(USDCToggleContext)
  if (!context) {
    throw new Error('Missing NFTLP context')
  }

  const { isUSDC, setIsUSDC } = context
  return { isUSDC, setIsUSDC }
}
