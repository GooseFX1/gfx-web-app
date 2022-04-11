import styled from 'styled-components'

export const AmountField = styled.div<{ $balance: string; $height: string; $value?: string }>`
  position: relative;
  height: ${({ $height }) => $height};
  margin-top: ${({ theme }) => theme.margin(1)};
  ${({ theme }) => theme.roundedBorders}
  background-color: ${({ theme }) => theme.bg10};

  &:before {
    content: 'Balance: ${({ $balance }) => $balance}';
    position: absolute;
    right: 0;
    top: -${({ theme }) => theme.margin(5)};
    ${({ theme }) => theme.mainText}
    color: ${({ theme }) => theme.text1};
    font-size: 15px;
    font-weight: 500;
    white-space: nowrap;
  }

  ${({ theme, $value }) =>
    $value &&
    `
    &:after {
      content: '${$value}';
      position: absolute;
      right: ${theme.margin(2.7)};
      bottom: ${theme.margin(2)};
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

  .swap-input {
    font-weight: 500;
    font-size: 18px;
    line-height: 22px;
  }
`
