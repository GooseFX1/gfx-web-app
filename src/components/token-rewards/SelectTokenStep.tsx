import useBreakPoint from '@/hooks/useBreakPoint'
import { Connect } from '@/layouts'
import { useWallet } from '@solana/wallet-adapter-react'
import {
  DialogClose,
  DropdownMenuTrigger,
  DropdownMenu,
  InputElementLeft,
  InputGroup,
  Button,
  cn,
  DropdownMenuContent,
  Input,
  DropdownMenuItem,
  Icon
} from 'gfx-component-lib'
import SearchBar from '../common/SearchBar'
import useBoolean from '@/hooks/useBoolean'
import { useDarkMode } from '@/context'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { IconWithFallback } from '../common/IconWithFallback'
import { loadIconImage, numberFormatter } from '@/utils'
import { JupToken } from '@/pages/FarmV4/constants'
import { InfiniteTokenListScrollView } from '@/pages/Swap/InfiniteTokenListSwap'
import { useTokens } from '@/hooks/useTokens'

interface SelectTokenStepProps {
  setCurrentStep: (step: number) => void
  summary: React.ReactNode
  selectedToken: JupToken
  setSelectedToken: (t: JupToken) => void
  amountToken: string
  setAmountToken: (t: string) => void
  key: string
}

export const SelectTokenStep = ({
  setCurrentStep,
  summary,
  selectedToken,
  setSelectedToken,
  amountToken,
  setAmountToken
}: SelectTokenStepProps) => {
  const { isMobile } = useBreakPoint()
  const { connected } = useWallet()
  const { balance } = useWalletBalance()

  const handleChange = async (e) => {
    const inputNumber = e?.target?.value
    if (!e?.target?.value) {
      setAmountToken('')
    }
    if (!isNaN(+inputNumber)) {
      setAmountToken(inputNumber)
    }
  }

  return (
    <div className="grid grid-cols-5 gap-10 w-full">
      <div className={`p-6 flex flex-col ${isMobile ? 'col-span-5' : 'col-span-3'}`}>
        <div className="flex flex-row items-center justify-between gap-3 mb-2">
          <h1 className="text-lg font-semibold text-text-lightmode-primary dark:text-text-darkmode-primary">
            Select Token
          </h1>
          {isMobile && (
            <div className="flex flex-row items-center gap-3">
              <Icon
                src="/img/assets/question-icn.svg"
                alt="help"
                className="w-[30px] h-[30px] cursor-pointer"
                onClick={() => window.open('https://www.goosefx.io/gamma#faqs')}
              />
              <DialogClose>
                <Icon src="/img/assets/rewards_close.svg" alt="Close" className="w-4 h-4" />
              </DialogClose>
            </div>
          )}
        </div>

        <p className="text-sm text-text-lightmode-secondary dark:text-text-darkmode-secondary mb-6">
          Select the token and add the amount you will like to be distributed.
        </p>

        {connected ? (
          <>
            <div className="flex flex-row items-center gap-1 mb-2">
              <Icon src="/img/assets/wallet-lite-enabled.svg" alt="balance" className="w-5 h-5" />
              <p
                className={cn(
                  `text-b2 cursor-pointer text-text-lightmode-primary dark:text-text-darkmode-primary`,
                  balance[selectedToken?.address].tokenAmount.uiAmount == 0 &&
                    `cursor-not-allowed text-text-lightmode-tertiary dark:text-text-darkmode-tertiary`
                )}
                onClick={() => {
                  setAmountToken(balance[selectedToken?.address].tokenAmount.uiAmountString)
                }}
              >
                {numberFormatter(balance[selectedToken?.address].tokenAmount.uiAmount)} {selectedToken?.symbol}
              </p>
            </div>
            <TokenSelectInput
              token={selectedToken}
              setToken={setSelectedToken}
              handleChange={(e) => handleChange(e)}
              amountToken={amountToken}
              setAmountToken={setAmountToken}
            />
          </>
        ) : (
          <Connect containerStyle="w-max" />
        )}

        <div className="flex justify-between pt-8 mt-auto">
          <Button
            onClick={() => setCurrentStep(0)}
            className="px-4 py-2 text-text-lightmode-primary dark:text-text-darkmode-primary"
          >
            Back
          </Button>
          {selectedToken && (
            <Button
              className="px-4 py-2 cursor-pointer"
              colorScheme={'blue'}
              variant={'secondary'}
              onClick={() => setCurrentStep(3)}
            >
              Next
            </Button>
          )}
        </div>
      </div>

      {!isMobile && (
        <div className="py-6 px-10 flex flex-col items-center col-span-2 bg-grey-5 dark:bg-black-1">
          <DialogClose>
            <Icon src="/img/assets/rewards_close.svg" alt="Close" className="w-4 h-4 absolute right-5 top-5" />
          </DialogClose>
          {summary}
        </div>
      )}
    </div>
  )
}

function TokenSelectInput({
  token,
  setToken,
  handleChange,
  amountToken,
  disableInput,
  disableTokenDropDown,
  isLocked
}: {
  token: JupToken | null
  setToken: (token: JupToken) => void
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>, isTokenA: boolean) => void
  amountToken: string
  setAmountToken: (token: string) => void
  disableInput?: boolean
  disableTokenDropDown?: boolean
  isLocked?: boolean
}) {
  const [isDropDownOpen, setIsDropdownOpen] = useBoolean(false)
  const { isDarkMode, mode } = useDarkMode()
  const {
    searchValue,
    setSearchValue,
    isLoadingTokenList,
    tokens,
    topBalancesWithTokenList,
    maxTokensReached,
    tokenPage,
    setTokenPage
  } = useTokens({
    searchValue: ''
  })

  const { publicKey } = useWalletBalance()
  const tokenRenderList: JupToken[] = searchValue.length > 0 || !publicKey ? tokens : topBalancesWithTokenList

  return (
    <InputGroup
      leftItem={
        <InputElementLeft>
          <DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropdownOpen.set}>
            <DropdownMenuTrigger asChild className={'focus-visible:outline-none'} disabled={disableTokenDropDown}>
              <Button
                colorScheme={'secondaryGradient'}
                variant={'outline'}
                className="min-w-[115px] h-[35px] rounded-full flex flex-row justify-between z-10"
                iconLeft={
                  token ? (
                    <IconWithFallback
                      src={loadIconImage(token?.logoURI, mode)}
                      size={'sm'}
                      className={'rounded-circle'}
                    />
                  ) : null
                }
                iconRight={
                  <IconWithFallback
                    style={{
                      transform: `rotate(${isDropDownOpen ? '180deg' : '0deg'})`,
                      transition: 'transform 0.2s ease-in-out'
                    }}
                    src={`/img/assets/farm-chevron-${mode}.svg`}
                    className={cn(!isDarkMode ? 'stroke-background-blue' : '')}
                    size={'sm'}
                  />
                }
                disabled={disableTokenDropDown}
              >
                {token ? token?.symbol : 'Select Token'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={cn(
                `flex flex-col mt-1 z-[1001] h-auto max-h-[396px] w-[464px] max-sm:w-[338px] relative pb-0`,
                !publicKey && !searchValue.trim().length && 'pb-2'
              )}
              portal={true}
              align={'start'}
            >
              <SearchBar
                groupClassName={'sticky'}
                placeholder={'Search by token name symbol or address'}
                value={searchValue}
                onKeyDown={(e) => e.stopPropagation()}
                onChange={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setSearchValue(e.target.value)
                }}
                onClear={() => setSearchValue('')}
                isLoading={isLoadingTokenList}
                disabled={disableTokenDropDown}
              />
              {searchValue && tokenRenderList.length == 0 && !isLoadingTokenList ? (
                <div className={'mb-auto p-2'}>No Tokens Found.</div>
              ) : null}
              <InfiniteTokenListScrollView
                useRenderListLength={searchValue.trim().length > 0}
                tokenRenderList={tokenRenderList}
                onTokenSelect={(token) => {
                  setToken(token)
                  setSearchValue('')
                }}
                RenderAs={DropdownMenuItem}
                checkDisabled={() => isLoadingTokenList}
                maxTokensReached={maxTokensReached}
                isLoadingTokenList={isLoadingTokenList}
                setTokenPage={setTokenPage}
                tokenPage={tokenPage}
                tokenList={tokens}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </InputElementLeft>
      }
    >
      <Input
        type="text"
        placeholder={`0.00 ${token ? token?.symbol : ''}`}
        onChange={(e) => handleChange(e, true)}
        value={amountToken}
        className={cn(
          'h-[45px] text-right',
          disableInput &&
            isLocked &&
            'disabled:text-text-lightmode-secondary disabled:dark:text-text-darkmode-secondary'
        )}
        disabled={disableInput}
      />
    </InputGroup>
  )
}
