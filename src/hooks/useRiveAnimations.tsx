import { CanvasHTMLAttributes, DetailedHTMLProps, FC, HTMLProps, useCallback, useEffect } from 'react'
import { Rive, useRive } from '@rive-app/react-canvas'
import { RIVE_ANIMATION } from '../constants'
import { useDarkMode } from '../context'
interface useRiveAnimationsProps {
  animation: string
  autoplay?: boolean
  onLoad?: InputFunction
  canvasWidth?: number
  canvasHeight?: number
  useThemeToggle?: boolean
}
type InputFunction = (...args: any) => any

interface useRiveAnimationsReturnType {
  RiveComponent: RiveAnimationType
  canvas: HTMLCanvasElement | null
  rive: Rive | null
  setContainerRef: (ref: HTMLDivElement | null) => void
  updateAnimation: (s?: string) => void
}
type RiveAnimationType = (
  props: DetailedHTMLProps<CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>
) => JSX.Element
function useRiveAnimations({
  animation,
  autoplay = true,
  onLoad,
  canvasWidth = 30,
  canvasHeight = 30
}: useRiveAnimationsProps): useRiveAnimationsReturnType {
  const { rive, RiveComponent, canvas, setContainerRef } = useRive({
    src: RIVE_ANIMATION[animation].src,
    stateMachines: Object.keys(RIVE_ANIMATION[animation].stateMachines),
    autoplay: autoplay
  })

  const { mode } = useDarkMode()
  const defaultOnLoad = useCallback(
    (onLoadCallback?: InputFunction) => {
      if (!rive || !canvas) return
      canvas.width = canvasWidth
      canvas.height = canvasHeight
      rive.resizeDrawingSurfaceToCanvas()
      if (onLoadCallback) onLoadCallback()
    },
    [rive, canvas, canvasWidth, canvasHeight]
  )

  // ensures rive animation gets put where it should be
  useEffect(() => defaultOnLoad(onLoad), [defaultOnLoad, onLoad])
  /**
   * Forcefully updates the animation if the animation prop changes
   */
  const updateAnimation = useCallback(
    (anim?: string) => {
      const newAnim = anim ?? animation
      if (!rive) return
      rive.load({
        src: RIVE_ANIMATION[newAnim].src,
        autoplay: autoplay,
        stateMachines: Object.keys(RIVE_ANIMATION[newAnim].stateMachines)
      })
    },
    [rive, animation, autoplay]
  )

  useEffect(() => {
    // rive bug - doesnt listen for source change some of the time
    if (rive && !rive.source.includes(animation)) {
      updateAnimation()
      defaultOnLoad(onLoad)
    }
  }, [defaultOnLoad, updateAnimation, mode])

  return {
    RiveComponent,
    canvas,
    rive,
    setContainerRef,
    updateAnimation
  }
}

interface RiveAnimationWrapperProps extends HTMLProps<any> {
  setContainerRef: (ref: HTMLDivElement | null) => void
  width?: number
  height?: number
  children: any
}
export const RiveAnimationWrapper: FC<RiveAnimationWrapperProps> = ({
  setContainerRef,
  width = 30,
  height = 30,
  children,
  ...rest
}) => (
  <div
    ref={setContainerRef}
    style={{
      width: width,
      height: height
    }}
    {...rest}
  >
    {children}
  </div>
)
export default useRiveAnimations
