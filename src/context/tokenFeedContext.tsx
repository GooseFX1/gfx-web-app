import React, { createContext, useMemo, useState } from 'react'
import { useConnectionConfig } from '@/context/settings'
import { toast } from 'sonner'
import { cn, IntemediaryToast, IntemediaryToastHeading } from 'gfx-component-lib'

type TokenFeedColumns = {
  social: boolean
  new: boolean
  migrated: boolean
}

interface ITokenFeed {
  enabledColumns: TokenFeedColumns
  enableColumn: (column: keyof TokenFeedColumns, enabled: boolean) => void
  isUserSettingsCustom: boolean
}

const TokenFeedContext = createContext<ITokenFeed | null>(null)

function TokenFeedProvider({ children }: { children?: React.ReactNode | React.ReactNode[] }): JSX.Element {
  const { userCache, updateUserCache } = useConnectionConfig()
  const [enabledColumns, setEnabledColumns] = useState(
    userCache?.tokenFeed?.enabledColumns ?? {
      social: true,
      new: true,
      migrated: true
    }
  )
  const isUserSettingsCustom = useMemo(
    () => !Object.values(userCache.tokenFeed?.enabledColumns ?? {}).every((v) => v),
    [userCache.tokenFeed]
  )
  const enableColumn = (column: keyof TokenFeedColumns, enabled: boolean) => {
    setEnabledColumns((prev) => {
      const curr = { ...prev }
      curr[column] = enabled
      if (Object.values(curr).every((value) => !value)) {
        toast(
          <IntemediaryToast className={cn(`w-[290px]`)}>
            <IntemediaryToastHeading stage={'error'}>Error!</IntemediaryToastHeading>
            <p>Atleast one column must be enabled!</p>
          </IntemediaryToast>,
          {
            id: 'token-feed-error'
          }
        )
        return prev
      }
      updateUserCache({
        ...userCache,
        tokenFeed: {
          ...userCache.tokenFeed,
          enabledColumns: curr
        }
      })
      return curr
    })
  }
  return (
    <TokenFeedContext.Provider
      value={{
        enabledColumns,
        enableColumn,
        isUserSettingsCustom
      }}
    >
      {children}
    </TokenFeedContext.Provider>
  )
}

export default TokenFeedProvider

function useTokenFeed(): ITokenFeed {
  const context = React.useContext(TokenFeedContext)

  return context
}

export { useTokenFeed }
