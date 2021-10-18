import React, { FC, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useDarkMode } from '../../context'
import { CenteredDiv, CenteredImg, SVGToGrey2, SVGToPrimary2, SVGToWhite } from '../../styles'

const TABS = ['/swap', '/crypto', '/synths', '/NFTs', '/farm']

const LABEL = styled.span`
  position: absolute;
  bottom: -${({ theme }) => theme.margins['3x']};
  font-size: 13px;
  color: ${({ theme }) => theme.text2};
  text-transform: capitalize;
`

const TAB = styled(CenteredDiv)`
  position: absolute;
  flex-direction: column;
`

const TAB_ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margins['3x'])}
`

const WRAPPER = styled(CenteredDiv)<{ $height: number; $index: number; $width: number }>`
  position: relative;
  width: ${({ $width }) => $width * 2 * TABS.length}px;
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
    background: linear-gradient(to right, ${({ theme, $index }) => theme.tabsGradients[$index]}, ${({
      theme,
      $index
    }) => theme.tabsGradients[$index + 1]});
    transition: left ${({ theme }) => theme.mainTransitionTime} ease-in-out;
  }

  > div {
    width: ${({ $width }) => $width}px;
    padding: calc(${({ $height }) => $height}vh - ${({ theme }) => theme.margins['2x']} / 2) ${({ $width }) => $width}px;
    ${({ theme }) => theme.roundedBorders}
    z-index: 1;

    ${({ $width }) =>
      [...Array(TABS.length).keys()].map(
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

  const index = useMemo(() => TABS.indexOf(pathname), [pathname])

  return (
    <WRAPPER $height={3.5} $index={index} $width={50}>
      {TABS.map((path, index) => (
        <TAB key={index}>
          <Link onMouseEnter={() => setHovered(index)} onMouseLeave={() => setHovered(-1)} to={path}>
            <TAB_ICON>
              {(() => {
                const icon = `${process.env.PUBLIC_URL}/img/assets${path}_icon.svg`

                if (pathname === path || (mode === 'dark' && hovered === index)) {
                  return <SVGToWhite src={icon} alt="" />
                } else if (hovered === index) {
                  return <SVGToPrimary2 src={icon} alt="" />
                } else {
                  return <SVGToGrey2 src={icon} alt="" />
                }
              })()}
            </TAB_ICON>
          </Link>
          <LABEL>{path.slice(1)}</LABEL>
        </TAB>
      ))}
    </WRAPPER>
  )
}
