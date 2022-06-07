import { customClient } from '../../api'
import apiClient from '../../api'
import { NFT_LAUNCHPAD_API_ENDPOINTS, NFT_LAUNCHPAD_API_BASE } from '../NFTLaunchpad/constants'
var axios = require('axios')

const BASE_URL = 'https://fc2c-144-48-38-142.ngrok.io'

export const fetchAllNFTLaunchpadData = async () => {
  try {
    const res = await customClient(BASE_URL).get(`${NFT_LAUNCHPAD_API_ENDPOINTS.GET_ALL_LAUNCHES}`)
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
      url: 'https://fc2c-144-48-38-142.ngrok.io/nft-launchpad/getOneLaunch',
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
