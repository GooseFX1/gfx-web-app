import { FC } from 'react'
import { JupToken } from './constants'
import { Tooltip, TooltipContent, TooltipTrigger } from 'gfx-component-lib'
import { loadIconImage } from '@/utils'
import { useDarkMode } from '@/context'
import { IconWithFallback } from '@/components/common/IconWithFallback'
import TextNumber from '@/components/common/TextNumber'
import { GAMMA_POOL_CREATION_FEE } from './constants'

const CreatePoolConfirmStep: FC<{
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
                  src={poolType === 'Stable' ? `/img/assets/farm_primary.svg`
                    : `/img/assets/farm_${poolType.toLowerCase()}.svg`
                  }
                  alt={poolType}
                  height={20}
                  width={20}
                  className="mr-[5px]"
                />
                <span>{poolType === 'Stable' ? 'Primary' : poolType}</span>
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
            <IconWithFallback
              src={loadIconImage(tokenA?.logoURI, mode)}
              alt={'token'}
              size={'sm'}
              className="mr-[5px] rounded-half"
            />
            <span>{tokenA?.symbol}&nbsp;/&nbsp;</span>
            <IconWithFallback
              src={loadIconImage(tokenB?.logoURI, mode)}
              alt={'token'}
              size={'sm'}
              className="mr-[5px] rounded-half"
            />
            <span>{tokenB?.symbol}</span>
          </div>
        </div>
        <div className="flex justify-between mb-3">
          <span className="text-regular font-semibold dark:text-grey-2 text-grey-1">Inital Price</span>
          <span className="text-regular font-semibold dark:text-grey-8 text-black-4">
            <TextNumber value={initialPrice} decimals={6} type={'currency'}/>
          </span>
        </div>
        <div className="flex justify-between mb-3">
          <span className="text-regular font-semibold dark:text-grey-2 text-grey-1">
            {`Token A (${tokenA?.symbol})`}
          </span>
          <span className="text-regular font-semibold dark:text-grey-8 text-black-4">
            <TextNumber value={amountTokenA} decimals={tokenA?.decimals ?? 6} type={'currency'}>
              &nbsp;{tokenA?.symbol}
            </TextNumber>
          </span>
        </div>
        <div className="flex justify-between mb-3">
          <span className="text-regular font-semibold dark:text-grey-2 text-grey-1">
            {`Token B (${tokenB?.symbol})`}
          </span>
          <span className="text-regular font-semibold dark:text-grey-8 text-black-4">
            <TextNumber value={amountTokenB} decimals={tokenB?.decimals ?? 6} type={'currency'}>
              &nbsp;{tokenB?.symbol}
            </TextNumber>
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
                    <span className="text-regular font-semibold text-yellow-2">~{GAMMA_POOL_CREATION_FEE} SOL</span>
                </div>
                <div className="text-regular font-semibold text-yellow-2">
                    Note: If you have less than {GAMMA_POOL_CREATION_FEE} SOL, the transaction will fail. 
                    Please ensure that you have more than {GAMMA_POOL_CREATION_FEE} SOL to create a new pool.
                </div>
            </div>
        </>
    )
}

export default CreatePoolConfirmStep
