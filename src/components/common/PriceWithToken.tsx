import { FC } from 'react'
import tw, { TwStyle, styled } from 'twin.macro'
import 'styled-components/macro'

const PRICE = styled.div<{ $cssStyle: TwStyle }>`
  ${tw`flex justify-center font-semibold items-center text-[15px] duration-500 `}
  color: ${({ theme }) => theme.text32};
  ${({ $cssStyle }) => $cssStyle};

  width: fit-content !important;
  img {
    ${tw`ml-1`}
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
        <div tw="mr-1">{price}</div> <img src={tokenImg} alt="arrow" />
      </PRICE>
    </>
  )
}
