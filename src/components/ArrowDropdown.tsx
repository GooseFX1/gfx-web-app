import React, { FC, ReactElement } from 'react'
import { Dropdown, Row } from 'antd'
import { CenteredDiv, SVGToWhite, SVGDynamicMode } from '../styles'
import tw, { TwStyle, styled } from 'twin.macro'
import 'styled-components/macro'

const ARROW_CLICKER = styled(CenteredDiv)<{
  $arrowRotation?: boolean
  $cssStyle?: TwStyle
}>`
  ${tw`cursor-pointer`}
  border: none;
  background: transparent;
  img {
    ${({ $arrowRotation }) => $arrowRotation && 'transform: rotateZ(180deg);'}
    transition: transform 200ms ease-in-out;
    ${tw`w-[14px] ml-2`}
    ${({ $cssStyle }) => $cssStyle} !important;
  }
`

export const ArrowClicker: FC<{
  arrowRotation?: boolean
  cssStyle?: TwStyle
  [x: string]: any
}> = ({ arrowRotation, cssStyle, ...props }) => (
  <ARROW_CLICKER $arrowRotation={arrowRotation} $cssStyle={cssStyle} {...props}>
    <SVGDynamicMode src={`/img/assets/arrow.svg`} alt="arrow" />
  </ARROW_CLICKER>
)

export const ArrowClickerWhite: FC<{
  arrowRotation?: boolean
  measurements?: string
  [x: string]: any
}> = ({ arrowRotation, measurements, ...props }) => (
  <ARROW_CLICKER $arrowRotation={arrowRotation} $measurements={measurements} {...props}>
    <SVGToWhite src={`/img/assets/arrow.svg`} alt="arrow" />
  </ARROW_CLICKER>
)

export const ArrowDropdown: FC<{
  arrowRotation?: boolean
  measurements?: string
  offset?: [number, number]
  onVisibleChange: (x: boolean) => void
  placement?:
    | 'top'
    | 'bottom'
    | 'bottomLeft'
    | 'bottomRight'
    | 'topLeft'
    | 'topCenter'
    | 'topRight'
    | 'bottomCenter'
  overlay: ReactElement | (() => ReactElement)
  children?: ReactElement | (() => ReactElement)
  [x: string]: any
}> = ({ arrowRotation, measurements, offset, onVisibleChange, overlay, placement, children, ...props }) => (
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
        <img src={`/img/assets/arrow-circle-down.svg`} alt="arrow" className={'arrow-icon'} />
      </ARROW_CLICKER>
    </Row>
  </Dropdown>
)
