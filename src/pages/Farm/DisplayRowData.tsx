import React from 'react'
import styled, { css } from 'styled-components'
import { columns, STYLED_NAME } from './Columns'
import { Table } from 'antd'
import { STYLED_TABLE_LIST } from './TableList'
import { moneyFormatter } from '../../utils/math'

const ROW_CONTAINER = styled.div`
  display: flex;
  margin-left: ${({ theme }) => theme.margin(3)};
  padding-top: ${({ theme }) => theme.margin(3)};
  padding-bottom: ${({ theme }) => theme.margin(2)};
  .set-width {
    width: 14%;
  }
  .set-width-balance {
    width: 21%;
  }
  .set-width-earned {
    width: 20%;
  }
  .set-width-apr {
    width: 20%;
  }
  .set-width-liquidity {
    width: 20%;
  }
`

export const STYLED_EXPAND_ICON = styled.div`
  cursor: pointer;
  padding-top: -10px;
  margin-left: 3%;
  filter: ${({ theme }) => theme.filterDownIcon};
`

interface IFarmData {
  id: string
  image: string
  name: string
  earned: number
  apr: number
  rewards?: string
  liquidity: number
  type: string
  currentlyStaked: number
}

const DisplayRowData = ({ rowData, onExpandIcon }) => {
  return (
    <ROW_CONTAINER>
      <STYLED_NAME className="set-width">
        <img
          className={`coin-image ${rowData.type === 'Double Sided' ? 'double-sided' : ''}`}
          src={`/img/crypto/${rowData.image}.svg`}
          alt=""
        />
        <div className="text">{rowData.name}</div>
      </STYLED_NAME>
      <div className="liquidity normal-text set-width-balance">
        {rowData ? ` ${moneyFormatter(rowData.currentlyStaked)}` : 0.0}
      </div>
      <div className="liquidity normal-text set-width-earned">
        {rowData ? `${moneyFormatter(rowData.earned)}` : 0.0}
      </div>
      <div className="liquidity normal-text set-width-apr">{rowData ? `${0.0}%` : 0.0}</div>
      <div className="liquidity normal-text set-width-liquidity">
        {rowData ? `$ ${moneyFormatter(rowData.liquidity)}` : 0.0}
      </div>
      <STYLED_EXPAND_ICON onClick={() => onExpandIcon(rowData.id)}>
        <img src={'/img/assets/arrow-down-large.svg'} />
      </STYLED_EXPAND_ICON>
    </ROW_CONTAINER>
  )
}

export default DisplayRowData
