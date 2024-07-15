/* eslint-disable */
import { useSSLContext } from "@/context"
import { FC, ReactElement } from "react"
import { Icon } from 'gfx-component-lib'

export const ReviewConfirm: FC = (): ReactElement => {
    const { selectedCard } = useSSLContext()
    return (
        <>
            <div className='text-regular font-semibold font-poppins dark:text-grey-8 text-black-4 mb-2.5 mx-2.5'>2. Review and Confirm</div>
            <div className="dark:bg-black-1 bg-grey-5 mx-2.5 my-3 p-2.5">
            <div>
                <div className="flex justify-between mb-2">
                    <span className="!font-regular font-semibold dark:text-grey-2 text-grey-1 underline decoration-dotted">Deposit Ratio</span>
                    <div className="!font-regular font-semibold dark:text-grey-8 text-black-4 flex flex-row">
                        <Icon src={`img/crypto/${selectedCard?.sourceToken}.svg`} size='sm' className="mr-1" />
                        <span>50% /&nbsp;</span>
                        <Icon src={`img/crypto/${selectedCard?.targetToken}.svg`} size='sm' className="mr-1" />
                        <span>&nbsp;50%</span>
                    </div>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="!font-regular font-semibold dark:text-grey-2 text-grey-1 underline decoration-dotted">Est. 24H Fees</span>
                    <span className="!font-regular font-semibold dark:text-grey-8 text-black-4">{selectedCard?.volume}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="!font-regular font-semibold dark:text-grey-2 text-grey-1 underline decoration-dotted">Pool Fee Rate</span>
                    <span className="!font-regular font-semibold dark:text-grey-8 text-black-4">{selectedCard?.fees}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="!font-regular font-semibold dark:text-grey-2 text-grey-1 underline decoration-dotted">Total Deposit</span>
                    <span className="!font-regular font-semibold dark:text-grey-8 text-black-4">{selectedCard?.fees}</span>
                </div>
            </div>
        </div>
        </>

    )
}