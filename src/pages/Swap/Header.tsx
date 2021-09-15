import React from 'react'

/* export const Header: FC<{
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
} */
