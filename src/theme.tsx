import React from 'react'
import { ThemeProvider as StyledComponentsThemeProvider, css, DefaultTheme } from 'styled-components'
import { useDarkMode } from './context'
import type { Colors, Text } from './types/theme'

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
    text4: mode === 'dark' ? white : '#636363',
    text5: mode === 'dark' ? '#949494' : '#fff',
    text1h: '#7d7d7d',

    // backgrounds / greys
    bg1: mode === 'dark' ? '#1e1e1e' : white,
    bg2: mode === 'dark' ? '#1e1e1e' : '#eeeeee',
    bg3: mode === 'dark' ? '#2a2a2a' : white,
    bg4: mode === 'dark' ? '#171717' : '#f4f4f4',
    bg5: mode === 'dark' ? black : '#e0e0e0',
    bg6: mode === 'dark' ? 'black' : 'gray',
    bg7: mode === 'dark' ? '#131313' : 'gray',
    bg8: mode === 'dark' ? 'rgba(64, 64, 64, 0.22)' : 'gray',
    grey1: '#434343',
    grey2: '#4e4e4e',
    grey3: '#2a2a2a',
    grey4: '#121212',
    grey5: '#1a1a1a',
    darkButton: '#000000',

    // specialty colors
    appLayoutFooterBorder: mode === 'dark' ? '#c4c4c4' : '#dedede',
    appLayoutFooterToggle: mode === 'dark' ? '#0c0c0c' : '#e1e1e1',
    cryptoOrderHeaderBorder: mode === 'dark' ? '#9f9f9f' : white,
    tabsGradients: ['#3735bb', '#5232b9', '#672fb7', '#792cb4', '#8829b1', '#9625ae'],
    textBox: mode === 'dark' ? '#474747' : '#808080',
    walletModalWallet: mode === 'dark' ? '#1e1e1e' : '#e1e1e1',
    searchbarBackground: mode === 'dark' ? '#1e1e1e' : '#ababab',
    collectionHeader:
      mode === 'dark'
        ? 'linear-gradient(0, #131313 0%, transparent 100%)'
        : 'linear-gradient(0deg,rgba(0,0,0,1) 3%,rgba(30,30,30,1) 43%)',

    // primary colors
    primary1: '#302eb8',
    primary2: '#3735bb',

    // secondary colors
    secondary1: '#9e35b1',
    secondary2: '#9625ae',
    secondary3: '#6b33b0',
    secondary4: '#d655fe',

    // other
    asks: '#9b2c2c',
    bids: '#459631',
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
      '0.5x': '4px',
      '1x': '8px',
      '1.5x': '12px',
      '2x': '16px',
      '2.5x': '20px',
      '3x': '24px',
      '3.5x': '28px',
      '4x': '32px',
      '4.5x': '36px',
      '5x': '40px',
      '5.5x': '44px',
      '6x': '48px',
      '7x': '56px',
      '8x': '64px',
      '9x': '72px',
      '10x': '80px',
      '11x': '88px'
    },

    largeShadow: css`
      box-shadow: 0 7px 15px 9px rgb(${mode === 'dark' ? '13, 13, 13' : '189, 189, 189'}, 0.25);
    `,
    smallShadow: css`
      box-shadow: 0 4px 15px 2px rgb(0, 0, 0, ${mode === 'dark' ? '0.25' : '0.1'});
    `,

    mediaWidth: { ...mediaWidthTemplatesFrom, ...mediaWidthTemplatesUpTo },

    hapticTransitionTime: '200ms',
    mainTransitionTime: '500ms',

    // css snippets
    ellipse: css`
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `,
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
