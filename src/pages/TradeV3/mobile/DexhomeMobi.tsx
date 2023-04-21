/* eslint-disable */
import tw, { styled } from 'twin.macro'
import { Header } from './Header'
import { OrderBookMobi } from './OrderBookMobi'
import { PlaceOrderMobi } from './PlaceOrderMobi'

const WRAPPER = styled.div`
  ${tw`mt-[100px] overflow-hidden`}
  height: calc(100vh - 100px);

  .ant-drawer-body {
    ${tw`pt-[18px] pb-0`}
  }
  .ant-drawer-content-wrapper {
    ${tw`rounded-tl-half rounded-tr-half`}
  }
  .ant-drawer-content {
    ${tw`rounded-tl-half rounded-tr-half`}
  }
  .user-profile-drawer {
    .ant-drawer-body {
      ${tw`p-0`}
    }
    .ant-drawer-content {
      ${tw`dark:bg-black-2 bg-white`}
      height: calc(100% - 75px);
    }
  }
  .takep-stopl-container {
    .ant-drawer-body {
      ${tw`pt-3 pb-0`}
    }
  }
`

export const DexhomeMobi = () => {
  return (
    <WRAPPER id="dex-mobi-home">
      <Header />
      <PlaceOrderMobi />
      <OrderBookMobi />
    </WRAPPER>
  )
}
