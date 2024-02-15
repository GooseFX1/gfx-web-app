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
