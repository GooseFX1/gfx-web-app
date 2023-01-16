/* eslint-disable */
import { FC, ReactNode } from 'react'
import tw, { styled } from 'twin.macro'
import { Loader } from '../Loader'

const BUTTON = styled.button<{ $height: string; $status: string; $width: string; $borderRadius: string }>`
  ${tw`relative flex items-center justify-center outline-none`}
  height: ${({ $height }) => $height};
  width: ${({ $width }) => $width};
  border-radius: ${({ $borderRadius }) => $borderRadius};
  background-color: lite - dark - disbled - hover;
  cursor: ${({ $status }) => ($status === 'action' ? 'pointer' : $status)};
  border: none;
  outline: none;

  ${({ theme, $status }) =>
    $status === 'action' &&
    `
    &:hover {
      background-color: ${theme.secondary2};
    }
  `}
`

export const Button: FC<{
  children: ReactNode
  height: string
  width: string
  className?: string
  borderRadius?: string
  loading?: boolean
  status?: string
  [x: string]: any
}> = ({ height, width, borderRadius, children, className, loading = false, status, ...props }) => {
  console.log('Common button component state', height, width)
  return (
    <>
      <BUTTON
        className={className}
        $height={height}
        $width={width}
        $status={status}
        $borderRadius={borderRadius}
        {...props}
      >
        {loading ? <Loader /> : children}
      </BUTTON>
    </>
  )
}
