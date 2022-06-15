import { customClient } from '../../api'
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
