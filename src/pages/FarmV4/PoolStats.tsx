/* eslint-disable */
import { ReactElement, FC } from "react";
import { GradientButtonWithBorder } from "@/pages/TradeV3/perps/components/PerpsGenericComp";

export const PoolStats: FC<{token: any}> = ({ token }): ReactElement => {
    return (
        <>
            <div className="flex justify-between mb-2">
                <span className="!font-regular font-semibold dark:text-grey-2 text-grey-1 underline decoration-dotted">Liquidity</span>
                <span className="!font-regular font-semibold dark:text-grey-8 text-black-4">{token?.liquidity}</span>
            </div>
            <div className="flex justify-between mb-2">
                <span className="!font-regular font-semibold dark:text-grey-2 text-grey-1 underline decoration-dotted">Volume</span>
                <span className="!font-regular font-semibold dark:text-grey-8 text-black-4">{token?.volume}</span>
            </div>
            <div className="flex justify-between mb-2">
                <span className="!font-regular font-semibold dark:text-grey-2 text-grey-1 underline decoration-dotted">Fees</span>
                <span className="!font-regular font-semibold dark:text-grey-8 text-black-4">{token?.fees}</span>
            </div>
            <div className="flex justify-between mb-2">
                <span className="!font-regular font-semibold dark:text-grey-2 text-grey-1 underline decoration-dotted">APR</span>
                <div className="w-2/12">
                    <GradientButtonWithBorder radius={5} height={25}>
                        <span className="!font-regular font-semibold dark:text-grey-8 text-black-4">185%</span>
                    </GradientButtonWithBorder>
                </div>
            </div>
        </>
    )
}