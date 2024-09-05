import { FC } from 'react'
import { JupToken } from './constants'
import { useGamma } from '@/context'
import { Tooltip, TooltipContent, TooltipTrigger } from 'gfx-component-lib'

const Step3: FC<{
    tokenA: JupToken
    tokenB: JupToken
}> = ({ tokenA, tokenB }) => {
    const { pool } = useGamma()
    return (
        <>
            <div className="text-regular !text-grey-2 dark:!text-grey-1 border-b border-solid dark:border-black-4 
              border-grey-4 p-2.5 h-16">
                <span className="text-purple-3">Step 3</span> of 3
                <div className="dark:text-grey-8 text-black-4 font-semibold font-sans text-[18px] mt-2">
                    Review & Confirm
                </div>
            </div>
            <div className='h-[340px] p-2.5 m-2.5 dark:bg-black-1 bg-grey-5 rounded-tiny'>
                <div className="flex justify-between mb-2">
                    <span className="text-regular font-semibold dark:text-grey-2 text-grey-1">
                        Pool Type
                    </span>
                    <div className="text-regular font-semibold dark:text-grey-8 
                        text-black-4 flex flex-row items-center">
                        <img
                            src={`/img/assets/farm_${pool?.name}.svg`}
                            alt={pool?.name}
                            height={20}
                            width={20}
                            className='mr-[5px]'
                        />
                        <span>{pool?.name}</span>
                    </div>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="text-regular font-semibold dark:text-grey-2 text-grey-1">
                        Token Pair
                    </span>
                    <div className="text-regular font-semibold dark:text-grey-8 text-black-4 
                        flex flex-row items-center">
                        <img
                            src={`/img/crypto/${tokenA?.symbol}.svg`}
                            alt={"token"} height={20}
                            width={20}
                            className='mr-[5px]'
                        />
                        <span>{tokenA?.symbol}&nbsp;/&nbsp;</span>
                        <img
                            src={tokenB?.logoURI ?? `/img/crypto/${tokenB?.symbol}.svg`}
                            alt={"token"}
                            height={20}
                            width={20}
                            className='mr-[5px]'
                        />
                        <span>{tokenB?.symbol}</span>
                    </div>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="text-regular font-semibold dark:text-grey-2 text-grey-1">
                        Inital Price
                    </span>
                    <span className="text-regular font-semibold dark:text-grey-8 text-black-4">$160.22</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="text-regular font-semibold dark:text-grey-2 text-grey-1">
                        {`Token A (${tokenA?.symbol})`}
                    </span>
                    <span className="text-regular font-semibold dark:text-grey-8 text-black-4">
                        {`2.55 ${tokenA?.symbol}`}
                    </span>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="text-regular font-semibold dark:text-grey-2 text-grey-1">
                        {`Token B (${tokenB?.symbol})`}
                    </span>
                    <span className="text-regular font-semibold dark:text-grey-8 text-black-4">
                        {`326.22 ${tokenB?.symbol}`}
                    </span>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="text-regular font-semibold dark:text-grey-2 text-grey-1">
                        Total Deposit
                    </span>
                    <span className="text-regular font-semibold dark:text-grey-8 text-black-4">$652.42</span>
                </div>
                <div className="flex justify-between mb-2">
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
                <div className="flex justify-between mb-2">
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
                    <span className="text-regular font-semibold text-yellow-2">~0.2 SOL</span>
                </div>
            </div>
        </>
    )

}

export default Step3