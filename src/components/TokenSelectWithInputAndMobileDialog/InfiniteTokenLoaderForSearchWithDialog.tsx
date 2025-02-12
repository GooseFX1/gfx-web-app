import React, { CSSProperties, useEffect, useRef } from 'react'
import { useWalletBalance } from '@/context/walletBalanceContext'
// eslint-disable-next-line max-len
import { TokenSelectProps } from '@/components/TokenSelectWithInputAndMobileDialog/TokenSearchWithMobileDialog'
import { bigNumberFormatter, clamp, loadIconImage, numberFormatter, truncateAddress } from '@/utils'
import InfiniteLoader from 'react-window-infinite-loader'
import { FixedSizeList } from 'react-window'
import { IconWithFallback } from '@/components/common/IconWithFallback'
import { Badge, Button, cn, Icon, Skeleton } from 'gfx-component-lib'
import BigNumber from 'bignumber.js'
import { TokenListToken, useDarkMode } from '@/context'

export type InfiniteTokenLoaderForSearchWithDialogProps = {
  page: number
  setPage: (page: number) => void
  tokenList: Array<TokenListToken>
  maxTokens: number
  isLoadingTokenList: boolean
} & TokenSelectProps

function InfiniteTokenLoaderForSearchWithDialog({
  token,
  onSelectToken,
  page,
  setPage,
  tokenList,
  maxTokens,
  isLoadingTokenList
}: InfiniteTokenLoaderForSearchWithDialogProps) {
  const hasMountedRef = useRef(false)
  const infiniteLoaderRef = useRef(null)

  const { mode } = useDarkMode()
  const { balance } = useWalletBalance()
  const tokenListLength = tokenList.length
  const maxTokensReached = tokenListLength >= maxTokens
  const itemCount = tokenList.length + (maxTokensReached ? 0 : 1)

  useEffect(() => {
    if (hasMountedRef.current) {
      if (infiniteLoaderRef.current) {
        infiniteLoaderRef.current.resetloadMoreItemsCache()
      }
    }
    hasMountedRef.current = true
  }, [tokenList, tokenList])
  const loadMoreItems = isLoadingTokenList
    ? () => {
        // empty func to prevent re-calls
      }
    : () => {
        if (isLoadingTokenList || maxTokensReached) return
        // triggers the update for the tokenListEndpoint
        setPage(page + 1)
      }
  const isItemLoaded = (index) => maxTokensReached || index < tokenListLength
  const Item = ({ index, style }: { index: number; style: CSSProperties }) => {
    if (!isItemLoaded(index) || isLoadingTokenList) {
      if (index > 0) return null
      return (
        <div style={style} className={`flex flex-col gap-2`}>
          <TokenListSkeleton />
          <TokenListSkeleton />
          <TokenListSkeleton />
          <TokenListSkeleton />
          <TokenListSkeleton />
          <TokenListSkeleton />
          <TokenListSkeleton />
        </div>
      )
    }

    const curToken = tokenList[index]
    // this className on RenderAs is cursed binding - it is the render but also gets propagated to the RenderAs function
    // if a Button is used e.g FarmContainer
    /* eslint-disable-next-line react/prop-types */
    const isCurrentTokenSelected = curToken != null && token != null && curToken.address === token.address
    return (
      <div style={style}>
        <Button
          className={cn(`cursor-pointer p-1.5 border-1 border-transparent flex 
                        hover:border-border-lightmode-secondary dark:hover:border-border-darkmode-secondary
                        text-start rounded-[3px] h-auto
                       hover:bg-background-lightmode-primary hover:dark:bg-background-darkmode-primary
                        `,
            isCurrentTokenSelected && `bg-background-lightmode-primary dark:bg-background-darkmode-primary
                                    border-border-lightmode-primary dark:border-border-darkmode-primary
            `
            )}
          fullWidth
          onClick={() => onSelectToken(curToken)}
          key={curToken?.address}
        >
          <div className={'flex w-full flex-1'}>
            <div className={`flex gap-2`}>
              <IconWithFallback
                className={`rounded-circle h-[24px] w-[24px] border my-auto
                                border-solid dark:border-black-4 border-grey-4`}
                src={loadIconImage(curToken?.logoURI, mode)}
              />
              <div>
                <p
                  className={`text-b2 font-bold 
                                  dark:text-text-darkmode-primary text-text-lightmode-primary`}
                >
                  {curToken?.symbol}
                </p>
                <span className={'inline-flex gap-1'}>
                  <span className={'inline-flex max-w-[118px] self-center'}>
                    <p
                      className={`text-b3 dark:text-text-darkmode-secondary 
                                      text-text-lightmode-secondary truncate font-semibold
                                      my-auto
                                `}
                    >
                      {curToken?.name}
                    </p>
                  </span>
                  <a
                    href={`https://solscan.io/account/${curToken?.address}`}
                    target="_blank"
                    rel="noreferrer"
                    className={'ml-auto'}
                  >
                    <Badge
                      variant="default"
                      size={'lg'}
                      className={'to-brand-secondaryGradient-secondary/50 gap-1 h-[18px]'}
                    >
                      <h6 className={''}>{truncateAddress(curToken?.address, 3)}</h6>
                      <Icon
                        src={`/img/assets/arrowcircle-${mode}.svg`}
                        className={'!h-[15px] !w-[15px] !min-h-[15px] !min-w-[15px]'}
                      />
                    </Badge>
                  </a>
                </span>
              </div>
            </div>
            <div className={'w-full ml-auto flex flex-col gap-1 items-end'}>
              <p
                className={`text-b2 font-bold dark:text-text-darkmode-primary 
                                text-text-lightmode-primary`}
              >
                {numberFormatter(balance[curToken?.address].tokenAmount.uiAmount)}
              </p>
              <p
                className={`text-b3 dark:text-text-darkmode-secondary text-text-lightmode-secondary 
                                truncate font-semibold
                                `}
              >
                $
                {bigNumberFormatter(
                  new BigNumber(
                    balance[curToken?.address].price != 0
                      ? balance[curToken?.address].value.toString()
                      : curToken?.price.toString()
                  )
                )}
              </p>
            </div>
          </div>
        </Button>
      </div>
    )
  }

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
      threshold={1}
      ref={infiniteLoaderRef}
    >
      {({ onItemsRendered, ref }) => (
        <FixedSizeList
          className={'mt-2 infinite-token-list'}
          itemCount={itemCount}
          onItemsRendered={onItemsRendered}
          ref={ref}
          height={clamp(tokenListLength * 58, isLoadingTokenList ? 58 * 5 : 0, 396)}
          itemSize={58}
        >
          {Item}
        </FixedSizeList>
      )}
    </InfiniteLoader>
  )
}

const TokenListSkeleton = () => (
  <div
    className={`
                cursor-wait p-1.5 border-1 border-transparent flex flex-row w-full gap-3 items-center
                        hover:border-border-lightmode-secondary dark:hover:border-border-darkmode-secondary`}
  >
    <Skeleton className={'w-[25px] h-[25px] rounded-full'} />
    <div className={'flex flex-col gap-1'}>
      <Skeleton className={`w-[56px] h-[20px] rounded-[2px]`} />
      <Skeleton className={`w-[88px] h-[18px] rounded-[2px]`} />
    </div>
    <div className={'flex flex-col gap-1 ml-auto'}>
      <Skeleton className={`w-[56px] h-[20px] rounded-[2px]`} />
      <Skeleton className={`w-[56px] h-[20px] rounded-[2px]`} />
    </div>
  </div>
)
export default InfiniteTokenLoaderForSearchWithDialog
