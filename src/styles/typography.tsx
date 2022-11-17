import styled, { AnyStyledComponent } from 'styled-components'
import { Color } from '../types/theme'
import { text } from '../theme'
import tw from 'twin.macro'

const { fontFamily } = text('Montserrat')

export const H1 = styled.h1<{ $color: string }>`
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  color: ${({ $color }) => $color};
  ${tw`py-8 px-10`}

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 2rem;
  `}
  ${({ theme }) => theme.mediaWidth.fromSmall`
    font-size: 3rem;
  `}
  ${({ theme }) => theme.mediaWidth.fromLarge`
    font-size: 4rem;
  `}
`

export const H2 = (color?: Color): AnyStyledComponent => styled.h2`
  font-family: ${fontFamily};
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: ${({ theme }) => color || theme.text1};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 1rem;
  `}
  ${({ theme }) => theme.mediaWidth.fromSmall`
    font-size: 1.6rem;
  `}
  ${({ theme }) => theme.mediaWidth.fromMedium`
    font-size: 2.2rem;
  `}
  ${({ theme }) => theme.mediaWidth.fromLarge`
    font-size: 2rem;
  `}
`

export const H3 = (color?: Color): AnyStyledComponent => styled.h3`
  font-family: ${fontFamily};
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: ${({ theme }) => color || theme.text1};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 0.7rem;
  `}
  ${({ theme }) => theme.mediaWidth.fromSmall`
    font-size: 0.9rem;
  `}
  ${({ theme }) => theme.mediaWidth.fromMedium`
    font-size: 1.1rem;
  `}
  ${({ theme }) => theme.mediaWidth.fromLarge`
    font-size: 1.5rem;
  `}
`

export const MainText = (t: AnyStyledComponent, color?: Color): AnyStyledComponent => styled(t)`
  font-family: ${fontFamily};
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: ${({ theme }) => color || theme.text1};
`

export const TextSmall = (t: AnyStyledComponent, color?: Color): AnyStyledComponent => styled(t)`
  font-family: ${fontFamily};
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: ${({ theme }) => color || theme.text1};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 9px
  `}
  ${({ theme }) => theme.mediaWidth.fromSmall`
    font-size: 12px
  `}
  ${({ theme }) => theme.mediaWidth.fromMedium`
    font-size: 14px
  `}
`

export const TextSmallBold = (t: AnyStyledComponent, color?: Color): AnyStyledComponent => styled(t)`
  font-family: ${fontFamily};
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  font-weight: bold;
  color: ${({ theme }) => color || theme.text1};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 10px
  `}
  ${({ theme }) => theme.mediaWidth.fromSmall`
    font-size: 12px
  `}
  ${({ theme }) => theme.mediaWidth.fromMedium`
    font-size: 14px
  `}
`

export const TextMedium = (t: AnyStyledComponent, color?: Color): AnyStyledComponent => styled(t)`
  font-family: ${fontFamily};
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: ${({ theme }) => color || theme.text1};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 14px;
  `}
  ${({ theme }) => theme.mediaWidth.fromSmall`
    font-size: 18px
  `}
  ${({ theme }) => theme.mediaWidth.fromMedium`
    font-size: 20px
  `}
`

export const TextMediumBold = (t: AnyStyledComponent, color?: Color): AnyStyledComponent => styled(t)`
  font-family: ${fontFamily};
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  font-weight: bold;
  color: ${({ theme }) => color || theme.text1};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 14px;
  `}
  ${({ theme }) => theme.mediaWidth.fromSmall`
    font-size: 18px
  `}
  ${({ theme }) => theme.mediaWidth.fromMedium`
    font-size: 20px
  `}
`

export const TextLarge = (t: AnyStyledComponent, color?: Color): AnyStyledComponent => styled(t)`
  font-family: ${fontFamily};
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: ${({ theme }) => color || theme.text1};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 13px;
  `}
  ${({ theme }) => theme.mediaWidth.fromSmall`
    font-size: 24px;
  `}
  ${({ theme }) => theme.mediaWidth.fromMedium`
    font-size: 20px;
  `}
`

export const TextLargeBold = (t: AnyStyledComponent, color?: Color): AnyStyledComponent => styled(t)`
  font-family: ${fontFamily};
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  font-weight: bold;
  color: ${({ theme }) => color || theme.text1};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 16px;
  `}
  ${({ theme }) => theme.mediaWidth.fromSmall`
    font-size: 25px;
  `}
  ${({ theme }) => theme.mediaWidth.fromMedium`
    font-size: 28px;
  `}
`

export const TextXLarge = (t: AnyStyledComponent, color?: Color): AnyStyledComponent => styled(t)`
  font-family: ${fontFamily};
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: ${({ theme }) => color || theme.text1};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 16px;
  `}
  ${({ theme }) => theme.mediaWidth.fromSmall`
    font-size: 25px;
  `}
  ${({ theme }) => theme.mediaWidth.fromMedium`
    font-size: 26px;
  `}
`

export const TextXLargeBold = (t: AnyStyledComponent, color?: Color): AnyStyledComponent => styled(t)`
  font-family: ${fontFamily};
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  font-weight: bold;
  color: ${({ theme }) => color || theme.text1};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 28px;
  `}
  ${({ theme }) => theme.mediaWidth.fromSmall`
    font-size: 28px;
  `}
  ${({ theme }) => theme.mediaWidth.fromMedium`
    font-size: 28px;
  `}
`

export const TXT_PRIMARY_GRADIENT = styled.span`
  font-weight: 600;
  background-image: linear-gradient(to right, #716fff 7%, #e959ff 88%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

export const GFX_LINK = styled.a<{ fontSize?: number }>`
  font-family: '${fontFamily}';
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  font-weight: bold;
  color: ${({ theme }) => theme.secondary4};
  border-bottom: 2px solid ${({ theme }) => theme.secondary4};
  font-size: ${({ fontSize }) => (fontSize ? fontSize : '14')}px;
  line-height: ${({ fontSize }) => (fontSize ? fontSize + 2 : '16')}px;

  &:hover {
    color: ${({ theme }) => theme.secondary1};
  }
`
