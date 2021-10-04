import React, { FC, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useDarkMode } from '../../context'
import { CenteredDiv, CenteredImg, SVGToGrey2, SVGToPrimary2, SVGToWhite } from '../../styles'

const LABEL = styled.span`
  position: absolute;
  bottom: -${({ theme }) => theme.margins['3x']};
  font-size: 13px;
  color: ${({ theme }) => theme.text2};
  text-transform: capitalize;
`

const TAB = styled(Link)`
  ${({ theme }) => theme.flexCenter}
  position: absolute;
  flex-direction: column;
`

const TAB_ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margins['2x'])}
`

const WRAPPER = styled(CenteredDiv)<{ $height: number; $index: number; $width: number }>`
  position: relative;
  width: ${({ $width }) => $width * 8}px;
  padding: ${({ $height }) => $height}vh ${({ $width }) => $width}px;
  ${({ theme }) => theme.roundedBorders}
  background-color: ${({ theme }) => theme.bg3};
  ${({ theme }) => theme.smallShadow}

  &:after {
    content: '';
    position: absolute;
    left: ${({ $index, $width }) => 2 * $index * $width}px;
    display: block;
    height: ${({ $height }) => $height * 2}vh;
    width: 100px;
    ${({ theme }) => theme.roundedBorders}
    background-color: ${({ theme }) => theme.primary2};
    transition: left ${({ theme }) => theme.mainTransitionTime} ease-in-out;
  }

  > a {
    width: ${({ $width }) => $width}px;
    padding: calc(${({ $height }) => $height}vh - ${({ theme }) => theme.margins['2x']} / 2) ${({ $width }) => $width}px;
    ${({ theme }) => theme.roundedBorders}
    z-index: 1;

    ${({ $width }) =>
      [...Array(4).keys()].map(
        (x) => `
    &:nth-child(${x + 1}) {
      left: ${x * $width * 2}px;
    }
    `
      )}
  }
`

export const Tabs: FC = () => {
  const { mode } = useDarkMode()
  const { pathname } = useLocation()
  const [hovered, setHovered] = useState(-1)

  const tabs = useMemo(() => ['/swap', '/trade', '/NFTs', '/farm'], [])
  const index = useMemo(() => tabs.indexOf(pathname), [pathname, tabs])

  return (
    <WRAPPER $height={3.5} $index={index} $width={50}>
      {tabs.map((path, index) => (
        <TAB key={index} onMouseEnter={() => setHovered(index)} onMouseLeave={() => setHovered(-1)} to={path}>
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
