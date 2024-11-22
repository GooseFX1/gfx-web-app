import React, { FC, HTMLAttributes, useLayoutEffect, useRef, useState } from 'react'

type WindowContainerProps<T> = {
  rootElement?: HTMLElement
  items: T[]
  render: (item: T, index: number) => JSX.Element
  itemClassName?: string
  itemPadding?: number
} & HTMLAttributes<HTMLDivElement>

const WindowingContainer: FC<WindowContainerProps<unknown>> = ({
  items,
  render,
  rootElement,
  className,
  itemClassName,
  itemPadding: ITEM_PADDING = 8,
  ...rest
}): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null)
  const [itemHeight, setItemHeight] = useState(0)

  useLayoutEffect(() => {
    const elementToTarget = rootElement || ref.current
    if (!elementToTarget) return

    const calculateHeights = () => {
      if (!elementToTarget) return
      const firstItem = elementToTarget.querySelector('[data-item]') as HTMLElement
      if (firstItem) {
        setItemHeight(firstItem.offsetHeight + ITEM_PADDING)
      }
    }

    calculateHeights()
  }, [items, rootElement])

  const windowHeight = Math.min(10, items.length) * itemHeight

  return (
    <div
      className={className}
      ref={ref}
      {...rest}
      style={{ overflowY: 'scroll', position: 'relative', height: windowHeight }}
    >
      {items.map((item, index) => (
        <div
          className={itemClassName}
          key={index}
          data-item
          style={{
            position: 'absolute',
            top: (index) * itemHeight + ITEM_PADDING,
            width: '100%'
          }}
        >
          {render(item, index)}
        </div>
      ))}
    </div>
  )
}

export default WindowingContainer
