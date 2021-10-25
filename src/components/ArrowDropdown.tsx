import React, { FC, ReactElement } from 'react'
import { Dropdown } from 'antd'
import styled from 'styled-components'
import { SVGToBlack, SVGToWhite } from '../styles'

const ARROW_CLICKER = styled.div<{ arrowRotation?: boolean }>`
  ${({ theme }) => theme.flexCenter}
  ${({ theme }) => theme.measurements(theme.margins['1.5x'])}
  margin-left: ${({ theme }) => theme.margins['1x']};
  border: none;
  background: transparent;
  cursor: pointer;

  img {
    ${({ theme }) => theme.measurements('inherit')}
    ${({ arrowRotation }) => arrowRotation && 'transform: rotateZ(180deg);'}
    transition: transform 200ms ease-in-out;
  }
`

export const ArrowClicker: FC<{ arrowRotation?: boolean; onClick?: () => void; mode?: string }> = ({
  arrowRotation,
  onClick,
  mode = 'dark',
  ...props
}) => {
  return (
    <ARROW_CLICKER onClick={onClick} arrowRotation={arrowRotation} {...props}>
      {mode === 'dark' ? (
        <SVGToWhite src={`${process.env.PUBLIC_URL}/img/assets/arrow.svg`} alt="arrow" />
      ) : (
        <SVGToBlack src={`${process.env.PUBLIC_URL}/img/assets/arrow.svg`} alt="arrow" />
      )}
    </ARROW_CLICKER>
  )
}

export const ArrowDropdown: FC<{
  arrowRotation?: boolean
  offset?: [number, number]
  overlay: ReactElement | (() => ReactElement)
  setArrowRotation?: (x: boolean) => void
}> = ({ arrowRotation, offset, overlay, setArrowRotation, ...props }) => {
  return (
    <Dropdown
      align={{ offset }}
      destroyPopupOnHide
      onVisibleChange={setArrowRotation}
      overlay={overlay}
      placement="bottomRight"
      trigger={['click']}
      {...props}
    >
      <ARROW_CLICKER arrowRotation={arrowRotation}>
        <SVGToWhite src={`${process.env.PUBLIC_URL}/img/assets/arrow.svg`} alt="arrow" />
      </ARROW_CLICKER>
    </Dropdown>
  )
}
