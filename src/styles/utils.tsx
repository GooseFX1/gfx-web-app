import styled from 'styled-components'
import tw from 'twin.macro'

export const CenteredDiv = styled.div`
  ${({ theme }) => theme.flexCenter}
`

export const CenteredImg = styled(CenteredDiv)`
  > img {
    ${({ theme }) => theme.measurements('inherit')}
    object-fit: contain;
  }
`

export const FlexColumnDiv = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
`

export const SpaceBetweenDiv = styled.div`
  ${tw`flex items-center justify-between`}
`

export const AlignCenterDiv = styled.div`
  ${tw`flex items-center`}
`

export const SpaceEvenlyDiv = styled.div`
  ${tw`flex items-center justify-evenly`}
`

export const MediaFromMediumDiv = styled.div`
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `}
`

export const SVGToGrey2 = styled.img`
  filter: invert(27%) sepia(0%) saturate(1006%) hue-rotate(223deg) brightness(101%) contrast(86%);
`

export const SVGToPrimary2 = styled.img`
  filter: invert(45%) sepia(93%) saturate(6113%) hue-rotate(235deg) brightness(107%) contrast(102%);
`

export const SVGToWhite = styled.img`
  filter: invert(96%) sepia(73%) saturate(2%) hue-rotate(192deg) brightness(150%) contrast(101%); ;
`
export const SVGToBlack = styled.img`
  filter: invert(100%);
`

export const SVGDynamicMode = styled.img`
  filter: ${({ theme }) => theme.filterBackIcon};
`

export const SVGDynamicReverseMode = styled.img`
  filter: ${({ theme }) => theme.filterWhiteIcon};
`
export const SVGBlackToGrey = styled.img`
  filter: ${({ theme }) => theme.blackToGrey};
`

export const TOGGLE = styled(CenteredDiv)<{ $mode: string }>`
  height: 30px;
  width: 60px;
  border-radius: 30px;
  margin-right: ${({ theme }) => theme.margin(5)};
  background-color: ${({ theme }) => theme.appLayoutFooterToggle};
  &:hover {
    cursor: pointer;
  }
  > div {
    ${({ theme }) => theme.measurements(theme.margin(2.5))}
    ${({ theme }) => theme.roundedBorders}
    background-color: ${({ theme }) => theme.secondary2};
    transform: translateX(${({ $mode }) => ($mode === 'dark' ? '-' : '')}${({ theme }) => theme.margin(1.5)});
  }
`
