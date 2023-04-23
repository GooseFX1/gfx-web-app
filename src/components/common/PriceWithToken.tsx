import { FC } from 'react'
import tw, { TwStyle, styled } from 'twin.macro'
import 'styled-components/macro'

const PRICE = styled.div<{ $cssStyle: TwStyle }>`
  ${tw`flex justify-center font-semibold items-center text-[15px] duration-500`}
  ${({ $cssStyle }) => $cssStyle};
  color: ${({ theme }) => theme.text11};

  width: fit-content !important;
  img {
    ${tw`ml-[5px]`}
    ${({ $cssStyle }) => $cssStyle};
  }
`

// <PriceWithToken token="SOL" price={200} cssStyle={tw`h-[25px] w-[25px] text-[#636363] dark:text-[#eeeeee]`} />
// Make sure to send the dark and light mode colours for the text in tailwind CSS and height and width

export const PriceWithToken: FC<{
  token: string
  price: number | string
  cssStyle?: TwStyle
  [x: string]: any
}> = ({ cssStyle, token, price, ...props }) => {
  const tokenImg = `/img/crypto/${token}.svg`
  return (
    <>
      <PRICE $cssStyle={cssStyle} {...props}>
        {price} <img src={tokenImg} alt="arrow" />
      </PRICE>
    </>
  )
}
