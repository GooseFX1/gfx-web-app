import React, { Dispatch, FC, SetStateAction } from 'react'
import styled from 'styled-components'
import { useDarkMode } from '../../context'
import { CenteredImg, MainText, SpaceBetweenDiv, SVGToWhite } from '../../styles'

const HEADER_TITLE = MainText(styled.span`
  font-size: 20px;
  font-weight: bold;
`)

const HEADER_WRAPPER = styled(SpaceBetweenDiv)<{ $iconSize: string }>`
  width: 100%;
  > div {
    ${({ $iconSize, theme }) => theme.measurements($iconSize)}
    cursor: pointer;
  }
`

export const Header: FC<{
  showSettings: boolean,
  setShowSettings: Dispatch<SetStateAction<boolean>>
}> = ({ showSettings, setShowSettings }) => {
  const { mode } = useDarkMode()

  const icon = showSettings && mode === 'dark' ? (
    <SVGToWhite src={`${process.env.PUBLIC_URL}/img/assets/cross.svg`} alt="settings" />
  ) : (
    <img src={`${process.env.PUBLIC_URL}/img/assets/${showSettings ? 'cross' : `settings_${mode}_mode`}.svg`} alt="settings" />
  )

  const onClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setShowSettings(!showSettings)
  }

  return (
    <HEADER_WRAPPER $iconSize={showSettings ? '16px' : '24px'}>
      <HEADER_TITLE>{showSettings ? 'Settings' : 'Swap'}</HEADER_TITLE>
      <CenteredImg onClick={onClick}>
        {icon}
      </CenteredImg>
    </HEADER_WRAPPER>
  )
}
