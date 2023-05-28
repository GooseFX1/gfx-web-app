import { Dispatch, FC, ReactElement, SetStateAction, useCallback, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { Tooltip } from '../components'
import { useDarkMode } from '../context'
import { checkMobile, formatSOLDisplay } from './misc'
import { GFXApprisalPopup } from '../components/NFTAggWelcome'

export const HeaderTooltip = (text: string): ReactElement =>
  <img className="info-icon" src={`/img/assets/info-icon.svg`} alt="info-icon" /> && (
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
      rounded-[8.5px] sm:w-[98.5%] w-[98.8%] h-[64px] sm:h-[54px] flex items-center justify-center`}
  }
  .hContainer {
    ${tw`flex flex-col items-center justify-center`}
  }
  .outerCover {
    width: ${({ $width }) => ($width ? $width + 'px' : '100%')} !important;
    ${tw`w-[100%] sm:w-[100%] h-[68px] sm:h-[58px] rounded-[10px] flex items-center justify-center`}
    background: linear-gradient(96.79deg, #5855FF 4.25%, #DC1FFF 97.61%);
  }
  .appraisalResult {
    color: ${({ theme }) => theme.text32};
    ${tw`text-[18px] font-semibold`}
  }
  .appraisalTitle {
    ${tw`text-[18px] font-semibold sm:text-[16px]`}
    color: ${({ theme }) => theme.text20};
  }
`

export const STYLED_TITLE = styled.div<{ $focus: boolean }>`
  ${tw`flex flex-row items-center justify-center cursor-pointer`}
  .textTitle {
    ${tw`font-semibold text-base dark:text-white text-grey-1`}
  }
  .info-icon {
    ${tw`!w-[20px] !h-[20px] block ml-2`}
  }
  .arrowDown {
    ${tw`sm:w-[17px] cursor-pointer sm:h-[8px] w-[18px] h-[7px] ml-[10px] duration-500`}
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
): ReactElement => {
  const { mode } = useDarkMode()
  return (
    <STYLED_TITLE $focus={focus}>
      <div className="textTitle">{text}</div>
      {infoText && <GenericTooltip text={infoText} tooltipMode={tooltipMode} />}
      {isArrowDown && (
        <img
          className={'arrowDown' + (invert ? ' invert' : '')}
          src={`/img/assets/arrow-down-${mode}.svg`}
          alt=""
        />
      )}
    </STYLED_TITLE>
  )
}

interface IAppraisalValue {
  text: string | null
  label?: string
  width?: number
}

export const AppraisalValueSmall: FC<IAppraisalValue> = ({ text, label, width }): ReactElement => {
  const { mode } = useDarkMode()
  const [appraisalPopup, setAppraisalPopup] = useState<boolean>(false)

  const handlePopup = useCallback(
    () => <GFXApprisalPopup showTerms={appraisalPopup} setShowTerms={setAppraisalPopup} />,
    [appraisalPopup]
  )

  return (
    <WRAPPER $width={width} $mode={mode}>
      {handlePopup()}
      <div className="outerCover" tw="!h-[58px]">
        <div className="innerCover" tw="!h-[55px] !rounded-[9.5px]">
          <GenericTooltip text="The GFX Appraisal Value emphasizes executed sales data, not floor prices.">
            <div tw="absolute left-0 cursor-pointer">
              <img
                src={'/img/assets/Aggregator/Tooltip.svg'}
                alt="gfx-appraisal-icon"
                tw="!h-[22px] !w-[22px] ml-[10px]"
                onClick={() => setAppraisalPopup(true)}
              />
            </div>
          </GenericTooltip>

          <div className="hContainer" tw="ml-4.5">
            <div className="appraisalTitle" tw="!text-[15px] font-semibold">
              {label}
            </div>
            <div className="appraisalResult" tw="!text-[15px] font-semibold">
              {text && `${formatSOLDisplay(text, true)} SOL`}
            </div>
          </div>
        </div>
      </div>
    </WRAPPER>
  )
}
export const AppraisalValue: FC<IAppraisalValue> = ({ text, label, width }): ReactElement => {
  const { mode } = useDarkMode()
  const [appraisalPopup, setAppraisalPopup] = useState<boolean>(false)

  const handlePopup = useCallback(
    () => <GFXApprisalPopup showTerms={appraisalPopup} setShowTerms={setAppraisalPopup} />,
    [appraisalPopup]
  )

  return (
    <WRAPPER $width={width} $mode={mode}>
      {handlePopup()}
      <div className="outerCover">
        <div className="innerCover">
          {checkMobile() ? (
            <InfoImgGFXAppraisal setAppraisalPopup={setAppraisalPopup} />
          ) : (
            <GenericTooltip text={`The GFX Appraisal Value emphasizes executed sales data, not floor prices.`}>
              <InfoImgGFXAppraisal setAppraisalPopup={setAppraisalPopup} />
            </GenericTooltip>
          )}

          <div className="hContainer">
            <div className="appraisalTitle" tw="text-average font-semibold">
              {label}
            </div>
            <div className="appraisalResult" tw="text-average font-semibold">
              {text && `${formatSOLDisplay(text, true)} SOL`}
            </div>
          </div>
        </div>
      </div>
    </WRAPPER>
  )
}
const InfoImgGFXAppraisal: FC<{ setAppraisalPopup: Dispatch<SetStateAction<boolean>> }> = ({
  setAppraisalPopup
}) => (
  <div tw="absolute left-0 cursor-pointer">
    <img
      src={'/img/assets/Aggregator/Tooltip.svg'}
      alt="gfx-appraisal-icon"
      tw="!h-[28px] !w-[28px] ml-[15px]"
      onClick={() => setAppraisalPopup(true)}
    />
  </div>
)

// if you want info icon send infoIcon = true else just send children
export const GenericTooltip: FC<{ text: string; children?: any; tooltipMode?: boolean }> = ({
  text,
  tooltipMode,
  children
}): JSX.Element => {
  const { mode } = useDarkMode()
  if (children)
    return (
      <Tooltip dark title={text} infoIcon={false} color={mode === 'dark' ? '#eeeeee' : '#000'}>
        {children}
      </Tooltip>
    )
  return (
    <img className="info-icon" src={`/img/assets/info-icon-${tooltipMode ? mode : 'dark'}.svg`} alt="" /> && (
      <Tooltip placement="topLeft" infoIcon={true} color={mode === 'dark' ? '#eeeeee' : '#000'}>
        <span>{text}</span>
      </Tooltip>
    )
  )
}
