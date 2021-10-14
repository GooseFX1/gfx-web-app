import React, { FC, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useDarkMode } from '../../context'
import { CenteredDiv, CenteredImg, MainText, SVGToGrey2, SVGToPrimary2, SVGToWhite } from '../../styles'

const LABEL = MainText(styled.span`
  position: absolute;
  bottom: -${({ theme }) => theme.margins['3x']};
  font-size: 13px;
  color: ${({ theme }) => theme.text2};
  text-transform: capitalize;
`)

const TAB = styled(Link)`
  ${({ theme }) => theme.flexCenter}
  position: absolute;
  flex-direction: column;
`

const TAB_ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margins['2x'])}
`

const WRAPPER = styled(CenteredDiv)<{ $height: number; $width: number }>`
  position: relative;
  width: ${({ $width }) => $width * 8}px;
  padding: ${({ $height }) => $height}vh ${({ $width }) => $width}px;
  ${({ theme }) => theme.roundedBorders}
  background-color: ${({ theme }) => theme.bg3};
  ${({ theme }) => theme.smallShadow}

  > a {
    width: ${({ $width }) => $width}px;
    padding: calc(${({ $height }) => $height}vh - ${({ theme }) => theme.margins['2x']} / 2) ${({ $width }) => $width}px;
    ${({ theme }) => theme.roundedBorders}

    ${({ $width }) =>
      [...Array(4).keys()].map(
        (x) => `
    &:nth-child(${x + 1}) {
      left: ${x * $width * 2}px;
    }
    `
      )}
  }

  a.active {
    background-color: ${({ theme }) => theme.primary2};
  }
`

export const Tabs: FC = () => {
  const { mode } = useDarkMode()
  const { pathname } = useLocation()
  const [hovered, setHovered] = useState(-1)

  return (
    <WRAPPER $height={3.5} $width={50}>
      {['/swap', '/trade', '/NFTs', '/farm'].map((path, index) => (
        <TAB
          key={index}
          className={pathname === path ? 'active' : ''}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(-1)}
          to={path}
        >
          <TAB_ICON>
            {(() => {
              if (pathname === path || (mode === 'dark' && hovered === index)) {
                return <SVGToWhite src={`${process.env.PUBLIC_URL}/img/assets${path}_icon.svg`} alt="" />
              } else if (hovered === index) {
                return <SVGToPrimary2 src={`${process.env.PUBLIC_URL}/img/assets${path}_icon.svg`} alt="" />
              } else {
                return <SVGToGrey2 src={`${process.env.PUBLIC_URL}/img/assets${path}_icon.svg`} alt="" />
              }
            })()}
          </TAB_ICON>
          <LABEL>{path.slice(1)}</LABEL>
        </TAB>
      ))}
    </WRAPPER>
  )
}
