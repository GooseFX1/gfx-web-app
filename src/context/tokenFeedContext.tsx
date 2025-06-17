import React, { createContext, useMemo, useState } from 'react'
import { useConnectionConfig } from '@/context/settings'
import { toast } from 'sonner'
import { cn, IntemediaryToast, IntemediaryToastHeading } from 'gfx-component-lib'
import useTokenQuery from '@/queries/useTokenQuery'
import { TokenListToken } from '@/context/gamma'
import { UseQueryResult } from '@tanstack/react-query'
import { UserTokenFeedFilterConfig } from '@/types/app_params'
import useBoolean, { UseBooleanSetter } from '@/hooks/useBoolean'

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
  updateQuickBuyToken: (tokenAddress: string) => void
  columnFilters: {
    new: UserTokenFeedFilterConfig
    migrated: UserTokenFeedFilterConfig
    soon: UserTokenFeedFilterConfig
  }
  updateColumnFilters: (column: TokenFeedTokenColumn, filters: UserTokenFeedFilterConfig) => void
  isTokenDepositOpen: boolean
  setIsTokenDepositOpen: UseBooleanSetter
  // TODO: update this type once we know what it is
  selectToken: (token: any) => void
  // TODO: update this type once we know what it is
  selectedToken?: any
  socialPanelTab: 'social' | 'performance'
  updateSocialPanelTab: (tab: 'social' | 'performance') => void
  mobileSelectedColumn: TokenFeedTokenColumn
  updateMobileSelectedColumn: (column: TokenFeedTokenColumn) => void
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
  const [socialPanelTab, setSocialPanelTab] = useState<'social' | 'performance'>(
    userCache?.tokenFeed?.socialPanelTab ?? 'social'
  )
  const quickBuyTokenQuery = useTokenQuery({
    address: userCache?.tokenFeed?.quickBuyToken ?? 'So11111111111111111111111111111111111111112'
  })
  const [columnFilters, setColumnFilters] = useState<{
    new: UserTokenFeedFilterConfig
    migrated: UserTokenFeedFilterConfig
    soon: UserTokenFeedFilterConfig
  }>(userCache.tokenFeed?.columnFilters ?? defaultTokenFeedFilters)
  const [isTokenDepositOpen, setIsTokenDepositOpen] = useBoolean(false)
  const [selectedToken, setSelectedToken] = useState<TokenListToken | undefined>(undefined)
  const [mobileSelectedColumn, setMobileSelectedColumn] = useState<TokenFeedTokenColumn>(
    userCache?.tokenFeed?.mobileSelectedColumn ?? 'new'
  )
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

  const updateQuickBuyToken = (token: string) => {
    updateUserCache({
      ...userCache,
      tokenFeed: {
        ...userCache.tokenFeed,
        quickBuyToken: token
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
  const selectToken = (token?: TokenListToken) => {
    console.log(!!token)
    setIsTokenDepositOpen.set(!!token)
    setSelectedToken(token)
  }
  const updateSocialPanelTab = (tab: 'social' | 'performance') => {
    setSocialPanelTab(tab)
    updateUserCache({
      ...userCache,
      tokenFeed: {
        ...userCache.tokenFeed,
        socialPanelTab: tab
      }
    })
  }

  const updateMobileSelectedColumn = (column: TokenFeedTokenColumn) => {
    setMobileSelectedColumn(column)
    updateUserCache({
      ...userCache,
      tokenFeed: {
        ...userCache.tokenFeed,
        mobileSelectedColumn: column
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
        updateColumnFilters,
        isTokenDepositOpen,
        setIsTokenDepositOpen,
        selectToken,
        selectedToken,
        socialPanelTab,
        updateSocialPanelTab,
        mobileSelectedColumn,
        updateMobileSelectedColumn
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
