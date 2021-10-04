import styled, { css } from 'styled-components'

export const InputCSS = css`
  .ant-input-affix-wrapper {
    height: 39px;
    border: none;
    border-radius: 8px;
    background-color: black;
  }

  .ant-input-affix-wrapper > input.ant-input {
    text-align: left;
  }
`

export const FieldHeader = styled.span`
  display: block;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.margins['0.5x']};
  padding: 0 ${({ theme }) => theme.margins['0.5x']};
  font-size: 11px;
  text-align: left;
`
