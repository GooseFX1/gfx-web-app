import React, { FC } from 'react'
import { Dropdown } from 'antd'
import styled from 'styled-components'
import { Menu, MenuItem } from './shared'
import { LITEPAPER_ADDRESS, SOCIAL_MEDIAS } from '../../constants'
import { CenteredImg, SVGToBlack} from '../../styles'
import { useDarkMode } from "../../context/dark_mode";

const ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margin(4.5))}
  margin-left: ${({ theme }) => theme.margin(2)};
  cursor: pointer;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-left: ${({ theme }) => theme.margin(1)};
  `}
`

const ITEM = styled(MenuItem)`
  width: 130px;

  > a {
    display: flex;
    justify-content: space-between;
    width: 100%;

    > span {
      color: ${({ theme }) => theme.text1};
    }
  }
`

const Overlay = ({ theme } : {theme : string}) =>{
  const target = {
    discord: SOCIAL_MEDIAS.discord,
    docs: LITEPAPER_ADDRESS,
    medium: SOCIAL_MEDIAS.medium,
    telegram: SOCIAL_MEDIAS.telegram,
    twitter: SOCIAL_MEDIAS.twitter
  } as { [key: string]: string }

  return (
    <Menu>
      {['docs', 'discord', 'twitter', 'telegram', 'medium'].map((item, index) => (
        <ITEM key={index}>
          <a href={target[item]} target="_blank" rel="noopener noreferrer">
            <span>{item}</span>
            {theme === 'lite' ?  <SVGToBlack src={`/img/assets/${item}_small.svg`}/> :
            <img src={`/img/assets/${item}_small.svg`} alt={item} />}
          </a>
        </ITEM>
      ))}
    </Menu>
  )
}

export const More: FC = () => {
  const {mode} = useDarkMode()
  return (
    <Dropdown
      align={{ offset: [0, 16] }}
      destroyPopupOnHide
      overlay={<Overlay theme={mode}/>}
      placement="bottomLeft"
      trigger={['click']}
    >
      <ICON>
        <img src={`/img/assets/more_icon.svg`} alt="more" />
      </ICON>
    </Dropdown>
  )
}
