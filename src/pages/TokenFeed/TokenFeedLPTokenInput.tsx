import React, { ChangeEvent, useState } from 'react'
import {
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  InputElementLeft,
  InputGroup
} from 'gfx-component-lib'
import { IconWithFallback } from '@/components/common/IconWithFallback'
import { loadIconImage } from '@/utils'
import SearchBar from '@/components/common/SearchBar'
import { InfiniteTokenListScrollView } from '@/pages/Swap/InfiniteTokenListSwap'
import useBoolean from '@/hooks/useBoolean'
import { useDarkMode } from '@/context'
import { useWalletBalance } from '@/context/walletBalanceContext'
import useTokensQuery from '@/queries/useTokensQuery'

function TokenFeedLpTokenInput({
  token,
  setToken,
  otherToken,
  amountToken,
  setAmountToken,
  onBlur,
  onChange,
  disableInput,
  isLocked,
  disableTokenDropDown = false
}: {
  token: any // TODO: Replace with actual token type
  otherToken?: any // TODO: Replace with actual token type
  setToken: (token: any) => void
  onBlur: (e: ChangeEvent<HTMLInputElement>) => void
  onChange: (value: ChangeEvent<HTMLInputElement>) => void
  amountToken: string
  setAmountToken: (value: string) => void
  disableInput?: boolean
  isLocked?: boolean
  disableTokenDropDown?: boolean
}) {
  const [isDropDownOpen, setIsDropdownOpen] = useBoolean(false)
  const { mode, isDarkMode } = useDarkMode()
  const { publicKey } = useWalletBalance()
  const [searchValue, setSearchValue] = useState('')
  const tokenListQuery = useTokensQuery({
    searchValue
  })
  const tokens = tokenListQuery.data?.allPages ?? []
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
                isLoading={tokenListQuery.isLoading}
                disabled={disableTokenDropDown}
              />
              {searchValue && tokens.length == 0 && !tokenListQuery.isLoading ? (
                <div className={'mb-auto p-2'}>No Tokens Found..</div>
              ) : null}
              <InfiniteTokenListScrollView
                useRenderListLength={searchValue.trim().length > 0}
                tokenRenderList={tokens}
                onTokenSelect={(token) => {
                  setToken(token)
                  setSearchValue('')
                  setAmountToken('')
                }}
                RenderAs={DropdownMenuItem}
                checkDisabled={(t) => t?.address == otherToken?.address || tokenListQuery.isLoading}
                maxTokensReached={false}
                isLoadingTokenList={false}
                loadNextPage={tokenListQuery.fetchNextPage}
                tokenList={tokenListQuery.data?.allPages}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </InputElementLeft>
      }
    >
      <Input
        type="text"
        placeholder={`0.00 ${token ? token?.symbol : ''}`}
        onChange={onChange}
        onBlur={onBlur}
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

export default TokenFeedLpTokenInput
