import React from 'react'
import styled from 'styled-components'

export const Brand = styled.a`
  ${({ theme }) => theme.flexCenter}
  float: left;
  width: auto;
  padding: ${({ theme }) => theme.margin(1)};
  font-size: 40px;
  font-weight: bold;
  line-height: 20px;

  img {
    position: fixed;
    width: auto;
    object-fit: contain;

    ${({ theme }) => theme.mediaWidth.upToSmall`
      left: ${({ theme }) => theme.margin(2)};
      height: 40px;
    `}
    ${({ theme }) => theme.mediaWidth.fromSmall`
      left: 50px;
      height: 50px;
    `}
  }
`

const MAIN_BUTTON = styled.a`
  position relative;
  border-radius: 25px;
  cursor: pointer;
  
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 6px 16px;
  `}
  ${({ theme }) => theme.mediaWidth.fromMedium`
    padding: 9px 16px;
  `}
  ${({ theme }) => theme.mediaWidth.fromLarge`
    padding: 12.5px 20px;
  `}

  > * {
    position: inherit;
    color: white !important;
    
    @supports(transition: initial) {
      transition: color 300ms ease-in-out;
    }
  }

  &:hover {
    background-color: white;

    > * {
      color: ${({ theme }) => theme.secondary1} !important;
    }

    &::before {
      opacity: 0;
      visibility: hidden;
    }
  }

  &::before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    ${({ theme }) => theme.measurements('100%')}
    border-radius: 25px;
    background-image: linear-gradient(to right, ${({ theme }) => theme.primary1}, ${({ theme }) => theme.secondary2});
    opacity: 1;
    
    @supports(transition: initial) {
      transition: opacity 300ms ease-in-out, visibility 300ms ease-in-out;
    }
  }
`

export function MainButton({ children, href }: { children: JSX.Element; href?: string }): JSX.Element {
  return <MAIN_BUTTON href={href}>{children}</MAIN_BUTTON>
}

export const NavBar = styled.nav`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  width: 100%;
  background-color: transparent;
  z-index: 300;
`

export const FLOATING_ACTION_ICON = styled.img`
  transform: rotate(90deg);
  width: 16px;
  filter: ${({ theme }) => theme.filterBackIcon};
`
