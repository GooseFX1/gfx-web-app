import React, { Dispatch, FC, SetStateAction } from 'react'
import styled from 'styled-components'
import { Expand } from '../Expand'
import { SpaceBetweenDiv } from '../../styles'

const FIELD = styled.span<{ $width: number }>`
  width: ${({ $width }) => $width}%;
  font-size: 12px;
`

const FIELDS = styled(SpaceBetweenDiv)`
  margin: 0 -${({ theme }) => theme.margin(5)};
`

const PANEL = styled.div<{ $active: boolean; $centerLabels: boolean }>`
  &:first-child {
    display: flex;
    justify-content: ${({ $centerLabels }) => ($centerLabels ? 'center' : 'flex-start')};
  }

  &:last-child {
    display: flex;
    justify-content: ${({ $centerLabels }) => ($centerLabels ? 'center' : 'flex-end')};
  }

  > span {
    font-size: 14px;
    font-weight: bold;
    color: ${({ $active, theme }) => ($active ? 'white' : theme.text1h)};
    transition: color ${({ theme }) => theme.hapticTransitionTime} ease-in-out;
    cursor: pointer;

    &:hover {
      color: white;
    }
  }
`

const PANELS = styled(SpaceBetweenDiv)<{
  $activePanel: any
  $justify: string
  $positions: string[]
  $widths: string[]
}>`
  display: flex;
  justify-content: ${({ $justify }) => $justify};
  align-items: center;
  position: relative;
  margin-bottom: ${({ theme }) => theme.margin(1.5)};

  &:after {
    content: '';
    display: block;
    position: absolute;
    bottom: 0;
    left: ${({ $activePanel, $positions }) => $positions[$activePanel]};
    width: ${({ $activePanel, $widths }) => $widths[$activePanel]};
    height: 2px;
    background-color: white;
    transition: all ${({ theme }) => theme.mainTransitionTime} ease-in-out;
  }
`

const WRAPPER = styled.div`
  position: relative;
  padding: ${({ theme }) => theme.margin(2)} ${({ theme }) => theme.margin(5)} ${({ theme }) => theme.margin(1.5)};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  background-color: ${({ theme }) => theme.grey4};
  ${({ theme }) => theme.largeShadow}
`

export const Header: FC<{
  activePanel: any
  centerLabels?: boolean
  expand: Dispatch<SetStateAction<boolean>>
  fields: { [x: string]: string[] }
  justify: string
  panels: any[]
  setPanel: Dispatch<SetStateAction<any>>
  underlinePositions: string[]
  underlineWidths: string[]
}> = ({
  activePanel,
  centerLabels = false,
  expand,
  fields,
  justify,
  panels,
  setPanel,
  underlinePositions,
  underlineWidths
}) => (
  <WRAPPER>
    <Expand onClick={expand} />
    <PANELS
      $activePanel={panels.indexOf(activePanel)}
      $justify={justify}
      $positions={underlinePositions}
      $widths={underlineWidths}
    >
      {panels.map((panel, index) => (
        <PANEL key={index} $active={activePanel === panel} $centerLabels={centerLabels}>
          <span onClick={() => setPanel(panel)}>{panel}</span>
        </PANEL>
      ))}
    </PANELS>
    <FIELDS>
      {fields[activePanel].map((field, index) => (
        <FIELD key={index} $width={100 / fields[activePanel].length}>
          {field}
        </FIELD>
      ))}
    </FIELDS>
  </WRAPPER>
)
