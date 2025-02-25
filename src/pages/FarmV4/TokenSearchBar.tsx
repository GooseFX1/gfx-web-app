import React, { useRef, useCallback, useState } from 'react'
import { Badge, Button, cn, Popover, PopoverAnchor, PopoverContent } from 'gfx-component-lib'
import SearchBar from '@/components/common/SearchBar'
import { IconWithFallback } from '@/components/common/IconWithFallback'
import { loadIconImage } from '@/utils'
import { InfiniteTokenList } from '@/pages/FarmV4/InfiniteTokenList'
import { TokenListToken, useDarkMode, useGamma } from '@/context'
import useBoolean from '@/hooks/useBoolean'
import { POOL_TYPE } from './constants'
import useTokensQuery from '@/queries/useTokensQuery'

function TokenSearchBar() {
  const searchBarRef = useRef(null)
  const [focusOnSearch, setFocusOnSearch] = useBoolean(false)
  const [searchValue, setSearchValue] = useState('')

  const { mode } = useDarkMode()
  const {
    selectedTokens,
    removeSelectedToken,
    addSelectedToken,
    hasSelectedToken,
    setCurrentPoolType,
  } = useGamma()

  const query = useTokensQuery({ searchValue, poolType: 'all' })
  const checkAndSetPoolType = useCallback(
    (t: TokenListToken) => {
      // current selections are in selectedTokens - t is the token that is being added and visible on next render
      const isHyperInSelectedTokens = selectedTokens.some((token) => !token.isPrimary)
      // if the token being added is not primary or there is already a hyper token in the selected tokens
      if (isHyperInSelectedTokens || !t.isPrimary) {
        setCurrentPoolType(POOL_TYPE.hyper)
      } else {
        setCurrentPoolType(POOL_TYPE.primary)
      }
    },
    [selectedTokens, setCurrentPoolType]
  )

  const tokenList = query.data?.allPages ?? [];

  return (
    <Popover open={focusOnSearch}>
      <PopoverAnchor className={'w-[550px] mr-auto'} ref={searchBarRef}>
        <SearchBar
          onChange={(e) => setSearchValue(e?.target?.value)}
          onClear={() => setSearchValue('')}
          value={searchValue}
          className={'flex-1 bg-white dark:bg-black-2'}
          onFocusCapture={setFocusOnSearch.on}
          onBlurCapture={setFocusOnSearch.off}
          isLoading={searchValue.trim().length > 0 && query.isFetching}
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
        {searchValue && tokenList.length == 0 && !query.isFetching ? (
          <div
            className={`mb-auto p-2
                  text-text-lightmode-tertiary dark:text-text-darkmode-tertiary
                  `}
          >
            No Tokens Found..
          </div>
        ) : null}
        {!searchValue && focusOnSearch ? (
          <div
            className={`mb-auto p-2
                  text-text-lightmode-tertiary dark:text-text-darkmode-tertiary
                  `}
          >
            Search for token or paste mint address
          </div>
        ) : null}
        {searchValue && (
          <InfiniteTokenList
            tokenList={tokenList}
            isLoading={query.isFetching}
            fetchNextPage={query.fetchNextPage}
            maxTokensReached={query.data.maxTokensReached}
            onTokenSelect={(t) => {
              setSearchValue('')
              addSelectedToken(t)
              checkAndSetPoolType(t)
            }}
            checkDisabled={(t) => hasSelectedToken(t) || query.isFetching || selectedTokens.length == 2}
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
