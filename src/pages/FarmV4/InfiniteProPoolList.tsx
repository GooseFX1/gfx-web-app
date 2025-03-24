import { useGamma } from '@/context'
import React, { FC, HTMLAttributes, useEffect, useRef } from 'react'
import InfiniteLoader from 'react-window-infinite-loader'
import { FixedSizeList } from 'react-window'
import { FarmRowLoaderText } from './FarmRow'
import { CSSProperties } from 'styled-components'

type InfiniteProPoolListScrollViewProps<T> = {
  render: (item: T, index: number) => JSX.Element
  itemPadding?: number
  items: T[]
  maxPoolsReached: boolean
  fetchNextPage: () => void
  isLoadingPools: boolean
} & HTMLAttributes<HTMLDivElement>

export const InfiniteProPoolScrollView: FC<InfiniteProPoolListScrollViewProps<unknown>> = ({
  render,
  itemPadding: ITEM_PADDING = 8,
  items,
  maxPoolsReached,
  fetchNextPage,
  isLoadingPools,
}): JSX.Element => {
  const effectiveItemCount = items.length + (!maxPoolsReached ? 1 : 0)

  const infiniteLoaderRef = useRef(null)
  const hasMountedRef = useRef(false)

  const isItemLoaded = (index) => index < items.length || maxPoolsReached

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
  }, [render,items])

  const loadMoreItems = () => {
    if (isLoadingPools || maxPoolsReached) return
    fetchNextPage()
  }

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

    return <div style={style}>{render(items[index], index)}</div>
  }

  const windowHeight = Math.min(10, effectiveItemCount) * (60 + ITEM_PADDING)

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={effectiveItemCount}
      loadMoreItems={loadMoreItems}
      threshold={1}
      ref={infiniteLoaderRef}
    >
      {({ onItemsRendered, ref }) => (
        <FixedSizeList
          height={windowHeight}
          itemSize={60 + ITEM_PADDING}
          className=""
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
    maxPoolsReached,
    isLoadingPools,
    poolsQuery
  } = useGamma()
  console.log({data: poolsQuery.data})
  return (
    <InfiniteProPoolScrollView
      items={items}
      maxPoolsReached={maxPoolsReached}
      fetchNextPage={poolsQuery.fetchNextPage}
      isLoadingPools={isLoadingPools}
      render={render}
      itemPadding={ITEM_PADDING}
    />
  )
}

export default InfiniteProPoolList
