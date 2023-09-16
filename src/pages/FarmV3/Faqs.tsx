import { FC, useState } from 'react'
import { faqs, Faq } from './constants'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { CircularArrow } from '../../components/common/Arrow'

const FAQ_WRAPPER = styled.div`
  ${tw`sm:w-[calc(100% - 15px)]`}
  .faqs {
    ${tw`flex flex-row cursor-pointer items-center h-[52px] sm:h-auto sm:py-3 px-3.75 w-full
     border border-solid dark:border-black-4 border-grey-4 border-r-0 border-t-0 border-l-0`}
  }
  .last-faq {
    ${tw`!border-0`}
  }
  .faq-open {
    ${tw`!border-0 !pb-0`}
  }
  .faq-answer {
    ${tw`px-6 pb-3 mt-[10px] text-tiny font-medium dark:text-grey-2 text-grey-1 border border-solid 
    dark:border-black-4 border-grey-4 border-r-0 border-t-0 border-l-0`}
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

export const Faqs: FC = () => (
  <FAQ_WRAPPER>
    <div tw="flex flex-row mt-10">
      <h2 tw="mr-auto text-[20px] font-semibold h-[35px] dark:text-grey-5 text-black-4 sm:text-lg pl-2">FAQs</h2>
      <a
        tw="w-[140px] h-[35px] bg-blue-1 cursor-pointer text-white font-semibold
         text-regular flex flex-row justify-center items-center rounded-circle sm:w-1/3 sm:text-tiny"
        href="https://docs.goosefx.io/features/farm/single-sided-liquidity-pools"
        target="_blank"
        rel="noreferrer"
      >
        Go To Docs
      </a>
    </div>
    <div tw="rounded-[10px] dark:bg-black-2 bg-white ">
      {faqs.map((item: Faq, index: number) => (
        <FaqRow item={item} key={index} index={index} />
      ))}
    </div>
  </FAQ_WRAPPER>
)

export const FaqRow: FC<{ item: Faq; index: number }> = ({ item, index }) => {
  const [isFaqOpen, setIsFaqOpen] = useState<boolean>(false)
  const lastElement = index === faqs.length - 1

  return (
    <>
      <div
        className={`faqs ${isFaqOpen ? 'faq-open' : ''} ${lastElement ? 'last-faq' : ''}`}
        onClick={() => {
          setIsFaqOpen((prev) => !prev)
        }}
      >
        <div tw="mr-auto font-semibold text-average dark:text-grey-5 text-black-4 sm:leading-[25px] sm:text-regular">
          {item.question}
        </div>
        <CircularArrow cssStyle={tw`h-5 w-5 dark:opacity-90 max-w-none`} invert={isFaqOpen} />
      </div>

      <div
        css={[
          tw`duration-300 text-tiny px-3.75 `,
          isFaqOpen
            ? tw`h-[fit] font-medium dark:text-grey-2 text-grey-1 border pb-3.75 sm:mt-0.5
            border-solid dark:border-black-4 border-grey-4 border-r-0 border-t-0 border-l-0`
            : tw`h-0  invisible opacity-0 `,
          lastElement && tw`!border-0`
        ]}
      >
        {isFaqOpen && item.answer}
      </div>
    </>
  )
}
