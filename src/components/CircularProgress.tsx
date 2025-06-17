import React, { useLayoutEffect } from 'react'
import { cn } from 'gfx-component-lib'

type CircleSVGProps = {
  cx?: number
  cy?: number
  r?: number
  strokeWidth?: number
  stroke?: string
  fill?: string
  className?: string
}
type CircularProgressProps = {
  width?: number
  height?: number
  viewbox?: string
  containerClassName?: string
  backgroundCircle?: CircleSVGProps
  progressCircle?: CircleSVGProps
  progress: number
}

function CircularProgress({
  width = 50,
  height = 50,
  viewbox = `0 0 ${width} ${height}`,
  containerClassName = '',
  backgroundCircle,
  progressCircle,
  progress
}: CircularProgressProps) {
  const progressCircRef = React.useRef<SVGCircleElement>(null)

  useLayoutEffect(() => {
    if (!progressCircRef.current) return
    // 1) get radius & circumference
    const radius = progressCircRef.current.r.baseVal.value
    const circumference = 2 * Math.PI * radius

    // 2) tell the circle how long the dash is
    progressCircRef.current.style.strokeDasharray = `${circumference} ${circumference}`

    // 3) calculate how far to offset based on progress %
    const offset = circumference - (progress / 100) * circumference
    progressCircRef.current.style.strokeDashoffset = `${offset}`

    // 4) ensure smooth transitions
    progressCircRef.current.style.transition = 'stroke-dashoffset 0.5s ease'
  }, [progress, progressCircRef])
  return (
    <svg
      width={width}
      height={height}
      viewBox={viewbox}
      className={cn(`absolute top-0 left-0 w-full h-full pointer-events-none`, containerClassName)}
    >
      <circle
        cx={backgroundCircle?.cx || width / 2}
        cy={backgroundCircle?.cy || height / 2}
        r={backgroundCircle?.r || width / 2 - (backgroundCircle?.strokeWidth ?? 2) / 2}
        className={cn('absolute top-0 left-0', backgroundCircle?.className)}
        strokeWidth={backgroundCircle?.strokeWidth || 2}
        stroke={backgroundCircle?.stroke ?? '#6EAD571E'}
        fill={backgroundCircle?.fill ?? 'none'}
      />
      <circle
        ref={progressCircRef}
        cx={progressCircle?.cx || width / 2}
        cy={progressCircle?.cy || height / 2}
        r={progressCircle?.r || width / 2 - (progressCircle?.strokeWidth ?? 2) / 2}
        className={cn('absolute top-0 left-0', progressCircle?.className)}
        strokeWidth={progressCircle?.strokeWidth || 2}
        stroke={progressCircle?.stroke ?? '#6EAD57'}
        fill={'none'}
        strokeLinecap={'round'}
        transform={`rotate(-90 0 0 )`}
        style={{
          // start “empty”
          strokeDasharray: 0,
          strokeDashoffset: 0,
          transition: 'stroke-dashoffset 0.5s ease',
          transformBox: 'fill-box',
          transformOrigin: 'center'
        }}
      />
    </svg>
  )
}

export default CircularProgress
