import React, { useEffect, useRef } from 'react'
import InfiniteLoader from 'react-window-infinite-loader'
import { FixedSizeList } from 'react-window'
import TokenFeedCard from '@/pages/TokenFeed/TokenFeedCard'
import { UserTokenFeedFilterConfig } from '@/types/app_params'
import { clamp } from '@/utils'

function InfiniteTokenFeedList({
  tokenList,
  currentFilters
                               }: {
  // TODO: Define the type for tokenList
  tokenList: any[]
  currentFilters: UserTokenFeedFilterConfig
}) {
  const infiniteLoaderRef = useRef(null)
  const hasMountedRef = useRef(false)

  useEffect(() => {
    if (hasMountedRef.current) {
      if (infiniteLoaderRef.current) {
        infiniteLoaderRef.current.resetloadMoreItemsCache()
      }
    }
    hasMountedRef.current = true
  }, [tokenList])
  const itemCount = tokenList.length + 1
  const Item = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    if (index >= tokenList.length) {
      return (
        <div style={style} className="flex items-center justify-center h-14">
          <span>Loading more tokens...</span>
        </div>
      )
    }
    const token = tokenList[index]
    return (
      <div style={style}>
        <TokenFeedCard token={token} currentFilters={currentFilters} />
      </div>
    )
  }
  return (
    <InfiniteLoader
      isItemLoaded={(index) => index < tokenList.length}
      itemCount={itemCount}
      loadMoreItems={() => {
        // TODO: Implement the logic to load more items here
        console.log("Load more items triggered")
      }}
      threshold={1}
      ref={infiniteLoaderRef}
    >
      {({ onItemsRendered, ref }) => (
        <FixedSizeList
          className={'mt-2'}
          itemCount={itemCount}
          onItemsRendered={onItemsRendered}
          ref={ref}
          height={clamp(tokenList.length * 105, 105 * 5, screen.height - 300)}
          itemSize={105}
          overscanCount={20}
        >
          {Item}
        </FixedSizeList>
      )}
    </InfiniteLoader>
  )
}

export default InfiniteTokenFeedList