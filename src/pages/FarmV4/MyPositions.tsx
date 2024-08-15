import { FC } from 'react'
import { Icon, Badge, Container } from 'gfx-component-lib'
import { useFarmContext } from '@/context'

const MyPositions: FC<{ tokens: any }> = ({ tokens }) => {
    const { pool } = useFarmContext()
    return (
        <div>
            {tokens
                .filter((token: any) => pool.name === token.type)
                .map((token, index) => (
                    <div
                        className="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 dark:bg-black-2 px-2.5 
                                my-3.75 h-15 border border-solid dark:border-black-4 border-grey-4 bg-white 
                                rounded-tiny py-3.75"
                        key={`${token}_${index}`}
                    >
                        <div className="flex flex-row items-center">
                            <Icon
                                src={`img/crypto/${token?.sourceToken}.svg`}
                                className="border-solid dark:border-black-2 border-white 
                                  border-[2px] rounded-full h-[25px] w-[25px]"
                            />
                            <Icon
                                src={`img/crypto/${token?.targetToken}.svg`}
                                className="relative right-[10px] border-solid dark:border-black-2 
                                  border-white border-[2px] rounded-full h-[25px] w-[25px]"
                            />
                            <div className="font-poppins text-regular font-semibold 
                                    dark:text-grey-8 text-black-4">
                                {token.sourceToken} - {token.targetToken}
                            </div>
                        </div>
                        <div className="flex items-center justify-center text-regular 
                                font-semibold dark:text-grey-8 text-black-4">
                            $0.44
                        </div>
                        <div className="border border-solid dark:border-black-4 flex items-center
                                  font-poppins text-tiny font-semibold dark:text-grey-8 text-black-4 mx-auto
                                  border-grey-1 bg-grey-5 dark:bg-black-2 rounded-[2.5px] w-10 h-[25px] px-1">
                            0.2%
                        </div>
                        <div className="flex items-center justify-center text-black-4 
                                    text-regular font-semibold dark:text-grey-8 w-[120%]">
                            0.61 {token?.sourceToken} / 74.55 {token?.targetToken}
                        </div>
                        <div className="flex items-center justify-center text-black-4 
                                    text-regular font-semibold dark:text-grey-8">
                            $1.22
                        </div>
                        <div className="flex items-center justify-center text-black-4 
                                    text-regular font-semibold dark:text-grey-8">
                            $22.2
                        </div>
                        <div className="flex items-center justify-center">
                            <Badge variant="default" size={'lg'} className={'to-brand-secondaryGradient-secondary/50'}>
                                <span className={'font-poppins font-semibold my-0.5'}>185%</span>
                            </Badge>
                        </div>
                        <div className="flex items-center justify-evenly">
                            <Container
                                className='h-[30px] w-[61px] cursor-pointer flex flex-row 
                            justify-center items-center !rounded-[200px]'
                                colorScheme={'primaryGradient'}
                                size={'lg'}
                            >
                                Claim
                            </Container>
                            <div className='h-[30px] w-[30px] flex flex-row justify-center items-center border-[1.5px] 
                            border-solid dark:border-grey-8 border-blue-1 bg-grey-5 dark:bg-black-2 rounded-tiny 
                            cursor-pointer text-black-4 dark:text-white text-regular font-bold'>
                                +
                            </div>
                            <div className='h-[30px] w-[30px] flex flex-row justify-center items-center border-[1.5px] 
                            border-solid dark:border-grey-8 border-blue-1 bg-grey-5 dark:bg-black-2 
                            rounded-tiny cursor-pointer text-black-4 dark:text-white text-regular font-bold'>
                                -
                            </div>
                        </div>
                    </div>
                )
                )}
        </div>
    )
}

export default MyPositions
