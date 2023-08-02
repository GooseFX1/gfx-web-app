import { PublicKey } from '@solana/web3.js'
import { createContext, FC, ReactNode, useContext, useState } from 'react'
import { useConnectionConfig } from './settings'
import { reverseLookup, getAllDomains, getFavoriteDomain } from '@bonfida/spl-name-service'
import { useEffect } from 'react'
import { httpClient } from '../api'
import { GET_LEADERBOARD_DATA } from '../pages/TradeV3/perps/perpsConstants'
export interface User {
  id: number
  address: string
  boost: number
  loyalty: number
  pnl: number
  dailyPoints: string
  weeklyPoints: string
  domainName?: string
}

const StatsContext = createContext<any | null>(null)

export const StatsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { connection } = useConnectionConfig()
  const [users, setUsers] = useState<User[]>([])
  const [toShowFlag, setToShowFlag] = useState<boolean>(false)

  async function getUsers(): Promise<User[]> {
    try {
      const res: {
        data: {
          data: User[]
        }
      } = await httpClient('api-services').post(`${GET_LEADERBOARD_DATA}`, {
        devnet: true
      })
      return res.data.data
    } catch (e) {
      return []
    }
  }

  useEffect(() => {
    ;(async () => {
      const users = await getUsers()
      setUsers(users)
    })()
  }, [])

  useEffect(() => {
    if (users.length && !toShowFlag) {
      setToShowFlag(true)
      getDomainNameOfUser()
    }
  }, [users])

  const getDomainNameOfUser = async () => {
    let userFavouriteDomain
    for (let i = 0; i < users.length; i++) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { domain, reverse } = await getFavoriteDomain(connection, new PublicKey(users[i].address))
        userFavouriteDomain = reverse
        if (reverse) {
          users[i] = { ...users[i], domainName: reverse }
          setUsers([...users, users[i]])
        }
      } catch (e) {
        userFavouriteDomain = null
        console.log('No favourite domain of user', e)
      }
      try {
        if (!userFavouriteDomain) {
          const allDomainsOfUser = await getAllDomains(connection, new PublicKey(users[i].address))
          if (allDomainsOfUser && allDomainsOfUser.length) {
            const domainName = await reverseLookup(connection, allDomainsOfUser[0])
            users[i] = { ...users[i], domainName: domainName }
            setUsers([...users, users[i]])
          }
        }
      } catch (e) {
        console.log('No domain exists for user', e)
      }
    }
  }

  return (
    <StatsContext.Provider
      value={{
        users
      }}
    >
      {children}
    </StatsContext.Provider>
  )
}

export const useStats = (): any => {
  const context = useContext(StatsContext)
  if (!context) {
    throw new Error('Missing Stats context')
  }

  return {
    users: context.users
  }
}
