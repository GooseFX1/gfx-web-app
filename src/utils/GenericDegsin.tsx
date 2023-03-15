import { FC, ReactElement } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import { Tooltip } from '../components'

export const HeaderTooltip = (text: string): ReactElement =>
  <img className="info-icon" src={`/img/assets/info-icon.svg`} alt="" /> && (
    <Tooltip dark placement="bottomLeft" color="#000000">
      <span>{text}</span>
    </Tooltip>
  )
const WRAPPER = styled.div<{ $width }>`
  ${tw`flex items-center justify-center relative`}
  .innerCover {
    ${tw`p-1 sm:p-2 rounded-xl sm:w-[98.5%] w-[98.8%] h-[64px] flex items-center justify-between`}
    background-color: ${({ theme }) => theme.bg3};
    img {
      ${tw`w-[34px] h-[34px] m-2`}
    }
  }
  .hContainer {
    ${tw`flex flex-col items-center justify-center`}
  }
  .outerCover {
    width: ${({ $width }) => ($width ? $width + 'px' : '100%')} !important;
    ${tw`w-[100%] sm:w-[100%] h-[68px] rounded-xl flex items-center justify-center`}
    background: linear-gradient(96.79deg, #5855FF 4.25%, #DC1FFF 97.61%);
  }
  .appraisalResult {
    color: ${({ theme }) => theme.text7};
    ${tw`text-[18px] font-semibold`}
  }
  .appraisal {
    ${tw`text-[18px] font-semibold`}
    color: ${({ theme }) => theme.text12};
  }
`

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

export const AppraisalValue: FC<{ width?: number }> = ({ width }): ReactElement => (
  <WRAPPER $width={width}>
    <div className="outerCover">
      <div className="innerCover">
        <div>
          <img src={'/img/assets/Aggregator/gooseLogo.svg'} />
        </div>
        <div className="hContainer">
          <div className="appraisal">Apprasial Value</div>
          <div className="appraisalResult">8000 SOL</div>
        </div>
        <div>
          <img src={'/img/assets/info.svg'} alt="" style={{ height: 30 }} />
        </div>
      </div>
    </div>
  </WRAPPER>
)
