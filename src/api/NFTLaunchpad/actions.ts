import { customClient } from '../../api'
import { ICreatorData } from '../../types/nft_launchpad'
import { NFT_LAUNCHPAD_API_ENDPOINTS } from '../NFTLaunchpad/constants'
var axios = require('axios')

export const fetchAllNFTLaunchpadData = async () => {
  try {
    const res = await customClient(NFT_LAUNCHPAD_API_ENDPOINTS.NFT_LAUNCHPAD_API_BASE).get(
      `${NFT_LAUNCHPAD_API_ENDPOINTS.GET_ALL_LAUNCHES}`
    )
    return res
  } catch (err) {
    return err
  }
}
export const fetchSelectedNFTLPData = async (urlName: string) => {
  try {
    var data = JSON.stringify({
      urlName: urlName
    })
    var config = {
      method: 'post',
      url: NFT_LAUNCHPAD_API_ENDPOINTS.NFT_LAUNCHPAD_API_BASE + NFT_LAUNCHPAD_API_ENDPOINTS.GET_SELECTED_LAUNCH,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    }

    let result = axios(config).then((response) => response.data)
    return result
  } catch (err) {
    return err
  }
}

export const isCreatorAllowed = async (walletAddress: string) => {
  try {
    let data = JSON.stringify({
        walletAddress: walletAddress
      }),
      config = {
        method: 'POST',
        //url: 'http://localhost:4000' + NFT_LAUNCHPAD_API_ENDPOINTS.IS_CREATOR_ALLOWED,
        url: NFT_LAUNCHPAD_API_ENDPOINTS.NFT_LAUNCHPAD_API_BASE + NFT_LAUNCHPAD_API_ENDPOINTS.IS_CREATOR_ALLOWED,
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      }
    let result = await axios(config)
    return result.data.allowed
  } catch (e) {
    return false
  }
}
export const isAdminAllowed = async (walletAddress: string) => {
  try {
    let data = JSON.stringify({
        walletAddress: walletAddress
      }),
      config = {
        method: 'POST',
        //url: PROD_URL + NFT_LAUNCHPAD_API_ENDPOINTS.IS_ADMIN_ALLOWED,
        url: NFT_LAUNCHPAD_API_ENDPOINTS.NFT_LAUNCHPAD_API_BASE + NFT_LAUNCHPAD_API_ENDPOINTS.IS_CREATOR_ALLOWED,
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      }
    let result = await axios(config)
    return result.data.allowed
  } catch (e) {
    return false
  }
}

export const uploadFiles = async (data) => {
  try {
    const { coverImage, zipUpload } = data
    //const url = 'http://localhost:4000' + NFT_LAUNCHPAD_API_ENDPOINTS.UPLOAD_FILES
    const url = NFT_LAUNCHPAD_API_ENDPOINTS.NFT_LAUNCHPAD_API_BASE + NFT_LAUNCHPAD_API_ENDPOINTS.UPLOAD_FILES
    let formData = new FormData()
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

export const saveData = async (data: ICreatorData) => {
  try {
    const url = 'http://localhost:4000' + NFT_LAUNCHPAD_API_ENDPOINTS.SAVE_DATA
    //const url = NFT_LAUNCHPAD_API_ENDPOINTS.NFT_LAUNCHPAD_API_BASE + NFT_LAUNCHPAD_API_ENDPOINTS.SAVE_DATA
    let dataToSend = JSON.stringify({
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

export const sendNonceTransaction = async (transaction, collectionId, walletAddress) => {
  try {
    //const url = 'http://localhost:4000' + NFT_LAUNCHPAD_API_ENDPOINTS.SAVE_TRANSACTION
    const url = NFT_LAUNCHPAD_API_ENDPOINTS.NFT_LAUNCHPAD_API_BASE + NFT_LAUNCHPAD_API_ENDPOINTS.SAVE_TRANSACTION
    let dataToSend = JSON.stringify({
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

export const approveProject = async (project: ICreatorData) => {
  try {
    //const url = PROD_URL + NFT_LAUNCHPAD_API_ENDPOINTS.APPROVE_PROJECT
    const url = NFT_LAUNCHPAD_API_ENDPOINTS.NFT_LAUNCHPAD_API_BASE + NFT_LAUNCHPAD_API_ENDPOINTS.APPROVE_PROJECT
    let dataToSend = JSON.stringify({
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
export const rejectProject = async (project: ICreatorData) => {
  try {
    //const url = PROD_URL + NFT_LAUNCHPAD_API_ENDPOINTS.REJECT_PROJECT
    const url = NFT_LAUNCHPAD_API_ENDPOINTS.NFT_LAUNCHPAD_API_BASE + NFT_LAUNCHPAD_API_ENDPOINTS.REJECT_PROJECT
    let dataToSend = JSON.stringify({
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

export const fetchCreatorProjects = async () => {
  try {
    //const res = await customClient(PROD_URL).get(`${NFT_LAUNCHPAD_API_ENDPOINTS.GET_CREATOR_PROJECT}`)
    const res = await customClient(NFT_LAUNCHPAD_API_ENDPOINTS.NFT_LAUNCHPAD_API_BASE).get(
      `${NFT_LAUNCHPAD_API_ENDPOINTS.GET_CREATOR_PROJECT}`
    )
    return res
  } catch (err) {
    return err
  }
}
