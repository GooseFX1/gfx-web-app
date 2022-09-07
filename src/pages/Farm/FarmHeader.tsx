import React, { FC } from 'react'
import styled from 'styled-components'
// import { Toggle } from './Toggle'
// import { SearchBar, Categories } from '../../components'
// import { Button } from 'antd'
import { FarmFilter } from './FarmFilterHeader'

// const STYLED_FARM_HEADER = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   padding: 10px 10px;
//   border-radius: 20px 20px 25px 25px;
//   .search-bar {
//     height: 44px;
//     margin: 0;
//     background: #000;
//     input {
//       background: #000;
//     }
//   }
//   .pools {
//     height: 44px;
//     max-width: 132px;
//     margin-left: ${({ theme }) => theme.margin(4.5)};
//     > span {
//       font-family: Montserrat;
//       font-size: 14px;
//       font-weight: 600;
//       color: #fff;
//     }
//   }
//   .live {
//     margin-left: ${({ theme }) => theme.margin(4.5)};
//   }
// `

const STYLED_RIGHT = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border: 20px !important;
  padding-left: ${({ theme }) => theme.margin(11)};
`
export const FarmHeader: FC<{ onFilter?: () => void }> = ({}) => {
  return (
    <>
      <FarmFilter />
      <STYLED_RIGHT>
        {/* <Categories className="pools" categories={poolTypes} /> */}
        {/* <Toggle className="live" checkedChildren="Ended" unCheckedChildren="Live" defaultChecked={false} /> */}
      </STYLED_RIGHT>
    </>
  )
}
