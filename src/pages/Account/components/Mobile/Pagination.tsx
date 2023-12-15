import React, { FC } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'

const WRAPPER = styled.div`
  ${tw`flex flex-row w-full items-center justify-end h-full`}
  border-top: 1px solid #3c3c3c;
  height: 100%;
  .imagesContainer {
    ${tw`flex items-center justify-center px-2`}
  }
  .imagesContainer img {
    ${tw`px-1 cursor-pointer`}
  }
`
type Pagination = {
  page: number
  limit: number
}
export const Pagination: FC<{
  pagination: Pagination
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>
}> = ({ pagination, setPagination }) => {
  const handleArrowClick = (side) => {
    if (side == 'back') {
      setPagination({ page: pagination.page - 1, limit: pagination.limit })
    } else if (side == 'next') {
      setPagination({ page: pagination.page + 1, limit: pagination.limit })
    }
  }
  return (
    <WRAPPER>
      <p>
        {pagination.page == 1 ? 1 : pagination.limit} of {pagination.page * pagination.limit} transactions
      </p>
      <div className="imagesContainer">
        <img
          src="/img/assets/arrow-circle-left-dark.svg"
          alt="arrow left"
          onClick={() => handleArrowClick('back')}
        />
        <img
          src="/img/assets/arrow-circle-right-light.svg"
          alt="arrow right"
          onClick={() => handleArrowClick('next')}
        />
      </div>
    </WRAPPER>
  )
}
