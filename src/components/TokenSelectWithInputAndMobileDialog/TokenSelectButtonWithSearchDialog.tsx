/* eslint-disable */
import React, { useCallback, useEffect, useState } from 'react'
// eslint-disable-next-line max-len
import { TokenSelectProps } from '@/components/TokenSelectWithInputAndMobileDialog/TokenSearchWithMobileDialog'
import {
  Button,
  cn,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
  Icon,
  PopoverContent,
  PopoverTrigger, Skeleton
} from 'gfx-component-lib'
import { loadIconImage } from '@/utils'
import { TokenListToken, useDarkMode } from '@/context'
import SearchBar from '@/components/common/SearchBar'
import InfiniteTokenLoaderForSearchWithDialog, {
  InfiniteTokenLoaderForSearchWithDialogProps
} from '@/components/TokenSelectWithInputAndMobileDialog/InfiniteTokenLoaderForSearchWithDialog'
import useBoolean, { UseBooleanSetter } from '@/hooks/useBoolean'
import useBreakPoint from '@/hooks/useBreakPoint'
import { fetchTokensByPublicKey } from '@/api/gamma'
import { POPULAR_TOKENS } from '@/pages/FarmV4/constants'
import { IconWithFallback } from '@/components/common/IconWithFallback'

export type TokenSelectButtonWithDialogCoreProps = {
  onSearchValueChange: (search: string) => void
  searchValue: string
} & InfiniteTokenLoaderForSearchWithDialogProps

// eslint-disable-next-line max-len
type TokenSelectButtonWithDialogProps = TokenSelectProps &
  TokenSelectButtonWithDialogCoreProps & {
    setIsOpen: UseBooleanSetter
    isOpen: boolean
  }
const SearchTrigger = ({ children }: { children: React.ReactNode }) => {
  const { isMobile } = useBreakPoint()
  if (isMobile) {
    return <DialogTrigger>{children}</DialogTrigger>
  }
  return <PopoverTrigger>{children}</PopoverTrigger>
}
const SearchContent = ({
  searchBar,
  infiniteTokenLoader,
  setToken,
  setIsOpen,
  token,
  isLoadingTokenList,
  tokenListLength
}: {
  searchBar: React.ReactNode
  infiniteTokenLoader: React.ReactNode
  setToken: (token: TokenListToken) => void
  setIsOpen: (isOpen: boolean) => void
  token?: TokenListToken
  isLoadingTokenList: boolean
  tokenListLength: number
}) => {
  const { mode } = useDarkMode()
  const { isMobile } = useBreakPoint()
  const [loadingPopularTokens, setLoadingPopularTokens] = useBoolean(false)
  const [popularTokens, setPopularTokens] = useState<TokenListToken[]>([])
  useEffect(() => {
    if (!isMobile) return
    setLoadingPopularTokens.on()
    fetchTokensByPublicKey([...POPULAR_TOKENS].join(','))
      .then((res) => {
        if (res.success) {
          setPopularTokens(res.data.tokens)
        }
      })
      .finally(() => setLoadingPopularTokens.off())
  }, [isMobile])
  if (isMobile) {
    try {
      return (
        <DialogPortal>
          <DialogOverlay />
          <DialogContent
            className={`flex flex-col gap-0 h-[370px] max-h-screen max-w-[100dvw] p-0 pt-3 border-1 border-solid border-border-lightmode-secondary
           dark:border-border-darkmode-secondary `} placement={'bottom'}>
            <DialogHeader className={`flex-row px-2.5 pb-2.5 border-b-1 border-solid border-border-lightmode-secondary
           dark:border-border-darkmode-secondary max-w-[100dvw] h-max`}>
              {searchBar}
              <DialogClose className={'inline-flex justify-items-start'}>
                <Icon src={`/img/assets/close-${mode}.svg`} size={'xs'} />
              </DialogClose>
            </DialogHeader>
            <DialogBody className={'flex flex-col px-2.5'}>
              <div
                className={cn(
                  `flex flex-col overflow-auto border-b-1 border-solid dark:border-black-4 border-grey-4 h-max`,
                )}
              >
                <h5
                  className={`my-2 dark:text-text-darkmode-secondary 
                                        text-text-lightmode-secondary`}
                >
                  Popular
                </h5>
                <div className={'flex flex-row gap-3 overflow-scroll'}>
                  {loadingPopularTokens ? (
                    <>
                      <Skeleton className={'h-[35px] w-[80px]'} />
                      <Skeleton className={'h-[35px] w-[80px]'} />
                      <Skeleton className={'h-[35px] w-[80px]'} />
                      <Skeleton className={'h-[35px] w-[80px]'} />
                    </>
                  ) : (
                    popularTokens.map((popularToken) => (
                      <Button
                        className={`border-solid dark:border-black-4 border-grey-4 border 
                          cursor-pointer p-1 flex rounded-[4px] min-w-[80px] md:min-w-[60px] grow shrink`}
                        key={popularToken?.address}
                        onClick={() => {
                          setToken(popularToken)
                          setIsOpen(false)
                        }}
                        disabled={token?.address == popularToken?.address || isLoadingTokenList}
                        iconLeft={
                          <IconWithFallback
                            src={loadIconImage(popularToken?.logoURI, mode)}
                            size={'sm'}
                            className={'rounded-circle'}
                          />
                        }
                      >
                      <span
                        className={`font-bold dark:text-text-darkmode-secondary 
                                        text-text-lightmode-secondary`}
                      >
                        {popularToken?.symbol}
                      </span>
                      </Button>
                    ))
                  )}
                </div>
              </div>
              {tokenListLength === 0 && !isLoadingTokenList && (
                <p
                  className={`text-center text-b3 text-text-lightmode-secondary dark:text-text-darkmode-secondary`}
                >
                  No tokens found
                </p>
              )}
              {infiniteTokenLoader}
            </DialogBody>
          </DialogContent>
        </DialogPortal>
      )
    } catch(e) {
     return <></>
    }
  }
  return (
    <PopoverContent
      className={cn(`sm:w-[280px] p-2 gap-2 max-h-[243px]`)}
      align={'start'}
      side={'bottom'}
      avoidCollisions={false}
    >
      {searchBar}
      {infiniteTokenLoader}
    </PopoverContent>
  )
}
const DialogWrapper = ({
  isOpen,
  setIsOpen,
  children
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  children: React.ReactNode
}) => {
  const { isMobile } = useBreakPoint()

  if (isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogOverlay />
        {children}
      </Dialog>
    )
  }
  return <>{children}</>
}

/**
 * @deprecated part of TokenSearchWithMobileDialog
 */
function TokenSelectButtonWithSearchDialog({
  token,
  onSelectToken,
  searchValue,
  onSearchValueChange,
  setIsOpen,
  isOpen,
  ...rest
}: TokenSelectButtonWithDialogProps) {
  const { mode } = useDarkMode()
  const clearSearch = useCallback(() => onSearchValueChange(''), [onSearchValueChange])
  return (
    <DialogWrapper isOpen={isOpen} setIsOpen={setIsOpen.set}>
      <SearchTrigger>
        <Button
          variant={'outline'}
          colorScheme={'secondaryGradient'}
          onClick={setIsOpen.toggle}
          iconLeft={token ? <Icon size={'sm'} src={loadIconImage(token.logoURI, mode)} /> : null}
          iconRight={
            <Icon
              className={cn(`transform rotate-180 animate ease-in-out duration-300`, isOpen && 'rotate-0')}
              src={`/img/mainnav/connect-chevron-${mode}.svg`}
              size={'sm'}
            />
          }
        >
          {token ? token.symbol : 'Select or search'}
        </Button>
      </SearchTrigger>
      <SearchContent
        isLoadingTokenList={rest.isLoadingTokenList}
        setToken={onSelectToken}
        setIsOpen={setIsOpen.set}
        token={token}
        searchBar={
          <SearchBar
            value={searchValue}
            onClear={clearSearch}
            placeholder={'Search by token symbol'}
            onChange={(e) => onSearchValueChange(e.target.value)}
            className={'max-w-[320px]'}
          />
        }
        infiniteTokenLoader={
          <InfiniteTokenLoaderForSearchWithDialog token={token} onSelectToken={(t)=>{
            onSelectToken(t)
            setIsOpen.off()
          }} {...rest} />
        }
        tokenListLength={rest.tokenList.length}
      />
    </DialogWrapper>
  )
}

export default TokenSelectButtonWithSearchDialog
