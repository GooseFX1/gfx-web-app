import { Dispatch, FC, SetStateAction } from "react";
import {
    Container,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
    Button
} from 'gfx-component-lib'
import { useAccounts, useDarkMode } from '../../context'
import { ADDRESSES, SSLToken } from './constants'
import RadioOptionGroup from '@/components/common/RadioOptionGroup'

const Step2: FC<{
    tokenA: SSLToken
    setTokenA: Dispatch<SetStateAction<SSLToken>>
    tokenB: SSLToken
    setTokenB: Dispatch<SetStateAction<SSLToken>>
    isDropdownOpenA: boolean
    setIsDropdownOpenA: { toggle: () => void; on: () => void; off: () => void; set: (value: boolean) => void }
    isDropdownOpenB: boolean
    setIsDropdownOpenB: { toggle: () => void; on: () => void; off: () => void; set: (value: boolean) => void }
    handleChange: (e: any, boolean) => void
    amountTokenA: string
    amountTokenB: string
    feeTier: string
    setFeeTier: Dispatch<SetStateAction<string>>
    liquidity: number
}> = ({
    tokenA,
    setTokenA,
    tokenB,
    setTokenB,
    isDropdownOpenA,
    isDropdownOpenB,
    setIsDropdownOpenA,
    setIsDropdownOpenB,
    handleChange,
    amountTokenA,
    amountTokenB,
    feeTier,
    setFeeTier,
    liquidity
}) => {
        const { getUIAmount } = useAccounts()
        const { mode } = useDarkMode()
        return (
            <>
                <div className="text-regular !text-grey-2 dark:!text-grey-1 border-b border-solid dark:border-black-4 
              border-grey-4 p-2.5 h-16">
                    <span className="text-purple-3">Step 2</span> of 3
                    <div className="dark:text-grey-8 text-black-4 font-semibold font-sans text-[18px] mt-2">
                        Pool Settings
                    </div>
                </div>
                <div className='py-3 border-b border-solid dark:border-black-4 border-grey-4'>
                    <div className="flex flex-row justify-between items-center mb-2.5 mx-2.5">
                        <div className='font-sans text-regular font-semibold dark:text-grey-8 text-black-4'>
                            1. Select A Token
                        </div>
                        <div className='flex flex-row items-center'>
                            <img src="/img/assets/wallet-dark-enabled.svg" alt="wallet" className='mr-1.5' />
                            <span className='text-regular font-semibold dark:text-grey-2 text-black-4'>
                                {getUIAmount(tokenA?.address?.toBase58())?.toFixed(2)} {tokenA?.token}
                            </span>
                        </div>
                    </div>
                    <div className='h-[45px] w-[480px] dark:bg-black-1 bg-grey-5 flex flex-row rounded-[3px]
              border border-solid border-black-4 dark:border-grey-4 p-[5px] pr-2.5 mb-5 mx-2.5'>
                        <Container
                            className={'w-[115px] h-[35px] p-0 rounded-full'}
                            colorScheme={'primaryGradient'}
                            size={'lg'}
                        >
                            <DropdownMenu open={isDropdownOpenA} onOpenChange={setIsDropdownOpenA.set}>
                                <DropdownMenuTrigger asChild className={'focus-visible:outline-none'}>
                                    <Button
                                        colorScheme={'default'}
                                        size={'sm'}
                                        isLoading={false}
                                        className='w-[115px] h-[35px] rounded-full flex flex-row justify-between p-1'>
                                        <img 
                                            src={`img/crypto/${tokenA?.token}.svg`} 
                                            alt="token" 
                                            height={20} 
                                            width={20} 
                                        />
                                        <span>{tokenA?.token}</span>
                                        <img
                                            style={{
                                                transform: `rotate(${isDropdownOpenA ? '180deg' : '0deg'})`,
                                                transition: 'transform 0.2s ease-in-out'
                                            }}
                                            src={`/img/assets/farm-chevron-${mode}.svg`}
                                            alt={'chevron'}
                                        />
                                    </Button>
                                </DropdownMenuTrigger>
                                {isDropdownOpenA && (
                                    <DropdownMenuContent className={'mt-3.75'} portal={false}>
                                        {ADDRESSES['mainnet-beta']?.map((item, index) => (
                                            <DropdownMenuItem className={'group gap-2 cursor-pointer'}
                                                onClick={() => setTokenA(item)}
                                                key={`${item}_${index}`}>
                                                <img
                                                    src={`img/crypto/${item?.token}.svg`}
                                                    alt="token"
                                                    height={20}
                                                    width={20}
                                                />
                                                <span>{item?.token}</span>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                )}
                            </DropdownMenu>
                        </Container>
                        <input
                            type="text"
                            placeholder={`0.00 ${tokenA?.token}`}
                            onChange={(e) => handleChange(e, true)}
                            value={amountTokenA}
                            className='w-full outline-none dark:bg-black-1 bg-grey-5 
                text-right text-regular font-semibold text-black-4 dark:text-grey-8'
                        />
                    </div>
                    <div className="flex flex-row justify-between items-center mb-2.5 mx-2.5">
                        <div className='font-sans text-regular font-semibold dark:text-grey-8 text-black-4'>
                            2. Select B Token
                        </div>
                        <div className='flex flex-row items-center'>
                            <img src="/img/assets/wallet-dark-enabled.svg" alt="wallet" className='mr-1.5' />
                            <span className='text-regular font-semibold dark:text-grey-2 text-black-4'>
                                {getUIAmount(tokenB?.address?.toBase58())?.toFixed(2)} {tokenB?.token}
                            </span>
                        </div>
                    </div>
                    <div className='h-[45px] w-[480px] dark:bg-black-1 bg-grey-5 flex flex-row rounded-[3px]
              border border-solid border-black-4 dark:border-grey-4 p-[5px] pr-2.5 mb-5 mx-2.5'>
                        <Container
                            className={'w-[115px] h-[35px] p-0 rounded-full'}
                            colorScheme={'primaryGradient'}
                            size={'lg'}
                        >
                            <DropdownMenu open={isDropdownOpenB} onOpenChange={setIsDropdownOpenB.set}>
                                <DropdownMenuTrigger asChild className={'focus-visible:outline-none'}>
                                    <Button
                                        colorScheme={'default'}
                                        size={'sm'}
                                        isLoading={false}
                                        className='w-[115px] h-[35px] rounded-full flex flex-row justify-between p-1'>
                                        <img 
                                            src={`img/crypto/${tokenB?.token}.svg`} 
                                            alt="token" 
                                            height={20} 
                                            width={20} 
                                        />
                                        <span>{tokenB?.token}</span>
                                        <img
                                            style={{
                                                transform: `rotate(${isDropdownOpenB ? '180deg' : '0deg'})`,
                                                transition: 'transform 0.2s ease-in-out'
                                            }}
                                            src={`/img/assets/farm-chevron-${mode}.svg`}
                                            alt={'chevron'}
                                        />
                                    </Button>
                                </DropdownMenuTrigger>
                                {isDropdownOpenB && (
                                    <DropdownMenuContent className={'mt-3.75'} portal={false}>
                                        {ADDRESSES['mainnet-beta']?.map((item, index) => (
                                            <DropdownMenuItem className={'group gap-2 cursor-pointer'}
                                                onClick={() => setTokenB(item)}
                                                key={`${item}_${index}`}>
                                                <img
                                                    src={`img/crypto/${item?.token}.svg`}
                                                    alt="token"
                                                    height={20}
                                                    width={20}
                                                />
                                                <span>{item?.token}</span>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                )}
                            </DropdownMenu>
                        </Container>
                        <input
                            type="text"
                            placeholder={`0.00 ${tokenB?.token}`}
                            onChange={(e) => handleChange(e, false)}
                            value={amountTokenB}
                            className='w-full outline-none dark:bg-black-1 bg-grey-5 
                text-right text-regular font-semibold text-black-4 dark:text-grey-8'
                        />
                    </div>
                    <div className="flex flex-row justify-between items-center mb-2.5 mx-2.5">
                        <div className='font-sans text-regular font-semibold dark:text-grey-8 
                        text-black-4 underline !decoration-dotted'>
                            3. Initial Price
                        </div>
                        <div className='flex flex-row items-center'>
                            <img src={`/img/assets/switch_${mode}.svg`} 
                                alt="switch"
                                className='mr-1.5' 
                            />
                            <span className='text-regular font-bold dark:text-white 
                            text-blue-1 underline cursor-pointer'>
                                {`${tokenA?.token} per ${tokenB?.token}`}
                            </span>
                        </div>
                    </div>
                    <div className='h-[45px] w-[480px] dark:bg-black-1 bg-grey-5 flex 
                    flex-row justify-between rounded-[3px] border border-solid border-black-4 
                    dark:border-grey-4 px-[5px] py-[3.5px] mb-5 items-center mx-2.5'>
                        <span className='text-regular font-semibold dark:text-grey-8 text-black-4'>{liquidity}</span>
                        <span className='text-regular font-semibold dark:text-grey-1 text-grey-9'>
                            {`${tokenA?.token} / ${tokenB?.token}`}
                        </span>
                    </div>
                    <div className='font-sans text-regular font-semibold dark:text-grey-8 text-black-4 mx-2.5'>
                        4. Fee Tier
                    </div>
                    <div className='mx-2.5'>
                        <RadioOptionGroup
                            defaultValue={'deposit'}
                            value={feeTier}
                            className={`w-full mt-3 max-sm:mt-1`}
                            optionClassName={`w-full text-h5`}
                            options={[
                                {
                                    value: '0.01',
                                    label: '0.01%',
                                    onClick: () => setFeeTier("0.01")
                                },
                                {
                                    value: '0.04',
                                    label: '0.04%',
                                    onClick: () => setFeeTier("0.04")
                                },
                                {
                                    value: '0.7',
                                    label: '0.7%',
                                    onClick: () => setFeeTier("0.7")
                                },
                                {
                                    value: '1',
                                    label: '1%',
                                    onClick: () => setFeeTier("1")
                                }
                            ]}
                        />
                    </div>
                </div>
            </>
        )
    }

export default Step2