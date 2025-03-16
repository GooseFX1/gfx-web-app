import { useGamma } from '@/context'
import React, { FC, HTMLAttributes, useEffect, useRef, useState } from 'react'
import InfiniteLoader from 'react-window-infinite-loader'
import { FixedSizeList } from 'react-window'
import { FarmRowLoaderText } from './FarmRow'
import { CSSProperties } from 'styled-components'

type InfiniteProPoolListScrollViewProps<T> = {
  render: (item: T, index: number) => JSX.Element
  itemPadding?: number
  items: T[]
  currentSort: string
  poolsHasMoreData: boolean
  fetchNextPage: () => void
  isLoadingPools: boolean
  totalPoolCount: number
} & HTMLAttributes<HTMLDivElement>

export const InfiniteProPoolScrollView: FC<InfiniteProPoolListScrollViewProps<unknown>> = ({
  render,
  itemPadding: ITEM_PADDING = 8,
  items,
  currentSort,
  poolsHasMoreData,
  fetchNextPage,
  isLoadingPools,
  totalPoolCount
}): JSX.Element => {
  const [showingLoader, setShowingLoader] = useState(false)

  const effectiveItemCount = items.length + (poolsHasMoreData ? 1 : 0)

  const infiniteLoaderRef = useRef(null)
  const hasMountedRef = useRef(false)

  const isItemLoaded = (index) => index < items.length || !poolsHasMoreData

  // Each time the sort prop changed we called the method resetloadMoreItemsCache to clear the cache
  useEffect(() => {
    // We only need to reset cached items when sort order changes.
    // This effect will run on mount too; there's no need to reset in that case.
    if (hasMountedRef.current) {
      if (infiniteLoaderRef.current) {
        infiniteLoaderRef.current.resetloadMoreItemsCache()
      }
      setShowingLoader(false)
    }
    hasMountedRef.current = true
  }, [currentSort])

  const loadMoreItems = () => {
    if (isLoadingPools) return
    setShowingLoader(true)
    fetchNextPage()
  }

  useEffect(() => {
    if (!isLoadingPools && showingLoader) {
      setShowingLoader(false)
    }
  }, [isLoadingPools, items.length])

  // Render an item or a loading indicator.
  const Item = ({ index, style }: { index: number; style: CSSProperties }) => {
    if (!isItemLoaded(index)) {
      if (isLoadingPools) {
        return (
          <div style={style}>
            <FarmRowLoaderText />
          </div>
        )
      }
      return null
    }

    if (index < items.length) {
      return <div style={style}>{render(items[index], index)}</div>
    }

    return <div style={style} />
  }

  const windowHeight = Math.min(10, effectiveItemCount) * 60 + Math.min(10, effectiveItemCount) * ITEM_PADDING

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={totalPoolCount}
      loadMoreItems={loadMoreItems}
      threshold={1}
      ref={infiniteLoaderRef}
    >
      {({ onItemsRendered, ref }) => (
        <FixedSizeList
          height={windowHeight}
          itemSize={60 + ITEM_PADDING}
          className="List"
          itemCount={effectiveItemCount}
          onItemsRendered={onItemsRendered}
          ref={ref}
        >
          {Item}
        </FixedSizeList>
      )}
    </InfiniteLoader>
  )
}

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
    isLoadingPools,
    totalPoolCount,
    poolsQuery
  } = useGamma()

  return (
    <InfiniteProPoolScrollView
      items={items}
      currentSort={currentSort}
      poolsHasMoreData={poolsHasMoreData}
      fetchNextPage={poolsQuery.fetchNextPage}
      isLoadingPools={isLoadingPools}
      totalPoolCount={totalPoolCount}
      render={render}
      itemPadding={ITEM_PADDING}
    />
  )
}

export default InfiniteProPoolList
