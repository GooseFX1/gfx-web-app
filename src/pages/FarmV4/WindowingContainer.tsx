import { useGamma } from '@/context'
import React, { FC, HTMLAttributes, useEffect, useRef } from 'react'
import InfiniteLoader from 'react-window-infinite-loader'
import { FixedSizeList } from 'react-window'
import { POOL_LIST_PAGE_SIZE } from './constants'
import { FarmRowLoader } from './FarmRow'
import { CSSProperties } from 'styled-components'

type WindowContainerProps<T> = {
  rootElement?: HTMLElement
  render: (item: T, index: number) => JSX.Element
  itemClassName?: string
  itemPadding?: number
} & HTMLAttributes<HTMLDivElement>

const WindowingContainer: FC<WindowContainerProps<unknown>> = ({
  render,
  className,
  itemPadding: ITEM_PADDING = 8,
  ...rest
}): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null)
  const {
    filteredPools: items,
    currentSort,

    updatePools,
    poolPage,
    currentPoolType,

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
      pageSize: POOL_LIST_PAGE_SIZE,
      poolType: currentPoolType.type
    })
  }

  // Render an item or a loading indicator.
  const Item = ({ index, style }: { index: number; style: CSSProperties }) => {
    let content
    if (!isItemLoaded(index)) {
      content = <FarmRowLoader />
    } else {
      content = render(items[index], index)
    }

    return <div style={style }>{content}</div>
  }

  const windowHeight = Math.min(10, totalPoolCount) * 60

  return (
    <div className={className} ref={ref} {...rest}>
      <InfiniteLoader isItemLoaded={isItemLoaded} itemCount={itemCount} loadMoreItems={loadMoreItems}>
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
    </div>
  )
}

export default WindowingContainer
