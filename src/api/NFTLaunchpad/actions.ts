import { customClient } from '../../api'
import { NFT_LAUNCHPAD_API_BASE, NFT_LAUNCHPAD_API_ENDPOINTS } from '../NFTLaunchpad/constants'
import axios from 'axios'

type legality = 'author' | 'permission' | 'no'
type currency = 'SOL' | 'USDC'
type vesting = false | [50, 25, 25] | [40, 30, 30]

export interface ICreatorData {
  0: null
  1: {
    legality: legality
    projectName: string
    collectionName: string
    collectionDescription: string
  } | null
  2: {
    items: number
    currency: currency
    price: number
    image: string
  } | null
  3: {
    vesting: vesting
    date: string
    time: string
  } | null
  4: {
    delayedReveal: boolean
    uploadedFiles: string
  } | null
  5: {
    discord: string
    website?: string
    twitter: string
    roadmap: { heading: string; subHeading: string }[] | null
    team: { name: string; twitterUsername: string; dp_url?: null | string }[] | [] | null
  } | null
}

export const fetchAllNFTLaunchpadData = async (): Promise<any> => {
  try {
    const res = await customClient(NFT_LAUNCHPAD_API_BASE).get(`${NFT_LAUNCHPAD_API_ENDPOINTS.GET_ALL_LAUNCHES}`)
    return res
  } catch (err) {
    return err
  }
}
export const fetchSelectedNFTLPData = async (urlName: string): Promise<any> => {
  try {
    const data = JSON.stringify({
      urlName: urlName
    })
    const config: { method: 'post'; url: string; headers: { 'Content-Type': string }; data: any } = {
      method: 'post',
      url: NFT_LAUNCHPAD_API_BASE + NFT_LAUNCHPAD_API_ENDPOINTS.GET_SELECTED_LAUNCH,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    }

    const result = axios(config).then((response) => response.data)
    return result
  } catch (err) {
    return err
  }
}

export const isCreatorAllowed = async (walletAddress: string): Promise<any> => {
  try {
    const data = JSON.stringify({
        walletAddress: walletAddress
      }),
      config: { method: 'post'; url: string; headers: { 'Content-Type': string }; data: any } = {
        method: 'post',

        url: NFT_LAUNCHPAD_API_BASE + NFT_LAUNCHPAD_API_ENDPOINTS.IS_CREATOR_ALLOWED,
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      },
      result = await axios(config)
    return result.data
  } catch (e) {
    return { isAllowed: false, data: null }
  }
}

export const isAdminAllowed = async (walletAddress: string): Promise<any> => {
  try {
    const data = JSON.stringify({
        walletAddress: walletAddress
      }),
      config: { method: 'post'; url: string; headers: { 'Content-Type': string }; data: any } = {
        method: 'post',

        url: NFT_LAUNCHPAD_API_BASE + NFT_LAUNCHPAD_API_ENDPOINTS.IS_ADMIN_ALLOWED,
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      },
      result = await axios(config)
    return result.data
  } catch (e) {
    return { allowed: false, data: null }
  }
}

export const uploadFiles = async (data: { coverImage: string; zipUpload: any }): Promise<any> => {
  try {
    const { coverImage, zipUpload } = data

    const url = NFT_LAUNCHPAD_API_BASE + NFT_LAUNCHPAD_API_ENDPOINTS.UPLOAD_FILES
    const formData = new FormData()
    formData.append('coverImage', coverImage)
    formData.append('zipUpload', zipUpload)
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (e) {
    return {
      status: 'failed'
    }
  }
}

export const saveData = async (data: ICreatorData): Promise<any> => {
  try {
    const url = NFT_LAUNCHPAD_API_BASE + NFT_LAUNCHPAD_API_ENDPOINTS.SAVE_DATA
    const dataToSend = JSON.stringify({
      data: data
    })
    const response = await axios({
      method: 'POST',
      url: url,
      data: dataToSend,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (e) {
    return {
      status: 'failed'
    }
  }
}

export const sendNonceTransaction = async (
  transaction: Buffer,
  collectionId: string,
  walletAddress: string
): Promise<any> => {
  try {
    const url = NFT_LAUNCHPAD_API_BASE + NFT_LAUNCHPAD_API_ENDPOINTS.SAVE_TRANSACTION
    const dataToSend = JSON.stringify({
      transaction: transaction,
      collectionId: collectionId,
      walletAddress: walletAddress
    })
    const response = await axios({
      method: 'POST',
      url: url,
      data: dataToSend,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (e) {
    console.log(e)
    return {
      status: 'failed'
    }
  }
}

export const approveProject = async (project: ICreatorData): Promise<any> => {
  try {
    const url = NFT_LAUNCHPAD_API_BASE + NFT_LAUNCHPAD_API_ENDPOINTS.APPROVE_PROJECT
    const dataToSend = JSON.stringify({
      projectData: project,
      walletAddress: project['walletAddress']
    })

    const response = await axios({
      method: 'POST',
      url: url,
      data: dataToSend,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return response.data
  } catch (e) {
    console.log(e)
    return {
      status: 'failed'
    }
  }
}
export const rejectProject = async (project: ICreatorData): Promise<any> => {
  try {
    const url = NFT_LAUNCHPAD_API_BASE + NFT_LAUNCHPAD_API_ENDPOINTS.REJECT_PROJECT
    const dataToSend = JSON.stringify({
      projectData: project
    })

    const response = await axios({
      method: 'POST',
      url: url,
      data: dataToSend,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return response.data
  } catch (e) {
    console.log(e)
    return {
      status: 'failed'
    }
  }
}

export const fetchCreatorProjects = async (): Promise<any> => {
  try {
    const res = await customClient(NFT_LAUNCHPAD_API_BASE).get(
      `${NFT_LAUNCHPAD_API_ENDPOINTS.GET_CREATOR_PROJECT}`
    )
    return res
  } catch (err) {
    return err
  }
}
