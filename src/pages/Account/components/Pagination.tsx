import React, { FC } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { useDarkMode } from '../../../context'

const WRAPPER = styled.div`
  ${tw`flex flex-row w-full items-center justify-end h-full`}
  border-top: 1px solid #3c3c3c;
  color: ${({ theme }) => theme.text2};
  height: 100%;
  .imagesContainer {
    ${tw`flex items-center justify-center px-2`}
  }
  .imagesContainer img {
    ${tw`px-1 cursor-pointer`}
  }

  .svg-to-grey {
    filter: invert(70%);
  }
`
type Pagination = {
  page: number
  limit: number
}
export const Pagination: FC<{
  pagination: Pagination
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>
  totalItemsCount: number
}> = ({ pagination, setPagination, totalItemsCount }) => {
  const { mode } = useDarkMode()
  const totalAlreadyFetched = pagination.page * pagination.limit >= totalItemsCount
  const handleArrowClick = (side: 'back' | 'next') => {
    if (side == 'back' && pagination.page !== 1) {
      setPagination({ page: pagination.page - 1, limit: pagination.limit })
    } else if (side == 'next' && !totalAlreadyFetched) {
      setPagination({ page: pagination.page + 1, limit: pagination.limit })
    }
  }
  return (
    <WRAPPER>
      <p>
        {pagination.page == 1
          ? 1
          : pagination.page * pagination.limit >= totalItemsCount
          ? totalItemsCount - pagination.limit * (pagination.page - 1)
          : pagination.limit}{' '}
        of{' '}
        {pagination.page * pagination.limit >= totalItemsCount
          ? totalItemsCount
          : pagination.page * pagination.limit}{' '}
        transactions
      </p>
      <div className="imagesContainer">
        <img
          src={
            mode === 'lite'
              ? '/img/assets/Aggregator/circularArrowlite.svg'
              : '/img/assets/Aggregator/circularArrowdark.svg'
          }
          alt="arrow left"
          style={{ transform: 'rotate(90deg)' }}
          className={mode != 'lite' && pagination.page == 1 ? 'svg-to-grey' : ''}
          onClick={() => handleArrowClick('back')}
        />
        <img
          src={
            mode === 'lite'
              ? '/img/assets/Aggregator/circularArrowlite.svg'
              : '/img/assets/Aggregator/circularArrowdark.svg'
          }
          alt="arrow right"
          style={{ transform: 'rotate(270deg)' }}
          className={mode != 'lite' && pagination.page * pagination.limit >= totalItemsCount ? 'svg-to-grey' : ''}
          onClick={() => handleArrowClick('next')}
        />
      </div>
    </WRAPPER>
  )
}
