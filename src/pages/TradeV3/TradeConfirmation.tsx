import { FC } from 'react'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { Button } from '../../components/Button'

const WRAPPER = styled.div``

const ROW = styled.div`
  ${tw`flex flex-row justify-between items-start mb-2.5`}

  > span {
    ${tw`text-average font-semibold text-grey-1`}
  }

  .value {
    ${tw`text-black-4 dark:text-white`}
  }

  .spacing {
    ${tw`mb-[25px]`}
  }
`

export const TradeConfirmation: FC = () => {
  console.log('Confirmation Popup rendered')
  return (
    <WRAPPER>
      <div tw="mt-[30px] mb-7">
        <ROW>
          <span>Order Type</span>
          <span className="value">Market</span>
        </ROW>
        <ROW>
          <span>Trade Size</span>
          <span className="value spacing">0.10811 SOL</span>
        </ROW>
        <ROW>
          <span>Est. Entry Price</span>
          <span className="value">$23.3546</span>
        </ROW>
        <ROW>
          <span>Est. Price Impact</span>
          <span className="value">0.0000%</span>
        </ROW>
        <ROW>
          <span>Slippage Tolerance</span>
          <span className="value spacing">0.5%</span>
        </ROW>
        <ROW>
          <span>Trade Notional Size</span>
          <span className="value">-$2.52 USDC</span>
        </ROW>
        <ROW>
          <span>Fee (0.1%)</span>
          <span className="value">-$0.00 USDC</span>
        </ROW>
        <ROW>
          <span>Total Cost</span>
          <span tw="mb-7" className="value">
            $2.52 USDC
          </span>
        </ROW>
        <ROW>
          <span>Est. Liquidation Price</span>
          <span className="value">$14.9628</span>
        </ROW>
      </div>
      <Button
        width="100%"
        height="50px"
        cssStyle={tw`bg-[#71C25D] text-white font-semibold border-0 rounded-circle text-regular`}
      >
        Long 22.225 SOL-PERP
      </Button>
    </WRAPPER>
  )
}
