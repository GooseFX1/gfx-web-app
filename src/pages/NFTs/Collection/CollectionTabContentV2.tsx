import styled, { css } from 'styled-components'
import { Card } from './Card'
import { mockCollectionTabContentData } from './mockData'

const WRAPPER = styled.div`
  min-height: 410px;
`

const COLLECTION_TAB_CONTENT = styled.div`
  ${({ theme }) => css`
    overflow-y: auto;
    padding: ${theme.margin(5.5)} ${theme.margin(4)};

    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    grid-gap: ${theme.margin(3)};

    &::-webkit-scrollbar {
      display: none;
    }
  `}
`

export const CollectionTabContentV2 = ({ type }: { type: string }) => {
  return (
    <WRAPPER>
      <COLLECTION_TAB_CONTENT>
        {mockCollectionTabContentData.map((item, index) => (
          <div key={index}>
            <Card singleNFT={item} tab={type} />
          </div>
        ))}
      </COLLECTION_TAB_CONTENT>
    </WRAPPER>
  )
}
