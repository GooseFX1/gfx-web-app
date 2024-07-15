import { useDarkMode } from "@/context"
import { Icon } from "gfx-component-lib"
import { GradientButtonWithBorder } from "@/pages/TradeV3/perps/components/PerpsGenericComp";
import { truncateAddress } from '@/utils'
import { FC, ReactElement } from "react";

export const TokenRow: FC<{ token: any, balance: any }> = 
({ token, balance }): ReactElement => {
    const { mode } = useDarkMode()
    return (
        <div className='flex flex-row justify-between mx-2.5'>
            <div className='flex flex-row items-center items-center'>
                <Icon src={`img/crypto/${token}.svg`} size='sm' className='mr-2' />
                <span className='text-regular font-semibold font-poppins dark:text-grey-8 text-black-4 mr-2'>
                    {token}
                </span>
                <div className="w-[89px] px-1">
                    <GradientButtonWithBorder radius={2.5} height={25} >
                        <span className="!font-regular font-semibold dark:text-grey-8 text-black-4 ml-4">
                            {truncateAddress('FdUm8MtCFGMC2UvxEV2bywKBQaP6es7osMwqZ9i2Gbvi', 3)}
                        </span>
                        {/* <Icon src={`img/crypto/${token}.png`} size='sm'/> */}
                    </GradientButtonWithBorder>
                </div>
            </div>
            <div className='flex flex-row items-center'>
                <Icon src={`img/assets/wallet_${mode}.png`} size='sm' />
                <div className='ml-1.5 text-regular font-semibold dark:text-grey-8 text-black-4'>
                    {balance + " " + token}
                </div>
            </div>
        </div>
    )
}