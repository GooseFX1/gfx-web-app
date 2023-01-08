import React, { Dispatch, FC, SetStateAction, useEffect, useState, useMemo } from 'react'
import { Input, Image } from 'antd'
import styled from 'styled-components'
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry'
import { Modal } from '../../components'
import { ISwapToken, useTokenRegistry, useDarkMode, useConnectionConfig, useSwap } from '../../context'
import { CenteredDiv, CenteredImg, SpaceBetweenDiv, SVGToWhite } from '../../styles'
import { POPULAR_TOKENS } from '../../constants'
import { checkMobile } from '../../utils'
import { Connection } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { TOKEN_PROGRAM_ID } from '../../web3'

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

interface NewTokenInfo extends TokenInfo {
  imageURL?: string
  tokenBalance?: number
}

export const Selector: FC<{
  height: string
  otherToken: ISwapToken | null
  setToken: Dispatch<SetStateAction<ISwapToken | null>>
  token: ISwapToken | null
  balance?: number
  connection?: Connection
}> = ({ height, otherToken, setToken, token, connection }) => {
  const { mode } = useDarkMode()
  const { tokens } = useTokenRegistry()
  const { tokenA, tokenB, CoinGeckoClient, coingeckoTokens } = useSwap() //CoinGeckoClient
  const { chainId } = useConnectionConfig()
  const { publicKey } = useWallet()
  const [filterKeywords, setFilterKeywords] = useState<string>('')
  const [visible, setVisible] = useState<boolean>(false)
  const r = new RegExp(filterKeywords, 'i')
  const [updatedTokens, setUpdatedTokens] = useState<NewTokenInfo[]>(
    tokens.map((tk) => ({
      ...tk,
      imageURL: `/img/crypto/${tk.symbol}.svg`
    }))
  )
  const popularTokens = useMemo(
    () => updatedTokens.filter((i) => POPULAR_TOKENS.includes(i.symbol)),
    [updatedTokens]
  )
  const [filteredTokens, setFilteredTokens] = useState<NewTokenInfo[]>(updatedTokens)

  useEffect(() => {
    ;(async function () {
      let newTokens: NewTokenInfo[] = [...tokens]
      if (!checkMobile()) {
        newTokens = await getTokenAccounts(publicKey?.toBase58(), newTokens)
      }

      setUpdatedTokens(
        newTokens.map((tk) => ({
          ...tk,
          imageURL: `/img/crypto/${tk.symbol}.svg`,
          tokenBalance: tk?.tokenBalance || 0
        }))
      )
    })()
  }, [publicKey, tokens])

  async function getTokenAccounts(wallet: string, tokens: NewTokenInfo[]) {
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
    let accounts = await connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, { filters: filters })
    accounts = accounts.filter((account) => {
      const parsedAccountInfo: any = account.account.data
      const tokenBalance: number = parsedAccountInfo['parsed']['info']['tokenAmount']['uiAmount']
      return tokenBalance > 0
    })
    accounts.forEach((account) => {
      //Parse the account data
      const parsedAccountInfo: any = account.account.data
      const mintAddress: string = parsedAccountInfo['parsed']['info']['mint']
      const tokenBalance: number = parsedAccountInfo['parsed']['info']['tokenAmount']['uiAmount']
      const token = tokens[tokens.findIndex((el) => el.address === mintAddress)]
      if (token) {
        token.tokenBalance = tokenBalance
        tokens[tokens.findIndex((el) => el.address === mintAddress)] = token
      }
    })

    return tokens
  }

  useEffect(() => {
    const tokenList = [...updatedTokens]

    async function addAndFilterTokens() {
      if (tokenList.length < 1 && tokenA && tokenB) {
        const chainList = (await new TokenListProvider().resolve()).filterByChainId(chainId).getList()
        const filteredTokensListAlt = chainList.filter(({ address }) => filterKeywords === address)

        if (filteredTokensListAlt.length > 0) {
          tokenList.push({
            ...filteredTokensListAlt?.[0],
            imageURL: `/img/crypto/${filteredTokensListAlt?.[0].symbol}.svg`
          })
        }
      }

      const filteredTokensList = tokenList
        .filter(
          ({ address, name, symbol }) =>
            (r.test(name.split('(')[0]) || r.test(symbol) || filterKeywords === address) &&
            //the split by "(" is to remove every string in name of token with (Portal) or (Sollet) or any other.
            otherToken?.address !== address
        )
        .sort((a, b) => {
          const fa = a.symbol.toLowerCase(),
            fb = b.symbol.toLowerCase()

          if (fa < fb) {
            return -1
          }
          if (fa > fb) {
            return 1
          }
          return 0
        })
        .sort((a, b) => b?.tokenBalance - a?.tokenBalance)
      setFilteredTokens(filteredTokensList)

      if (filterKeywords.length > 1) {
        //allow at least two inputs to allow less tokens being mapped and decrease load time for popular tokens
        const popularityFilteredTokensList = (
          await Promise.all(
            filteredTokensList.map(async (tk) => {
              const token = coingeckoTokens.find((i) => i.symbol.toLowerCase() === tk.symbol.toLowerCase())
              try {
                if (!token) return { ...tk, vol: 0 }
                const data = await CoinGeckoClient.coins.fetch(token?.id || null, {})
                const res = Math.floor(data?.data?.market_data?.total_volume?.usd || 0)
                return { ...tk, vol: !isNaN(res) ? res : 0 }
              } catch {
                return { ...tk, vol: 0 }
              }
            })
          )
        ).sort((a, b) => b.vol - a.vol)
        setFilteredTokens(popularityFilteredTokensList)
      }
    }

    addAndFilterTokens() //(O)3n to (O)2n in time complexity (due to two loops, one filter and one sort)
  }, [filterKeywords, updatedTokens, tokenA, tokenB, chainId])

  return (
    <>
      <SELECTOR_MODAL setVisible={setVisible} visible={visible} style={{ paddingTop: '18px' }}>
        <INPUT>
          <Input
            onChange={(x: any) => setFilterKeywords(x.target.value)}
            placeholder="Search name or paste address"
            value={filterKeywords}
          />
          <MAGNIFYING_GLASS>
            {filterKeywords.length > 0 ? (
              <strong onClick={() => setFilterKeywords('')} style={{ cursor: 'pointer' }}>
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
          <POPULAR>
            {popularTokens.map(({ address, decimals, name, symbol, imageURL, logoURI }, index) => (
              <POPULAR_TK
                key={index}
                onClick={async () => {
                  setToken({ address, decimals, symbol, name, logoURI })
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
            ))}
          </POPULAR>
        </div>
        <GFX_HR />
        <BODY>
          {filteredTokens.map(({ address, decimals, name, symbol, imageURL, logoURI, tokenBalance }, index) => (
            <TOKEN
              key={index}
              onClick={async () => {
                setToken({ address, decimals, symbol, name, logoURI })
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
          ))}
        </BODY>
      </SELECTOR_MODAL>
      <SELECTOR $height={height} onClick={() => setVisible(true)}>
        <SpaceBetweenDiv className={'selector-inner'}>
          <div className={'icon-left'}>
            {token ? (
              <Image
                draggable={false}
                preview={false}
                src={`/img/crypto/${token.symbol}.svg`}
                fallback={token.logoURI || '/img/crypto/Unknown.svg'}
                alt="token"
              />
            ) : (
              <></>
            )}
          </div>
          <strong className={'text-primary'}>{token && token.symbol}</strong>

          <SVGToWhite src={`/img/assets/arrow.svg`} alt="arrow" className={'icon-right'} />
        </SpaceBetweenDiv>
      </SELECTOR>
    </>
  )
}
