import React, { FC, ReactElement } from 'react'
import { Dropdown, Row } from 'antd'
import styled from 'styled-components'
import { CenteredDiv, SVGToWhite } from '../styles'
import { useDarkMode } from '../context'

const ARROW_CLICKER = styled(CenteredDiv)<{ $arrowRotation?: boolean; $measurements?: string }>`
  ${({ theme, $measurements }) => theme.measurements($measurements ? $measurements : theme.margin(1.5))}
  margin-left: ${({ theme }) => theme.margin(1)};
  border: none;
  background: transparent;
  cursor: pointer;
  img {
    ${({ theme }) => theme.measurements('inherit')}
    ${({ $arrowRotation }) => $arrowRotation && 'transform: rotateZ(180deg);'}
    transition: transform 200ms ease-in-out;
  }
`

export const ArrowClicker: FC<{
  arrowRotation?: boolean
  measurements?: string
  [x: string]: any
}> = ({ arrowRotation, measurements, ...props }) => {
  return (
    <ARROW_CLICKER $arrowRotation={arrowRotation} $measurements={measurements} {...props}>
      <SVGToWhite src={`/img/assets/arrow.svg`} alt="arrow" />
    </ARROW_CLICKER>
  )
}

export const ArrowDropdown: FC<{
  arrowRotation?: boolean
  measurements?: string
  offset?: [number, number]
  onVisibleChange: (x: boolean) => void
  overlay: ReactElement | (() => ReactElement)
  children?: ReactElement | (() => ReactElement)
  [x: string]: any
}> = ({ arrowRotation, measurements, offset, onVisibleChange, overlay, placement, children, ...props }) => {
  const { mode } = useDarkMode()

  return (
    <Dropdown
      align={{ offset }}
      destroyPopupOnHide
      onVisibleChange={onVisibleChange}
      overlay={overlay}
      placement={placement || 'bottomRight'}
      trigger={['click']}
      {...props}
    >
      <Row align="middle" wrap={false}>
        {children}
        <ARROW_CLICKER $arrowRotation={arrowRotation} $measurements={measurements}>
          {mode === 'dark' ? (
            <SVGToWhite src={`/img/assets/arrow.svg`} alt="arrow" />
          ) : (
            <img className="moon-image" src={`/img/assets/arrow.svg`} alt="" />
          )}
        </ARROW_CLICKER>
      </Row>
    </Dropdown>
  )
}
