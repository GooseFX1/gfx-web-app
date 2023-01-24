/* eslint-disable */
import { FC } from 'react'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'

const WRAPPER = styled.div``

const COL = styled.div`
  ${tw`flex flex-col`}

  .key {
    ${tw`mb-2 text-regular font-semibold text-grey-1 hover:text-grey-1`}
  }

  .value {
    ${tw`text-average font-semibold text-black-4 dark:text-grey-5`}
  }
`
export const PerpsEndModal: FC = () => {
  const socials = ['twitter', 'telegram', 'facebook', 'download']

  return (
    <WRAPPER>
      <div tw="flex items-center my-3.75">
        <img tw="mx-2.5" src="/img/crypto/GOFX.svg" alt="gofx-icn" height="40px" width="40px" />
        <COL>
          <span className="value">GOFX</span>
          <a href="https://app.goosefx.io/trade" target="_blank" className="key">
            app.goosefx.io/trade
          </a>
        </COL>
      </div>
      <img src="/img/assets/graphicSuccess.png" alt="graphic" width="100%" />
      <div tw="mb-5 relative top-[-50px]">
        <div tw="mb-1.5">
          <span tw="dark:text-grey-2 text-black-4 text-lg font-semibold mr-1.5">SOL/PERP</span>
          <span tw="text-[#71C25D] text-average font-semibold">Long</span>
        </div>
        <div>
          <span tw="text-[#71C25D] text-[30px] font-semibold mr-2">+$1,275</span>
          <span tw="text-grey-1 dark:text-grey-2 text-average font-semibold">(300%)</span>
        </div>
      </div>
      <div tw="flex flex-row justify-between relative top-[-50px] mb-7">
        <COL>
          <span className="key">Entry Point</span>
          <span className="value">$25.67</span>
        </COL>
        <COL>
          <span className="key">Current Price</span>
          <span className="value">$23.08</span>
        </COL>
        <COL>
          <span className="key">Leverage</span>
          <span className="value">20.00x</span>
        </COL>
      </div>
      <div tw="dark:text-grey-5 text-black-4 text-lg font-semibold mx-auto mb-3.75 relative top-[-50px] text-center">
        Share it with your friends!
      </div>
      <div tw="flex justify-evenly relative top-[-50px] cursor-pointer">
        {socials.map((item, index) => (
          <img
            key={index}
            src={`/img/assets/${item}-circle.svg`}
            alt={`${item}-icon`}
            height="45px"
            width="45px"
            tw="rounded-circle border-b border-solid border-white"
          />
        ))}
      </div>
    </WRAPPER>
  )
}
