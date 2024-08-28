import { customClient } from '../'
import { WEBAPP_CONFIG_URL, WEBAPP_CONFIG_ENDPOINTS } from './constants'

export const fetchIsUnderMaintenance = async (): Promise<boolean> => {
  try {
    const { data } = await customClient(WEBAPP_CONFIG_URL).get(WEBAPP_CONFIG_ENDPOINTS.MAINTENANCE)
    return data
  } catch (err) {
    console.error(err)
    return false
  }
}

export const fetchGlobalBanner = async (): Promise<string | null> => {
  try {
    const response = await await customClient(WEBAPP_CONFIG_URL).get(WEBAPP_CONFIG_ENDPOINTS.GLOBAL_BANNER)
    const data = await response.data
    return data
  } catch (error) {
    console.error('Failed to fetch global banner:', error)
    return null
  }
}
