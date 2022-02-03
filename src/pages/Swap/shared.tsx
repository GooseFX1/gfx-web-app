import styled from 'styled-components'

export const AmountField = styled.div<{ $balance: number; $height: string; $value?: string }>`
  position: relative;
  height: ${({ $height }) => $height};
  margin-top: ${({ theme }) => theme.margin(2)};
  ${({ theme }) => theme.roundedBorders}
  background-color: ${({ theme }) => theme.textBox};

  &:before {
    content: 'Balance: ${({ $balance }) => $balance}';
    position: absolute;
    right: ${({ theme }) => theme.margin(2)};
    top: -${({ theme }) => theme.margin(2.5)};
    ${({ theme }) => theme.mainText}
    color: ${({ theme }) => theme.text1};
    font-size: 11px;
    font-weight: 500;
    white-space: nowrap;
  }

  ${({ theme, $value }) =>
    $value &&
    `
    &:after {
      content: '${$value}';
      position: absolute;
      right: ${theme.margin(2.5)};
      bottom: ${theme.margin(1)};
      ${theme.mainText}
      font-size: 8px;
      font-weight: 500;
      color: white;
    }`}

  > span {
    position: relative;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: ${({ $height }) => $height};
    padding: 0 20px;
    border: none;
    font-size: 16px;
    text-align: right;
  }
`
