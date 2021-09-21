import styled from 'styled-components'

export const AmountField = styled.div<{ $balance: number; $height: string; $USDCValue?: string }>`
  position: relative;
  height: ${({ $height }) => $height};
  margin-top: ${({ theme }) => theme.margins['2x']};
  ${({ theme }) => theme.roundedBorders}
  background-color: ${({ theme }) => theme.textBox};

  &:before {
    content: 'Balance: ${({ $balance }) => $balance}';
    position: absolute;
    right: ${({ theme }) => theme.margins['2x']};
    top: -${({ theme }) => theme.margins['2.5x']};
    ${({ theme }) => theme.mainText}
    color: ${({ theme }) => theme.text1};
    font-size: 11px;
    font-weight: 500;
    white-space: nowrap;
  }

  ${({ theme, $USDCValue }) =>
    $USDCValue &&
    parseFloat($USDCValue) > 0 &&
    `
    &:after {
      content: '${$USDCValue} USDC';
      position: absolute;
      right: ${theme.margins['2.5x']};
      bottom: ${theme.margins['1x']};
      font-family: 'Montserrat';
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

/*
      &:last-child {
        position: absolute;
        left: 0;
        bottom: -12px;
        ${({ theme }) => theme.mainText}
        color: white;
        font-size: 8px;
        white-space: nowrap;
      }
 */
