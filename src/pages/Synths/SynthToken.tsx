import React, { FC } from 'react'
import styled from 'styled-components'
import { CenteredDiv, CenteredImg } from '../../styles'

const WRAPPER = styled(CenteredDiv)<{ $size: 'small' | 'large' }>`
  > div {
    ${({ theme, $size }) => theme.measurements(theme.margins[$size === 'small' ? '2x' : '3x'])}
    margin-right: ${({ theme }) => theme.margins['1x']};
  }

  ${({ $size }) =>
    $size === 'large' &&
    `
    > span {
      font-weight: bold;
    }
  `}
`

export const SynthToken: FC<{ size: 'small' | 'large'; synth: string }> = ({ size, synth }) => {
  return (
    <WRAPPER $size={size}>
      <CenteredImg>
        <img src={`${process.env.PUBLIC_URL}/img/synth/${synth}.svg`} alt="" />
      </CenteredImg>
      <span>{synth}</span>
    </WRAPPER>
  )
}
