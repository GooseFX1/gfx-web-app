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
    text0: mode === 'dark' ? black : white,
    text1: mode === 'dark' ? white : black,
    text2: mode === 'dark' ? white : '#353535',
    text3: mode === 'dark' ? '#d655fe' : '#9625ae',
    text4: mode === 'dark' ? white : '#636363',
    text5: mode === 'dark' ? '#949494' : '#fff',
    text6: mode === 'dark' ? '#cccccc' : '#353535',
    text7: mode === 'dark' ? white : '#3C3C3C',
    text8: mode === 'dark' ? white : '#636363',
    text9: mode === 'dark' ? '#616161' : '#3C3C3C',
    text10: mode === 'dark' ? '#4b4b4b' : '#BDBDBD',
    text11: mode === 'dark' ? '#bebebe' : '#636363',
    text12: mode === 'dark' ? '#909090' : '#636363',
    text13: mode === 'dark' ? 'rgba(255, 255, 255, 0.55)' : '#636363',
    text14: mode === 'dark' ? '#b1b1b1' : '#fff',
    text15: mode === 'dark' ? '#b1b1b1' : '#7C7C7C',
    text1h: '#7d7d7d',

    // backgrounds / greys
    bg0: mode === 'dark' ? '#000' : '#fff',
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
    scrollBarColor: mode === 'dark' ? '#434343' : '#e0e0e0',

    // specialty colors
    appLayoutFooterBorder: mode === 'dark' ? '#c4c4c4' : '#dedede',
    appLayoutFooterToggle: mode === 'dark' ? '#0c0c0c' : '#e1e1e1',
    cryptoOrderHeaderBorder: mode === 'dark' ? '#9f9f9f' : white,
    tabsGradients: ['#3735bb', '#5232b9', '#672fb7', '#792cb4', '#8829b1', '#9625ae'],
    textBox: mode === 'dark' ? '#474747' : '#808080',
    walletModalWallet: mode === 'dark' ? '#1e1e1e' : '#e1e1e1',
    searchbarBackground: mode === 'dark' ? '#1e1e1e' : '#ababab',
    searchbarSmallBackground: mode === 'dark' ? '#404040' : '#ababab',
    collectionHeader: mode === 'dark' ? 'linear-gradient(0, #131313 0%, transparent 100%)' : '#fff',

    // modal
    closeIconColor: mode === 'dark' ? '#fff' : '#000',

    // avatar
    avatarBackground: mode === 'dark' ? '#000' : '#CACACA',
    avatarInnerBackground: mode === 'dark' ? '#000' : '#7D7D7D',

    // upload image
    uploadImageBackground: mode === 'dark' ? '#131313' : '#CACACA',

    // input bg
    inputBg: mode === 'dark' ? '#131313' : '#CACACA',
    hintInputColor: mode === 'dark' ? '#b9b9b9' : '#636363',

    // btn Icon (Plus, add more), btn Next Step Background
    btnIconBg: mode === 'dark' ? '#9625ae' : '#7D7D7D',
    btnNextStepBg: mode === 'dark' ? '#9625ae' : '#7D7D7D',

    // add properties
    iconRemoveBg: mode === 'dark' ? '#131313' : '#7D7D7D',
    inputPropertyBg: mode === 'dark' ? '#131313' : '#A7A7A7',
    inputFence: mode === 'dark' ? '#2a2a2a' : '#C7C7C7',
    propertyBg: mode === 'dark' ? '#131313' : '#C7C7C7',
    propertyItemBg: mode === 'dark' ? '#000' : '#7D7D7D',
    typePropertyColor: mode === 'dark' ? '#565656' : '#C7C7C7',

    // sell categories
    sellTabBg: mode === 'dark' ? '#131313' : '#CACACA',
    sellTabActiveBg: mode === 'dark' ? '#131313' : '#404040',

    // time panel
    timePanelBackground: mode === 'dark' ? '#131313' : '#CACACA',

    // nft detail
    nftDetailBackground: mode === 'dark' ? '#2a2a2a' : '#f4f4f4',

    // tab content current bid
    tabContentBidBackground: mode === 'dark' ? '#131313' : '#fff',
    tabContentBidFooterBackground:
      mode === 'dark' ? 'linear-gradient(90deg, rgba(25, 25, 25, 0.8) 0%, #131313 100%)' : 'rgba(64, 64, 64, 0.02)',
    borderColorTabBidFooter: mode === 'dark' ? '#131313' : '#EAEAEA',

    // trading history tab content
    tradingHistoryTabContentBackground: mode === 'dark' ? '#141414' : '#fff',

    // hover tr table
    hoverTrTableBackground: mode === 'dark' ? '#262626' : 'rgba(64, 64, 64, 0.2)',

    // atrribute tab content
    atrributeBg: mode === 'dark' ? '#2a2a2a' : '#B0B0B0',

    // main tab
    tabNameColor: mode === 'dark' ? '#616161' : '#8F8F8F',

    // farm
    farmContainerBg: mode === 'dark' ? '#1e1e1e' : '#eee',
    farmHeaderBg: mode === 'dark' ? '#181818' : '#313131',
    solPillBg: mode === 'dark' ? '#111' : '#313131',
    stakePillBg: mode === 'dark' ? '#1e1e1e' : 'rgba(49, 49, 49, 0.5)',
    hoverTrFarmBg: mode === 'dark' ? 'rgba(64, 64, 64, 0.7)' : 'rgba(64, 64, 64, 0.05)',
    tableHeaderBoxShadow: mode === 'dark' ? '0px 8px 6px -3px rgb(0 0 0 / 30%)' : 'none',
    tableListBoxShadow: mode === 'dark' ? 'none' : '-2px 27px 30px -10px rgb(189 189 189 / 25%)',
    expendedRowBg:
      mode === 'dark'
        ? 'linear-gradient(to bottom, #39253e, rgba(42, 42, 42, 0))'
        : 'linear-gradient(to bottom, rgba(134, 7, 160, 0.6), rgba(255, 255, 255, 0))',
    filterDownIcon:
      mode === 'dark'
        ? '#000'
        : 'invert(96%) sepia(96%) saturate(15%) hue-rotate(223deg) brightness(103%) contrast(106%)',

    // primary colors
    primary1: '#302eb8',
    primary2: '#3735bb',

    // secondary colors
    secondary1: '#9e35b1',
    secondary2: '#9625ae',
    secondary3: '#6b33b0',
    secondary4: '#d655fe',
    secondary5: '#3735bb',

    // other
    asks: '#9b2c2c',
    bids: '#459631',
    error: '#D60000',
    success: '#27AE60',

    // filter
    filterBackIcon:
      mode === 'dark'
        ? 'invert(96%) sepia(96%) saturate(15%) hue-rotate(223deg) brightness(103%) contrast(106%)'
        : '#000',

    filterHeartIcon:
      mode === 'dark'
        ? '#131313'
        : 'invert(75%) sepia(96%) saturate(15%) hue-rotate(223deg) brightness(103%) contrast(106%)'
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

    margin: (size1?: number, size2?: number, size3?: number, size4?: number) => {
      let pixelStr = ''
      if (typeof size1 === 'number') {
        pixelStr = `${size1 * 8}px`
      } else {
        return '8px'
      }
      if (typeof size2 === 'number') {
        pixelStr = `${pixelStr} ${size2 * 8}px`
      } else {
        return pixelStr
      }
      if (typeof size3 === 'number') {
        pixelStr = `${pixelStr} ${size3 * 8}px`
      } else {
        return pixelStr
      }
      if (typeof size4 === 'number') {
        pixelStr = `${pixelStr} ${size4 * 8}px`
      }
      return pixelStr
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
    flexColumnReverse: css`
      display: flex;
      flex-flow: column-reverse nowrap;
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
    headerRoundedBorders: css`
      border-bottom-left-radius: 50px;
      border-bottom-right-radius: 50px;
    `,

    // mixins
    measurements: (size) => css`
      height: ${size};
      width: ${size};
    `,

    customScrollBar: (size) => css`
      scrollbar-width: thin;
      scrollbar-color: ${({ theme }) => theme.scrollBarColor} transparent;

      &::-webkit-scrollbar {
        width: ${size};
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background-color: ${({ theme }) => theme.scrollBarColor};
        border-radius: 20px;
    `
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode } = useDarkMode()

  return <StyledComponentsThemeProvider theme={() => theme(mode)}>{children}</StyledComponentsThemeProvider>
}
