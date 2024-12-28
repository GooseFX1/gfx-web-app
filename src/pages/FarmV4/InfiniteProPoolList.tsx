import { useGamma } from '@/context'
import React, { FC, HTMLAttributes, useEffect, useRef } from 'react'
import InfiniteLoader from 'react-window-infinite-loader'
import { FixedSizeList } from 'react-window'
import { POOL_LIST_PAGE_SIZE } from './constants'
import { FarmRowLoader } from './FarmRow'
import { CSSProperties } from 'styled-components'

type InfiniteProPoolListProps<T> = {
  render: (item: T, index: number) => JSX.Element
  itemPadding?: number
} & HTMLAttributes<HTMLDivElement>

const InfiniteProPoolList: FC<InfiniteProPoolListProps<unknown>> = ({
  render,
  itemPadding: ITEM_PADDING = 8
}): JSX.Element => {
  const {
    filteredPools: items,
    currentSort,
    poolsHasMoreData,
    updatePools,
    poolPage,
    isLoadingPools,
    totalPoolCount
  } = useGamma()

  const itemCount = totalPoolCount

  const infiniteLoaderRef = useRef(null)
  const hasMountedRef = useRef(false)

  const isItemLoaded = (index) => !!items[index]

  // Each time the sort prop changed we called the method resetloadMoreItemsCache to clear the cache
  useEffect(() => {
    // We only need to reset cached items when sort order changes.
    // This effect will run on mount too; there's no need to reset in that case.
    if (hasMountedRef.current) {
      if (infiniteLoaderRef.current) {
        infiniteLoaderRef.current.resetloadMoreItemsCache()
      }
    }
    hasMountedRef.current = true
  }, [currentSort])

  const loadMoreItems = () => {
    if (isLoadingPools) return
    updatePools({
      page: poolPage + 1,
      pageSize: POOL_LIST_PAGE_SIZE
    })
  }

  // Render an item or a loading indicator.
  const Item = ({ index, style }: { index: number; style: CSSProperties }) => {
    let content
    if (!isItemLoaded(index)) {
      content = poolsHasMoreData ? <FarmRowLoader /> : null
    } else {
      content = render(items[index], index)
    }

    return <div style={style}>{content}</div>
  }

  const windowHeight = Math.min(10, totalPoolCount) * 60

  return (
    <InfiniteLoader isItemLoaded={isItemLoaded} itemCount={itemCount} loadMoreItems={loadMoreItems}
    threshold={3}
    >
      {({ onItemsRendered, ref }) => (
        <FixedSizeList
          height={windowHeight}
          itemSize={60 + ITEM_PADDING}
          className="List"
          itemCount={itemCount}
          onItemsRendered={onItemsRendered}
          ref={ref}
        >
          {Item}
        </FixedSizeList>
      )}
    </InfiniteLoader>
  )
}

export default InfiniteProPoolList
