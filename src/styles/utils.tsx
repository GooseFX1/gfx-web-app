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
  filter: invert(96%) sepia(96%) saturate(15%) hue-rotate(223deg) brightness(103%) contrast(106%);
`
export const SVGToBlack = styled.img`
  filter: invert(1%);
`
