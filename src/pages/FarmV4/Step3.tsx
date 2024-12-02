import { FC } from 'react'
import { JupToken } from './constants'
import { Tooltip, TooltipContent, TooltipTrigger } from 'gfx-component-lib'
import { bigNumberFormatter, loadIconImage } from '@/utils'
import { useDarkMode } from '@/context'
import BigNumber from 'bignumber.js'

const Step3: FC<{
  tokenA: JupToken
  tokenB: JupToken
  amountTokenA: string
  amountTokenB: string
  initialPrice: string
  poolType: string | null
}> = ({ tokenA, tokenB, amountTokenA, amountTokenB, initialPrice, poolType }) => {
  const { mode } = useDarkMode()

  return (
    <>
      <div
        className="text-regular !text-grey-2 dark:!text-grey-1 border-b border-solid dark:border-black-4 
              border-grey-4 p-2.5 h-17"
      >
        <span className="text-purple-3">Step 2</span> of 2
        <div className="dark:text-grey-8 text-black-4 font-semibold font-sans text-[18px] mt-2">
          Review & Confirm
        </div>
      </div>
      <div className="h-[340px] p-2.5 m-2.5 dark:bg-black-1 bg-grey-5 rounded-tiny">
        <div className="flex justify-between mb-3">
          <span className="text-regular font-semibold dark:text-grey-2 text-grey-1">Pool Type</span>
          <div
            className="text-regular font-semibold dark:text-grey-8 
                        text-black-4 flex flex-row items-center"
          >
            {poolType && (
              <>
                <img
                  src={`/img/assets/farm_${poolType.toLowerCase()}.svg`}
                  alt={poolType}
                  height={20}
                  width={20}
                  className="mr-[5px]"
                />
                <span>{poolType}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex justify-between mb-3">
          <span className="text-regular font-semibold dark:text-grey-2 text-grey-1">Token Pair</span>
          <div
            className="text-regular font-semibold dark:text-grey-8 text-black-4 
                        flex flex-row items-center"
          >
            <img
              src={loadIconImage(tokenA?.logoURI, mode)}
              alt={'token'}
              height={20}
              width={20}
              className="mr-[5px] rounded-half"
            />
            <span>{tokenA?.symbol}&nbsp;/&nbsp;</span>
            <img
              src={loadIconImage(tokenB?.logoURI, mode)}
              alt={'token'}
              height={20}
              width={20}
              className="mr-[5px] rounded-half"
            />
            <span>{tokenB?.symbol}</span>
          </div>
        </div>
        <div className="flex justify-between mb-3">
          <span className="text-regular font-semibold dark:text-grey-2 text-grey-1">Inital Price</span>
          <span className="text-regular font-semibold dark:text-grey-8 text-black-4">
            ${bigNumberFormatter(new BigNumber(initialPrice))}
          </span>
        </div>
        <div className="flex justify-between mb-3">
          <span className="text-regular font-semibold dark:text-grey-2 text-grey-1">
            {`Token A (${tokenA?.symbol})`}
          </span>
          <span className="text-regular font-semibold dark:text-grey-8 text-black-4">
            {bigNumberFormatter(new BigNumber(amountTokenA))} {tokenA?.symbol}
          </span>
        </div>
        <div className="flex justify-between mb-3">
          <span className="text-regular font-semibold dark:text-grey-2 text-grey-1">
            {`Token B (${tokenB?.symbol})`}
          </span>
          <span className="text-regular font-semibold dark:text-grey-8 text-black-4">
            {bigNumberFormatter(new BigNumber(amountTokenB))} {tokenB?.symbol}
          </span>
        </div>
        {/* <div className="flex justify-between mb-2">
                <span className="text-regular font-semibold dark:text-grey-2 text-grey-1">
                    Total Deposit
                </span>
                <span className="text-regular font-semibold dark:text-grey-8 text-black-4">$652.42</span>
            </div> */}
                <div className="flex justify-between mb-3">
                    <Tooltip>
                        <TooltipTrigger
                            className={`text-regular font-semibold text-yellow-2 underline !decoration-dotted`}>
                            Pool Fee Rate
                        </TooltipTrigger>
                        <TooltipContent className={'z-[1001]'}>
                            This is the fee in bps % we charge per swap
                        </TooltipContent>
                    </Tooltip>
                    <span className="text-regular font-semibold text-yellow-2">0.2%</span>
                </div>
                <div className="flex justify-between mb-4">
                    <Tooltip>
                        <TooltipTrigger
                            className="text-regular font-semibold text-yellow-2 underline !decoration-dotted">
                            Pool Creation Fee
                        </TooltipTrigger>
                        <TooltipContent className={'z-[1001]'}>
                            This fee is the SOL required to create the pool on the blockchain network,
                            it is not a fee to our protocol.
                        </TooltipContent>
                    </Tooltip>
                    <span className="text-regular font-semibold text-yellow-2">~0.1 SOL</span>
                </div>
                <div className="text-regular font-semibold text-yellow-2">
                    Note: If you have less than 0.1 SOL, the transaction will fail. 
                    Please ensure that you have more than 0.1 SOL to create a new pool.
                </div>
            </div>
        </>
    )
}

export default Step3
