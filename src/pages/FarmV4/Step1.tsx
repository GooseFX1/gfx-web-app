import { FC, Dispatch, SetStateAction } from "react";

const Step1: FC<{
    slider: any
    setPoolType: Dispatch<SetStateAction<string>>
    setIsCreatePool: Dispatch<SetStateAction<boolean>>
}> = ({ setPoolType, setIsCreatePool, slider }) => (
    <>
        <div className="text-regular !text-grey-2 dark:!text-grey-1 border-b border-solid dark:border-black-4 
        border-grey-4 p-2.5 h-16">
            <span className="text-purple-3">Step 1</span> of 3
            <div className="dark:text-grey-8 text-black-4 font-semibold font-sans text-[18px] mt-2">
                Create A Pool
            </div>
        </div>
        <div className='py-3 px-2.5'>
            <div className='border border-solid dark:border-black-4 border-grey-4 
          dark:bg-black-1 bg-grey-5 rounded-tiny p-2.5 h-[97px] cursor-pointer
          hover:border-grey-1 dark:hover:border-grey-4'
                onClick={() => {
                    setPoolType('Primary')
                    slider.current.slickGoTo(1)
                }
                }>
                <div className='flex flex-row'>
                    <img
                        src="img/assets/farm_Primary.svg"
                        alt="primary"
                        height={20}
                        width={20}
                        className='mr-1.5'
                    />
                    <span className='text-[18px] font-sans font-semibold dark:text-grey-8 text-black-4'>
                        Primary
                    </span>
                </div>
                <div className='mt-2.5 text-regular font-semibold text-grey-1 dark:text-grey-2'>
                    Create a pool with the stable movements, e.g: USDC, USDT, SOL, MSOL & JitoSOL.
                </div>
            </div>
        </div>
        <div className='py-3 px-2.5'>
            <div className='border border-solid dark:border-black-4 border-grey-4 
          dark:bg-black-1 bg-grey-5 rounded-tiny p-2.5 h-[97px] cursor-pointer
          hover:border-grey-1 dark:hover:border-grey-4'
                onClick={() => {
                    setPoolType('Hyper')
                    slider.current.slickGoTo(1)
                }
                }>
                <div className='flex flex-row'>
                    <img src="img/assets/farm_Hyper.svg" alt="hyper" height={20} width={20} className='mr-1.5' />
                    <span className='text-[18px] font-sans font-semibold dark:text-grey-8 text-black-4'>
                        Hyper
                    </span>
                </div>
                <div className='mt-2.5 text-regular font-semibold text-grey-1 dark:text-grey-2'>
                    Create a pool with the most hyped tokens on the market,
                    with permanently locked liquidity but still earn fees forever.
                </div>
            </div>
        </div>
        <div className='py-3 px-2.5'>
            <div className='border border-solid dark:border-black-4 border-grey-4 
          dark:bg-black-1 bg-grey-5 rounded-tiny p-2.5 h-[110px] cursor-pointer
          hover:border-grey-1 dark:hover:border-grey-4'
                onClick={() => {
                    setIsCreatePool(false)
                    window.open('https://docs.goosefx.io/features/farm')
                }
                }>
                <div className='flex flex-row'>
                    <img
                        src="img/assets/question-icn.svg"
                        alt="primary" height={20} width={20}
                        className='mr-1.5'
                    />
                    <span className='text-[18px] font-sans font-semibold dark:text-grey-8 text-black-4'>
                        Need some help?
                    </span>
                </div>
                <div className='mt-2.5 text-regular font-semibold text-grey-1 dark:text-grey-2'>
                    Not sure whether to create a pool with stable or hyper assets?
                    Tap here to visit our docs and get all your questions answered
                    before you start.
                </div>
            </div>
        </div>
    </>

)


export default Step1