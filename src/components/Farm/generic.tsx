import { FC, useCallback, useEffect, MutableRefObject, ReactElement } from 'react'
import { Skeleton } from 'antd'
import { Tooltip } from '../../components'
import { useDarkMode } from '../../context'
import { checkMobile } from '../../utils'
import tw, { styled } from 'twin.macro'

interface Message {
  type?: string
  message: string | JSX.Element
}

export const genericErrMsg = (error: string): Message => ({
  type: 'error',
  message: error
})

export const Loader: FC = () => (
  <Skeleton.Button
    active
    size="small"
    style={{ display: 'flex', height: '15px', width: '25px', borderRadius: '5px' }}
  />
)

export const LoaderForImg: FC = () => (
  <Skeleton.Button
    active
    size="small"
    style={{ height: '47px', marginRight: '10px', width: '40px', borderRadius: '100%' }}
  />
)

export const GenericTooltip: FC<{ text: string; children?: any }> = ({ text, children }): JSX.Element => {
  const { mode } = useDarkMode()
  if (children)
    return (
      <Tooltip dark title={text} infoIcon={false} color={mode === 'dark' ? '#eeeeee' : '#000'}>
        {children}
      </Tooltip>
    )
  return (
    <img className="info-icon" src={`/img/assets/info-icon.svg`} alt="" /> && (
      <Tooltip dark placement="bottomLeft" infoIcon={true} color={mode === 'dark' ? '#eeeeee' : '#000'}>
        <span>{text}</span>
      </Tooltip>
    )
  )
}

type AnimateButtonRefType = HTMLButtonElement | HTMLDivElement
interface useAnimateButtonSlideReturnType {
  handleSlide: (index: number) => void
  setButtonRef: (ref: AnimateButtonRefType) => void
}
/**
 * Animates a absolute button components left, top and width to always match the button it is animating to
 * @param slideRef - the ref of the absolute button component that is to be animated
 * @param buttonRefs - the ref[] of the buttons that the slideRef is to be animated to
 * @param index - the index of the buttonRefs that the slideRef is to be animated to on mount
 * @param customCallback - function takes an index and performs custom animation placement instead of center
 */
export const useAnimateButtonSlide = (
  slideRef: MutableRefObject<HTMLDivElement | null>,
  buttonRefs: MutableRefObject<AnimateButtonRefType[]>,
  index?: number,
  customCallback?: (index: number, buttonRef: AnimateButtonRefType, sliderRef: HTMLDivElement) => void
): useAnimateButtonSlideReturnType => {
  useEffect(() => {
    if (!slideRef.current || !buttonRefs.current.length) return
    if (index !== undefined) {
      handleSlide(index)
    } else {
      handleSlide(0)
    }
  }, [slideRef, buttonRefs, index])
  const handleSlide = useCallback(
    (index) => {
      if (!slideRef.current || !buttonRefs.current.length) {
        console.log('Warning: SlideRef or ButtonRefs not set', { slideRef, buttonRefs })
        return
      }
      if (!buttonRefs.current[index]) {
        console.log('Warning: ButtonRefs not set')
        return
      }
      if (customCallback) {
        customCallback(index, buttonRefs.current[index], slideRef.current)
        return
      }
      const left = `${buttonRefs.current[index].offsetLeft}px`
      const width = `${buttonRefs.current[index].offsetWidth}px`
      // const top = `${buttonRefs.current[index].offsetTop}px`
      if (slideRef.current.style.left !== left) {
        slideRef.current.style.left = left
      }
      if (slideRef.current.style.width !== width) {
        slideRef.current.style.width = width
      }
      // if (slideRef.current.style.top !== top) {
      //   slideRef.current.style.top = top
      // }
    },
    [slideRef.current, buttonRefs.current, customCallback, index]
  )
  useEffect(() => {
    // weird behaviour where resizing has buttons too big or too small
    window.addEventListener('resize', () => handleSlide(index ?? 0))
    return () => window.removeEventListener('resize', () => handleSlide(index ?? 0))
  }, [index])

  const setButtonRef = useCallback(
    (ref: AnimateButtonRefType) => {
      if (!buttonRefs.current.includes(ref)) {
        buttonRefs.current.push(ref)
      }
    },
    [buttonRefs.current]
  )
  return {
    handleSlide,
    setButtonRef
  }
}
export const LastRefreshedAnimation: FC<{ lastRefreshedClass: string }> = ({
  lastRefreshedClass
}): ReactElement => (
  <div className={lastRefreshedClass}>
    {lastRefreshedClass === 'lastRefreshed' && (
      <strong>
        Last updated: {checkMobile() && <br />} {new Date().toUTCString()}
      </strong>
    )}
  </div>
)

export const STYLED_BUTTON = styled.button`
  ${tw`sm:m-auto cursor-pointer w-[100px] sm:w-[100px] text-center border-none border-0 sm:font-medium
  font-semibold text-base h-8.75 rounded-[36px] duration-700   text-[15px] sm:text-[13px] text-grey-1`}
  background: none;

  :disabled {
    ${tw`cursor-wait`}
  }
`

export const RefreshIcon = styled.button`
  ${tw`cursor-pointer  sm:ml-10 rounded-full border-0 p-0 bg-transparent`}
  .rotateRefreshBtn {
    -webkit-animation: cog 1s infinite;
    -moz-animation: cog 1s infinite;
    -ms-animation: cog 1s infinite;
    animation: cog 1s infinite;
    -webkit-animation-timing-function: linear;
    -moz-animation-timing-function: linear;
    -ms-animation-timing-function: linear;
    animation-timing-function: linear;
    @keyframes cog {
      100% {
        -moz-transform: rotate(-360deg);
        -ms-transform: rotate(-360deg);
        transform: rotate(-360deg);
      }
    }
  }
`
