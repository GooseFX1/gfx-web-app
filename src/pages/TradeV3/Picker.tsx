import styled from 'styled-components'
import tw from 'twin.macro'

export const Picker = styled.div`
  display: flex;
  align-items: baseline;
  span {
    margin-left: ${({ theme }) => theme.margin(1.5)};
    font-size: 10px;
    font-weight: bold;
    whitespace: no-wrap;
    cursor: pointer;
    color: ${({ theme }) => theme.text1h};
    transition: color ${({ theme }) => theme.hapticTransitionTime} ease-in-out;
    &:hover {
      color: ${({ theme }) => theme.text1};
    }
  }
  .ant-slider.ant-slider-horizontal {
    ${tw`w-full`}
  }
  .ant-slider-track{
    background-image: linear-gradient(91deg, #f7931a 0%, #ac1cc7 100%);
  }
  .ant-slider-handle{
    ${tw`w-[20px] h-[20px]`}
    background-color: white !important;
  }
`