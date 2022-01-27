import { FlattenSimpleInterpolation, ThemedCssFunction } from 'styled-components'

export type Color = string

export interface Colors {
  // base
  white: Color
  black: Color

  // text
  text0: Color
  text1: Color
  text1h: Color
  text2: Color
  text3: Color
  text4: Color
  text5: Color
  text6: Color
  text7: Color
  text8: Color
  text9: Color
  text10: Color
  text11: Color
  text12: Color
  text13: Color
  text14: Color
  text15: Color

  // backgrounds / greys
  bg0: Color
  bg1: Color
  bg2: Color
  bg3: Color
  bg4: Color
  bg5: Color
  bg6: Color
  bg7: Color
  bg8: Color
  grey1: Color
  grey2: Color
  grey3: Color
  grey4: Color
  grey5: Color
  darkButton: Color
  scrollBarColor: Color

  // speciality colors
  appLayoutFooterBorder: Color
  appLayoutFooterToggle: Color
  cryptoOrderHeaderBorder: Color
  tabsGradients: Color[]
  textBox: Color
  walletModalWallet: Color
  searchbarBackground: Color
  searchbarSmallBackground: Color
  collectionHeader: Color

  // modal
  closeIconColor: Color

  // avatar
  avatarBackground: Color
  avatarInnerBackground: Color

  // upload image
  uploadImageBackground: Color

  // input bg
  inputBg: Color
  hintInputColor: Color

  // btn Icon (Plus, add more), btn Next Step Background
  btnIconBg: Color
  btnNextStepBg: Color

  // add properties
  iconRemoveBg: Color
  inputPropertyBg: Color
  inputFence: Color
  propertyBg: Color
  propertyItemBg: Color
  typePropertyColor: Color

  // sell categories
  sellTabBg: Color
  sellTabActiveBg: Color

  // time panel
  timePanelBackground: Color

  // nft detail
  nftDetailBackground: Color

  // tab content current bid
  tabContentBidBackground: Color
  tabContentBidFooterBackground: Color
  borderColorTabBidFooter: Color

  // trading history tab content
  tradingHistoryTabContentBackground: Color

  // hover tr table
  hoverTrTableBackground: Color

  // atrribute tab content
  atrributeBg: Color

  // main tab
  tabNameColor: Color

  // primary
  primary1: Color
  primary2: Color

  // farm
  farmContainerBg: Color
  farmHeaderBg: Color
  solPillBg: Color
  stakePillBg: Color
  hoverTrFarmBg: Color
  tableHeaderBoxShadow: Color
  tableListBoxShadow: Color
  expendedRowBg: Color
  filterDownIcon: Color

  // secondary
  secondary1: Color
  secondary2: Color
  secondary3: Color
  secondary4: Color
  secondary5: Color

  // other
  asks: Color
  bids: Color
  error: Color
  success: Color

  // Filter
  filterBackIcon: Color
  filterHeartIcon: Color
}

export type Font = string

export interface Text {
  fontFamily: Font
  mainText: FlattenSimpleInterpolation
}

declare module 'styled-components' {
  export interface DefaultTheme extends Colors, Text {
    margins: {
      '0.5x': string
      '1x': string
      '1.5x': string
      '2x': string
      '2.5x': string
      '3x': string
      '3.5x': string
      '4x': string
      '4.5x': string
      '5x': string
      '5.5x': string
      '6x': string
      '7x': string
      '8x': string
      '9x': string
      '10x': string
      '11x': string
    }

    // shadows
    largeShadow: FlattenSimpleInterpolation
    smallShadow: FlattenSimpleInterpolation

    // media queries
    mediaWidth: {
      upToExtraSmall: ThemedCssFunction<DefaultTheme>
      fromExtraSmall: ThemedCssFunction<DefaultTheme>
      upToSmall: ThemedCssFunction<DefaultTheme>
      fromSmall: ThemedCssFunction<DefaultTheme>
      upToMedium: ThemedCssFunction<DefaultTheme>
      fromMedium: ThemedCssFunction<DefaultTheme>
      upToLarge: ThemedCssFunction<DefaultTheme>
      fromLarge: ThemedCssFunction<DefaultTheme>
    }

    hapticTransitionTime: string
    mainTransitionTime: string

    // css snippets
    ellipse: FlattenSimpleInterpolation
    flexCenter: FlattenSimpleInterpolation
    flexColumnNoWrap: FlattenSimpleInterpolation
    flexColumnReverse: FlattenSimpleInterpolation
    flexRowNoWrap: FlattenSimpleInterpolation
    largeBorderRadius: FlattenSimpleInterpolation
    smallBorderRadius: FlattenSimpleInterpolation
    roundedBorders: FlattenSimpleInterpolation
    headerRoundedBorders: FlattenSimpleInterpolation

    // mixins
    measurements: (number) => FlattenSimpleInterpolation
    customScrollBar: (number) => FlattenInterpolation<ThemeProps<DefaultTheme>>
  }
}
