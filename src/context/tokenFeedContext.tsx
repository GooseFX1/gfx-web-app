import React, { createContext, useMemo, useState } from 'react'
import { useConnectionConfig } from '@/context/settings'
import { toast } from 'sonner'
import { cn, IntemediaryToast, IntemediaryToastHeading } from 'gfx-component-lib'

type TokenFeedColumns = {
  social: boolean
  new: boolean
  migrated: boolean
  soon: boolean
}

interface ITokenFeed {
  enabledColumns: TokenFeedColumns
  enableColumn: (column: keyof TokenFeedColumns, enabled: boolean) => void
  isUserSettingsCustom: boolean
  totalColumnsEnabled: number
  maxColumnsReached: boolean
  quickBuyAmount: string
  updateQuickBuyAmount: (amount: string) => void
}

const TokenFeedContext = createContext<ITokenFeed | null>(null)

function TokenFeedProvider({ children }: { children?: React.ReactNode | React.ReactNode[] }): JSX.Element {
  const { userCache, updateUserCache } = useConnectionConfig()
  const [enabledColumns, setEnabledColumns] = useState(
    userCache?.tokenFeed?.enabledColumns ?? {
      social: true,
      new: true,
      migrated: true,
      soon: false
    }
  )
  const [quickBuyAmount, setQuickBuyAmount] = useState<string>(userCache?.tokenFeed?.quickBuyAmount ?? '')

  const maxColumnsReached = useMemo(()=>{
    const totalColumnsEnabled = Object.keys(enabledColumns).filter((key) => {
      if (key == 'social') return false
      return enabledColumns[key as keyof TokenFeedColumns]
    }).length
    return totalColumnsEnabled >=3
  },[enabledColumns])

  const { isUserSettingsCustom, totalColumnsEnabled } = useMemo(() => {
    const keys = Object.values(userCache.tokenFeed?.enabledColumns ?? {})

    return {
      isUserSettingsCustom: keys.some((value) => value !== true),
      totalColumnsEnabled: keys.filter((value) => value).length
    }
  }, [userCache.tokenFeed])
  const enableColumn = (column: keyof TokenFeedColumns, enabled: boolean) => {
    setEnabledColumns((prev) => {
      const curr = { ...prev }
      curr[column] = enabled

      const totalColumnsEnabled = Object.keys(curr).filter((key) => {
        if (key == 'social') return false
        return curr[key as keyof TokenFeedColumns]
      }).length
      if (totalColumnsEnabled < 2) {
        toast(
          <IntemediaryToast className={cn(`w-[290px]`)}>
            <IntemediaryToastHeading stage={'error'}>Error!</IntemediaryToastHeading>
            <p>Atleast two columns must be enabled for tokens!</p>
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

  const updateQuickBuyAmount = (amount: string) => {
    setQuickBuyAmount(amount)
    updateUserCache({
      ...userCache,
      tokenFeed: {
        ...userCache.tokenFeed,
        quickBuyAmount: amount
      }
    })
  }
  return (
    <TokenFeedContext.Provider
      value={{
        enabledColumns,
        enableColumn,
        isUserSettingsCustom,
        totalColumnsEnabled,
        maxColumnsReached,
        quickBuyAmount,
        updateQuickBuyAmount
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
