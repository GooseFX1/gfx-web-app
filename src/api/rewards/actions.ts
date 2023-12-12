import axios from 'axios'
import { localhost } from '../analytics'
import { GET_LATEST_CONTEST, GET_USER_RAFFLE_PRIZES } from '../../pages/TradeV3/perps/perpsConstants'
import { httpClient } from '..'

export const getUserRafflePrizes = async (wallet: string): Promise<any> => {
  if (!wallet) throw new Error('Wallet is required')
  try {
    const { data } = await axios.get(localhost + GET_USER_RAFFLE_PRIZES + `?wallet=` + wallet)
    return data.data
  } catch (err) {
    console.log(err)
    return err
  }
}

export const getRaffleDetails = async (): Promise<any> => {
  try {
    const { data } = await httpClient('api-services').get(GET_LATEST_CONTEST)
    return data
  } catch (err) {
    console.log(err)
    return err
  }
}
