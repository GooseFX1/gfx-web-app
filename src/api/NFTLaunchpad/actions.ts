import { customClient } from '../../api'
import apiClient from '../../api'
import { NFT_LAUNCHPAD_API_ENDPOINTS, NFT_LAUNCHPAD_API_BASE } from '../NFTLaunchpad/constants'
var axios = require('axios')

const BASE_URL = 'https://ca45-103-108-117-198.ngrok.io'

export const fetchAllNFTLaunchpadData = async () => {
  try {
    const res = await customClient(BASE_URL).get(`${NFT_LAUNCHPAD_API_ENDPOINTS.GET_ALL_LAUNCHES}`)
    return res
  } catch (err) {
    return err
  }
}
export const fetchSelectedNFTLPData = async (collectionId: number) => {
  try {
    var data = JSON.stringify({
      collectionId: 1012
    })
    var config = {
      method: 'post',
      url: 'https://ca45-103-108-117-198.ngrok.io/nft-launchpad/getOneLaunch',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    }

    // const res = await customClient(BASE_URL, 1012)
    // .post(`${NFT_LAUNCHPAD_API_ENDPOINTS.GET_SELECTED_LAUNCH}`)
    // console.log(res);
    let result = axios(config).then((response) => response.data)
    return result
  } catch (err) {
    return err
  }
}
