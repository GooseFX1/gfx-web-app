import { PublicKey } from '@solana/web3.js'
import { createContext, FC, ReactNode, useContext, useState } from 'react'
import { useConnectionConfig } from './settings'
import { reverseLookup, getAllDomains, getFavoriteDomain } from '@bonfida/spl-name-service'
import { useEffect } from 'react'
import { httpClient } from '../api'
import { GET_LEADERBOARD_DATA_V2 } from '../pages/TradeV3/perps/perpsConstants'

export interface User {
  contestPoints: number
  id: number
  address: string
  boost: number
  loyalty: number
  totalPoints?: number
  domainName?: string
}

interface IStatsConfig {
  users: User[]
  isContestActive: boolean
}

const StatsContext = createContext<IStatsConfig>(null)

export const StatsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { connection } = useConnectionConfig()
  const [users, setUsers] = useState<User[]>([])
  const [isContestActive, setIsContestActive] = useState<boolean>(false)
  const [toShowFlag, setToShowFlag] = useState<boolean>(false)

  async function getUsers(): Promise<any> {
    try {
      const res: {
        data: {
          data: User[]
        }
      } = await httpClient('api-services').get(`${GET_LEADERBOARD_DATA_V2}`)

      return res.data
    } catch (e) {
      return []
    }
  }

  useEffect(() => {
    ;(async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data: users, isContestActive } = await getUsers()
      setUsers(users)
      // just change this to isContestActive to enable contest
      setIsContestActive(false)
    })()
  }, [])

  useEffect(() => {
    if (users?.length && !toShowFlag) {
      setToShowFlag(true)
      getDomainNameOfUser()
    }
  }, [users])

  const getDomainNameOfUser = async () => {
    let userFavouriteDomain
    for (let i = 0; i < users.length; i++) {
      if (users[i].contestPoints > 0) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { domain, reverse } = await getFavoriteDomain(connection, new PublicKey(users[i].address))
          userFavouriteDomain = reverse
          if (reverse) {
            users[i] = { ...users[i], domainName: reverse }
            setUsers([...users])
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
              setUsers([...users])
            }
          }
        } catch (e) {
          console.log('No domain exists for user', e)
        }
      }
    }
  }

  return (
    <StatsContext.Provider
      value={{
        users,
        isContestActive
      }}
    >
      {children}
    </StatsContext.Provider>
  )
}

export const useStats = (): IStatsConfig => {
  const context = useContext(StatsContext)
  if (!context) {
    throw new Error('Missing Stats context')
  }

  return {
    users: context.users,
    isContestActive: context.isContestActive
  }
}
