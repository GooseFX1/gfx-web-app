import React, { FC, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useDarkMode } from '../../context'
import { CenteredDiv, CenteredImg, SVGToPrimary2, SVGToWhite } from '../../styles'
import tw from 'twin.macro'

const TABS = ['/swap', '/trade', '/NFTs', '/farm']

const LABEL = styled.span<{ $mode: string; $hover: boolean }>`
  ${tw`h-[3.5] w-[7vw] flex justify-center items-center text-smallest capitalize sm:text-regular`};
  font-weight: ${({ $hover }) => ($hover ? '600' : 'normal')};
  color: ${({ $hover, $mode }) =>
    $hover && $mode === 'dark'
      ? '#FFFFFF'
      : $hover && $mode !== 'dark'
      ? '#5855FF'
      : $mode === 'dark'
      ? '#4E4E4E'
      : '#636363'};
  ${({ theme }) => theme.flexCenter}
`

const TAB = styled(Link)<{ $hover: boolean; $mode: string }>`
  ${tw`flex flex-col items-center justify-center sm:relative sm:flex-row sm:justify-center sm:w-full`}

  @media (max-width: 500px) {
    background-color: ${({ $hover }) => ($hover ? '#5855FF' : 'inherit')};
  }
`

const TAB_ICON = styled(CenteredImg)`
  ${tw`mb-2.5 h-6 w-6 sm:absolute sm:left-10 sm:!mb-0`}
`

const WRAPPER = styled(CenteredDiv)<{ $height: number; $index: number; $width: number }>`
  ${tw`relative h-20 rounded-circle sm:mt-8`}
  background-color: ${({ theme }) => theme.bg9};

  .arrow-down {
    ${tw`w-3.5 h-auto block`}
  }

  &:after {
    ${tw`absolute top-0 block h-2 w-11 rounded-b-circle`}
    content: '';
    left: ${({ $index }) => 2 * $index * 40 + 18}px;
    background: #5855ff;
    transition: left ${({ theme }) => theme.mainTransitionTime} ease-in-out;
  }

  > a {
    ${tw`py-0 px-10 z-[1] rounded-circle`}
    width: ${({ $width }) => $width}px;

    > div {
      ${tw`h-[27px] w-auto`}
    }

    img {
      ${tw`h-[27px] w-auto`}
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
        ${tw`h-5`}
      }
    }

    @media (max-width: 500px) {
      ${() =>
        [...Array(TABS.length).keys()].map(
          (x) => `
          &:nth-child(${x + 1}) {
            left: 0px;
          }
        `
        )}
    }
  }

  @media (max-width: 720px) {
    ${tw`w-full mb-[50px]`}

    > a {
      width: calc(100% / ${TABS.length});
      ${tw`px-0`}
    }

    &:after {
      width: calc((100% / ${TABS.length}) + ${({ theme }) => theme.margin(2)});
      left: calc(${({ $index }) => $index} * (100% / ${TABS.length}) - ${({ theme }) => theme.margin(1)});
    }
  }

  @media (max-width: 500px) {
    ${tw`w-full mb-0 rounded-none flex flex-col justify-start h-full`}
    background-color: ${({ theme }) => theme.bg1};

    > a {
      ${tw`w-full text-regular h-20 rounded-none mx-0`}

      &:hover {
        opacity: 1;
        background-color: #5855ff;
        span {
          color: white;
          font-weight: 600;
        }
        div {
          filter: invert(1);
        }
      }
    }

    &:after {
      ${tw`w-full left-0 h-0`}
      background: ${({ theme }) => theme.bg1};
    }
  }
`

interface IProps {
  mobileToggle?: () => void
}

export const Tabs: FC<IProps> = (props: IProps): JSX.Element => {
  const { mode } = useDarkMode()
  const { pathname } = useLocation()
  const [, setHovered] = useState(-1)

  const cleanedPathName = useMemo(() => {
    const match = pathname.slice(1).indexOf('/')
    return match !== -1 ? pathname.slice(0, pathname.slice(1).indexOf('/') + 1) : pathname
  }, [pathname])
  const index = useMemo(() => TABS.indexOf(cleanedPathName), [cleanedPathName])

  return (
    <WRAPPER $height={3.5} $index={index} $width={50}>
      {TABS.map((path, index) => (
        <TAB
          key={index}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(-1)}
          to={path}
          onClick={() => {
            if (props.mobileToggle) props.mobileToggle()
          }}
          $hover={cleanedPathName === path}
          $mode={mode}
        >
          <TAB_ICON>
            {(() => {
              const icon =
                mode === 'dark' ? `/img/assets${path}_icon_dark.svg` : `/img/assets${path}_icon_lite.svg`

              if (cleanedPathName === path) {
                if (window?.innerWidth < 500) {
                  return <SVGToWhite src={`/img/assets${path}_icon_dark.svg`} alt="gfx-tab-icon" />
                }
                return mode === 'dark' ? (
                  <SVGToWhite src={icon} alt="gfx-tab-icon" />
                ) : (
                  <SVGToPrimary2 src={icon} alt="gfx-tab-icon" />
                )
              } else {
                return <img src={icon} alt="gfx-tab-icon" />
              }
            })()}
          </TAB_ICON>
          <LABEL $mode={mode} $hover={cleanedPathName === path}>
            {path.slice(1)}
          </LABEL>
        </TAB>
      ))}
    </WRAPPER>
  )
}
