import { FC, ReactElement } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { Tooltip } from '../components'
import { useDarkMode } from '../context'

export const HeaderTooltip = (text: string): ReactElement =>
  <img className="info-icon" src={`/img/assets/info-icon.svg`} alt="" /> && (
    <Tooltip dark placement="bottomLeft" color="#000000">
      <span>{text}</span>
    </Tooltip>
  )
const WRAPPER = styled.div<{ $width; $mode }>`
  ${tw`flex items-center justify-center relative`}
  .innerCover {
    background: ${({ theme }) => theme.bg26};
    text: ${({ theme }) => theme.text20};
    ${tw`relative p-1 sm:p-2 
      rounded-xl sm:w-[98.5%] w-[98.8%] h-[64px] flex items-center justify-center`} img {
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

export const STYLED_TITLE = styled.div<{ $focus: boolean }>`
  ${tw`flex flex-row items-center justify-center cursor-pointer`}
  .textTitle {
    ${tw`font-semibold text-base dark:text-white text-grey-2`}
  }
  .info-icon {
    ${tw`w-[20px] h-[20px] block ml-2`}
  }
  .arrowDown {
    ${tw`sm:w-[17px] cursor-pointer sm:h-[8px] w-[18px] h-[7px] ml-[10px] duration-500`}
    transform: scale(1.5);
    opacity: ${({ $focus }) => ($focus ? 0.9 : 0.35)};
  }
  .invert {
    ${tw`h-[10px]`}
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
  invert?: boolean,
  focus?: boolean
): ReactElement => (
  <STYLED_TITLE $focus={focus}>
    <div className="textTitle">{text}</div>
    {infoText && <GenericTooltip text={infoText} />}
    {isArrowDown && (
      <img className={'arrowDown' + (invert ? ' invert' : '')} src={`/img/assets/arrow-down-dark.svg`} alt="" />
    )}
  </STYLED_TITLE>
)

interface IAppraisalValue {
  text: string | null
  label?: string
  width?: number
}

export const AppraisalValue: FC<IAppraisalValue> = ({ text, label, width }): ReactElement => {
  const { mode } = useDarkMode()
  return (
    <WRAPPER $width={width} $mode={mode}>
      <div className="outerCover">
        <div className="innerCover">
          <div tw="absolute left-0">
            <img src={'/img/assets/Aggregator/Tooltip.svg'} alt="gfx-appraisal-icon" style={{ height: 30 }} />
          </div>
          <div className="hContainer">
            <div tw="text-average font-semibold dark:text-grey-2 text-grey-1">{label}</div>
            <div tw="text-average font-semibold dark:text-grey-5 text-black-4">{text}</div>
          </div>
        </div>
      </div>
    </WRAPPER>
  )
}

// if you want info icon send infoIcon = true else just send children
export const GenericTooltip: FC<{ text: string; children?: any }> = ({ text, children }): JSX.Element => {
  const { mode } = useDarkMode()
  if (children)
    return (
      <Tooltip dark title={text} infoIcon={false} color={mode === 'dark' ? '#eeeeee' : '#000'}>
        {children}
      </Tooltip>
    )
  return (
    <img className="info-icon" src={`/img/assets/info-icon.svg`} alt="" /> && (
      <Tooltip dark placement="bottomLeft" infoIcon={true} color={mode === 'dark' ? '#eeeeee' : '#000'}>
        <span>{text}</span>
      </Tooltip>
    )
  )
}
