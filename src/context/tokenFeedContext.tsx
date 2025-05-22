import React, { createContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { INTERVALS } from '@/utils/time'
import { useHistory } from 'react-router-dom'
import { ROUTES } from '@/Router'

interface ITokenFeed {
  isFeatureEnabled: boolean
}

const TokenFeedContext = createContext<ITokenFeed | null>(null)

function TokenFeedProvider({children}: {children?: React.ReactNode | React.ReactNode[]}): JSX.Element {
  const history = useHistory()
  const isFeatureEnabledQuery = useQuery({
    queryKey: ['feature-flags', 'token-feed'],
    queryFn: async () => {
      // staging/development
      if (import.meta.env.MODE != 'production') return true
      // TODO: add API check - if feature disabled route back to gamma
      history.push({
        pathname: ROUTES.GAMMA
      })
      return false
    },
    onError: () =>{
      if (!history.location.pathname.includes(ROUTES.GAMMA)) {
        history.push({
          pathname: ROUTES.GAMMA
        })
      }
    },
    placeholderData: false,
    keepPreviousData: true,
    staleTime: INTERVALS.MINUTE
  })

  return (
    <TokenFeedContext.Provider value={{
      isFeatureEnabled: isFeatureEnabledQuery.data,
    }}>
      {children}
    </TokenFeedContext.Provider>
  )
}

export default TokenFeedProvider