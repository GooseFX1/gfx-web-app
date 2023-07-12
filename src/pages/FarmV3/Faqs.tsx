/* eslint-disable */
import { FC, useState } from 'react'
import { faqs } from './constants'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { useDarkMode } from '../../context'

const FAQ_WRAPPER = styled.div`
  .faqs {
    ${tw`flex flex-row cursor-pointer items-center h-16 w-full border border-solid dark:border-black-4 border-grey-4 py-5 px-6 border-r-0 border-t-0 border-l-0`}
  }
  .faqs:last-child {
    ${tw`!border-0`}
  }
  .faq-open {
    ${tw`!border-0`}
  }
  .faq-answer {
    ${tw`px-6 pb-3 mt-[-10px] text-tiny font-medium dark:text-grey-2 text-grey-1 border border-solid dark:border-black-4 border-grey-4 border-r-0 border-t-0 border-l-0`}
    transition: transform 500ms ease-out;
  }
  .faq-answer:last-child {
    ${tw`!border-0`}
  }
  a:hover {
    ${tw`text-white`}
  }
  .invertArrow {
    transform: rotate(180deg);
    transition: transform 500ms ease-out;
  }
  .dontInvert {
    transition: transform 500ms ease-out;
  }
  .doc-link {
    ${tw`dark:text-white text-black font-semibold underline`}
  }
  .doc-link:hover {
    ${tw`dark:text-white text-black`}
  }
`

export const Faqs: FC = () => {
  return (
    <FAQ_WRAPPER>
      <div tw="flex flex-row items-center">
        <h2 tw="mr-auto text-[30px] font-semibold dark:text-grey-5 text-black-4">Frequently Asked Questions</h2>
        <a
          tw="w-[140px] h-10 bg-blue-1 mb-5 cursor-pointer text-white font-semibold text-average flex flex-row justify-center items-center rounded-circle"
          href="https://docs.goosefx.io/features/farm/single-sided-liquidity-pools"
          target="_blank"
        >
          Go To Docs
        </a>
      </div>
      <div tw="rounded-[18px] dark:bg-black-2 bg-white">
        {faqs.map((item, index) => (
          <FaqRow item={item} key={index} />
        ))}
      </div>
    </FAQ_WRAPPER>
  )
}

export const FaqRow: FC<{ item }> = ({ item }) => {
  const { mode } = useDarkMode()
  const [isFaqOpen, setIsFaqOpen] = useState<boolean>(false)
  return (
    <>
      <div
        className={`faqs ${isFaqOpen ? 'faq-open' : ''}`}
        onClick={() => {
          setIsFaqOpen((prev) => !prev)
        }}
      >
        <div tw="mr-auto font-semibold text-average dark:text-grey-5 text-black-4">{item.question}</div>
        <img
          src={`/img/assets/arrow-down-${mode}.svg`}
          alt="arrow-icon"
          className={isFaqOpen ? 'invertArrow' : 'dontInvert'}
        />
      </div>
      {isFaqOpen && <div className="faq-answer">{item.answer}</div>}
    </>
  )
}
