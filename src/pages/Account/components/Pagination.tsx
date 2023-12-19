import React, { FC, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { useDarkMode } from '../../../context'

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
  const [lastClicked, setLastClicked] = useState<'back' | 'next'>('next')
  const { mode } = useDarkMode()
  const totalAlreadyFetched = pagination.page * pagination.limit >= totalItemsCount
  const handleArrowClick = (side: 'back' | 'next') => {
    if (side == 'back' && pagination.page !== 1) {
      setPagination({ page: pagination.page - 1, limit: pagination.limit })
      setLastClicked('back')
    } else if (side == 'next' && !totalAlreadyFetched) {
      setPagination({ page: pagination.page + 1, limit: pagination.limit })
      setLastClicked('next')
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
          className={mode != 'lite' && lastClicked === 'next' ? 'svg-to-grey' : ''}
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
          className={mode != 'lite' && lastClicked === 'back' ? 'svg-to-grey' : ''}
          onClick={() => handleArrowClick('next')}
        />
      </div>
    </WRAPPER>
  )
}
