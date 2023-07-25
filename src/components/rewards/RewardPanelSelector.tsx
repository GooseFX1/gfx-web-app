import React, { BaseSyntheticEvent, FC, useCallback, useRef } from 'react'
import { useAnimateButtonSlide } from '../../pages/Farm/FarmFilterHeader'
import tw from 'twin.macro'
import 'styled-components/macro'

interface PanelSelectorProps {
  panelIndex: number
  setPanelIndex: (value: number) => void
}
const PanelSelector: FC<PanelSelectorProps> = ({ panelIndex, setPanelIndex }) => {
  const sliderRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<HTMLButtonElement[]>([])
  const handleSlide = useAnimateButtonSlide(sliderRef, buttonRefs, panelIndex)
  const onChangePanel = useCallback((el: BaseSyntheticEvent) => {
    const index = parseInt(el.currentTarget.dataset.index)
    setPanelIndex(index)
    handleSlide(index)
    // change panel data
  }, [])
  const setRef = useCallback(
    (el: HTMLButtonElement) => {
      const index = parseInt(el?.dataset?.index)
      if (isNaN(index)) return
      buttonRefs.current[index] = el
      if (panelIndex == index) {
        handleSlide(index)
      }
    },
    [panelIndex]
  )
  return (
    <div css={tw`flex flex-row justify-center w-full items-center relative text-lg z-[0] min-md:mt-0`}>
      <div
        ref={sliderRef}
        css={tw`bg-white w-full min-md:bg-blue-1 h-[40px]  rounded-[36px] z-[-1] absolute transition-all`}
      />
      <button
        css={[
          tw` min-w-max  cursor-pointer w-[120px] text-center border-none border-0
  font-semibold text-base h-[40px] rounded-[36px] duration-700 bg-transparent`,
          panelIndex == 0 ? tw`text-blue-1 min-md:text-white` : tw`text-grey-5 min-md:text-grey-1`
        ]}
        ref={setRef}
        data-index={0}
        onClick={onChangePanel}
      >
        Earn
      </button>
      <button
        css={[
          tw`min-w-max cursor-pointer w-[120px] text-center border-none border-0
              font-semibold text-base h-[40px] rounded-[36px] duration-700 bg-transparent`,
          panelIndex == 1 ? tw`text-blue-1 min-md:text-white` : tw`text-grey-2 min-md:text-grey-1`
        ]}
        ref={setRef}
        data-index={1}
        onClick={onChangePanel}
        // disabled={true}
      >
        Refer
      </button>
    </div>
  )
}
export default PanelSelector
