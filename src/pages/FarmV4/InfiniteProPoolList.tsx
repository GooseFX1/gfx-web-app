import { useGamma } from '@/context'
import React, { FC, HTMLAttributes, useEffect, useRef, useState } from 'react'
import InfiniteLoader from 'react-window-infinite-loader'
import { FixedSizeList } from 'react-window'
import { POOL_LIST_PAGE_SIZE } from './constants'
import { FarmRowLoaderText } from './FarmRow'
import { CSSProperties } from 'styled-components'

type InfiniteProPoolListScrollViewProps<T> = {
  render: (item: T, index: number) => JSX.Element
  itemPadding?: number
  items: T[]
  currentSort: string
  poolsHasMoreData: boolean
  updatePools: (params: { page: number; pageSize: number }) => void
  poolPage: number
  isLoadingPools: boolean
  totalPoolCount: number
} & HTMLAttributes<HTMLDivElement>

export const InfiniteProPoolScrollView: FC<InfiniteProPoolListScrollViewProps<unknown>> = ({
  render,
  itemPadding: ITEM_PADDING = 8,
  items,
  currentSort,
  poolsHasMoreData,
  updatePools,
  poolPage,
  isLoadingPools,
  totalPoolCount
}): JSX.Element => {
  const [showingLoader, setShowingLoader] = useState(false)

  const effectiveItemCount = items.length + (poolsHasMoreData ? 1 : 0)

  const infiniteLoaderRef = useRef(null)
  const hasMountedRef = useRef(false)

  const isItemLoaded = (index) => {
    if (index < items.length) return true
    return false
  }

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
    updatePools({
      page: poolPage + 1,
      pageSize: POOL_LIST_PAGE_SIZE
    })
  }

  useEffect(() => {
    if (!isLoadingPools && showingLoader) {
      setShowingLoader(false)
    }
  }, [isLoadingPools, items.length])

  // Render an item or a loading indicator.
  const Item = ({ index, style }: { index: number; style: CSSProperties }) => {
    if (index === items.length && poolsHasMoreData) {
      return (
        <div style={style}>
          <FarmRowLoaderText />
        </div>
      )
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
    updatePools,
    poolPage,
    isLoadingPools,
    totalPoolCount
  } = useGamma()

  return (
    <InfiniteProPoolScrollView
      items={items}
      currentSort={currentSort}
      poolsHasMoreData={poolsHasMoreData}
      updatePools={updatePools}
      poolPage={poolPage}
      isLoadingPools={isLoadingPools}
      totalPoolCount={totalPoolCount}
      render={render}
      itemPadding={ITEM_PADDING}
    />
  )
}

export default InfiniteProPoolList
