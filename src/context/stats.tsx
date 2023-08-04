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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const userInfo: User[] = [
  {
    id: 1,
    address: '4FumzZ1cpb7aV9RxxeXBaupAPyi8jRfUMPq8Rjf5SoBX',
    boost: 3.3,
    loyalty: 50,
    pnl: 100,
    dailyPoints: '2,550',
    weeklyPoints: '15,875'
  },
  {
    id: 2,
    address: '7GsBFmdgW6aeZterpRydoDvfepDEvnRRWjobruPr3m8d',
    boost: 1.7,
    loyalty: 42,
    pnl: 90,
    dailyPoints: '2,550',
    weeklyPoints: '15,875'
  },
  {
    id: 3,
    address: '44hNj3muZdf1ZFZwHtYG8LBf1dERJAkiEsnbqJJCEq8M',
    boost: 9.8,
    loyalty: 89,
    pnl: -78,
    dailyPoints: '2,550',
    weeklyPoints: '15,875'
  },
  {
    id: 4,
    address: 'jKEC9LG16psxv27uUYVTR3em3vjKj5aiGuW9sYnuhq4',
    boost: 2,
    loyalty: 53,
    pnl: 80,
    dailyPoints: '2,550',
    weeklyPoints: '15,875'
  },
  {
    id: 5,
    address: 'FAKR1B3uf2tdxKJZdPkeBKnuTpBQVPsmKXZQ3pa1gpiC',
    boost: 1,
    loyalty: 70,
    dailyPoints: '2,550',
    pnl: 90,
    weeklyPoints: '15,875'
  },
  {
    id: 6,
    address: 'jKEC9LG16psxv27uUYVTR3em3vjKj5aiGuW9sYnuhq4',
    boost: 5,
    pnl: 12,
    loyalty: 100,
    dailyPoints: '2,550',
    weeklyPoints: '15,875'
  },
  {
    id: 7,
    address: '5tjhha8Gz7ZuX2ATEVgx5a2Kp11Yq8LmxgoPDYnApzTR',
    boost: 7.3,
    loyalty: 10,
    pnl: 80,
    dailyPoints: '2,550',
    weeklyPoints: '15,875'
  },
  {
    id: 8,
    address: 'jKEC9LG16psxv27uUYVTR3em3vjKj5aiGuW9sYnuhq4',
    boost: 1.3,
    loyalty: 90,
    pnl: -50,
    dailyPoints: '2,550',
    weeklyPoints: '15,875'
  }
]

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
