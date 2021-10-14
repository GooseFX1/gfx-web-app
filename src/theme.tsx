import type { Colors, Text } from './types/theme'

import React from 'react'
import { ThemeProvider as StyledComponentsThemeProvider, css, DefaultTheme } from 'styled-components'
import { useDarkMode } from './context'

const WIDTH_UP_TO = {
  upToExtraSmall: 500,
  upToSmall: 720,
  upToMedium: 960,
  upToLarge: 1280
}

const WIDTH_FROM = {
  fromExtraSmall: 501,
  fromSmall: 721,
  fromMedium: 961,
  fromLarge: 1281
}

const mediaWidthTemplatesUpTo: {
  [width in keyof typeof WIDTH_UP_TO]: typeof css
} = Object.keys(WIDTH_UP_TO).reduce((accumulator, size) => {
  ;(accumulator as any)[size] = (a: any, b: any, c: any) => css`
    @media (max-width: ${(WIDTH_UP_TO as any)[size]}px) {
      ${css(a, b, c)}
    }
  `
  return accumulator
}, {}) as any

const mediaWidthTemplatesFrom: {
  [width in keyof typeof WIDTH_FROM]: typeof css
} = Object.keys(WIDTH_FROM).reduce((accumulator, size) => {
  ;(accumulator as any)[size] = (a: any, b: any, c: any) => css`
    @media (min-width: ${(WIDTH_FROM as any)[size]}px) {
      ${css(a, b, c)}
    }
  `
  return accumulator
}, {}) as any

const white = '#FFFFFF'
const black = '#000000'

export function colors(mode: string): Colors {
  return {
    // base
    white,
    black,

    // text
    text1: mode === 'dark' ? white : black,
    text2: mode === 'dark' ? white : '#353535',
    text3: mode === 'dark' ? '#d655fe' : '#9625ae',

    // backgrounds / greys
    bg1: mode === 'dark' ? '#1e1e1e' : white,
    bg2: mode === 'dark' ? '#1e1e1e' : '#eeeeee',
    bg3: mode === 'dark' ? '#2a2a2a' : white,
    grey1: '#434343',
    grey2: '#4e4e4e',
    grey3: '#2a2a2a',
    grey4: '#7d7d7d',
    grey5: '#1a1a1a',

    // specialty colors
    appLayoutFooterBorder: mode === 'dark' ? '#c4c4c4' : '#dedede',
    appLayoutFooterToggle: mode === 'dark' ? '#0c0c0c' : '#e1e1e1',
    textBox: mode === 'dark' ? '#474747' : '#808080',
    tokenRegistryWallet: mode === 'dark' ? '#191919' : '#ababab',
    walletModalWallet: mode === 'dark' ? '#1e1e1e' : '#e1e1e1',

    // primary colors
    primary1: '#302eb8',
    primary2: '#3735bb',

    // secondary colors
    secondary1: '#9e35b1',
    secondary2: '#9625ae',
    secondary3: '#6b33b0',
    secondary4: '#d655fe',

    // other
    error: '#D60000',
    success: '#27AE60'
  }
}

export function text(mode: string): Text {
  return {
    fontFamily: 'Montserrat',
    mainText: css`
      font-family: 'Montserrat';
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: ${mode === 'dark' ? white : black};
    `
  }
}

export function theme(mode: string): DefaultTheme {
  return {
    ...colors(mode),
    ...text(mode),

    margins: {
      '1x': '8px',
      '1.5x': '12px',
      '2x': '16px',
      '2.5x': '20px',
      '3x': '24px',
      '4x': '32px',
      '4.5x': '36px',
      '5x': '40px',
      '6x': '48px',
      '7x': '56px',
      '8x': '64px'
    },

    largeShadow: css`
      box-shadow: 0 7px 15px 9px rgb(${mode === 'dark' ? '13, 13, 13' : '189, 189, 189'}, 0.25);
    `,
    smallShadow: css`
      box-shadow: 0 4px 15px 2px rgb(0, 0, 0, ${mode === 'dark' ? '0.25' : '0.1'});
    `,

    mediaWidth: { ...mediaWidthTemplatesFrom, ...mediaWidthTemplatesUpTo },

    mainTransitionTime: '300ms',

    // css snippets
    flexCenter: css`
      display: flex;
      justify-content: center;
      align-items: center;
    `,
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `,
    largeBorderRadius: css`
      border-radius: 20px;
    `,
    smallBorderRadius: css`
      border-radius: 8px;
    `,
    roundedBorders: css`
      border-radius: 50px;
    `,

    // mixins
    measurements: (size) => css`
      height: ${size};
      width: ${size};
    `
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode } = useDarkMode()

  return <StyledComponentsThemeProvider theme={() => theme(mode)}>{children}</StyledComponentsThemeProvider>
}
