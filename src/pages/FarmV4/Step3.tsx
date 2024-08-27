import { FC } from 'react'
import { SSLToken } from './constants'
import { Tooltip, TooltipContent, TooltipTrigger } from 'gfx-component-lib'

const Step3: FC<{
    tokenA: SSLToken
    tokenB: SSLToken
    poolType: string
}> = ({ poolType, tokenA, tokenB }) => (
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
                <div className="text-regular font-semibold dark:text-grey-8 text-black-4 flex flex-row items-center">
                    <img
                        src={`/img/assets/farm_${poolType}.svg`}
                        alt={poolType}
                        height={20}
                        width={20}
                        className='mr-[5px]'
                    />
                    <span>{poolType}</span>
                </div>
            </div>
            <div className="flex justify-between mb-2">
                <span className="text-regular font-semibold dark:text-grey-2 text-grey-1">
                    Token Pair
                </span>
                <div className="text-regular font-semibold dark:text-grey-8 text-black-4 flex flex-row items-center">
                    <img
                        src={`/img/crypto/${tokenA?.token}.svg`}
                        alt={"token"} height={20}
                        width={20}
                        className='mr-[5px]'
                    />
                    <span>{tokenA?.token}&nbsp;/&nbsp;</span>
                    <img
                        src={`/img/crypto/${tokenB?.token}.svg`}
                        alt={"token"}
                        height={20}
                        width={20}
                        className='mr-[5px]'
                    />
                    <span>{tokenB?.token}</span>
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
                    {`Token A (${tokenA?.token})`}
                </span>
                <span className="text-regular font-semibold dark:text-grey-8 text-black-4">
                    {`2.55 ${tokenA?.token}`}
                </span>
            </div>
            <div className="flex justify-between mb-2">
                <span className="text-regular font-semibold dark:text-grey-2 text-grey-1">
                    {`Token B (${tokenB?.token})`}
                </span>
                <span className="text-regular font-semibold dark:text-grey-8 text-black-4">
                    {`326.22 ${tokenB?.token}`}
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
                    <TooltipTrigger className={`text-regular font-semibold text-yellow-2 underline !decoration-dotted`}>
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
                    <TooltipTrigger className="text-regular font-semibold text-yellow-2 underline !decoration-dotted">
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
        <div className='h-[15px] border-b border-solid dark:border-black-4 border-grey-4'></div>
    </>
)

export default Step3