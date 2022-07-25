import styled from 'styled-components'
import { STYLED_NAME } from './Columns'
import { moneyFormatter, percentFormatter } from '../../utils/math'
import { Loader } from '../Farm/Columns'
import { checkMobile } from '../../utils'
import tw from 'twin.macro'

const ROW_CONTAINER = styled.div`
${tw`sm:m-0 sm:pt-[38px] sm:pb-0 sm:pl-[22px] sm:pr-[0]`}
  display: flex;
  margin-left: ${({ theme }) => theme.margin(3)};
  padding-top: ${({ theme }) => theme.margin(3)};
  padding-bottom: ${({ theme }) => theme.margin(2)};

  .set-width {
    ${tw`sm:w-[45%] w-[14%]`}
  }
  .set-width-balance {
    width: 17%;
    margin: auto;
    padding-right: 12px;
  }
  .set-width-earned {
    ${tw`sm:flex sm:items-center sm:justify-center sm:w-full sm:my-0 sm:mx-auto sm:pl-px w-1/5 m-auto pl-2.5`}
  }
  .set-width-apr {
    ${tw`sm:w-full sm:ml-[-4%] w-1/5 m-auto`}
    width: 20%;
    margin: auto;

    @media(max-width: 500px){
      width: 100%;
      margin-left: -4%;
    }
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
  ${tw`sm:m-0 sm:mt-2.5  cursor-pointer`}
  margin-left: 3% !important;
  margin-right: 10px;
  margin-top: 10px;
  filter: ${({ theme }) => theme.filterArrowDown};
  transform: rotate(180deg);
`
const EXPAND_ICON_WRAPPER = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 42%;
`
const DisplayRowData = ({ rowData, onExpandIcon }) => {
  return !checkMobile() ? (
    <ROW_CONTAINER>
      <STYLED_NAME className="set-width">
        <img
          className={`coin-image ${rowData?.type === 'Double Sided' ? 'double-sided' : ''}`}
          src={`/img/crypto/${rowData?.name.toUpperCase()}.svg`}
          alt=""
        />
        <div className="textName">{rowData?.name}</div>
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
  ) : (
    <ROW_CONTAINER>
      <STYLED_NAME className="set-width">
        <img
          className={`coin-image ${rowData?.type === 'Double Sided' ? 'double-sided' : ''}`}
          src={`/img/crypto/${rowData?.name.toUpperCase()}.svg`}
          alt=""
        />
        <div className="textName">{rowData?.name}</div>
      </STYLED_NAME>
      <div className="liquidity normal-text set-width-apr">
          {rowData?.apr === '-' ? '-' : rowData?.apr !== undefined ? `${percentFormatter(rowData?.apr)}` : <Loader />}
        </div>
      <EXPAND_ICON_WRAPPER>
        <STYLED_EXPAND_ICON onClick={() => onExpandIcon(rowData.id)}>
          <img src={'/img/assets/arrow-down-large.svg'} />
        </STYLED_EXPAND_ICON>
      </EXPAND_ICON_WRAPPER>
    </ROW_CONTAINER>
  )
}

export default DisplayRowData
