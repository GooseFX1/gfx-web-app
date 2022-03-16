import React, { FC, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useDarkMode } from '../../context'
import { CenteredDiv, CenteredImg, SVGToGrey2, SVGToPrimary2, SVGToWhite } from '../../styles'

const TABS = ['/swap', '/crypto', '/NFTs', '/farm', '/synths']

const LABEL = styled.span`
  height: 14px;
  width: 7vw;
  ${({ theme }) => theme.flexCenter}
  font-size: 10px;
  color: ${({ theme }) => theme.text2};
  text-transform: capitalize;
`

const TAB = styled(Link)`
  ${({ theme }) => theme.flexCenter}
  flex-direction: column;
`

const TAB_ICON = styled(CenteredImg)`
  margin-bottom: 10px;
  ${({ theme }) => theme.measurements(theme.margin(3))}
`

const WRAPPER = styled(CenteredDiv)<{ $height: number; $index: number; $width: number }>`
  position: relative;
  ${({ theme }) => theme.roundedBorders}
  background-color: ${({ theme }) => theme.bg9};
  height: 80px;

  .arrow-down {
    width: 14px;
    height: auto;
    display: block;
  }

  &:after {
    content: '';
    position: absolute;
    left: ${({ $index, $width }) => 2 * $index * 40 + 18}px;
    top: 0;
    display: block;
    height: 8px;
    width: 44px;
    ${({ theme }) => theme.headerRoundedBorders}
    background: linear-gradient(to right, ${({ theme, $index }) => theme.tabsGradients[$index]}, ${({
      theme,
      $index
    }) => theme.tabsGradients[$index + 1]});
    transition: left ${({ theme }) => theme.mainTransitionTime} ease-in-out;
  }

  > a {
    width: ${({ $width }) => $width}px;
    padding: 0 40px;
    ${({ theme }) => theme.roundedBorders}
    z-index: 1;

    > div {
      height: 27px;
      width: auto;
    }

    img {
      height: 27px;
      width: auto;
    }

    ${({ $width }) =>
      [...Array(TABS.length).keys()].map(
        (x) => `
          &:nth-child(${x + 1}) {
            left: ${x * $width * 2}px;
          }
        `
      )}

    &:first-child {
      img {
        height: 20px;
      }
    }
  }

  @media (max-width: 720px) {
    width: 100%;
    margin-bottom: 50px;

    > a {
      width: calc(100% / ${TABS.length});
      padding-left: 0px;
      padding-right: 0px;
    }

    &:after {
      width: calc((100% / ${TABS.length}) + ${({ theme }) => theme.margin(2)});
      left: calc(${({ $index, $width }) => $index} * (100% / ${TABS.length}) - ${({ theme }) => theme.margin(1)});
    }
  }
`

export const Tabs: FC = () => {
  const { mode } = useDarkMode()
  const { pathname } = useLocation()
  const [hovered, setHovered] = useState(-1)

  const cleanedPathName = useMemo(() => {
    const match = pathname.slice(1).indexOf('/')
    return match !== -1 ? pathname.slice(0, pathname.slice(1).indexOf('/') + 1) : pathname
  }, [pathname])
  const index = useMemo(() => TABS.indexOf(cleanedPathName), [cleanedPathName])

  return (
    <WRAPPER $height={3.5} $index={index} $width={50}>
      {TABS.map((path, index) => (
        <TAB key={index} onMouseEnter={() => setHovered(index)} onMouseLeave={() => setHovered(-1)} to={path}>
          <TAB_ICON>
            {(() => {
              const icon = `/img/assets${path}_icon.svg`

              if (cleanedPathName === path || hovered === index) {
                return mode === 'dark' ? (
                  <SVGToWhite src={icon} alt="gfx-tab-icon" />
                ) : (
                  <SVGToPrimary2 src={icon} alt="gfx-tab-icon" />
                )
              } else {
                return <SVGToGrey2 src={icon} alt="gfx-tab-icon" />
              }
            })()}
          </TAB_ICON>
          <LABEL>{path.slice(1)}</LABEL>
        </TAB>
      ))}
    </WRAPPER>
  )
}
