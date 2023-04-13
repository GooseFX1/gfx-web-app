/* eslint-disable */
import tw, { styled } from 'twin.macro'
import { Header } from './Header'
import { OrderBookMobi } from './OrderBookMobi'
import { PlaceOrderMobi } from './PlaceOrderMobi'

const WRAPPER = styled.div`
  margin-top: 100px;
  .ant-drawer-body {
    padding-top: 18px;
    padding-bottom: 0;
  }
  .ant-drawer-content-wrapper {
    border-radius: 25px 25px 0 0;
  }
  .ant-drawer-content {
    border-radius: 25px 25px 0 0;
  }
  .user-profile-drawer {
    .ant-drawer-body {
      padding: 0;
    }
    .ant-drawer-content {
      background: ${({ theme }) => theme.bg20};
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
