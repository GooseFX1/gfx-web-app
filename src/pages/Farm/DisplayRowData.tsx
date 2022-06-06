import styled from 'styled-components'
import { STYLED_NAME } from './Columns'
import { moneyFormatter, percentFormatter } from '../../utils/math'
import { Loader } from '../Farm/Columns'

const ROW_CONTAINER = styled.div`
  display: flex;
  margin-left: ${({ theme }) => theme.margin(3)};
  padding-top: ${({ theme }) => theme.margin(3)};
  padding-bottom: ${({ theme }) => theme.margin(2)};
  .set-width {
    width: 14%;
  }
  .set-width-balance {
    width: 17%;
    margin: auto;
    padding-right: 12px;
  }
  .set-width-earned {
    width: 20%;
    margin: auto;
    padding-left: 10px;
  }
  .set-width-apr {
    width: 20%;
    margin: auto;
  }
  .set-width-liquidity {
    width: 20%;
    margin: auto;
  }
  .set-width-volume {
    width: 21%;
    padding-right: 20px;
    margin: auto;
  }
`

export const STYLED_EXPAND_ICON = styled.div`
  cursor: pointer;
  margin-left: 3% !important;
  margin-right: 10px;
  margin-top: 10px;
  filter: ${({ theme }) => theme.filterDownIcon};
  transform: rotate(180deg);
`

const DisplayRowData = ({ rowData, onExpandIcon }) => {
  return (
    <ROW_CONTAINER>
      <STYLED_NAME className="set-width">
        <img
          className={`coin-image ${rowData?.type === 'Double Sided' ? 'double-sided' : ''}`}
          src={`/img/crypto/${rowData?.name.toUpperCase()}.svg`}
          alt=""
        />
        <div className="text">{rowData?.name}</div>
      </STYLED_NAME>
      <div className="liquidity normal-text set-width-balance">
        {rowData?.currentlyStaked >= 0 ? ` ${moneyFormatter(rowData.currentlyStaked)}` : <Loader />}
      </div>
      <div className="liquidity normal-text set-width-earned">
        {rowData?.earned >= 0 ? `${moneyFormatter(rowData?.earned)}` : <Loader />}
      </div>
      <div className="liquidity normal-text set-width-apr">
        {rowData?.apr === '-' ? '-' : rowData?.apr !== undefined ? `${percentFormatter(rowData?.apr)}` : <Loader />}
      </div>
      <div className="liquidity normal-text set-width-liquidity">
        {rowData?.liquidity >= 0 ? `$ ${moneyFormatter(rowData?.liquidity)}` : <Loader />}
      </div>
      <div className="liquidity normal-text set-width-volume">
        {rowData?.volume === '-' ? '-' : rowData.volume >= 0 ? `$ ${moneyFormatter(rowData?.volume)}` : <Loader />}
      </div>
      <div>
        <STYLED_EXPAND_ICON onClick={() => onExpandIcon(rowData.id)}>
          <img src={'/img/assets/arrow-down-large.svg'} />
        </STYLED_EXPAND_ICON>
      </div>
    </ROW_CONTAINER>
  )
}

export default DisplayRowData
