import React, { FC, useState } from 'react'
import styled from 'styled-components'
import { Menu, MenuItem } from './shared'
import { ArrowDropdown } from '../../components'
import { MainText } from '../../styles'

const DROP_DOWN_WRAPPER = MainText(styled.button`
  ${({ theme }) => theme.flexCenter}
  height: ${({ theme }) => theme.margins['5x']};
  border: none;
  ${({ theme }) => theme.roundedBorders}
  padding: 0 ${({ theme }) => theme.margins['2x']};
  span {
    font-size: 12px;
    font-weight: bold;
    color: white;
    cursor: pointer;
  }
`)

const exDropdowData = [
  { name: 'All', icon: 'all' },
  { name: 'Art', icon: 'art' },
  { name: 'Defi', icon: 'defi' },
  { name: 'Domains', icon: 'domains' },
  { name: 'Games', icon: 'games' },
  { name: 'Memes', icon: 'memes' },
  { name: 'Metaverse', icon: 'metaverse' },
  { name: 'Music', icon: 'music' },
  { name: 'Photography', icon: 'photography' },
  { name: 'Punks', icon: 'punks' },
  { name: 'Sports', icon: 'sports' },
  { name: 'Verified', icon: 'verified' },
  { name: 'Unverified', icon: 'unverified' }
]

const Overlay: FC<{
  onOptionClick: (currentOption: string) => void
  options: Array<{ name: string; icon: string }>
}> = ({ onOptionClick, options }) => {
  return (
    <Menu>
      {options.map((item) => (
        <MenuItem onClick={() => onOptionClick(item.name)}>
          <span>{item.name}</span>
          <img src={`${process.env.PUBLIC_URL}/img/assets/${item.icon}.svg`} alt="disconnect" />
        </MenuItem>
      ))}
    </Menu>
  )
}

const DropdowButton: FC<{ title: string; options?: Array<{ name: string; icon: string }>; style?: any }> = ({
  title,
  options,
  style
}) => {
  const [arrowRotation, setArrowRotation] = useState(false)
  const [currentTitle, setCurrentTitle] = useState(title)

  const handleClick = () => {}

  const onOptionClick = (currentOption: string) => {
    setArrowRotation(false)
    setCurrentTitle(currentOption)
  }

  return (
    <DROP_DOWN_WRAPPER style={style}>
      <span onClick={handleClick}>{currentTitle}</span>
      <ArrowDropdown
        arrow
        arrowRotation={arrowRotation}
        offset={[9, 30]}
        onVisibleChange={(visible: boolean) => {}}
        overlay={<Overlay options={exDropdowData} onOptionClick={onOptionClick} />}
        setArrowRotation={setArrowRotation}
      />
    </DROP_DOWN_WRAPPER>
  )
}

export default DropdowButton
