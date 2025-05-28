import React, { createContext } from 'react'

type ITokenFeed = {

}

const TokenFeedContext = createContext<ITokenFeed | null>(null)

function TokenFeedProvider({children}: {children?: React.ReactNode | React.ReactNode[]}): JSX.Element {

  return (
    <TokenFeedContext.Provider value={{

    }}>
      {children}
    </TokenFeedContext.Provider>
  )
}

export default TokenFeedProvider