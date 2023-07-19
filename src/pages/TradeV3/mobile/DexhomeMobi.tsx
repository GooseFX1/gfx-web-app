import { FC } from 'react'
import tw, { styled } from 'twin.macro'
import { useCrypto } from '../../../context'
import { Header } from './Header'
import { OrderBookMobi } from './OrderBookMobi'
import { PlaceOrderMobi } from './PlaceOrderMobi'

const WRAPPER = styled.div<{ isDevnet: boolean }>`
  ${tw` overflow-hidden`}
  height: calc(100vh - 100px);

  .ant-drawer-body {
    ${tw`pt-[18px] pb-0 px-[5px]`}
  }
  .ant-drawer-content-wrapper {
    ${tw`rounded-tl-half rounded-tr-half`}
  }
  .ant-drawer-content {
    ${tw`rounded-tl-half rounded-tr-half dark:bg-black-2 bg-white`}
  }
  .user-profile-drawer {
    .ant-drawer-body {
      ${tw`p-0`}
    }
    .ant-drawer-content {
      height: ${({ $isDevnet }) => ($isDevnet ? '100%' : 'calc(100% - 75px)')};
      ${tw`dark:bg-black-2 bg-white`}
    }
  }
  .takep-stopl-container {
    .ant-drawer-body {
      ${tw`pt-3 pb-0`}
    }
  }
`

export const DexhomeMobi: FC = () => {
  const { isDevnet } = useCrypto()
  return (
    <WRAPPER $isDevnet={isDevnet} id="dex-mobi-home">
      <Header />
      <PlaceOrderMobi />
      <OrderBookMobi />
    </WRAPPER>
  )
}
