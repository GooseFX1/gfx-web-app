import { FC } from 'react'
import tw, { styled } from 'twin.macro'
import { useCrypto } from '../../../context'
import { Header } from './Header'
import { OrderBookMobi } from './OrderBookMobi'
import { PlaceOrderMobi } from './PlaceOrderMobi'

const WRAPPER = styled.div<{ isSpot: boolean }>`
  ${tw`mt-[15vh] overflow-hidden`}
  height: calc(100vh - 15vh);

  .ant-drawer-body {
    ${tw`pt-[18px] pb-0`}
  }
  .ant-drawer-content-wrapper {
    ${tw`rounded-tl-half rounded-tr-half`}
  }
  .ant-drawer-content {
    ${tw`rounded-tl-half rounded-tr-half dark:bg-black-2 bg-grey-5`}
  }
  .user-profile-drawer {
    .ant-drawer-body {
      ${tw`p-0`}
    }
    .ant-drawer-content {
      height: ${({ $isSpot }) => ($isSpot ? '100%' : 'calc(100% - 75px)')};
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
  const { isSpot } = useCrypto()
  return (
    <WRAPPER $isSpot={isSpot} id="dex-mobi-home">
      <Header />
      <PlaceOrderMobi />
      <OrderBookMobi />
    </WRAPPER>
  )
}
