import styled from 'styled-components'

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
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const AlignCenterDiv = styled.div`
  display: flex;
  align-items: center;
`

export const SpaceEvenlyDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
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
  filter: invert(16%) sepia(44%) saturate(7248%) hue-rotate(243deg) brightness(84%) contrast(89%);
`

export const SVGToWhite = styled.img`
  filter: invert(96%) sepia(96%) saturate(15%) hue-rotate(223deg) brightness(103%) contrast(80%);
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

export const MODE_ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margin(2))};
  .moon-image {
    width: 15px;
    height: 15px;
    margin-right: ${({ theme }) => theme.margin(1)};
  }
  .brightness-image {
    width: 19px;
    height: 19px;
  }
`
