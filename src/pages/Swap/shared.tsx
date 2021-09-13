import styled from 'styled-components'

export const AmountField = styled.div<{ $height: string; $USDCValue?: string }>`
  position: relative;
  height: ${({ $height }) => $height};
  margin-top: ${({ theme }) => theme.margins['2x']};
  ${({ theme }) => theme.roundedBorders}
  background-color: ${({ theme }) => theme.textBox};

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
