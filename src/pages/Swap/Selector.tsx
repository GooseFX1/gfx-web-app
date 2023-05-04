import React, { FC, useEffect, useState, useMemo, useCallback, SyntheticEvent, useRef } from 'react'
import { Input, Image } from 'antd'
import styled from 'styled-components'
import { TokenInfo } from '@solana/spl-token-registry'
import { Modal } from '../../components'
import { useTokenRegistry, useDarkMode, useConnectionConfig, useSwap } from '../../context'
import { CenteredDiv, CenteredImg, SpaceBetweenDiv, SVGToWhite } from '../../styles'
import { POPULAR_TOKENS } from '../../constants'
import { aborter, checkMobile } from '../../utils'
import { useWallet } from '@solana/wallet-adapter-react'
import { TOKEN_PROGRAM_ID } from '../../web3'
import 'styled-components/macro'
import tw from 'twin.macro'

const BODY = styled.div`
  ${tw`h-[300px] sm:h-[268px]`}
  margin: 0 -${({ theme }) => theme.margin(3)};
  overflow-y: auto;
`

const SELECTOR_MODAL = styled(Modal)`
  ${tw`top-[-24px]! w-[628px]! sm:w-full!`}
  background-color: ${({ theme }) => theme.bg20} !important;
`

const SELECTOR = styled(CenteredDiv)<{ $height: string }>`
  ${tw`absolute top-[7px] left-[7px] h-[42px] w-[188px] rounded-circle cursor-pointer z-[1] sm:w-[142px]`}

  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  background-color: ${({ theme }) => theme.bg21};

  .selector-inner {
    ${tw`relative h-full w-full p-[8px]`}
    color: ${({ theme }) => theme.white};

    .text-primary {
      ${tw`sm:w-[50px] sm:text-[15px]`}
      ${({ theme }) => theme.ellipse}
    }

    .icon-left img {
      ${tw`h-[30px] w-[30px] overflow-hidden`}
      ${({ theme }) => theme.roundedBorders}
    }
    .icon-right {
      ${tw`mr-[4px]`}
    }
  }
`

const INPUT = styled.div`
  ${tw`relative w-[528px] sm:w-[290px]`}

  input {
    height: ${({ theme }) => theme.margin(5)};
    background-color: ${({ theme }) => theme.bg2};
    font-size: 15px;
    font-weight: 500;
    text-align: left;
    color: ${({ theme }) => theme.text11};
    border-radius: 45px;
    border-color: transparent;

    &::placeholder {
      color: ${({ theme }) => theme.text17};
    }
  }
`

const MAGNIFYING_GLASS = styled(CenteredImg)`
  position: absolute;
  top: 12px;
  right: 12px;
  height: 16px;
  width: auto;

  strong {
    color: ${({ theme }) => theme.text11};
  }
`

const POP_TEXT = styled.p`
  color: ${({ theme }) => theme.text11};
  font-size: 18px;
  font-weight: 600;
  margin: 0.35rem;
`

const GFX_HR = styled.hr`
  display: block;
  height: 1px;
  width: calc(100% + ${({ theme }) => theme.margin(3)} * 2);
  margin: 16px -24px 0;
  background-color: ${({ theme }) => theme.tokenBorder};
  border: none;
`

const TOKEN = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: ${({ theme }) => theme.margin(1)} ${({ theme }) => theme.margin(3)};
  cursor: pointer;
  position: relative;

  &:hover {
    background-color: ${({ theme }) => theme.bg9};
  }

  > div:last-child {
    ${({ theme }) => theme.flexColumnNoWrap}

    span:first-child {
      font-weight: 600;
    }

    span:last-child {
      font-size: 12px;
    }
  }
`

const POPULAR = styled.div`
  ${tw`flex justify-center p-0 sm:flex-wrap sm:justify-start`}
`

const POPULAR_TK = styled(TOKEN)`
  ${tw`flex justify-between h-[40px] w-auto ml-[12px] sm:m-[4px]`}
  border-radius: 20px;
  border: ${({ theme }) => '1.5px solid ' + theme.tokenBorder};
  background-color: ${({ theme }) => theme.bg2};
  padding: 0 16px 0 4px;

  img {
    ${tw`h-[30px] w-[30px] mr-[8px]`}
  }

  strong {
    color: ${({ theme }) => theme.text11};
    font-size: 15px;
    line-height: 18px;
  }

  &:first-child {
    margin-left: 0;
  }
`

const TOKEN_ICON = styled(CenteredImg)`
  ${tw`h-[40px] w-[40px] mr-[18px] rounded-circle`}
  overflow: hidden;
`

const TOKEN_INFO = styled.div`
  font-size: 18px;
  color: ${({ theme }) => theme.text11};
  font-weight: 600;
`

const DESK_TOKEN_INFO = styled(TOKEN_INFO)`
  display: flex;
  align-items: center;
  flex-direction: row !important;

  .token-name {
    color: ${({ theme }) => theme.text20};
    margin-left: 0.25rem;
  }
  .token-balance {
    color: ${({ theme }) => theme.text20};
    position: absolute;
    right: 1rem;
  }
`
const STRONG_CENTERED_TEXT = styled.strong`
  ${tw`text-2xl mx-auto mt-4 font-bold`}
`
const FLEX = styled.div`
  ${tw`flex flex-col`}
`
interface NewTokenInfo extends TokenInfo {
  imageURL?: string
  tokenBalance?: number
}

export const Selector: FC<{
  height: string
  balance?: number
  isReverse?: boolean
}> = ({ height, isReverse = false }) => {
  const { mode } = useDarkMode()
  const { tokens, tokenMap } = useTokenRegistry()
  const { tokenA: tA, tokenB: tB, CoinGeckoClient, coingeckoTokenMap, setTokenA: sTA, setTokenB: sTB } = useSwap()
  const { connection } = useConnectionConfig()
  const { wallet } = useWallet()
  const [filterKeywords, setFilterKeywords] = useState<string>('')
  const [visible, setVisible] = useState<boolean>(false)
  const [filteredTokens, setFilteredTokens] = useState<React.ReactNode[]>([])
  const timeoutRef = useRef<NodeJS.Timeout>(null)

  // as Selector is reused for both tokenA and tokenB, we need to reverse the tokenA and tokenB when isReverse is true
  const { tokenA, tokenB, setTokenA, setTokenB } = useMemo(() => {
    if (isReverse) {
      return { tokenA: tB, tokenB: tA, setTokenA: sTB, setTokenB: sTA }
    }
    return { tokenA: tA, tokenB: tB, setTokenA: sTA, setTokenB: sTB }
  }, [tA, tB, sTA, sTB, isReverse])
  const publicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet])
  const popularTokens = useMemo(() => tokens.filter((i) => POPULAR_TOKENS.has(i.address)), [tokens])

  const getTokenAccounts = useCallback(
    async (wallet: string, tokens: NewTokenInfo[]) => {
      try {
        if (!wallet) return tokens
        const filters = [
          {
            dataSize: 165 //size of account (bytes)
          },
          {
            memcmp: {
              offset: 32, //location of our query in the account (bytes)
              bytes: wallet //our search criteria, a base58 encoded string
            }
          }
        ]
        const resultingAccounts = await connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, { filters: filters })

        for (let i = 0; i < resultingAccounts.length; i++) {
          const account = resultingAccounts[i]
          const parsedAccountInfo: any = account.account.data
          const tokenBalance: number = parsedAccountInfo['parsed']['info']['tokenAmount']['uiAmount']
          if (tokenBalance <= 0) {
            continue
          }
          const mintAddress: string = parsedAccountInfo['parsed']['info']['mint']
          const token = tokenMap.get(mintAddress)
          if (token) {
            token.tokenBalance = tokenBalance
            tokens[tokens.findIndex((el) => el.address === mintAddress)] = token
          }
        }

        return tokens
      } catch {
        return tokens
      }
    },
    [connection, tokens]
  )

  useEffect(() => {
    const process = async () => {
      const r = new RegExp(filterKeywords.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i')

      if (tokens.length == 0) {
        setFilteredTokens([])
      }
      let newTokens = tokens
      if (!checkMobile()) {
        newTokens = await getTokenAccounts(publicKey?.toBase58(), tokens)
      }

      // compiles a subset of tokens based on filter criteria
      const newFilteredTokens = []

      for (let i = 0; i < newTokens.length; i++) {
        const token = newTokens[i]
        if (r.test(token.name.split('(')[0]) || r.test(token.symbol) || filterKeywords === token.address) {
          if (filterKeywords.trim().length > 0) {
            const cgToken = coingeckoTokenMap.get(token.symbol)
            if (!cgToken) {
              newFilteredTokens.push(token)
              continue
            }
            // potentially introduce Promise.all for this and keep track of indeces if needed in specific order
            await CoinGeckoClient.coins
              .fetch(cgToken.id, { signal: aborter.addSignal(`selector-useEffect-${cgToken.id}`) })
              .then((res) => {
                const result = Math.floor(res?.data?.market_data?.total_volume?.usd || 0)
                newFilteredTokens.push({ ...token, vol: !isNaN(result) ? result : 0 })
              })
              .catch((err) => {
                console.error('COULD NOT FETCH COINGECKO DATA', err)
                newFilteredTokens.push({ ...token, vol: 0 })
              })
            continue
          }
          newFilteredTokens.push(token)
        }
      }
      // if there is a better way to do this please do it ;)
      setFilteredTokens(
        newFilteredTokens
          .sort((a, b) => {
            const symbol = a.symbol.toLowerCase().localeCompare(b.symbol.toLowerCase())
            const tokenBalance = (b.tokenBalance || 0) - (a.tokenBalance || 0)
            const vol = (b.vol || 0) - (a.vol || 0)
            return symbol || tokenBalance || vol
          })
          .map(({ address, decimals, name, symbol, imageURL, logoURI, tokenBalance }) => (
            <TOKEN
              key={address}
              onClick={async () => {
                if (tokenB.address === address) {
                  setTokenB(tokenA)
                }
                setTokenA({ address, decimals, symbol, name, logoURI })
                setVisible(false)
              }}
            >
              <TOKEN_ICON>
                <Image draggable={false} preview={false} src={imageURL} fallback={logoURI} alt="token" />
              </TOKEN_ICON>
              {checkMobile() ? (
                <TOKEN_INFO>
                  <span>{symbol}</span>
                  <span>{name}</span>
                </TOKEN_INFO>
              ) : (
                <DESK_TOKEN_INFO>
                  <strong>{symbol}</strong>
                  <strong className="token-name"> ({name.replaceAll('(', '').replaceAll(')', '')})</strong>
                  {tokenBalance > 0 && <strong className="token-balance"> {tokenBalance}</strong>}
                </DESK_TOKEN_INFO>
              )}
            </TOKEN>
          ))
      )
    }
    // debounced search helps with performance on large token sets
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current)
    }
    //instant clearing
    if (filterKeywords.trim().length == 0) {
      process()
    } else {
      timeoutRef.current = setTimeout(() => {
        process()
      }, 333)
    }
    return () => {
      aborter.abortBulkWithPrefix('selector-useEffect')
    }
  }, [filterKeywords, tokens, tokenA, tokenB, publicKey])
  const handleSearch = useCallback((e: SyntheticEvent) => {
    setFilterKeywords((e.target as HTMLInputElement).value)
  }, [])
  const clearFilter = useCallback(() => {
    setFilterKeywords('')
  }, [])
  const popularTokenItems = useMemo(
    () =>
      popularTokens.map(({ address, decimals, name, symbol, imageURL, logoURI }, index) => (
        <POPULAR_TK
          key={index}
          onClick={async () => {
            if (tokenB.address === address) {
              setTokenB(tokenA)
            }
            setTokenA({ address, decimals, symbol, name, logoURI })
            setVisible(false)
          }}
        >
          <div>
            <img
              src={imageURL || logoURI}
              alt="token-icon"
              onError={(e) => {
                e.currentTarget.onerror = null
                if (e.currentTarget.src === logoURI) {
                  e.currentTarget.src = '/img/crypto/Unknown.svg'
                } else {
                  e.currentTarget.src = logoURI || '/img/crypto/Unknown.svg'
                }
              }}
            />
          </div>

          <strong>{symbol}</strong>
        </POPULAR_TK>
      )),
    []
  )
  return (
    <>
      <SELECTOR_MODAL setVisible={setVisible} visible={visible} style={{ paddingTop: '18px' }}>
        <INPUT>
          <Input onChange={handleSearch} placeholder="Search name or paste address" value={filterKeywords} />
          <MAGNIFYING_GLASS>
            {filterKeywords.length > 0 ? (
              <strong onClick={clearFilter} style={{ cursor: 'pointer' }}>
                Cancel
              </strong>
            ) : mode === 'dark' ? (
              <SVGToWhite src={`/img/assets/magnifying_glass.svg`} alt="token-search-icon" />
            ) : (
              <img src={`/img/assets/magnifying_glass.svg`} alt="token-search-icon" />
            )}
          </MAGNIFYING_GLASS>
        </INPUT>
        <div>
          <POP_TEXT>Most Popular</POP_TEXT>
          <POPULAR>{popularTokenItems}</POPULAR>
        </div>
        <GFX_HR />
        <BODY>
          {filteredTokens.length == 0 ? (
            <FLEX>
              <STRONG_CENTERED_TEXT>No matching tokens found..</STRONG_CENTERED_TEXT>
            </FLEX>
          ) : (
            filteredTokens
          )}
        </BODY>
      </SELECTOR_MODAL>
      <SELECTOR $height={height} onClick={() => setVisible(true)}>
        <SpaceBetweenDiv className={'selector-inner'}>
          <div className={'icon-left'}>
            {tokenA ? (
              <Image
                draggable={false}
                preview={false}
                src={`/img/crypto/${tokenA.symbol}.svg`}
                fallback={tokenA.logoURI || '/img/crypto/Unknown.svg'}
                alt="token"
              />
            ) : (
              <></>
            )}
          </div>
          <strong className={'text-primary'}>{tokenA && tokenA.symbol}</strong>

          <SVGToWhite src={`/img/assets/arrow.svg`} alt="arrow" className={'icon-right'} />
        </SpaceBetweenDiv>
      </SELECTOR>
    </>
  )
}
