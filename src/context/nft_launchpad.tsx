import React, { FC, useState, ReactNode, createContext, useContext, Dispatch, SetStateAction, useEffect } from 'react'
import { fetchAllNFTLaunchpadData } from '../api/NFTLaunchpad'

interface INFTProjectConfig {
  collectionId: number
  collectionName: string
  coverUrl: string
  items: 4444
  price: 100
  startsOn: string
  status: string
  currency: string
}
interface INFTLaunchpadConfig {
  upcomoingNFTProjects: INFTProjectConfig[]
  endedNFTProjects: INFTProjectConfig[]
  liveNFTProjects: INFTProjectConfig[]
}

const NFTLaunchpadContext = createContext<INFTLaunchpadConfig | null>(null)
export const NFTLaunchpadProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [upcomoingNFTProjects, setUpcomingNFTProjects] = useState([])
  const [endedNFTProjects, setEndedNFTProjects] = useState([])
  const [liveNFTProjects, setLiveNFTProjects] = useState([])

  useEffect(() => {
    ;(async () => {
      const launchpadData: INFTProjectConfig[] = (await fetchAllNFTLaunchpadData()).data.data
      const upcomingProject = [],
        endedProject = [],
        liveProject = []
      for (let i = 0; i < launchpadData.length; i++) {
        if (launchpadData[i].status === 'live') liveProject.push(launchpadData[i])
        if (launchpadData[i].status === 'upcoming') upcomingProject.push(launchpadData[i])
        if (launchpadData[i].status === 'ended') endedProject.push(launchpadData[i])
      }
      setEndedNFTProjects(endedNFTProjects)
      setUpcomingNFTProjects(upcomingProject)
      setLiveNFTProjects(liveProject)
    })()
  }, [])

  return (
    <NFTLaunchpadContext.Provider
      value={{
        upcomoingNFTProjects: upcomoingNFTProjects,
        endedNFTProjects: endedNFTProjects,
        liveNFTProjects: liveNFTProjects
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
  const { upcomoingNFTProjects, liveNFTProjects, endedNFTProjects } = context
  return { upcomoingNFTProjects, liveNFTProjects, endedNFTProjects }
}

const NFTLPSelectedContext = createContext(null)
export const NFTLPSelectedProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedProject, setSelectedProject] = useState()

  useEffect(() => {
    ;(async () => {
      const launchpadData = (await fetchAllNFTLaunchpadData()).data.data
      setSelectedProject(launchpadData)
      console.log(launchpadData)
    })()
  }, [])

  return (
    <NFTLPSelectedContext.Provider
      value={{
        selectedProject: selectedProject
      }}
    >
      {children}
    </NFTLPSelectedContext.Provider>
  )
}
export const useNFTLPSelected = () => {
  const context = useContext(NFTLPSelectedContext)

  if (!context) {
    throw new Error('Missing NFT Launchpad context')
  }
  const { selectedProject } = context
  return { selectedProject }
}
