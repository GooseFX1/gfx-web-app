import { FC, ReactElement } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { Tooltip } from '../components'
import { useDarkMode } from '../context'
import { CircularArrow } from '../components/common/Arrow'

export const HeaderTooltip = (text: string): ReactElement =>
  <img className="info-icon" src={`/img/assets/info-icon.svg`} alt="info-icon" /> && (
    <Tooltip dark placement="bottomLeft" color="#000000">
      <span>{text}</span>
    </Tooltip>
  )

export const STYLED_TITLE = styled.div<{ $focus: boolean }>`
  ${tw`flex flex-row items-center justify-center cursor-pointer`}
  .textTitle {
    ${tw`font-semibold `}
  }
  .info-icon {
    ${tw`!w-[20px] !h-[20px] block ml-2`}
  }
  .arrowDown {
    ${tw`max-sm:w-[17px] cursor-pointer max-sm:h-[8px] w-[18px] h-[7px] ml-[10px] duration-500`}
    transform: scale(1.5);
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
  focus?: boolean,
  tooltipMode?: boolean
): ReactElement => (
  <STYLED_TITLE $focus={focus}>
    <h4 className="textTitle">{text}</h4>
    {infoText && <GenericTooltip text={infoText} tooltipMode={tooltipMode} />}
    <div tw="!ml-1.5">{isArrowDown && <CircularArrow cssStyle={tw`h-5 w-5`} invert={invert} />}</div>
  </STYLED_TITLE>
)

// if you want info icon send infoIcon = true else just send children
export const GenericTooltip: FC<{ text: string; children?: any; tooltipMode?: boolean; active?: boolean }> = ({
  text,
  tooltipMode,
  children,
  active
}): JSX.Element => {
  const { mode } = useDarkMode()

  if (!active && children) {
    return children
  } else if (active && children) {
    return (
      <Tooltip dark title={text} infoIcon={false} color={mode === 'dark' ? '#F7F0FD' : '#000'}>
        {children}
      </Tooltip>
    )
  } else {
    return (
      <img className="info-icon" src={`/img/assets/info-icon-${tooltipMode ? mode : 'dark'}.svg`} alt="" /> && (
        <Tooltip placement="topLeft" infoIcon={true} color={mode === 'dark' ? '#F7F0FD' : '#000'}>
          <span>{text}</span>
        </Tooltip>
      )
    )
  }
}
