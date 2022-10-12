import { Color } from './theme.d'
import { FlattenSimpleInterpolation, ThemedCssFunction, CSSProp } from 'styled-components'
//import tw from 'twin.macro'

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
  text16: Color
  text17: Color
  text18: Color
  text19: Color
  text20: Color
  text21: Color
  text22: Color
  text23: Color
  text24: Color
  text25: Color
  text26: Color
  textWhitePurple: Color
  comingSoon: Color
  blackToGrey: Color
  tableBorder: Color
  borderBottom: Color

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
  bg9: Color
  bg10: Color
  bg11: Color
  bg12: Color
  bg13: Color
  bg14: Color
  bg15: Color
  bg16: Color
  bg17: Color
  bg18: Color
  bg19: Color
  lpbg: Color
  pbbg: Color
  goBtn: Color
  innerCircle: Color
  circleBoxShadow: Color
  swapSides1: Color
  swapSides2: Color
  modalBackground: Color
  infoDivBackground: Color
  bgReward: Color
  substractImg: Color
  grey1: Color
  grey2: Color
  grey3: Color
  grey4: Color
  grey5: Color
  darkButton: Color
  scrollBarColor: Color
  opacity: Color

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

  // card
  cardBg: Color
  boxShadow: Color
  fade: Color
  // share modal
  textShareModal: Color

  // share modal
  textShareModal: Color

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
  propertyBg2: Color
  propertyItemBg: Color
  typePropertyColor: Color

  // sell categories
  sellTabBg: Color
  sellTabActiveBg: Color

  // time panel
  timePanelBackground: Color
  tabDivider: Color

  // nft detail
  nftDetailBackground: Color
  sweepModalCard: Color
  sweepPriceCard: Color
  sweepProgressCard: Color

  profileTabContainerBg: Color
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

  primary1Active: Color

  // primary
  primary1: Color
  primary2: Color
  primary3: Color
  primary4: Color

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
  filterArrowDown: Color
  tableHeader: Color
  cellBackground: Color

  // secondary
  secondary1: Color
  secondary2: Color
  secondary3: Color
  secondary4: Color
  secondary5: Color
  secondary6: Color
  secondary7: Color

  // other
  buys: Color
  asks: Color
  bids: Color
  error: Color
  success: Color

  //dexv2
  rowSeparator: Color

  // Filter
  filterBackIcon: Color
  filterWhiteIcon: Color
  filterHeartIcon: Color
  filterCloseModalIcon: Color
}

export type Font = string

declare module 'twin.macro' {
  // The styled and css imports
  const styled: typeof styledImport
  const css: typeof cssImport
}

declare module 'react' {
  // The css prop
  interface HTMLAttributes<T> extends DOMAttributes<T> {
    css?: CSSProp
    tw?: string
  }
  // The inline svg css prop
  //eslint-disable-next-line
  interface SVGProps<T> extends SVGProps<SVGSVGElement> {
    css?: CSSProp
    tw?: string
  }
}

// The 'as' prop on styled components
declare global {
  namespace JSX {
    interface IntrinsicAttributes<T> extends DOMAttributes<T> {
      as?: string | Element
    }
  }
}

export interface Text {
  fontFamily: Font
  mainText: FlattenSimpleInterpolation
}

declare module 'styled-components' {
  export interface DefaultTheme extends Colors, Text {
    margin: (size1?: number, size2?: number, size3?: number, size4?: number) => string

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
