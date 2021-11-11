import React from 'react'
import { Card } from './Card'
import { NoContent } from './NoContent'
import { SearchBar } from '../SearchBar'
import { TableList } from './TableList'
import { StyledTabContent } from './TabContent.styled'

interface Props {
  type: string
  data?: Array<number>
}

export const TabContent = ({ data, type }: Props) => {
  return (
    <StyledTabContent>
      {type !== 'activity' && (
        <div className="actions-group">
          <div className="search-group">
            <SearchBar />
            <div className="total-result">{data && data.length > 0 ? '2,335 Items' : '0 Item'}</div>
          </div>
        </div>
      )}
      {data && data.length > 0 ? (
        type !== 'activity' ? (
          <div className="cards-list">
            {data.map((n: number, index: number) => (
              <Card key={index} data={{ order: n, type: type }} />
            ))}
          </div>
        ) : (
          <TableList />
        )
      ) : (
        <NoContent type={type} />
      )}
    </StyledTabContent>
  )
}
