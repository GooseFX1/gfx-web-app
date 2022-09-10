import React, { FC } from 'react'
import styled from 'styled-components'
import { MainText } from '../../../styles'

const INPUT_TITLE = MainText(styled.span`
  font-size: 17px;
  font-weight: 600;
  color: ${({ theme }) => theme.text8} !important;
  text-align: left;
  margin-bottom: ${({ theme }) => theme.margin(1)};
`)

const INPUT_LIMIT = MainText(styled.span`
  font-size: 9px;
  font-weight: 600;
  color: ${({ theme }) => theme.text8} !important;
  text-align: left;
  margin-top: ${({ theme }) => theme.margin(1)};
`)

const INPUT_CONTAINER = styled.div`
  margin-right: ${({ theme }) => `${theme.margin(2)}`};
  display: flex;
  flex-direction: column;
  flex: 1;
`

const STYLED_INPUT = styled.input`
  height: 55px;
  width: 100%;
  background-color: ${({ theme }) => theme.inputBg};
  padding: ${({ theme }) => `${theme.margin(1.5)}`};
  border: none;
  border-bottom: 3px solid ${({ theme }) => theme.text6};
  border-radius: 4px 4px 0px 0px;
  ::placeholder {
    color: #636363;
    font-size: 12px;
  }
  &:focus {
    outline-width: 0;
  }
`
const STYLED_TEXTAREA = styled.textarea`
  height: 55px;
  width: 100%;
  background-color: ${({ theme }) => theme.inputBg};
  padding: ${({ theme }) => `${theme.margin(1.5)}`};
  margin-right: ${({ theme }) => `${theme.margin(1.5)}`};
  border: none;
  border-radius: 4px 4px 0px 0px;
  border-bottom: 3px solid ${({ theme }) => theme.text6};
  line-height: 22px;
  ::placeholder {
    color: #636363;
    font-size: 12px;
  }
  &:focus {
    outline-width: 0;
  }
`

const InfoInput: FC<{
  placeholder: string
  value: string | undefined
  type: 'input' | 'textarea'
  onChange: (val: any) => void
  title?: string
  maxLength?: number
}> = ({ title, maxLength, placeholder, onChange, value, type }) => (
  <INPUT_CONTAINER>
    {title && <INPUT_TITLE>{title}</INPUT_TITLE>}
    {type === 'input' ? (
      <STYLED_INPUT
        value={value ? value : ''}
        placeholder={placeholder}
        onChange={onChange}
        maxLength={maxLength}
      />
    ) : (
      <STYLED_TEXTAREA
        value={value ? value : ''}
        placeholder={placeholder}
        onChange={onChange}
        maxLength={maxLength}
      />
    )}
    {maxLength && (
      <INPUT_LIMIT>
        {value ? value.length : 0} of {maxLength} characters limit
      </INPUT_LIMIT>
    )}
  </INPUT_CONTAINER>
)

export default React.memo(InfoInput)
