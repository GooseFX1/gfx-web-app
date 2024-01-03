import { FC, useState } from 'react'
import { faqs, Faq } from './constants'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { CircularArrow } from '../../components/common/Arrow'

const FAQ_WRAPPER = styled.div`
  ${tw`sm:w-[calc(100% - 15px)] mb-7.5`}
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
    ${tw`text-white underline`}
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
    <div tw="flex flex-row mt-10 mb-5 items-center">
      <h2 tw="mr-auto text-[20px] font-semibold h-[35px] dark:text-grey-5 text-black-4 sm:text-lg pl-2">FAQs</h2>
      <a
        tw="font-bold text-regular dark:text-white text-blue-1 underline"
        href="https://docs.goosefx.io/features/farm"
        target="_blank"
        rel="noopener noreferrer"
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
        <h4 tw="mr-auto font-semibold text-average dark:text-grey-5 text-black-4 sm:leading-[25px] sm:text-regular">
          {item.question}
        </h4>
        <CircularArrow cssStyle={tw`h-5 w-5 dark:opacity-90 max-w-none`} invert={isFaqOpen} />
      </div>

      <div
        css={[
          tw`duration-300 text-regular px-3.75 `,
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
