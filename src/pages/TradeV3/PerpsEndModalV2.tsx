/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, ReactElement, useState } from 'react'
import { ContentLabel, InfoLabel, InfoLabelNunito } from './perps/components/PerpsGenericComp'
import { Switch } from 'gfx-component-lib'

const PerpsEndModalV2: FC<{
  profit: boolean
  side: 'buy' | 'sell'
  entryPrice: string
  currentPrice: string
  leverage: string
  pnlAmount
  percentageChange: string
}> = ({ profit, side, entryPrice, currentPrice, leverage, pnlAmount, percentageChange }): ReactElement => {

  const [showPnL, setShowPnl] = useState(false);
  return (
    <div className='flex flex-col pt-3 w-full'>
      <div className='w-full'>
        <InfoLabel className='text-[18px] ml-2.5 mt-1'>
          {profit || true ? 'Congrats!' : 'Trade Closed!'}


        </InfoLabel>

        <div className='mt-2.5 h-10 ml-2.5 mr-2.5 flex items-center '>
          <img src={`/img/assets/GOFX.svg`} alt="close" height="40px" width="40px" />
          <div className='flex'>
            <InfoLabel className='text-[15px] ml-2'>
              Trade at:
            </InfoLabel>
            <a href="https://app.goosefx.io/trade" target="blank">
              <InfoLabel className='text-[15px] ml-1 !text-purple-3'>
                app.goosefx.io/trade
              </InfoLabel>
            </a>

          </div>
        </div>
        <div className='mt-2.5 ml-2.5 flex items-center justify-between mr-2.5'>
          <InfoLabelNunito className='text-[15px]'>
            Show P&L in $ amount:
          </InfoLabelNunito>
          <div>
            <Switch
              checked={showPnL}
              variant={'secondary'}
              size={'sm'}
              colorScheme={'secondary'}
              onClick={() => setShowPnl(!showPnL)}
            />
          </div>


        </div>
        <div className='mt-2.5 h-[87px] w-full bg-gradient-3 opacity-40'>

        </div>
        <div className='absolute w-full  mt-[-87px] h-[87px] p-2.5'>
          <div className='flex items-center'>
            <InfoLabel>
              SOL/PERP
            </InfoLabel>
            <InfoLabel className={`ml-1 ${side === 'buy' ? '!text-green-4' : '!text-red-2'} `}>
              {side === 'buy' ? 'LONG' : 'SHORT'}
            </InfoLabel>
          </div>

          <div className=' w-full  flex  mt-2.5'>
            <InfoLabel className={`text-[28px] ${profit ? '!text-green-4' : '!text-red-2'}`}>
              {showPnL ? '$' + pnlAmount.toLocaleString() : (profit ? '+' : '-') + percentageChange + '%'}
            </InfoLabel>
            <InfoLabel className={`text-[15px] ml-2 mt-2.5`}>
              P&L
            </InfoLabel>
          </div>

        </div>
        <div>

          <div className='flex justify-center items-center mt-2'>
            <div className='flex mt-2.5 ml-2.5 justify-between w-[60%]'>
              <div>
                <ContentLabel className='text-[15px] flex items-center '>
                  Entry Price
                </ContentLabel>
                <InfoLabel className='mt-2 text-[15px] flex justify-center'>
                  {entryPrice}
                </InfoLabel>
              </div>
              <div>
                <ContentLabel className='text-[15px]'>
                  Exit Price
                </ContentLabel>
                <InfoLabel className='mt-2 text-[15px] flex justify-center'>
                  {currentPrice}
                </InfoLabel>
              </div>
              <div>
                <ContentLabel className='text-[15px]'>
                  Leverage
                </ContentLabel>
                <InfoLabel className='mt-2 text-[15px] flex justify-center'>
                  {leverage}x
                </InfoLabel>
              </div>
            </div>
          </div>

          <InfoLabel className='mt-4 text-[15px] flex items-center justify-center'>
            Share it with your friends!
          </InfoLabel>

        </div>
      </div>
    </div>
  )
}

export default PerpsEndModalV2