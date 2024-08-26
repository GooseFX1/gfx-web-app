import { Dispatch, FC, SetStateAction } from 'react'
import {
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  Input,
  InputElementLeft,
  InputGroup,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from 'gfx-component-lib'
import { useAccounts, useDarkMode } from '../../context'
import { ADDRESSES, SSLToken } from './constants'
import RadioOptionGroup from '@/components/common/RadioOptionGroup'
import useBoolean from '@/hooks/useBoolean'

const Step2: FC<{
  tokenA: SSLToken
  setTokenA: Dispatch<SetStateAction<SSLToken>>
  tokenB: SSLToken
  setTokenB: Dispatch<SetStateAction<SSLToken>>
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
        handleChange,
        amountTokenA,
        amountTokenB,
        feeTier,
        setFeeTier,
        liquidity
      }) => {
  const { getUIAmount } = useAccounts()
  const { mode } = useDarkMode()
  const tokenAamount = tokenA ? getUIAmount(tokenA.address.toBase58()).toFixed(2) : '0.00'
  const tokenBamount = tokenB ? getUIAmount(tokenB.address.toBase58()).toFixed(2) : '0.00'
  return (
    <>
      <div className="text-regular !text-grey-2 dark:!text-grey-1 border-b border-solid dark:border-black-4
              border-grey-4 p-2.5 h-16">
        <span className="text-purple-3">Step 2</span> of 3
        <h2 className="dark:text-grey-8 text-black-4 font-semibold font-sans text-[18px] mt-2">
          Pool Settings
        </h2>
      </div>
      <div className="p-3 flex flex-col border-b border-solid dark:border-black-4 border-grey-4 gap-2">
        <div>
          <div className="flex flex-row justify-between items-center mb-2.5 mx-2.5">
            <div className="font-sans text-regular font-semibold dark:text-grey-8 text-black-4">
              1. Select Token A
            </div>
            {tokenA && <div className="flex flex-row items-center">
              <img src={`/img/assets/wallet-${mode}-${tokenAamount != '0.00' ? 'enabled' : 'disabled'}.svg`}
                   alt="wallet" className="mr-1.5" />
              <span className={
                cn(
                  "text-regular font-semibold dark:text-grey-2 text-black-4",
                  tokenAamount === '0.00' && 'text-text-lightmode-secondary dark:text-text-darkmode-secondary'
                )
              }>
                                {tokenAamount} {tokenA?.token}
                            </span>
            </div>}
          </div>
          <TokenSelectionInput
            token={tokenA}
            handleChange={handleChange}
            amountToken={amountTokenA}
            setToken={setTokenA}
          />
        </div>
        <div>
          <div className="flex flex-row justify-between items-center mb-2.5 mx-2.5">
            <div className="font-sans text-regular font-semibold dark:text-grey-8 text-black-4">
              2. Select Token B
            </div>
            {tokenB && <div className="flex flex-row items-center">
              <img src={`/img/assets/wallet-${mode}-${tokenBamount != '0.00' ? 'enabled' : 'disabled'}.svg`}
                   alt="wallet" className="mr-1.5" />
              <span className={
                cn(
                "text-regular font-semibold dark:text-grey-2 text-black-4",
                tokenAamount === '0.00' && 'text-text-lightmode-secondary dark:text-text-darkmode-secondary'
                )
              }>
                                {getUIAmount(tokenB?.address?.toBase58())?.toFixed(2)} {tokenB?.token}
                            </span>
            </div>}
          </div>
          <TokenSelectionInput
            token={tokenB}
            handleChange={(e) => handleChange(e, false)}
            amountToken={amountTokenB}
            setToken={setTokenB} />
        </div>
        <div>
          <div className="flex flex-row justify-between items-center mb-2.5 mx-2.5">
            <Tooltip >
              <TooltipTrigger className={`font-sans text-regular font-semibold dark:text-grey-8
                        text-black-4 underline !decoration-dotted`}>
                3. Initial Price
              </TooltipTrigger>
              <TooltipContent className={'z-[1001]'} align={'start'}>
                The initial price is based on the ratio of tokens you deposit for initial liquidity.
                If the token is already trading on GooseFx, we'll automatically use the current price.
              </TooltipContent>
            </Tooltip>

            <div className="flex flex-row items-center">
              <img src={`/img/assets/switch_${mode}.svg`}
                   alt="switch"
                   className="mr-1.5"
              />
              {tokenA && tokenB && (<span className="text-regular font-bold dark:text-white
                            text-blue-1 underline cursor-pointer">
                                {`${tokenA?.token} per ${tokenB?.token}`}
                            </span>)}
            </div>
          </div>
          <div className="h-[45px] dark:bg-black-1 bg-grey-5 flex p-2
                    flex-row justify-between rounded-[3px] border border-solid border-black-4
                    dark:border-grey-4 items-center ">
            <span className="text-regular font-semibold dark:text-grey-8 text-black-4">{liquidity}</span>
            {tokenA && tokenB && <span className="text-regular font-semibold dark:text-grey-1 text-grey-9">
                            {`${tokenA?.token} / ${tokenB?.token}`}
            </span>}
          </div>
        </div>
        <div>
          <div className="font-sans text-regular font-semibold dark:text-grey-8 text-black-4 mx-2.5">
            4. Fee Tier
          </div>
          <div className="mx-2.5">
            <RadioOptionGroup
              defaultValue={'deposit'}
              value={feeTier}
              className={`w-full mt-3 max-sm:mt-1`}
              optionClassName={`w-full text-h5`}
              options={[
                {
                  value: '0.01',
                  label: '0.01%',
                  onClick: () => setFeeTier('0.01')
                },
                {
                  value: '0.04',
                  label: '0.04%',
                  onClick: () => setFeeTier('0.04')
                },
                {
                  value: '0.7',
                  label: '0.7%',
                  onClick: () => setFeeTier('0.7')
                },
                {
                  value: '1',
                  label: '1%',
                  onClick: () => setFeeTier('1')
                }
              ]}
            />
          </div>
        </div>
      </div>
    </>
  )
}

function TokenSelectionInput({
                               token,
                               handleChange,
                               amountToken,
                               setToken
                             }: {
  token: SSLToken | null
  handleChange: (e: any, boolean) => void
  amountToken: string
  setToken: Dispatch<SetStateAction<SSLToken>>
}) {
  const [isDropDownOpen, setIsDropdownOpen] = useBoolean(false)
  const { mode, isDarkMode } = useDarkMode()
  return <InputGroup
    leftItem={
      <InputElementLeft>
        <DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropdownOpen.set}>
          <DropdownMenuTrigger asChild className={'focus-visible:outline-none'}>
            <Button
              colorScheme={'secondaryGradient'}
              variant={'outline'}

              isLoading={false}
              className="min-w-[115px] h-[35px] rounded-full flex flex-row justify-between"
              iconLeft={token ? <Icon
                src={`img/crypto/${token.token}.svg`}
                size={'sm'}
              /> : null}
              iconRight={<Icon
                style={{
                  transform: `rotate(${isDropDownOpen ? '180deg' : '0deg'})`,
                  transition: 'transform 0.2s ease-in-out'
                }}
                src={`/img/assets/farm-chevron-${mode}.svg`}
                className={cn(
                  !isDarkMode ? 'stroke-background-blue' : ''
                )}
                size={'sm'}
              />}
            >
              {token ? token.token : 'Select Token'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={'mt-3.75'} portal={false}>
            {ADDRESSES['mainnet-beta']?.map((item, index) => (
              <DropdownMenuItem className={'group gap-2 cursor-pointer'}
                                onClick={() => setToken(item)}
                                key={`${item}_${index}`}>
                <Icon
                  src={`img/crypto/${item?.token}.svg`}
                  size={'sm'}
                />
                <span>{item?.token}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </InputElementLeft>
    }
  >
    <Input type="text"
           placeholder={`0.00 ${token ? token.token : ''}`}
           onChange={(e) => handleChange(e, true)}
           value={amountToken}
           className={'h-[45px] text-right'}
    />
  </InputGroup>
}

export default Step2