import React, { FC, HTMLAttributes, useLayoutEffect, useRef, useState } from 'react'

type WindowContainerProps<T> = {
  rootElement?: HTMLElement;
  items: T[];
  render: (item: T, index: number) => JSX.Element;
} & HTMLAttributes<HTMLDivElement>;

const WindowingContainer: FC<WindowContainerProps<unknown>> =
  ({ items, render, rootElement, ...rest }): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });
  const [itemHeight, setItemHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useLayoutEffect(() => {
    const elementToTarget = rootElement || ref.current;
    if (!elementToTarget) return;

    const handleScroll = (e) => {
      console.log('SCROLLING',e.target.scrollTop)
      if (!elementToTarget) return;
      const scrollTop = elementToTarget.scrollTop;
      const newStart = Math.floor(scrollTop / itemHeight);
      const newEnd = Math.min(items.length, newStart + Math.ceil(containerHeight / itemHeight));
      setVisibleRange({ start: newStart, end: newEnd });
    };

    const calculateHeights = () => {
      if (!elementToTarget) return;
      const firstItem = elementToTarget.querySelector('[data-item]') as HTMLElement;
      if (firstItem) {
        setItemHeight(firstItem.offsetHeight);
        setContainerHeight(elementToTarget.clientHeight);
      }
    };
    console.log('SCROLL CONNECTED',elementToTarget)
    const observer = new ResizeObserver(calculateHeights);
    observer.observe(elementToTarget);

    calculateHeights();
    elementToTarget.addEventListener('scroll', handleScroll);

    return () => {
      if (elementToTarget) {
        elementToTarget.removeEventListener('scroll', handleScroll);
        observer.unobserve(elementToTarget);
        observer.disconnect();
      }
    };
  }, [items, itemHeight, containerHeight, rootElement]);
  console.log(rootElement)
  const totalHeight = items.length * itemHeight;

  return (
    <div ref={ref} {...rest} style={{ overflowY: 'auto', position: 'relative', height: totalHeight }}>
        {items.slice(visibleRange.start, visibleRange.end).map((item, index) => (
          <div
            key={visibleRange.start + index}
            data-item
            style={{ position: 'absolute', top: (visibleRange.start + index) * itemHeight, width: '100%' }}
          >
            {render(item, visibleRange.start + index)}
          </div>
        ))}
    </div>
  );
};

export default WindowingContainer;