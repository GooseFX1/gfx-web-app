import React, { FC, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useDarkMode } from '../../context'
import { CenteredDiv, CenteredImg, SVGToGrey2, SVGToPrimary2, SVGToWhite } from '../../styles'

const TABS = ['/swap', '/crypto', '/synths', '/NFTs', '/farm']

const LABEL = styled.span`
  position: absolute;
  bottom: -${({ theme }) => theme.margins['2x']};
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
  ${({ theme }) => theme.measurements(theme.margins['3x'])}
`

const WRAPPER = styled(CenteredDiv)<{ $height: number; $index: number; $width: number }>`
  position: relative;
  width: ${({ $width }) => $width * 2 * TABS.length}px;
  ${({ theme }) => theme.roundedBorders}
  background-color: ${({ theme }) => theme.bg3};

  .arrow-down {
    width: 14px;
    height: auto;
    display: block;
  }

  &:after {
    content: '';
    position: absolute;
    left: ${({ $index, $width }) => 2 * $index * $width + 26}px;
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
    padding: calc(${({ $height }) => $height - 1}vh - ${({ theme }) => theme.margins['2x']} / 2)
      ${({ $width }) => $width}px;
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

  @media (max-width: 720px) {
    width: 100%;
    margin-bottom: 50px;

    > a {
      width: calc(100% / ${TABS.length});
      padding-left: 0px;
      padding-right: 0px;
    }

    &:after {
      width: calc((100% / ${TABS.length}) + ${({ theme }) => theme.margins['2x']});
      left: calc(${({ $index, $width }) => $index} * (100% / ${TABS.length}) - ${({ theme }) => theme.margins['1x']});
    }
  }
`

export const Tabs: FC = () => {
  const { mode } = useDarkMode()
  const { pathname } = useLocation()
  const [hovered, setHovered] = useState(-1)
  const [collapse, setCollapse] = useState(false)

  const cleanedPathName = useMemo(() => {
    const match = pathname.slice(1).indexOf('/')
    return match !== -1 ? pathname.slice(0, pathname.slice(1).indexOf('/') + 1) : pathname
  }, [pathname])
  const index = useMemo(() => TABS.indexOf(cleanedPathName), [cleanedPathName])

  const handleCollapse = (val) => {
    console.log('val?', val)
    setCollapse(val)
  }

  return (
    <WRAPPER $height={3.5} $index={index} $width={50}>
      {TABS.map((path, index) => (
        <TAB key={index} onMouseEnter={() => setHovered(index)} onMouseLeave={() => setHovered(-1)} to={path}>
          <TAB_ICON>
            {(() => {
              const icon = `${process.env.PUBLIC_URL}/img/assets${path}_icon.svg`

              if (cleanedPathName === path || hovered === index) {
                return mode === 'dark' ? <SVGToWhite src={icon} alt="" /> : <SVGToPrimary2 src={icon} alt="" />
              } else {
                return <SVGToGrey2 src={icon} alt="" />
              }
            })()}
          </TAB_ICON>

          {collapse && <LABEL>{path.slice(1)}</LABEL>}
          {path === '/synths' && <Collapsible collapse={collapse} onCollapse={handleCollapse} />}
        </TAB>
      ))}
    </WRAPPER>
  )
}

const Collapsible: React.FC<{ collapse: boolean; onCollapse: (val: boolean) => void }> = ({ collapse, onCollapse }) => {
  const { mode } = useDarkMode()

  const icon = `${process.env.PUBLIC_URL}/img/assets/arrow-down.svg`

  const handleCollapse = () => {
    onCollapse(!collapse)
  }

  return (
    <div
      style={{ position: 'absolute', bottom: 0 }}
      onClick={() => {
        handleCollapse()
      }}
    >
      {mode === 'dark' ? (
        <img style={{ transform: `rotate(${collapse ? 180 : 0}deg)` }} src={icon} alt="" />
      ) : (
        <SVGToGrey2 style={{ transform: `rotate(${collapse ? 180 : 0}deg)` }} src={icon} alt="" />
      )}
    </div>
  )
}
