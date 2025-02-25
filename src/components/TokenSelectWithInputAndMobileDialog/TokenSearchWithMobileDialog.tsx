import React, { ChangeEventHandler } from 'react'
import { TokenListToken } from '@/context'
import {
  Input,
  InputElementLeft,
  InputGroup,
  Popover,
  PopoverAnchor,
  ShadInputProps
} from 'gfx-component-lib'
// eslint-disable-next-line max-len
import TokenSelectButtonWithSearchDialog, {
  TokenSelectButtonWithDialogCoreProps
} from '@/components/TokenSelectWithInputAndMobileDialog/TokenSelectButtonWithSearchDialog'
import useBoolean from '@/hooks/useBoolean'
import useBreakPoint from '@/hooks/useBreakPoint'

export type TokenSelectProps = {
  token?: TokenListToken
  onSelectToken: (token: TokenListToken) => void
}
export type TokenSelectWithInputAndMobileDialogProps = {
  tokenAmountValue: string
  onTokenAmountValueChange: ChangeEventHandler<HTMLInputElement>
  inputProps?: Omit<ShadInputProps, 'value' | 'onChange'>
  searchValue: string
  onSearchValueChange: (search: string) => void
} & TokenSelectButtonWithDialogCoreProps
const TokenSelectWrapper = ({
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
      <>
        {children}
      </>
    )
  }
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverAnchor>{children}</PopoverAnchor>
    </Popover>
  )
}

function TokenSelectWithInputAndMobileDialog({
  token,
  onSelectToken,
  tokenAmountValue,
  onTokenAmountValueChange,
  inputProps,
  searchValue,
  onSearchValueChange,
  loadNextPage,
  tokenList,
  maxTokens,
  isLoadingTokenList
}: TokenSelectWithInputAndMobileDialogProps) {
  const [isOpen, setIsOpen] = useBoolean(false)

  return (
    <TokenSelectWrapper isOpen={isOpen} setIsOpen={setIsOpen.set}>
      <InputGroup
        className={'h-[45px]'}
        leftItem={
          <InputElementLeft>
            <TokenSelectButtonWithSearchDialog
              token={token}
              onSelectToken={onSelectToken}
              searchValue={searchValue}
              onSearchValueChange={onSearchValueChange}
              loadNextPage={loadNextPage}
              tokenList={tokenList}
              maxTokens={maxTokens}
              isLoadingTokenList={isLoadingTokenList}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          </InputElementLeft>
        }
      >
        <Input
          className={'h-[45px] text-right w-full sm:w-[280px] '}
          value={tokenAmountValue}
          onChange={onTokenAmountValueChange}
          {...inputProps}
        />
      </InputGroup>
    </TokenSelectWrapper>
  )
}

export default TokenSelectWithInputAndMobileDialog
