import { Dispatch, FC, SetStateAction, useEffect, useLayoutEffect, useState } from 'react'
import {
  Button,
  cn,
  Container,
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
import { useAccounts, useDarkMode, useGamma } from '../../context'
import { JupToken, SSL_TOKENS, TOKEN_LIST_PAGE_SIZE } from './constants'
import RadioOptionGroup from '@/components/common/RadioOptionGroup'
import useBoolean from '@/hooks/useBoolean'
import Text from '@/components/Text'
import ScrollingHydrateContainer from '@/components/common/ScrollingHydrateContainer'
import WindowingContainer from '@/pages/FarmV4/WindowingContainer'

const Step2: FC<{
  tokenA: JupToken
  setTokenA: Dispatch<SetStateAction<JupToken>>
  tokenB: JupToken
  setTokenB: Dispatch<SetStateAction<JupToken>>
  handleChange: (e: any, boolean) => void
  amountTokenA: string
  amountTokenB: string
  feeTier: string
  setFeeTier: Dispatch<SetStateAction<string>>
  poolExists: boolean
  setPoolExists: (b: boolean) => void
  initialPrice: string
  setInitialPrice: Dispatch<SetStateAction<string>>
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
  poolExists,
  setPoolExists,
  initialPrice,
  setInitialPrice
}) => {
    const { getUIAmount } = useAccounts()
    const { mode } = useDarkMode()
    const { setSelectedCard } = useGamma()
    const tokenAamount = tokenA ? getUIAmount(tokenA.address).toFixed(2) : '0.00'
    const tokenBamount = tokenB ? getUIAmount(tokenB.address).toFixed(2) : '0.00'
    const [priceSwitch, setPriceSwitch] = useState(false)
    useEffect(() => {
      if (+amountTokenA && +amountTokenB) {
        !priceSwitch ? setInitialPrice((+amountTokenA / +amountTokenB)?.toString())
          : setInitialPrice((+amountTokenB / +amountTokenA)?.toString())
      } else {
        setInitialPrice('')
      }
    }, [amountTokenA, amountTokenB, priceSwitch])
    const navigateToPool = () => {
      if (!tokenA || !tokenB) return
      for (const token of SSL_TOKENS) {
        if (token.sourceTokenMintAddress == tokenA.address &&
          token.targetTokenMintAddress == tokenB.address) {
          setSelectedCard(token)
          break
        }
      }
    }
    useLayoutEffect(() => {
      if (!tokenA || !tokenB) return
      // API Req
      for (const token of SSL_TOKENS) {
        if (token.sourceTokenMintAddress == tokenA.address &&
          token.targetTokenMintAddress == tokenB.address) {
          setPoolExists(true)
          return
        }
      }
      setPoolExists(false)
    }, [tokenA, tokenB, setPoolExists])
    return (
      <>
        <div className="text-regular !text-grey-2 dark:!text-grey-1 border-b border-solid dark:border-black-4
              border-grey-4 p-2.5 h-16 ">
          <span className="text-purple-3">Step 2</span> of 3
          <h2 className="dark:text-grey-8 text-black-4 font-semibold font-sans text-[18px] mt-2">
            Pool Settings
          </h2>
        </div>
        <div className="p-3 flex flex-col overflow-scroll border-b border-solid 
          dark:border-black-4 border-grey-4 gap-5">
          <div>
            <div className="flex flex-row justify-between items-center mb-2.5">
              <div className="font-sans text-regular font-semibold dark:text-grey-8 text-black-4">
                1. Select Token A
              </div>
              <div className={cn('flex flex-row items-center', !tokenA && 'invisible')}>
                <img src={`/img/assets/wallet-${mode}-${tokenAamount != '0.00' ? 'enabled' : 'disabled'}.svg`}
                  alt="wallet" className="mr-1.5" />
                <span className={
                  cn(
                    'text-regular font-semibold dark:text-grey-2 text-black-4',
                    tokenAamount === '0.00' && 'text-text-lightmode-secondary dark:text-text-darkmode-secondary'
                  )
                }>
                  {tokenAamount} {tokenA?.symbol}
                </span>
              </div>
            </div>
            <TokenSelectionInput
              token={tokenA}
              handleChange={handleChange}
              amountToken={amountTokenA}
              setToken={setTokenA}
            />
          </div>
          <div>
            <div className="flex flex-row justify-between items-center mb-2.5">
              <div className="font-sans text-regular font-semibold dark:text-grey-8 text-black-4">
                2. Select Token B
              </div>
              <div className={cn('flex flex-row items-center', !tokenB && 'invisible')}>
                <img src={`/img/assets/wallet-${mode}-${tokenBamount != '0.00' ? 'enabled' : 'disabled'}.svg`}
                  alt="wallet" className="mr-1.5" />
                <span className={
                  cn(
                    'text-regular font-semibold dark:text-grey-2 text-black-4',
                    tokenAamount === '0.00' && 'text-text-lightmode-secondary dark:text-text-darkmode-secondary'
                  )
                }>
                  {tokenBamount} {tokenB?.symbol}
                </span>
              </div>
            </div>
            <TokenSelectionInput
              token={tokenB}
              handleChange={(e) => handleChange(e, false)}
              amountToken={amountTokenB}
              setToken={setTokenB} />
          </div>
          <div>
            <div className="flex flex-row justify-between items-center mb-2.5">
              <Tooltip>
                <TooltipTrigger className={`font-sans text-regular font-semibold dark:text-grey-8
                        text-black-4 underline !decoration-dotted`}>
                  3. Initial Price
                </TooltipTrigger>
                <TooltipContent className={'z-[1001]'} align={'start'}>
                  The initial price is based on the ratio of tokens you deposit for initial liquidity.
                  If the token is already trading on GooseFx, we'll automatically use the current price.
                </TooltipContent>
              </Tooltip>
              <div className={cn('flex flex-row items-center',
                (!tokenA || !tokenB) && 'invisible')} onClick={() => setPriceSwitch((prev) => !prev)}>
                <img src={`/img/assets/switch_${mode}.svg`}
                  alt="switch"
                  className="mr-1.5"
                />
                <span className={cn(`text-regular font-bold dark:text-white
                text-blue-1 underline cursor-pointer`)}>
                  {!priceSwitch ? `${tokenA?.symbol} per ${tokenB?.symbol}` : `${tokenB?.symbol} per ${tokenA?.symbol}`}
                </span>
              </div>
            </div>
            <div className="h-[45px] dark:bg-black-1 bg-grey-5 flex p-2
                    flex-row justify-between rounded-[3px] border border-solid border-black-4
                    dark:border-grey-4 items-center">
              <span className="text-regular font-semibold dark:text-grey-8 text-black-4">
                {initialPrice}
              </span>
              <span className={cn(
                'text-regular font-semibold dark:text-grey-1 text-grey-9',
                (!tokenA || !tokenB) && 'invisible'
              )}>
                {!priceSwitch ? `${tokenA?.symbol} / ${tokenB?.symbol}` : `${tokenB?.symbol} / ${tokenA?.symbol}`}
              </span>
            </div>
          </div>
          <div>
            <div className="font-sans text-regular font-semibold dark:text-grey-8 text-black-4">
              4. Fee Tier
            </div>
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
          {poolExists && <div>
            <Container className={'flex flex-col gap-2.5 p-2.5'}>
              <Text as={'h3'}>Existing Pool!</Text>
              <Text as={'p'}>The SOL-USDC exists. Start adding your funds now!</Text>
              <Button
                fullWidth
                colorScheme={'blue'}
                onClick={navigateToPool}
              >Goto {tokenA?.symbol}/{tokenB?.symbol} Pool</Button>
            </Container>
          </div>}
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
  token: JupToken | null
  handleChange: (e: any, boolean) => void
  amountToken: string
  setToken: Dispatch<SetStateAction<JupToken>>
}) {
  const { tokenList, isLoadingTokenList, updateTokenList, page, setPage, maxTokensReached } = useGamma()
  const [isDropDownOpen, setIsDropdownOpen] = useBoolean(false)
  const { mode, isDarkMode } = useDarkMode()
  const [scrollingContainerRef, setScrollingContainerRef] = useState<HTMLDivElement>(null)
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
            iconLeft={
              token ? (
                <Icon
                  src={token.logoURI ?? `img/crypto/${token.symbol}.svg`}
                  size={'sm'}
                />
              ) : null
            }
            iconRight={
              <Icon
                style={{
                  transform: `rotate(${isDropDownOpen ? '180deg' : '0deg'})`,
                  transition: 'transform 0.2s ease-in-out',
                }}
                src={`/img/assets/farm-chevron-${mode}.svg`}
                className={cn(!isDarkMode ? 'stroke-background-blue' : '')}
                size={'sm'}
              />
            }
          >
            {token ? token.symbol : 'Select Token'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={'mt-3.75 z-[1001] max-h-[200px] overflow-auto'}
          portal={true}
        >
          <ScrollingHydrateContainer
            ref={(ref) => setScrollingContainerRef(ref)}
            callback={() => {
              if (tokenList.length <= 0 && maxTokensReached) return;
              updateTokenList(page + 1, TOKEN_LIST_PAGE_SIZE).then(() =>
                setPage(page + 1)
              );
            }}
          >
            {tokenList.length > 0 ? (
              <WindowingContainer
                rootElement={scrollingContainerRef}
                items={tokenList}
                render={(item: JupToken) => (
                  <DropdownMenuItem
                    className={'group gap-2 cursor-pointer'}
                    onClick={() => setToken(item)}
                    key={`${item.symbol}`}
                  >
                    <Icon
                      src={item.logoURI ?? `img/crypto/${item.symbol}.svg`}
                      size={'sm'}
                    />
                    <span>{item.symbol}</span>
                  </DropdownMenuItem>
                )}
              />
            ) : (
              <DropdownMenuItem disabled={true}>
                No Tokens Found
              </DropdownMenuItem>
            )}
            {isLoadingTokenList ? (
              <DropdownMenuItem disabled={true}>LOADING</DropdownMenuItem>
            ) : null}
          </ScrollingHydrateContainer>
        </DropdownMenuContent>
      </DropdownMenu>
    </InputElementLeft>
  }
>
  <Input
    type="text"
    placeholder={`0.00 ${token ? token.symbol : ''}`}
    onChange={(e) => handleChange(e, true)}
    value={amountToken}
    className={'h-[45px] text-right'}
  />
</InputGroup>
}

export default Step2
