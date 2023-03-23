import { ReactElement } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import { Tooltip } from '../components'

export const HeaderTooltip = (text: string): ReactElement =>
  <img className="info-icon" src={`/img/assets/info-icon.svg`} alt="" /> && (
    <Tooltip dark placement="bottomLeft" color="#000000">
      <span>{text}</span>
    </Tooltip>
  )

export const STYLED_TITLE = styled.div`
  ${tw`flex flex-row items-center justify-center`}
  .textTitle {
    ${tw`font-semibold text-base`}
  }
  .info-icon {
    ${tw`w-[20px] h-[20px] block ml-2`}
  }
  .arrowDown {
    ${tw`sm:w-[17px] cursor-pointer sm:h-[8px] w-[18px] h-[7px] ml-[10px] duration-500`}
    transform: scale(1.3);
  }
  .invert {
    transform: rotate(180deg);
    transition: transform 500ms ease-out;
  }
  .tooltipIcon {
    margin-right: 8px;
  }
`
export const TableHeaderTitle = (
  text: string,
  infoText: string,
  isArrowDown: boolean,
  invert?: boolean
): ReactElement => (
  <STYLED_TITLE>
    <div className="textTitle">{text}</div>
    {infoText && HeaderTooltip(infoText)}
    {isArrowDown && (
      <img className={'arrowDown' + (invert ? ' invert' : '')} src={`/img/assets/arrow-down-grey.svg`} alt="" />
    )}
  </STYLED_TITLE>
)
