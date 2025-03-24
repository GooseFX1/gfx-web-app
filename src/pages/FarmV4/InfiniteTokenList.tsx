import InfiniteLoader from 'react-window-infinite-loader'
import { FixedSizeList } from 'react-window'
import { CSSProperties, ElementType, useEffect, useRef } from 'react'
import { Badge, Icon } from 'gfx-component-lib'
import { bigNumberFormatter, clamp, loadIconImage, numberFormatter, truncateAddress } from '@/utils'
import BigNumber from 'bignumber.js'
import { TokenListSkeleton } from '@/pages/FarmV4/Step2'
import { TokenListToken, useDarkMode } from '@/context'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { IconWithFallback } from '@/components/common/IconWithFallback'

export function InfiniteTokenList({
  tokenList,
  onTokenSelect,
  checkDisabled,
  RenderAs,
  maxTokensReached,
  isLoading,
  fetchNextPage
}: {
  tokenList: TokenListToken[]
  onTokenSelect: (token: TokenListToken) => void
  checkDisabled: (currToken: TokenListToken) => boolean
  RenderAs: ElementType
  maxTokensReached: boolean
  isLoading: boolean
  fetchNextPage: () => void
}) {
  const infiniteLoaderRef = useRef(null)
  const hasMountedRef = useRef(false)
  const { balance } = useWalletBalance()
  const { mode } = useDarkMode()

  useEffect(() => {
    if (hasMountedRef.current) {
      if (infiniteLoaderRef.current) {
        infiniteLoaderRef.current.resetloadMoreItemsCache()
      }
    }
    hasMountedRef.current = true
  }, [RenderAs, tokenList])
  const itemCount = !maxTokensReached ? tokenList.length + 1 : tokenList.length
  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadMoreItems = () => {
        if (isLoading || maxTokensReached) return
        fetchNextPage()
      }

  const isItemLoaded = (index) => maxTokensReached || index < tokenList.length

  const Item = ({ index, style }: { index: number; style: CSSProperties }) => {
    if (!isItemLoaded(index)) {
      if (isLoading) {
        return (
          <div style={style} className={`flex flex-col gap-2`}>
            <TokenListSkeleton RenderAs={RenderAs} />
            <TokenListSkeleton RenderAs={RenderAs} />
            <TokenListSkeleton RenderAs={RenderAs} />
            <TokenListSkeleton RenderAs={RenderAs} />
            <TokenListSkeleton RenderAs={RenderAs} />
            <TokenListSkeleton RenderAs={RenderAs} />
            <TokenListSkeleton RenderAs={RenderAs} />
          </div>
        )
      }
      return null
    }

    const curToken = tokenList[index]
    // this className on RenderAs is cursed binding - it is the render but also gets propagated to the RenderAs function
    // if a Button is used e.g FarmContainer
    return (
      <div style={style}>
        <RenderAs
          className={`cursor-pointer p-1.5 border-1 border-transparent flex 
                        hover:border-border-lightmode-secondary dark:hover:border-border-darkmode-secondary
                        `}
          onClick={() => onTokenSelect(curToken)}
          key={curToken?.address}
          disabled={checkDisabled(curToken)}
        >
          <div className={'flex w-full flex-1'}>
            <div className={`flex gap-2`}>
              <IconWithFallback
                className={`rounded-circle h-[24px] w-[24px] border my-auto
                                border-solid dark:border-black-4 border-grey-4`}
                src={loadIconImage(curToken?.logoURI, mode)}
              />
              <div>
                <p
                  className={`text-b2 font-bold 
                                  dark:text-text-darkmode-primary text-text-lightmode-primary`}
                >
                  {curToken?.symbol}
                </p>
                <span className={'inline-flex gap-1'}>
                  <span className={'inline-flex max-w-[118px] self-center'}>
                    <p
                      className={`text-b3 dark:text-text-darkmode-secondary 
                                      text-text-lightmode-secondary truncate font-semibold
                                      my-auto
                                `}
                    >
                      {curToken?.name}
                    </p>
                  </span>
                  <a
                    href={`https://solscan.io/account/${curToken?.address}`}
                    target="_blank"
                    rel="noreferrer"
                    className={'ml-auto'}
                  >
                    <Badge
                      variant="default"
                      size={'lg'}
                      className={'to-brand-secondaryGradient-secondary/50 gap-1 h-[18px]'}
                    >
                      <h6 className={''}>{truncateAddress(curToken?.address, 3)}</h6>
                      <Icon
                        src={`/img/assets/arrowcircle-${mode}.svg`}
                        className={'!h-[15px] !w-[15px] !min-h-[15px] !min-w-[15px]'}
                      />
                    </Badge>
                  </a>
                </span>
              </div>
            </div>
            <div className={'w-full ml-auto flex flex-col gap-1 items-end'}>
              <p
                className={`text-b2 font-bold dark:text-text-darkmode-primary 
                                text-text-lightmode-primary`}
              >
                {numberFormatter(balance[curToken?.address].tokenAmount.uiAmount)}
              </p>
              <p
                className={`text-b3 dark:text-text-darkmode-secondary text-text-lightmode-secondary 
                                truncate font-semibold
                                `}
              >
                $
                {bigNumberFormatter(
                  new BigNumber(
                    balance[curToken?.address].price != 0
                      ? balance[curToken?.address].value.toString()
                      : curToken?.price.toString()
                  )
                )}
              </p>
            </div>
          </div>
        </RenderAs>
      </div>
    )
  }

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
      threshold={1}
      ref={infiniteLoaderRef}
    >
      {({ onItemsRendered, ref }) => (
        <FixedSizeList
          className={'mt-2 infinite-token-list'}
          itemCount={itemCount}
          onItemsRendered={onItemsRendered}
          ref={ref}
          height={clamp(tokenList.length * 58, isLoading ? 58 * 5 : 0, 396)}
          itemSize={58}
        >
          {Item}
        </FixedSizeList>
      )}
    </InfiniteLoader>
  )
}
