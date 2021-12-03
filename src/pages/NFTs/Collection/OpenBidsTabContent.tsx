import { FC } from 'react'
import { useHistory } from 'react-router'
import styled, { css } from 'styled-components'
import { Card } from './Card'
import { NFTsData } from './mockData'

const OPEN_BIDS_TAB = styled.div`
  ${({ theme }) => css`
    overflow-y: auto;
    padding: ${theme.margins['5.5x']} ${theme.margins['4x']};

    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: ${theme.margins['6x']};

    &::-webkit-scrollbar {
      display: none;
    }
  `}
`

export const OpenBidsTabContent: FC = ({ ...rest }) => {
  const history = useHistory()
  const goToOpenBidDetails = (id: string): void => history.push(`/NFTs/open-bid/${id}`)

  return (
    <OPEN_BIDS_TAB {...rest}>
      {NFTsData.map((item) => (
        <div onClick={() => goToOpenBidDetails(item.id)}>
          <Card type="grid" key={item.id} data={item} />
        </div>
      ))}
    </OPEN_BIDS_TAB>
  )
}
