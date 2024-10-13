import React, { FC, HTMLAttributes, useLayoutEffect, useRef, useState, useMemo } from 'react'

type WindowContainerProps<T> = {
  rootElement?: HTMLElement
  items: T[]
  render: (item: T, index: number) => JSX.Element
  itemClassName?: string
} & HTMLAttributes<HTMLDivElement>

const WindowingContainer: FC<WindowContainerProps<unknown>> = ({
  items,
  render,
  rootElement,
  className,
  itemClassName,
  ...rest
}): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null)
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 })
  const [itemHeight, setItemHeight] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const ITEM_PADDING = useMemo(() => 15, [])

  useLayoutEffect(() => {
    const elementToTarget = rootElement || ref.current
    if (!elementToTarget) return

    //eslint-disable-next-line
    const handleScroll = (e) => {
      //console.log('SCROLLING',e.target.scrollTop)
      if (!elementToTarget) return
      const scrollTop = elementToTarget.scrollTop
      const newStart = Math.floor(scrollTop / itemHeight)
      const newEnd = Math.min(items.length, newStart + Math.ceil(containerHeight / itemHeight))
      setVisibleRange({ start: newStart, end: newEnd })
    }

    const calculateHeights = () => {
      if (!elementToTarget) return
      const firstItem = elementToTarget.querySelector('[data-item]') as HTMLElement
      if (firstItem) {
        setItemHeight(firstItem.offsetHeight + ITEM_PADDING)
        setContainerHeight(elementToTarget.clientHeight)
      }
    }
    //console.log('SCROLL CONNECTED',elementToTarget)
    const observer = new ResizeObserver(calculateHeights)
    observer.observe(elementToTarget)

    calculateHeights()
    elementToTarget.addEventListener('scroll', handleScroll)

    return () => {
      if (elementToTarget) {
        elementToTarget.removeEventListener('scroll', handleScroll)
        observer.unobserve(elementToTarget)
        observer.disconnect()
      }
    }
  }, [items, itemHeight, containerHeight, rootElement])

  const totalHeight = items.length * itemHeight

  return (
    <div
      className={className}
      ref={ref}
      {...rest}
      style={{ overflowY: 'auto', position: 'relative', height: totalHeight }}
    >
      {items.slice(visibleRange.start, visibleRange.end).map((item, index) => (
        <div
          className={itemClassName}
          key={visibleRange.start + index}
          data-item
          style={{
            position: 'absolute',
            top: (visibleRange.start + index) * itemHeight + ITEM_PADDING,
            width: '100%'
          }}
        >
          {render(item, visibleRange.start + index)}
        </div>
      ))}
    </div>
  )
}

export default WindowingContainer
