import { useFarmContext, useRewardToggle } from "@/context"
import { Icon } from "gfx-component-lib"
import { FC } from "react"
import { poolType } from "./constants"

const UnusedTokens: FC = () => {
    const { setIsPortfolio } = useRewardToggle()
    const { setPool } = useFarmContext()
    return (
        <div
            className="h-[250px] border border-solid dark:border-black-4 border-grey-4 
        p-2.5 dark:bg-black-2 bg-white rounded-[10px]"
        >
            <h4 className="font-poppins text-regular font-semibold 
            text-black-4 dark:text-grey-8 underline decoration-dotted mb-2.5">
                Unused Tokens
            </h4>
            <div className='font-poppins text-[28px] font-semibold 
            text-black-4 dark:text-grey-8 mb-3.75'>$799.28</div>
            <div className='flex flex-row justify-between items-center mb-3'>
                <div className='flex flex-row items-center'>
                    <Icon src="img/crypto/SOL.svg" alt="token" size="sm" className="mr-1.5" />
                    <span className='text-[13px] font-semibold text-black-4 dark:text-grey-8 mr-2.5'>
                        SOL
                    </span>
                    <span className='text-[13px] font-semibold text-black-4 dark:text-grey-8 mr-1'>2.55</span>
                    <span className='text-[13px] font-semibold text-grey-9 dark:text-grey-1'>(~$459)</span>
                </div>
                <div onClick={() => {
                    setIsPortfolio.off()
                    setPool(poolType.all)
                }}
                    className='text-regular font-bold text-blue-1 dark:text-grey-8 underline cursor-pointer'>
                    Explore Pools
                </div>
            </div>
            <div className='flex flex-row justify-between items-center mb-3'>
                <div className='flex flex-row items-center'>
                    <Icon src="img/crypto/USDC.svg" alt="token" size="sm" className="mr-1.5" />
                    <span className='text-[13px] font-semibold text-black-4 dark:text-grey-8 mr-2.5'>USDC</span>
                    <span className='text-[13px] font-semibold text-black-4 dark:text-grey-8 mr-1'>195.20</span>
                    <span className='text-[13px] font-semibold text-grey-9 dark:text-grey-1'>(~$195.8)</span>
                </div>
                <div onClick={() => {
                    setIsPortfolio.off()
                    setPool(poolType.all)
                }}
                    className='text-regular font-bold text-blue-1 dark:text-grey-8 underline cursor-pointer'>
                    Explore Pools
                </div>
            </div>
            <div className='flex flex-row justify-between items-center mb-3'>
                <div className='flex flex-row items-center'>
                    <Icon src="img/crypto/BONK.svg" alt="token" size="sm" className="mr-1.5" />
                    <span className='text-[13px] font-semibold text-black-4 dark:text-grey-8 mr-2.5'>BONK</span>
                    <span className='text-[13px] font-semibold text-black-4 dark:text-grey-8 mr-1'>2,899,400</span>
                    <span className='text-[13px] font-semibold text-grey-9 dark:text-grey-1'>(~$57.2)</span>
                </div>
                <div onClick={() => {
                    setIsPortfolio.off()
                    setPool(poolType.all)
                }}
                    className='text-regular font-bold text-blue-1 dark:text-grey-8 underline cursor-pointer'>
                    Explore Pools
                </div>
            </div>
            <div className='flex flex-row justify-between items-center'>
                <div className='flex flex-row items-center'>
                    <Icon src="img/crypto/JITOSOL.svg" alt="token" size="sm" className="mr-1.5" />
                    <span className='text-[13px] font-semibold text-black-4 dark:text-grey-8 mr-2.5'>JITOSOL</span>
                    <span className='text-[13px] font-semibold text-black-4 dark:text-grey-8 mr-1'>0.49</span>
                    <span className='text-[13px] font-semibold text-grey-9 dark:text-grey-1'>(~$88.2)</span>
                </div>
                <div onClick={() => {
                    setIsPortfolio.off()
                    setPool(poolType.all)
                }}
                    className='text-regular font-bold text-blue-1 dark:text-grey-8 underline cursor-pointer'>
                    Explore Pools
                </div>
            </div>
        </div>
    )
}

export default UnusedTokens