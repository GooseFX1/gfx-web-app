import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { useDarkMode } from '../../../context'
import 'react-loading-skeleton/dist/skeleton.css'
import { FC } from 'react'

export const SkeletonCommon: FC<{
  height: string
  width?: string
  borderRadius?: string
  style?: any
  isReverse?: boolean
}> = ({ height, width = '100%', borderRadius = '6px', style = {}, isReverse = false }) => {
  const { mode } = useDarkMode()
  const baseColor = mode === 'lite' ? 'rgba(255, 255, 255, 1)' : 'rgba(71, 71, 71, 1)'
  const highlightColor = mode === 'lite' ? 'rgba(186, 186, 186, 0.5)' : 'rgba(19, 19, 19, 0.5)'

  return (
    <SkeletonTheme
      baseColor={isReverse ? highlightColor : baseColor}
      highlightColor={isReverse ? baseColor : highlightColor}
      height={height}
      width={width}
    >
      <Skeleton style={style} height={height} width={width} count={1} borderRadius={borderRadius} />
    </SkeletonTheme>
  )
}
