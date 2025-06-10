import React, { createContext, useMemo, useState } from 'react'
import { useConnectionConfig } from '@/context/settings'
import { toast } from 'sonner'
import { cn, IntemediaryToast, IntemediaryToastHeading } from 'gfx-component-lib'
import useTokenQuery from '@/queries/useTokenQuery'
import { TokenListToken } from '@/context/gamma'
import { UseQueryResult } from '@tanstack/react-query'
import { UserTokenFeedFilterConfig } from '@/types/app_params'

type TokenFeedColumns = {
  social: boolean
  new: boolean
  migrated: boolean
  soon: boolean
}
export type TokenFeedTokenColumn = Exclude<keyof TokenFeedColumns, 'social'>
const defaultTokenFeedFilters: Record<TokenFeedTokenColumn, UserTokenFeedFilterConfig> = {
  new: {
    age: {
      min: undefined,
      max: undefined
    },
    holders: {
      min: undefined,
      max: undefined
    },
    topHolders: {
      min: undefined,
      max: undefined
    },
    bondingCurveProgress: {
      min: undefined,
      max: undefined
    },
    marketCap: {
      min: undefined,
      max: undefined
    },
    volume: {
      min: undefined,
      max: undefined
    },
    enabledSocials: {
      x: true,
      website: true,
      telegram: true
    }
  },
  migrated: {
    age: {
      min: undefined,
      max: undefined
    },
    holders: {
      min: undefined,
      max: undefined
    },
    topHolders: {
      min: undefined,
      max: undefined
    },
    bondingCurveProgress: {
      min: undefined,
      max: undefined
    },
    marketCap: {
      min: undefined,
      max: undefined
    },
    volume: {
      min: undefined,
      max: undefined
    },
    enabledSocials: {
      x: true,
      website: true,
      telegram: true
    }
  },
  soon: {
    age: {
      min: undefined,
      max: undefined
    },
    holders: {
      min: undefined,
      max: undefined
    },
    topHolders: {
      min: undefined,
      max: undefined
    },
    bondingCurveProgress: {
      min: undefined,
      max: undefined
    },
    marketCap: {
      min: undefined,
      max: undefined
    },
    volume: {
      min: undefined,
      max: undefined
    },
    enabledSocials: {
      x: true,
      website: true,
      telegram: true
    }
  }
}

interface ITokenFeed {
  enabledColumns: TokenFeedColumns
  enableColumn: (column: keyof TokenFeedColumns, enabled: boolean) => void
  isUserSettingsCustom: boolean
  totalColumnsEnabled: number
  maxColumnsReached: boolean
  quickBuyAmount: string
  updateQuickBuyAmount: (amount: string) => void
  quickBuyTokenQuery: UseQueryResult<TokenListToken | null>
  updateQuickBuyToken: (token: TokenListToken) => void
  columnFilters: {
    new: UserTokenFeedFilterConfig
    migrated: UserTokenFeedFilterConfig
    soon: UserTokenFeedFilterConfig
  }
  updateColumnFilters: (column: TokenFeedTokenColumn, filters: UserTokenFeedFilterConfig) => void
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
  const quickBuyTokenQuery = useTokenQuery({
    address: userCache?.tokenFeed?.quickBuyToken ?? 'So11111111111111111111111111111111111111112'
  })
  const [columnFilters, setColumnFilters] = useState<{
    new: UserTokenFeedFilterConfig
    migrated: UserTokenFeedFilterConfig
    soon: UserTokenFeedFilterConfig
  }>(userCache.tokenFeed?.columnFilters ?? defaultTokenFeedFilters)

  const maxColumnsReached = useMemo(() => {
    const totalColumnsEnabled = Object.keys(enabledColumns).filter(
      (key) => enabledColumns[key as keyof TokenFeedColumns]
    ).length
    return totalColumnsEnabled >= 3
  }, [enabledColumns])

  const { isUserSettingsCustom, totalColumnsEnabled } = useMemo(
    () => ({
      isUserSettingsCustom:
        !enabledColumns.social || !enabledColumns.new || !enabledColumns.migrated || enabledColumns.soon,
      totalColumnsEnabled: Object.values(userCache.tokenFeed?.enabledColumns ?? {}).filter((value) => value).length
    }),
    [userCache.tokenFeed]
  )

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

  const updateQuickBuyToken = (token: TokenListToken) => {
    updateUserCache({
      ...userCache,
      tokenFeed: {
        ...userCache.tokenFeed,
        quickBuyToken: token.address
      }
    })
  }
  const updateColumnFilters = (
    column: Exclude<keyof TokenFeedColumns, 'social'>,
    filters: UserTokenFeedFilterConfig
  ) => {
    setColumnFilters((prev) => ({
      ...prev,
      [column]: filters
    }))
    updateUserCache({
      ...userCache,
      tokenFeed: {
        ...userCache.tokenFeed,
        columnFilters: {
          ...userCache.tokenFeed.columnFilters,
          [column]: filters
        }
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
        updateQuickBuyAmount,
        quickBuyTokenQuery,
        updateQuickBuyToken,
        columnFilters,
        updateColumnFilters
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
