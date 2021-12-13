import { FC } from 'react'
import { useHistory } from 'react-router'
import styled, { css } from 'styled-components'
import { Card } from './Card'
import { NFTsData } from './mockData'

const FIXED_PRICE_TAB = styled.div`
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

export const FixedPriceTabContent: FC = ({ ...rest }) => {
  const history = useHistory()
  const goToFixedPriceDetails = (id: string): void => history.push(`/NFTs/fixed-price/${id}`)

  return (
    <FIXED_PRICE_TAB {...rest}>
      {NFTsData.map((item) => (
        <div onClick={() => goToFixedPriceDetails(item.id)}>
          <Card type="grid" key={item.id} data={item} />
        </div>
      ))}
    </FIXED_PRICE_TAB>
  )
}
