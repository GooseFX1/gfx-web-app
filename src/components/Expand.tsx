import React, { FC } from 'react'
import styled from 'styled-components'
import { CenteredDiv } from '../styles'

const WRAPPER = styled(CenteredDiv)`
  position: absolute;
  top: 3px;
  left: calc(50% - 10px);
  width: 20px;
  height: 4px;
  border-radius: 50px;
  background-color: white;
  cursor: pointer;
`

export const Expand: FC<{ [x: string]: any }> = ({ ...props }) => <WRAPPER {...props} />
