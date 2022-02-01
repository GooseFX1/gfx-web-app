import React, { FC } from 'react'
import styled from 'styled-components'
import { CenteredDiv, CenteredImg } from '../../styles'

const WRAPPER = styled(CenteredDiv)<{ $size: 'small' | 'medium' | 'large' }>`
  ${({ $size }) => $size === 'medium' && 'flex-direction: row-reverse;'}

  > div {
    ${({ theme, $size }) => theme.measurements(theme.margins[$size === 'small' ? '2x' : '3x'])}
    margin-${({ $size }) => ($size === 'medium' ? 'left' : 'right')}: ${({ theme }) => theme.margins['1x']};
    ${({ theme }) => theme.roundedBorders}
    box-shadow: 0 4px 10px 2px rgb(0, 0, 0, 0.12);
  }

  > span {
    font-size: ${({ $size }) => ($size === 'medium' ? '12px' : '14px')};
    font-weight: ${({ $size }) => ($size === 'large' ? 'bold' : '500')};
  }
`

export const SynthToken: FC<{ size: 'small' | 'medium' | 'large'; synth: string }> = ({ size, synth }) => {
  return (
    <WRAPPER $size={size}>
      <CenteredImg>
        <img src={`/img/synth/${synth}.svg`} alt="" />
      </CenteredImg>
      <span>{synth}</span>
    </WRAPPER>
  )
}
