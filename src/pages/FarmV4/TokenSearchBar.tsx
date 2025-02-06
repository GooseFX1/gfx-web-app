import React, { useEffect, useRef, useState } from 'react'
import { Badge, Button, cn, Popover, PopoverAnchor, PopoverContent } from 'gfx-component-lib'
import SearchBar from '@/components/common/SearchBar'
import { IconWithFallback } from '@/components/common/IconWithFallback'
import { aborter, loadIconImage } from '@/utils'
import { InfiniteTokenList } from '@/pages/FarmV4/InfiniteTokenList'
import { tokenListAbortTokenGamma, useDarkMode, useGamma } from '@/context'
import { TOKEN_LIST_PAGE_SIZE } from '@/pages/FarmV4/constants'
import useFirstRender from '@/hooks/useFirstRender'
import useDebounce from '@/hooks/useDebounce'
import useBoolean from '@/hooks/useBoolean'
import { useWalletBalance } from '@/context/walletBalanceContext'

function TokenSearchBar({ poolType }: { poolType: string }) {
  const searchBarRef = useRef(null)
  const [tokenListSearchValue, setTokenListSearchValue] = useState('')
  const [focusOnSearch, setFocusOnSearch] = useBoolean(false)

  const isFirstRender = useFirstRender()
  const { debounce, abortDebounce } = useDebounce()

  const {publicKey} = useWalletBalance()
  const { mode } = useDarkMode()
  const {
    setTokenList,
    updateTokenList,
    isLoadingTokenList,
    selectedTokens,
    removeSelectedToken,
    addSelectedToken,
    hasSelectedToken,
    topBalancesWithTokenList,
    tokenList
  } = useGamma()

  useEffect(() => {
    if (isFirstRender) return
    console.log('farmTrigger')
    // faking search
    if (tokenListSearchValue.trim().length == 0) {
      aborter.abortSignal(tokenListAbortTokenGamma)
      setTokenList([])
      return
    }
    debounce(
      () =>
        updateTokenList(
          {
            page: 1,
            pageSize: TOKEN_LIST_PAGE_SIZE,
            tokenType: poolType.toLowerCase(),
            searchValue: tokenListSearchValue
          },
          false
        ),
      250
    )
    return () => {
      abortDebounce()
    }
  }, [tokenListSearchValue, poolType])

  const isExpandedSearchOpen = tokenListSearchValue.length > 0
  const tokenRenderList =
    tokenListSearchValue.length > 0 || poolType === 'primary' || !publicKey ? tokenList : topBalancesWithTokenList
  return (
    <Popover open={isExpandedSearchOpen || focusOnSearch}>
      <PopoverAnchor className={'w-[550px] mr-auto'} ref={searchBarRef}>
        <SearchBar
          onChange={(e) => setTokenListSearchValue(e?.target?.value)}
          onClear={() => setTokenListSearchValue('')}
          value={tokenListSearchValue}
          className={'flex-1 bg-white dark:bg-black-2'}
          onFocusCapture={setFocusOnSearch.on}
          onBlurCapture={setFocusOnSearch.off}
          isLoading={tokenListSearchValue.trim().length > 0 && isLoadingTokenList}
          additionalInputElementLeft={
            <div className={'inline-flex gap-2'}>
              {selectedTokens.map((token) => (
                <Badge
                  variant="default"
                  size={'lg'}
                  key={`main-search-${token.symbol}`}
                  className={`
                                 from-brand-secondaryGradient-primary/30
                                 to-brand-secondaryGradient-secondary/30 py-[2.5px] gap-1 before:z-0 
                                 `}
                >
                  <IconWithFallback
                    size={'sm'}
                    src={loadIconImage(token.logoURI, mode)}
                    className={'rounded-full'}
                    onClick={() => removeSelectedToken(token)}
                  />
                  <h5 className={'text-text-lightmode-primary dark:text-text-white'}>{token.symbol}</h5>
                  <IconWithFallback
                    className={`!w-[11px] !h-[11px] !min-w-[11px] !min-h-[11px] z-0 cursor-pointer`}
                    src={`/img/assets/close-${mode}.svg`}
                    onClick={() => {
                      removeSelectedToken(token)
                    }}
                  />
                </Badge>
              ))}
            </div>
          }
        />
      </PopoverAnchor>
      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onMouseDown={(e) => e.preventDefault()}
        style={{
          width: `${searchBarRef.current?.clientWidth ?? 600}px`
        }}
        align={'center'}
        side={'bottom'}
        avoidCollisions={false}
      >
        {tokenListSearchValue && tokenRenderList.length == 0 && !isLoadingTokenList ? (
          <div
            className={`mb-auto p-2
                  text-text-lightmode-tertiary dark:text-text-darkmode-tertiary
                  `}
          >
            No Tokens Found..
          </div>
        ) : null}
        {!tokenListSearchValue && focusOnSearch ? (
          <div
            className={`mb-auto p-2
                  text-text-lightmode-tertiary dark:text-text-darkmode-tertiary
                  `}
          >
            Search for token or paste mint address
          </div>
        ) : null}
        {tokenListSearchValue && (
          <InfiniteTokenList
            useRenderListLength={tokenListSearchValue.trim().length > 0}
            tokenRenderList={tokenRenderList}
            onTokenSelect={(t) => {
              setTokenListSearchValue('')
              addSelectedToken(t)
            }}
            checkDisabled={(t) => hasSelectedToken(t) || isLoadingTokenList || selectedTokens.length == 2}
            RenderAs={({ children, className, ...props }) => (
              <Button
                {...props}
                fullWidth
                variant={''}
                className={cn(
                  `p-1.5 text-start rounded-[3px] h-auto
                       hover:bg-background-lightmode-primary hover:dark:bg-background-darkmode-primary
                      `,
                  className
                )}
              >
                {children}
              </Button>
            )}
          />
        )}
      </PopoverContent>
    </Popover>
  )
}

export default TokenSearchBar
